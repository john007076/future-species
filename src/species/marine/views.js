import * as THREE from 'three';
import {createMarineWater} from './water.js';
import {createMarineOptics} from './optics.js';
import {createMarineResonator} from './resonator.js';
import {createMarineSignalTexture} from './surface.js';
import {createDepthEnvironment} from './environment.js';
import {roamingPose} from './population.js';
import {SPECIES} from './state.js';
import {createMarineFauna} from './fauna.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

const TAU = Math.PI * 2;
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
const noise = n => { const f = Math.sin(n * 127.1 + 31.7) * 43758.5453; return f - Math.floor(f); };
const NAMES = {
  jelly: ['ECHO MEDUSA', 'Echo medusa', 'SILICONE / RECEIVER / NERVE'],
  fish: ['VITREOUS PISCIS', 'Vitreous fish', 'GLASS / VERTEBRA / CAPACITOR'],
  mollusc: ['SALINE LIMAX', 'Saline mollusc', 'HYDROGEL / CORROSION / SIPHON'],
  whale: ['SPERMACETI RELAY', 'Sperm whale', 'CETACEAN TISSUE / FLUKE / RESONATOR'],
  shark: ['CARTILAGE RECEIVER', 'Shark', 'GILL ARRAY / CARTILAGE / COPPER'],
  angelfish: ['VEILED ANGEL', 'Angelfish', 'GREY VIOLET / FIN MEMBRANE / NERVE'],
  butterflyfish: ['AMBER WING', 'Butterflyfish', 'OLD AMBER / OCCELLUS / CIRCUIT'],
  tang: ['ROSE SCAR', 'Tang', 'OLD ROSE / SCALPEL / BIOPHOTON'],
  algae: ['MNEMONIC KELP', 'Mnemonic kelp', 'SEAFOAM / BLADDER / FLEXIBLE VEIN'],
};
const MOTION = {
  jelly: {scale: 1, yaw: .08, pitch: .13, approachX: .7, approachY: -1.4, escapeX: 1.6, escapeY: 2.2, escapeZ: 23, turn: .65, roll: .08, detail: [1.9, .65, 2.1], focus: [.05, .45, 0]},
  fish: {scale: 1, yaw: -.25, pitch: .08, approachX: -2.8, approachY: .5, escapeX: 5.5, escapeY: 1.4, escapeZ: 25, turn: -1.1, roll: .16, detail: [-.1, 1.5, 2.4], focus: [-.2, .1, 0]},
  mollusc: {scale: 1, yaw: .06, pitch: .08, approachX: 1.8, approachY: .5, escapeX: -3.5, escapeY: .6, escapeZ: 18, turn: .8, roll: .18, detail: [-.1, 1.5, 2.4], focus: [-.2, .1, 0]},
  whale: {scale: 1.05, yaw: -.26, pitch: .17, approachX: -1.1, approachY: .45, escapeX: .8, escapeY: .45, escapeZ: 23, turn: -.2, roll: .018, detail: [-1.65, .65, 2.65], focus: [-.9, .1, 0]},
  shark: {scale: 1, yaw: -.22, pitch: .035, approachX: 2.2, approachY: .4, escapeX: 7, escapeY: 1.4, escapeZ: 18, turn: -.8, roll: .08, detail: [-1.6, .65, 1.85], focus: [-.72, .02, 0]},
  angelfish: {scale: .95, yaw: -.3, pitch: .04, approachX: -1.8, approachY: -.4, escapeX: 3.4, escapeY: 1.8, escapeZ: 23, turn: -.85, roll: .12, detail: [-.25, .35, 2.4], focus: [-.15, .08, 0]},
  butterflyfish: {scale: 1.05, yaw: -.32, pitch: .04, approachX: 1.7, approachY: -.35, escapeX: -3.6, escapeY: 1.2, escapeZ: 24, turn: .9, roll: -.1, detail: [-.25, .35, 2.35], focus: [-.12, .08, 0]},
  tang: {scale: 1.1, yaw: -.26, pitch: .04, approachX: -1.5, approachY: .3, escapeX: 4.5, escapeY: .7, escapeZ: 26, turn: -1.05, roll: .08, detail: [-.15, .35, 2.3], focus: [-.05, .03, 0]},
  algae: {scale: 1, yaw: .08, pitch: 0, approachX: 0, approachY: -1.5, escapeX: 0, escapeY: 0, escapeZ: 1.4, turn: 0, roll: 0, detail: [1.1, .15, 2.2], focus: [.15, -.05, 0]},
};

function canvasTexture(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = texture.magFilter = THREE.LinearFilter;
  return {canvas, ctx: canvas.getContext('2d'), texture};
}

