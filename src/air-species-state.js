export const AIR_SCREEN_IDS=Object.freeze(['screen.upper_left','screen.portrait_left','screen.left.02','screen.left.03']);
export const AIR_DEFAULTS=Object.freeze({response:.45,feather:.65,drift:.5,attraction:.72,fluidity:.65});

const STEP=1/120,TRAIL_INTERVAL=1/20,GLIDE_SECONDS=3.2;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const smooth=value=>value*value*(3-2*value);
const approach=(value,target,rate,dt)=>value+(target-value)*(1-Math.exp(-rate*dt));
function finite(value,name){if(typeof value!=='number'||!Number.isFinite(value))throw new TypeError(name+' must be a finite number.');return value;}
function initialState(){
 return {time:0,x:0,y:0,z:0,vx:0,vy:0,vz:0,speed:0,phase:0,flap:0,bank:0,featherLag:0,stretch:1,
  wind:{x:0,y:0},target:{x:0,y:0},input:{x:0,y:0,active:false,source:'pointer'},
  field:{x:0,y:0,vx:0,vy:0,target:{x:0,y:0},input:{x:0,y:0,active:false,source:'pointer'},strength:0,energy:0,swirl:0,phase:0,mode:'resting'},
  params:{...AIR_DEFAULTS},mode:'floating',trail:[{x:0,y:0,z:0,time:0}]};
}

