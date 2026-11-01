import * as THREE from 'three';
import {MARINE_SCREEN_IDS,createMarineState,SPECIES} from './state.js';
import {createMarineViews} from './views.js';
import {createMarineAudio} from './audio.js';
import {createMarinePanel} from './panel.js';
import {createRemoteChannel} from '../../remote-channel.js';
import {applyMarineRemoteControl,marineTelemetry,archiveSpeciesAt} from './remote.js';
import './focus.css';
import {bindMarineGestures} from './gestures.js';
import {fitLivingViews} from '../../living-layout.js';
await document.fonts.load('12px "FS Pixel"');

const renderer=new THREE.WebGLRenderer({antialias:true}),marine=createMarineState(),audio=createMarineAudio();
renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
const views=createMarineViews({renderer});
const remoteLink=document.querySelector('a[href="./marine-remote.html"]');remoteLink.href=`./marine-remote.html?target=${marine.sessionId}`;remoteLink.target='_blank';remoteLink.rel='noopener';
const panel=createMarinePanel({marine,audio});panel.show(MARINE_SCREEN_IDS[0]);
const channels=new Map(MARINE_SCREEN_IDS.map(id=>[id,true])),figures=[...document.querySelectorAll('.marine-view-grid figure[data-channel]')],scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,0,2),material=new THREE.MeshBasicMaterial({toneMapped:false}),geometry=new THREE.PlaneGeometry(2,2);camera.position.z=1;scene.add(new THREE.Mesh(geometry,material));
function onChannel(id,enabled){if(!channels.has(id))return false;channels.set(id,enabled);return true;}
const telemetry=()=>remote.sendState(marineTelemetry(marine,channels,'views'));
const remote=createRemoteChannel({onControl:message=>{try{if(message.type==='openAirViews'){panel.stop();location.assign('./air.html');return;}applyMarineRemoteControl({message,marine,panel,onTelemetry:telemetry,onChannel});}catch(error){document.querySelector('#marine-live').textContent=error.message;}}});
const micButton=document.querySelector('#marine-mic'),simulateButton=document.querySelector('#marine-simulate');
document.querySelector('#marine-input-done').addEventListener('click',()=>void panel.finishInput());
micButton.addEventListener('click',()=>{if(!['IDLE','LISTENING'].includes(marine.state.phase)||['listening','requesting'].includes(audio.status))panel.stop();else void panel.startMicrophone();});
simulateButton.addEventListener('click',()=>void panel.simulate());
const stopLayout=fitLivingViews(document.querySelector('#marine-grid'));const resizeViews=()=>dispatchEvent(new Event('resize'));
const stopGestures=figures.map(figure=>bindMarineGestures(figure.querySelector('canvas'),{orbit:marine.orbit,zoom:marine.zoom,contact:marine.contact,select:()=>marine.selectScreen(figure.dataset.channel),keyboard:figure.dataset.channel!=='screen.right.03',reset:()=>marine.setView({yaw:0,pitch:0,zoom:1})}));
const stopFitting=()=>{stopLayout();stopGestures.forEach(stop=>stop());};const renderTimes=[];
let previous=null,lastRender=-Infinity,lastTelemetry=-Infinity,micActive=false,animation,checked=false,lastPerformance=0;
function frame(time){animation=requestAnimationFrame(frame);if(document.hidden){previous=null;return;}const dt=previous===null?0:Math.min((time-previous)/1000,.1);previous=time;if(micActive&&!['listening','ready'].includes(audio.status))marine.stop();micActive=audio.status==='listening';const phase=marine.state.phase;marine.step(dt,audio.update());if(phase!=='ECHO'&&marine.state.phase==='ECHO')audio.respond(marine.state.species);if(phase==='COOLDOWN'&&marine.state.phase==='LISTENING'&&audio.status==='ready')audio.stop();
 if(time-lastRender>1000/24){lastRender=time;views.render(marine.state);panel.update();for(const figure of figures){const id=figure.dataset.channel,canvas=figure.querySelector('canvas'),texture=views.textures.get(id);if(canvas.width!==texture.image.width||canvas.height!==texture.image.height){canvas.width=texture.image.width;canvas.height=texture.image.height;resizeViews();}figure.classList.toggle('is-paused',!channels.get(id));figure.classList.toggle('is-selected',marine.state.selectedScreen===id);figure.classList.toggle('rotation-locked',id==='screen.right.01');if(!channels.get(id))continue;renderer.setRenderTarget(null);renderer.setSize(canvas.width,canvas.height,false);material.map=texture;material.needsUpdate=true;renderer.render(scene,camera);canvas.getContext('2d').drawImage(renderer.domElement,0,0);}
 if(!checked){
  const d=views.diagnostics(),checks=[['Four assigned screens; AIR, center and camera excluded',JSON.stringify([...views.textures.keys()])===JSON.stringify(MARINE_SCREEN_IDS)],['Four independent live textures',new Set(views.textures.values()).size===4],['Nine models and nine rendered specimen images initialized',d.species.length===9&&d.archiveSpecimens.length===9],['Encounter, sound organism and tissue use real WebGL textures',MARINE_SCREEN_IDS.slice(0,3).every(id=>views.textures.get(id).isRenderTargetTexture)],['Actual pixels rendered to all four canvases',figures.every(figure=>{const c=figure.querySelector('canvas'),pixels=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let lo=255,hi=0;for(let i=0;i<pixels.length;i+=16){lo=Math.min(lo,pixels[i]);hi=Math.max(hi,pixels[i]);}return hi-lo>8;})],['WebGL: no errors',renderer.getContext().getError()===0]];
  document.querySelector('#marine-diagnostics').textContent=checks.map(([name,pass])=>(pass?'PASS  ':'FAIL  ')+name).join('\n');checked=true;
 }
 const busy=!['IDLE','LISTENING'].includes(marine.state.phase);micButton.textContent=audio.status==='requesting'?'MIC / CANCEL REQUEST':audio.status==='listening'?'MIC / STOP':busy?'STOP / STOP':'MIC / ENABLE MICROPHONE';micButton.disabled=false;document.querySelector('#marine-input-done').disabled=!['listening','requesting'].includes(audio.status);simulateButton.disabled=busy||audio.status==='requesting';document.querySelector('#marine-audio-status').textContent=audio.status==='idle'?'':audio.message;
 renderTimes.push(views.diagnostics().renderMs);if(renderTimes.length>75)renderTimes.shift();
 if(time-lastPerformance>500){lastPerformance=time;const sorted=[...renderTimes].sort((a,b)=>a-b);document.querySelector('#marine-performance').textContent=`Marine offscreen render time (${sorted.length} frames, not full scene FPS): median ${sorted[Math.floor(sorted.length*.5)].toFixed(2)} ms; p95 ${sorted[Math.floor(sorted.length*.95)].toFixed(2)} ms.\n4 textures; 9 specimens; local audio-reactive particle organism.`;}
 document.querySelector('#marine-live').textContent=`${marine.state.inspecting?'Specimen inspection':marine.state.phase==='IDLE'?'Open-water residents':'Echo encounter'} / ${SPECIES[marine.state.species].name} / ${[...channels.values()].filter(Boolean).length} CHANNELS`;
 }if(time-lastTelemetry>250){lastTelemetry=time;telemetry();}}
