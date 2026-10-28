import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {screens,cabinetSpecs,views} from './config.js';
import {createMaterials} from './materials.js';
import {createScreen} from './screens.js';
import {createContentController} from './content-controller.js';
import {createCabinet} from './cabinets.js';
import {createStructure,createStool} from './structure.js';
import {createTable} from './furniture.js';
import {rod,box} from './model-utils.js';
import './style.css';
const canvas=document.querySelector('#scene');
const scene=new THREE.Scene();scene.background=new THREE.Color('#466f87');scene.fog=new THREE.Fog('#466f87',33,95);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.VSMShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.96;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.info.autoReset=false;
const camera=new THREE.PerspectiveCamera(views.reference.fov,innerWidth/innerHeight,.1,180);
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.09;controls.minDistance=7;controls.maxDistance=50;controls.maxPolarAngle=Math.PI*.495;controls.target.set(0,4.44,0);
const pmrem=new THREE.PMREMGenerator(renderer);const environment=new RoomEnvironment();scene.environment=pmrem.fromScene(environment,.06).texture;scene.environmentIntensity=.57;environment.dispose();pmrem.dispose();
scene.add(new THREE.HemisphereLight(0xb2d3e2,0x857c69,1.4));
const key=new THREE.DirectionalLight(0xffe0b1,2.2);key.position.set(-7,11,8);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-8,right:8,top:12,bottom:-7,near:.5,far:40});key.shadow.bias=-.00025;key.shadow.intensity=.28;key.shadow.normalBias=.024;key.shadow.radius=7;key.shadow.blurSamples=12;key.target.position.set(0,3,0);scene.add(key,key.target);
const fill=new THREE.DirectionalLight(0xc4e3ef,1.1);fill.position.set(8,8,5);scene.add(fill);
const rim=new THREE.DirectionalLight(0xf1cf9d,1.6);rim.position.set(3,6,-6);scene.add(rim);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(240,240),new THREE.MeshStandardMaterial({color:0x517f93,roughness:.53,metalness:.12}));floor.name='environment.floor';floor.rotation.x=-Math.PI/2;floor.position.y=-.016;floor.receiveShadow=true;scene.add(floor);
// Small local pools correspond to the reference's low amber electronics, not ambient orange light.
for(const [x,y,z,power] of [[-4.8,.45,1.8,7],[4.9,.45,1.8,8],[-4.8,5.6,1.6,3],[5,4.3,1.7,4]]){const l=new THREE.PointLight(0xffbd78,power,3.2,2);l.position.set(x,y,z);scene.add(l)}
const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;const sc=shadowCanvas.getContext('2d');const sg=sc.createRadialGradient(64,64,3,64,64,62);sg.addColorStop(0,'rgba(20,36,40,.28)');sg.addColorStop(.5,'rgba(20,36,40,.12)');sg.addColorStop(1,'rgba(20,36,40,0)');sc.fillStyle=sg;sc.fillRect(0,0,128,128);const shadowTex=new THREE.CanvasTexture(shadowCanvas);
for(const [x,z,sx,sz] of [[-.06,1,2.8,1.8],[-4.5,1.7,1.4,1.1],[4.5,1.7,1.4,1.1],[-2.5,-.8,.7,.6],[2.5,-.8,.7,.6]]){const soft=new THREE.Mesh(new THREE.PlaneGeometry(sx,sz),new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false,toneMapped:false}));soft.rotation.x=-Math.PI/2;soft.position.set(x,.002,z);soft.name='environment.contactShadow';scene.add(soft);}
const mats=createMaterials(),installation=new THREE.Group();installation.name='future-plan.installation';scene.add(installation);
const registry=new Map(),displayMeshes=new Map(),originalMaps=new Map(),selectionListeners=new Set();
function register(root,label){const id=root.userData.id||root.name;if(registry.has(id))throw Error('Duplicate interactive id: '+id);root.userData.id=id;if(label)root.userData.label=label;const anchor=new THREE.Object3D();anchor.name=id+'.anchor';root.add(anchor);registry.set(id,root);return root;}
const structure=createStructure(mats);installation.add(structure);
for(const s of cabinetSpecs){const c=createCabinet({id:s.id,width:s.size[0],height:s.size[1],depth:s.size[2],seed:s.seed,materials:mats});c.position.set(...s.position);c.rotation.y=s.rotation;installation.add(c);register(c,s.id.replace('cabinet.','机箱 · '));}
const table=createTable(mats);installation.add(table.root);register(table.root);table.items.forEach(x=>register(x));
const stool=createStool(mats);stool.position.set(-.06,0,1.0);installation.add(stool);register(stool,'中央 · 郁金香凳');
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(new OutputPass());
const grain=new ShaderPass({uniforms:{tDiffuse:{value:null},amount:{value:.024}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform sampler2D tDiffuse;uniform float amount;varying vec2 vUv;float random(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}void main(){vec4 c=texture2D(tDiffuse,vUv);float n=(random(gl_FragCoord.xy)-.5)*amount;float vignette=1.0-.075*dot(vUv-.5,vUv-.5);gl_FragColor=vec4((c.rgb+n)*vignette,c.a);}'});composer.addPass(grain);
const loader=new THREE.TextureLoader();
async function loadTexture(url){const tex=await loader.loadAsync(url);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);return tex;}
function chooseView(name){const v=views[name];if(!v)throw Error('Unknown view: '+name);camera.position.set(...v.position);camera.fov=v.fov*Math.max(1,(1374/1145)/(innerWidth/innerHeight));camera.updateProjectionMatrix();controls.target.set(...v.target);controls.update();document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));activeView=name;}
let activeView='reference',selected=null,down=null,demoCanvas=null,demoId=null;
chooseView('reference');
function pickId(object){for(let obj=object;obj;obj=obj.parent){if(registry.has(obj.userData.id))return obj.userData.id;}return null;}
function select(id){if(id!==null&&!registry.has(id))throw Error('Unknown position: '+id);selected=id;const panel=document.querySelector('#selection');panel.hidden=!id;if(id){document.querySelector('#selection-name').textContent=registry.get(id).userData.label||id;document.querySelector('#content-demo').hidden=!displayMeshes.has(id);document.querySelector('#content-restore').hidden=!displayMeshes.has(id);const obj=registry.get(id);const detail={id,object:obj,anchor:obj.getWorldPosition(new THREE.Vector3()).toArray()};window.dispatchEvent(new CustomEvent('future-plan:select',{detail}));selectionListeners.forEach(fn=>fn(detail));}return id;}
const raycaster=new THREE.Raycaster();canvas.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});canvas.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;const rect=canvas.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=raycaster.intersectObjects([...registry.values()],true).find(h=>pickId(h.object));select(hit?pickId(hit.object):null);down=null;});
const contentController=createContentController({screens:displayMeshes,originals:originalMaps,loadTexture,makeTexture(source){
 if(source?.isTexture)return {texture:source,owned:false};
 if(source instanceof HTMLCanvasElement||source instanceof HTMLImageElement||source instanceof ImageBitmap){const texture=source instanceof HTMLCanvasElement?new THREE.CanvasTexture(source):new THREE.Texture(source);texture.needsUpdate=true;texture.colorSpace=THREE.SRGBColorSpace;return {texture,owned:true};}
 throw new TypeError('Screen content must be a URL, THREE.Texture, image, or canvas.');
}});
const setScreenContent=contentController.setScreenContent;
function restoreScreenContent(id){contentController.restoreScreenContent(id);if(demoId===id){demoId=null;demoCanvas=null;}}
async function contentDemo(id){if(demoId&&demoId!==id)restoreScreenContent(demoId);demoCanvas=document.createElement('canvas');demoCanvas.width=800;demoCanvas.height=480;demoId=id;await setScreenContent(id,demoCanvas);drawDemo(performance.now());}
function drawDemo(time){if(!demoCanvas||!demoId)return;const ctx=demoCanvas.getContext('2d'),w=demoCanvas.width,h=demoCanvas.height;ctx.fillStyle='#102b3b';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#81bdc8';ctx.lineWidth=1;for(let i=0;i<12;i++){ctx.beginPath();for(let x=0;x<w;x+=4){const y=h*.5+Math.sin(x*.012+time*.0008+i*.19)*Math.sin(x/w*Math.PI)*h*.25+(i-6)*7;x?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();}ctx.fillStyle='#e1dac0';ctx.font='14px monospace';ctx.fillText(demoId,28,32);displayMeshes.get(demoId).material.map.needsUpdate=true;}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>chooseView(b.dataset.view)));document.querySelector('#hide-ui').addEventListener('click',()=>document.body.classList.toggle('ui-hidden'));document.querySelector('#clear-selection').addEventListener('click',()=>select(null));document.querySelector('#content-demo').addEventListener('click',()=>contentDemo(selected));document.querySelector('#content-restore').addEventListener('click',()=>restoreScreenContent(selected));addEventListener('keydown',e=>{if(e.key.toLowerCase()==='h')document.body.classList.toggle('ui-hidden');if(e.key==='Escape')select(null)});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.fov=views[activeView].fov*Math.max(1,(1374/1145)/camera.aspect);camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight)});
const ready=Promise.all(screens.map(async spec=>{const texture=await loadTexture(import.meta.env.BASE_URL+'textures/'+spec.texture+'.png');const root=createScreen(spec,mats,texture);installation.add(root);register(root);const display=root.getObjectByName('displaySurface');displayMeshes.set(spec.id,display);originalMaps.set(spec.id,texture);return root;})).then(()=>{if(displayMeshes.size!==12)throw Error('Expected 12 screens');scene.updateMatrixWorld(true);document.querySelector('#loading').style.opacity=0;setTimeout(()=>document.querySelector('#loading').remove(),500);return true;}).catch(err=>{document.querySelector('#loading').textContent='场景加载失败：'+err.message;console.error(err);throw err;});
window.futurePlan={ready,scene,camera,renderer,controls,registry,screens:displayMeshes,setView:chooseView,select,onSelect(fn){if(typeof fn!=='function')throw new TypeError('callback must be a function');selectionListeners.add(fn);return()=>selectionListeners.delete(fn);},getObject:id=>registry.get(id),getAnchor(id){const o=registry.get(id);if(!o)throw Error('Unknown position: '+id);return o.getWorldPosition(new THREE.Vector3()).toArray();},setScreenContent,restoreScreenContent,contentDemo,setUIVisible(visible){document.body.classList.toggle('ui-hidden',!visible);},capture(){composer.render();return canvas.toDataURL('image/png');},diagnostics(){let meshes=0,transparent=0;scene.traverse(o=>{if(o.isMesh)meshes++;if(o.material?.transmission>0)transparent++;});return{screenCount:displayMeshes.size,interactiveIds:[...registry.keys()],meshes,transparentParts:transparent,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,view:activeView,renderer:renderer.getContext().getParameter(renderer.getContext().RENDERER),canvas:[canvas.width,canvas.height]};}};
renderer.setAnimationLoop(time=>{controls.update();drawDemo(time);renderer.info.reset();composer.render();});
