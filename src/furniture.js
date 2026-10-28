import * as THREE from 'three';
import {box,mesh,rod,wire,screws,instances} from './model-utils.js';
function instrument(mats,id,w,h,d,kind){const g=new THREE.Group();g.name=id;g.userData={id,kind:'instrument',label:kind};box(g,'body',[w,h,d],[0,h/2,0],mats.cream,.025);box(g,'face',[w-.035,h-.02,.012],[0,h/2,d/2+.005],mats.metal,.006);for(let i=0;i<5;i++){box(g,'vent.'+i,[w*.12,.009,.008],[-w*.33+i*w*.165,h*.74,d/2+.016],mats.dark,0);}box(g,'slot',[w*.38,.028,.02],[-w*.18,h*.35,d/2+.02],mats.rubber,.005);for(let i=0;i<3;i++){const knob=mesh(new THREE.CylinderGeometry(.028,.03,.028,16),mats.dark,g,'knob.'+i,[w*.16+i*.08,h*.34,d/2+.03]);knob.rotation.x=Math.PI/2;}screws(g,[[-w/2+.04,.04,d/2+.02],[w/2-.04,.04,d/2+.02],[-w/2+.04,h-.04,d/2+.02],[w/2-.04,h-.04,d/2+.02]],mats.metal,.012);return g;}
export function createTable(mats){
 const root=new THREE.Group();root.name='table';root.userData={id:'table',kind:'table',label:'透明操作台'};
 const w=7.1,d=1.22,y=2.39;
 const outline=new THREE.Shape();
 outline.moveTo(-4.10,2.35);outline.bezierCurveTo(-4.35,.7,-3.8,-1.13,0,-1.38);outline.bezierCurveTo(3.8,-1.13,4.35,.7,4.10,2.35);outline.lineTo(3.56,2.32);outline.bezierCurveTo(3.68,.72,3.25,-.18,0,-.22);outline.bezierCurveTo(-3.25,-.18,-3.68,.72,-3.56,2.32);outline.closePath();
 const top=mesh(new THREE.ExtrudeGeometry(outline,{depth:.035,bevelEnabled:true,bevelSize:.007,bevelThickness:.007,bevelSegments:2,curveSegments:36}),mats.glass,root,'table.acrylic',[0,y,0]);top.rotation.x=Math.PI/2;
 const edge=new THREE.Line(new THREE.BufferGeometry().setFromPoints(outline.getPoints(100).map(p=>new THREE.Vector3(p.x,y+.003,p.y))),new THREE.LineBasicMaterial({color:0xc9bfab,transparent:true,opacity:.65}));edge.name='table.cutEdge';root.add(edge);
 for(const x of [-3.46,3.42,-2.48,2.35]){const z=Math.abs(x)>3?1.57:-.6;rod(root,'table.leg',[x,.06,z],[x,y-.02,z],.025,mats.metal);rod(root,'table.leg.shadow',[x+.016,.08,z+.02],[x+.016,y-.01,z+.02],.008,mats.dark);for(const cy of [.13,.22,2.15,2.31]){const ring=mesh(new THREE.CylinderGeometry(.047,.047,.042,14),mats.metal,root,'table.leg.collar',[x,cy,z]);}mesh(new THREE.CylinderGeometry(.09,.1,.025,18),mats.metal,root,'table.foot',[x,.04,z]);}
 rod(root,'table.rear.brace',[-3.46,.22,-.46],[3.42,.22,-.46],.018,mats.metal);rod(root,'table.rear.rail',[-3.5,y-.095,-.48],[3.5,y-.095,-.48],.023,mats.metal);
 const items=[];
 const left=new THREE.Group();left.name='instrument.left.stack';left.userData={id:left.name,kind:'instrument',label:'左侧 · 电子设备堆叠'};root.add(left);left.position.set(-1.8,y+.025,-.59);
 for(let i=0;i<3;i++){const el=instrument(mats,'deck.'+i,.91-i*.05,.085,.55,'磁盘设备');el.position.set(i*.015,i*.09,0);left.add(el)}items.push(left);
 const console=instrument(mats,'instrument.left.console',.91,.09,.42,'左侧 · 扁平控制台');console.position.set(-2.95,y+.025,.03);root.add(console);items.push(console);
 const books=new THREE.Group();books.name='instrument.center.archive';books.userData={id:books.name,kind:'archive',label:'中央 · 书册与磁盘'};books.position.set(.05,y+.024,-.72);root.add(books);items.push(books);
 const colors=[0x9f8e73,0xc4c0a6,0x4b575a,0xc6b599,0xd2c7b2,0x5e4d3c,0xc7b899];for(let i=0;i<7;i++){const book=new THREE.Group();book.name='archive.'+i;book.position.set(Math.sin(i*3)*.045,.023+i*.032,Math.cos(i)*.018);book.rotation.y=Math.sin(i)*.09;books.add(book);const bw=.69-(i>3?.08:0),bd=.44;box(book,'pages',[bw,.023,bd],[0,0,0],mats.paper,.002);const coverMat=new THREE.MeshStandardMaterial({color:colors[i],roughness:.9});for(const yy of [-.013,.013])box(book,'cover',[bw+.022,.006,bd+.012],[0,yy,0],coverMat,.002);box(book,'spine',[bw,.029,.012],[0,0,-bd/2],coverMat,.003);}
 const disk=instrument(mats,'instrument.center.disks',.55,.045,.37,'中央 · 磁盘');disk.position.set(-.49,y+.023,-.6);root.add(disk);items.push(disk);
 const right=instrument(mats,'instrument.right.synth',.78,.27,.56,'右侧 · 旋钮仪器');right.position.set(2.64,y+.025,-.02);root.add(right);items.push(right);
 box(right,'meter.dark',[.26,.075,.01],[-.13,.18,.29],mats.dark,.006);for(const x of [-.2,-.12,-.04])box(right,'meter.tick',[.008,.045,.012],[x,.18,.3],mats.led,.001);
 const pencil=rod(root,'table.stylus',[.6,y+.037,.29],[1.3,y+.037,.22],.012,mats.cream);
 wire(root,'table.patchCable',[[1.32,y+.04,.1],[1.08,y+.052,.2],[.77,y+.04,.05],[1.4,y+.04,-.08],[1.48,y+.16,-.3]],.01,mats.tanCable);
 root.position.set(0,-.08,-.45);root.userData.interactables=items.map(i=>i.name);return{root,items};
}
