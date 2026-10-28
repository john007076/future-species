import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { instances, seeded } from './model-utils.js';

function segment(a, b, radius) {
  const direction = new THREE.Vector3(...b).sub(new THREE.Vector3(...a));
  const rotation = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize()));
  return { p: a.map((value, i) => (value + b[i]) / 2), s: [radius, direction.length(), radius], r: [rotation.x, rotation.y, rotation.z] };
}

function tubes(parent, name, paths, material) {
  const geometries = paths.map(({ points, radius, segments = 40 }) => new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), segments, radius, 7, false,
  ));
  const mesh = new THREE.Mesh(mergeGeometries(geometries), material);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  geometries.forEach(geometry => geometry.dispose());
  return mesh;
}

export function createStructure(materials) {
  const group = new THREE.Group();
  group.name = 'structure';
  group.userData = { id: 'structure', interactionId: 'structure', kind: 'framework', arcRadius: 4.5, arcCenter: [0, 0, 2.2] };
  const arcZ = x => 2.2 - Math.sqrt(4.5 ** 2 - x ** 2);
  const arcY = x => 8.15 + 1.45 * (x / 4.5) ** 2;
  const metal = materials.metal;
  const dark = materials.dark;
  const rubber = materials.rubber || dark;
  const cable = materials.cable || dark;
  const tanCable = materials.tanCable || materials.cream;
  const poleSpecs = [], clampSpecs = [], connectorSpecs = [], boltSpecs = [], footSpecs = [], footRubber = [];
  const rand = seeded(719);
  const unitCylinder = new THREE.CylinderGeometry(1, 1, 1, 12);
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  const collars = [];
  for (const side of [-1, 1]) {
    const inner = side * 4.42, outer = side * 4.59;
    const innerZ = 1.48, outerZ = 1.67, rearZ = 1.20;
    poleSpecs.push(segment([inner, 0.06, innerZ], [inner, 10.8, innerZ], 0.027));
    poleSpecs.push(segment([outer, 0.06, outerZ], [outer, 10.75, outerZ], 0.018));
    poleSpecs.push(segment([side * 4.83, 0.08, rearZ], [side * 4.83, 8.28 + side * 0.11, rearZ], 0.013));
    for (const y of [0.18, 0.64, 1.14, 2.39, 3.10, 4.36, 5.50, 6.03, 7.95, 9.53]) {
      clampSpecs.push({ p: [inner, y, innerZ], s: [0.115, 0.087, 0.10] });
      poleSpecs.push(segment([inner, y, innerZ], [outer, y, outerZ], 0.012));
      collars.push({ p: [outer, y, outerZ], s: [0.035, 0.069, 0.035] });
      boltSpecs.push({ p: [inner + side * 0.066, y, innerZ], s: [0.022, 0.02, 0.022], r: [0, 0, Math.PI / 2] });
    }
    for (const [x, z] of [[inner, innerZ], [outer, outerZ], [side * 4.83, rearZ]]) {
      footSpecs.push({ p: [x, 0.045, z], s: [0.105, 0.026, 0.105] });
      footRubber.push({ p: [x, 0.027, z], s: [0.091, 0.014, 0.091] });
      poleSpecs.push(segment([x, 0.055, z], [x, 0.25, z], 0.036));
    }
    // Uneven small mounting modules are cable junctions, not additional screens.
    for (let i = 0; i < 6; i++) {
      const y = 0.6 + i * 1.23 + rand() * 0.28;
      const x = inner + side * (0.10 + rand() * 0.05);
      connectorSpecs.push({ p: [x, y, innerZ - .12], s: [0.17, 0.23 + rand() * 0.06, 0.14] });
      clampSpecs.push({ p: [x, y - 0.08, innerZ - .202], s: [0.21, 0.025, 0.16] });
      boltSpecs.push({ p: [x, y + 0.05, innerZ - .04], s: [0.013, 0.012, 0.013], r: [Math.PI / 2, 0, 0] });
    }
  }
  const hangingRods = [
    { x: -3.45, z: arcZ(-3.45), bottom: 6.01, radius: 0.014 },
    { x: -1.79, z: arcZ(-1.79), bottom: 2.54, radius: 0.013 },
    { x: 0, z: arcZ(0), bottom: 7.86, radius: 0.010 },
    { x: 1.68, z: arcZ(1.68), bottom: 2.62, radius: 0.012 },
    { x: 3.47, z: arcZ(3.47), bottom: 6.14, radius: 0.014 },
  ];
  for (const { x, z, bottom, radius } of hangingRods) {
    poleSpecs.push(segment([x, bottom, z], [x, 10.8, z], radius));
    for (const y of [arcY(x), bottom + 0.14, Math.max(bottom + 0.35, 7.75)]) {
      clampSpecs.push({ p: [x, y, z], s: [0.091, 0.15, 0.09] });
      boltSpecs.push({ p: [x + 0.052, y + 0.02, z], s: [0.021, 0.014, 0.021], r: [0, 0, Math.PI / 2] });
      poleSpecs.push(segment([x, y - 0.10, z], [x, y - 0.10, z + 0.18], 0.013));
    }
  }
  for (const x of [-3.04, -1.29, 1.18, 2.94]) {
    const z = arcZ(x);
    poleSpecs.push(segment([x, arcY(x), z], [x, 7.69, z], 0.010));
    clampSpecs.push({ p: [x, 7.82, z], s: [0.061, 0.14, 0.08] });
  }
  for (const x of [-1.79, 1.68]) {
    const z = arcZ(x);
    poleSpecs.push(segment([x, .15, z], [x, 3.12, z], .015));
    footSpecs.push({ p: [x, .04, z], s: [.075, .02, .075] });
    footRubber.push({ p: [x, .025, z], s: [.065, .012, .065] });
  }
  instances(group, 'structure.uprightsAndHangers', unitCylinder, metal, poleSpecs);
  instances(group, 'structure.clamps', unitBox, metal, clampSpecs);
  instances(group, 'structure.collarSleeves', unitCylinder, metal, collars);
  instances(group, 'structure.fasteners', unitCylinder, metal, boltSpecs);
  instances(group, 'structure.junctionBoxes', unitBox, dark, connectorSpecs);
  instances(group, 'structure.footPlates', unitCylinder, metal, footSpecs);
  instances(group, 'structure.rubberFootPads', unitCylinder, rubber, footRubber);
  const arcAngles = Array.from({ length: 17 }, (_, i) => -1.4 + i * 2.8 / 16);
  const upperArc = arcAngles.map(theta => [4.5 * Math.sin(theta), 8.15 + 1.45 * Math.sin(theta) ** 2, 2.2 - 4.5 * Math.cos(theta)]);
  const floorArc = upperArc.map(([x, , z]) => [x, .15, z]);
  tubes(group, 'structure.curvedRails', [
    { points: upperArc, radius: .028, segments: 100 },
    { points: floorArc, radius: .017, segments: 100 },
    { points: upperArc.map(([x,y,z]) => [x,y+.044,z-.018]), radius: .009, segments: 100 },
  ], metal);

  const cables = [], thinCables = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < 10; i++) {
      const x = side * (4.02 + rand() * 0.48);
      const top = 3.10 + rand() * 5.65;
      const drop = 0.65 + rand() * 1.15;
      const z = 1.30 + rand() * .45;
      const points = [
        [x, top, z],
        [x - side * .12, top - .22, z + .09],
        [x - side * (.13 + rand() * .16), top - drop, z + .1],
        [x + side * .13, top - drop - .04, z],
        [side * 4.42, top - drop + .2, 1.48],
      ];
      (i % 3 === 0 ? thinCables : cables).push({ points, radius: i % 3 === 0 ? .007 : .012, segments: 26 });
    }
    cables.push({ points: [[side*4.42,1.3,1.48],[side*4.66,.42,1.67],[side*4.82,.27,1.57],[side*4.91,.72,1.36],[side*4.68,1.12,1.4]],radius:.016,segments:40 });
    thinCables.push({ points: [[side*4.58,9.0,1.47],[side*4.69,8.7,1.55],[side*4.62,5.6,1.56],[side*4.69,2.3,1.54],[side*4.51,.7,1.55]],radius:.007,segments:64 });
  }
  tubes(group, 'structure.blackHarnesses', cables, cable);
  tubes(group, 'structure.tanSignalLeads', thinCables, tanCable);
  for (const [name, position] of [['left',[-4.42,4.5,1.48]],['right',[4.42,4.5,1.48]],['top',[0,8.15,-2.3]]]) {
    const anchor = new THREE.Object3D();
    anchor.name = `structure.anchor.${name}`;
    anchor.position.set(...position);
    group.add(anchor);
  }
  return group;
}

