export function bindMarineGestures(element,{orbit,zoom,contact,select=()=>{},contactMode=()=>false,reset=()=>{},keyboard=true}){
 const events=new AbortController(),pointers=new Map();let dragged=false,pinch=0;
 const listen=(type,fn,options={})=>element.addEventListener(type,fn,{...options,signal:events.signal});
 const point=event=>{const r=element.getBoundingClientRect();return {x:Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1)),y:Math.max(-1,Math.min(1,1-(event.clientY-r.top)/r.height*2)),strength:.7,active:true};};
 const mark=event=>{const p=point(event);element.style.setProperty('--pad-x',`${(p.x+1)*50}%`);element.style.setProperty('--pad-y',`${(1-p.y)*50}%`);};
 const distance=()=>{const [a,b]=[...pointers.values()];return a&&b?Math.hypot(a.x-b.x,a.y-b.y):0;};
 listen('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button!==0)return;event.preventDefault();if(!pointers.size)dragged=false;select();mark(event);element.classList.add('is-active');pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});element.setPointerCapture(event.pointerId);pinch=distance();if(event.shiftKey||contactMode())contact(point(event));});
 listen('pointermove',event=>{const previous=pointers.get(event.pointerId);if(!previous)return;mark(event);event.preventDefault();const dx=event.clientX-previous.x,dy=event.clientY-previous.y;if(Math.hypot(dx,dy)>1)dragged=true;pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(pointers.size>1){const next=distance();if(pinch>0&&next>0)zoom(next/pinch);pinch=next;contact(point(event));}else if(event.shiftKey||contactMode())contact(point(event));else orbit(dx*.008,dy*.008);});
 const end=event=>{if(!pointers.delete(event.pointerId))return;pinch=distance();if(!pointers.size)element.classList.remove('is-active');contact({active:false});};
 for(const type of ['pointerup','pointercancel','lostpointercapture'])listen(type,end);
 listen('click',event=>{if(dragged){event.preventDefault();event.stopImmediatePropagation();}}, {capture:true});
 listen('wheel',event=>{event.preventDefault();select();zoom(Math.exp(-Math.max(-200,Math.min(200,event.deltaY))*.002));},{passive:false});
 listen('keydown',event=>{if(!keyboard)return;if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','Home'].includes(event.key))return;event.preventDefault();select();if(event.key==='+')zoom(1.1);else if(event.key==='-')zoom(1/1.1);else if(event.key==='Home')reset();else orbit(event.key==='ArrowLeft'?-.06:event.key==='ArrowRight'?.06:0,event.key==='ArrowUp'?-.06:event.key==='ArrowDown'?.06:0);});
 const finish=()=>{pointers.clear();element.classList.remove('is-active');contact({active:false});};addEventListener('blur',finish,{signal:events.signal});
 return ()=>{finish();events.abort();};
}
