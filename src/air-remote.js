import {AIR_SCREEN_IDS,AIR_DEFAULTS,createAirSpeciesState} from './air-species-state.js';
import {createRemoteChannel} from './remote-channel.js';
import './hardware-console.css';

const flight=createAirSpeciesState(),channels=new Map(AIR_SCREEN_IDS.map(id=>[id,true])),modeLabels={floating:'Floating',responding:'Following airflow',gliding:'Gliding'},fieldLabels={resting:'Waiting for touch',attracting:'Attraction and flow',relaxing:'Relaxing'};
const $=selector=>document.querySelector(selector),clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value)),signed=value=>(value>=0?'+':'−')+Math.abs(value).toFixed(2);
let lastTelemetry=0;
function send(message){remote.sendControl(message);}
const remote=createRemoteChannel({onState(message){
 if(message?.type!=='airTelemetry'||!message.state)return;
 Object.assign(flight.state,message.state);lastTelemetry=Date.now();
 if(message.channels)for(const id of AIR_SCREEN_IDS)if(typeof message.channels[id]==='boolean')channels.set(id,message.channels[id]);
 $('#air-connection-dot').classList.add('online');$('#air-connection-label').textContent='Living views online';render();
}});

function updateChannels(){
 let count=0;for(const id of AIR_SCREEN_IDS){const active=channels.get(id);if(active)count++;const button=$(`[data-air-view="${id}"]`);button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));}
 $('#air-channel-count').textContent=String(count).padStart(2,'0');$('#air-channel-label').textContent=`${count} / 4 PLAYING`;
}
function setChannel(id,enabled){channels.set(id,enabled);updateChannels();send({type:'airViewState',id,enabled});}
document.querySelectorAll('[data-air-view]').forEach(button=>button.addEventListener('click',()=>setChannel(button.dataset.airView,!channels.get(button.dataset.airView))));
$('#air-all').addEventListener('click',()=>{for(const id of AIR_SCREEN_IDS)setChannel(id,true);});
$('#air-none').addEventListener('click',()=>{for(const id of AIR_SCREEN_IDS)setChannel(id,false);});
$('#air-reset').addEventListener('click',()=>{send({type:'airReset'});$('#air-remote-status').textContent='Living state reset requested';});

function bindPad(name){
 const pad=$(`[data-air-pad="${name}"]`),target=pad.querySelector('.air-pad-target'),position=pad.querySelector('.air-pad-position');
 let pointer=null,keyboardActive=false;const pressed=new Set(),isFlight=name==='flight';
 function state(){return isFlight?flight.state:flight.state.field;}
 function input(value){isFlight?(flight.setInput(value),send({type:'airInput',input:value})):(flight.setFieldInput(value),send({type:'airFieldInput',input:value}));}
 function release(){
  if(pointer===null&&!keyboardActive)return;pointer=null;keyboardActive=false;pressed.clear();pad.classList.remove('is-active');
  if(isFlight){flight.releaseInput();send({type:'airRelease'});}else{flight.releaseFieldInput();send({type:'airFieldRelease'});}
 }
 function move(event){const rect=pad.getBoundingClientRect();input({x:clamp((event.clientX-rect.left)/rect.width*2-1,-1,1),y:clamp(1-(event.clientY-rect.top)/rect.height*2,-1,1),active:true,source:event.pointerType==='touch'?'touch':'pointer'});}
 pad.addEventListener('pointerdown',event=>{if(pointer!==null||(event.pointerType==='mouse'&&event.button!==0))return;event.preventDefault();release();pointer=event.pointerId;pad.setPointerCapture(pointer);pad.classList.add('is-active');if(event.pointerType!=='touch')pad.focus({preventScroll:true});move(event);});
 pad.addEventListener('pointermove',event=>{if(event.pointerId===pointer){event.preventDefault();move(event);}});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(type,event=>{if(event.pointerId===pointer)release();});
 pad.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;event.preventDefault();pressed.add(event.key);const current=state(),previous=keyboardActive?current.input:current;let{x,y}=previous,step=event.shiftKey?.12:.04;if(event.key==='ArrowLeft')x-=step;if(event.key==='ArrowRight')x+=step;if(event.key==='ArrowUp')y+=step;if(event.key==='ArrowDown')y-=step;if(event.key==='Home')x=y=0;keyboardActive=true;pad.classList.add('is-active');input({x:clamp(x,-1,1),y:clamp(y,-1,1),active:true,source:'keyboard'});});
 pad.addEventListener('keyup',event=>{pressed.delete(event.key);if(keyboardActive&&!pressed.size)release();});pad.addEventListener('blur',()=>{if(keyboardActive)release();});
 return {release,update(data){const targetState=data.input.active?data.input:data.target;target.style.left=`${50+clamp(targetState.x,-1,1)*45}%`;target.style.top=`${50-clamp(targetState.y,-1,1)*45}%`;position.style.left=`${50+clamp(data.x,-1,1)*45}%`;position.style.top=`${50-clamp(data.y,-1,1)*45}%`;}};
}
const flightPad=bindPad('flight'),fieldPad=bindPad('field');
addEventListener('blur',()=>{flightPad.release();fieldPad.release();});

