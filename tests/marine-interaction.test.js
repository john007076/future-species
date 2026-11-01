import test from 'node:test';
import assert from 'node:assert/strict';
import {createMarineState} from '../src/species/marine/state.js';
import {applyMarineRemoteControl} from '../src/species/marine/remote.js';
test('marine orbit, zoom, contact and screen selection are bounded and snapshots remain isolated',()=>{const m=createMarineState();m.orbit(.3,-.2);m.zoom(1.5);assert.equal(m.state.view.zoom,1.5);m.contact({active:true,x:2,y:-2,strength:2});assert.deepEqual(m.state.touch,{x:1,y:-1,strength:1,active:true});const before=m.snapshot();assert.throws(()=>m.setView({yaw:.8,zoom:NaN}));assert.deepEqual(m.snapshot(),before);assert.throws(()=>m.contact({active:true,x:Infinity}));assert.throws(()=>m.selectScreen('screen.upper_left'));assert.equal(m.selectScreen('screen.right.02'),'screen.right.02');const snapshot=m.snapshot();snapshot.view.zoom=50;snapshot.touch.active=false;assert.equal(m.state.view.zoom,1);assert.equal(m.state.touch.active,true);m.stop();assert.equal(m.state.touch.active,false);});
test('remote volume starts only after explicit listening, expires, and cannot reopen a stopped lifecycle',()=>{const m=createMarineState();assert.equal(m.setRemoteLevel(.1),false);assert.equal(m.state.phase,'IDLE');m.start();m.setRemoteLevel(.04);m.step(.1);assert.equal(m.state.level,.04);for(let i=0;i<6;i++)m.step(.1);assert.equal(m.state.level,0);m.stop();assert.equal(m.setRemoteLevel(1),false);assert.equal(m.state.phase,'IDLE');assert.throws(()=>m.setRemoteLevel(NaN));});
test('remote gestures and local controller level packets reach the same marine state',()=>{const marine=createMarineState(),context={marine,panel:{},onTelemetry(){},onChannel(){}};const run=message=>applyMarineRemoteControl({...context,message});run({type:'marineSelect',id:'screen.right.01'});run({type:'marineOrbit',dx:.2,dy:.1});run({type:'marineZoom',factor:2});run({type:'marineContact',input:{active:true,x:.3,y:.1}});assert.equal(marine.state.selectedScreen,'screen.right.01');assert.equal(marine.state.view.zoom,2);assert.equal(marine.state.touch.active,true);run({type:'marineListen'});run({type:'marineAudioLevel',level:.1});marine.step(.1);assert.equal(marine.state.level,.1);assert.throws(()=>run({type:'marineOrbit',dx:Infinity,dy:0}));});

test('controller commands cannot reach a different display session',()=>{const marine=createMarineState(),message={type:'marineOrbit',dx:.4,dy:0,targetSession:'another-display'};assert.equal(applyMarineRemoteControl({message,marine,panel:{}}),false);assert.equal(marine.state.view.yaw,0);message.targetSession=marine.sessionId;applyMarineRemoteControl({message,marine,panel:{}});assert.ok(marine.state.view.yaw>0);});

test('nine independent residents stay in the encounter volume over long runs',async()=>{
 const {roamingPose}=await import('../src/species/marine/population.js');
 for(let t=0;t<10000;t+=73){const poses=Array.from({length:9},(_,i)=>roamingPose(i,t));assert.equal(new Set(poses.map(p=>JSON.stringify(p))).size,9);for(const p of poses){assert.ok(Math.abs(p.x)<=9&&Math.abs(p.y)<=4.1&&p.z<=1&&p.z>=-26);assert.ok(Object.values(p).every(Number.isFinite));}}
});

test('screen views stay independent and resonance rejects rotation',()=>{
 const m=createMarineState();m.orbit(.3,.2);m.zoom(1.4);const first={...m.state.view};
 m.selectScreen('screen.right.02');assert.deepEqual(m.state.view,{yaw:0,pitch:0,zoom:1});m.orbit(-.2,.1);
 assert.deepEqual(m.state.viewStates['screen.upper_right'],first);
 m.selectScreen('screen.right.01');m.orbit(.5,.5);m.setView({yaw:1,pitch:1});assert.equal(m.state.view.yaw,0);assert.equal(m.state.view.pitch,0);
 const s=m.snapshot();s.viewStates['screen.upper_right'].yaw=99;assert.equal(m.state.viewStates['screen.upper_right'].yaw,.3);
});

test('kelp holdfasts stay fixed and fish headings follow their travel direction',async()=>{
 const {roamingPose}=await import('../src/species/marine/population.js');
 for(const index of [8,17,26]){const start=roamingPose(index,0);for(const t of [1,12,50,300]){const p=roamingPose(index,t);assert.equal(p.x,start.x);assert.equal(p.y,start.y);assert.equal(p.z,start.z);assert.equal(p.yaw,0);}}
 for(const index of [1,2,3,4,5,6,7])for(const t of [0,10,51,200]){const p=roamingPose(index,t),length=Math.hypot(p.vx,p.vz);assert.ok(((-Math.cos(p.yaw)*p.vx+Math.sin(p.yaw)*p.vz)/length)>.999);assert.ok(Math.abs(p.pitch)<.5);}
 for(const t of [0,10,50])assert.ok(Math.abs(roamingPose(0,t).yaw)<.1);
});

test('archive screen only selects specimens and ignores model orbit, zoom and contact',()=>{const m=createMarineState();m.selectScreen('screen.right.03');const before=m.snapshot();m.orbit(.4,.2);m.zoom(1.6);m.contact({active:true,x:.4,y:.3});assert.deepEqual(m.state.view,before.view);assert.equal(m.state.touch.active,false);m.inspect('shark');assert.equal(m.state.species,'shark');});
