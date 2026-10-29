import * as THREE from 'three';
import {morphLobes,applyMorphField} from './air-species-field.js';

const CHANNELS = [
  ['screen.upper_left', 640, 552],
  ['screen.portrait_left', 384, 960],
  ['screen.left.02', 384, 452],
  ['screen.left.03', 384, 456],
];
const TAU = Math.PI * 2;
const INK = ['rgba(36,58,70,.23)', 'rgba(35,55,69,.35)', 'rgba(30,48,62,.48)', 'rgba(25,43,57,.64)'];
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const noise = n => { const f = Math.sin(n * 127.1 + 311.7) * 43758.5453; return f - Math.floor(f); };

function canvasOf(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function sky(width, height, dark = false) {
  const canvas = canvasOf(width, height), ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, width * .32, height);
  grad.addColorStop(0, dark ? '#304954' : '#dfe6e6');
  grad.addColorStop(.52, dark ? '#536b73' : '#c3d2d8');
  grad.addColorStop(1, dark ? '#758a90' : '#8faab8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < 7; i++) {
    const x = width * noise(i + 21), y = height * (.25 + noise(i + 36) * .72);
    const haze = ctx.createRadialGradient(x, y, 0, x, y, width * .65);
    haze.addColorStop(0, dark ? 'rgba(209,218,209,.08)' : 'rgba(246,248,239,.33)');
    haze.addColorStop(1, 'rgba(227,237,236,0)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, width, height);
  }
  return canvas;
}

function grain() {
  const canvas = canvasOf(192, 192), ctx = canvas.getContext('2d');
  const image = ctx.createImageData(192, 192);
  for (let i = 0; i < image.data.length; i += 4) {
    const value = noise(i + 197) > .5 ? 255 : 0;
    image.data[i] = image.data[i + 1] = image.data[i + 2] = value;
    image.data[i + 3] = Math.round(12 + noise(i + 17) * 13);
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

// Long, interlaced fern axes build the whole organism, including its body.
function makeFronds() {
  const result = [];
  const axes = [
    [[.02,.35],[-.15,-.22],[-1.12,-.3],[-1.5,-.67],[-1.02,-.96],[-.32,-.65],[.22,-.85]],
    [[.08,.4],[-.48,.04],[-1.35,.12],[-1.52,-.25],[-.84,-.47],[-.45,-.2]],
    [[-.02,.25],[-.33,-.26],[-.7,-.74],[-.38,-1.12],[.18,-.9],[.43,-.55]],
    [[-.06,.45],[.2,-.08],[.84,-.53],[1.48,-.34],[1.18,.03],[.67,-.08],[.83,-.36]],
    [[.03,.28],[.47,.08],[.9,-.15],[1.47,-.6],[1.28,-.94],[.78,-.98]],
    [[.08,.5],[.3,.17],[.66,.42],[1.16,.25],[1.46,-.06],[1.6,-.42]],
  ];
  for (let family = 0; family < axes.length; family++) for (let strand = 0; strand < 3; strand++) {
    const i = family * 3 + strand, offset = (strand - 1) * .045;
    const nodes = axes[family].map(([x,y], index) => [x * (1 - strand * .035) + offset * Math.sin(index), y + offset * (index + 1), (noise(i + 53) - .5) * .6 + Math.sin(index + i) * .12]);
    result.push({nodes, phase: i * 1.7, width: .038 + .036 * noise(i + 17), tone: i % 4, count: 86 + (i % 3) * 8});
  }
  for (let i = 0; i < 9; i++) {
    const side = i % 2 ? 1 : -1, f = i / 8;
    result.push({
      nodes: [[-.12 + f * .28, -.34 + (f - .5) * .2, -.2], [side * .18, -.05, (f - .5) * .5],
        [side * (.24 + f * .2), .5, .18], [side * (.44 + f * .08), .89, -.1],
        [side * (.16 + f * .12), 1.2 - f * .15, -.2], [-side * .24, .66, .1]],
      phase: i * 2.4, width: .025 + f * .025, tone: i % 4, count: 66,
    });
  }
  return result;
}

function spline(nodes, t, output) {
  const progress = t * (nodes.length - 1), i = Math.min(nodes.length - 2, Math.floor(progress)), u = progress - i;
  const a = nodes[Math.max(0, i - 1)], b = nodes[i], c = nodes[i + 1], d = nodes[Math.min(nodes.length - 1, i + 2)];
  for (let k = 0; k < 3; k++) output[k] = .5 * (2 * b[k] + (-a[k] + c[k]) * u + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * u * u + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * u * u * u);
  return output;
}

export function createAirSpeciesViews(options = {}) {
  const channels = options.channels || CHANNELS;
  const entries = new Map(channels.map(([id, width, height]) => {
    const canvas = canvasOf(width, height), texture = new THREE.CanvasTexture(canvas);
    texture.name = 'AIR SPECIES SP-01 / ' + id;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false;
    texture.minFilter = texture.magFilter = THREE.LinearFilter;
    return [id, {canvas, ctx: canvas.getContext('2d'), texture, sky: sky(width, height, id === 'screen.left.03')}];
  }));
  const textures = new Map([...entries].map(([id, entry]) => [id, entry.texture]));
  const specimen = canvasOf(1024, 1024), specimenContext = specimen.getContext('2d');
  const membrane=canvasOf(128,128),membraneContext=membrane.getContext('2d'),membranePixels=membraneContext.createImageData(128,128);
  const fronds = makeFronds(), filmGrain = grain(), p = [0, 0, 0];
  const points = fronds.map(frond => new Float32Array((frond.count + 1) * 3));
  let frames = 0, disposed = false;

  function drawMembrane(state,lobes){
    const pixels=membranePixels.data,strength=state.field.strength;
    membraneContext.clearRect(0,0,128,128);
    if(strength<.008)return;
    for(let iy=0;iy<128;iy++)for(let ix=0;ix<128;ix++){
      const x=(ix/127*1024-512)/249,y=(iy/127*1024-501)/249;
      let density=0,gx=0,gy=0;
      for(const lobe of lobes){const dx=x-lobe.x,dy=y-lobe.y,d=dx*dx+dy*dy+.075,r2=lobe.r*lobe.r;density+=r2/d;gx-=2*r2*dx/(d*d);gy-=2*r2*dy/(d*d);}
      const edge=clamp((density-.84)*2.8,0,1),normal=Math.hypot(gx,gy,1.8);
      const light=clamp((gx*.45+gy*.7+1.8*.6)/normal,0,1),shine=light**9;
      const index=(iy*128+ix)*4;
      pixels[index]=104+light*70+shine*55;pixels[index+1]=139+light*60+shine*40;pixels[index+2]=153+light*51+shine*32;
      pixels[index+3]=edge*edge*(3-2*edge)*(.14+strength*.47)*255;
    }
    membraneContext.putImageData(membranePixels,0,0);
    specimenContext.drawImage(membrane,0,0,1024,1024);
  }

  function drawSpecimen(state) {
    const ctx = specimenContext, paths = INK.map(() => new Path2D()), shafts = new Path2D();
    ctx.clearRect(0, 0, 1024, 1024);
    const field=state.field,lobes=morphLobes(state),flow=state.params.fluidity;
    const bank = clamp(state.bank || 0, -.65, .65) * .65+Math.sin(state.phase*.37)*.085+field.swirl*.09;
    const yaw = Math.sin(state.time * .31) * .48 + state.vx * .2;
    const cos = Math.cos(bank), sin = Math.sin(bank), cy = Math.cos(yaw), sy = Math.sin(yaw);
    ctx.save();ctx.translate(512,501);ctx.rotate(bank);ctx.scale(cy,1);ctx.translate(-512,-501);drawMembrane(state,lobes);ctx.restore();
    const feather = state.params.feather, speed = clamp(state.speed, 0, 3);
    const stretch = clamp(state.stretch || 1, .7, 1.8);
    const lag = clamp(state.featherLag || 0, -2, 2);
    for (let fi = 0; fi < fronds.length; fi++) {
      const frond = fronds[fi], count = frond.count, line = points[fi];
      for (let j = 0; j <= count; j++) {
        const u = j / count;
        spline(frond.nodes, u, p);
        const breathing=1+Math.sin(state.phase*.56+frond.phase*.055)*(.07+flow*.1)+field.energy*Math.sin(field.phase-u*3)*.16;
        const twist=Math.sin(state.phase*.43-p[1]*1.6)*(.07+flow*.13)+field.swirl*.18+field.strength*Math.sin(field.phase-p[1]*1.4)*.12;
        const bx=p[0]*breathing,by=p[1];
        p[0]=bx*Math.cos(twist)-by*Math.sin(twist);
        p[1]=bx*Math.sin(twist)+by*Math.cos(twist);
        // Distal fibres trail velocity; travelling bends share the body's phase.
        const wave = Math.sin(state.phase * .7 - u * 5.2 + frond.phase);
        p[0] += wave * (.07 + feather * .085) * u + state.wind.x * .12 * u;
        p[1] += Math.cos(state.phase * .53 - u * 4 + frond.phase) * .11 * feather * u;
        p[0] -= state.vx * u * u * (.09 + feather * .055);
        p[1] += state.vy * u * u * (.07 + feather * .05);
        p[1] += Math.sin(state.phase * .7 - u * 3.5 - lag + frond.phase * .13) * .05 * feather;
        p[2] += Math.sin(state.phase * .43 + u * 3 + frond.phase) * .24;
        applyMorphField(p,u,state,lobes);
        const x = p[0] * cy + p[2] * sy, y = p[1] * (.98 + (stretch - 1) * .12);
        line[j * 3] = 512 + (x * cos - y * sin) * 249;
        line[j * 3 + 1] = 501 + (x * sin + y * cos) * 249;
        line[j * 3 + 2] = p[2];
      }
      shafts.moveTo(line[0], line[1]);
      for (let j = 1; j <= count; j++) shafts.lineTo(line[j * 3], line[j * 3 + 1]);
      const path = paths[frond.tone];
      for (let j = 2; j < count; j++) {
        const u = j / count, idx = j * 3, x = line[idx], y = line[idx + 1];
        let dx = line[idx + 3] - line[idx - 3], dy = line[idx + 4] - line[idx - 2];
        const length = Math.hypot(dx, dy) || 1; dx /= length; dy /= length;
        const size = 249 * frond.width * Math.pow(Math.sin(Math.PI * u), .6) * (1 + speed * .12+field.energy*.25) * (1 + .13 * Math.sin(j * 1.8 + frond.phase));
        for (const side of [-1, 1]) {
          const curl = Math.sin(state.phase * .85 - u * 9 + frond.phase) * feather * .3+field.swirl*.15;
          const back = size * (.72 + speed * .16);
          const endX = x - dy * size * side + dx * back;
          const endY = y + dx * size * side + dy * back;
          path.moveTo(x, y);
          path.quadraticCurveTo(x - dy * size * side * .63 - dx * size * (.28 + curl), y + dx * size * side * .63 - dy * size * (.28 + curl), endX, endY);
          // Sub-barbs keep the magnified portrait a fibrous living surface.
          if (j % 2 === 0) for (let b = 1; b <= 3; b++) {
            const v = b / 4, bx = x + (endX - x) * v, by = y + (endY - y) * v;
            path.moveTo(bx, by);
            path.quadraticCurveTo(bx - dx * size * .14, by - dy * size * .14, bx - dx * size * .25 - dy * size * side * .13, by - dy * size * .25 + dx * size * side * .13);
          }
        }
      }
    }
    ctx.lineCap = 'round';
    for (let i = 0; i < paths.length; i++) {
      ctx.strokeStyle = INK[i]; ctx.lineWidth = .95 + i * .15; ctx.stroke(paths[i]);
    }
    ctx.strokeStyle = 'rgba(26,45,59,.58)'; ctx.lineWidth = 1.4; ctx.stroke(shafts);
    ctx.strokeStyle = 'rgba(232,239,232,.13)'; ctx.lineWidth = .55; ctx.translate(-.65, -.4); ctx.stroke(shafts); ctx.resetTransform();
  }

  function finish(entry, state, heading, footer, dark = false) {
    const {ctx, canvas} = entry, {width: w, height: h} = canvas;
    ctx.save();
    ctx.globalAlpha = .37;
    ctx.fillStyle = ctx.createPattern(filmGrain, 'repeat');
    ctx.translate(Math.floor(state.time * 13) % 192, Math.floor(state.time * 7) % 192);
    ctx.fillRect(-192, -192, w + 384, h + 384);
    ctx.restore();
    const vignette = ctx.createRadialGradient(w * .5, h * .44, w * .18, w * .5, h * .46, Math.max(w, h) * .73);
    vignette.addColorStop(0, 'rgba(24,47,62,0)'); vignette.addColorStop(1, 'rgba(24,47,62,.17)');
    ctx.fillStyle = vignette; ctx.fillRect(0, 0, w, h);
    if (!options.hideText) {
      ctx.fillStyle = dark ? 'rgba(231,236,222,.75)' : 'rgba(37,60,72,.73)';
      ctx.font = `${w >= 600 ? 12 : 10}px monospace`;
      ctx.fillText(heading, 24, 29);
      ctx.font = `${w >= 600 ? 10 : 9}px monospace`;
      ctx.fillText(footer, 24, h - 22);
    }
    entry.texture.needsUpdate = true;
  }

  function drawMain(state) {
    const entry = entries.get('screen.upper_left'), {ctx, canvas} = entry, w = canvas.width, h = canvas.height;
    ctx.drawImage(entry.sky, 0, 0);
    const flowLines=new Path2D(),field=state.field;
    for(let row=0;row<11;row++)for(let column=0;column<=32;column++){
      const px=column*w/32,dx=px/w-.5-field.x*.32,falloff=Math.exp(-dx*dx*8);
      const py=h*(.12+row*.072)+Math.sin(column*.15+state.phase*.5+row*.4)*(7+state.params.fluidity*10)+falloff*field.strength*(field.y*35+Math.sin(column*.28-field.phase)*field.energy*27);
      column?flowLines.lineTo(px,py):flowLines.moveTo(px,py);
    }
    ctx.strokeStyle='rgba(75,108,122,.095)';ctx.lineWidth=.8;ctx.stroke(flowLines);
    // The viewport stays fixed: input moves the actual organism through this sky.
    const scale = options.focus ? Math.min(w, h) * 1.2 : w * 1.03;
    const size = scale * (1 + state.z * .07), x = w * .5 + state.x * w * .105, y = h * .5 - state.y * h * .115;
    for (let i = 0; i < 34; i++) {
      const px = ((noise(i + 50) * w + state.time * (4 + state.wind.x * 6) + w * 100) % w);
      const py = ((noise(i + 80) * h - state.time * state.wind.y * 4 + h * 100) % h);
      ctx.fillStyle = `rgba(242,246,235,${.12 + noise(i) * .17})`;
      ctx.fillRect(px, py, 1.2 + noise(i + 4), 1.2);
    }
    ctx.drawImage(specimen, x - size / 2, y - size / 2, size, size);
    finish(entry, state, 'AIR SPECIES  /  SP—01', 'AERIAL ORGANISM     ·     LIVING STUDY');
  }

  function drawDetail(state) {
    const entry = entries.get('screen.portrait_left'), {ctx, canvas} = entry;
    ctx.drawImage(entry.sky, 0, 0);
    // The exact same raster is cropped, so body and feather phase cannot diverge.
    const sx = 390 + state.vx * 8+state.field.x*100*state.field.strength, sy = 212 - state.vy * 7-state.field.y*125*state.field.strength;
    ctx.drawImage(specimen, sx, sy, 258, 645, 0, 0, canvas.width, canvas.height);
    finish(entry, state, 'SP—01  /  FIBRE', 'MICRO VIEW  ·  SAME ORGANISM');
  }

  function drawSignal(state) {
    const entry = entries.get('screen.left.02'), {ctx, canvas} = entry, w = canvas.width, h = canvas.height;
    ctx.drawImage(entry.sky, 0, 0);
    const path = new Path2D(),lobes=morphLobes(state),point=[0,0,0];
    for (let row = 0; row < 19; row++) {
      const y0 = 57 + row * 12;
      for (let x = -8; x <= w + 8; x += 6) {
        const envelope = Math.sin(x / w * Math.PI);
        const y = y0 + Math.sin(x * .012 + state.phase * .55 + row * .19) * (8 + state.speed * 7) * envelope + state.wind.y * x * .12;
        point[0]=(x/w-.5)*3.5;point[1]=(y/h-.4)*3;point[2]=0;applyMorphField(point,1,state,lobes);
        const fx=(point[0]/3.5+.5)*w,fy=(point[1]/3+.4)*h;
        x === -8 ? path.moveTo(fx,fy) : path.lineTo(fx,fy);
      }
    }
    ctx.strokeStyle = 'rgba(42,72,88,.4)'; ctx.lineWidth = .75; ctx.stroke(path);
    ctx.strokeStyle = 'rgba(34,61,76,.62)'; ctx.lineWidth = 1.3; ctx.beginPath();
    for (let x = 24; x < w - 24; x += 2) {
      const u = (x - 24) / (w - 48);
      const y = h * .76 + Math.sin(u * TAU * 2.7 - state.phase) * Math.sin(u * Math.PI) * (9 + state.speed * 13+state.field.energy*24) + Math.sin(u * TAU * 7 - state.phase * 1.3) * (2 + state.params.feather * 2+state.field.strength*5);
      x === 24 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = 'rgba(39,64,76,.65)'; ctx.font = '10px monospace';
    ctx.fillText('FLOW '+state.speed.toFixed(2), 24, h * .9);
    ctx.fillText('FIELD '+Math.round(state.field.strength*100)+'%', w - 112, h * .9);
    finish(entry, state, 'SP—01  /  AIR CURRENT', 'VELOCITY · VORTEX · ATTRACTION');
  }

  function drawTrail(state) {
    const entry = entries.get('screen.left.03'), {ctx, canvas} = entry, w = canvas.width, h = canvas.height;
    ctx.drawImage(entry.sky, 0, 0);
    const trail = state.trail || [], px = x => w * .5 + x * w * .32, py = y => h * .49 - y * h * .29;
    if (trail.length > 1) {
      ctx.strokeStyle = 'rgba(219,232,223,.48)'; ctx.lineWidth = 1; ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const pt = trail[i]; i ? ctx.lineTo(px(pt.x), py(pt.y)) : ctx.moveTo(px(pt.x), py(pt.y));
      }
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const pt = trail[Math.floor((trail.length - 1) * (i / 6))];
        const size = w * .45;
        ctx.globalAlpha = .1 + i * .055;
        ctx.drawImage(specimen, px(pt.x) - size / 2, py(pt.y) - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    }
    const size = w * .52;
    ctx.drawImage(specimen, px(state.x) - size / 2, py(state.y) - size / 2, size, size);
    ctx.fillStyle = 'rgba(233,240,224,.75)'; ctx.beginPath(); ctx.arc(px(state.x), py(state.y), 2.2, 0, TAU); ctx.fill();
    finish(entry, state, 'SP—01  /  FLIGHT MEMORY', 'RECENT PATH  ·  CONTINUOUS FLIGHT', true);
  }

  return {
    textures,
    render(state, enabled = () => true) {
      if (disposed || !channels.some(([id]) => entries.has(id) && enabled(id))) return;
      drawSpecimen(state);
      if (entries.has('screen.upper_left') && enabled('screen.upper_left')) drawMain(state);
      if (entries.has('screen.portrait_left') && enabled('screen.portrait_left')) drawDetail(state);
      if (entries.has('screen.left.02') && enabled('screen.left.02')) drawSignal(state);
      if (entries.has('screen.left.03') && enabled('screen.left.03')) drawTrail(state);
      frames++;
    },
    diagnostics() {
      return {frames, fronds: fronds.length, textures: channels.map(([id, width, height]) => ({id, width, height})), sharedSpecimen: true,morphField:'three-lobe scalar field'};
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const entry of entries.values()) { entry.texture.dispose(); entry.canvas.width = entry.canvas.height = 0; entry.sky.width = entry.sky.height = 0; }
      specimen.width = specimen.height = filmGrain.width = filmGrain.height = 0;
      membrane.width=membrane.height=0;
    },
  };
}
