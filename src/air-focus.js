import {displayNavigationTarget} from './display-navigation.js';
import {AIR_SCREEN_IDS,createAirSpeciesState} from './air-species-state.js';
import {createAirSpeciesViews} from './air-species-views.js';
import {createRemoteChannel} from './remote-channel.js';
import {airTelemetry,applyAirRemoteControl} from './air-remote-protocol.js';
import './air-focus.css';
import {bindMarineGestures} from './species/marine/gestures.js';
import {fitLivingViews} from './living-layout.js';

await document.fonts.load('12px "FS Pixel"');

const stage=document.querySelector('#air-stage'),flight=createAirSpeciesState(),coarse=matchMedia('(pointer:coarse)').matches;
const fps=coarse?24:30,modeLabels={floating:'Floating',responding:'Following airflow',gliding:'Gliding'},views=createAirSpeciesViews(),viewStates=new Map(AIR_SCREEN_IDS.map(id=>[id,true])),renderTimes=[];
let lastTime=null,lastFrame=-Infinity,lastTelemetry=-Infinity,lastPerfUpdate=0;
const clamp=value=>Math.max(-1,Math.min(1,value)),figureElements=new Map();
for(const figure of document.querySelectorAll('[data-air-view]')){
 figureElements.set(figure.dataset.airView,figure);const canvas=views.textures.get(figure.dataset.airView).image;canvas.tabIndex=0;canvas.setAttribute('aria-label',figure.querySelector('figcaption').textContent+' Live living view');figure.prepend(canvas);
}
function updateText(selector,value){const element=document.querySelector(selector);if(element.textContent!==value)element.textContent=value;}
function renderViews(){
 if([...viewStates.values()].some(Boolean)){
  const start=performance.now();views.render(flight.state,id=>viewStates.get(id));renderTimes.push(performance.now()-start);if(renderTimes.length>75)renderTimes.shift();
 }
 for(const id of AIR_SCREEN_IDS){const figure=figureElements.get(id),paused=!viewStates.get(id);if(figure.classList.contains('is-paused')!==paused)figure.classList.toggle('is-paused',paused);}
 updateText('#air-channels',`${[...viewStates.values()].filter(Boolean).length} / 4 LIVE`);
 const now=performance.now();if(renderTimes.length&&now-lastPerfUpdate>500){lastPerfUpdate=now;const sorted=[...renderTimes].sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length*.5)],p95=sorted[Math.floor(sorted.length*.95)];updateText('#air-performance',`Canvas-only render time (75 frames, not full scene FPS): median ${median.toFixed(2)} ms; p95 ${p95.toFixed(2)} ms.\n27 fern axes; 4 textures; one shared specimen.`);}
}
function sendTelemetry(){remote.sendState(airTelemetry(flight.state,viewStates));}
function setViewState(id,enabled){if(!viewStates.has(id))return;viewStates.set(id,enabled);renderViews();sendTelemetry();}
function resetFlight(){flight.reset();renderViews();sendTelemetry();}
const remote=createRemoteChannel({onControl(message){const destination=displayNavigationTarget(message);if(destination){location.assign(destination);return;}applyAirRemoteControl({flight,message,onReset:resetFlight,onTelemetry:sendTelemetry,onViewState:setViewState});}});
remote.sendControl({type:'suspendScene',suspend:true});
renderViews();document.querySelector('#air-loading').remove();
const stopFitting=fitLivingViews(document.querySelector('#air-grid'));

const stopViewGestures=[...figureElements].map(([id,figure])=>bindMarineGestures(figure.querySelector('canvas'),{
 orbit:(dx,dy)=>{flight.orbitView(id,dx,dy);remote.sendControl({type:'airViewOrbit',id,dx,dy});},
 zoom:factor=>{flight.zoomView(id,factor);remote.sendControl({type:'airViewZoom',id,factor});},
 contact:()=>{},select:()=>{for(const [key,node] of figureElements)node.classList.toggle('is-selected',key===id);},
 reset:()=>{flight.resetView(id);remote.sendControl({type:'airViewReset',id});}
}));
document.querySelector('#air-fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await stage.requestFullscreen();}catch{}});
document.querySelector('#air-back-main').addEventListener('click',()=>remote.sendControl({type:'suspendScene',suspend:false}));

let animationId;
function frame(time){
 animationId=requestAnimationFrame(frame);
 if(document.hidden){lastTime=null;return;}
 if(time-lastFrame<1000/fps)return;
 const dt=lastTime===null?0:Math.min((time-lastTime)/1000,.1);lastTime=time;lastFrame=time;
 flight.step(dt);renderViews();
 updateText('#air-mode',modeLabels[flight.state.mode]||flight.state.mode);
 updateText('#air-field-state',`FIELD ${Math.round(flight.state.field.strength*100)}%`);
 if(time-lastTelemetry>100){sendTelemetry();lastTelemetry=time;}
}
animationId=requestAnimationFrame(frame);
addEventListener('beforeunload',()=>{cancelAnimationFrame(animationId);stopFitting();stopViewGestures.forEach(stop=>stop());remote.sendControl({type:'suspendScene',suspend:false});remote.close();views.dispose();});
window.airFocus={snapshot:flight.snapshot,diagnostics:()=>({...views.diagnostics(),canvasCount:views.textures.size,webgl:false,fps,viewStates:Object.fromEntries(viewStates)}),setViewState,remoteControl:message=>applyAirRemoteControl({flight,message,onReset:resetFlight,onTelemetry:sendTelemetry,onViewState:setViewState})};
