// Body-local scalar field shared by the membrane, feather deformation and flow view.
export function morphLobes(state){
 const f=state.field,flow=state.params.fluidity,x=f.x*1.4,y=-f.y*1.05-.08;
 const spread=.22+flow*.22+f.energy*.13;
 return [
  {x,y,r:.42+flow*.15},
  {x:x-f.vx*.14+Math.cos(f.phase*1.3)*spread,y:y+f.vy*.14+Math.sin(f.phase*1.3)*spread,r:.29+flow*.06},
  {x:x-f.vx*.24-Math.sin(f.phase*.9)*spread*.9,y:y+f.vy*.24+Math.cos(f.phase*.9)*spread*.85,r:.23+f.energy*.1},
 ];
}
export function fieldDensity(lobes,x,y){
 let density=0;for(const lobe of lobes){const dx=x-lobe.x,dy=y-lobe.y;density+=lobe.r*lobe.r/(dx*dx+dy*dy+.075);}return density;
}
export function applyMorphField(point,u,state,lobes){
 const f=state.field,flow=state.params.fluidity;if(f.strength<.0001)return;
 let px=0,py=0,total=0;
 for(const lobe of lobes){
  const dx=lobe.x-point[0],dy=lobe.y-point[1],r2=lobe.r*lobe.r;
  const weight=(r2/(r2+dx*dx+dy*dy))**2;
  px+=dx*weight;py+=dy*weight;total+=weight;
 }
 const influence=f.strength*(.28+.72*u)*1.55/(1+total*.25);
 const curl=f.swirl*(.24+flow*.32);
 point[0]+=(px-py*curl)*influence;
 point[1]+=(py+px*curl)*influence;
 point[2]+=total*f.strength*(.12+flow*.2)*Math.sin(f.phase-u*3);
}
