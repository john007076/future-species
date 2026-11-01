import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createMarineFauna} from '../src/species/marine/fauna.js';
test('mechanical fauna retains finite animated anatomy, local signals and complete disposal ownership',()=>{
 const resources=new Set(),keep=value=>(resources.add(value),value),scene=new THREE.Scene(),glass=keep(new THREE.MeshPhysicalMaterial({transmission:.95})),organ=keep(new THREE.MeshStandardMaterial()),chrome=keep(new THREE.MeshStandardMaterial());
 const fauna=createMarineFauna({scene,keep,glass,pink:glass,chrome,brass:chrome,dark:chrome,organ,board:chrome});
 assert.deepEqual(Object.keys(fauna),['whale','shark','angelfish','butterflyfish','tang','algae']);
 for(const root of Object.values(fauna)){
  for(const [time,phase] of [[0,'ENCOUNTER'],[37,'ECHO'],[80,'ESCAPE']]){
   root.userData.animate(time,{phase,phaseTime:.8});let vertices=0;
   root.traverse(object=>{if(!object.isMesh)return;assert.ok(resources.has(object.geometry));const p=object.geometry.attributes.position;vertices+=p.count;assert.ok(p.array.every(Number.isFinite));assert.ok(object.geometry.attributes.normal.array.every(Number.isFinite));assert.ok(Number.isFinite(object.geometry.boundingSphere?.radius));});
   assert.ok(vertices>3000);
  }
  assert.ok(root.children.some(object=>object.isLight));
 }
 for(const resource of resources)resource.dispose();
});