export function createStool(materials) {
  const group = new THREE.Group();
  group.name = 'stool';
  group.userData = { id: 'stool', interactionId: 'stool', kind: 'seat' };
  const ivory = new THREE.MeshPhysicalMaterial({
    color: materials.cream?.color?.clone() || new THREE.Color(0xe1d7bc),
    roughness: .31, metalness: .015, clearcoat: .26, clearcoatRoughness: .32,
  });
  const lathe = (name, points, material) => {
    const profile = new THREE.SplineCurve(points.map(p => new THREE.Vector2(...p))).getPoints(96);
    const mesh = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), material);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };
  lathe('stool.pedestal', [
    [0,.065],[.47,.065],[.69,.07],[.72,.09],[.70,.12],[.61,.15],
    [.48,.20],[.32,.28],[.19,.40],[.12,.55],[.087,.76],[.08,1.04],
    [.09,1.24],[.13,1.40],[.23,1.54],[.35,1.60],[0,1.60],
  ], ivory);
  const seat = lathe('stool.seat', [
    [0,1.48],[.18,1.49],[.35,1.53],[.53,1.61],[.69,1.70],
    [.80,1.80],[.85,1.862],[.846,1.88],[.81,1.89],[.72,1.875],
    [.57,1.825],[.39,1.785],[.18,1.77],[0,1.77],
  ], ivory);
  seat.scale.z = .74;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.704, .012, 6, 96), materials.rubber || materials.dark);
  rim.name = 'stool.baseRim';
  rim.rotation.x = Math.PI / 2;
  rim.position.y = .066;
  group.add(rim);
  const anchor = new THREE.Object3D();
  anchor.name = 'stool.anchor';
  anchor.position.set(0, 1.80, 0);
  group.add(anchor);
  return group;
}
