import {MARINE_SCREEN_IDS,SPECIES} from './state.js';
import './panel.css';
import {bindMarineGestures} from './gestures.js';

const PHASES={IDLE:'Idle / preview',LISTENING:'Listening',SIGNAL_DETECTED:'Signal detected',APPROACH:'Approaching',ENCOUNTER:'Encounter',ECHO:'Non-verbal echo',ESCAPE:'Escaping',COOLDOWN:'Cooldown'};

const CHANNELS=['01 / ENCOUNTER','02 / PRESSURE','03 / TISSUE','04 / ARCHIVE'];

export function createMarinePanel({marine,audio}) {
 const element=document.createElement('aside');
 element.id='marine-species-panel';element.hidden=true;
 element.setAttribute('aria-label','MARINE SPECIES Marine echo terminal');
 element.innerHTML=`
 <header class="air-heading"><div><small>LIVING STUDY / SP–02</small><h2>MARINE SPECIES</h2></div><span class="air-indicator" aria-hidden="true"></span></header>
 <div class="marine-channel"><span>FOUR LINKED VIEWS</span><b data-channel></b></div>
 <a class="air-open-focus" href="./marine.html">OPEN FOUR VIEWS <span aria-hidden="true">↗</span></a>

 <div class="marine-state"><i aria-hidden="true"></i><strong data-phase role="status"></strong><span data-species></span></div>
 <canvas width="448" height="104" data-wave aria-label="Live audio waveform"></canvas>
 <label class="marine-volume">Level <meter min="0" max="0.15" value="0" aria-label="Live microphone level"></meter><output data-volume>0%</output></label>
 <div class="marine-pad-heading"><span>VIEW FIELD</span><span>ORBIT / CONTACT</span></div><div data-marine-pad tabindex="0" role="group" aria-label="Marine orbit and contact touchpad"><span class="instrument-pad-target" aria-hidden="true"></span></div><p class="instrument-pad-help">DRAG TO ORBIT · SHIFT + DRAG TO TOUCH<br>SCROLL OR PINCH TO ZOOM</p><label class="marine-range">ZOOM<input data-zoom type="range" min="0.55" max="2.2" step="0.01" value="1" aria-label="Marine zoom"></label><button data-reset-view type="button">RESET VIEW</button>
 <label class="marine-range">TRIGGER LEVEL <output data-sensitivity></output><input type="range" min="0.005" max="0.12" step="0.001" value="0.018" aria-label="Sound trigger threshold; lower is more sensitive"></label>
 <label class="marine-range">HOLD TIME <output data-hold></output><input type="range" min="0.04" max="1.5" step="0.01" value="0.06" aria-label="Call duration"></label>
 <div class="marine-actions"><button type="button" data-mic>ENABLE MIC</button><button type="button" data-input-done>DONE / END INPUT</button><button type="button" data-stop>STOP</button></div>
 <label class="marine-range">SPECIMEN<select data-visitor aria-label="Marine specimen for simulated calls"><option value="auto">Random specimen</option>${Object.entries(SPECIES).map(([id,s])=>`<option value="${id}">${s.name}</option>`).join('')}</select></label>
 <button type="button" data-call>SIMULATE CALL <span aria-hidden="true">↗</span></button>
 <p class="marine-permission" data-permission role="status"></p>
 <p class="marine-privacy">LOCAL LEVEL ANALYSIS ONLY. NO RECORDING OR UPLOADS. LEAVING RELEASES THE MICROPHONE.</p>
 <span data-count hidden>00</span>`;
 document.body.append(element);
 element.querySelectorAll('output').forEach(node=>node.setAttribute('aria-live','off'));
 const find=s=>element.querySelector(s),wave=find('[data-wave]'),ctx=wave.getContext('2d');
 const mic=find('[data-mic]'),stopButton=find('[data-stop]'),callButton=find('[data-call]');
 const threshold=find('input[aria-label^="Sound"]'),hold=find('input[aria-label="Call duration"]');
 const phase=find('[data-phase]'),species=find('[data-species]'),permission=find('[data-permission]');
 const stopPad=bindMarineGestures(find('[data-marine-pad]'),{orbit:marine.orbit,zoom:marine.zoom,contact:marine.contact,reset:()=>marine.setView({yaw:0,pitch:0,zoom:1})});
 const events=new AbortController();let request=0,lastPhase='',lastStatus='',lastUpdate=-Infinity;
 const listen=(node,type,handler)=>node.addEventListener(type,handler,{signal:events.signal});
 for(const type of ['pointerdown','pointermove','pointerup','pointercancel','click','dblclick','wheel','keydown','keyup'])
  listen(element,type,event=>{if(event.key!=='Escape')event.stopPropagation();});
 function stop(){request++;marine.stop();audio.stop();update(true);}
 async function finishInput(){request++;const busy=!['IDLE','LISTENING'].includes(marine.state.phase);marine.setRemoteLevel(0);if(busy){audio.finishInput();await audio.unlock();}else{audio.stop();marine.stop();}update(true);}
 async function startMicrophone(){
  const token=++request;
  const pending=audio.start();update(true);
  if(await pending && token===request && !element.hidden){marine.start();}
  update(true);
 }
 async function simulate(selected){
  if(!['IDLE','LISTENING'].includes(marine.state.phase))return false;
  const token=++request;
  const pending=audio.unlock();
  const accepted=marine.call(selected||find('[data-visitor]').value);update(true);
  await pending;
  if(token===request)update(true);
  return accepted;
 }
 function inspect(id){stop();marine.inspect(id);find('[data-visitor]').value=id;update(true);}
 listen(find('[data-zoom]'),'input',event=>marine.setView({zoom:Number(event.target.value)}));listen(find('[data-reset-view]'),'click',()=>marine.setView({yaw:0,pitch:0,zoom:1}));
 listen(mic,'click',()=>{if(audio.status==='listening'||audio.status==='requesting')stop();else void startMicrophone();});
 listen(find('[data-visitor]'),'change',()=>{const id=find('[data-visitor]').value;if(id!=='auto')inspect(id);});
 listen(find('[data-input-done]'),'click',()=>void finishInput());
 listen(stopButton,'click',stop);listen(callButton,'click',()=>void simulate());
 listen(threshold,'input',()=>{marine.setParameters({threshold:Number(threshold.value)});update(true);});
 listen(hold,'input',()=>{marine.setParameters({hold:Number(hold.value)});update(true);});
 function show(id){
  const index=MARINE_SCREEN_IDS.indexOf(id),visible=index>=0;
  if(!visible&&!element.hidden)stop();
  element.hidden=!visible;document.body.classList.toggle('marine-species-open',visible);
  if(visible){marine.selectScreen(id);find('[data-channel]').textContent=CHANNELS[index];update(true);}
 }
 function update(force=false){
  if(element.hidden&&!force)return;
  const now=performance.now();if(!force&&now-lastUpdate<70)return;lastUpdate=now;
  const s=marine.state,busy=!['IDLE','LISTENING'].includes(s.phase),active=audio.status==='listening',pending=audio.status==='requesting';
  if(lastPhase!==s.phase+audio.status+s.inspecting){phase.textContent=s.inspecting?'Inspecting':s.phase==='LISTENING'&&!active?'Ready / simulate call':PHASES[s.phase];lastPhase=s.phase+audio.status+s.inspecting;}
  if(document.activeElement!==find('[data-zoom]'))find('[data-zoom]').value=s.view.zoom;
  species.textContent=SPECIES[s.species]?.name||s.species;element.dataset.phase=s.phase;
  const locked=s.selectedScreen==='screen.right.01';find('[data-marine-pad]').classList.toggle('rotation-locked',locked);find('.instrument-pad-help').innerHTML=locked?'FIXED ORIENTATION · SOUND RESPONSE<br>SCROLL OR PINCH TO ZOOM':'DRAG TO ORBIT · SHIFT + DRAG TO TOUCH<br>SCROLL OR PINCH TO ZOOM';
  if(lastStatus!==audio.message){permission.textContent=audio.message;lastStatus=audio.message;}
  mic.textContent=pending?'CANCEL REQUEST':active?'STOP MIC':'ENABLE MIC';
  mic.disabled=busy&&!active&&!pending;find('[data-input-done]').disabled=!active&&!pending;
  callButton.disabled=busy||pending;stopButton.disabled=!s.inspecting&&s.phase==='IDLE'&&!active&&!pending;
  find('[data-count]').textContent=String(s.encounterCount).padStart(2,'0');
  find('[data-volume]').textContent=Math.round(Math.min(1,s.level/.15)*100)+'%';find('meter').value=s.level;
  find('[data-sensitivity]').textContent=s.threshold.toFixed(3)+' ';find('[data-hold]').textContent=s.hold.toFixed(2)+' s';
  ctx.fillStyle='#122a33';ctx.fillRect(0,0,448,104);ctx.lineWidth=1;
  ctx.strokeStyle='#c6bec044';ctx.beginPath();ctx.moveTo(0,52);ctx.lineTo(448,52);ctx.stroke();
  ctx.strokeStyle=busy?'#d3b9c5':'#b8d9d8';ctx.beginPath();
  const samples=audio.waveform;
  for(let x=0;x<448;x++){const value=active?samples[Math.floor(x/448*samples.length)]||0:0,y=52+value*160;x?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  ctx.fillStyle='#9ab8bb';ctx.font='10px "FS Pixel"';ctx.fillText(active?(busy?'INPUT / DETECTION PAUSED':'INPUT / LOCAL ONLY'):'INPUT / OFF',10,17);
 }
 return {element,show,update,stop,finishInput,simulate,inspect,startMicrophone,dispose(){stop();stopPad();events.abort();element.remove();document.body.classList.remove('marine-species-open');}};
}
