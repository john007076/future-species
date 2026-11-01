import * as THREE from 'three';
import {box,mesh,rod,wire,frameGeometry,roundedRect,instances,screws} from './model-utils.js';

function taperedShell(w,h,d,material,parent){
 const sections=[[w,h,0],[w*.995,h*.995,-.12],[w*.91,h*.94,-d*.65],[w*.77,h*.83,-d],[w*.75,h*.81,-d-.035]];
 const points=roundedRect(1,1,.065).getSpacedPoints(48).slice(0,-1),n=points.length,vertices=[],uvs=[],index=[];
 sections.forEach(([sw,sh,z],j)=>points.forEach((p,i)=>{vertices.push(p.x*sw,p.y*sh,z);uvs.push(i/n,j/(sections.length-1));}));
 for(let j=0;j<sections.length-1;j++)for(let i=0;i<n;i++){const a=j*n+i,b=j*n+(i+1)%n,c=(j+1)*n+i,e=(j+1)*n+(i+1)%n;index.push(a,c,b,b,c,e);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(index);geometry.computeVertexNormals();
 mesh(geometry,material,parent,'housing.tapered');
 box(parent,'housing.back',[w*.75,h*.81,.05],[0,0,-d-.02],material,.05);
}

function displayMaterial(texture,spec){
 const uniforms={
  displayBrightness:{value:1},displaySaturation:{value:.88},displayContrast:{value:1.04},
  displayTint:{value:new THREE.Color('#dce8e5')},displayScanlines:{value:.09},
  displayContent:{value:1},displayLines:{value:spec.resolution?.[1]||600},
 };
 const material=new THREE.MeshPhysicalMaterial({color:0x101313,map:texture,emissiveMap:texture,emissive:0xffffff,emissiveIntensity:1,roughness:.32,metalness:0,specularIntensity:.16,clearcoat:.12,clearcoatRoughness:.3,toneMapped:false});
 material.onBeforeCompile=shader=>{
  Object.assign(shader.uniforms,uniforms);
  shader.fragmentShader='uniform float displayBrightness;uniform float displaySaturation;uniform float displayContrast;uniform vec3 displayTint;uniform float displayScanlines;uniform float displayContent;uniform float displayLines;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
   float displayLuma=dot(outgoingLight,vec3(.2126,.7152,.0722));
   outgoingLight=mix(vec3(displayLuma),outgoingLight,displaySaturation);
   outgoingLight=(outgoingLight-.42)*displayContrast+.42;
   outgoingLight*=displayTint*displayBrightness;
   #ifdef USE_MAP
    float displayScan=1.0-displayScanlines*(.5+.5*sin(vMapUv.y*displayLines*6.2831853));
    outgoingLight*=displayScan;
   #endif
   outgoingLight=mix(vec3(.004,.009,.011),outgoingLight,displayContent);
   #include <opaque_fragment>
  `);
 };
 material.customProgramCacheKey=()=> 'future-species-display-v1';
 material.userData.displayUniforms=uniforms;
 return material;
}

function badge(parent,text,w,h,y,material){
 const canvas=document.createElement('canvas');canvas.width=256;canvas.height=48;
 const context=canvas.getContext('2d');context.fillStyle='#b7b098';context.fillRect(0,0,256,48);context.fillStyle='#354446';context.font='18px "FS Pixel"';context.fillText(text,12,30);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const mat=new THREE.MeshStandardMaterial({map:texture,roughness:.7});
 const plate=mesh(new THREE.PlaneGeometry(Math.min(w*.24,.48),Math.min(h*.035,.07)),mat,parent,'manufacturer.badge',[-w*.31,y,.112]);plate.castShadow=false;
 box(parent,'badge.backing',[Math.min(w*.24,.48)+.018,Math.min(h*.035,.07)+.012,.009],[-w*.31,y,.105],material,.003);
}

function crtInternals(parent,w,h,d,mats,transparent){
 const assembly=new THREE.Group();assembly.name='crt.internalAssembly';parent.add(assembly);
 const tube=mesh(new THREE.SphereGeometry(1,28,18),transparent?mats.smokeGlass:mats.dark,assembly,'crt.glassEnvelope',[0,h*.015,-d*.40]);tube.scale.set(w*.285,h*.315,d*.285);
 const neckLength=d*.48,neckY=h*.015;
 const neck=mesh(new THREE.CylinderGeometry(Math.min(w,h)*.072,Math.min(w,h)*.09,neckLength,20),transparent?mats.smokeGlass:mats.dark,assembly,'crt.neck',[0,neckY,-d*.79]);neck.rotation.x=Math.PI/2;
 for(let i=0;i<3;i++){const coil=mesh(new THREE.TorusGeometry(Math.min(w,h)*(.092+i*.008),.014,7,28),i===1?mats.copper:mats.dark,assembly,'crt.deflectionCoil.'+i,[0,neckY,-d*(.59+i*.065)]);coil.scale.y=.9;}
 for(const x of [-.035,0,.035])rod(assembly,'crt.electronGun',[x,neckY,-d*.69],[x,neckY,-d-.03],.008,mats.metal,8);
 const boardY=-h*.33,boardZ=-d*.43,bw=w*.55,bd=d*.43;
 box(assembly,'circuit.mainboard',[bw,.022,bd],[0,boardY,boardZ],mats.board,.005);
 const chips=[],pins=[],capacitors=[];
 for(let row=0;row<2;row++)for(let col=0;col<4;col++){
  const x=(col-1.5)*bw*.19,z=boardZ+(row-.5)*bd*.42;
  chips.push({p:[x,boardY+.026,z],s:[bw*.12,.035,bd*.22]});
  for(const side of [-1,1])for(let p=0;p<4;p++)pins.push({p:[x+side*bw*.067,boardY+.018,z+(p-1.5)*bd*.038],s:[.018,.006,.006]});
 }
 for(let i=0;i<6;i++)capacitors.push({p:[(-2.5+i)*bw*.07,boardY+.052,boardZ+bd*.32],s:[.018,.07,.018]});
 instances(assembly,'circuit.integratedCircuits',new THREE.BoxGeometry(1,1,1),mats.dark,chips);
 instances(assembly,'circuit.pinRows',new THREE.BoxGeometry(1,1,1),mats.metal,pins);
 instances(assembly,'circuit.capacitors',new THREE.CylinderGeometry(1,1,1,10),mats.ceramic,capacitors);
 for(let i=0;i<5;i++)wire(assembly,'circuit.ribbon.'+i,[[(-2+i)*.025,boardY+.02,boardZ+bd*.45],[(-2+i)*.026,boardY+.10,-d*.60],[(-2+i)*.018,neckY-.07,-d*.78]],.004,i%2?mats.copper:mats.ceramic);
 const heatSink=[];for(let i=0;i<7;i++)heatSink.push({p:[bw*.27+i*.012,boardY+.06,boardZ-bd*.2],s:[.005,.1,bd*.22]});
 instances(assembly,'circuit.heatSinkFins',new THREE.BoxGeometry(1,1,1),mats.metal,heatSink);
 assembly.visible=transparent;
}

function rearConnectors(parent,w,h,d,mats){
 box(parent,'rear.interface.plate',[w*.34,h*.22,.035],[0,-h*.12,-d-.057],mats.metal,.012);
 const vga=new THREE.Group();vga.name='rear.vga';vga.position.set(-w*.075,-h*.105,-d-.09);parent.add(vga);
 box(vga,'vga.shell',[w*.13,h*.085,.04],[0,0,0],mats.dark,.016);
 const pins=[];for(let row=0;row<3;row++)for(let col=0;col<5;col++)pins.push({p:[(col-2)*w*.018,(row-1)*h*.017,-.025],r:[Math.PI/2,0,0]});
 instances(vga,'vga.pins',new THREE.CylinderGeometry(.003,.003,.015,6),mats.copper,pins);
 const power=mesh(new THREE.CylinderGeometry(h*.038,h*.038,.045,16),mats.rubber,parent,'rear.powerSocket',[w*.09,-h*.12,-d-.09]);power.rotation.x=Math.PI/2;
 box(parent,'rear.powerSwitch',[w*.055,h*.06,.035],[w*.15,-h*.12,-d-.09],mats.dark,.008);
}

export function createScreen(spec,mats,texture){
 const g=new THREE.Group();g.name=spec.id;g.userData={id:spec.id,kind:'screen',label:spec.label,model:spec.model,resolution:spec.resolution};g.position.set(...spec.position);g.rotation.set(...spec.rotation);
 const [w,h,d]=spec.size,b=spec.bezel,iw=w-b*2,ih=h-b*2,transparent=spec.model==='translucent-crt',compact=spec.model==='compact-crt'||spec.model==='micro-crt';
 const shellMaterial=transparent?mats.icePlastic:(spec.model==='portrait-crt'?mats.mintPlastic:mats.cream);
 const body=new THREE.Group();body.name='body';g.add(body);
 taperedShell(w,h,d,shellMaterial,body);
 crtInternals(body,w,h,d,mats,transparent);
 mesh(frameGeometry(w,h,iw,ih,.082,compact?.045:.082),transparent?mats.frostedGlass:mats.cream,body,'bezel');
 mesh(frameGeometry(iw+.025,ih+.025,iw-.035,ih-.035,.018,.034),mats.rubber,body,'glass.gasket',[0,0,.04]);
 const displayGeo=new THREE.PlaneGeometry(iw-.035,ih-.035,32,24),positions=displayGeo.attributes.position;
 for(let i=0;i<positions.count;i++){const x=positions.getX(i)/(iw/2),y=positions.getY(i)/(ih/2);positions.setZ(i,.037+.022*(1-x*x)*(1-y*y));}displayGeo.computeVertexNormals();
 const display=mesh(displayGeo,displayMaterial(texture,spec),g,'displaySurface');display.castShadow=false;display.userData={id:spec.id,kind:'displaySurface',resolution:spec.resolution};
 const acrylic=new THREE.Group();acrylic.name='acrylic';g.add(acrylic);const a=spec.acrylic;
 mesh(frameGeometry(w+a*2,h+a*2,w-.02,h-.02,.027,.055),spec.id==='screen.right.02'?mats.frostedGlass:mats.glass,acrylic,'shield.front',[0,0,.145]);
 mesh(frameGeometry(w+a*1.35,h+a*1.35,w-.05,h-.05,.023,.04),mats.glass,acrylic,'shield.rear',[0,0,-d*.79]);
 const cornerPoints=[];for(const x of [-1,1])for(const y of [-1,1]){const px=x*(w/2+a*.57),py=y*(h/2+a*.56);rod(acrylic,'standoff',[px,py,-d*.79],[px,py,.17],.018,mats.metal);cornerPoints.push([px,py,.19]);}
 const bezelPoints=[];for(const x of [-w/2+.052,w/2-.052])for(const y of [-h/2+.06,0,h/2-.06])bezelPoints.push([x,y,.102]);
 for(const y of [-h/2+.05,h/2-.05])for(let i=0;i<Math.max(2,Math.round(w/.38));i++)bezelPoints.push([-w/2+.24+i*(w-.48)/Math.max(1,Math.round(w/.38)-1),y,.102]);
 screws(body,bezelPoints,mats.metal,.016);screws(acrylic,cornerPoints,mats.metal,.026);
 const vents=[];for(let y=-h*.28;y<h*.28;y+=.055)for(const x of [-1,1])vents.push({p:[x*(w*.26),y,-d-.048]});
 instances(body,'rear.vent.slits',new THREE.BoxGeometry(w*.17,.018,.008),mats.rubber,vents);
 rearConnectors(body,w,h,d,mats);
 box(body,'mounting.bracket',[.11,h*.54,.08],[0,0,-d-.13],mats.metal);
 for(const y of [-h*.21,h*.21])rod(body,'rear.mount.bolt',[-.1,y,-d-.15],[.1,y,-d-.15],.024,mats.metal);
 const taperSlope=-w*.0425/(d*.65-.12),sideX=w*.4975-taperSlope*(-d*.4+.12),lateralVents=[];
 for(const side of [-1,1])for(let j=0;j<9;j++)lateralVents.push({p:[side*(sideX+.006),-h*.22+j*h*.055,-d*.4],r:[0,side*Math.atan(taperSlope),0]});
 instances(body,'side.vent.slits',new THREE.BoxGeometry(.009,Math.min(.012,h*.018),d*.26),mats.rubber,lateralVents);
 const controlsY=-h/2+b*.48,knobRadius=Math.min(.033,b*.2);
 for(let i=0;i<(compact?2:3);i++){const knob=mesh(new THREE.CylinderGeometry(knobRadius,knobRadius*.92,.025,18),i===0?mats.dark:mats.metal,body,'front.control.'+i,[w*.28+i*knobRadius*2.8,controlsY,.119]);knob.rotation.x=Math.PI/2;}
 for(let i=0;i<(compact?2:4);i++)box(body,'front.button.'+i,[knobRadius*1.3,knobRadius*.62,.018],[-w*.04+i*knobRadius*2.1,controlsY,.119],mats.dark,.004);
 const led=mesh(new THREE.SphereGeometry(.011,8,6),mats.led,body,'status.led',[w*.39,controlsY,.12]);led.castShadow=false;
 if(!compact)badge(body,transparent?'FS / CLEAR CRT':'FS / STUDIO',w,h,controlsY,mats.metal);
 return g;
}