const activeKnobs=new Set();
function updateKnob(key,value=flight.state.params[key]){const knob=$(`[data-air-knob="${key}"]`),input=$(`#${key}-value`);knob.querySelector('.knob-indicator').style.transform=`rotate(${value*270-135}deg)`;knob.setAttribute('aria-valuenow',value.toFixed(2));if(document.activeElement!==input)input.value=Math.round(value*100);}
function setParameter(key,value){const patch={[key]:clamp(value)};flight.setParameters(patch);send({type:'airParameters',patch});updateKnob(key);}
for(const key of Object.keys(AIR_DEFAULTS)){
 const knob=$(`[data-air-knob="${key}"]`);let drag=null;
 knob.addEventListener('pointerdown',event=>{event.preventDefault();knob.setPointerCapture(event.pointerId);activeKnobs.add(key);drag={y:event.clientY,value:flight.state.params[key]};});
 knob.addEventListener('pointermove',event=>{if(drag)setParameter(key,drag.value+(drag.y-event.clientY)*.006);});
 const finish=()=>{drag=null;activeKnobs.delete(key);};knob.addEventListener('pointerup',finish);knob.addEventListener('pointercancel',finish);
 knob.addEventListener('keydown',event=>{if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const direction=['ArrowUp','ArrowRight'].includes(event.key)?1:-1;setParameter(key,flight.state.params[key]+direction*.02);});
 const input=$(`#${key}-value`);input.addEventListener('input',()=>{const value=Number(input.value);if(Number.isFinite(value))setParameter(key,value/100);});
}
function render(){
 flightPad.update(flight.state);fieldPad.update(flight.state.field);updateChannels();
 $('#air-x').textContent=signed(flight.state.x);$('#air-y').textContent=signed(flight.state.y);$('#air-behaviour').textContent=modeLabels[flight.state.mode]||flight.state.mode;
 $('#air-field-status').textContent=fieldLabels[flight.state.field.mode]||flight.state.field.mode;$('#air-field-strength').textContent=`${Math.round(flight.state.field.strength*100)}%`;
 const field=flight.state.field,influence=$('.air-field-influence');influence.style.left=`${50+clamp(field.x,-1,1)*45}%`;influence.style.top=`${50-clamp(field.y,-1,1)*45}%`;influence.style.opacity=String(.2+field.strength*.55);influence.style.transform=`translate(-50%,-50%) rotate(${field.phase*12+field.swirl*35}deg)`;
 for(const key of Object.keys(AIR_DEFAULTS))if(!activeKnobs.has(key))updateKnob(key);
}
setInterval(()=>{send({type:'airStateRequest'});if(lastTelemetry&&Date.now()-lastTelemetry>6500){$('#air-connection-dot').classList.remove('online');$('#air-connection-label').textContent='Waiting for living views';}},5000);
send({type:'airStateRequest'});render();addEventListener('beforeunload',()=>{flightPad.release();fieldPad.release();remote.close();});
window.airRemote={snapshot:flight.snapshot,requestState:()=>send({type:'airStateRequest'}),setViewState:setChannel,diagnostics:()=>({remoteOnly:true,webgl:false,connected:!!lastTelemetry,channels:Object.fromEntries(channels)})};
