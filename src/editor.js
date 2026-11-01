export function createEditor({specs,store,onTransform,onDisplay,onMode,onUpload,onSaveProject,onImport,onDemo,onRestore,onReset}){
 const panel=document.querySelector('#selection'),name=document.querySelector('#selection-name'),status=document.querySelector('#editor-status');
 const selector=document.querySelector('#screen-select'),file=document.querySelector('#content-file'),importer=document.querySelector('#layout-file');
 let selected=null;
 function say(message,error=false){status.textContent=message;status.classList.toggle('error',error);}
 function sync(){
  if(!selected)return;const state=store.snapshot(),screen=state.screens[selected],data=screen||state.hardware[selected];
  panel.querySelectorAll('.hardware-only').forEach(element=>element.hidden=!data);
  panel.querySelectorAll('.screen-only').forEach(element=>element.hidden=!screen);
  if(!data)return;
  panel.querySelectorAll('[data-position]').forEach(input=>input.value=data.position[Number(input.dataset.position)].toFixed(3));
  panel.querySelectorAll('[data-rotation]').forEach(input=>{const axis=input.dataset.rotation,degrees=THREE_RAD_TO_DEG*data.rotation[axis];input.value=degrees.toFixed(1);panel.querySelector(`[data-rotation-slider="${axis}"]`).value=degrees;});
  if(screen)panel.querySelectorAll('[data-display]').forEach(input=>input.value=screen.display[input.dataset.display]);
  if(screen)selector.value=screen.display.mode;
 }
 const THREE_RAD_TO_DEG=180/Math.PI;
 function show(id,label){
  selected=id;panel.hidden=!id;if(!id)return;name.textContent=label||id;sync();
  const state=store.snapshot();say(state.screens[id]?'TRANSFORMS AND DISPLAY SETTINGS AUTO-SAVE.':state.hardware[id]?'Changing an angle does not require changing position.':'This object supports inspection only.');
 }
 function rotationChanged(){
  if(!selected)return;const rotation=[];
  panel.querySelectorAll('[data-rotation]').forEach(field=>rotation[Number(field.dataset.rotation)]=Number(field.value)/THREE_RAD_TO_DEG);
  onTransform(selected,{rotation});
 }
 panel.querySelectorAll('[data-rotation]').forEach(input=>input.addEventListener('input',rotationChanged));
 panel.querySelectorAll('[data-rotation-slider]').forEach(input=>input.addEventListener('input',()=>{panel.querySelector(`[data-rotation="${input.dataset.rotationSlider}"]`).value=input.value;rotationChanged();}));
 panel.querySelectorAll('[data-position]').forEach(input=>input.addEventListener('input',()=>{
  if(!selected)return;const position=[];panel.querySelectorAll('[data-position]').forEach(field=>position[Number(field.dataset.position)]=Number(field.value));onTransform(selected,{position});
 }));
 panel.querySelectorAll('[data-display]').forEach(input=>input.addEventListener('input',()=>{if(selected)onDisplay(selected,{[input.dataset.display]:input.type==='range'?Number(input.value):input.value});}));
 selector.addEventListener('change',()=>onMode(selected,selector.value));
 document.querySelector('#reset-hardware').addEventListener('click',()=>{if(!selected)return;onReset(selected);sync();say('Default position and angles restored.');});
 document.querySelector('#content-upload').addEventListener('click',()=>file.click());
 file.addEventListener('change',async()=>{if(!file.files[0]||!selected)return;try{await onUpload(selected,file.files[0]);say('Content replaced. Reload to restore the project source.');}catch(error){say(error.message,true);}file.value='';});
 document.querySelector('#content-blank').addEventListener('click',()=>onMode(selected,'blank'));
 document.querySelector('#content-demo').addEventListener('click',()=>onDemo(selected));
 document.querySelector('#content-restore').addEventListener('click',()=>onRestore(selected));
 document.querySelector('#save-project').addEventListener('click',async()=>{try{await onSaveProject();say('Layout saved to references/runtime-layout.json。');}catch(error){say(error.message,true);}});
 document.querySelector('#export-layout').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(store.snapshot(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='future-species-layout.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);say('Layout JSON exported.');
 });
 document.querySelector('#import-layout').addEventListener('click',()=>importer.click());
 importer.addEventListener('change',async()=>{try{if(!importer.files[0])return;const layout=JSON.parse(await importer.files[0].text());onImport(layout);sync();say('Layout imported and saved.');}catch(error){say('Import failed:'+error.message,true);}importer.value='';});
 document.querySelector('#clear-selection').addEventListener('click',()=>document.querySelector('#scene').dispatchEvent(new CustomEvent('future-plan:clear-selection')));
 return {show,sync,say};
}
