import * as THREE from 'three';

const Y_AXIS = new THREE.Vector3(0, 1, 0);
const UNIT_CYLINDER = new THREE.CylinderGeometry(1, 1, 1, 10);
const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);

function instanced(parent, name, geometry, material, count) {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.name = name;
  mesh.castShadow = mesh.receiveShadow = true;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  parent.add(mesh);
  return mesh;
}

function writeInstance(mesh, index, position, scale, quaternion = new THREE.Quaternion()) {
  const matrix = new THREE.Matrix4().compose(position, quaternion, new THREE.Vector3(...scale));
  mesh.setMatrixAt(index, matrix);
}

function finishInstances(mesh) {
  mesh.instanceMatrix.needsUpdate = true;
  mesh.computeBoundingSphere();
}

function localBounds(owner) {
  owner.updateWorldMatrix(true, true);
  const inverse = owner.matrixWorld.clone().invert();
  const bounds = new THREE.Box3();
  owner.traverse(child => {
    if (!child.isMesh || child.isInstancedMesh) return;
    child.geometry.computeBoundingBox();
    bounds.union(child.geometry.boundingBox.clone().applyMatrix4(inverse.clone().multiply(child.matrixWorld)));
  });
  return bounds;
}

function localPorts(owner, kind) {
  if (kind === 'screen') {
    const rear = owner.getObjectByName('housing.back');
    if (!rear) throw new Error(`Screen has no rear housing: ${owner.name}`);
    rear.geometry.computeBoundingBox();
    const height = rear.geometry.boundingBox.max.y - rear.geometry.boundingBox.min.y;
    const z = rear.position.z - .13;
    return { mount: new THREE.Vector3(0, 0, z), ports: [new THREE.Vector3(-.065, -height * .18, z + .035), new THREE.Vector3(.065, -height * .18, z + .035)] };
  }
  if (kind === 'cabinet') {
    const [width, height, depth] = owner.userData.dimensions;
    return { mount: new THREE.Vector3(0, 0, -depth / 2 - .07), ports: [new THREE.Vector3(-width * .12, -height * .16, -depth / 2 - .035), new THREE.Vector3(width * .12, -height * .16, -depth / 2 - .035)] };
  }
  const bounds = localBounds(owner);
  const center = bounds.getCenter(new THREE.Vector3());
  return { mount: new THREE.Vector3(center.x, center.y, bounds.min.z - .045), ports: [new THREE.Vector3(center.x - .055, center.y, bounds.min.z - .05), new THREE.Vector3(center.x + .055, center.y, bounds.min.z - .05)] };
}

