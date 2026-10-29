import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {screens,cabinetSpecs,views,screenDesign,displayDefaults,sceneSettings} from './config.js';
import {createMaterials} from './materials.js';
import {createScreen} from './screens.js';
import {createContentController} from './content-controller.js';
import {createCabinet} from './cabinets.js';
import {createStructure,createStool} from './structure.js';
import {createTable} from './furniture.js';
import {createMounts} from './mounts.js';
import {createLocalMedia} from './media.js';
import {createLayoutStore} from './layout-store.js';
import {createEditor} from './editor.js';
import {createDataBridge} from './data-bridge.js';
import {createCameraHardware} from './camera-hardware.js';
import {createRemoteChannel} from './remote-channel.js';
import {AIR_SCREEN_IDS,createAirSpeciesState} from './air-species-state.js';
import {createAirSpeciesViews} from './air-species-views.js';
import {createAirSpeciesPanel} from './air-species-panel.js';
import {airTelemetry,applyAirRemoteControl} from './air-remote-protocol.js';
import './style.css';

const canvas=document.querySelector('#scene'),loading=document.querySelector('#loading'),loadingDetail=document.querySelector('#loading-detail');
function setBootProgress(value,detail){const percent=Math.round(value);document.querySelector('#loading-progress').style.width=percent+'%';document.querySelector('#loading-percent').textContent=String(percent).padStart(2,'0')+'%';document.querySelector('#loading-meter').setAttribute('aria-valuenow',String(percent));if(detail)loadingDetail.textContent=detail;}
function fatal(message){if(!loading.isConnected)document.body.append(loading);document.body.classList.add('is-booting');loading.style.opacity=1;document.querySelector('#loading-title').textContent='场景无法启动';loadingDetail.textContent=message;}
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});}
catch(error){fatal('请使用支持 WebGL 2 的桌面版 Chrome 或 Safari，并开启硬件加速。'+error.message);throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,sceneSettings.pixelRatioLimit));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.VSMShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=sceneSettings.exposure;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.info.autoReset=false;
canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();renderer.setAnimationLoop(null);fatal('WebGL 上下文已丢失，正在等待浏览器恢复…');});
canvas.addEventListener('webglcontextrestored',()=>location.reload());
const scene=new THREE.Scene();scene.background=new THREE.Color(sceneSettings.background);scene.fog=new THREE.Fog(sceneSettings.background,sceneSettings.fog.near,sceneSettings.fog.far);
const camera=new THREE.PerspectiveCamera(views.reference.fov,innerWidth/innerHeight,.08,180);
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.085;controls.minDistance=1.2;controls.maxDistance=50;controls.maxPolarAngle=Math.PI*.495;controls.target.set(...views.reference.target);
const pmrem=new THREE.PMREMGenerator(renderer),environment=new RoomEnvironment();scene.environment=pmrem.fromScene(environment,.06).texture;scene.environmentIntensity=sceneSettings.environmentIntensity;environment.dispose();pmrem.dispose();
const hemisphere=new THREE.HemisphereLight(sceneSettings.hemisphere.sky,sceneSettings.hemisphere.ground,sceneSettings.hemisphere.intensity);scene.add(hemisphere);
const key=new THREE.DirectionalLight(sceneSettings.key.color,sceneSettings.key.intensity);key.position.set(...sceneSettings.key.position);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-8,right:8,top:12,bottom:-7,near:.5,far:40});key.shadow.bias=-.00025;key.shadow.intensity=.28;key.shadow.normalBias=.024;key.shadow.radius=7;key.shadow.blurSamples=12;key.target.position.set(0,3,0);scene.add(key,key.target);
const fill=new THREE.DirectionalLight(sceneSettings.fill.color,sceneSettings.fill.intensity);fill.position.set(...sceneSettings.fill.position);scene.add(fill);
const rim=new THREE.DirectionalLight(sceneSettings.rim.color,sceneSettings.rim.intensity);rim.position.set(...sceneSettings.rim.position);scene.add(rim);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(240,240),new THREE.MeshStandardMaterial(sceneSettings.floor));floor.name='environment.floor';floor.rotation.x=-Math.PI/2;floor.position.y=-.016;floor.receiveShadow=true;scene.add(floor);
for(const [x,y,z,power] of [[-4.8,.45,1.8,1.8],[4.9,.45,1.8,2],[-4.8,5.6,1.6,1.1],[5,4.3,1.7,1.2]]){const light=new THREE.PointLight(0xffc78e,power,2.8,2);light.position.set(x,y,z);scene.add(light);}
const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;const shadowContext=shadowCanvas.getContext('2d'),gradient=shadowContext.createRadialGradient(64,64,3,64,64,62);gradient.addColorStop(0,'rgba(20,36,40,.28)');gradient.addColorStop(.5,'rgba(20,36,40,.12)');gradient.addColorStop(1,'rgba(20,36,40,0)');shadowContext.fillStyle=gradient;shadowContext.fillRect(0,0,128,128);const shadowTexture=new THREE.CanvasTexture(shadowCanvas);
for(const [x,z,sx,sz] of [[-.06,1,2.8,1.8],[-4.5,1.7,1.4,1.1],[4.5,1.7,1.4,1.1],[-2.5,-.8,.7,.6],[2.5,-.8,.7,.6]]){const soft=new THREE.Mesh(new THREE.PlaneGeometry(sx,sz),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,toneMapped:false}));soft.rotation.x=-Math.PI/2;soft.position.set(x,.002,z);soft.name='environment.contactShadow';scene.add(soft);}
const mats=createMaterials(),installation=new THREE.Group();installation.name='future-species.installation';scene.add(installation);
const registry=new Map(),displayMeshes=new Map(),originalMaps=new Map(),selectionListeners=new Set(),localMedia=new Map();
let mounts=null;
function register(root,label){const id=root.userData.id||root.name;if(registry.has(id))throw Error('Duplicate interactive id: '+id);root.userData.id=id;if(label)root.userData.label=label;registry.set(id,root);return root;}
installation.add(createStructure(mats));
for(const spec of cabinetSpecs){const cabinet=createCabinet({id:spec.id,width:spec.size[0],height:spec.size[1],depth:spec.size[2],seed:spec.seed,materials:mats});cabinet.position.set(...spec.position);cabinet.rotation.y=spec.rotation;installation.add(cabinet);register(cabinet,spec.id.replace('cabinet.','机箱 · '));}
const table=createTable(mats);installation.add(table.root);register(table.root);table.items.forEach(item=>register(item));
const stool=createStool(mats);stool.position.set(-.06,0,1);installation.add(stool);register(stool,'中央 · 郁金香高脚椅');
const cameraHardware=createCameraHardware(mats);cameraHardware.position.set(0,7.92,-2.12);installation.add(cameraHardware);register(cameraHardware);
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(new OutputPass());
const grain=new ShaderPass({uniforms:{tDiffuse:{value:null},amount:{value:sceneSettings.grain}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform sampler2D tDiffuse;uniform float amount;varying vec2 vUv;float random(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}void main(){vec4 c=texture2D(tDiffuse,vUv);float n=(random(gl_FragCoord.xy)-.5)*amount;float vignette=1.0-.065*dot(vUv-.5,vUv-.5);gl_FragColor=vec4((c.rgb+n)*vignette,c.a);}'});composer.addPass(grain);
const loadingManager=new THREE.LoadingManager();loadingManager.onProgress=(url,loaded,total)=>setBootProgress(12+loaded/total*68,`加载独立屏幕内容 ${loaded} / ${total}`);setBootProgress(6,'建立灯光、材质与机械结构…');
const loader=new THREE.TextureLoader(loadingManager);
async function loadTexture(url){const texture=await loader.loadAsync(url);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);return texture;}
const hardwareSpecs=[...registry.values()].filter(object=>['cabinet','instrument','camera'].includes(object.userData.kind)).map(object=>({id:object.userData.id,label:object.userData.label||object.name,position:object.position.toArray(),rotation:[object.rotation.x,object.rotation.y,object.rotation.z]}));
const store=createLayoutStore(screens,screenDesign,displayDefaults,undefined,hardwareSpecs);
for(const spec of hardwareSpecs){const saved=store.snapshot().hardware[spec.id],object=registry.get(spec.id);object.position.set(...saved.position);object.rotation.set(...saved.rotation);}
const contentController=createContentController({screens:displayMeshes,originals:originalMaps,loadTexture,makeTexture(source){
 if(source?.isTexture)return {texture:source,owned:false};
 if(source instanceof HTMLCanvasElement||source instanceof HTMLImageElement||source instanceof ImageBitmap){const texture=source instanceof HTMLCanvasElement?new THREE.CanvasTexture(source):new THREE.Texture(source);texture.needsUpdate=true;texture.colorSpace=THREE.SRGBColorSpace;return {texture,owned:true};}
 throw new TypeError('Screen content must be a URL, THREE.Texture, image, or canvas.');
}});
async function setScreenContent(id,source){const texture=await contentController.setScreenContent(id,source);if(texture){displayMeshes.get(id).userData.flipBase=null;applyDisplay(id,store.snapshot().screens[id].display);}return texture;}
let activeView='reference',selected=null,down=null,demoCanvas=null,demoId=null,cameraTransition=null,remote=null;
const airFlight=createAirSpeciesState(),airViews=createAirSpeciesViews(),airViewStates=new Map(AIR_SCREEN_IDS.map(id=>[id,true]));
let airReady=false,lastAirTime=null,lastAirFrame=-Infinity,lastAirTelemetry=-Infinity,renderSuspended=false;
function broadcastState(){remote?.sendState({selected,layout:store.snapshot(),view:activeView,uiVisible:!document.body.classList.contains('ui-hidden'),cameraActive:!!localMedia.get('screen.desk')?.camera});}
const selectionBox=new THREE.BoxHelper(new THREE.Object3D(),0xe0e2c8);selectionBox.name='selection.outline';selectionBox.material.transparent=true;selectionBox.material.opacity=.42;selectionBox.visible=false;scene.add(selectionBox);
function fittedFov(fov){return fov*Math.max(1,(1374/1145)/(innerWidth/innerHeight));}
function chooseView(name,immediate=false){
 const view=views[name];if(!view)throw Error('Unknown view: '+name);activeView=name;
 const end={position:new THREE.Vector3(...view.position),target:new THREE.Vector3(...view.target),fov:fittedFov(view.fov)};
 if(immediate){cameraTransition=null;camera.position.copy(end.position);controls.target.copy(end.target);camera.fov=end.fov;camera.updateProjectionMatrix();controls.update();}
 else cameraTransition={startTime:performance.now(),duration:1050,from:{position:camera.position.clone(),target:controls.target.clone(),fov:camera.fov},to:end};
 document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===name)));
}
chooseView('reference',true);
controls.addEventListener('start',()=>{cameraTransition=null;activeView='custom';document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed','false'));});
function applyDisplay(id,display){
 const mesh=displayMeshes.get(id);if(!mesh)return;const uniforms=mesh.material.userData.displayUniforms;uniforms.displayBrightness.value=display.brightness;uniforms.displaySaturation.value=display.saturation;uniforms.displayContrast.value=display.contrast;uniforms.displayTint.value.set(display.tint);uniforms.displayScanlines.value=display.scanlines;uniforms.displayContent.value=display.mode==='blank'?0:1;
 const texture=mesh.material.map;if(texture){if(!mesh.userData.flipBase)mesh.userData.flipBase={repeatX:texture.repeat.x,offsetX:texture.offset.x};const base=mesh.userData.flipBase;texture.repeat.x=display.flip?-base.repeatX:base.repeatX;texture.offset.x=display.flip?base.offsetX+base.repeatX:base.offsetX;texture.needsUpdate=true;}
 if(id==='screen.desk')updateFlipButton(display.flip);
}
function setDisplay(id,patch){const next=store.update(id,{display:patch});applyDisplay(id,next.display);if(selected===id)editor.sync();broadcastState();return next.display;}
function applyTransform(id,patch,persist=true){
 const object=registry.get(id),state=store.snapshot(),group=state.screens[id]?'screens':state.hardware[id]?'hardware':null;
 if(!object||!group)throw Error('Unknown adjustable hardware: '+id);
 const data=persist?store.update(id,patch):{...state[group][id],...patch};object.position.set(...data.position);object.rotation.set(...data.rotation);object.updateMatrixWorld(true);mounts?.update(id);if(selected===id)selectionBox.setFromObject(object);broadcastState();return data;
}
function pickId(object){for(let current=object;current;current=current.parent){if(registry.has(current.userData.id))return current.userData.id;}return null;}
function select(id){
 if(id!==null&&!registry.has(id))throw Error('Unknown position: '+id);selected=id;const object=id?registry.get(id):null;selectionBox.visible=!!object&&!document.body.classList.contains('ui-hidden');if(object)selectionBox.setFromObject(object);
 editor.show(id,object?.userData.label||id);
 airPanel.show(id);
 if(object){const detail={id,object,anchor:object.getWorldPosition(new THREE.Vector3()).toArray()};window.dispatchEvent(new CustomEvent('future-plan:select',{detail}));selectionListeners.forEach(listener=>listener(detail));}broadcastState();return id;
}
function announce(message){const toast=document.querySelector('#toast');toast.textContent=message;toast.hidden=false;clearTimeout(announce.timer);announce.timer=setTimeout(()=>toast.hidden=true,4200);}
function updateCameraButton(){const button=document.querySelector('#camera-toggle');if(button)button.textContent=localMedia.get('screen.desk')?.camera?'关闭摄像头':'打开摄像头';}
function updateFlipButton(value=store.snapshot().screens['screen.desk'].display.flip){const button=document.querySelector('#flip-camera');if(button)button.textContent=value?'取消反转':'反转画面';}
function flipCameraContent(){const display=store.snapshot().screens['screen.desk'].display;return setDisplay('screen.desk',{flip:!display.flip});}
function releaseMedia(id){const media=localMedia.get(id);if(media){media.dispose();localMedia.delete(id);if(media.camera){updateCameraButton();broadcastState();}}}
async function restoreScreenContent(id){
 const airTexture=airViews.textures.get(id);
 releaseMedia(id);if(demoId===id){demoId=null;demoCanvas=null;}
 if(airTexture){
  // A retained live texture may still carry the previous session's mirrored UVs.
  airTexture.repeat.set(1,1);airTexture.offset.set(0,0);
  await setScreenContent(id,airTexture);setDisplay(id,{mode:'live'});
 }else{contentController.restoreScreenContent(id);const mesh=displayMeshes.get(id);if(mesh)mesh.userData.flipBase=null;setDisplay(id,{mode:'image'});}
}
function drawDemo(time){if(!demoCanvas||!demoId)return;const context=demoCanvas.getContext('2d'),width=demoCanvas.width,height=demoCanvas.height;context.fillStyle='#102b3b';context.fillRect(0,0,width,height);context.strokeStyle='#81bdc8';context.lineWidth=1;for(let i=0;i<12;i++){context.beginPath();for(let x=0;x<width;x+=4){const y=height*.5+Math.sin(x*.012+time*.0008+i*.19)*Math.sin(x/width*Math.PI)*height*.25+(i-6)*7;x?context.lineTo(x,y):context.moveTo(x,y);}context.stroke();}context.fillStyle='#e1dac0';context.font='14px monospace';context.fillText(demoId,28,32);displayMeshes.get(demoId)?.material.map && (displayMeshes.get(demoId).material.map.needsUpdate=true);}
async function contentDemo(id){if(airViews.textures.has(id)){restoreScreenContent(id);return;}if(demoId&&demoId!==id)restoreScreenContent(demoId);releaseMedia(id);demoCanvas=document.createElement('canvas');demoCanvas.width=800;demoCanvas.height=480;demoId=id;await setScreenContent(id,demoCanvas);setDisplay(id,{mode:'live'});drawDemo(performance.now());}
function fitTexture(id,texture,aspect){const spec=screens.find(item=>item.id===id),screenAspect=(spec.size[0]-spec.bezel*2)/(spec.size[1]-spec.bezel*2);texture.repeat.set(1,1);texture.offset.set(0,0);if(aspect>screenAspect){texture.repeat.x=screenAspect/aspect;texture.offset.x=(1-texture.repeat.x)/2;}else{texture.repeat.y=aspect/screenAspect;texture.offset.y=(1-texture.repeat.y)/2;}texture.needsUpdate=true;}
async function uploadContent(id,file){if(demoId===id){demoId=null;demoCanvas=null;}const media=await createLocalMedia(file);fitTexture(id,media.texture,media.aspect);await setScreenContent(id,media.texture);releaseMedia(id);localMedia.set(id,media);setDisplay(id,{mode:media.video?'video':'image'});broadcastState();return media;}
async function setMode(id,mode){if(mode==='image')restoreScreenContent(id);else if(mode==='live')await contentDemo(id);else setDisplay(id,{mode});}
async function toggleCamera(){
 if(localMedia.get('screen.desk')?.camera){restoreScreenContent('screen.desk');announce('摄像头已关闭。');return false;}
 if(!navigator.mediaDevices?.getUserMedia)throw new Error('摄像头需要 localhost 或 HTTPS 安全连接，以及浏览器权限。');
 announce('正在请求摄像头权限，请在浏览器系统提示中允许。');
 const stream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720},facingMode:'user'},audio:false});
 try{
  const video=document.createElement('video');video.muted=true;video.playsInline=true;video.srcObject=stream;await video.play();
  const texture=new THREE.VideoTexture(video);texture.colorSpace=THREE.SRGBColorSpace;fitTexture('screen.desk',texture,video.videoWidth/video.videoHeight);await setScreenContent('screen.desk',texture);
  releaseMedia('screen.desk');localMedia.set('screen.desk',{camera:true,video,dispose(){stream.getTracks().forEach(track=>track.stop());texture.dispose();}});setDisplay('screen.desk',{mode:'video'});updateCameraButton();broadcastState();announce('摄像头已连接，画面显示在中央主屏右侧。');return true;
 }catch(error){stream.getTracks().forEach(track=>track.stop());throw error;}
}
const editor=createEditor({specs:screens,store,onTransform:applyTransform,onDisplay:setDisplay,onMode:(id,mode)=>setMode(id,mode).catch(error=>editor.say(error.message,true)),onUpload:uploadContent,onDemo:id=>contentDemo(id).catch(error=>editor.say(error.message,true)),onRestore:restoreScreenContent,onReset:id=>{const spec=screens.find(item=>item.id===id)||hardwareSpecs.find(item=>item.id===id);if(spec)applyTransform(id,{position:[...spec.position],rotation:[...spec.rotation]});},onSaveProject:async()=>{
 const response=await fetch('./api/layout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(store.snapshot())});if(!response.ok)throw new Error('项目写入仅在 npm run dev 下可用；静态部署请使用“导出 JSON”。');
},onImport:layout=>{store.replace(layout);const state=store.snapshot();for(const spec of screens){applyTransform(spec.id,state.screens[spec.id],false);applyDisplay(spec.id,state.screens[spec.id].display);}for(const spec of hardwareSpecs)applyTransform(spec.id,state.hardware[spec.id],false);editor.sync();}});
async function setAirViewState(id,enabled){if(!airViewStates.has(id))return;airViewStates.set(id,enabled);if(enabled)await setScreenContent(id,airViews.textures.get(id));setDisplay(id,{mode:enabled?'live':'blank'});remote?.sendState(airTelemetry(airFlight.state,airViewStates));}
async function resetAirFlight(){airFlight.reset();for(const id of AIR_SCREEN_IDS)airViewStates.set(id,true);await Promise.all(AIR_SCREEN_IDS.filter(id=>displayMeshes.has(id)).map(restoreScreenContent));airViews.render(airFlight.state);airPanel.update(airFlight.state);}
const airPanel=createAirSpeciesPanel({flight:airFlight,onReset:resetAirFlight});
const dataBridge=createDataBridge({setDisplay,setContent:(id,content)=>setScreenContent(id,content?.url||content),onError:error=>editor.say(error.message,true)});
async function handleRemoteControl(message){
 if(!message?.type)return;
 if(message.type==='suspendScene'){renderSuspended=!!message.suspend;lastAirTime=null;return renderSuspended;}
 if(message.type.startsWith('air'))return applyAirRemoteControl({flight:airFlight,message,onReset:resetAirFlight,onTelemetry:()=>remote?.sendState(airTelemetry(airFlight.state,airViewStates)),onViewState:setAirViewState});
 if(message.type==='select')return select(message.id);
 if(message.type==='view')return chooseView(message.name);
 if(message.type==='transform')return applyTransform(message.id,message.patch);
 if(message.type==='display')return setDisplay(message.id,message.patch);
 if(message.type==='mode')return setMode(message.id,message.mode);
 if(message.type==='restore')return restoreScreenContent(message.id);
 if(message.type==='camera')return toggleCamera();
 if(message.type==='flip')return flipCameraContent();
 if(message.type==='ui')return setUIVisible(message.visible);
 if(message.type==='state')return broadcastState();
 if(message.type==='cameraMove'){
  cameraTransition=null;const offset=camera.position.clone().sub(controls.target),spherical=new THREE.Spherical().setFromVector3(offset);spherical.theta-=Number(message.dx||0)*.005;spherical.phi=THREE.MathUtils.clamp(spherical.phi-Number(message.dy||0)*.005,.08,Math.PI*.49);spherical.radius=THREE.MathUtils.clamp(spherical.radius*Number(message.zoom||1),controls.minDistance,controls.maxDistance);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));controls.update();activeView='custom';return;
 }
 if(message.type==='upload'){const response=await fetch(message.url);if(!response.ok)throw new Error('移动端媒体传输失败。');const blob=await response.blob(),file=new File([blob],decodeURIComponent(message.name||'media'),{type:blob.type});return uploadContent(message.id,file);}
}
remote=createRemoteChannel({onControl:message=>handleRemoteControl(message).catch(error=>{editor.say(error.message,true);announce(error.message);})});
const raycaster=new THREE.Raycaster();canvas.addEventListener('pointerdown',event=>down={x:event.clientX,y:event.clientY});canvas.addEventListener('pointercancel',()=>down=null);canvas.addEventListener('pointerup',event=>{if(!down)return;if(Math.hypot(event.clientX-down.x,event.clientY-down.y)<=5){const rect=canvas.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1),camera);const displayHit=raycaster.intersectObjects([...displayMeshes.values()],false)[0];const hit=displayHit||raycaster.intersectObjects([...registry.values()],true).find(item=>pickId(item.object));select(hit?pickId(hit.object):null);}down=null;});
canvas.addEventListener('future-plan:clear-selection',()=>select(null));
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>chooseView(button.dataset.view)));
function setUIVisible(visible){document.body.classList.toggle('ui-hidden',!visible);selectionBox.visible=!!selected&&visible;airPanel.show(visible?selected:null);if(!visible){airFlight.releaseInput();airFlight.releaseFieldInput();}broadcastState();}
document.querySelector('#hide-ui').addEventListener('click',()=>setUIVisible(false));
document.querySelector('#camera-toggle').addEventListener('click',()=>toggleCamera().catch(error=>{announce(error.message);editor.say(error.message,true);}));
document.querySelector('#flip-camera').addEventListener('click',flipCameraContent);
addEventListener('keydown',event=>{if(event.target instanceof HTMLInputElement||event.target instanceof HTMLSelectElement)return;const view=['reference','front','left','right','back','top','seat'][Number(event.key)-1];if(view)chooseView(view);if(event.key.toLowerCase()==='h')setUIVisible(document.body.classList.contains('ui-hidden'));if(event.key==='Escape')select(null);});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.fov=fittedFov(views[activeView]?.fov||camera.fov);camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);});
document.addEventListener('visibilitychange',()=>{lastAirTime=null;if(document.hidden){airFlight.releaseInput();airFlight.releaseFieldInput();}for(const media of localMedia.values()){if(media.video){if(document.hidden)media.video.pause();else media.video.play().catch(()=>{});}}});
async function boot(){
 try{
  setBootProgress(8,'读取场景与独立屏幕配置…');
  try{
   const response=await fetch('./api/layout');if(response.ok){const layout=await response.json();if(layout)store.replace(layout);}
  }catch{}
  const state=store.snapshot();
  for(const spec of hardwareSpecs)applyTransform(spec.id,state.hardware[spec.id],false);
  await Promise.all(screens.map(async base=>{
   const spec={...base,...screenDesign[base.id],...state.screens[base.id]},texture=await loadTexture(import.meta.env.BASE_URL+'textures/'+base.texture+'.png'),root=createScreen(spec,mats,texture);installation.add(root);register(root);const display=root.getObjectByName('displaySurface');displayMeshes.set(base.id,display);originalMaps.set(base.id,texture);applyDisplay(base.id,spec.display);return root;
  }));
  if(displayMeshes.size!==12)throw Error('Expected 12 screens');
  airViews.render(airFlight.state);
  for(const id of AIR_SCREEN_IDS){await setScreenContent(id,airViews.textures.get(id));if(state.screens[id].display.mode!=='blank')setDisplay(id,{mode:'live'});}
  airReady=true;
  setBootProgress(84,'连接支架、线缆与落地线束…');
  scene.updateMatrixWorld(true);mounts=createMounts(mats,registry);installation.add(mounts.root);mounts.updateAll();
  setBootProgress(91,'预编译玻璃、CRT 与后期着色器…');
  if(renderer.compileAsync)await renderer.compileAsync(scene,camera);else renderer.compile(scene,camera);
  setBootProgress(97,'确认完整三维首帧…');
  composer.render();renderer.getContext().finish();
  setBootProgress(100,'12 块屏幕与控制台已就绪');
  document.body.classList.remove('is-booting');loading.style.opacity=0;setTimeout(()=>loading.remove(),600);return true;
 }catch(error){fatal('资源或 WebGL 场景加载失败：'+error.message);console.error(error);return false;}
}
const ready=boot().then(result=>{if(result)broadcastState();return result;});
const airSpecies={screenIds:[...AIR_SCREEN_IDS],setInput:airFlight.setInput,releaseInput:airFlight.releaseInput,setFieldInput:airFlight.setFieldInput,releaseFieldInput:airFlight.releaseFieldInput,setParameters:airFlight.setParameters,reset:resetAirFlight,snapshot:airFlight.snapshot,diagnostics(){return{...airViews.diagnostics?.(),channels:AIR_SCREEN_IDS.map(id=>({id,attached:displayMeshes.get(id)?.material.map===airViews.textures.get(id),mode:store.snapshot().screens[id].display.mode})),state:airFlight.snapshot()};}};
window.futurePlan={ready,scene,camera,renderer,controls,registry,screens:displayMeshes,materials:mats,settings:sceneSettings,layout:store,setView:chooseView,select,onSelect(listener){if(typeof listener!=='function')throw new TypeError('callback must be a function');selectionListeners.add(listener);return()=>selectionListeners.delete(listener);},getObject:id=>registry.get(id),getAnchor(id){const object=registry.get(id);if(!object)throw Error('Unknown position: '+id);return object.getWorldPosition(new THREE.Vector3()).toArray();},setScreenTransform:applyTransform,setScreenDisplay:setDisplay,setScreenContent,restoreScreenContent,contentDemo,toggleCamera,remoteControl:handleRemoteControl,connectDataChannel:dataBridge.connect,applyData:dataBridge.apply,setUIVisible,capture(){composer.render();return canvas.toDataURL('image/png');},diagnostics(){let meshes=0,transparent=0;scene.traverse(object=>{if(object.isMesh)meshes++;if(object.material?.transmission>0)transparent++;});return{screenCount:displayMeshes.size,interactiveIds:[...registry.keys()],meshes,transparentParts:transparent,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,view:activeView,selected,mounts:mounts?.diagnostics(),layout:store.snapshot(),renderer:renderer.getContext().getParameter(renderer.getContext().RENDERER),canvas:[canvas.width,canvas.height]};}};
renderer.setAnimationLoop(time=>{
 if(document.hidden||renderSuspended){lastTime=null;lastAirTime=null;return;}
 if(airReady){const dt=lastAirTime===null?0:Math.min((time-lastAirTime)/1000,.1);lastAirTime=time;airFlight.step(dt);if(time-lastAirFrame>=1000/30){airViews.render(airFlight.state,id=>airViewStates.get(id));airPanel.update(airFlight.state);lastAirFrame=time;}if(time-lastAirTelemetry>100){remote?.sendState(airTelemetry(airFlight.state,airViewStates));lastAirTelemetry=time;}}
 if(cameraTransition){const progress=Math.min(1,(time-cameraTransition.startTime)/cameraTransition.duration),ease=progress<.5?4*progress**3:1-(-2*progress+2)**3/2;camera.position.lerpVectors(cameraTransition.from.position,cameraTransition.to.position,ease);controls.target.lerpVectors(cameraTransition.from.target,cameraTransition.to.target,ease);camera.fov=THREE.MathUtils.lerp(cameraTransition.from.fov,cameraTransition.to.fov,ease);camera.updateProjectionMatrix();if(progress===1)cameraTransition=null;}
 controls.update();drawDemo(time);if(selectionBox.visible)selectionBox.setFromObject(registry.get(selected));renderer.info.reset();composer.render();
});
window.futurePlan.airSpecies=airSpecies;
addEventListener('beforeunload',()=>{dataBridge.close();airPanel.dispose();airViews.dispose();for(const id of localMedia.keys())releaseMedia(id);});
