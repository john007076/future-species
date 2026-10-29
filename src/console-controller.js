import * as THREE from 'three';
import {box,mesh,rod,screws,instances} from './model-utils.js';

function displayTexture(){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const context=canvas.getContext('2d');
 context.fillStyle='#202a2a';context.fillRect(0,0,512,128);context.fillStyle='#9fb6aa';context.font='17px monospace';context.fillText('SELECTED DISPLAY',24,31);context.fillStyle='#e0e4d4';context.font='26px monospace';context.fillText('04  CENTER MAIN',24,78);context.fillStyle='#d97747';context.fillRect(24,101,78,5);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}

export function createConsoleController(mats){
 const root=new THREE.Group();root.name='instrument.console';root.userData={id:'instrument.console',kind:'instrument',label:'桌面 · 配套触控台'};
 const orange=new THREE.MeshStandardMaterial({color:0xd97845,roughness:.42,metalness:.04});
 box(root,'console.lowerCase',[3.3,.13,1.16],[0,.075,0],mats.cream,.055);
 box(root,'console.topPlate',[3.22,.035,1.08],[0,.155,0],mats.metal,.035);
 for(const x of [-1.08,0,1.08])box(root,'console.panel',[1.01,.018,1.0],[x,.18,0],mats.cream,.018);
 const screenKeys=[];for(let row=0;row<3;row++)for(let col=0;col<4;col++)screenKeys.push({p:[-1.38+col*.20,.213,-.36+row*.18]});
 instances(root,'console.12ChannelKeys',new THREE.BoxGeometry(.145,.055,.125),mats.dark,screenKeys);
 box(root,'console.selectedKey',[.145,.058,.125],[-.48,.215,-.36],orange,.008);
 const lcd=mesh(new THREE.PlaneGeometry(.79,.18),new THREE.MeshBasicMaterial({map:displayTexture(),toneMapped:false}),root,'console.channelReadout',[-1.08,.211,.21]);lcd.rotation.x=-Math.PI/2;lcd.castShadow=false;
 for(let i=0;i<4;i++)box(root,'console.contentKey.'+i,[.18,.05,.12],[-1.38+i*.20,.211,.43],i===3?orange:(i===2?mats.ceramic:mats.dark),.008);
 rod(root,'console.joystick.shaft',[-.29,.2,-.15],[-.28,.40,-.16],.021,mats.metal,16);
 mesh(new THREE.CylinderGeometry(.15,.15,.026,32),mats.dark,root,'console.joystick.boot',[-.29,.20,-.15]);
 mesh(new THREE.SphereGeometry(.078,24,16),orange,root,'console.joystick.ball',[-.28,.415,-.16]);
 box(root,'console.touchpadFrame',[.47,.025,.46],[.24,.204,-.15],mats.dark,.022);
 const perforations=[];for(let x=0;x<6;x++)for(let z=0;z<6;z++)perforations.push({p:[.055+x*.073,.22,-.32+z*.065]});
 instances(root,'console.touchpadPerforations',new THREE.CylinderGeometry(.008,.008,.002,7),mats.metal,perforations);
 rod(root,'console.zoom.track',[.48,.21,-.33],[.48,.21,.08],.008,mats.dark,8);
 box(root,'console.zoom.handle',[.045,.035,.065],[.48,.232,-.1],orange,.006);
 for(let i=0;i<5;i++)box(root,'console.viewKey.'+i,[.145,.05,.12],[-.4+i*.20,.211,.39],i===0||i===4?mats.ceramic:mats.dark,.008);
 for(let i=0;i<3;i++){
  const x=.77+i*.31;
  mesh(new THREE.CylinderGeometry(.112,.112,.025,32),mats.dark,root,'console.knobBezel.'+i,[x,.202,-.20]);
  mesh(new THREE.CylinderGeometry(.087,.09,.12,32),mats.ceramic,root,'console.knob.'+i,[x,.266,-.20]);
  box(root,'console.knobMarker.'+i,[.011,.008,.043],[x,.33,-.222],orange,.002);
  box(root,'console.knobReadout.'+i,[.19,.018,.10],[x,.207,.01],mats.dark,.006);
 }
 box(root,'console.pureViewKey',[.36,.05,.12],[1.08,.211,.38],mats.ceramic,.008);
 screws(root,[[-1.54,.20,-.48],[1.54,.20,-.48],[-1.54,.20,.48],[1.54,.20,.48]],mats.metal,.016);
 box(root,'console.rearPorts',[.55,.07,.025],[.65,.09,-.592],mats.dark,.008);
 return root;
}
