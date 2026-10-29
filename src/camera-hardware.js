import * as THREE from 'three';
import {box,mesh,rod,screws} from './model-utils.js';

function rippleMaterial(source){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const context=canvas.getContext('2d'),image=context.createImageData(256,256);
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){const index=(y*256+x)*4,value=128+Math.sin(y*.25+Math.sin(x*.045)*2.4)*45;image.data[index]=image.data[index+1]=image.data[index+2]=value;image.data[index+3]=255;}
 context.putImageData(image,0,0);const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(2,1);
 const material=source.clone();material.bumpMap=texture;material.bumpScale=.006;material.color.set(0xd6d8cd);material.roughness=.36;return material;
}

export function createCameraHardware(mats){
 const root=new THREE.Group();root.name='camera.upper_center';root.userData={id:'camera.upper_center',kind:'camera',label:'顶部 · 双镜头摄像头'};
 const bodyMaterial=rippleMaterial(mats.cream);
 box(root,'camera.leftModule',[.43,.25,.27],[-.225,0,0],bodyMaterial,.035);
 box(root,'camera.rightModule',[.43,.25,.27],[.225,0,0],bodyMaterial,.035);
 box(root,'camera.centerBridge',[.08,.22,.25],[0,0,-.005],mats.cream,.018);
 const lens=(x,r)=>{
  const barrel=mesh(new THREE.CylinderGeometry(r*1.16,r*1.16,.055,28),mats.metal,root,'camera.lensBarrel',[x,0,.16]);barrel.rotation.x=Math.PI/2;
  const glass=mesh(new THREE.CylinderGeometry(r,r,.058,32),mats.rubber,root,'camera.lensGlass',[x,0,.177]);glass.rotation.x=Math.PI/2;
  mesh(new THREE.TorusGeometry(r*1.06,.009,8,32),mats.metal,root,'camera.lensRing',[x,0,.209]);
  const reflection=mesh(new THREE.CircleGeometry(r*.28,16),mats.led,root,'camera.lensReflection',[x-r*.22,r*.25,.209]);reflection.castShadow=false;
 };
 lens(-.31,.052);lens(.31,.052);lens(0,.032);
 const status=mesh(new THREE.SphereGeometry(.012,10,8),mats.led,root,'camera.status',[.15,.065,.145]);status.castShadow=false;
 screws(root,[[-.4,-.085,.145],[-.4,.085,.145],[.4,-.085,.145],[.4,.085,.145]],mats.metal,.012);
 box(root,'camera.rearCablePort',[.12,.07,.035],[.23,0,-.15],mats.dark,.012);
 rod(root,'camera.gimbal.stem',[0,-.12,0],[0,-.24,0],.035,mats.metal);
 const hinge=mesh(new THREE.CylinderGeometry(.065,.065,.105,24),mats.cream,root,'camera.gimbal.hinge',[0,-.23,0]);hinge.rotation.z=Math.PI/2;
 box(root,'camera.gimbal.mount',[.18,.035,.15],[0,-.30,0],mats.metal,.015);
 rod(root,'camera.railClamp',[0,.12,-.04],[0,.23,-.16],.022,mats.metal);
 box(root,'camera.railClamp.shoe',[.12,.055,.11],[0,.23,-.16],mats.metal,.012);
 return root;
}
