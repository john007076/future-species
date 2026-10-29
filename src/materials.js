import * as THREE from 'three';
import {seeded} from './model-utils.js';
function microTexture(){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d'),im=ctx.createImageData(256,256),random=seeded(2731);for(let i=0;i<im.data.length;i+=4){const v=145+Math.floor(random()*72);im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}ctx.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(4,4);return t;}
export function createMaterials(){const micro=microTexture();return{
 cream:new THREE.MeshPhysicalMaterial({color:0xbeb095,roughness:.47,metalness:.035,bumpMap:micro,bumpScale:.0018,clearcoat:.15,clearcoatRoughness:.4}),
 icePlastic:new THREE.MeshPhysicalMaterial({color:0xb8d5d6,roughness:.3,metalness:.015,transmission:.32,thickness:.12,ior:1.46,clearcoat:.32,clearcoatRoughness:.28,bumpMap:micro,bumpScale:.001}),
 mintPlastic:new THREE.MeshPhysicalMaterial({color:0xb8c9b9,roughness:.43,metalness:.01,transmission:.12,thickness:.08,clearcoat:.18}),
 metal:new THREE.MeshStandardMaterial({color:0x969b9c,roughness:.34,metalness:.9,bumpMap:micro,bumpScale:.0007}),
 dark:new THREE.MeshStandardMaterial({color:0x242a2a,roughness:.48,metalness:.3}),
 rubber:new THREE.MeshStandardMaterial({color:0x121e21,roughness:.85}),
 glass:new THREE.MeshPhysicalMaterial({color:0xf1ead8,roughness:.035,metalness:0,transmission:1,thickness:.022,ior:1.49,clearcoat:.55,clearcoatRoughness:.12,envMapIntensity:.75}),
 smokeGlass:new THREE.MeshPhysicalMaterial({color:0x91afb0,roughness:.08,metalness:0,transmission:.92,thickness:.07,ior:1.49,clearcoat:.35,envMapIntensity:.8}),
 frostedGlass:new THREE.MeshPhysicalMaterial({color:0xd6e3dc,roughness:.34,metalness:0,transmission:.72,thickness:.055,ior:1.47,clearcoat:.18,envMapIntensity:.65}),
 crtGlass:new THREE.MeshPhysicalMaterial({color:0xc3d5d1,roughness:.12,metalness:0,transmission:.96,thickness:.035,ior:1.52,clearcoat:.3,clearcoatRoughness:.16,envMapIntensity:.4}),
 cable:new THREE.MeshStandardMaterial({color:0x202522,roughness:.6}),
 tanCable:new THREE.MeshStandardMaterial({color:0x92836a,roughness:.61,metalness:.12}),
 copper:new THREE.MeshStandardMaterial({color:0x9d7852,roughness:.42,metalness:.8}),
 board:new THREE.MeshStandardMaterial({color:0x455f53,roughness:.67,metalness:.12}),
 ceramic:new THREE.MeshStandardMaterial({color:0xd7d1bd,roughness:.72}),
 amber:new THREE.MeshStandardMaterial({color:0xe5bf83,emissive:0xffaa51,emissiveIntensity:.8,roughness:.35}),
 led:new THREE.MeshStandardMaterial({color:0xaabec1,emissive:0x8acbda,emissiveIntensity:.6}),
 paper:new THREE.MeshStandardMaterial({color:0xc5bfae,roughness:.91}),
};}