/** Each hardware owner keeps its own articulated bracket and two regenerated flexible leads. */
export function createMounts(materials, registry) {
  if (!(registry instanceof Map)) throw new TypeError('createMounts requires the hardware registry Map.');
  const root = new THREE.Group();
  root.name = 'mounts';
  root.userData.kind = 'linkedMechanicalConnections';
  const records = new Map();
  const arcZ = x => 2.2 - Math.sqrt(4.5 ** 2 - x ** 2);
  const table = registry.get('table');
  table?.updateWorldMatrix(true, true);
  const tableTop = table?.getObjectByName('table.acrylic');
  const tableY = tableTop ? tableTop.getWorldPosition(new THREE.Vector3()).y : 2.31;
  const tableZ = table ? table.getWorldPosition(new THREE.Vector3()).z - .48 : -.93;
  for (const [id, owner] of registry) {
    const kind = owner.userData.kind;
    if (!['screen', 'cabinet', 'instrument'].includes(kind)) continue;
    owner.updateWorldMatrix(true, true);
    const local = localPorts(owner, kind);
    if (![local.mount, ...local.ports].every(p => p.toArray().every(Number.isFinite))) throw new Error(`Invalid hardware dimensions: ${id}`);
    const initialMount = owner.localToWorld(local.mount.clone());
    let fixed;
    if (kind === 'instrument' || id === 'screen.desk') {
      fixed = new THREE.Vector3(initialMount.x, tableY - .09, tableZ);
    } else if (kind === 'cabinet' || /screen\.(left|right)\.|upper_(left|right)/.test(id)) {
      fixed = new THREE.Vector3(initialMount.x < 0 ? -4.42 : 4.42, initialMount.y, 1.48);
    } else {
      const x = Math.abs(initialMount.x + 1.79) < Math.abs(initialMount.x - 1.68) ? -1.79 : 1.68;
      fixed = new THREE.Vector3(x, initialMount.y, arcZ(x));
    }
    const group = new THREE.Group();
    group.name = `mounts.${id}`;
    group.userData = { ownerId: id, id, kind: 'linkedMount' };
    root.add(group);
    const struts = instanced(group, `${id}.mount.struts`, UNIT_CYLINDER, materials.metal, 3);
    const hinges = instanced(group, `${id}.mount.hinges`, UNIT_CYLINDER, materials.metal, 4);
    const plates = instanced(group, `${id}.mount.plates`, UNIT_BOX, materials.metal, 2);
    const washers = instanced(group, `${id}.mount.washers`, UNIT_CYLINDER, materials.dark, 4);
    const connectors = instanced(group, `${id}.mount.connectors`, UNIT_BOX, materials.dark, 4);
    const wires = [materials.cable || materials.dark, materials.tanCable || materials.cream].map((material, index) => {
      const wire = new THREE.Mesh(new THREE.BufferGeometry(), material);
      wire.name = `${id}.mount.${index ? 'cream' : 'black'}Wire`;
      wire.castShadow = true;
      group.add(wire);
      return wire;
    });
    const hardwareAnchor = new THREE.Object3D();
    hardwareAnchor.name = `${id}.mount.hardwareAnchor`;
    const frameAnchor = new THREE.Object3D();
    frameAnchor.name = `${id}.mount.frameAnchor`;
    frameAnchor.position.copy(fixed);
    group.add(hardwareAnchor, frameAnchor);
    records.set(id, { id, owner, kind, local, fixed, group, struts, hinges, plates, washers, connectors, wires, hardwareAnchor, frameAnchor, snapshot: null });
  }

  function update(id) {
    const record = records.get(id);
    if (!record) return false;
    const { owner, kind, local, fixed, struts, hinges, plates, washers, connectors, wires, hardwareAnchor } = record;
    owner.updateWorldMatrix(true, true);
    const orientation = owner.getWorldQuaternion(new THREE.Quaternion());
    const backDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(orientation);
    const end = owner.localToWorld(local.mount.clone());
    const rearElbow = end.clone().addScaledVector(backDirection, kind === 'instrument' ? .055 : .12);
    const outsideElbow = new THREE.Vector3(fixed.x, rearElbow.y, rearElbow.z);
    const joints = [end, rearElbow, outsideElbow, fixed.clone()];
    const radius = kind === 'instrument' || id === 'screen.desk' ? .013 : .023;
    const horizontalPin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    for (let i = 0; i < 3; i++) {
      const delta = joints[i + 1].clone().sub(joints[i]);
      const length = delta.length();
      const direction = length > .00001 ? delta.clone().divideScalar(length) : Y_AXIS;
      const rotation = new THREE.Quaternion().setFromUnitVectors(Y_AXIS, direction);
      writeInstance(struts, i, joints[i].clone().add(joints[i + 1]).multiplyScalar(.5), [radius, Math.max(length, .001), radius], rotation);
    }
    for (let i = 0; i < joints.length; i++) {
      writeInstance(hinges, i, joints[i], [radius * 1.5, .065, radius * 1.5], horizontalPin);
      writeInstance(washers, i, joints[i].clone().add(new THREE.Vector3(.035, 0, 0)), [radius * 1.85, .008, radius * 1.85], horizontalPin);
    }
    writeInstance(plates, 0, end, kind === 'instrument' ? [.13, .08, .025] : [.18, .26, .035], orientation);
    writeInstance(plates, 1, fixed, [.105, .14, .10]);
    const endpoints = [], pathPoints = [];
    for (let i = 0; i < 2; i++) {
      const port = owner.localToWorld(local.ports[i].clone());
      const framePort = fixed.clone().add(new THREE.Vector3(i ? .046 : -.046, -.10, -.035));
      const slack = Math.min(.46, Math.max(.13, port.distanceTo(framePort) * .18));
      const points = [
        port,
        port.clone().addScaledVector(backDirection, .12).add(new THREE.Vector3(0, -.05, 0)),
        port.clone().lerp(framePort, .53).add(new THREE.Vector3(0, -slack, -.06 - i * .025)),
        framePort.clone().add(new THREE.Vector3(0, -.10, -.055)),
        framePort,
      ];
      const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 28, i ? .0055 : .0085, 6, false);
      const previous = wires[i].geometry;
      wires[i].geometry = geometry;
      previous.dispose();
      writeInstance(connectors, i, port, [.055, .055, .043], orientation);
      writeInstance(connectors, i + 2, framePort, [.055, .07, .055]);
      endpoints.push({ hardware: port.toArray(), frame: framePort.toArray() });
      pathPoints.push(points.map(point => point.toArray()));
    }
    [struts, hinges, plates, washers, connectors].forEach(finishInstances);
    hardwareAnchor.position.copy(end);
    record.snapshot = { id, kind, localMount: local.mount.toArray(), localPorts: local.ports.map(p => p.toArray()), hardwareMount: end.toArray(), frameAnchor: fixed.toArray(), wireEndpoints: endpoints, pathPoints };
    return true;
  }

  function updateAll() {
    for (const id of records.keys()) update(id);
    return records.size;
  }

  function diagnostics(id) {
    if (id !== undefined) {
      const snapshot = records.get(id)?.snapshot;
      return snapshot ? structuredClone(snapshot) : null;
    }
    return { connectedCount: records.size, connectedIds: [...records.keys()], drawCallsPerHardware: 7 };
  }

  updateAll();
  return { root, update, updateAll, diagnostics };
}
