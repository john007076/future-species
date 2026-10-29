import {AIR_SCREEN_IDS,createAirSpeciesState} from './air-species-state.js';
import {createAirSpeciesViews} from './air-species-views.js';
import {createRemoteChannel} from './remote-channel.js';
import {airTelemetry,applyAirRemoteControl} from './air-remote-protocol.js';
import './air-focus.css';

const stage=document.querySelector('#air-stage'),flight=createAirSpeciesState(),coarse=matchMedia('(pointer:coarse)').matches;
const fps=coarse?24:30,modeLabels={floating:'自主漂浮',responding:'跟随气流',gliding:'惯性滑行'},views=createAirSpeciesViews(),viewStates=new Map(AIR_SCREEN_IDS.map(id=>[id,true])),renderTimes=[];
let lastTime=null,lastFrame=-Infinity,lastTelemetry=-Infinity;
const clamp=value=>Math.max(-1,Math.min(1,value));
for(const figure of document.querySelectorAll('[data-air-view]')){
 const canvas=views.textures.get(figure.dataset.airView).image;canvas.setAttribute('aria-label',figure.querySelector('figcaption').textContent+' 实时生命画面');figure.prepend(canvas);
}
function renderViews(){
 if([...viewStates.values()].some(Boolean)){
  const start=performance.now();views.render(flight.state,id=>viewStates.get(id));renderTimes.push(performance.now()-start);if(renderTimes.length>75)renderTimes.shift();
 }
 for(const id of AIR_SCREEN_IDS)document.querySelector(`[data-air-view="${id}"]`).classList.toggle('is-paused',!viewStates.get(id));
 const count=[...viewStates.values()].filter(Boolean).length;document.querySelector('#air-channels').textContent=`${count} / 4 LIVE`;
 if(renderTimes.length){const sorted=[...renderTimes].sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length*.5)],p95=sorted[Math.floor(sorted.length*.95)];document.querySelector('#air-performance').textContent=`Canvas-only render time (75 frames, not full scene FPS): median ${median.toFixed(2)} ms; p95 ${p95.toFixed(2)} ms.\n27 fern axes; 4 textures; one shared specimen.`;}
}
function sendTelemetry(){remote.sendState(airTelemetry(flight.state,viewStates));}
function setViewState(id,enabled){if(!viewStates.has(id))return;viewStates.set(id,enabled);renderViews();sendTelemetry();}
function resetFlight(){flight.reset();renderViews();sendTelemetry();}
const remote=createRemoteChannel({onControl(message){applyAirRemoteControl({flight,message,onReset:resetFlight,onTelemetry:sendTelemetry,onViewState:setViewState});}});
remote.sendControl({type:'suspendScene',suspend:true});
renderViews();document.querySelector('#air-loading').remove();

const pointers=new Map();
function updatePointer(event){
 const pointer=pointers.get(event.pointerId);if(!pointer)return;
 const rect=pointer.rect,input={x:clamp((event.clientX-rect.left)/rect.width*2-1),y:clamp(1-(event.clientY-rect.top)/rect.height*2),active:true,source:event.pointerType==='touch'?'touch':'pointer'};
 if(pointer.role==='flight'){flight.setInput(input);remote.sendControl({type:'airInput',input});}
 else{flight.setFieldInput(input);remote.sendControl({type:'airFieldInput',input});}
}
stage.addEventListener('pointerdown',event=>{
 if(!event.target.matches('canvas')||(event.pointerType==='mouse'&&event.button!==0&&event.button!==2))return;
 event.preventDefault();const role=event.shiftKey||event.button===2||pointers.size>0?'morph':'flight',rect=event.target.getBoundingClientRect();
 pointers.set(event.pointerId,{role,rect});event.target.setPointerCapture(event.pointerId);updatePointer(event);
});
stage.addEventListener('pointermove',event=>{if(pointers.has(event.pointerId)){event.preventDefault();updatePointer(event);}});
function release(event){
 const pointer=pointers.get(event.pointerId);if(!pointer)return;pointers.delete(event.pointerId);
 if(pointer.role==='flight'){flight.releaseInput();remote.sendControl({type:'airRelease'});}
 else{flight.releaseFieldInput();remote.sendControl({type:'airFieldRelease'});}
}
for(const type of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(type,release);
stage.addEventListener('contextmenu',event=>event.preventDefault());
addEventListener('blur',()=>{for(const pointerId of [...pointers.keys()])release({pointerId});});
document.querySelector('#air-fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await stage.requestFullscreen();}catch{}});

let animationId;
function frame(time){
 animationId=requestAnimationFrame(frame);
 if(document.hidden){lastTime=null;return;}
 if(time-lastFrame<1000/fps)return;
 const dt=lastTime===null?0:Math.min((time-lastTime)/1000,.1);lastTime=time;lastFrame=time;
 flight.step(dt);renderViews();
 document.querySelector('#air-mode').textContent=modeLabels[flight.state.mode]||flight.state.mode;
 document.querySelector('#air-field-state').textContent=`FIELD ${Math.round(flight.state.field.strength*100)}%`;
 if(time-lastTelemetry>100){sendTelemetry();lastTelemetry=time;}
}
animationId=requestAnimationFrame(frame);
addEventListener('beforeunload',()=>{cancelAnimationFrame(animationId);remote.sendControl({type:'suspendScene',suspend:false});remote.close();views.dispose();});
window.airFocus={snapshot:flight.snapshot,diagnostics:()=>({...views.diagnostics(),canvasCount:views.textures.size,webgl:false,fps,viewStates:Object.fromEntries(viewStates)}),setViewState,remoteControl:message=>applyAirRemoteControl({flight,message,onReset:resetFlight,onTelemetry:sendTelemetry,onViewState:setViewState})};