const atlas=document.querySelector('[data-channel="screen.right.03"] canvas');atlas.addEventListener('click',event=>{const r=atlas.getBoundingClientRect(),id=archiveSpeciesAt((event.clientX-r.left)/r.width,1-(event.clientY-r.top)/r.height);if(id)panel.inspect(id);});
atlas.addEventListener('keydown',event=>{const offset={ArrowLeft:-1,ArrowRight:1,ArrowUp:-3,ArrowDown:3}[event.key];if(offset===undefined)return;event.preventDefault();const ids=Object.keys(SPECIES),index=ids.indexOf(marine.state.species);panel.inspect(ids[(index+offset+ids.length)%ids.length]);});
document.querySelector('#fullscreen').addEventListener('click',()=>{const action=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();action.catch(()=>{document.querySelector('#marine-live').textContent='Fullscreen is unavailable in this browser';});});
for(const event of ['pagehide','blur'])addEventListener(event,()=>panel.stop());document.addEventListener('visibilitychange',()=>{if(document.hidden)panel.stop();previous=null;});
addEventListener('beforeunload',()=>{cancelAnimationFrame(animation);stopFitting();panel.dispose();audio.dispose();views.dispose();material.dispose();geometry.dispose();renderer.dispose();remote.close();});
window.marineFocus={snapshot:marine.snapshot,diagnostics:()=>({...views.diagnostics(),audio:audio.diagnostics(),state:marine.snapshot(),channels:Object.fromEntries(channels)})};
animation=requestAnimationFrame(frame);
