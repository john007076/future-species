import * as THREE from 'three';

export function createMarineOptics({scanMap}={}){
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,0,2);camera.position.z=1;
 const material=new THREE.ShaderMaterial({depthTest:false,depthWrite:false,toneMapped:false,uniforms:{scanMap:{value:scanMap},source:{value:null},pixel:{value:new THREE.Vector2()},time:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`
 uniform sampler2D source;uniform sampler2D scanMap;uniform vec2 pixel;uniform float time;varying vec2 vUv;
 float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){
 vec2 uv=vUv;vec3 col=texture2D(source,uv).rgb;vec3 light=vec3(0.);
 for(int i=0;i<12;i++){float a=float(i)*2.39996;float r=2.+sqrt(float(i))*3.3;vec3 s=texture2D(source,uv+vec2(cos(a),sin(a))*pixel*r).rgb;float l=dot(s,vec3(.2126,.7152,.0722));light+=s*smoothstep(.22,.75,l)*exp(-r*r/180.)/5.8;}
 col+=light*.65;
 vec2 cellSize=vec2(12.,16.);vec2 cell=floor(gl_FragCoord.xy/cellSize);vec2 center=(cell+.5)*cellSize*pixel;
 vec3 sampleColor=texture2D(source,center).rgb;float luminance=dot(sampleColor,vec3(.2126,.7152,.0722));
 float mask=smoothstep(.065,.22,luminance);
 float region=hash(floor(cell/vec2(4.,5.)));float cluster=smoothstep(.4,.66,sin(center.x*11.+center.y*16.+time*.13)+region*.65);
 float glyphIndex=mod(floor(luminance*15.)+floor(hash(cell)*6.),16.);vec2 letter=fract(gl_FragCoord.xy/cellSize);
 float glyph=texture2D(scanMap,vec2((glyphIndex+letter.x)/16.,1.-letter.y)).r;
 float ink=glyph*mask*cluster*.72;
 col+=vec3(.12,.46,.85)*mask*cluster*.09;col=mix(col,mix(vec3(.36,.78,1.),vec3(1.,.77,.73),hash(cell)*.55),ink);
 float paperTile=step(.985,region)*mask*.12;col=mix(col,vec3(.5,.72,.95),paperTile);
 col=mix(vec3(dot(col,vec3(.2126,.7152,.0722))),col,.72);
 col*=.94+.06*sin(gl_FragCoord.y*3.14159);
 col=floor(col*128.+hash(gl_FragCoord.xy)*.22)/128.;
 col*=1.-.23*pow(length((uv-.5)*1.3),2.);
 float grain=hash(gl_FragCoord.xy*.73+floor(time*8.))-.5;float silver=hash(floor(gl_FragCoord.xy/2.)+13.)-.5;col+=vec3(grain*.009+silver*.003);
 gl_FragColor=vec4(col,1.);
 #include <colorspace_fragment>
 }`});
 const geometry=new THREE.PlaneGeometry(2,2);scene.add(new THREE.Mesh(geometry,material));
 return {render(renderer,source,target,time){material.uniforms.source.value=source.texture;material.uniforms.pixel.value.set(1/source.width,1/source.height);material.uniforms.time.value=time;renderer.setRenderTarget(target);renderer.render(scene,camera);},dispose(){geometry.dispose();material.dispose();}};
}
