const STORAGE_KEY='future-species.layout.v3';
const MODES=new Set(['blank','image','video','live']);
const finite=(value,fallback,min=-Infinity,max=Infinity)=>value!==null&&value!==''&&Number.isFinite(Number(value))?Math.min(max,Math.max(min,Number(value))):fallback;
const vector=(value,fallback)=>fallback.map((v,i)=>finite(value?.[i],v,-30,30));
const rotation=(value,fallback)=>vector(value,fallback).map((v,i)=>finite(v,fallback[i],-Math.PI*2,Math.PI*2));
const color=(value,fallback)=>/^#[0-9a-f]{6}$/i.test(value||'')?value:fallback;

export function normaliseLayout(specs,design,defaults,input={},hardwareSpecs=[]){
 const savedScreens=input?.screens||{},savedHardware=input?.hardware||{};
 const screens=Object.fromEntries(specs.map(spec=>{
  const previous=savedScreens[spec.id]||{};
  return [spec.id,{
   name:spec.label,model:design[spec.id]?.model||'studio-crt',resolution:[...design[spec.id]?.resolution||[640,480]],
   position:vector(previous.position,spec.position),rotation:rotation(previous.rotation,spec.rotation),
   display:{
    mode:MODES.has(previous.display?.mode)?previous.display.mode:defaults.mode,
    brightness:finite(previous.display?.brightness,defaults.brightness,0,2),saturation:finite(previous.display?.saturation,defaults.saturation,0,2),
    contrast:finite(previous.display?.contrast,defaults.contrast,.2,2),tint:color(previous.display?.tint,defaults.tint),
    scanlines:finite(previous.display?.scanlines,defaults.scanlines,0,.5),flip:previous.display?.flip===true,
   },
  }];
 }));
 const hardware=Object.fromEntries(hardwareSpecs.map(spec=>[spec.id,{
  name:spec.label,position:vector(savedHardware[spec.id]?.position,spec.position),rotation:rotation(savedHardware[spec.id]?.rotation,spec.rotation),
 }]));
 return {version:2,screens,hardware};
}

export function createLayoutStore(specs,design,defaults,storage=globalThis.localStorage,hardwareSpecs=[]){
 let restored=null;
 try{restored=JSON.parse(storage?.getItem(STORAGE_KEY)||'null');}catch{}
 let state=normaliseLayout(specs,design,defaults,restored,hardwareSpecs);
 function snapshot(){return structuredClone(state);}
 function save(){try{storage?.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch{return false;}}
 function update(id,patch){
  const group=state.screens[id]?'screens':state.hardware[id]?'hardware':null;if(!group)throw new Error('Unknown hardware: '+id);
  const candidate=structuredClone(state),current=state[group][id];Object.assign(candidate[group][id],patch);
  if(group==='screens'&&patch.display)candidate.screens[id].display={...current.display,...patch.display};
  state=normaliseLayout(specs,design,defaults,candidate,hardwareSpecs);save();return snapshot()[group][id];
 }
 function replace(layout){state=normaliseLayout(specs,design,defaults,layout,hardwareSpecs);save();return snapshot();}
 return {snapshot,update,replace,save,storageKey:STORAGE_KEY};
}
