import test from 'node:test';
import assert from 'node:assert/strict';
import {createMarineAudio} from '../src/species/marine/audio.js';
import {SPECIES} from '../src/species/marine/state.js';

// Lifecycle mocks test resource ownership; these do not validate a real device or sound quality.
function fixture(getUserMedia) {
  const contexts = [], calls = [], tracks = [];
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator'), original = globalThis.AudioContext;
  function stream() {
    const track = {readyState: 'live', stop() { this.readyState = 'ended'; }, addEventListener(type, fn) { this[type] = fn; }};
    tracks.push(track); return {getTracks: () => [track]};
  }
  class Context {
    state = 'suspended'; destination = {}; nodes = [];
    constructor() { contexts.push(this); }
    async resume() { this.state = 'running'; }
    async close() { this.state = 'closed'; }
    node() { const node = {connections: [], connect(to) { this.connections.push(to); }, disconnect() { this.connections = []; }}; this.nodes.push(node); return node; }
    createAnalyser() { return Object.assign(this.node(), {getFloatTimeDomainData(data) { data.fill(.1); }}); }
    createMediaStreamSource() { return this.node(); }
    createBuffer(channels, length) { const data = Array.from({length: channels}, () => new Float32Array(length)); return {getChannelData: channel => data[channel], duration: length / 24000}; }
    createBufferSource() { return Object.assign(this.node(), {start() {}, stop() { this.stopped = true; this.onended?.(); }}); }
  }
  globalThis.AudioContext = Context;
  Object.defineProperty(globalThis, 'navigator', {configurable: true, value: {mediaDevices: {getUserMedia: async constraints => { calls.push(constraints); return getUserMedia ? getUserMedia(stream) : stream(); }}}});
  return {contexts, calls, tracks, stream, restore() { globalThis.AudioContext = original; if (descriptor) Object.defineProperty(globalThis, 'navigator', descriptor); else delete globalThis.navigator; }};
}

test('mic lifecycle mock: explicit permission, analyser only, RMS, immediate release', async () => {
  const env = fixture(), audio = createMarineAudio();
  try {
    assert.equal(env.calls.length, 0); assert.equal(audio.status, 'idle');
    assert.equal(await audio.start(), true); assert.equal(audio.status, 'listening');
    assert.deepEqual(env.calls[0], {audio: {echoCancellation: true, noiseSuppression: true, autoGainControl: true}, video: false});
    assert.ok(Math.abs(audio.update() - .1) < 1e-7);
    assert.ok(env.contexts[0].nodes.every(node => !node.connections.includes(env.contexts[0].destination)));
    assert.equal(audio.respond('jelly'), true); assert.equal(audio.diagnostics().activeVoices, 1);
    audio.stop(); assert.equal(env.tracks[0].readyState, 'ended'); assert.equal(env.contexts[0].state, 'closed');
    assert.equal(audio.diagnostics().activeVoices, 0); assert.equal(audio.update(), 0);
  } finally { audio.dispose(); env.restore(); }
});
test('permission mock: denial and missing device leave no context and permit simulation', async () => {
  for (const [name, status] of [['NotAllowedError', 'denied'], ['NotFoundError', 'no-device'], ['NotReadableError', 'error']]) {
    const env = fixture(() => { throw Object.assign(new Error('test'), {name}); }), audio = createMarineAudio();
    try {
      assert.equal(await audio.start(), false); assert.equal(audio.status, status);
      assert.equal(audio.diagnostics().contextState, 'closed'); assert.equal(audio.diagnostics().activeTracks, 0);
      assert.equal(await audio.unlock(), true); assert.equal(audio.respond('fish'), true);
    } finally { audio.dispose(); env.restore(); }
  }
});
test('late permission mock: stop discards a pending grant, concurrent starts request once', async () => {
  let resolve;
  const deferred = new Promise(done => resolve = done), env = fixture(() => deferred), audio = createMarineAudio();
  try {
    const first = audio.start(), second = audio.start();
    assert.equal(first, second);
    await Promise.resolve(); await Promise.resolve();
    assert.equal(env.calls.length, 1);
    audio.stop(); resolve(env.stream());
    assert.equal(await first, false); assert.equal(env.tracks[0].readyState, 'ended');
    assert.equal(audio.status, 'stopped'); assert.equal(audio.diagnostics().activeTracks, 0);
  } finally { audio.dispose(); env.restore(); }
});
test('device removal mock and disposal both release audio; disposed modules cannot reopen', async () => {
  const env = fixture(), audio = createMarineAudio();
  try {
    await audio.start(); env.tracks[0].ended();
    assert.equal(audio.status, 'ended'); assert.equal(audio.diagnostics().contextState, 'closed');
    await audio.start(); audio.dispose();
    assert.equal(await audio.start(), false); assert.equal(await audio.unlock(), false);
    assert.ok(env.tracks.every(track => track.readyState === 'ended'));
  } finally { env.restore(); }
});
test('all original synthetic soundprints are distinct, bounded and finish before cooldown ends', async () => {
  const env = fixture(), audio = createMarineAudio();
  try {
    await audio.unlock(); const prints = [];
    for (const species of Object.keys(SPECIES)) {
      assert.equal(audio.respond(species), true);
      const voice = env.contexts[0].nodes.at(-1), data = voice.buffer.getChannelData(0);
      assert.ok(voice.buffer.duration < 4.2);
      assert.ok(data.every(sample => Number.isFinite(sample) && Math.abs(sample) < .4));
      assert.ok(data.some(sample => Math.abs(sample) > .05)); prints.push([...data.slice(12000, 12010)]);
      assert.equal(audio.diagnostics().activeVoices, 1);
    }
    assert.equal(prints.length, 9);
    for (let i = 0; i < prints.length; i++) for (let j = i + 1; j < prints.length; j++) assert.notDeepEqual(prints[i], prints[j]);
    assert.throws(() => audio.respond('speech'), TypeError);
  } finally { audio.dispose(); env.restore(); }
});

test('DONE releases microphone input while keeping the creature response available until STOP',async()=>{const env=fixture(),audio=createMarineAudio();try{await audio.start();audio.finishInput();assert.equal(audio.diagnostics().activeTracks,0);assert.equal(env.tracks[0].readyState,'ended');assert.equal(audio.update(),0);assert.equal(audio.respond('whale'),true);audio.stop();assert.equal(audio.diagnostics().contextState,'closed');assert.equal(audio.diagnostics().activeVoices,0);}finally{audio.dispose();env.restore();}});
