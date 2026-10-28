import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
const UNIT_PIN = new THREE.CylinderGeometry(1, 1, 1, 8);
const UNIT_DOT = new THREE.SphereGeometry(1, 6, 4);

function randomSource(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function instances(parent, name, geometry, material, specs) {
  if (!specs.length) return;
  const mesh = new THREE.InstancedMesh(geometry, material, specs.length);
  const transform = new THREE.Object3D();
  for (let i = 0; i < specs.length; i++) {
    const { p, s, r = [0, 0, 0] } = specs[i];
    transform.position.set(...p);
    transform.scale.set(...s);
    transform.rotation.set(...r);
    transform.updateMatrix();
    mesh.setMatrixAt(i, transform.matrix);
  }
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.instanceMatrix.needsUpdate = true;
  parent.add(mesh);
  return mesh;
}

function perforatedPlate(width, height, thickness) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -height / 2);
  shape.lineTo(width / 2, -height / 2);
  shape.lineTo(width / 2, height / 2);
  shape.lineTo(-width / 2, height / 2);
  shape.closePath();
  for (let x = -1; x <= 1; x++) {
    for (let y = -7; y <= 7; y++) {
      const hole = new THREE.Path();
      hole.absellipse(x * width * 0.23, y * height / 18, width * 0.052, height * 0.012, 0, Math.PI * 2, true);
      shape.holes.push(hole);
    }
  }
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 4 });
  geometry.translate(0, 0, -thickness / 2);
  return geometry;
}

