import test from 'node:test';
import assert from 'node:assert/strict';
import {createDataBridge} from '../src/data-bridge.js';

test('OSC-style addresses preserve complete screen IDs including underscores',()=>{
 const calls=[],bridge=createDataBridge({setDisplay:(...args)=>calls.push(args),setContent:()=>{}});
 bridge.apply({address:'/screen/center_main/brightness',value:.8});
 bridge.apply(JSON.stringify({address:'/screen/left.01/contrast',value:1.1}));
 assert.deepEqual(calls,[['screen.center_main',{brightness:.8}],['screen.left.01',{contrast:1.1}]]);
});

test('JSON display and content messages use independent channels',()=>{
 const displays=[],contents=[],bridge=createDataBridge({setDisplay:(...args)=>displays.push(args),setContent:(...args)=>contents.push(args)});
 bridge.apply({screen:'screen.right.02',display:{flip:true},content:{url:'./live.webp'}});
 assert.deepEqual(displays,[['screen.right.02',{flip:true}]]);
 assert.deepEqual(contents,[['screen.right.02',{url:'./live.webp'}]]);
 assert.throws(()=>bridge.apply({address:'/invalid',value:1}),/Unsupported OSC-style/);
});
