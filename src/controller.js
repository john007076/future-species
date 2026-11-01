import {screens,displayDefaults} from './config.js';
import {createRemoteChannel} from './remote-channel.js';
import './controller.css';
import './hardware-console.css';

const $=selector=>document.querySelector(selector),localScreens=Object.fromEntries(screens.map(spec=>[spec.id,{rotation:[...spec.rotation],display:{...displayDefaults}}]));
let selected='screen.center_main',uiVisible=true,lastState=0;
const status=message=>{$('#status').textContent=message;};
const remote=createRemoteChannel({onState(payload){
 if(!payload?.layout)return;Object.assign(localScreens,payload.layout.screens);lastState=Date.now();
 if(payload.layout.screens[payload.selected])selected=payload.selected;
 uiVisible=payload.uiVisible??uiVisible;$('#connection-dot').classList.add('online');$('#connection-label').textContent='Main display online';$('#camera').textContent=payload.cameraActive?'CAM OFF':'CAMERA';$('#toggle-ui').textContent=uiVisible?'PURE VIEW':'SHOW UI';render();
}});
const send=message=>remote.sendControl(message),pending=new Map();let frame=0;
function queue(key,message){pending.set(key,message);if(!frame)frame=requestAnimationFrame(()=>{for(const value of pending.values())send(value);pending.clear();frame=0;});}
function current(){return localScreens[selected];}
function render(){
 document.querySelectorAll('[data-screen]').forEach(button=>button.classList.toggle('active',button.dataset.screen===selected));
 const index=screens.findIndex(spec=>spec.id===selected),spec=screens[index];$('#screen-name').textContent=spec.label;$('#screen-id').textContent=String(index+1).padStart(2,'0');
 for(const type of ['rotationX','rotationY','brightness'])updateKnob(type);
}
function valueFor(type){const data=current();return type==='brightness'?data.display.brightness:data.rotation[type==='rotationX'?0:1]*180/Math.PI;}
function updateKnob(type,value=valueFor(type)){
 const knob=$(`[data-knob="${type}"]`),normalized=type==='brightness'?value/2:(value+180)/360,angle=Math.max(-135,Math.min(135,normalized*270-135));
 knob.querySelector('.knob-indicator').style.transform=`rotate(${angle}deg)`;knob.setAttribute('aria-valuenow',value.toFixed(type==='brightness'?2:1));const input=$(`#${type}-value`);if(document.activeElement!==input)input.value=type==='brightness'?value.toFixed(2):value.toFixed(1);
}
function setValue(type,value){
 value=type==='brightness'?Math.max(0,Math.min(2,value)):Math.max(-180,Math.min(180,value));updateKnob(type,value);
 if(type==='brightness'){current().display.brightness=value;queue('display',{type:'display',id:selected,patch:{brightness:value}});}
 else{const axis=type==='rotationX'?0:1;current().rotation[axis]=value*Math.PI/180;queue('transform',{type:'transform',id:selected,patch:{rotation:[...current().rotation]}});}
}
for(const spec of screens){const button=document.createElement('button');button.className='screen-key';button.dataset.screen=spec.id;button.innerHTML=`${String(screens.indexOf(spec)+1).padStart(2,'0')}<small>${spec.id.replace('screen.','').slice(0,7).toUpperCase()}</small>`;button.setAttribute('aria-label',spec.label);button.addEventListener('click',()=>{selected=spec.id;send({type:'select',id:selected});render();status(`Selected ${spec.label}`);});$('#screen-grid').append(button);}
for(const type of ['rotationX','rotationY','brightness']){
 const knob=$(`[data-knob="${type}"]`);let drag=null;
 knob.addEventListener('pointerdown',event=>{event.preventDefault();knob.setPointerCapture(event.pointerId);drag={y:event.clientY,value:valueFor(type)};});
 knob.addEventListener('pointermove',event=>{if(!drag)return;const scale=type==='brightness'?.008:.8;setValue(type,drag.value+(drag.y-event.clientY)*scale);});
 const end=()=>drag=null;knob.addEventListener('pointerup',end);knob.addEventListener('pointercancel',end);
 knob.addEventListener('keydown',event=>{if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const direction=['ArrowUp','ArrowRight'].includes(event.key)?1:-1;setValue(type,valueFor(type)+direction*(type==='brightness'?.05:1));});
 const numberInput=$(`#${type}-value`);numberInput.addEventListener('input',()=>{const value=Number(numberInput.value);if(Number.isFinite(value))setValue(type,value);});
}
function surface(element,onMove,onEnd){
 let last=null;element.addEventListener('pointerdown',event=>{event.preventDefault();element.setPointerCapture(event.pointerId);last={x:event.clientX,y:event.clientY};});
 element.addEventListener('pointermove',event=>{if(!last)return;const dx=event.clientX-last.x,dy=event.clientY-last.y;last={x:event.clientX,y:event.clientY};onMove(dx,dy,event);});
 const end=()=>{last=null;onEnd?.();};element.addEventListener('pointerup',end);element.addEventListener('pointercancel',end);
}
surface($('#joystick'),(dx,dy,event)=>{const rect=$('#joystick').getBoundingClientRect(),x=event.clientX-(rect.left+rect.width/2),y=event.clientY-(rect.top+rect.height/2),length=Math.hypot(x,y),limit=31,scale=length>limit?limit/length:1;$('#joystick-stick').style.transform=`translate(${x*scale}px,${y*scale}px)`;queue('camera',{type:'cameraMove',dx:dx*1.4,dy:dy*1.4});},()=>{$('#joystick-stick').style.transform='';});
surface($('#touchpad'),(dx,dy)=>queue('camera',{type:'cameraMove',dx:dx*1.7,dy:dy*1.7}));
let zoom=100;$('#zoom').addEventListener('input',event=>{const next=Number(event.target.value);queue('zoom',{type:'cameraMove',zoom:zoom/next});zoom=next;});
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{send({type:'view',name:button.dataset.view});status(`Switch${button.textContent}view`);}));
$('#blank').addEventListener('click',()=>{send({type:'mode',id:selected,mode:'blank'});current().display.mode='blank';status('Selected screen blanked');});
$('#restore').addEventListener('click',()=>{send({type:'restore',id:selected});current().display.mode='image';status('Source content restored');});
$('#camera').addEventListener('click',()=>{send({type:'camera'});status('Requesting camera access on the main display...');});
$('#flip').addEventListener('click',()=>{send({type:'flip'});status('Camera horizontal flip toggled');});
$('#toggle-ui').addEventListener('click',()=>{uiVisible=!uiVisible;send({type:'ui',visible:uiVisible});$('#toggle-ui').textContent=uiVisible?'SHOW UI':'PURE VIEW';});
$('#upload').addEventListener('click',()=>$('#file').click());
$('#file').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{$('#upload').disabled=true;status(`Sending ${file.name}…`);const response=await fetch('./api/media',{method:'POST',headers:{'Content-Type':file.type||'application/octet-stream','X-File-Name':encodeURIComponent(file.name)},body:file});if(!response.ok)throw new Error('Media upload failed');const media=await response.json();send({type:'upload',id:selected,url:media.url,name:media.name});status('Media sent to main display');}catch(error){status(error.message);}finally{$('#upload').disabled=false;event.target.value='';}});
document.querySelector('#air-views-link').addEventListener('click',event=>{event.preventDefault();send({type:'openAirViews'});status('Living views opened on the main display. This console stays here.');});
document.querySelector('#air-remote-link').addEventListener('click',event=>{event.preventDefault();send({type:'suspendScene',suspend:true});setTimeout(()=>location.href='./air-remote.html',80);});
document.querySelector('#main-home-link').addEventListener('click',event=>{event.preventDefault();send({type:'openMainDisplay'});status('Main installation opened on the display. This console stays here.');});
send({type:'suspendScene',suspend:false});
setInterval(()=>{send({type:'state'});if(lastState&&Date.now()-lastState>6500){$('#connection-dot').classList.remove('online');$('#connection-label').textContent='Waiting for main display';}},5000);
send({type:'state'});render();

document.querySelector('#marine-views-link').addEventListener('click',event=>{event.preventDefault();send({type:'openMarineViews'});status('Marine views opened on the main display. This console stays here.');});
