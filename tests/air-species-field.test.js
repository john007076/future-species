import test from 'node:test';
import assert from 'node:assert/strict';
import {createAirSpeciesState} from '../src/air-species-state.js';
import {morphLobes,fieldDensity,applyMorphField} from '../src/air-species-field.js';

test('metaball density is continuous, finite and strongest near its lobes',()=>{
 const s=createAirSpeciesState().state,lobes=morphLobes(s),center=lobes[0];
 assert.ok(fieldDensity(lobes,center.x,center.y)>fieldDensity(lobes,3,3)*10);
 assert.ok(Math.abs(fieldDensity(lobes,.2,.1)-fieldDensity(lobes,.200001,.1))<.001);
});
test('active field changes body geometry locally without changing flight position',()=>{
 const sim=createAirSpeciesState();sim.setFieldInput({x:.4,y:.3});for(let i=0;i<120;i++)sim.step(1/60);
 const s=sim.state,lobes=morphLobes(s),near=[lobes[0].x+.35,lobes[0].y+.1,0],far=[3,3,0];
 const before=[...near],farBefore=[...far],flight=[s.x,s.y];
 applyMorphField(near,.8,s,lobes);applyMorphField(far,.8,s,lobes);
 assert.ok(Math.hypot(near[0]-before[0],near[1]-before[1])>.04);
 assert.ok(Math.hypot(far[0]-farBefore[0],far[1]-farBefore[1])<.01);
 assert.deepEqual([s.x,s.y],flight);
 s.field.strength=0;const idle=[...before];applyMorphField(idle,.8,s,lobes);assert.deepEqual(idle,before);
});
test('opposite circulation changes the deformation direction and stays bounded',()=>{
 const s=createAirSpeciesState().state;s.field.strength=1;const lobes=morphLobes(s),a=[.6,.1,0],b=[...a];
 s.field.swirl=1.5;applyMorphField(a,1,s,lobes);s.field.swirl=-1.5;applyMorphField(b,1,s,lobes);
 assert.ok(Math.abs(a[1]-b[1])>.03);for(const n of [...a,...b])assert.ok(Number.isFinite(n)&&Math.abs(n)<3);
});
