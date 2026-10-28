import test from 'node:test';
import assert from 'node:assert/strict';
import {createContentController} from '../src/content-controller.js';

function texture(name) {
  return {name, isTexture: true, disposals: 0, dispose() { this.disposals++; }};
}

function setup() {
  const originals = new Map(['left', 'right'].map(id => [id, texture('original.' + id)]));
  const screens = new Map([...originals].map(([id, original]) => [id, {
    material: {map: original, emissiveMap: original, needsUpdate: false},
  }]));
  const requests = new Map();
  const controller = createContentController({screens, originals,
    loadTexture(url) {
      return new Promise((resolve, reject) => requests.set(url, {resolve, reject}));
    },
    makeTexture(source) {
      if (source?.isTexture) return {texture: source, owned: false};
      if (source?.kind === 'canvas') return {texture: source.texture, owned: true};
      throw new TypeError('Invalid screen content.');
    },
  });
  return {...controller, screens, originals, requests};
}

test('last request wins even when an earlier URL finishes last', async () => {
  const c = setup(), a = texture('a'), b = texture('b');
  const first = c.setScreenContent('left', 'a');
  const second = c.setScreenContent('left', 'b');
  c.requests.get('b').resolve(b);
  assert.equal(await second, b);
  c.requests.get('a').resolve(a);
  assert.equal(await first, null);
  assert.equal(c.screens.get('left').material.map, b);
  assert.equal(c.screens.get('left').material.emissiveMap, b);
  assert.equal(c.screens.get('left').material.needsUpdate, true);
  assert.equal(a.disposals, 1);
  assert.equal(b.disposals, 0);
});

test('restore invalidates a pending load and retains the original', async () => {
  const c = setup(), pendingTexture = texture('pending');
  const pending = c.setScreenContent('left', 'pending');
  c.restoreScreenContent('left');
  c.requests.get('pending').resolve(pendingTexture);
  assert.equal(await pending, null);
  assert.equal(c.screens.get('left').material.map, c.originals.get('left'));
  assert.equal(pendingTexture.disposals, 1);
  assert.equal(c.originals.get('left').disposals, 0);
});

test('requests for different screens do not invalidate each other', async () => {
  const c = setup(), left = texture('left'), right = texture('right');
  const a = c.setScreenContent('left', 'left');
  const b = c.setScreenContent('right', 'right');
  c.requests.get('right').resolve(right);
  c.requests.get('left').resolve(left);
  assert.deepEqual(await Promise.all([a, b]), [left, right]);
  assert.equal(c.screens.get('left').material.map, left);
  assert.equal(c.screens.get('right').material.map, right);
});

test('replacement releases owned textures but never external or original textures', async () => {
  const c = setup(), first = texture('owned.first'), second = texture('owned.second');
  const shared = texture('external');
  await c.setScreenContent('left', {kind: 'canvas', texture: first});
  await c.setScreenContent('left', {kind: 'canvas', texture: second});
  assert.equal(first.disposals, 1);
  await c.setScreenContent('left', shared);
  assert.equal(second.disposals, 1);
  c.restoreScreenContent('left');
  assert.equal(shared.disposals, 0);
  const pending = c.setScreenContent('left', 'original');
  c.requests.get('original').resolve(c.originals.get('left'));
  await pending;
  c.restoreScreenContent('left');
  assert.equal(c.originals.get('left').disposals, 0);
});

test('a shared texture is not disposed while another screen displays it', async () => {
  const c = setup(), shared = texture('shared');
  await c.setScreenContent('left', {kind: 'canvas', texture: shared});
  await c.setScreenContent('right', {kind: 'canvas', texture: shared});
  c.restoreScreenContent('left');
  assert.equal(shared.disposals, 0);
  c.restoreScreenContent('right');
  assert.equal(shared.disposals, 1);
});

test('passing an existing owned texture externally relinquishes disposal ownership', async () => {
  const c = setup(), shared = texture('shared');
  await c.setScreenContent('left', {kind: 'canvas', texture: shared});
  await c.setScreenContent('right', shared);
  c.restoreScreenContent('left');
  c.restoreScreenContent('right');
  assert.equal(shared.disposals, 0);
});

test('a failed later load retains current content and invalidates older loads', async () => {
  const c = setup(), current = texture('current'), stale = texture('stale');
  await c.setScreenContent('left', {kind: 'canvas', texture: current});
  const first = c.setScreenContent('left', 'first');
  const second = c.setScreenContent('left', 'second');
  const failed = assert.rejects(second, /load failed/);
  c.requests.get('second').reject(new Error('load failed'));
  await failed;
  c.requests.get('first').resolve(stale);
  assert.equal(await first, null);
  assert.equal(c.screens.get('left').material.map, current);
  assert.equal(current.disposals, 0);
  assert.equal(stale.disposals, 1);
});

test('unknown IDs and invalid payloads fail without replacing content', async () => {
  const c = setup();
  await assert.rejects(c.setScreenContent('missing', 'url'), /Unknown screen/);
  assert.throws(() => c.restoreScreenContent('missing'), /Unknown screen/);
  assert.equal(c.requests.size, 0);
  const stale = texture('stale');
  const pending = c.setScreenContent('left', 'pending');
  await assert.rejects(c.setScreenContent('left', null), TypeError);
  await assert.rejects(c.setScreenContent('left', {kind: 'canvas', texture: {}}), TypeError);
  c.requests.get('pending').resolve(stale);
  assert.equal(await pending, null);
  assert.equal(c.screens.get('left').material.map, c.originals.get('left'));
  assert.equal(stale.disposals, 1);
});
