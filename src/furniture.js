import * as THREE from 'three';
import {mesh,rod,roundedRect} from './model-utils.js';
import {createConsoleController} from './console-controller.js';

export function createTable(mats){
 const root=new THREE.Group();root.name='table';root.userData={id:'table',kind:'table',label:'Transparent control desk'};
 const y=2.39;
 const outline=new THREE.Shape();
 outline.moveTo(-2.05,2.35);outline.bezierCurveTo(-2.20,.7,-2.05,-1.13,0,-1.38);outline.bezierCurveTo(2.05,-1.13,2.20,.7,2.05,2.35);outline.lineTo(1.72,2.32);outline.bezierCurveTo(1.82,.72,1.72,-.18,0,-.22);outline.bezierCurveTo(-1.72,-.18,-1.82,.72,-1.72,2.32);outline.closePath();
 const acrylicGeometry=shape=>new THREE.ExtrudeGeometry(shape,{depth:.035,bevelEnabled:true,bevelSize:.007,bevelThickness:.007,bevelSegments:2,curveSegments:36});
 const top=mesh(acrylicGeometry(outline),mats.glass,root,'table.acrylic',[0,y,0]);top.rotation.x=Math.PI/2;
 const extension=mesh(acrylicGeometry(roundedRect(1.95,1.25,.22)),mats.glass,root,'table.seatExtension',[0,y,.38]);extension.rotation.x=Math.PI/2;
 const edge=new THREE.Line(new THREE.BufferGeometry().setFromPoints(outline.getPoints(100).map(point=>new THREE.Vector3(point.x,y+.003,point.y))),new THREE.LineBasicMaterial({color:0xc9bfab,transparent:true,opacity:.65}));edge.name='table.cutEdge';root.add(edge);
 for(const x of [-1.92,1.92,-1.45,1.45]){const z=Math.abs(x)>1.7?1.57:-.6;rod(root,'table.leg',[x,.06,z],[x,y-.02,z],.025,mats.metal);rod(root,'table.leg.shadow',[x+.016,.08,z+.02],[x+.016,y-.01,z+.02],.008,mats.dark);for(const cy of [.13,.22,2.15,2.31])mesh(new THREE.CylinderGeometry(.047,.047,.042,14),mats.metal,root,'table.leg.collar',[x,cy,z]);mesh(new THREE.CylinderGeometry(.09,.1,.025,18),mats.metal,root,'table.foot',[x,.04,z]);}
 rod(root,'table.rear.brace',[-1.92,.22,-.46],[1.92,.22,-.46],.018,mats.metal);rod(root,'table.rear.rail',[-2,y-.095,-.48],[2,y-.095,-.48],.023,mats.metal);
 for(const x of [-.76,.76]){rod(root,'table.extension.bracket',[x,y-.07,-.52],[x,y-.07,.68],.018,mats.metal);rod(root,'table.extension.support',[x,.08,.48],[x,y-.07,.48],.018,mats.metal);mesh(new THREE.CylinderGeometry(.065,.075,.025,16),mats.metal,root,'table.extension.foot',[x,.04,.48]);}
 const controller=createConsoleController(mats);controller.position.set(0,y+.025,.25);root.add(controller);
 root.position.set(0,-.08,-.45);root.userData.interactables=[controller.name];return{root,items:[controller]};
}
