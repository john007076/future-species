import * as THREE from 'three';
import {box,mesh,rod,wire,frameGeometry,roundedRect,instances,screws} from './model-utils.js';
function taperedShell(w,h,d,material,parent){
 const sections=[[w,h,0],[w*.995,h*.995,-.12],[w*.91,h*.94,-d*.65],[w*.77,h*.83,-d],[w*.75,h*.81,-d-.035]];
 const points=roundedRect(1,1,.065).getSpacedPoints(48).slice(0,-1), n=points.length, vertices=[],uvs=[],index=[];
 sections.forEach(([sw,sh,z],j)=>points.forEach((p,i)=>{vertices.push(p.x*sw,p.y*sh,z);uvs.push(i/n,j/(sections.length-1));}));
 for(let j=0;j<sections.length-1;j++)for(let i=0;i<n;i++){const a=j*n+i,b=j*n+(i+1)%n,c=(j+1)*n+i,e=(j+1)*n+(i+1)%n;index.push(a,c,b,b,c,e)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(index);g.computeVertexNormals();mesh(g,material,parent,'housing.tapered');box(parent,'housing.back',[w*.75,h*.81,.05],[0,0,-d-.02],material,.05);
}
export function createScreen(spec,mats,texture){
 const g=new THREE.Group();g.name=spec.id;g.userData={id:spec.id,kind:'screen',label:spec.label};g.position.set(...spec.position);g.rotation.set(...spec.rotation);
 const [w,h,d]=spec.size,b=spec.bezel,iw=w-b*2,ih=h-b*2;
 const body=new THREE.Group();body.name='body';g.add(body);
 taperedShell(w,h,d,mats.cream,body);
 mesh(frameGeometry(w,h,iw,ih,.082,.055),mats.cream,body,'bezel');
 mesh(frameGeometry(iw+.025,ih+.025,iw-.035,ih-.035,.018,.034),mats.rubber,body,'glass.gasket',[0,0,.04]);
 const displayGeo=new THREE.PlaneGeometry(iw-.035,ih-.035,24,24);const p=displayGeo.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i)/(iw/2),y=p.getY(i)/(ih/2);p.setZ(i,.037+.018*(1-x*x)*(1-y*y))}displayGeo.computeVertexNormals();
 const screenMat=new THREE.MeshPhysicalMaterial({color:0x080909,map:texture,emissiveMap:texture,emissive:0xffffff,emissiveIntensity:.97,roughness:.4,metalness:0,specularIntensity:.1,clearcoat:.07,clearcoatRoughness:.35,toneMapped:false});
 const display=mesh(displayGeo,screenMat,g,'displaySurface');display.castShadow=false;display.userData={id:spec.id,kind:'displaySurface'};
 const acrylic=new THREE.Group();acrylic.name='acrylic';g.add(acrylic);const a=spec.acrylic;
 mesh(frameGeometry(w+a*2,h+a*2,w-.02,h-.02,.027,.055),mats.glass,acrylic,'shield.front',[0,0,.145]);
 mesh(frameGeometry(w+a*1.35,h+a*1.35,w-.05,h-.05,.023,.04),mats.glass,acrylic,'shield.rear',[0,0,-d*.79]);
 const cornerPoints=[];for(const x of [-1,1])for(const y of [-1,1]){const px=x*(w/2+a*.57),py=y*(h/2+a*.56);rod(acrylic,'standoff',[px,py,-d*.79],[px,py,.17],.018,mats.metal);cornerPoints.push([px,py,.19]);}
 const bezelPoints=[];for(const x of [-w/2+.052,w/2-.052])for(const y of [-h/2+.06,0,h/2-.06])bezelPoints.push([x,y,.102]);
 for(const y of [-h/2+.05,h/2-.05])for(let i=0;i<Math.max(2,Math.round(w/.38));i++)bezelPoints.push([-w/2+.24+i*(w-.48)/Math.max(1,Math.round(w/.38)-1),y,.102]);
 screws(body,bezelPoints,mats.metal,.016);screws(acrylic,cornerPoints,mats.metal,.026);
 const vents=[];for(let y=-h*.28;y<h*.28;y+=.055)for(const x of [-1,1])vents.push({p:[x*(w*.26),y,-d-.048],s:[1,1,1]});
 instances(body,'rear.vent.slits',new THREE.BoxGeometry(w*.17,.018,.008),mats.rubber,vents);
 box(body,'rear.interface.plate',[w*.31,h*.22,.035],[0,-h*.12,-d-.057],mats.metal);
 const sockets=[];for(let i=0;i<4;i++)sockets.push({p:[(i-1.5)*w*.065,-h*.12,-d-.085]});instances(body,'rear.ports',new THREE.BoxGeometry(w*.042,.055,.025),mats.dark,sockets);
 box(body,'mounting.bracket',[.11,h*.54,.08],[0,0,-d-.13],mats.metal);
 for(const y of [-h*.21,h*.21])rod(body,'rear.mount.bolt',[-.1,y,-d-.15],[.1,y,-d-.15],.024,mats.metal);
 const taperSlope=-w*.0425/(d*.65-.12), sideX=-w*.4975+taperSlope*(-d*.4+.12);
 const lateralVents=[];for(let j=0;j<9;j++)lateralVents.push({p:[sideX-.006,-h*.22+j*h*.055,-d*.4],r:[0,Math.atan(taperSlope),0],s:[1,1,1]});
 instances(body,'side.vent.slits',new THREE.BoxGeometry(.009,Math.min(.012,h*.018),d*.26),mats.rubber,lateralVents);
 const led=mesh(new THREE.SphereGeometry(.011,6,4),mats.led,body,'status.led',[w*.31,-h/2+.055,.1]);led.castShadow=false;
 for(let i=0;i<(w>2?5:3);i++){const x=(i-(w>2?2:1))*w*.16;wire(body,'cable.'+i,[[x,-h*.4,-d*.9],[x+.04,-h*.62,-d-.12],[x+(i%2?-.16:.15),-h*.76,-d-.22],[x+.22,-h*.5,-d-.26],[x+.27,-h*.2,-d-.29]],i===0?.024:.012,i%2?mats.tanCable:mats.cable);box(body,'cable.socket.'+i,[.07,.07,.09],[x,-h*.4,-d-.02],mats.dark,.01);}
 return g;
}
