import * as THREE from 'three';

// Art-directed flow and bounded raymarching, not a physical fluid solver.
export function createMarineWater(scene) {
  const owned = [], uniformTime = {value: 0};
  const keep = value => (owned.push(value), value);
  const floorMaterial = keep(new THREE.MeshStandardMaterial({color: 0x1b3030, roughness: .94, metalness: .08}));
  const floorGeometry = keep(new THREE.PlaneGeometry(65, 65, 72, 72));
  const floorPositions = floorGeometry.attributes.position;
  for (let i = 0; i < floorPositions.count; i++) {
    const x = floorPositions.getX(i), y = floorPositions.getY(i);
    floorPositions.setZ(i, Math.sin(x * .7 + y * .23) * .11 + Math.cos(y * .31 - x * .8) * .08 + Math.sin(x * 3.1 + y) * .018);
  }
  floorGeometry.computeVertexNormals();
  const seabed = new THREE.Mesh(floorGeometry, floorMaterial);
  seabed.rotation.x = -Math.PI / 2; seabed.position.set(0, -3.9, -14); scene.add(seabed);

  function caustics(material) {
    const old = material.onBeforeCompile;
    material.onBeforeCompile = shader => {
      old?.(shader);
      shader.uniforms.waterTime = uniformTime;
      shader.vertexShader = 'varying vec3 waterWorld;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', 'waterWorld=(modelMatrix*vec4(transformed,1.)).xyz;\n#include <project_vertex>');
      shader.fragmentShader = 'varying vec3 waterWorld;uniform float waterTime;\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
        vec2 wp=waterWorld.xz*.9+waterWorld.y*.15;
        float a=sin(wp.x*2.1+sin(wp.y*2.3+waterTime*.38))+sin(wp.y*2.8-waterTime*.29+cos(wp.x*1.7));
        float b=sin(wp.x*2.3+wp.y*.8-waterTime*.24)+cos(wp.y*2.4+sin(wp.x*2.+waterTime*.31));
        float c=pow(max(0.,1.-abs(a+b)*.62),8.);
        diffuseColor.rgb*=.92+c*.16;
        diffuseColor.rgb+=vec3(.012,.03,.027)*c;`);
    };
    const previousKey = material.customProgramCacheKey.bind(material), key = previousKey();
    material.customProgramCacheKey = () => key + 'marine-caustics-v3'; material.needsUpdate = true;
  }
  caustics(floorMaterial);

  const ambientGeometry = keep(new THREE.BufferGeometry()), ambientCount = 240;
  const ambientPositions = new Float32Array(ambientCount * 3), ambientBase = new Float32Array(ambientCount * 3);
  for (let i = 0; i < ambientCount; i++) {
    const a = Math.sin(i * 127.1 + 31.7) * 43758.5453, b = Math.sin(i * 269.5 + 83.2) * 24634.6345, c = Math.sin(i * 419.2 + 17.9) * 56445.234;
    ambientBase.set([(a - Math.floor(a) - .5) * 22, (b - Math.floor(b) - .5) * 11, 5 - (c - Math.floor(c)) * 31], i * 3);
  }
  ambientGeometry.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
  const ambientMaterial = keep(new THREE.PointsMaterial({color: 0xa9c1b8, size: .022, transparent: true, opacity: .3, depthWrite: false, sizeAttenuation: true}));
  const ambient = new THREE.Points(ambientGeometry, ambientMaterial); scene.add(ambient);

  const group = new THREE.Group(); scene.add(group);
  const volumeMaterial = keep(new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.BackSide,
    uniforms: {localCamera: {value: new THREE.Vector3()}, time: uniformTime, age: {value: 0}, strength: {value: 0}},
    vertexShader: 'varying vec3 vLocal;void main(){vLocal=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `
      varying vec3 vLocal;uniform vec3 localCamera;uniform float time,age,strength;
      float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
      float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
      void main(){
        vec3 dir=normalize(vLocal-localCamera),inv=1./dir;
        vec3 a=(-.5-localCamera)*inv,b=(.5-localCamera)*inv,lo=min(a,b),hi=max(a,b);
        float near=max(max(lo.x,lo.y),lo.z),far=min(min(hi.x,hi.y),hi.z);near=max(near,0.);
        if(near>=far)discard;
        float stepSize=(far-near)/28.,jitter=hash(vec3(gl_FragCoord.xy,age));vec4 sum=vec4(0.);
        for(int i=0;i<28;i++){
          vec3 q=localCamera+dir*(near+(float(i)+jitter)*stepSize);
          float along=clamp(q.z+.5,0.,1.);
          vec2 curl=vec2(sin(q.z*11.-age*2.3+sin(q.y*8.)),cos(q.z*9.+age*1.8+cos(q.x*7.)))*(.025+along*.055+age*.004);
          float n=noise3(q*15.+vec3(age*.28,-age*.52,age*.2))*.76+noise3(q*34.-age*.31)*.24;
          float radius=.055+along*(.13+age*.006),r=length(q.xy+curl);
          float mass=exp(-2.6*r*r/max(.001,radius*radius));
          float shear=.7+.3*sin(along*27.+atan(q.y,q.x)*2.-age*2.4+n*4.);
          float density=mass*(.32+n*.68)*shear*smoothstep(.015,.16,along)*(1.-smoothstep(.7,1.,along));
          float alpha=1.-exp(-density*stepSize*strength*4.1);
          vec3 col=mix(vec3(.08,.2,.24),vec3(.28,.42,.4),n*.7+along*.2);
          sum.rgb+=(1.-sum.a)*col*alpha;sum.a+=(1.-sum.a)*alpha;
        }
        gl_FragColor=vec4(sum.rgb/max(sum.a,.0001),sum.a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  const volume = new THREE.Mesh(keep(new THREE.BoxGeometry(1, 1, 1)), volumeMaterial);
  volume.renderOrder = 4; group.add(volume);
  const inverse = new THREE.Matrix4();
  volume.onBeforeRender = (_renderer, _scene, camera) => {
    inverse.copy(volume.matrixWorld).invert(); volumeMaterial.uniforms.localCamera.value.copy(camera.position).applyMatrix4(inverse);
  };
  const flowMask = keep(new THREE.DataTexture(new Uint8Array(32 * 32 * 4), 32, 32));
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
    const wave = .5 + .5 * Math.sin(x * .63 + Math.sin(y * .41)) * Math.cos(y * .57 - x * .21), value = wave < .26 ? 0 : 35 + wave * 190, index = (y * 32 + x) * 4;
    flowMask.image.data.set([value, value, value, 255], index);
  }
  flowMask.wrapS = flowMask.wrapT = THREE.RepeatWrapping; flowMask.repeat.set(2, 3); flowMask.needsUpdate = true;
  const skinMaterial = keep(new THREE.MeshPhysicalMaterial({
    color: 0x8dbdbb, transmission: .98, thickness: .075, ior: 1.333, roughness: .27,
    metalness: 0, clearcoat: .04, transparent: true, opacity: .28, depthWrite: false, alphaMap: flowMask, alphaTest: .025,
    side: THREE.DoubleSide, attenuationColor: 0x5b959a, attenuationDistance: 3.5,
  }));
  const skins = [];
  for (let k = 0; k < 2; k++) {
    const geometry = keep(new THREE.PlaneGeometry(1, 1, 40, 12)), skin = new THREE.Mesh(geometry, skinMaterial);
    skin.renderOrder = 3; group.add(skin); skins.push(skin);
  }
  const positions = new Float32Array(180 * 3), particleGeometry = keep(new THREE.BufferGeometry());
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = keep(new THREE.PointsMaterial({color: 0xb6c9bc, size: .035, transparent: true, opacity: .34, depthWrite: false}));
  const particles = new THREE.Points(particleGeometry, particleMaterial); group.add(particles);

  const direction = new THREE.Vector3(0, 0, -1), backward = new THREE.Vector3(0, 0, -1), wakeDirection = new THREE.Vector3(0, 0, -1);
  let escapeStart = -100, previous = '', wakeVisible = false, waterVisible = true;
  function applyVisibility() {
    group.visible = waterVisible && wakeVisible; ambient.visible = waterVisible; seabed.visible = false;
  }
  function update(state) {
    const t = state.time; uniformTime.value = t;
    for (let i = 0; i < ambientCount; i++) {
      const x = ambientBase[i * 3], y = ambientBase[i * 3 + 1], z = ambientBase[i * 3 + 2];
      ambientPositions[i * 3] = x + Math.sin(t * .23 + y * .7 + z * .16) * .18;
      ambientPositions[i * 3 + 1] = y + Math.sin(t * .17 + x * .4) * .09;
      ambientPositions[i * 3 + 2] = 5 - ((5 - z + t * .075) % 31);
    }
    ambientGeometry.attributes.position.needsUpdate = true;
    if (state.phase === 'ESCAPE' && previous !== 'ESCAPE') escapeStart = t - Math.max(0, state.phaseTime || 0);
    previous = state.phase;
    const age = Math.max(0, t - escapeStart), life = Math.max(0, 1 - age / 5.2);
    wakeVisible = age < 5.2 && state.species !== 'algae'; applyVisibility();
    if (!wakeVisible) return;
    const strength = Math.min(1, age * 12) * life, spread = state.species === 'whale' ? 1.45 : state.species === 'jelly' ? .8 : 1;
    direction.fromArray(state.escapeDirection || [0, 0, -1]).normalize(); wakeDirection.copy(direction);
    group.quaternion.setFromUnitVectors(backward, direction); group.position.set(0, state.species === 'jelly' ? .45 : 0, 0);
    volumeMaterial.uniforms.age.value = age; volumeMaterial.uniforms.strength.value = strength;
    const length = 9 + age * (state.species === 'whale' ? 1.1 : 2.8), width = (2.2 + age * .22) * spread;
    volume.scale.set(width, width * .82, length); volume.position.z = .35 - length * .5;
    skinMaterial.opacity = strength * .26;
    skins.forEach((skin, k) => {
      const attribute = skin.geometry.attributes.position;
      for (let i = 0; i < attribute.count; i++) {
        const u = (i % 41) / 40, v = Math.floor(i / 41) / 12;
        const angle = v * Math.PI * (1.1 + k * .25) + k * 1.9 + u * (5.2 + k * 1.7) - age * .72;
        const radius = (.07 + u * .18 + age * .025) * (1 + .25 * Math.sin(u * 25 - age * 2.7 + v * 5)) * spread;
        attribute.setXYZ(i, Math.cos(angle) * radius + Math.sin(u * 9 - age) * .09 + Math.sin(u * 4 + k) * .12 * u, Math.sin(angle) * radius + Math.cos(u * 5 + k * 2) * .1 * u, .25 - u * length * (.68 + k * .18));
      }
      attribute.needsUpdate = true; skin.geometry.computeVertexNormals();
    });
    for (let i = 0; i < 180; i++) {
      const f = i / 180, angle = i * 2.399 + age * .65, radius = (.06 + f * .62 + age * .055) * spread;
      positions[i * 3] = Math.cos(angle) * radius + Math.sin(f * 19 - age * 2) * .1;
      positions[i * 3 + 1] = Math.sin(angle) * radius + Math.cos(f * 13 - age) * .07;
      positions[i * 3 + 2] = .2 - f * length * .9;
    }
    particleGeometry.attributes.position.needsUpdate = true; particleMaterial.opacity = strength * .28;
  }
  return {
    update, caustics,
    setVisible(visible) { waterVisible = visible; applyVisibility(); },
    dispose() {
      group.removeFromParent(); ambient.removeFromParent(); seabed.removeFromParent();
      for (const item of owned) item.dispose();
    },
    diagnostics: () => ({wake: 'directional-raymarched-volume + refractive-open-sheets', raySteps: 28, causticSeabed: false, suspendedParticles: ambientCount, wakeParticles: 180, wakeDirection: wakeDirection.toArray(), physicalFluidSimulation: false}),
  };
}
