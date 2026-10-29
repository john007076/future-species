import test from 'node:test';
import assert from 'node:assert/strict';
import {createAirSpeciesState} from '../src/air-species-state.js';
import {airTelemetry,applyAirRemoteControl} from '../src/air-remote-protocol.js';

test('AIR remote routes flight, morph and parameter messages independently',()=>{
 const flight=createAirSpeciesState();
 applyAirRemoteControl({flight,message:{type:'airInput',input:{x:.7,y:.4}}});
 applyAirRemoteControl({flight,message:{type:'airFieldInput',input:{x:-.3,y:.8}}});
 applyAirRemoteControl({flight,message:{type:'airParameters',patch:{fluidity:.9}}});
 assert.deepEqual(flight.state.target,{x:.7,y:.4});
 assert.deepEqual(flight.state.field.target,{x:-.3,y:.8});
 assert.equal(flight.state.params.fluidity,.9);
 applyAirRemoteControl({flight,message:{type:'airFieldRelease'}});
 assert.equal(flight.state.input.active,true);
 assert.equal(flight.state.field.input.active,false);
 applyAirRemoteControl({flight,message:{type:'airRelease'}});
 assert.equal(flight.state.input.active,false);
});

test('AIR telemetry omits trail and reset/state requests reach their callbacks',()=>{
 const flight=createAirSpeciesState();flight.step(2);
 const packet=airTelemetry(flight.state);
 assert.equal(packet.type,'airTelemetry');assert.deepEqual(packet.state.trail,[]);
 let resets=0,telemetry=0;
 applyAirRemoteControl({flight,message:{type:'airReset'},onReset:()=>{resets++;flight.reset();},onTelemetry:()=>telemetry++});
 applyAirRemoteControl({flight,message:{type:'airStateRequest'},onTelemetry:()=>telemetry++});
 assert.equal(resets,1);assert.equal(telemetry,1);assert.equal(flight.state.time,0);
 assert.equal(applyAirRemoteControl({flight,message:{type:'unrelated'}}),false);
});

test('AIR view playback messages and telemetry preserve independent channel states',()=>{
 const flight=createAirSpeciesState(),channels=new Map([['screen.upper_left',true],['screen.left.03',true]]),changes=[];
 const packet=airTelemetry(flight.state,channels);
 assert.deepEqual(packet.channels,{'screen.upper_left':true,'screen.left.03':true});
 applyAirRemoteControl({flight,message:{type:'airViewState',id:'screen.left.03',enabled:false},onViewState:(id,enabled)=>changes.push([id,enabled])});
 assert.deepEqual(changes,[['screen.left.03',false]]);
});
