import test from 'node:test';
import assert from 'node:assert/strict';
import {MARINE_SCREEN_IDS, SPECIES, createMarineState} from '../src/species/marine/state.js';
import {AIR_SCREEN_IDS} from '../src/air-species-state.js';
function run(sim, seconds, level = 0) { for (let i = 0; i < Math.ceil(seconds * 60); i++) sim.step(1 / 60, level); }

test('MARINE exclusively owns four unused right screens', () => {
  assert.deepEqual(MARINE_SCREEN_IDS, ['screen.upper_right', 'screen.right.01', 'screen.right.02', 'screen.right.03']);
  assert.equal(MARINE_SCREEN_IDS.filter(id => AIR_SCREEN_IDS.includes(id) || id === 'screen.desk').length, 0);
});
test('short noise and sub-threshold sound cannot summon a creature; sustained voice does', () => {
  const sim = createMarineState();sim.setParameters({threshold:.035,hold:.32}); sim.start();
  run(sim, 2, .02);
  for (let i = 0; i < 20; i++) { run(sim, .05, .3); run(sim, .08, 0); }
  assert.equal(sim.state.phase, 'LISTENING'); assert.equal(sim.state.encounterCount, 0);
  run(sim, .35, .08);
  assert.equal(sim.state.phase, 'SIGNAL_DETECTED'); assert.equal(sim.state.encounterCount, 1);
});
test('full random encounter, has every phase, and locks out self echo', () => {
  const sim = createMarineState({random: () => .999});
  assert.equal(sim.call(), true);
  const phases = new Set([sim.state.phase]);
  for (let i = 0; i < 1200; i++) { sim.step(1 / 60, .8); phases.add(sim.state.phase); }
  assert.deepEqual([...phases], ['SIGNAL_DETECTED', 'APPROACH', 'ENCOUNTER', 'ECHO', 'ESCAPE', 'COOLDOWN', 'LISTENING']);
  assert.equal(sim.state.encounterCount, 1); assert.equal(sim.state.species, 'tang');
  assert.equal(sim.state.armed, false);
  run(sim, .5, 0); run(sim, .35, .08);
  assert.equal(sim.state.encounterCount, 2);
});
test('all nine species use the same simulation lifecycle and throttle repeated calls', () => {
  const sim = createMarineState();
  assert.deepEqual(Object.keys(SPECIES), ['jelly', 'fish', 'mollusc', 'whale', 'shark', 'angelfish', 'butterflyfish', 'tang', 'algae']);
  for (const id of Object.keys(SPECIES)) {
    assert.equal(sim.call(id), true); assert.equal(sim.state.species, id);
    assert.equal(sim.call(id), false); run(sim, 16);
    assert.equal(sim.state.phase, 'LISTENING');
  }
  sim.stop(); assert.equal(sim.state.phase, 'IDLE'); assert.equal(sim.state.envelope, 0);
});
test('weighted automatic choice reaches all mobile species and never repeats immediately', () => {
  const seen = new Set();
  for (let random = 0; random < 1; random += .01) {
    const sim = createMarineState({random: () => random});
    sim.call(); seen.add(sim.state.species); sim.stop(); sim.call('auto'); seen.add(sim.state.species);
    let previous = sim.state.species;
    for (let i = 0; i < 5; i++) { sim.stop(); sim.call(); assert.notEqual(sim.state.species, previous); previous = sim.state.species; }
  }
  assert.equal(seen.size, 8);assert.equal(seen.has('algae'),false);
});
test('manual species selection validates before mutating the encounter', () => {
  const sim = createMarineState(), before = sim.snapshot();
  for (const value of ['unknown', '__proto__', null, {}, {toString: () => 'jelly'}, 3]) assert.throws(() => sim.call(value), TypeError);
  assert.deepEqual(sim.snapshot(), before);
  assert.equal(sim.call('whale'), true); assert.equal(sim.state.species, 'whale');
});
test('hysteresis tolerates small fluctuations but requires quiet before rearming', () => {
  const sim = createMarineState();sim.setParameters({threshold:.035,hold:.32}); sim.start();
  run(sim, .1, .05); run(sim, .25, .03);
  assert.equal(sim.state.phase, 'SIGNAL_DETECTED');
  run(sim, 16, .03); assert.equal(sim.state.phase, 'LISTENING');
  assert.equal(sim.state.encounterCount, 1); assert.equal(sim.state.armed, false);
  run(sim, .2, 0); run(sim, .2, .03); run(sim, .2, 0);
  assert.equal(sim.state.armed, false);
  run(sim, .3, 0); assert.equal(sim.state.armed, true);
});
test('parameters validate atomically; long frame pauses cannot skip encounters', () => {
  const sim = createMarineState(), before = sim.snapshot();
  for (const patch of [null, [], {threshold: NaN}, {threshold: .1, hold: Infinity}, {unknown: 2}]) assert.throws(() => sim.setParameters(patch), TypeError);
  assert.deepEqual(sim.snapshot(), before);
  assert.throws(() => sim.step(-1), RangeError); assert.throws(() => sim.step(NaN), TypeError); assert.throws(() => sim.step(.1, '1'), TypeError);
  sim.setParameters({threshold: -1, hold: 8}); assert.equal(sim.state.threshold, .005); assert.equal(sim.state.hold, 1.5);
  sim.call(); sim.step(60); assert.equal(sim.state.phase, 'APPROACH'); assert.equal(sim.state.phaseTime, 0);
  const snapshot = sim.snapshot(); snapshot.phase = 'BAD'; assert.notEqual(sim.state.phase, 'BAD');
});

test('speech onset selects a mobile resident within 100ms and starts approach within 180ms',()=>{const m=createMarineState({random:()=>.4});m.start();for(let i=0;i<6;i++)m.step(1/60,.04);assert.equal(m.state.encounterCount,1);for(let i=0;i<4;i++)m.step(1/60,.04);assert.equal(m.state.phase,'APPROACH');assert.notEqual(m.state.species,'algae');assert.equal(m.call(),false);});
