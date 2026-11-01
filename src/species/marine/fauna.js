import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const TAU = Math.PI * 2;
const clamp = n => Math.max(0, Math.min(1, n));
const mix = (a, b, t) => a + (b - a) * t;

// All anatomy shares the same deformation field, so skeletons stay inside their membranes.
export function createMarineFauna({scene, keep, glass, pink, chrome, brass, dark, organ, board}) {
  const specimens = {};
  const palettes = {whale: 0x7399a2, shark: 0x7da795, angelfish: 0xa99bb6, butterflyfish: 0xb5a17a, tang: 0xb18c99, algae: 0x91b2a2};
  function specimen(name) {
    const root = new THREE.Group(); root.name = `marine.${name}`; scene.add(root); specimens[name] = root;
    const skin = keep(glass.clone()); skin.color.set(palettes[name]).lerp(new THREE.Color(0xd6ebe7),.35); skin.transmission = .98; skin.thickness = .085; skin.attenuationColor.set(palettes[name]); skin.attenuationDistance = 2.5; skin.roughness = .14; skin.clearcoat = .06;skin.emissive.set(palettes[name]);skin.emissiveIntensity=.025;
    const fin = keep(skin.clone()); fin.side = THREE.DoubleSide; fin.color.lerp(new THREE.Color(0xd6e1dc), .42); fin.transmission = .94; fin.thickness = .012; fin.attenuationDistance = .72; fin.roughness = .25;fin.emissiveIntensity=.12;fin.iridescence=.24;fin.iridescenceIOR=1.32;fin.iridescenceThicknessRange=[160,340];
    const glow = keep(organ.clone()); glow.color.set(palettes[name]).lerp(new THREE.Color(0x9edfd1),.4); glow.emissive.set(palettes[name]); glow.emissiveIntensity = .3; glow.transmission = 0; glow.roughness = .32;glow.iridescence=.18;glow.iridescenceIOR=1.32; glow.bumpMap = glass.bumpMap; glow.bumpScale = .018;
    const indicator=keep(new THREE.MeshStandardMaterial({color:0xc1d4bb,emissive:palettes[name],emissiveIntensity:1.05,roughness:.45}));
    const tracer = keep(new THREE.MeshStandardMaterial({color: palettes[name], emissive: palettes[name], emissiveIntensity: .18, roughness: .43, metalness: .18}));
    const vein = keep(new THREE.MeshStandardMaterial({color: new THREE.Color(palettes[name]).multiplyScalar(.48), emissive: palettes[name], emissiveIntensity: .035, roughness: .5, metalness: .22}));
    const tissueLight = new THREE.PointLight(palettes[name], .45, 3.2, 2); tissueLight.position.set(-.25, .02, .08); root.add(tissueLight);
    for(const x of [-.7,.65]){const lamp=new THREE.PointLight(palettes[name],.28,1.1,2);lamp.position.set(x,.04,.03);root.add(lamp);}
    const parts = [];
    function mesh(geometry, material, flutter = 0) {
      keep(geometry); const object = new THREE.Mesh(geometry, material); root.add(object);
      parts.push({object, rest: geometry.attributes.position.array.slice(), flutter}); return object;
    }
    function ellipsoid(position, scale, material = glow, segments = 18) {
      const geometry = new THREE.SphereGeometry(1, segments, 12);
      if(material===glow&&segments>=20){const p=geometry.attributes.position;for(let i=0;i<p.count;i++){const a=Math.atan2(p.getZ(i),p.getX(i)),k=1+.055*Math.cos(a*12)*Math.sin(Math.acos(Math.max(-1,Math.min(1,p.getY(i)))));p.setXYZ(i,p.getX(i)*k,p.getY(i),p.getZ(i)*k);}geometry.computeVertexNormals();}
      geometry.scale(...scale); geometry.translate(...position); return mesh(geometry, material);
    }
    function tube(points, radius, material = chrome, segments = 24) {
      return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), segments, radius, 5, false), material);
    }
    function ring(x, y, ry, rz, material = chrome) {
      const points = Array.from({length: 33}, (_, i) => [x, y + Math.cos(i / 32 * TAU) * ry, Math.sin(i / 32 * TAU) * rz]);
      return tube(points, .008, material, 32);
    }
    function membrane(outline, material = fin, flutter = .02) {
      const curve = new THREE.CatmullRomCurve3(outline.map(p => new THREE.Vector3(...p)), true, 'catmullrom', .18);
      const center = outline.reduce((v, p) => v.add(new THREE.Vector3(...p)), new THREE.Vector3()).multiplyScalar(1 / outline.length);
      const positions = [], uvs = [], indices = [], rows = 8, cols = 56;
      for (let i = 0; i <= rows; i++) for (let j = 0; j <= cols; j++) {
        const u = i / rows, edge = curve.getPoint(j / cols), p = center.clone().lerp(edge, u);
        p.z += Math.sin(u * Math.PI) * .015; positions.push(p.x, p.y, p.z); uvs.push(j / cols, u);
      }
      for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) { const a = i * (cols + 1) + j, b = a + cols + 1; indices.push(a, b, a + 1, b, b + 1, a + 1); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geo.setIndex(indices); geo.computeVertexNormals();
      const result = mesh(geo, material, flutter);
      tube(curve.getPoints(72).map(p => p.toArray()), .0035, vein, 72);
      for(let i=0;i<9;i++){const edge=curve.getPoint(i/9),middle=center.clone().lerp(edge,.58);middle.z+=.012;mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([center.clone(),middle,edge]),12,.003,4,false),vein,flutter);}
      return result;
    }
    function body(profile, segments = 76, radial = 40) {
      function sample(x) {
        let i = 0; while (i < profile.length - 2 && x > profile[i + 1][0]) i++;
        const a = profile[i], b = profile[i + 1], f = clamp((x - a[0]) / (b[0] - a[0])), t = f * f * (3 - 2 * f);
        return [mix(a[1], b[1], t), Math.max(.001, mix(a[2], b[2], t)), Math.max(.001, mix(a[3], b[3], t))];
      }
      const positions = [], uvs = [], indices = [], start = profile[0][0], end = profile.at(-1)[0];
      for (let i = 0; i <= segments; i++) for (let j = 0; j <= radial; j++) {
        const x = mix(start, end, i / segments), [y, ry, rz] = sample(x), a = j / radial * TAU;
        positions.push(x, y + ry * Math.cos(a), rz * Math.sin(a)); uvs.push(i / segments, j / radial);
      }
      for (let i = 0; i < segments; i++) for (let j = 0; j < radial; j++) { const a = i * (radial + 1) + j, b = a + radial + 1; indices.push(a, a + 1, b, a + 1, b + 1, b); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geo.setIndex(indices); geo.computeVertexNormals(); mesh(geo, skin);
      return sample;
    }
    function optics(position, radius = .065) {
      for (const side of [-1, 1]) {
        const [x, y, z] = position;
        ellipsoid([x, y, side * z], [radius * 1.25, radius * 1.25, radius * .32], chrome, 20);
        ellipsoid([x, y, side * (z + .018)], [radius, radius, radius * .28], dark, 20);
        ellipsoid([x - radius * .15, y + radius * .17, side * (z + .035)], [radius * .26, radius * .26, radius * .13], glow, 16);
      }
    }
    function skeleton(profile, start, end, count = 16) {
      const points = [];
      for (let i = 0; i < count; i++) {
        const x = mix(start, end, i / (count - 1)), [y, ry, rz] = profile(x);
        ring(x, y, ry * .71, rz * .73, i % 4 ? chrome : brass);
        ellipsoid([x, y, 0], [.028, .048, .04], dark, 10); points.push([x, y, 0]);
      }
      tube(points, .025, chrome, 40);
      for(let i=1;i<count;i+=3){const [x,y]=points[i];ellipsoid([x,y+.045,.035],[.025,.045,.022],indicator,12);}
      for (const side of [-1, 1]) tube(points.map(([x, y]) => [x, y - .06, side * .075]), .008, tracer, 40);
    }
    function circuit(position, scale = 1) {
      const [x, y, z] = position, geo = new THREE.BoxGeometry(.25 * scale, .18 * scale, .023 * scale); geo.translate(x, y, z); mesh(geo, board);
      for (let i = 0; i < 4; i++) {
        const chip = new THREE.BoxGeometry(.032 * scale, .045 * scale, .025 * scale); chip.translate(x + (i - 1.5) * .052 * scale, y, z + .018 * scale); mesh(chip, dark);
        ellipsoid([x+(i-1.5)*.052*scale,y+.06*scale,z+.022*scale],[.008,.013,.006],indicator,10);
        tube([[x - .1 * scale, y - .065 * scale, z + .013 * scale], [x + (i - 1.5) * .052 * scale, y - .065 * scale, z + .013 * scale], [x + (i - 1.5) * .052 * scale, y - .018 * scale, z + .013 * scale]], .003, brass, 5);
      }
    }
    function animate(time, state = {}, mode = 'fish', speed = 1) {
      const escaping = state.phase === 'ESCAPE' ? clamp((state.phaseTime || 0) * 2) : 0;
      const pulse = time * speed + (state.phase === 'ESCAPE' ? (state.phaseTime || 0) * speed * 2.4 : 0);
      const amplitude = (mode === 'whale' ? .13 : .17) * (1 + escaping * 1.25);
      glow.emissiveIntensity = .32 + Math.sin(time * .9) * .07 + (state.phase === 'ECHO' ? .34 * Math.sin(time * 5) ** 2 : 0);
      tracer.emissiveIntensity = .16 + Math.sin(time * .7 + 1) * .04;
      tissueLight.intensity = .45 + (state.phase === 'ECHO' ? .18 * Math.sin(time * 4) ** 2 : 0);
      for (const {object, rest, flutter} of parts) {
        const positions = object.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
          const x = rest[i * 3], y = rest[i * 3 + 1], z = rest[i * 3 + 2];
          const weight = clamp((x + .9) / 2.8) ** 2;
          const tail = Math.sin(pulse * 2.2 - x * 1.6) * weight * amplitude;
          const finWave = Math.sin(pulse * 2.1 + x * 4.2 + y * 2.3) * flutter * (Math.abs(y) + Math.abs(z));
          const breath = 1 + Math.sin(time * 1.15) * .009 * (1 - weight);
          const touch=state.touch,contact=touch?.active?Math.exp(-((x-touch.x*1.6)**2+(y-touch.y*1.5)**2)*2)*touch.strength*.18:0;
          positions.setXYZ(i, x, mode === 'whale' ? y * breath + tail + finWave : y * breath, mode === 'whale' ? z + finWave+contact : z + tail + finWave+contact);
        }
        positions.needsUpdate = true;
        object.geometry.computeVertexNormals();object.geometry.computeBoundingSphere();
      }
    }
    function compile() {
      const originals = parts.splice(0), batches = new Map();
      for (const part of originals) {
        const key = `${part.object.material.uuid}:${part.flutter}`;
        if (!batches.has(key)) batches.set(key, []);
        batches.get(key).push(part);
      }
      for (const batch of batches.values()) {
        const geometry = mergeGeometries(batch.map(part => part.object.geometry), false);
        if (!geometry) throw Error(`Cannot batch ${name} anatomy.`);
        const [{object: {material}, flutter}] = batch;
        for (const part of batch) root.remove(part.object);
        mesh(geometry, material, flutter);
      }
    }
    root.userData.compile = compile;
    return {root, skin, fin, glow, tracer, parts, mesh, tube, ellipsoid, ring, membrane, body, optics, skeleton, circuit, animate, compile};
  }

  const w = specimen('whale');
  const whaleProfile = w.body([[-1.86,.1,.001,.001],[-1.82,.1,.36,.32],[-1.68,.1,.52,.42],[-.98,.1,.54,.45],[-.52,.07,.49,.4],[.1,.02,.36,.32],[.7,0,.24,.22],[1.25,-.02,.12,.12],[1.7,-.02,.055,.065],[1.86,-.02,.001,.001]], 100, 48);
  w.skeleton(whaleProfile, -.65, 1.7, 21);
  // The spermaceti chamber, narrow lower jaw and horizontal flukes identify the whale.
  w.ellipsoid([-1.21,.16,0],[.4,.3,.235],w.glow,28);
  for (let i = 0; i < 6; i++) w.ring(-1.55 + i * .13,.16,.35,.285,i % 2 ? brass : chrome);
  for (const side of [-1,1]) w.tube([[-1.62,.16,side*.2],[-1.35,.28,side*.27],[-1.02,.25,side*.26],[-.83,.1,side*.18]],.012,brass,28);
  w.ellipsoid([-.32,-.13,0],[.25,.2,.19],organ,24); w.circuit([-.75,.06,.28],1.1);
  w.membrane([[-1.73,-.3,0],[-1.4,-.43,.09],[-.63,-.43,.08],[-.44,-.28,0],[-.72,-.43,-.08],[-1.4,-.43,-.09]],pink,.003);
  for (const side of [-1,1]) {
    w.tube([[-1.78,-.27,side*.2],[-1.35,-.35,side*.25],[-.8,-.34,side*.23],[-.57,-.22,side*.28]],.009,dark,32);
    w.membrane([[-.56,-.2,side*.2],[-.27,-.31,side*.75],[.12,-.3,side*.63],[-.1,-.12,side*.24]],w.fin,.07);
    w.tube([[-.49,-.2,side*.25],[-.24,-.28,side*.6],[.06,-.28,side*.61]],.011,chrome,20);
    w.membrane([[1.38,-.02,0],[1.58,-.04,side*.82],[1.93,-.03,side*.72],[1.81,-.015,side*.12],[1.67,0,0]],w.fin,.04);
    for(let j=0;j<5;j++) w.tube([[1.47,-.02,side*.04],[1.64,-.025,side*(.2+j*.1)],[1.86,-.03,side*(.18+j*.12)]],.006,j%2?chrome:w.tracer,16);
    w.tube([[-1.5,.34,side*.25],[-.7,.37,side*.3],[.2,.24,side*.23],[1.34,.08,side*.07]],.006,w.tracer,40);
  }
  w.membrane([[.25,.3,0],[.65,.57,0],[.91,.18,0],[.58,.24,0]],w.fin,.015);
  w.optics([-.68,-.15,.36],.046);
  w.ellipsoid([-1.35,.59,-.1],[.07,.015,.045],dark,16);
  for(let i=0;i<8;i++){const x=-1.5+i*.085;w.ring(x,.16,.26,.22,i%3?chrome:w.tracer);}
  w.root.userData.animate=(time,state)=>w.animate(time,state,'whale',.55);

  const s = specimen('shark');
  const sharkProfile = s.body([[-1.85,.02,.001,.001],[-1.52,.02,.12,.14],[-1.12,.02,.29,.3],[-.58,.01,.38,.35],[.04,0,.31,.29],[.65,0,.19,.19],[1.27,.01,.07,.08],[1.55,.05,.025,.035],[1.69,.08,.001,.001]],88,44);
  s.skeleton(sharkProfile,-1,1.5,20);
  s.membrane([[-.28,.31,0],[.02,1.01,0],[.39,.24,0],[.08,.27,0]],s.fin,.018);
  s.membrane([[.78,.13,0],[.99,.42,0],[1.17,.08,0]],s.fin,.025);
  s.membrane([[1.28,.02,0],[1.83,1.03,0],[1.94,.86,0],[1.68,.13,0],[1.81,-.52,0],[1.63,-.44,0]],s.fin,.055);
  for(const side of [-1,1]) {
    s.membrane([[-.78,-.14,side*.22],[-.31,-.22,side*1.04],[.18,-.18,side*.84],[-.2,-.09,side*.25]],s.fin,.045);
    s.membrane([[.57,-.11,side*.12],[.86,-.23,side*.48],[1.04,-.13,side*.27]],s.fin,.04);
    for(let i=0;i<5;i++) {
      const x=-1.01+i*.105;
      const slit=Array.from({length:8},(_,j)=>{
        const v=j/7,px=x+.065*v,py=.2-.4*v,[cy,ry,rz]=sharkProfile(px);
        return [px,py,side*(rz*Math.sqrt(Math.max(.08,1-((py-cy)/ry)**2))+.013)];
      });
      s.tube(slit,.013,dark,20);
      s.tube(slit.map(([px,py,pz])=>[px-.016,py+.004,pz-side*.003]),.0035,brass,20);
    }
    s.tube([[-1.6,-.05,side*.08],[-1.39,-.12,side*.18],[-1.17,-.11,side*.25]],.008,dark,24);
    s.tube([[-1.3,.11,side*.21],[-.4,.1,side*.32],[.52,.06,side*.19],[1.43,.04,side*.04]],.006,s.tracer,48);
    s.tube([[-.56,-.11,side*.23],[-.31,-.19,side*.89],[.1,-.17,side*.75]],.011,chrome,22);
  }
  for(let i=0;i<7;i++) s.tube([[1.4,.08,0],[1.57,.13+i*.08,0],[1.85,.21+i*.1,0]],.006,i%2?chrome:s.tracer,18);
  s.optics([-1.31,.1,.2],.048);s.ellipsoid([-.58,-.1,0],[.32,.17,.18],s.glow,24);s.circuit([-.22,.02,.21],.8);
  for(let i=0;i<10;i++){const x=-.72+i*.2,[y,ry,rz]=sharkProfile(x);for(const side of [-1,1])s.tube([[x,y+ry*.68,0],[x+.08,y,side*rz*.7],[x+.14,y-ry*.6,0]],.006,chrome,16);}
  s.root.userData.animate=(time,state)=>s.animate(time,state,'fish',.85);

  function tropical(name,kind) {
    const f=specimen(name),angel=kind==='angel',butterfly=kind==='butterfly';
    const ry=angel?.71:butterfly?.7:.56;
    const profile=f.body([[-1.23,.02,.001,.001],[-1.12,.02,.12,.085],[-.88,.02,ry*.67,.16],[-.5,0,ry*.98,.24],[0,0,ry,.26],[.52,0,ry*.57,.19],[.86,0,.11,.09],[1.02,0,.035,.03],[1.08,0,.001,.001]],72,40);
    f.skeleton(profile,-.75,.89,14);
    if(angel) {
      f.membrane([[-.68,.38,0],[-.34,1.39,0],[.53,.44,0],[.76,.16,0],[.13,.59,0]],f.fin,.055);
      f.membrane([[-.7,-.32,0],[-.33,-1.24,0],[.6,-.34,0],[.16,-.57,0]],f.fin,.06);
      for(const side of [-1,1]) f.tube([[-.7,-.35,side*.1],[-.82,-.89,side*.12],[-.67,-1.47,side*.13]],.009,f.tracer,32);
    } else {
      f.membrane([[-.82,.36,0],[-.56,ry+.3,0],[.26,ry+.2,0],[.74,.2,0],[.2,ry*.7,0]],f.fin,.045);
      f.membrane([[-.51,-.46,0],[-.24,-ry-.25,0],[.58,-.43,0],[.75,-.18,0]],f.fin,.05);
    }
    f.membrane([[.88,0,0],[1.42,.53,0],[1.34,.1,0],[1.35,-.1,0],[1.42,-.53,0]],f.fin,.06);
    for(let i=0;i<9;i++) f.tube([[.86,0,0],[1.12,(i-4)*.05,0],[1.38,(i-4)*.12,0]],.004,i%3?chrome:f.tracer,16);
    for(const side of [-1,1]) {
      f.membrane([[-.63,-.04,side*.2],[-.16,-.27,side*.68],[.18,-.09,side*.45],[-.19,.1,side*.23]],f.fin,.13);
      f.tube([[-.64,.32,side*.16],[-.52,.08,side*.25],[-.52,-.26,side*.18]],.01,chrome,20);
      f.tube([[-.9,.1,side*.13],[-.3,.06,side*.247],[.36,.02,side*.21],[.87,0,side*.07]],.006,f.tracer,32);
      for(let i=0;i<3;i++) {
        const x=-.62+i*.43, [center,height,depth]=profile(x);
        const points=Array.from({length:20},(_,j)=>{const a=.14+j/19*(Math.PI-.28);return[x+Math.sin(a)*.07,center+Math.cos(a)*height*.99,side*Math.sin(a)*depth*1.015];});
        f.tube(points,butterfly?.025:.017, i===1?dark:f.tracer,24);
      }
      if(kind==='tang') f.membrane([[.73,.08,side*.1],[.94,.13,side*.13],[.91,-.07,side*.12]],brass,.008);
    }
    for(let i=0;i<8;i++) {
      const x=-.5+i*.13, top=angel?1.22-(x+.32)*1.13:ry+.22-(x+.2)*.15;
      f.tube([[x,ry*.48,0],[x+.1,top*.7,0],[x+.2,Math.max(.2,top),0]],.004,i%2?brass:f.tracer,18);
    }
    f.optics([- .88,.13,.143],.062);f.ellipsoid([-.24,-.06,0],[.23,.27,.14],f.glow,22);f.circuit([-.05,.17,.17],.65);
    if(butterfly){f.ellipsoid([.34,.31,.2],[.095,.11,.025],dark,20);f.ellipsoid([.34,.31,.227],[.037,.045,.008],f.glow,16);}
    for(let i=0;i<7;i++){const x=-.66+i*.19,[y,ry,rz]=profile(x);for(const side of [-1,1])f.tube([[x,y+ry*.72,0],[x+.035,y+.05,side*rz*.78],[x+.08,y-ry*.67,0]],.004,butterfly?brass:chrome,16);}
    f.root.userData.animate=(time,state)=>f.animate(time,state,'fish',angel?.8:butterfly?1:1.2);
  }
  tropical('angelfish','angel');tropical('butterflyfish','butterfly');tropical('tang','tang');

  const a=specimen('algae');
  a.fin.transmission=.78;a.fin.thickness=.035;a.fin.roughness=.31;
  const bladder=keep(glass.clone());bladder.color.set(0x8eafa0);bladder.attenuationColor.set(0x799c8e);bladder.transmission=.84;bladder.thickness=.075;bladder.roughness=.24;bladder.emissive.set(0x547468);bladder.emissiveIntensity=.08;
  for(let k=0;k<11;k++) {
    const angle=k*2.39996,length=2.25+(Math.sin(k*5.13)*.5+.5)*1.4;
    const origin=[Math.cos(angle)*.2,-1.45,Math.sin(angle)*.18],lean=[.38+Math.cos(angle)*.5,0,Math.sin(angle)*.55];
    const ribbonAngle=angle*.32+(k%3)*.42,direction=[Math.cos(ribbonAngle),0,Math.sin(ribbonAngle)];
    const positions=[],uv=[],indices=[],rows=56,cols=8,spine=[],widths=[];
    for(let i=0;i<=rows;i++) {
      const u=i/rows,center=[origin[0]+lean[0]*u*u+Math.sin(u*5.5+k)*.22*u,origin[1]+u*length,origin[2]+lean[2]*u*u+Math.cos(u*4+k)*.14*u];
      const width=(.018+Math.sin(u*Math.PI)**.7*(.13+(k%3)*.035))*(1-u*.48)*(1+.1*Math.sin(u*31+k));spine.push(center);widths.push(width);
      for(let j=0;j<=cols;j++) {
        const v=j/cols*2-1,ruffle=Math.sin(u*35+k*2)*.028*v*v;
        positions.push(center[0]+direction[0]*width*v,center[1]+ruffle,center[2]+direction[2]*width*v+Math.sin(u*9+k)*.055*v*v);uv.push(j/cols,u);
      }
    }
    for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const p=i*(cols+1)+j,q=p+cols+1;indices.push(p,q,p+1,q,q+1,p+1);}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
    a.mesh(geo,a.fin);
    for(let n=0;n<12;n++){const index=4+n*4,p=spine[index];for(const side of [-1,1])a.tube([p,[p[0]+direction[0]*widths[index]*side*.5,p[1]+.025,p[2]+direction[2]*widths[index]*side*.5],[p[0]+direction[0]*widths[index]*side*.88,p[1]+.018,p[2]+direction[2]*widths[index]*side*.88]],.0025,a.tracer,5);}
    a.tube(spine,.008,k%3?a.tracer:brass,52);
    for(let n=0;n<3;n++) {
      const u=.25+n*.22,index=Math.round(u*rows),p=spine[index],side=n%2?1:-1;
      a.ellipsoid([p[0]+direction[0]*side*.065,p[1],p[2]+direction[2]*side*.065],[.072,.112,.064],bladder,22);
      for(const edge of [-1,1]) {
        const end=[p[0]+direction[0]*widths[index]*edge*.9,p[1]+.035,p[2]+direction[2]*widths[index]*edge*.9];
        a.tube([p,[(p[0]+end[0])*.5,p[1]+.055,(p[2]+end[2])*.5],end],.0035,a.tracer,10);
      }
    }
  }
  for(let k=0;k<9;k++) {const angle=k/9*TAU;a.tube([[0,-1.43,0],[Math.cos(angle)*.28,-1.52,Math.sin(angle)*.28],[Math.cos(angle)*.5,-1.51,Math.sin(angle)*.5]],.017,k%3?chrome:brass,18);}
  const baseGeo=new THREE.CylinderGeometry(.18,.26,.15,24);baseGeo.translate(0,-1.46,0);a.mesh(baseGeo,dark);a.circuit([0,-1.37,.17],.7);
  a.root.userData.animate=(time,state={})=>{
    const force=state.phase==='ESCAPE'?1.35:1;
    a.glow.emissiveIntensity=.36+Math.sin(time*.6)*.08+(state.phase==='ECHO'?.35:0);a.tracer.emissiveIntensity=.14+Math.sin(time*.45)*.035;
    for(const {object,rest} of a.parts){const p=object.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=rest[i*3],y=rest[i*3+1],z=rest[i*3+2],weight=clamp((y+1.45)/3.7)**1.45;const contact=state.touch?.active?Math.exp(-((x-state.touch.x*1.6)**2+(y-state.touch.y*1.5)**2)*2)*state.touch.strength*.18:0;p.setXYZ(i,x+Math.sin(time*.72-y*1.7+z*3)*weight*.23*force,y-Math.sin(time*.4+x)*weight*.04,z+Math.cos(time*.53-y*1.2+x*2)*weight*.18*force+contact);}p.needsUpdate=true;object.geometry.computeVertexNormals();object.geometry.computeBoundingSphere();}
  };
  for (const root of Object.values(specimens)) root.userData.compile();
  return specimens;
}
