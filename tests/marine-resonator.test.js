import test from 'node:test';
import assert from 'node:assert/strict';
import {resonanceEnergy} from '../src/species/marine/resonator.js';
import {fitLivingSize} from '../src/living-layout.js';
test('crystal organism responds continuously to sound, clamps input and echoes without a microphone',()=>{assert.equal(resonanceEnergy({}),0);assert.equal(resonanceEnergy({envelope:.075}),.5);assert.equal(resonanceEnergy({level:1}),1);assert.equal(resonanceEnergy({level:-1}),0);assert.ok(resonanceEnergy({phase:'ECHO',phaseTime:.4})>.28);assert.equal(resonanceEnergy({phase:'COOLDOWN',envelope:0}),0);});
test('living views fit portrait and landscape without clipping or stretching',()=>{for(const [w,h,a] of [[300,500,.4],[650,400,640/552],[250,300,800/728]]){const [x,y]=fitLivingSize(w,h,a);assert.ok(x<=w&&y<=h+1e-8);assert.ok(Math.abs(x/y-a)<1e-9);}});

 test('particle organism applies tenfold sound deformation without changing input energy',async()=>{const {createMarineResonator}=await import('../src/species/marine/resonator.js');const r=createMarineResonator();r.update({time:1,envelope:.06});const d=r.diagnostics();assert.equal(d.responseGain,10);assert.ok(Math.abs(d.energy-.4)<1e-9);assert.ok(Math.abs(d.influence-4)<1e-9);r.dispose();});
