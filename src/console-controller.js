import * as THREE from 'three';
import {box,mesh,rod,screws,instances} from './model-utils.js';
import {INSTRUMENT_VARIANTS,CONSOLE_GRID} from './instrument-spec.js';

function canvasTexture(width,height,draw){
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 draw(canvas.getContext('2d'));
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}
function displayTexture(spec){return canvasTexture(1024,128,context=>{
 context.fillStyle='#05090d';context.fillRect(0,0,1024,128);
 context.fillStyle='#82978a';context.font='15px "FS Pixel"';context.fillText('ACTIVE CHANNEL',28,28);
 context.fillStyle='#e0e8d7';context.font='25px "FS Pixel"';context.fillText(spec.readout,28,78);
 context.fillStyle='#f1521b';context.fillRect(28,101,72,4);
 context.textAlign='right';context.fillStyle='#dce7dc';context.font='23px "FS Pixel"';context.fillText('MAIN DISPLAY ONLINE',992,76);
});}
function brandTexture(spec){return canvasTexture(768,160,context=>{
 context.fillStyle='#252a27';context.font='48px Arial';context.fillText(spec.title,12,60);
 context.fillStyle='#8d5c48';context.font='16px Arial';context.fillText(spec.subtitle,14,91);
 context.fillStyle='#4e5750';context.font='17px Arial';context.fillText(spec.model,14,137);
});}
function portTexture(label){return canvasTexture(256,64,context=>{
 context.fillStyle='#252a27';context.textAlign='center';context.textBaseline='middle';context.font='16px Arial';context.fillText(label,128,32);
});}
function keyLegendTexture(selected){return canvasTexture(400,300,context=>{
 context.textAlign='center';context.textBaseline='middle';context.font='22px "FS Pixel"';
 for(let row=0;row<CONSOLE_GRID.rows;row++)for(let col=0;col<CONSOLE_GRID.columns;col++){
  const index=row*CONSOLE_GRID.columns+col;context.fillStyle=index===selected?'#fff3e4':'#d8ded5';
  context.fillText(String(index+1).padStart(2,'0'),50+col*100,50+row*100);
 }
});}
function cable(root,name,points,material){
 const curve=new THREE.CatmullRomCurve3(points.map(point=>new THREE.Vector3(...point)));
 return mesh(new THREE.TubeGeometry(curve,128,.018,8,false),material,root,name);
}

