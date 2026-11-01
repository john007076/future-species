import test from 'node:test';
import assert from 'node:assert/strict';
import {createAirSpeciesState,AIR_SCREEN_IDS} from '../src/air-species-state.js';
test('AIR rotation and zoom belong to one channel and do not change flight or morph input',()=>{
 const air=createAirSpeciesState();air.orbitView(AIR_SCREEN_IDS[1],.4,.2);air.zoomView(AIR_SCREEN_IDS[1],1.5);
 assert.deepEqual(air.state.viewTransforms[AIR_SCREEN_IDS[0]],{yaw:0,pitch:0,zoom:1});assert.equal(air.state.viewTransforms[AIR_SCREEN_IDS[1]].zoom,1.5);
 assert.equal(air.state.input.active,false);assert.equal(air.state.field.input.active,false);
 const snapshot=air.snapshot();snapshot.viewTransforms[AIR_SCREEN_IDS[1]].yaw=9;assert.equal(air.state.viewTransforms[AIR_SCREEN_IDS[1]].yaw,.4);
 assert.throws(()=>air.orbitView('other',0,0));assert.throws(()=>air.zoomView(AIR_SCREEN_IDS[0],Infinity));
});

test('AIR view rotation projects depth coordinates instead of flattening or rotating a canvas',async()=>{
 const {orientAirPoint}=await import('../src/air-view-projection.js');
 const p=orientAirPoint([1,0,0],{yaw:Math.PI/2,pitch:0,zoom:1});assert.ok(Math.abs(p[0])<1e-8);assert.ok(Math.abs(p[2]+1)<1e-8);
 const q=orientAirPoint([0,1,0],{yaw:0,pitch:Math.PI/2,zoom:1});assert.ok(Math.abs(q[1])<1e-8);assert.ok(Math.abs(q[2]-1)<1e-8);
});