export function createMarineViews({renderer}) {
  if (!renderer?.isWebGLRenderer) throw new TypeError('MARINE views require the installation renderer.');
  const resources = new Set(), timeUniform = {value: 0};
  const keep = value => { resources.add(value); return value; };
  const material = values => keep(new THREE.MeshPhysicalMaterial(values));
  const membraneMap = new THREE.DataTexture(new Uint8Array(128 * 128 * 4), 128, 128);
  for (let i = 0; i < 128 * 128; i++) {
    const x = i % 128, y = Math.floor(i / 128);
    const grain = 178 + noise(i + 73) * 26 + Math.sin(x * .27 + Math.sin(y * .12) * 2) * 20 + Math.sin(y * .19) * 12;
    membraneMap.image.data.set([grain, grain, grain, 255], i * 4);
  }
  membraneMap.wrapS = membraneMap.wrapT = THREE.RepeatWrapping;
  membraneMap.repeat.set(3, 3); membraneMap.needsUpdate = true; keep(membraneMap);
  const scanMap=keep(createMarineSignalTexture());
  const glass = material({color: 0xd7e7e2, emissive:0x94cacb,emissiveIntensity:.025, iridescence:.24, iridescenceIOR:1.34, transmission: .92, thickness: .11, ior: 1.36, roughness: .12, sheen:.25,sheenColor:0xa4c9bf,sheenRoughness:.6, metalness: 0, clearcoat: .07, clearcoatRoughness: .3, attenuationColor: 0x8dbab7, attenuationDistance: 1.45, roughnessMap: membraneMap, thicknessMap: membraneMap, bumpMap: membraneMap, bumpScale: .009, side: THREE.FrontSide});
  const pink = material({color: 0xeadde2, emissive:0xc9acb8,emissiveIntensity:.025, iridescence:.28, transmission: .90, thickness: .12, ior: 1.35, roughness: .18, metalness: 0, clearcoat: .06, clearcoatRoughness: .3, attenuationColor: 0xc795a6, attenuationDistance: 1.6, roughnessMap: membraneMap, thicknessMap: membraneMap, bumpMap: membraneMap, bumpScale: .008, side: THREE.FrontSide});
  const standard = values => keep(new THREE.MeshStandardMaterial(values));
  const chrome = standard({color: 0xc0d0cc, metalness: .48, roughness: .34});
  const brass = standard({color: 0x8b705c, metalness: .78, roughness: .38});
  const dark = standard({color: 0x142827, metalness: .58, roughness: .43});
  const organ = material({color:0xa4dbd1,emissive:0x4e9f98,emissiveIntensity:.45,roughness:.26,transmission:.12,thickness:.08,ior:1.36,bumpMap:membraneMap,bumpScale:.012});
  const board = standard({color: 0x294a43, metalness: .38, roughness: .42});
  const flex = glass.clone(); keep(flex); flex.thickness = .05; flex.roughness = .2;flex.emissiveIntensity=.16;
  const wire = brass;

  function mesh(parent, geometry, mat, position = [0, 0, 0], scale = [1, 1, 1]) {
    keep(geometry);
    const result = new THREE.Mesh(geometry, mat);
    result.position.set(...position); result.scale.set(...scale); parent.add(result); return result;
  }
  function tube(parent, points, radius, mat, segments = 32) {
    return mesh(parent, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point))), segments, radius, 7, false), mat);
  }
  function sphere(parent, position, scale, mat, segments = 28) {
    return mesh(parent, new THREE.SphereGeometry(1, segments, 18), mat, position, scale);
  }
  function ring(parent, radius, thickness, position, mat = chrome) {
    const result = mesh(parent, new THREE.TorusGeometry(radius, thickness, 6, 36), mat, position);
    return result;
  }
  function circuit(parent, position, scale = 1) {
    const group = new THREE.Group(); group.position.set(...position); group.scale.setScalar(scale); parent.add(group);
    mesh(group, new THREE.BoxGeometry(.3, .46, .045), board);
    for (let i = 0; i < 5; i++) {
      mesh(group, new THREE.BoxGeometry(.04, .065, .04), i % 2 ? chrome : dark, [-.09 + (i % 2) * .18, -.16 + i * .075, .035]);
      tube(group, [[-.13, -.2 + i * .075, .025], [.06, -.2 + i * .075, .025], [.09, -.15 + i * .075, .025]], .004, brass, 3);
    }
    mesh(group, new THREE.BoxGeometry(.095, .13, .06), dark, [0, .04, .04]);
    return group;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x03132e);
  scene.fog = new THREE.FogExp2(0x062143, .025);
  const room = new RoomEnvironment(), pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromScene(room, .025);
  room.dispose(); pmrem.dispose();
  scene.environment = environmentTarget.texture; scene.environmentIntensity = .65;
  scene.add(new THREE.HemisphereLight(0x9dbfc2, 0x33423b, 1.2));
  const light = new THREE.DirectionalLight(0xf0e1bd, 2.6); light.position.set(-4, 6, 5); scene.add(light);
  const pinkLight = new THREE.DirectionalLight(0xc5a2ae, 1.05); pinkLight.position.set(4, 1, -3); scene.add(pinkLight);
  const blueLight = new THREE.DirectionalLight(0x9ccecb, 1.8); blueLight.position.set(-4, -1, -3); scene.add(blueLight);
  const backdrop = canvasTexture(512, 512); keep(backdrop.texture);
  const bg = backdrop.ctx.createLinearGradient(0, 0, 0, 512);
  bg.addColorStop(0, '#02375f'); bg.addColorStop(.35, '#031d3c'); bg.addColorStop(1, '#020c23');
  backdrop.ctx.fillStyle = bg; backdrop.ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 16; i++) {
    const x = noise(i + 22) * 512, y = noise(i + 33) * 300;
    const haze = backdrop.ctx.createRadialGradient(x, y, 0, x, y, 180);
    haze.addColorStop(0, '#508ee81a'); haze.addColorStop(1, '#508ee800');
    backdrop.ctx.fillStyle = haze; backdrop.ctx.fillRect(0, 0, 512, 512);
  }
  backdrop.texture.needsUpdate = true;
  const depthEnvironment=createDepthEnvironment();scene.add(depthEnvironment.mesh);
  const debris = new THREE.Group(); scene.add(debris);
  const dustGeometry = keep(new THREE.BufferGeometry()), dust = new Float32Array(110 * 3);
  for (let i = 0; i < 110; i++) dust.set([(noise(i + 71) - .5) * 20, (noise(i + 501) - .5) * 11, -noise(i + 901) * 20], i * 3);
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  const sediment = new THREE.Points(dustGeometry, keep(new THREE.PointsMaterial({color: 0xc2d7ce, size: .018, transparent: true, opacity: .3, depthWrite: false})));
  scene.add(sediment);

  // Closed membranes carry thickness at their rims; the skeleton is independent of the skin.
  function shellSurface(lengthSegments, radialSegments, sample, thickness = .025) {
    const positions = [], uv = [], indices = [], layerSize = (lengthSegments + 1) * (radialSegments + 1);
    for (let layer = 0; layer < 2; layer++) for (let i = 0; i <= lengthSegments; i++) for (let j = 0; j <= radialSegments; j++) {
      positions.push(...sample(i / lengthSegments, j / radialSegments * TAU, layer * thickness)); uv.push(i / lengthSegments, j / radialSegments);
    }
    for (let layer = 0; layer < 2; layer++) for (let i = 0; i < lengthSegments; i++) for (let j = 0; j < radialSegments; j++) {
      const a = layer * layerSize + i * (radialSegments + 1) + j, b = a + radialSegments + 1;
      if (layer === 0) indices.push(a, a + 1, b, a + 1, b + 1, b);
      else indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
    for (const i of [0, lengthSegments]) for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j, b = a + layerSize;
      if (i === 0) indices.push(a, b, a + 1, a + 1, b, b + 1);
      else indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(indices); geometry.computeVertexNormals();
    return geometry;
  }
  function bakeFlexiblePart(object){
    // CPU tissue deformation operates in specimen coordinates, including hinge offsets.
    object.updateMatrix();object.geometry.applyMatrix4(object.matrix);object.position.set(0,0,0);object.rotation.set(0,0,0);object.scale.set(1,1,1);return object;
  }
  let contactField={active:false};
  function deform(object, transform) {
    const positions = object.geometry.attributes.position;
    object.userData.restPositions ||= positions.array.slice();
    const rest = object.userData.restPositions;
    for (let i = 0; i < positions.count; i++) {
      const p = transform(rest[i * 3], rest[i * 3 + 1], rest[i * 3 + 2]);
      if(contactField.active)p[2]+=Math.exp(-((p[0]-contactField.x*1.6)**2+(p[1]-contactField.y*1.5)**2)*2)*contactField.strength*.18;
      positions.setXYZ(i, ...p);
    }
    positions.needsUpdate = true; object.geometry.computeVertexNormals(); object.geometry.computeBoundingSphere();
  }
  function fasteners(parent, points, radius = .022) {
    const headGeometry = keep(new THREE.CylinderGeometry(radius, radius, .017, 6)); headGeometry.rotateX(Math.PI / 2);
    const slotGeometry = keep(new THREE.BoxGeometry(radius * 1.15, radius * .18, .002));
    const heads = new THREE.InstancedMesh(headGeometry, chrome, points.length), slots = new THREE.InstancedMesh(slotGeometry, dark, points.length);
    const dummy = new THREE.Object3D();
    points.forEach(({p, n}, i) => {
      const normal = new THREE.Vector3(...n).normalize(); dummy.position.set(...p); dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal); dummy.updateMatrix(); heads.setMatrixAt(i, dummy.matrix);
      dummy.position.addScaledVector(normal, .01); dummy.updateMatrix(); slots.setMatrixAt(i, dummy.matrix);
    });
    parent.add(heads, slots);
  }
  function tendon(parent, points, radius, mat) {
    const path = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), geometry = new THREE.TubeGeometry(path, 44, radius, 9, false);
    const positions = geometry.attributes.position;
    for (let i = 0; i <= 44; i++) {
      const center = path.getPointAt(i / 44), taper = (1 - .78 * (i / 44) ** .8) * (radius > .06 ? 1 + Math.sin(i / 44 * Math.PI * 14) * .14 : 1);
      for (let j = 0; j <= 9; j++) {
        const index = i * 10 + j;
        positions.setXYZ(index, center.x + (positions.getX(index) - center.x) * taper, center.y + (positions.getY(index) - center.y) * taper, center.z + (positions.getZ(index) - center.z) * taper * (radius > .06 ? .48 : 1));
      }
    }
    geometry.computeVertexNormals(); return mesh(parent, geometry, mat);
  }
  function membraneFin(parent, start, length, height, mat, side = 1) {
    const positions = [], uv = [], indices = [], rows = 32, cols = 9;
    for (let i = 0; i <= rows; i++) for (let j = 0; j <= cols; j++) {
      const u = i / rows, v = j / cols;
      const width = Math.sin(u * Math.PI) ** .65 * height;
      positions.push(start[0] + u * length, start[1] + width * v, start[2] + side * v * v * (.06 + Math.sin(u * 7) * .035)); uv.push(u, v);
    }
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) { const a = i * (cols + 1) + j, b = a + cols + 1; indices.push(a, b, a + 1, b, b + 1, a + 1); }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(indices); geometry.computeVertexNormals();
    const finMaterial = keep(mat.clone()); finMaterial.side = THREE.DoubleSide; finMaterial.thickness = .012;
    const membrane = mesh(parent, geometry, finMaterial);
    return membrane;
  }

  const jellyLume = material({color: 0x78b6bc, emissive: 0x4b9aab, emissiveIntensity: .5, roughness: .28});
  const fishLume = material({color: 0xa6bd9c, emissive: 0x7fbdad, emissiveIntensity: .45, roughness: .25});
  const molluscLume = material({color: 0xc4a2a8, emissive: 0xc47891, emissiveIntensity: .35, roughness: .3});
  const specimens = {};
  const jelly = new THREE.Group(); scene.add(jelly); specimens.jelly = jelly;
  const bellProfile = [];
  for (let i = 0; i <= 40; i++) {
    const theta = i / 40 * Math.PI * .59;
    bellProfile.push(new THREE.Vector2(Math.sin(theta) * 1.04, Math.cos(theta) * .77 + .52));
  }
  for (let i = 40; i >= 0; i--) {
    const theta = i / 40 * Math.PI * .59;
    bellProfile.push(new THREE.Vector2(Math.max(.001, Math.sin(theta) * 1.04 - .028), Math.cos(theta) * .77 + .49));
  }
  const bellGeometry = new THREE.LatheGeometry(bellProfile, 96);
  const bellPositions = bellGeometry.attributes.position;
  for (let i = 0; i < bellPositions.count; i++) {
    const x = bellPositions.getX(i), z = bellPositions.getZ(i), y = bellPositions.getY(i), angle = Math.atan2(z, x), skirt = clamp((.9 - y) / .65);
    const scallop = 1 + Math.cos(angle * 12) * .035 * skirt;
    bellPositions.setXYZ(i, x * scallop, y + Math.cos(angle * 12) * .028 * skirt, z * scallop);
  }
  bellGeometry.computeVertexNormals();
  const bell = mesh(jelly, bellGeometry, glass), jellySkin = [bell], jellyArms = [];
  const skirtPoints = [];
  for (let i = 0; i <= 96; i++) {
    const a = i / 96 * TAU, r = .999 * (1 + .035 * Math.cos(a * 12));
    skirtPoints.push([Math.cos(a) * r, .302 + Math.cos(a * 12) * .028, Math.sin(a) * r]);
  }
  jellySkin.push(tube(jelly, skirtPoints, .023, pink, 96));
  const innerCage = new THREE.Group(); jelly.add(innerCage);
  const receiver = mesh(innerCage, new THREE.CylinderGeometry(.14, .19, .54, 36), dark, [0, .58, 0]);
  for (let i = 0; i < 7; i++) ring(innerCage, .17 + Math.sin(i / 6 * Math.PI) * .045, .009, [0, .34 + i * .074, 0], i % 2 ? brass : chrome).rotation.x = Math.PI / 2;
  mesh(innerCage, new THREE.CylinderGeometry(.22, .22, .026, 36), chrome, [0, .87, 0]);
  for (const side of [-1, 1]) {
    sphere(innerCage, [side * .24, .67, .04], [.14, .27, .11], organ, 24);
    tube(innerCage, [[side * .12, .82, 0], [side * .3, .65, .12], [side * .21, .38, .1], [0, .27, 0]], .012, brass, 24);
  }
  circuit(innerCage, [0, .57, .21], .65);
  const acousticOrgan = ring(innerCage, .116, .012, [0, .27, 0], jellyLume); acousticOrgan.rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) mesh(innerCage, new THREE.CapsuleGeometry(.014, .08, 3, 8), jellyLume, [.2, .55 + i * .07, .13]);
  const screws = [];
  for (let i = 0; i < 12; i++) {
    const angle = i / 12 * TAU, c = Math.cos(angle), s = Math.sin(angle);
    tube(innerCage, [[c * .15, .9, s * .15], [c * .57, .88, s * .57], [c * .83, .59, s * .83], [c * .88, .31, s * .88]], .012, i % 3 ? chrome : brass, 28);
    const seam = tube(jelly, [[c * .05, 1.29, s * .05], [c * .6, 1.12, s * .6], [c * .96, .71, s * .96], [c * 1.02, .31, s * 1.02]], .006, pink, 36); jellySkin.push(seam);
    screws.push({p: [c * .88, .32, s * .88], n: [c, .2, s]});
    if (i % 3 === 0) {
      const bracket = mesh(innerCage, new THREE.BoxGeometry(.06, .14, .035), dark, [c * .72, .57, s * .72]); bracket.rotation.y = -angle + Math.PI / 2;
    }
    const length = 1.6 + noise(i + 119) * .85, curl = .22 + noise(i + 217) * .25, tx = -s, tz = c;
    const points = [[c * .92, .32, s * .92], [c * 1.02, -.2, s * 1.02], [c * 1.04 + tx * .08, -.72, s * 1.04 + tz * .08], [c * .78 + tx * curl, -length * .78, s * .78 + tz * curl], [c * .54 + tx * curl * 1.45, -length, s * .54 + tz * curl * 1.45], [c * .46 + tx * curl * 1.05, -length * .94, s * .46 + tz * curl * 1.05]];
    jellyArms.push(tendon(jelly, points, i % 3 ? .038 : .125, i % 3 ? flex : pink));
    if (i % 2 === 0) jellyArms.push(tendon(jelly, points, .004, wire));
  }
  mesh(innerCage,new THREE.LatheGeometry([new THREE.Vector2(.08,-.63),new THREE.Vector2(.22,-.48),new THREE.Vector2(.29,-.12),new THREE.Vector2(.2,.09),new THREE.Vector2(.09,.17)],40),chrome,[0,.17,0]);
  ring(innerCage,.22,.012,[0,-.26,0],brass).rotation.x=Math.PI/2;
  mesh(innerCage,new THREE.CylinderGeometry(.055,.055,.56,16),chrome,[0,-.65,0]);
  mesh(innerCage,new THREE.CylinderGeometry(.16,.16,.035,28),chrome,[0,-.94,0]);
  for(let i=0;i<8;i++){
    const a=i/8*TAU,c=Math.cos(a),s=Math.sin(a);
    const points=[[c*.52,.68,s*.52],[c*.9,.1,s*.9],[c*1.25,-.63,s*1.25],[c*1.45,-1.02,s*1.45]];
    jellyArms.push(tube(jelly,points,.011,chrome,32));
    for(let j=1;j<4;j++){const u=j/3;jellyArms.push(bakeFlexiblePart(sphere(jelly,[c*(.52+u*.82),.68-u*1.55,s*(.52+u*.82)],[.028,.028,.028],brass,10)));}
    const fin=membraneFin(jelly,[0,0,0],1.2,.2,flex);
    fin.position.set(c*.48,.14,s*.48);fin.rotation.set(0,-a,-.72);jellyArms.push(bakeFlexiblePart(fin));
  }
  fasteners(innerCage, screws);
  jelly.userData.animate = (time, state = {}) => {
    const escape = state.phase === 'ESCAPE' ? smooth((state.phaseTime || 0) * 3) : 0;
    const beat = time * 1.35 + (state.phase === 'ESCAPE' ? (state.phaseTime || 0) * 7 : 0);
    const contraction = Math.max(0, Math.sin(beat)) ** 3 * (.07 + escape * .16);
    jellyLume.emissiveIntensity = .25 + (state.phase === 'ECHO' ? .45 : .12) * (.5 + .5 * Math.sin(beat * 2));
    jellySkin.forEach(part => deform(part, (x, y, z) => {
      const lower = clamp((1.2 - y) / .9), squeeze = 1 - contraction * lower;
      return [x * squeeze, y + contraction * (.6 - y) * .42, z * squeeze];
    }));
    jellyArms.forEach(part => deform(part, (x, y, z) => {
      const lag = clamp((.32 - y) / 2.6), angle = Math.atan2(z, x);
      const wake = (Math.sin(beat - lag * 4 + angle) * .16 + Math.sin(beat * .63 - lag * 9 + angle) * .055) * lag * lag;
      return [x * (1 - contraction * (1 - lag)) + wake, y - escape * lag * .22, z * (1 - contraction * (1 - lag)) + Math.cos(beat * .7 - lag * 5 + angle) * .15 * lag * lag];
    }));
    innerCage.rotation.y = Math.sin(time * .18) * .035; receiver.rotation.y = time * .045;
  };

  const fish = new THREE.Group(); scene.add(fish); specimens.fish = fish;
  function fishRadius(u) { return .026 + Math.sin(Math.PI * u) ** .72 * (.55 - u * .36); }
  const fishSkin = mesh(fish, shellSurface(76, 52, (u, a, wall) => {
    const radius = Math.max(.008, fishRadius(u) - wall), x = -1.58 + u * 2.96;
    const cheeks = 1 + .045 * Math.cos(a * 6) * Math.sin(u * Math.PI);
    return [x, .03 + Math.cos(a) * radius * 1.12 * cheeks, Math.sin(a) * radius * .69 * cheeks];
  }, .018), glass);
  const fishFlexible = [fishSkin], vertebrae = [];
  for (let i = 0; i < 13; i++) {
    const u = .11 + i / 12 * .79, x = -1.58 + u * 2.96, radius = fishRadius(u);
    const bone = new THREE.Group(); bone.position.x = x; fish.add(bone); vertebrae.push({bone, x});
    const hinge = mesh(bone, new THREE.CylinderGeometry(.05, .05, .15, 12), dark); hinge.rotation.z = Math.PI / 2;
    const rib = ring(bone, radius * .76, .01, [0, 0, 0], i % 3 ? chrome : brass); rib.rotation.y = Math.PI / 2; rib.scale.x = .66; rib.scale.y = 1.09;
    for (const side of [-1, 1]) tube(bone, [[-.08, -.025, side * .03], [0, -.06, side * radius * .48], [.08, -.02, side * radius * .61]], .008, chrome, 8);
    if (i % 3 === 1) mesh(bone, new THREE.BoxGeometry(.035, .018, .06), fishLume, [0, -.08, .045]);
    if (i < 5) fasteners(bone, [{p: [0, 0, radius * .57], n: [0, 0, 1]}, {p: [0, 0, -radius * .57], n: [0, 0, -1]}], .014);
  }
  for (const side of [-1, 1]) {
    fishFlexible.push(tube(fish, [[-1.1, -.08, side * .11], [-.35, -.12, side * .2], [.5, -.07, side * .1], [1.27, 0, side * .025]], .009, brass, 48));
    const gill = new THREE.Group(); fish.add(gill); gill.position.set(-.73, .02, side * .21);
    for (let i = 0; i < 5; i++) {
      const slit = mesh(gill, new THREE.BoxGeometry(.016, .23 - i * .02, .023), dark, [i * .04, 0, 0]); slit.rotation.z = -.22;
    }
    const eye = mesh(fish, new THREE.CylinderGeometry(.072, .079, .035, 32), chrome, [-1.15, .09, side * .19]); eye.rotation.x = Math.PI / 2;
    const iris = mesh(fish, new THREE.CircleGeometry(.048, 24), dark, [-1.15, .09, side * .211]); iris.rotation.y = side > 0 ? 0 : Math.PI;
    sphere(fish, [-1.15, .09, side * .215], [.05, .05, .018], glass, 24);
  }
  circuit(fish, [-.38, -.02, .16], .83).rotation.z = Math.PI / 2;
  const tail = new THREE.Group(); tail.position.x = 1.2; fish.add(tail);
  for (const side of [-1, 1]) {
    const tailFin = membraneFin(tail, [0, 0, 0], .86, side * .63, pink, side); fishFlexible.push(tailFin);
    for (let i = 1; i < 7; i++) {
      const u = i / 7, x = u * .86, y = Math.sin(u * Math.PI) ** .65 * side * .63;
      tube(tail, [[0, 0, 0], [x * .48, y * .4, .015], [x, y, side * .035]], .005, i % 2 ? chrome : brass, 14);
    }
  }
  const dorsal = membraneFin(fish, [-.75, .2, 0], 1.85, .37, glass); fishFlexible.push(dorsal);
  for (let i = 0; i < 9; i++) {
    const u = (i + 1) / 10, x = -.75 + u * 1.85, height = Math.sin(u * Math.PI) ** .65 * .37;
    fishFlexible.push(tube(fish, [[x, .16, 0], [x + .035, .2 + height * .5, .015], [x + .04, .2 + height, .04]], .004, chrome, 9));
  }
  const pectorals = [];
  for (const side of [-1, 1]) {
    const finGroup = new THREE.Group(); finGroup.position.set(-.45, -.13, side * .19); finGroup.rotation.x = side * 1.1; fish.add(finGroup); pectorals.push(finGroup);
    membraneFin(finGroup, [0, 0, 0], .8, -.34, glass, side);
    for (let i = 0; i < 5; i++) tube(finGroup, [[0, 0, 0], [.2 + i * .075, -.1 - i * .017, 0], [.35 + i * .065, -.3 + i * .025, .04]], .005, brass, 10);
  }
  fish.userData.animate = (time, state = {}) => {
    const escape = state.phase === 'ESCAPE' ? smooth((state.phaseTime || 0) * 3) : 0;
    const beat = time * 2.1 + (state.phase === 'ESCAPE' ? (state.phaseTime || 0) * 7.5 : 0), amplitude = .11 + escape * .27;
    fishLume.emissiveIntensity = .3 + (state.phase === 'ECHO' ? .8 : .15) * (.5 + .5 * Math.sin(time * 2.5));
    const bend = x => Math.sin(x * 2.2 - beat) * Math.max(0, (x + 1.5) / 2.9) ** 1.7 * amplitude;
    fishFlexible.forEach(part => { if (part.parent !== tail) deform(part, (x, y, z) => [x, y + Math.sin(beat * .65 + x) * .008, z + bend(x)]); });
    vertebrae.forEach(({bone, x}) => { bone.position.z = bend(x); bone.rotation.y = -Math.atan2(bend(x + .02) - bend(x - .02), .04); });
    tail.position.z = bend(1.2); tail.rotation.y = -Math.atan2(bend(1.22) - bend(1.18), .04);
    tail.children.filter(part => part.geometry?.attributes.position.count > 100).forEach(part => deform(part, (x, y, z) => [x, y, z + Math.sin(beat - x * 3) * x * .08]));
    pectorals.forEach((part, i) => { part.rotation.x = (i ? 1 : -1) * (1.1 + Math.sin(time * 1.1 - i * .3) * .12); part.rotation.y = Math.sin(time * 1.1) * .08; });
  };

  for(let i=0;i<9;i++){
    const x=-.9+i*.22,r=fishRadius((x+1.58)/2.96);
    const collar=ring(fish,r*.8,.007,[x,.03,0],i%3?chrome:brass);collar.rotation.y=Math.PI/2;collar.scale.x=.68;fishFlexible.push(bakeFlexiblePart(collar));
    sphere(fish,[x,-.06,r*.35],[.015,.022,.012],fishLume,12);
  }
  const mollusc = new THREE.Group(); scene.add(mollusc); specimens.mollusc = mollusc;
  const mantle = mesh(mollusc, shellSurface(88, 56, (u, a, wall) => {
    const radius = Math.max(.008, .018 + Math.sin(Math.PI * u) ** .62 * (.64 - .26 * u) - wall);
    const folds = 1 + .055 * Math.cos(a * 7 + u * 2) + .035 * Math.sin(u * Math.PI * 24) * Math.sin(Math.PI * u);
    return [-1.65 + u * 3.18, .02 + Math.sin(u * Math.PI) * .2 + Math.cos(a) * radius * folds, Math.sin(a) * radius * .83 * folds];
  }, .024), pink);
  const molluscFlexible = [mantle], innerSegments = [];
  for (let i = 0; i < 12; i++) {
    const u = .14 + i / 11 * .73, x = -1.65 + u * 3.18, radius = Math.sin(u * Math.PI) * (.38 - .12 * u);
    const part = new THREE.Group(); part.position.set(x, Math.sin(u * Math.PI) * .2, 0); mollusc.add(part); innerSegments.push({part, x, y: part.position.y});
    const collar = ring(part, radius, .013, [0, 0, 0], i % 4 ? chrome : brass); collar.rotation.y = Math.PI / 2; collar.scale.x = .74;
    const axis = mesh(part, new THREE.CylinderGeometry(.06, .06, .16, 12), dark); axis.rotation.z = Math.PI / 2;
    if (i % 3 === 0) {
      tube(part, [[-.06, -.11, .12], [0, -.04, .15], [.06, -.08, .12]], .008, molluscLume, 12);
      sphere(part, [0, -.12, .02], [.12, .16, .11], organ, 20);
      fasteners(part, [{p: [0, 0, radius * .73], n: [0, 0, 1]}], .018);
    }
  }
  for (const side of [-1, 1]) {
    molluscFlexible.push(tube(mollusc, [[-1.25, .05, side * .12], [-.6, .35, side * .25], [.4, .25, side * .23], [1.35, -.02, side * .04]], .018, brass, 52));
    for (let i = 0; i < 7; i++) {
      const u = .15 + i * .11, x = -1.65 + u * 3.18;
      const leaf = membraneFin(mollusc, [x - .17, -.03, side * (.35 + .08 * Math.sin(u * Math.PI))], .56, -.31, flex, side);
      leaf.rotation.x = side * .38; molluscFlexible.push(leaf);
    }
  }
  circuit(mollusc, [-.5, .16, .32], .7).rotation.z = Math.PI / 2;
  const mouth = new THREE.Group(); mouth.position.set(-1.5, .08, 0); mollusc.add(mouth);
  const siphonGeometry = new THREE.LatheGeometry([new THREE.Vector2(.13, 0), new THREE.Vector2(.13, .12), new THREE.Vector2(.18, .31), new THREE.Vector2(.22, .42), new THREE.Vector2(.2, .42), new THREE.Vector2(.16, .3), new THREE.Vector2(.11, .12), new THREE.Vector2(.11, 0)], 40);
  const siphon = mesh(mouth, siphonGeometry, glass); siphon.rotation.z = Math.PI / 2;
  for (let i = 0; i < 3; i++) ring(mouth, .13 + i * .022, .009, [-.1 - i * .11, 0, 0], chrome).rotation.y = Math.PI / 2;
  for (const side of [-1, 1]) {
    molluscFlexible.push(tendon(mollusc, [[-1.18, .2, side * .16], [-1.4, .48, side * .24], [-1.45, .75, side * .25], [-1.3, .88, side * .22]], .038, glass));
    molluscFlexible.push(tendon(mollusc, [[.85, .3, side * .13], [1, .6, side * .21], [.98, .78, side * .25], [.88, .85, side * .22]], .026, glass));
  }
  for(let i=0;i<16;i++){
    const u=.12+i*.048,x=-1.65+u*3.18,r=Math.sin(u*Math.PI)*(.49-.18*u);
    const collar=ring(mollusc,r,.006,[x,.02+Math.sin(u*Math.PI)*.2,0],i%4?glass:brass);collar.rotation.y=Math.PI/2;collar.scale.x=.83;molluscFlexible.push(bakeFlexiblePart(collar));
  }
  mollusc.userData.animate = (time, state = {}) => {
    const escape = state.phase === 'ESCAPE' ? smooth((state.phaseTime || 0) * 3) : 0;
    const beat = time * 1.45 + (state.phase === 'ESCAPE' ? (state.phaseTime || 0) * 4 : 0);
    molluscLume.emissiveIntensity = .2 + (state.phase === 'ECHO' ? .38 : .1) * (.5 + .5 * Math.sin(time * 1.7));
    const offset = x => Math.sin(x * 2.6 - beat) * (.065 + escape * .11);
    molluscFlexible.forEach(part => deform(part, (x, y, z) => {
      const peristalsis = 1 + Math.sin(x * 3 - beat) * (.027 + escape * .02);
      return [x, y * peristalsis + offset(x), z * peristalsis + Math.sin(x * 1.8 - beat * .65) * .035];
    }));
    innerSegments.forEach(({part, x, y}) => { part.position.y = y + offset(x); part.rotation.z = Math.atan2(offset(x + .02) - offset(x - .02), .04); });
    mouth.position.y = .08 + offset(-1.5); mouth.rotation.z = Math.cos(beat + 1.5) * .08;
  };

  Object.assign(specimens, createMarineFauna({scene, keep, glass, pink, chrome, brass, dark, organ, board}));
  for (const [id, root] of Object.entries(specimens)) root.name = `marine.${id}`;

  for(const [id,root] of Object.entries(specimens)){
    if(!['jelly','fish','mollusc'].includes(id))continue;
    const color=id==='jelly'?0x9fcaca:id==='fish'?0xc3caa0:0xc5a3b1;
    const signalMaterial=standard({color,emissive:color,emissiveIntensity:.65,roughness:.45});
    const points=id==='jelly'?[[0,.7,.12],[.24,.46,.08],[-.24,.46,.08]]:[[-.8,.1,.08],[0,.12,.07],[.7,.06,.03]];
    points.forEach(([x,y,z],i)=>{const light=new THREE.PointLight(color,.45,1.5,2);light.position.set(x,y,z);root.add(light);sphere(root,[x,y,z],[.025,.055,.023],signalMaterial,12);});
  }

  // Fibres follow each existing membrane's own triangles, rather than a generic outer cage.
  for(const [index,root] of Object.values(specimens).entries()){
    root.updateMatrixWorld(true);const fibres=[],cells=[];
    root.traverse(part=>{const g=part.geometry;if(!part.isMesh||!g?.index||g.attributes.position.count<1500)return;
      const p=g.attributes.position,ids=g.index;const count=Math.min(600,Math.floor(ids.count/18));
      for(let i=0;i<count;i++){const at=Math.floor(noise(i+index*719)*ids.count/3)*3;
        const a=new THREE.Vector3().fromBufferAttribute(p,ids.getX(at)).applyMatrix4(part.matrixWorld).multiplyScalar(.965);
        const b=new THREE.Vector3().fromBufferAttribute(p,ids.getX((at+31)%ids.count)).applyMatrix4(part.matrixWorld).multiplyScalar(.965);
        const c=new THREE.Vector3().fromBufferAttribute(p,ids.getX(at+2)).applyMatrix4(part.matrixWorld).multiplyScalar(.94);
        let previous=a;for(let step=1;step<=6;step++){const u=step/6,next=a.clone().lerp(b,u);next.z+=Math.sin(u*Math.PI)*.008*Math.sin(i*2.4);fibres.push(...previous,...next);previous=next;}
        const mid=a.clone().lerp(b,.48);fibres.push(...mid,...c);if(i%13===0)cells.push(a);
      }
    });
    const g=keep(new THREE.BufferGeometry());g.setAttribute('position',new THREE.Float32BufferAttribute(fibres,3));
    root.add(new THREE.LineSegments(g,keep(new THREE.LineBasicMaterial({color:new THREE.Color().setHSL(.49+index*.028,.22,.64),transparent:false}))));
    const cellMaterial=material({color:new THREE.Color().setHSL(.18+index*.071,.23,.67),roughness:.37,metalness:.1,transmission:.32,thickness:.025,emissive:0x395b78,emissiveIntensity:.22});
    const nodes=new THREE.InstancedMesh(keep(new THREE.IcosahedronGeometry(1,1)),cellMaterial,cells.length),matrix=new THREE.Matrix4();
    cells.forEach((position,i)=>{const r=.013+noise(i+index*41)*.022;matrix.compose(position,new THREE.Quaternion(),new THREE.Vector3(r,r*1.8,r*.65));nodes.setMatrixAt(i,matrix);});keep(nodes);root.add(nodes);
  }
  const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=64;const glowContext=glowCanvas.getContext('2d'),glowPixels=glowContext.createImageData(64,64);
  for(let y=0;y<64;y++)for(let x=0;x<64;x++){const a=Math.exp(-((x-31.5)**2+(y-31.5)**2)/150);glowPixels.data.set([255,255,255,Math.round(a*255)],(y*64+x)*4);}glowContext.putImageData(glowPixels,0,0);
  const glowTexture=keep(new THREE.CanvasTexture(glowCanvas));
  const glowColors=[0x8acbd2,0xa5cabe,0xc59cae,0x88b8d5,0x83b9b9,0xb49bc9,0xd1b781,0xc38ea5,0x9fc7b2];
  const tissueGlows=new Map();
  Object.entries(specimens).forEach(([id,root],i)=>{
    const points=id==='jelly'?[[0,.6,.08],[.2,.27,.08],[-.2,.2,.08]]:id==='algae'?[[.1,-.7,0],[.23,.3,0],[-.12,.85,0]]:[[-.8,.12,.05],[0,.04,.05],[.6,.04,.03]];
    const mat=keep(new THREE.SpriteMaterial({map:glowTexture,color:glowColors[i],opacity:.2,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:false,toneMapped:false}));
    tissueGlows.set(id,mat);
    points.forEach(p=>{const glow=new THREE.Sprite(mat);glow.position.set(...p);glow.scale.set(.5,.7,1);root.add(glow);});
  });
  const water=createMarineWater(scene),optics=createMarineOptics({scanMap});
  for(const mat of [glass,pink,chrome,brass,organ,board])water.caustics(mat);
  const camera = new THREE.PerspectiveCamera(39, 640 / 496, .1, 80); camera.position.set(0, .15, 7.5); camera.lookAt(0, -.15, 0);
  const detailCamera = new THREE.PerspectiveCamera(34, 448 / 360, .05, 80);
  const mainTarget = keep(new THREE.WebGLRenderTarget(800, 620, {depthBuffer: true, samples: 0}));
  const detailTarget = keep(new THREE.WebGLRenderTarget(520, 416, {depthBuffer: true, samples: 0}));
  for (const target of [mainTarget, detailTarget]) { target.texture.colorSpace = THREE.SRGBColorSpace; target.texture.name = 'MARINE volumetric specimen'; }
  const mainOutput=keep(new THREE.WebGLRenderTarget(800,620)),detailOutput=keep(new THREE.WebGLRenderTarget(520,416));
  for(const output of [mainOutput,detailOutput])output.texture.colorSpace=THREE.SRGBColorSpace;
  const signalTarget=keep(new THREE.WebGLRenderTarget(600,546,{depthBuffer:true,samples:0})),signalOutput=keep(new THREE.WebGLRenderTarget(600,546));
  signalTarget.texture.colorSpace=signalOutput.texture.colorSpace=THREE.SRGBColorSpace;
  const resonator=createMarineResonator(environmentTarget.texture),archive = canvasTexture(1200, 1140);keep(archive.texture);
  const textures = new Map([['screen.upper_right', mainOutput.texture], ['screen.right.01', signalOutput.texture], ['screen.right.02', detailOutput.texture], ['screen.right.03', archive.texture]]);
  let frames = 0, disposed = false, lastArchive = '', lastPhase = '', renderMs = 0, totalRenderMs = 0;
  // Render the real nine specimens once; the index reuses these images without nine extra live passes.
  const atlasImages=new Map();
  function buildAtlas(){
    const target=renderer.getRenderTarget(),viewport=renderer.getViewport(new THREE.Vector4()),scissor=renderer.getScissor(new THREE.Vector4()),scissorTest=renderer.getScissorTest(),autoClear=renderer.autoClear;
    const thumbnailTarget=new THREE.WebGLRenderTarget(330,150),lens=new THREE.OrthographicCamera(-1,1,1,-1,.05,40);
    thumbnailTarget.texture.colorSpace=THREE.SRGBColorSpace;
    const savedBackground=scene.background,savedFog=scene.fog,savedColor=renderer.getClearColor(new THREE.Color()),savedAlpha=renderer.getClearAlpha();
    const saved=Object.values(specimens).map(root=>({root,visible:root.visible,position:root.position.clone(),rotation:root.rotation.clone(),scale:root.scale.clone()}));
    try{
      scene.background=null;scene.fog=null;depthEnvironment.mesh.visible=false;renderer.setClearColor(0x000000,0);
      water.setVisible(false);debris.visible=false;sediment.visible=false;renderer.autoClear=true;renderer.setScissorTest(false);
      for(const root of Object.values(specimens))root.visible=false;
      for(const [id,root] of Object.entries(specimens)){
        root.visible=true;root.position.set(0,0,0);root.rotation.set(.08,-.2,0);root.scale.setScalar(1);root.userData.animate(0,{});root.updateMatrixWorld(true);
        const bounds=new THREE.Box3().setFromObject(root),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3()),half=Math.max(size.y*.6,size.x/2.2*.6,.4);
        lens.left=-half*2.2;lens.right=half*2.2;lens.top=half;lens.bottom=-half;lens.position.copy(center).add(new THREE.Vector3(0,0,9));lens.lookAt(center);lens.updateProjectionMatrix();
        renderer.setRenderTarget(thumbnailTarget);renderer.clear();renderer.render(scene,lens);
        const pixels=new Uint8Array(330*150*4);renderer.readRenderTargetPixels(thumbnailTarget,0,0,330,150,pixels);
        const image=document.createElement('canvas');image.width=330;image.height=150;const ctx=image.getContext('2d'),data=ctx.createImageData(330,150);
        for(let y=0;y<150;y++)data.data.set(pixels.subarray((149-y)*330*4,(150-y)*330*4),y*330*4);
        ctx.putImageData(data,0,0);atlasImages.set(id,image);root.visible=false;
      }
    }finally{
      scene.background=savedBackground;scene.fog=savedFog;depthEnvironment.mesh.visible=true;renderer.setClearColor(savedColor,savedAlpha);
      for(const s of saved){s.root.visible=s.visible;s.root.position.copy(s.position);s.root.rotation.copy(s.rotation);s.root.scale.copy(s.scale);}
      water.setVisible(true);debris.visible=true;sediment.visible=true;renderer.setRenderTarget(target);renderer.setViewport(viewport);renderer.setScissor(scissor);renderer.setScissorTest(scissorTest);renderer.autoClear=autoClear;thumbnailTarget.dispose();
    }
  }
  buildAtlas();
  const habitat=new THREE.Group();scene.add(habitat);
  const filaments=[];
  for(let colony=0;colony<6;colony++)for(let strand=0;strand<36;strand++){
    const a=strand/36*TAU,cx=(colony%2?1:-1)*(5+colony*.8),cy=(colony%3-1)*2.8,cz=-10-colony*2;
    for(let j=0;j<48;j++)for(let end=0;end<2;end++){
      const u=(j+end)/48,r=Math.sin(u*Math.PI)**1.6*(1.4+noise(colony)*1.8),twist=a+u*2.5;
      filaments.push(cx+Math.cos(twist)*r+Math.sin(u*8+colony)*.25,cy+(u-.5)*10,cz+Math.sin(twist)*r);
    }
  }
  const habitatGeometry=keep(new THREE.BufferGeometry());habitatGeometry.setAttribute('position',new THREE.Float32BufferAttribute(filaments,3));
  habitat.add(new THREE.LineSegments(habitatGeometry,keep(new THREE.LineBasicMaterial({color:0x7596b1,transparent:true,opacity:.12,depthWrite:false}))));
  const residents=[];
  for(let i=0;i<18;i++){const source=Object.values(specimens)[i%9],root=source.clone(true);root.traverse(part=>{if(part.isLight)part.visible=false;if(part.isInstancedMesh)keep(part);});const originals=[],copies=[];source.traverse(p=>originals.push(p));root.traverse(p=>copies.push(p));root.userData.limbPairs=copies.slice(1).map((p,j)=>[p,originals[j+1]]);scene.add(root);residents.push(root);}

  function drawArchive(state, force) {
    const archiveView=state.viewStates?.['screen.right.03']||{yaw:0,pitch:0,zoom:1};
    const key = state.species + ':' + state.phase+JSON.stringify(archiveView);
    if (!force && key === lastArchive) return; lastArchive = key;
    const {ctx,canvas}=archive;
    ctx.setTransform(3,0,0,3,0,0);const field=ctx.createRadialGradient(110,100,0,170,150,330);field.addColorStop(0,'#123747');field.addColorStop(.48,'#071e2c');field.addColorStop(1,'#020a13');ctx.fillStyle=field;ctx.fillRect(0,0,400,380);
    for(let i=0;i<1800;i++){ctx.fillStyle=`rgba(118,169,181,${.025+noise(i+907)*.08})`;ctx.fillRect(noise(i+301)*400,noise(i+531)*380,.4,.4);}
    ctx.fillStyle='#c5d5cb';ctx.font='11px "FS Pixel"';ctx.fillText('MARINE SPECIES / SP–02',16,30);
    Object.entries(SPECIES).forEach(([id,entry],i)=>{
      const x=16+i%3*123,y=78+Math.floor(i/3)*78,active=id===state.species;
      ctx.save();ctx.beginPath();ctx.rect(x+3,y+2,109,50);ctx.clip();
      if(active){ctx.translate(x+57.5,y+27);ctx.rotate(archiveView.yaw);ctx.scale(archiveView.zoom,archiveView.zoom*Math.max(.35,Math.cos(archiveView.pitch)));ctx.drawImage(atlasImages.get(id),-54.5,-25,109,50);}
      else ctx.drawImage(atlasImages.get(id),x+3,y+2,109,50);ctx.restore();
      if(active){ctx.strokeStyle='#d4c9a5';ctx.lineWidth=.8;ctx.strokeRect(x+.5,y+.5,114,69);}
      ctx.fillStyle=active?'#e0dfc6':'#afc7c3';ctx.font='9px "FS Pixel"';ctx.textAlign='center';ctx.fillText(entry.name,x+57,y+65);ctx.textAlign='left';
    });
    ctx.fillStyle='#91aaa9';ctx.font='8px "FS Pixel"';ctx.fillText('09 SPECIMENS',16,350);
    archive.texture.needsUpdate = true;
  }

  function render(state) {
    if (disposed) return;
    const inspecting=state.inspecting;
    const roaming=['IDLE','LISTENING','SIGNAL_DETECTED'].includes(state.phase)&&!inspecting;
    if(inspecting)state={...state,phase:'ENCOUNTER',progress:0};
    const started = performance.now();
    contactField=state.touch||{active:false};
    const view=state.viewStates?.['screen.upper_right']||state.view||{yaw:0,pitch:0,zoom:1};
    const detailView=state.viewStates?.['screen.right.02']||{yaw:0,pitch:0,zoom:1};
    const time = Number.isFinite(state.time) ? state.time : 0, progress = clamp(state.progress || 0);
    const species = Object.hasOwn(specimens, state.species) ? state.species : 'jelly';
    const current = specimens[species];
    timeUniform.value = time; sediment.rotation.y = Math.sin(time * .025) * .05;
    for (const [index,[name,specimen]] of Object.entries(specimens).entries()) {
      tissueGlows.get(name).opacity=.2+(name===species&&!['IDLE','LISTENING','COOLDOWN'].includes(state.phase)?.22:0);
      specimen.visible=true;specimen.traverse(part=>{if(part.isPointLight)part.visible=name===species;});if(name===species||frames%3===index%3)specimen.userData.animate(time,name===species?state:{...state,phase:'LISTENING',phaseTime:0,touch:{active:false}});
      const p=roamingPose(index,time);specimen.position.set(p.x,p.y,p.z);specimen.rotation.set(0,p.yaw,p.pitch);specimen.scale.setScalar(p.scale);
    }
    residents.forEach((root,i)=>{for(const [copy,source] of root.userData.limbPairs){copy.position.copy(source.position);copy.quaternion.copy(source.quaternion);copy.scale.copy(source.scale);}const p=roamingPose(i+9,time);root.visible=true;root.position.set(p.x,p.y,p.z);root.rotation.set(0,p.yaw,p.pitch);root.scale.setScalar(p.scale);});
    lastPhase = state.phase;
    const motion = MOTION[species];
    const anchored = species === 'algae';
    const pivot=new THREE.Vector3(0,-.15,-5);camera.position.set(0,.3,12.5/view.zoom).applyAxisAngle(new THREE.Vector3(0,1,0),view.yaw).applyAxisAngle(new THREE.Vector3(1,0,0),view.pitch).add(pivot);camera.lookAt(pivot);
    let distance = -11, x = Math.sin(time * .16) * (anchored ? .025 : .8), y = Math.sin(time * .32) * (anchored ? .015 : .18);
    let size = motion.scale;
    if (state.phase === 'SIGNAL_DETECTED') distance = -11;
    if (state.phase === 'APPROACH') {
      const approaching = smooth(progress); distance = -11 + approaching * 11;
      x = (1 - approaching) * motion.approachX + Math.sin(time * .6) * (anchored ? .015 : .15);
      y += (1 - approaching) * motion.approachY;
    }
    if (['ENCOUNTER', 'ECHO'].includes(state.phase)) {
      distance = 0; x = Math.sin(time * .46) * (anchored ? .015 : .12);
      y += species === 'jelly' ? .45 : anchored ? -.12 : 0;
    }
    if (state.phase === 'ESCAPE') {
      const escaping = smooth(progress); distance = -escaping * motion.escapeZ;
      x = escaping * motion.escapeX; y = (species === 'jelly' ? .45 : 0) + escaping * motion.escapeY;
      size = motion.scale * (anchored ? 1 : 1 - escaping * .12);
    }
    if (state.phase === 'COOLDOWN') distance = anchored ? -2 : -32;
    if (anchored) { x = 0; y = -2.35; }
    current.position.set(x, y, distance); current.scale.setScalar(size);
    const yawWave = Math.sin(time * (species === 'whale' ? .16 : .35)) * (anchored ? .012 : species === 'whale' ? .035 : .16);
    current.rotation.set(motion.pitch, motion.yaw + yawWave, anchored ? 0 : Math.sin(time * .42) * (species === 'whale' ? .012 : .06));
    if (state.phase === 'ESCAPE' && !anchored) { current.rotation.y += progress * motion.turn; current.rotation.z += progress * motion.roll; }
    const resident=roamingPose(Object.keys(specimens).indexOf(species),time);
    if(roaming){current.position.set(resident.x,resident.y,resident.z);current.scale.setScalar(resident.scale);current.rotation.set(0,resident.yaw,resident.pitch);}
    else if(state.phase==='COOLDOWN'){const p=smooth(progress);current.position.set(resident.x*p,resident.y*p,-32*(1-p)+resident.z*p);current.scale.setScalar(resident.scale);}
    else if(state.phase==='APPROACH'){const origin=roamingPose(Object.keys(specimens).indexOf(species),time-state.phaseTime),p=1-(1-progress)**3;current.position.set(origin.x*(1-p)+x*p,origin.y*(1-p)+y*p,origin.z*(1-p));current.scale.setScalar(origin.scale*(1-p)+motion.scale*p);}
    if(!anchored&&species!=='jelly'&&state.phase==='ESCAPE'){current.rotation.set(0,Math.atan2(-motion.escapeZ,-motion.escapeX),-Math.atan2(motion.escapeY,Math.hypot(motion.escapeX,motion.escapeZ)));}
    if(!anchored&&species!=='jelly'&&state.phase==='APPROACH'){const origin=roamingPose(Object.keys(specimens).indexOf(species),time-state.phaseTime),p=smooth(progress),yaw=Math.atan2(-origin.z,origin.x);current.rotation.set(0,yaw*(1-smooth((p-.8)/.2))+motion.yaw*smooth((p-.8)/.2),0);}
    if(anchored){current.position.set(resident.x,resident.y,resident.z);current.scale.setScalar(resident.scale);current.rotation.set(0,0,0);}
    const waterState = {...state, species, escapeDirection: [motion.escapeX, motion.escapeY, -motion.escapeZ]};
    water.update(waterState);
    const target = renderer.getRenderTarget(), cubeFace = renderer.getActiveCubeFace(), mipLevel = renderer.getActiveMipmapLevel();
    const autoClear = renderer.autoClear, clearColor = renderer.getClearColor(new THREE.Color()), clearAlpha = renderer.getClearAlpha();
    const position = current.position.clone(), rotation = current.rotation.clone(), scale = current.scale.clone();
    try {
      renderer.autoClear = true;
      renderer.setRenderTarget(mainTarget); renderer.clear(); renderer.render(scene, camera);
      optics.render(renderer,mainTarget,mainOutput,time);
      habitat.visible=false;residents.forEach(root=>root.visible=false);
      for(const root of Object.values(specimens))root.visible=root===current;
      // The tissue channel keeps the same living specimen under an independent macro lens.
      current.position.set(0, 0, 0); current.scale.setScalar(1); current.rotation.set(.1, -.16 + Math.sin(time * .18) * .16, species === 'jelly' ? .08 : -.12);
      water.setVisible(false); debris.visible = false;
      detailCamera.position.set(...motion.detail);
      const focus=new THREE.Vector3(...motion.focus),offset=detailCamera.position.clone().sub(focus).applyAxisAngle(new THREE.Vector3(0,1,0),detailView.yaw).applyAxisAngle(new THREE.Vector3(1,0,0),detailView.pitch).divideScalar(detailView.zoom);detailCamera.position.copy(focus).add(offset);
      detailCamera.lookAt(...motion.focus);
      renderer.setRenderTarget(detailTarget); renderer.clear(); renderer.render(scene, detailCamera);
      optics.render(renderer,detailTarget,detailOutput,time);
      resonator.update({...state,view:state.viewStates?.['screen.right.01']||{zoom:1}});renderer.setRenderTarget(signalTarget);renderer.clear();renderer.render(resonator.scene,resonator.camera);
      optics.render(renderer,signalTarget,signalOutput,time);
    } finally {
      habitat.visible=true;residents.forEach(root=>root.visible=true);
      for(const root of Object.values(specimens))root.visible=true;
      current.position.copy(position); current.rotation.copy(rotation); current.scale.copy(scale); water.update(waterState); water.setVisible(true); debris.visible = true;
      renderer.setRenderTarget(target, cubeFace, mipLevel);
      renderer.autoClear = autoClear; renderer.setClearColor(clearColor, clearAlpha);
    }
    drawArchive({...state, species}, frames === 0); frames++;
    renderMs = performance.now() - started; totalRenderMs += renderMs;
  }
  return {
    textures, render,
    diagnostics: () => ({frames, disposed, population:27, roamingSpecies:Object.keys(specimens), archiveSpecimens:[...atlasImages.keys()], species: Object.keys(specimens), renderTargets: 6, resonator:resonator.diagnostics(), water:water.diagnostics(), sharedRenderer: true, renderMs, averageRenderMs: frames ? totalRenderMs / frames : 0, channels: [...textures].map(([id, texture]) => ({id, type: texture.isRenderTargetTexture ? 'WebGLRenderTarget' : 'CanvasTexture', width: texture.image?.width, height: texture.image?.height}))}),
    dispose() {
      if (disposed) return; disposed = true;
      for (const resource of resources) resource.dispose();
      for(const image of atlasImages.values())image.width=image.height=0;atlasImages.clear();
      depthEnvironment.dispose();water.dispose();optics.dispose();resonator.dispose();environmentTarget.dispose(); scene.clear();
      for (const entry of [archive, backdrop]) entry.canvas.width = entry.canvas.height = 0;
    },
  };
}
