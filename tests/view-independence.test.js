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
