import * as THREE from 'three';

// A closed, world-space water field has no card edges when either camera orbits.
export function createDepthEnvironment(){
 const geometry=new THREE.SphereGeometry(45,32,20);
 const material=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{},vertexShader:'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`
 varying vec3 p;
 float h(vec3 q){return fract(sin(dot(q,vec3(127.1,311.7,74.7)))*43758.5453);}
 float n(vec3 q){vec3 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}
 void main(){vec3 d=normalize(p);float depth=smoothstep(-.75,.8,d.y);float cloud=n(d*5.)*.65+n(d*12.)*.23+n(d*27.)*.12;
 vec3 col=mix(vec3(.0015,.004,.013),vec3(.008,.045,.09),depth);col+=vec3(.003,.014,.024)*cloud;
 float shaft=pow(max(0.,sin(d.x*11.+d.z*7.+cloud*.8)),18.)*depth*.12;col+=vec3(.009,.04,.06)*shaft;
 gl_FragColor=vec4(col,1.);#include <colorspace_fragment>
 }`.replace(';#include',';\n#include')});
 const mesh=new THREE.Mesh(geometry,material);mesh.name='continuous-water-environment';mesh.renderOrder=-100;
 return {mesh,dispose(){geometry.dispose();material.dispose();}};
}
