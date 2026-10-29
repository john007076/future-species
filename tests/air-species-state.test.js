import test from 'node:test';
import assert from 'node:assert/strict';
import {AIR_SCREEN_IDS,AIR_DEFAULTS,createAirSpeciesState} from '../src/air-species-state.js';

function run(sim,seconds,fps=60){for(let i=0;i<Math.round(seconds*fps);i++)sim.step(1/fps);}

test('AIR owns only the four assigned screens and excludes the camera',()=>{
 assert.deepEqual(AIR_SCREEN_IDS,['screen.upper_left','screen.portrait_left','screen.left.02','screen.left.03']);
 assert.ok(!AIR_SCREEN_IDS.includes('screen.desk'));
});

test('normalized XY controls actual flight position and altitude with inertia',()=>{
 const sim=createAirSpeciesState();sim.setInput({x:.8,y:.65});
 assert.equal(sim.state.x,0);assert.equal(sim.state.y,0);
 sim.step(1/60);assert.ok(sim.state.x>0&&sim.state.x<.01);assert.ok(sim.state.y>0&&sim.state.y<.01);
 run(sim,3);assert.ok(sim.state.x>.7);assert.ok(sim.state.y>.55);
 assert.equal(sim.state.mode,'responding');assert.deepEqual(sim.state.target,{x:.8,y:.65});
});

test('release preserves velocity, glides, then recovers autonomous floating',()=>{
 const sim=createAirSpeciesState();sim.setInput({x:.85,y:.6});run(sim,.4);
 const {x,vx}=sim.state;sim.releaseInput();
 assert.equal(sim.state.vx,vx);assert.equal(sim.state.mode,'gliding');
 run(sim,.2);assert.ok(sim.state.x>x);assert.ok(sim.state.vx>0);
 run(sim,4);assert.equal(sim.state.mode,'floating');assert.equal(sim.state.input.active,false);
 const old={x:sim.state.x,y:sim.state.y};run(sim,6);assert.ok(Math.hypot(sim.state.x-old.x,sim.state.y-old.y)>.1);
});

test('speed increases feather delay and extension and they recover after settling',()=>{
 const sim=createAirSpeciesState();sim.setInput({x:1,y:1});run(sim,.7);
 const lag=sim.state.featherLag,stretch=sim.state.stretch;
 assert.ok(lag>.15);assert.ok(stretch>1.08);
 run(sim,7);assert.ok(sim.state.featherLag<lag);assert.ok(sim.state.stretch<stretch);
});

test('fixed simulation steps agree at 30, 60 and 144 frames per second',()=>{
 const results=[30,60,144].map(fps=>{const sim=createAirSpeciesState();sim.setInput({x:-.75,y:.8});run(sim,2,fps);sim.releaseInput();run(sim,6,fps);return sim.snapshot();});
 for(const result of results.slice(1))for(const key of ['time','x','y','z','vx','vy','speed','phase','featherLag','stretch'])assert.ok(Math.abs(result[key]-results[0][key])<1e-9,key);
 assert.deepEqual(results[0].trail,results[2].trail);
});

test('input and parameter validation is atomic, finite, and bounded',()=>{
 const sim=createAirSpeciesState();sim.setInput({x:4,y:-3,source:'leap'});
 assert.deepEqual(sim.state.target,{x:1,y:-1});assert.equal(sim.state.input.source,'leap');
 const before=sim.snapshot();
 for(const input of [{x:NaN,y:0},{x:0,y:Infinity},{x:'1',y:0},{x:0,y:0,active:'yes'},{x:0,y:0,source:''}])assert.throws(()=>sim.setInput(input),TypeError);
 assert.deepEqual(sim.snapshot(),before);
 assert.throws(()=>sim.setParameters({response:.9,feather:NaN}),TypeError);assert.deepEqual(sim.state.params,AIR_DEFAULTS);
 assert.throws(()=>sim.setParameters({unknown:1}),TypeError);
 sim.setParameters({response:2,drift:-1});assert.equal(sim.state.params.response,1);assert.equal(sim.state.params.drift,0);
 assert.throws(()=>sim.step(NaN),TypeError);assert.throws(()=>sim.step(-.1),RangeError);
});

test('extreme direction changes stay bounded and long pauses do not jump',()=>{
 const sim=createAirSpeciesState();sim.setParameters({response:1,feather:1,drift:1});
 for(let i=0;i<40;i++){sim.setInput({x:i%2?1:-1,y:i%3?1:-1});run(sim,.3);for(const key of ['x','y'])assert.ok(Math.abs(sim.state[key])<=1);}
 const time=sim.state.time;sim.step(60);assert.ok(sim.state.time-time<.251);
 for(const key of ['x','y','z','speed','featherLag','stretch'])assert.ok(Number.isFinite(sim.state[key]));
});

test('trail is time sampled and bounded; snapshots cannot alter live simulation',()=>{
 const sim=createAirSpeciesState();run(sim,20);
 assert.equal(sim.state.trail.length,180);
 assert.ok(Math.abs(sim.state.trail.at(-1).time-sim.state.time)<.051);
 const copy=sim.snapshot();copy.trail[0].x=100;copy.params.drift=100;copy.input.active=true;
 assert.notEqual(sim.state.trail[0].x,100);assert.notEqual(sim.state.params.drift,100);assert.equal(sim.state.input.active,false);
});

