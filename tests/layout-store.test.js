import test from 'node:test';
import assert from 'node:assert/strict';
import {normaliseLayout,createLayoutStore} from '../src/layout-store.js';

const screens=[{id:'screen.a',label:'A',position:[1,2,3],rotation:[0,.2,0]}];
const design={'screen.a':{model:'studio-crt',resolution:[640,480]}};
const defaults={mode:'image',brightness:1,saturation:.8,contrast:1,tint:'#dce8e5',scanlines:.1,flip:false};
const hardware=[{id:'cabinet.a',label:'Cabinet',position:[4,2,1],rotation:[0,.5,0]}];

test('screen and hardware defaults stay independent',()=>{
 const layout=normaliseLayout(screens,design,defaults,{},hardware);
 assert.equal(layout.version,2);
 assert.deepEqual(layout.screens['screen.a'].position,[1,2,3]);
 assert.deepEqual(layout.hardware['cabinet.a'].rotation,[0,.5,0]);
 assert.equal(layout.screens['screen.a'].display.flip,false);
});

test('updates preserve the other hardware and persist display flip',()=>{
 const values=new Map(),storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
 const store=createLayoutStore(screens,design,defaults,storage,hardware);
 store.update('cabinet.a',{rotation:[0,1.2,0]});
 store.update('screen.a',{display:{flip:true,brightness:.95}});
 const state=store.snapshot();
 assert.deepEqual(state.hardware['cabinet.a'].rotation,[0,1.2,0]);
 assert.deepEqual(state.screens['screen.a'].position,[1,2,3]);
 assert.equal(state.screens['screen.a'].display.flip,true);
 assert.equal(state.screens['screen.a'].display.brightness,.95);
 const restored=createLayoutStore(screens,design,defaults,storage,hardware).snapshot();
 assert.equal(restored.screens['screen.a'].display.flip,true);
 assert.deepEqual(restored.hardware['cabinet.a'].rotation,[0,1.2,0]);
});

test('invalid imported values are normalised instead of poisoning scene transforms',()=>{
 const layout=normaliseLayout(screens,design,defaults,{screens:{'screen.a':{position:['bad',99,null],display:{brightness:99,tint:'red'}}},hardware:{'cabinet.a':{rotation:[0,99,0]}}},hardware);
 assert.deepEqual(layout.screens['screen.a'].position,[1,30,3]);
 assert.equal(layout.screens['screen.a'].display.brightness,2);
 assert.equal(layout.screens['screen.a'].display.tint,defaults.tint);
 assert.deepEqual(layout.hardware['cabinet.a'].rotation,[0,Math.PI*2,0]);
});
