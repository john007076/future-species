import * as THREE from 'three';
import {box,mesh,rod,screws,instances} from './model-utils.js';

function canvasTexture(width,height,draw){
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 draw(canvas.getContext('2d'));
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}
function displayTexture(){return canvasTexture(512,128,context=>{
 context.fillStyle='#05090d';context.fillRect(0,0,512,128);
 context.fillStyle='#82978a';context.font='15px "FS Pixel"';context.fillText('ACTIVE CHANNEL',24,28);
 context.fillStyle='#e0e8d7';context.font='27px "FS Pixel"';context.fillText('01  AIR FLIGHT',24,76);
 context.fillStyle='#f1521b';context.fillRect(24,101,72,4);
});}
function keyLegendTexture(){return canvasTexture(400,300,context=>{
 context.textAlign='center';context.textBaseline='middle';context.font='22px "FS Pixel"';
 for(let row=0;row<3;row++)for(let col=0;col<4;col++){
  const index=row*4+col;context.fillStyle=index===0?'#fff3e4':'#d8ded5';
  context.fillText(String(index+1).padStart(2,'0'),50+col*100,50+row*100);
 }
});}
function cable(root,name,points,material){
 const curve=new THREE.CatmullRomCurve3(points.map(point=>new THREE.Vector3(...point)));
 return mesh(new THREE.TubeGeometry(curve,56,.018,8,false),material,root,name);
}

export function createConsoleController(mats){
 const root=new THREE.Group();root.name='instrument.console';root.userData={id:'instrument.console',kind:'instrument',label:'DESK / REMOTE CONSOLE'};
 const powder=new THREE.MeshStandardMaterial({color:0xdde0d8,roughness:.72,metalness:.06});
 const orange=new THREE.MeshStandardMaterial({color:0xf1521b,roughness:.48,metalness:.02});
 box(root,'console.lowerCase',[3.3,.13,1.16],[0,.075,0],powder,.025);
 box(root,'console.topPlate',[3.22,.035,1.08],[0,.155,0],powder,.014);
 box(root,'console.frontTrim',[3.08,.022,.018],[0,.115,.579],mats.dark,.003);
 for(const x of [-1.08,0,1.08])box(root,'console.panel',[1.01,.018,1.0],[x,.18,0],powder,.008);
 const screenKeys=[];for(let row=0;row<3;row++)for(let col=0;col<4;col++)screenKeys.push({p:[-1.38+col*.20,.213,-.36+row*.18]});
 instances(root,'console.12ChannelKeys',new THREE.BoxGeometry(.145,.055,.125),mats.dark,screenKeys);
 box(root,'console.selectedKey',[.145,.058,.125],[-1.38,.218,-.36],orange,.003);
 const legends=mesh(new THREE.PlaneGeometry(.79,.54),new THREE.MeshBasicMaterial({map:keyLegendTexture(),transparent:true,depthWrite:false,toneMapped:false}),root,'console.channelLegends',[-1.08,.248,-.18]);legends.rotation.x=-Math.PI/2;legends.castShadow=false;
 const lcd=mesh(new THREE.PlaneGeometry(.79,.18),new THREE.MeshBasicMaterial({map:displayTexture(),toneMapped:false}),root,'console.channelReadout',[-1.08,.211,.21]);lcd.rotation.x=-Math.PI/2;lcd.castShadow=false;
 for(let i=0;i<4;i++)box(root,'console.contentKey.'+i,[.18,.05,.12],[-1.38+i*.20,.211,.43],i===3?orange:(i===2?mats.ceramic:mats.dark),.003);
 rod(root,'console.joystick.shaft',[-.29,.2,-.15],[-.28,.40,-.16],.021,mats.metal,16);
 mesh(new THREE.CylinderGeometry(.15,.15,.026,32),mats.dark,root,'console.joystick.boot',[-.29,.20,-.15]);
 mesh(new THREE.SphereGeometry(.078,24,16),orange,root,'console.joystick.ball',[-.28,.415,-.16]);
 box(root,'console.touchpadFrame',[.47,.025,.46],[.24,.204,-.15],mats.dark,.008);
 const perforations=[];for(let x=0;x<6;x++)for(let z=0;z<6;z++)perforations.push({p:[.055+x*.073,.22,-.32+z*.065]});
 instances(root,'console.touchpadPerforations',new THREE.CylinderGeometry(.008,.008,.002,7),mats.metal,perforations);
 rod(root,'console.zoom.track',[.48,.21,-.33],[.48,.21,.08],.008,mats.dark,8);
 box(root,'console.zoom.handle',[.045,.035,.065],[.48,.232,-.1],orange,.003);
 for(let i=0;i<5;i++)box(root,'console.viewKey.'+i,[.145,.05,.12],[-.4+i*.20,.211,.39],i===0||i===4?mats.ceramic:mats.dark,.003);
 for(let i=0;i<3;i++){
  const x=.77+i*.31;
  mesh(new THREE.CylinderGeometry(.112,.112,.025,32),mats.dark,root,'console.knobBezel.'+i,[x,.202,-.20]);
  mesh(new THREE.CylinderGeometry(.087,.09,.12,32),mats.ceramic,root,'console.knob.'+i,[x,.266,-.20]);
  box(root,'console.knobMarker.'+i,[.011,.008,.043],[x,.33,-.222],orange,.002);
  box(root,'console.knobReadout.'+i,[.19,.018,.10],[x,.207,.01],mats.dark,.003);
 }
 box(root,'console.pureViewKey',[.36,.05,.12],[1.08,.211,.38],mats.ceramic,.003);
 box(root,'console.sideAction',[.035,.06,.22],[1.655,.105,.25],orange,.003);
 screws(root,[[-1.54,.20,-.48],[1.54,.20,-.48],[-1.54,.20,.48],[1.54,.20,.48]],mats.metal,.016);
 box(root,'console.rearPorts',[.55,.07,.025],[.65,.09,-.592],mats.dark,.003);
 box(root,'console.orangePort',[.12,.07,.06],[.48,.09,-.62],orange,.004);
 box(root,'console.blackPort',[.12,.07,.06],[.78,.09,-.62],mats.rubber,.004);
 cable(root,'console.orangeLead',[[.48,.09,-.65],[.48,.05,-.84],[.74,.01,-1.02],[1.22,-.02,-.94],[1.48,-.02,-.64]],orange);
 cable(root,'console.blackLead',[[.78,.09,-.65],[.78,.04,-.92],[1.02,-.01,-1.2],[1.52,-.03,-1.26]],mats.cable);
 const led=new THREE.MeshStandardMaterial({color:0xf1521b,emissive:0xf1521b,emissiveIntensity:.65,roughness:.4});
 mesh(new THREE.SphereGeometry(.015,12,8),led,root,'console.statusLed',[-1.52,.226,.43]);
 return root;
}
