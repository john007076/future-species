import test from 'node:test';
import assert from 'node:assert/strict';
import {displayNavigationTarget} from '../src/display-navigation.js';
test('all display pages share AIR, MARINE and main-home navigation targets',()=>{
 assert.equal(displayNavigationTarget({type:'openAirViews'}),'./air.html');
 assert.equal(displayNavigationTarget({type:'openMarineViews'}),'./marine.html');
 assert.equal(displayNavigationTarget({type:'openMainDisplay'}),'./');
 for(const message of [null,{}, {type:'__proto__'},{type:'constructor'},{type:'openMarineViews',url:'https://untrusted.invalid'}]){
  assert.equal(displayNavigationTarget(message),message?.type==='openMarineViews'?'./marine.html':null);
 }
});
