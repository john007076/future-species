const IDS=['jelly','fish','mollusc','whale','shark','angelfish','butterflyfish','tang','algae'];
function position(index,time){
 const id=IDS[index%9],school=Math.floor(index/9),a=index*2.399963;
 if(id==='algae')return {x:-5+school*5,y:-3.4,z:-5-school*7};
 if(id==='jelly'){const t=time*.13+a;return {x:Math.sin(t*.38)*5.5,y:Math.sin(t)*2.7+.055*Math.sin(time*1.35),z:-10+Math.cos(t*.31+a)*9};}
 const speed=id==='whale'?.055:id==='shark'?.085:id==='mollusc'?.035:id==='fish'?.10:.13;
 const t=time*speed+a,rx=id==='whale'?8:6.7,rz=id==='whale'?13:10;
 return {x:Math.sin(t)*rx,y:Math.sin(t*.51+a)*(id==='mollusc'?.45:id==='whale'?.6:1.6)+(id==='mollusc'?-2.6:0),z:-12+Math.cos(t)*rz};
}
export function roamingPose(index,time){
 const id=IDS[index%9],p=position(index,time),before=position(index,time-.02),after=position(index,time+.02),vx=(after.x-before.x)/.04,vy=(after.y-before.y)/.04,vz=(after.z-before.z)/.04;
 return {...p,yaw:id==='algae'?0:id==='jelly'?Math.sin(time*.06+index)*.08:Math.atan2(vz,-vx),pitch:id==='algae'||id==='jelly'?0:-Math.atan2(vy,Math.hypot(vx,vz)),scale:id==='whale'?.8+Math.floor(index/9)*.13:.65+(index%3)*.2,vx,vy,vz};
}
