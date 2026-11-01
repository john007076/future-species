import * as THREE from 'three';

export function createMarineSignalTexture(){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=32;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#000';ctx.fillRect(0,0,512,32);ctx.font='20px "FS Pixel"';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';
 const glyphs='SX80G#@%+:.=~*/';for(let i=0;i<16;i++)ctx.fillText(glyphs[i]||'+',i*32+16,16);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=texture.magFilter=THREE.NearestFilter;texture.generateMipmaps=false;return texture;
}