export function createConsoleController(mats){
 const spec=INSTRUMENT_VARIANTS.main,root=new THREE.Group();root.name='instrument.console';root.userData={id:'instrument.console',kind:'instrument',label:'DESK / REMOTE CONSOLE'};
 const powder=new THREE.MeshStandardMaterial({color:0xdde0d8,roughness:.72,metalness:.06});
 const orange=new THREE.MeshStandardMaterial({color:0xf1521b,roughness:.48,metalness:.02});
 box(root,'console.lowerCase',[3.3,.13,1.7],[0,.075,0],powder,.025);
 box(root,'console.topPlate',[3.22,.035,1.62],[0,.155,0],powder,.014);
 box(root,'console.frontTrim',[3.08,.022,.018],[0,.115,.849],mats.dark,.003);
 for(const x of [-1.08,0,1.08])box(root,'console.panel',[1.01,.018,1.0],[x,.18,.27],powder,.008);
 for(let i=0;i<spec.ports.length;i++){
  const x=-1.2+i*.60;box(root,'console.topPort.'+i,[.59,.025,.12],[x,.196,-.75],i===1?orange:(i===2?mats.dark:mats.ceramic),.002);
  const label=mesh(new THREE.PlaneGeometry(.48,.07),new THREE.MeshBasicMaterial({map:portTexture(spec.ports[i]),transparent:true,depthWrite:false,toneMapped:false}),root,'console.portLabel.'+i,[x,.211,-.75]);label.rotation.x=-Math.PI/2;label.castShadow=false;
 }
 const brand=mesh(new THREE.PlaneGeometry(1.65,.34),new THREE.MeshBasicMaterial({map:brandTexture(spec),transparent:true,depthWrite:false,toneMapped:false}),root,'console.brand',[-.68,.211,-.48]);brand.rotation.x=-Math.PI/2;brand.castShadow=false;
 const speaker=[];for(let x=0;x<12;x++)for(let z=0;z<4;z++)speaker.push({p:[.18+x*.108,.208,-.60+z*.075]});
 instances(root,'console.speakerPerforations',new THREE.CylinderGeometry(.013,.013,.003,10),mats.dark,speaker);
 const lcd=mesh(new THREE.PlaneGeometry(2.96,.20),new THREE.MeshBasicMaterial({map:displayTexture(spec),toneMapped:false}),root,'console.channelReadout',[0,.213,-.17]);lcd.rotation.x=-Math.PI/2;lcd.castShadow=false;
 const screenKeys=[];for(let row=0;row<CONSOLE_GRID.rows;row++)for(let col=0;col<CONSOLE_GRID.columns;col++){
  const index=row*CONSOLE_GRID.columns+col;if(index===spec.selected)continue;
  screenKeys.push({p:[CONSOLE_GRID.startX+col*CONSOLE_GRID.stepX,.213,CONSOLE_GRID.startZ+row*CONSOLE_GRID.stepZ]});
 }
 instances(root,'console.12ChannelKeys',new THREE.BoxGeometry(.145,.055,.125),mats.dark,screenKeys);
 const selectedX=CONSOLE_GRID.startX+(spec.selected%CONSOLE_GRID.columns)*CONSOLE_GRID.stepX,selectedZ=CONSOLE_GRID.startZ+Math.floor(spec.selected/CONSOLE_GRID.columns)*CONSOLE_GRID.stepZ;
 box(root,'console.selectedKey',[.145,.058,.125],[selectedX,.218,selectedZ],orange,.003);
 const legends=mesh(new THREE.PlaneGeometry(.79,.54),new THREE.MeshBasicMaterial({map:keyLegendTexture(spec.selected),transparent:true,depthWrite:false,toneMapped:false}),root,'console.channelLegends',[-1.08,.254,.26]);legends.rotation.x=-Math.PI/2;legends.castShadow=false;
 for(let i=0;i<4;i++)box(root,'console.contentKey.'+i,[.18,.05,.12],[-1.38+i*.20,.211,.66],i===3?orange:(i===2?mats.ceramic:mats.dark),.003);
 rod(root,'console.joystick.shaft',[-.29,.2,.22],[-.28,.40,.21],.021,mats.metal,16);
 mesh(new THREE.CylinderGeometry(.15,.15,.026,32),mats.dark,root,'console.joystick.boot',[-.29,.20,.22]);
 mesh(new THREE.SphereGeometry(.078,24,16),orange,root,'console.joystick.ball',[-.28,.415,.21]);
 box(root,'console.touchpadFrame',[.47,.025,.46],[.24,.204,.22],mats.dark,.008);
 const perforations=[];for(let x=0;x<6;x++)for(let z=0;z<6;z++)perforations.push({p:[.055+x*.073,.22,.05+z*.065]});
 instances(root,'console.touchpadPerforations',new THREE.CylinderGeometry(.008,.008,.002,7),mats.metal,perforations);
 rod(root,'console.zoom.track',[.48,.21,.04],[.48,.21,.45],.008,mats.dark,8);
 box(root,'console.zoom.handle',[.045,.035,.065],[.48,.232,.27],orange,.003);
 for(let i=0;i<5;i++)box(root,'console.viewKey.'+i,[.145,.05,.12],[-.4+i*.20,.211,.64],i===0||i===4?mats.ceramic:mats.dark,.003);
 for(let i=0;i<3;i++){
  const x=.77+i*.31;
  mesh(new THREE.CylinderGeometry(.112,.112,.025,32),mats.dark,root,'console.knobBezel.'+i,[x,.202,.22]);
  mesh(new THREE.CylinderGeometry(.087,.09,.12,32),mats.ceramic,root,'console.knob.'+i,[x,.266,.22]);
  box(root,'console.knobMarker.'+i,[.011,.008,.043],[x,.33,.198],orange,.002);
  box(root,'console.knobReadout.'+i,[.19,.018,.10],[x,.207,.43],mats.dark,.003);
 }
 box(root,'console.pureViewKey',[.36,.05,.12],[1.08,.211,.66],mats.ceramic,.003);
 box(root,'console.sideAction',[.035,.06,.22],[1.655,.105,.42],orange,.003);
 screws(root,[[-1.54,.20,-.75],[1.54,.20,-.75],[-1.54,.20,.75],[1.54,.20,.75]],mats.metal,.016);
 box(root,'console.rearPorts',[.55,.07,.025],[.65,.09,-.862],mats.dark,.003);
 box(root,'console.orangePort',[.12,.07,.06],[.48,.09,-.89],orange,.004);
 box(root,'console.blackPort',[.12,.07,.06],[.78,.09,-.89],mats.rubber,.004);
 cable(root,'console.orangeLead',[[.48,.09,-.92],[.52,.03,-1.02],[.86,-.08,-1.04],[1.36,-.24,-.90],[1.48,-.85,-.84],[1.47,-1.72,-.82],[1.50,-2.30,-.80],[1.82,-2.335,-.48],[2.12,-2.335,-.08],[1.92,-2.335,.30],[1.46,-2.335,.42],[1.18,-2.335,.12]],orange);
 cable(root,'console.blackLead',[[.78,.09,-.92],[.82,.02,-1.07],[1.12,-.12,-1.04],[1.42,-.38,-.94],[1.44,-1.22,-.89],[1.43,-2.29,-.88],[1.65,-2.335,-.64],[1.98,-2.335,-.36],[1.82,-2.335,.02],[1.40,-2.335,.12],[1.08,-2.335,-.10]],mats.cable);
 const led=new THREE.MeshStandardMaterial({color:0xf1521b,emissive:0xf1521b,emissiveIntensity:.65,roughness:.4});
 mesh(new THREE.SphereGeometry(.015,12,8),led,root,'console.statusLed',[-1.42,.228,-.17]);
 return root;
}