test('Reset Flight keeps shared state identity and restores the initial lifecycle',()=>{
 const sim=createAirSpeciesState(),identity=sim.state;sim.setInput({x:.8,y:-.5});sim.setParameters({response:1});run(sim,3);
 assert.equal(sim.reset(),identity);assert.equal(sim.state,identity);assert.deepEqual(sim.snapshot(),createAirSpeciesState().snapshot());
 run(sim,1);assert.ok(sim.state.time>.99);assert.equal(sim.state.mode,'floating');
});

test('external adapters can release through active false without stopping velocity',()=>{
 const sim=createAirSpeciesState();sim.setInput({x:.6,y:.8,source:'leap'});run(sim,.5);
 const velocity=sim.state.vx;sim.setInput({x:0,y:0,active:false,source:'leap'});
 assert.equal(sim.state.mode,'gliding');assert.equal(sim.state.vx,velocity);
});

test('morph and flight inputs are independent and can be held together',()=>{
 const sim=createAirSpeciesState();sim.setInput({x:.7,y:.6});sim.setFieldInput({x:-.8,y:-.5});
 assert.equal(sim.state.field.x,0);run(sim,2);
 assert.ok(sim.state.x>.6&&sim.state.y>.5);assert.ok(sim.state.field.x<-.7&&sim.state.field.y<-.4);
 assert.deepEqual(sim.state.target,{x:.7,y:.6});assert.equal(sim.state.field.mode,'attracting');
 sim.releaseFieldInput();assert.equal(sim.state.input.active,true);assert.equal(sim.state.field.input.active,false);
});

test('morph attraction eases in, retains momentum, then dissipates',()=>{
 const sim=createAirSpeciesState();sim.setFieldInput({x:1,y:.5});sim.step(1/60);
 assert.ok(sim.state.field.x>0&&sim.state.field.x<.01);assert.ok(sim.state.field.strength<.1);
 run(sim,.5);const before={...sim.state.field};assert.ok(before.strength>.5&&before.energy>.1);
 sim.releaseFieldInput();assert.equal(sim.state.field.vx,before.vx);assert.equal(sim.state.field.mode,'relaxing');
 run(sim,.1);assert.ok(sim.state.field.x>before.x);assert.ok(sim.state.field.strength>0);
 run(sim,7);assert.ok(sim.state.field.strength<.008);assert.equal(sim.state.field.mode,'resting');
});

test('morph validation, snapshot isolation and reset retain the contract',()=>{
 const sim=createAirSpeciesState();const before=sim.snapshot();
 for(const input of [{x:NaN,y:0},{x:0,y:Infinity},{x:0,y:0,source:''},{x:0,y:0,active:1}])assert.throws(()=>sim.setFieldInput(input),TypeError);
 assert.deepEqual(sim.snapshot(),before);
 sim.setFieldInput({x:5,y:-5,source:'leap'});run(sim,.7);assert.deepEqual(sim.state.field.target,{x:1,y:-1});
 const copy=sim.snapshot();copy.field.target.x=99;copy.field.input.active=false;copy.field.x=99;
 assert.notEqual(sim.state.field.target.x,99);assert.equal(sim.state.field.input.active,true);assert.notEqual(sim.state.field.x,99);
 sim.setParameters({attraction:0,fluidity:1});run(sim,2);assert.ok(sim.state.field.strength<.001);
 sim.reset();assert.deepEqual(sim.snapshot(),createAirSpeciesState().snapshot());
});

test('morph simulation is stable across frame rates and direction reversals',()=>{
 const results=[30,60,144].map(fps=>{const sim=createAirSpeciesState();sim.setFieldInput({x:.8,y:-.7});run(sim,2,fps);sim.setFieldInput({x:-1,y:1});run(sim,1,fps);sim.releaseFieldInput();run(sim,3,fps);return sim.state.field;});
 for(const field of results.slice(1))for(const key of ['x','y','vx','vy','strength','swirl','energy','phase'])assert.ok(Math.abs(field[key]-results[0][key])<1e-9,key);
 assert.ok(Math.abs(results[0].x)<=1&&Math.abs(results[0].y)<=1);
});

test('flight and morph phases remain continuous across the 2π boundary',()=>{
 const sim=createAirSpeciesState();sim.setFieldInput({x:.6,y:.4});let previous={...sim.state.phase,field:sim.state.field.phase},crossedFlight=false,crossedField=false;
 for(let i=0;i<3000;i++){
  sim.step(1/120);const phase=sim.state.phase,fieldPhase=sim.state.field.phase;
  if(!crossedFlight&&phase>Math.PI*2){assert.ok(phase-previous.phase<.03);assert.ok(Math.abs(Math.sin(phase)-Math.sin(previous.phase))<.03);crossedFlight=true;}
  if(!crossedField&&fieldPhase>Math.PI*2){assert.ok(fieldPhase-previous.field<.03);assert.ok(Math.abs(Math.sin(fieldPhase)-Math.sin(previous.field))<.03);crossedField=true;}
  previous={phase,field:fieldPhase};if(crossedFlight&&crossedField)break;
 }
 assert.ok(crossedFlight&&crossedField);
});