/** A finite-thickness acrylic enclosure; the camera-facing normal is local +Z. */
export function createCabinet({ id, width = 1.25, height = 1.65, depth = 0.72, seed = 1, materials = {} } = {}) {
  if (typeof id !== 'string' || !id || ![width, height, depth].every(v => Number.isFinite(v) && v > 0.1)) {
    throw new TypeError('createCabinet needs a non-empty id and positive dimensions greater than 0.1.');
  }
  const rand = randomSource(seed);
  const fallback = (key, options) => materials[key] || new THREE.MeshStandardMaterial(options);
  const cream = fallback('cream', { color: 0xbeb9a2, roughness: 0.46, metalness: 0.14 });
  const metal = fallback('metal', { color: 0xb3aaa0, roughness: 0.28, metalness: 0.86 });
  const dark = fallback('dark', { color: 0x202727, roughness: 0.64, metalness: 0.26 });
  const copper = fallback('copper', { color: 0x92704b, roughness: 0.44, metalness: 0.74 });
  const board = (materials.board || new THREE.MeshStandardMaterial({ color: 0x514c38 })).clone();
  board.roughness = 0.86;
  board.metalness = 0.045;
  const amber = fallback('amber', { color: 0xd5a267, emissive: 0xe6a24e, emissiveIntensity: 0.65, roughness: 0.36 });
  const glass = materials.glass || new THREE.MeshPhysicalMaterial({
    color: 0xece4cc, transmission: 0.98, opacity: 1, roughness: 0.085,
    metalness: 0, ior: 1.49, thickness: 0.018, clearcoat: 0.6,
    clearcoatRoughness: 0.14,
  });
  const inner = id.includes('.right.') ? -1 : 1;
  const root = new THREE.Group();
  root.name = id;
  root.userData = { id, interactionId: id, kind: 'cabinet', dimensions: [width, height, depth] };
  const body = new THREE.Group();
  body.name = `${id}.body`;
  const acrylic = new THREE.Group();
  acrylic.name = `${id}.acrylic`;
  root.add(body, acrylic);
  const t = Math.min(width, height, depth) * 0.018;
  const panels = [
    ['front', [width, height, t], [0, 0, depth / 2]],
    ['rear', [width, height, t], [0, 0, -depth / 2]],
    ['left', [t, height, depth], [-width / 2, 0, 0]],
    ['right', [t, height, depth], [width / 2, 0, 0]],
    ['top', [width, t, depth], [0, height / 2, 0]],
    ['bottom', [width, t, depth], [0, -height / 2, 0]],
  ];
  const edgeSegments = [];
  for (const [label, size, position] of panels) {
    const geo = new RoundedBoxGeometry(...size, 2, t * 0.42);
    const pane = new THREE.Mesh(geo, glass);
    pane.position.set(...position);
    pane.name = `${id}.acrylic.${label}`;
    acrylic.add(pane);
    const edges = new THREE.EdgesGeometry(geo);
    edges.translate(...position);
    edgeSegments.push(edges);
  }
  const edge = new THREE.LineSegments(mergeGeometries(edgeSegments), new THREE.LineBasicMaterial({ color: 0xc6b79b, transparent: true, opacity: 0.38 }));
  edge.name = `${id}.acrylic.cutEdges`;
  acrylic.add(edge);
  edgeSegments.forEach(g => g.dispose());

  const screws = [], standoffs = [], slots = [];
  for (const z of [-depth / 2, depth / 2]) {
    for (const x of [-width / 2 + 0.05, width / 2 - 0.05]) {
      for (const y of [-height / 2 + 0.05, height / 2 - 0.05]) {
        screws.push({ p: [x, y, z], s: [0.025, 0.016, 0.025], r: [Math.PI / 2, 0, 0] });
        slots.push({ p: [x, y, z + (z > 0 ? 0.01 : -0.01)], s: [0.023, 0.0035, 0.002] });
        standoffs.push({ p: [x, y, z * 0.83], s: [0.014, depth * 0.14, 0.014], r: [Math.PI / 2, 0, 0] });
      }
    }
  }
  // Intermediate fasteners give the tall panels their small-scale rhythm.
  for (const x of [-width / 2 + 0.045, width / 2 - 0.045]) {
    for (const y of [-height * 0.19, height * 0.19]) {
      screws.push({ p: [x, y, depth / 2 + 0.004], s: [0.018, 0.014, 0.018], r: [Math.PI / 2, 0, 0] });
    }
  }
  instances(body, `${id}.fasteners`, UNIT_PIN, metal, screws);
  instances(body, `${id}.spacers`, UNIT_PIN, copper, standoffs);
  instances(body, `${id}.screwSlots`, UNIT_BOX, dark, slots);

  const boards = [], chips = [], traces = [], pins = [], caps = [], indicators = [], connectors = [];
  const boardCenters = [
    [-.16, -.35, -.22], [.035, -.19, .19], [-.18, .025, .035],
    [.065, .19, -.25], [-.20, .355, .16], [.15, .38, -.04],
  ].map(([x, y, z]) => [inner * x * width, y * height, z * depth]);
  for (const [cx, cy, cz] of boardCenters) {
    const bw = width * (0.145 + rand() * 0.055), bh = height * (0.135 + rand() * 0.045);
    boards.push({ p: [cx, cy, cz], s: [bw, bh, 0.015] });
    for (let n = 0; n < 8; n++) {
      const x = cx + (rand() - 0.5) * bw * 0.72;
      const y = cy + (rand() - 0.5) * bh * 0.78;
      const w = 0.024 + rand() * 0.039, h = 0.025 + rand() * 0.05;
      chips.push({ p: [x, y, cz + 0.025], s: [w, h, 0.027] });
      for (const side of [-1, 1]) {
        for (let pin = 0; pin < 3; pin++) {
          pins.push({ p: [x + side * (w / 2 + 0.008), y + (pin - 1) * h * 0.28, cz + 0.021], s: [0.018, 0.003, 0.005] });
        }
      }
      traces.push({ p: [x + w / 2 + 0.01, cy, cz + 0.009], s: [0.0025, bh * 0.76, 0.002] });
      traces.push({ p: [cx, y + h / 2 + 0.006, cz + 0.009], s: [bw * 0.82, 0.0025, 0.002] });
      if (n % 3 === 0) caps.push({ p: [x + 0.025, y - 0.025, cz + 0.05], s: [0.012, 0.055, 0.012], r: [Math.PI / 2, 0, 0] });
    }
    for (let n = 0; n < 17; n++) {
      indicators.push({ p: [cx + (rand() - 0.5) * bw * 0.9, cy + (rand() - 0.5) * bh * 0.95, cz + 0.019], s: [0.005, 0.005, 0.005] });
    }
    connectors.push({ p: [cx + inner * (bw / 2 - 0.015), cy - bh * 0.32, cz + 0.033], s: [0.027, 0.073, 0.045] });
  }
  // Staggered perpendicular cards and suspended terminals keep the assembly volumetric.
  for (let layer = 0; layer < 3; layer++) {
    const x = -inner * width * (.27 + layer * .025), y = height * (-.29 + layer * .285);
    const z = depth * (-.12 + layer * .10);
    boards.push({ p: [x, y, z], s: [depth * .38, height * .19, .015], r: [0, Math.PI / 2, 0] });
    for (let n = 0; n < 6; n++) {
      chips.push({ p: [x + inner * .021, y + (n % 3 - 1) * height * .045, z + (n < 3 ? -.07 : .07)], s: [.026, .043, .047] });
      caps.push({ p: [x + inner * .035, y + (n % 3 - 1) * height * .045, z + .028], s: [.011, .046, .011], r: [0, 0, Math.PI / 2] });
    }
  }
  for (let i = 0; i < 48; i++) {
    const x = (rand() - .5) * width * .76;
    const y = (rand() - .5) * height * .87;
    const z = (rand() - .5) * depth * .66;
    pins.push({ p: [x, y, z], s: [.005, .019, .005] });
    indicators.push({ p: [x, y + .011, z], s: [.004, .004, .004] });
  }
  instances(body, `${id}.circuitBoards`, UNIT_BOX, board, boards);
  instances(body, `${id}.integratedCircuits`, UNIT_BOX, dark, chips);
  instances(body, `${id}.copperTraces`, UNIT_BOX, copper, traces);
  instances(body, `${id}.solderPins`, UNIT_BOX, metal, pins);
  instances(body, `${id}.capacitors`, UNIT_PIN, dark, caps);
  instances(body, `${id}.amberIndicators`, UNIT_DOT, amber, indicators);
  instances(body, `${id}.connectors`, UNIT_BOX, cream, connectors);

  const rearPanel = new THREE.Mesh(perforatedPlate(width * 0.20, height * 0.68, 0.018), cream);
  rearPanel.position.set(inner * width * 0.34, -height * 0.025, -depth * 0.39);
  rearPanel.name = `${id}.ventilatedRearModule`;
  rearPanel.castShadow = true;
  body.add(rearPanel);
  const modules = [], lids = [], terminalContacts = [], busRails = [];
  for (let i = 0; i < 5; i++) {
    const x = inner * width * (.33 + (i % 2) * .025);
    const y = height * (-.34 + i * .17);
    const z = depth * (-.05 + (i % 3) * .115);
    const mw = width * (.14 + rand() * .025), mh = height * (.095 + rand() * .025);
    modules.push({ p: [x, y, z], s: [mw, mh, depth * .21] });
    if (i % 2 === 0) lids.push({ p: [x, y, z + depth * .11], s: [mw * .94, mh * .94, .012] });
    for (let pin = 0; pin < 5; pin++) {
      terminalContacts.push({ p: [x - mw * .32 + pin * mw * .16, y - mh / 2 - .012, z + depth * .075], s: [.009, .030, .011] });
    }
  }
  for (const x of [-inner * width * .34, inner * width * .28]) {
    busRails.push({ p: [x, 0, -depth * .28], s: [.012, height * .88, .012] });
  }
  instances(body, `${id}.powerModules`, UNIT_BOX, dark, modules);
  instances(body, `${id}.powerModuleLids`, UNIT_BOX, cream, lids);
  instances(body, `${id}.terminalContacts`, UNIT_BOX, metal, terminalContacts);
  instances(body, `${id}.internalMountingRails`, UNIT_BOX, metal, busRails);
  const innerPlates = new THREE.Group();
  innerPlates.name = `${id}.internalAcrylicMounts`;
  for (const [index, size, position] of [
    [0, [width * .72, height * .81, t * .7], [0, 0, -depth * .31]],
    [1, [width * .52, height * .28, t * .7], [-inner * width * .08, height * .13, depth * .27]],
  ]) {
    const plate = new THREE.Mesh(new RoundedBoxGeometry(...size, 2, t * .23), glass);
    plate.position.set(...position);
    plate.name = `${id}.internalAcrylicMounts.${index}`;
    innerPlates.add(plate);
  }
  body.add(innerPlates);

  const blackWires = [], brownWires = [];
  for (let i = 0; i < 22; i++) {
    const left = i % 2 ? -1 : 1;
    const x = left * width * (0.12 + rand() * 0.25);
    const top = height * (0.20 + rand() * 0.23);
    const bottom = -height * (0.22 + rand() * 0.20);
    const z = -depth * 0.25 + rand() * depth * 0.53;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x * 0.5, top, -depth * 0.08),
      new THREE.Vector3(x, top + height * 0.04, z),
      new THREE.Vector3(x + left * width * 0.04, height * (rand() - 0.5) * 0.5, z + depth * 0.10),
      new THREE.Vector3(x * 0.88, bottom, z),
      new THREE.Vector3(x * 0.30, bottom + height * 0.08, -depth * 0.04),
    ]);
    const geo = new THREE.TubeGeometry(curve, 22, i % 3 === 0 ? 0.007 : 0.0035, 5, false);
    (i % 3 === 0 ? blackWires : brownWires).push(geo);
  }
  for (let i = 0; i < 10; i++) {
    const y = height * (-.4 + i * .086);
    const z = depth * (-.17 + (i % 3) * .16);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-inner * width * .31, y, z),
      new THREE.Vector3(-inner * width * .15, y - height * .04, z + depth * .09),
      new THREE.Vector3(inner * width * .08, y + height * .015, z + depth * .05),
      new THREE.Vector3(inner * width * .31, y + height * .035, z - depth * .015),
    ]);
    brownWires.push(new THREE.TubeGeometry(curve, 18, .0028, 5, false));
  }
  for (const [name, geometries, material] of [['signalWires', blackWires, dark], ['copperWires', brownWires, copper]]) {
    const wire = new THREE.Mesh(mergeGeometries(geometries), material);
    wire.name = `${id}.${name}`;
    wire.castShadow = true;
    body.add(wire);
    geometries.forEach(g => g.dispose());
  }
  const harness = new THREE.Group();
  harness.name = `${id}.anchor`;
  harness.position.set(0, 0, depth / 2 + t);
  root.add(harness);
  root.userData.drawCalls = 0;
  root.traverse(object => { if (object.isMesh || object.isLineSegments) root.userData.drawCalls++; });
  root.userData.componentCount = chips.length + pins.length + indicators.length + traces.length + screws.length + modules.length + terminalContacts.length;
  return root;
}