export function createAirSpeciesState(){
 const state=initialState();
 let accumulator=0,trailElapsed=0,releaseTime=-GLIDE_SECONDS,coast={x:0,y:0};

 function releaseInput(){
  if(!state.input.active)return;
  state.input.active=false;state.mode='gliding';releaseTime=state.time;
  coast={x:clamp(state.x+state.vx*.8,-1,1),y:clamp(state.y+state.vy*.8,-1,1)};
 }

 // Pointer and future hand-tracking adapters both provide normalized coordinates here.
 function setInput({x,y,active=true,source='pointer'}={}){
  const nextX=clamp(finite(x,'x'),-1,1),nextY=clamp(finite(y,'y'),-1,1);
  if(typeof active!=='boolean')throw new TypeError('active must be a boolean.');
  if(typeof source!=='string'||!source.trim()||source.length>48)throw new TypeError('source must be a short nonempty string.');
  state.input.x=nextX;state.input.y=nextY;state.input.source=source;
  if(!active){releaseInput();return;}
  state.input.active=true;state.target.x=nextX;state.target.y=nextY;state.mode='responding';
 }

 function setParameters(patch){
  if(!patch||typeof patch!=='object'||Array.isArray(patch))throw new TypeError('parameters must be an object.');
  const next={};
  for(const [key,value] of Object.entries(patch)){
   if(!Object.hasOwn(AIR_DEFAULTS,key))throw new TypeError('Unknown AIR parameter: '+key);
   next[key]=clamp(finite(value,key),0,1);
  }
  Object.assign(state.params,next);return {...state.params};
 }

 function releaseFieldInput(){
  const f=state.field;if(!f.input.active)return;
  f.input.active=false;f.mode='relaxing';
  f.target={x:clamp(f.x+f.vx*.18,-1,1),y:clamp(f.y+f.vy*.18,-1,1)};
 }
 function setFieldInput({x,y,active=true,source='pointer'}={}){
  const nextX=clamp(finite(x,'field x'),-1,1),nextY=clamp(finite(y,'field y'),-1,1);
  if(typeof active!=='boolean')throw new TypeError('active must be a boolean.');
  if(typeof source!=='string'||!source.trim()||source.length>48)throw new TypeError('source must be a short nonempty string.');
  const f=state.field;Object.assign(f.input,{x:nextX,y:nextY,source});
  if(!active){releaseFieldInput();return;}
  f.input.active=true;f.target={x:nextX,y:nextY};f.mode='attracting';
 }
 function integrateField(dt){
  const f=state.field,p=state.params,stiffness=22-p.fluidity*10,damping=9-p.fluidity*4;
  for(const axis of ['x','y']){
   const velocity='v'+axis;
   f[velocity]=clamp(f[velocity]+((f.target[axis]-f[axis])*stiffness-f[velocity]*damping)*dt,-3.5,3.5);
   f[axis]+=f[velocity]*dt;
   if(Math.abs(f[axis])>1){f[axis]=clamp(f[axis],-1,1);if(f[axis]*f[velocity]>0)f[velocity]*=.2;}
  }
  f.strength=approach(f.strength,f.input.active?p.attraction:0,f.input.active?4.8:1.1-p.fluidity*.55,dt);
  const motion=Math.hypot(f.vx,f.vy);
  f.energy=approach(f.energy,f.input.active?Math.min(1,motion*.48+.1):0,f.input.active?4:.9,dt);
  const turn=clamp((f.x*f.vy-f.y*f.vx)*1.3+(f.vx-f.vy)*.28,-1.5,1.5);
  f.swirl=approach(f.swirl,f.input.active?turn:0,f.input.active?3.5:.75,dt);
  f.phase+=dt*(.8+f.energy*2.4);
  f.mode=f.input.active?'attracting':f.strength>.008?'relaxing':'resting';
 }

 function integrate(dt){
  const s=state,p=s.params;s.time+=dt;
  integrateField(dt);
  s.wind.x=(Math.sin(s.time*.63)+Math.sin(s.time*1.13+.6)*.36)*(.016+p.drift*.065);
  s.wind.y=Math.cos(s.time*.47+.8)*(.012+p.drift*.045);
  const autonomousX=Math.sin(s.time*.23)*(.18+p.drift*.35);
  const autonomousY=Math.sin(s.time*.31+.5)*(.12+p.drift*.23);
  let stiffness,damping;
  if(s.input.active){
   s.mode='responding';s.target.x=s.input.x;s.target.y=s.input.y;
   stiffness=2.8+p.response*7.2;damping=2*Math.sqrt(stiffness)*.84;
  }else{
   const blend=smooth(clamp((s.time-releaseTime)/GLIDE_SECONDS,0,1));
   s.mode=blend<1?'gliding':'floating';
   s.target.x=coast.x+(autonomousX-coast.x)*blend;
   s.target.y=coast.y+(autonomousY-coast.y)*blend;
   stiffness=(.48+p.response*.6)*(.12+.88*blend);damping=.38+.75*blend;
  }
  s.vx+=((s.target.x-s.x)*stiffness-s.vx*damping+s.wind.x)*dt;
  s.vy+=((s.target.y-s.y)*stiffness-s.vy*damping+s.wind.y)*dt;
  const depthTarget=Math.sin(s.time*.39)*(.055+p.drift*.08);
  s.vz+=((depthTarget-s.z)*.8-s.vz*1.2)*dt;
  s.x+=s.vx*dt;s.y+=s.vy*dt;s.z+=s.vz*dt;
  for(const axis of ['x','y']){
   if(Math.abs(s[axis])>1){s[axis]=clamp(s[axis],-1,1);if(s[axis]*s['v'+axis]>0)s['v'+axis]*=.25;}
  }
  s.speed=Math.hypot(s.vx,s.vy,s.vz);
  s.phase+=dt*(1.3+s.speed*.85);s.flap=Math.sin(s.phase);
  s.bank=approach(s.bank,clamp(-s.vx*.38,-.48,.48),2.5,dt);
  s.featherLag=approach(s.featherLag,Math.min(1.4,s.speed*(.12+p.feather*.68)),5-p.feather*3.3,dt);
  s.stretch=approach(s.stretch,1+Math.min(.48,s.speed*(.08+p.feather*.27)),3.8-p.feather*2,dt);
  trailElapsed+=dt;
  if(trailElapsed+1e-10>=TRAIL_INTERVAL){
   trailElapsed-=TRAIL_INTERVAL;s.trail.push({x:s.x,y:s.y,z:s.z,time:s.time});
   if(s.trail.length>180)s.trail.shift();
  }
 }

 function step(dt){
  finite(dt,'dt');if(dt<0)throw new RangeError('dt must not be negative.');
  // A background-tab pause must not produce a giant simulation jump on return.
  accumulator+=Math.min(dt,.25);
  while(accumulator+1e-10>=STEP){integrate(STEP);accumulator=Math.max(0,accumulator-STEP);}
  return state;
 }
 function reset(){
  Object.assign(state,initialState());accumulator=0;trailElapsed=0;releaseTime=-GLIDE_SECONDS;coast={x:0,y:0};return state;
 }
 function snapshot(){return {...state,wind:{...state.wind},target:{...state.target},input:{...state.input},field:{...state.field,target:{...state.field.target},input:{...state.field.input}},params:{...state.params},trail:state.trail.map(point=>({...point}))};}
 return {state,step,setInput,releaseInput,setFieldInput,releaseFieldInput,setParameters,reset,snapshot};
}
