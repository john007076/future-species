import * as THREE from 'three';
import {createDepthEnvironment} from './environment.js';
export function resonanceEnergy(state){
 const input=Math.max(0,Math.min(1,(state.envelope||state.level||0)/.15));
 const echo=state.phase==='ECHO'?.28+.45*Math.sin((state.phaseTime||0)*3)**2:0;
 return Math.max(input,echo);
}
export function createMarineResonator(){
 const scene=new THREE.Scene(),water=createDepthEnvironment();scene.add(water.mesh);
 const camera=new THREE.PerspectiveCamera(35,800/728,.1,80);camera.position.set(0,0,4.3);
 const count=22000,positions=new Float32Array(count*3),seeds=new Float32Array(count),accents=new Float32Array(count),colors=new Float32Array(count*3);
 const palette=[0x9fcaca,0xc3caa0,0xc5a3b1,0x8ab5c8,0x87aaa5,0xb1a0c4,0xd5ba83,0xc591aa,0xa1c5b5].map(c=>new THREE.Color(c));
 for(let i=0;i<count;i++){
  const seed=((Math.sin(i*127.1+3.7)*43758.5453)%1+1)%1,y=1-2*(i+.5)/count,a=i*2.399963,r=Math.sqrt(1-y*y),radius=.68+.32*Math.pow(seed,.28);
  positions.set([Math.cos(a)*r*radius,y*radius,Math.sin(a)*r*radius],i*3);seeds[i]=seed;accents[i]=i%5===0&&seed>.82?1:0;
  const color=i%5===0?palette[i%9]:new THREE.Color(0xd8e3e7);colors.set([color.r,color.g,color.b],i*3);
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('seed',new THREE.BufferAttribute(seeds,1));geometry.setAttribute('accent',new THREE.BufferAttribute(accents,1));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
 const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,vertexColors:true,uniforms:{time:{value:0},energy:{value:0},influence:{value:0},contact:{value:new THREE.Vector3()}},vertexShader:`
 attribute float seed;attribute float accent;varying vec3 tint;varying float density;uniform float time;uniform float energy;uniform float influence;uniform vec3 contact;
 void main(){vec3 p=position;float fold=sin(p.x*6.+time*.23)*sin(p.y*5.-time*.17)*cos(p.z*7.+time*.13);
 float ridge=sin(p.y*8.+sin(p.x*5.)+time*.19);p*=1.+fold*(.12+influence*.17);p.x+=sin(p.y*4.+time*.21)*(.035+influence*.1);p.y+=cos(p.z*5.-time*.16)*(.04+influence*.1);
 float d=exp(-dot(p.xy-contact.xy,p.xy-contact.xy)*5.);p.z+=d*contact.z*.13;
 p*=min(1.,1.28/max(length(p),.001));vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((1.8+seed*.8+energy*.7)*4.3/-mv.z,1.,4.);
 gl_PointSize*=1.+accent*.7;tint=color*(1.25+energy*.45+accent*.5);density=.5+.48*smoothstep(-.5,.6,ridge+fold);
 }`,fragmentShader:`varying vec3 tint;varying float density;void main(){vec2 p=gl_PointCoord-.5;float a=exp(-dot(p,p)*14.)*density;if(a<.025)discard;gl_FragColor=vec4(tint,a);#include <colorspace_fragment>}`.replace(';#include',';\n#include')});
 const points=new THREE.Points(geometry,material);points.frustumCulled=false;scene.add(points);let energy=0;
 return {scene,camera,update(state){energy=resonanceEnergy(state);material.uniforms.time.value=state.time||0;material.uniforms.energy.value=energy;material.uniforms.influence.value=energy*10;const touch=state.touch;material.uniforms.contact.value.set(touch?.x||0,touch?.y||0,touch?.active?touch.strength:0);camera.position.z=4.3/(state.view?.zoom||1);},diagnostics:()=>({kind:'luminous-granular-organism',particles:count,energy,influence:energy*10,responseGain:10,audioReactive:true,orientationLocked:true}),dispose(){geometry.dispose();material.dispose();water.dispose();scene.clear();}};
}
