export const MARINE_SCREEN_IDS = Object.freeze(['screen.upper_right', 'screen.right.01', 'screen.right.02', 'screen.right.03']);
// Archive names describe fictional future organisms, not biological taxonomy.
export const SPECIES = Object.freeze({
  jelly: Object.freeze({name: 'Echo medusa', code: 'MR–01'}),
  fish: Object.freeze({name: 'Vitreous fish', code: 'MR–02'}),
  mollusc: Object.freeze({name: 'Saline mollusc', code: 'MR–03'}),
  whale: Object.freeze({name: 'Sperm whale', code: 'MR–04'}),
  shark: Object.freeze({name: 'Shark', code: 'MR–05'}),
  angelfish: Object.freeze({name: 'Angelfish', code: 'MR–06'}),
  butterflyfish: Object.freeze({name: 'Butterflyfish', code: 'MR–07'}),
  tang: Object.freeze({name: 'Tang', code: 'MR–08'}),
  algae: Object.freeze({name: 'Mnemonic kelp', code: 'MR–09'}),
});
const SPECIES_WEIGHTS = [['jelly', .18], ['fish', .12], ['mollusc', .1], ['whale', .13], ['shark', .12], ['angelfish', .1], ['butterflyfish', .09], ['tang', .09], ['algae', .07]];
const DURATIONS = {IDLE: 0, LISTENING: 0, SIGNAL_DETECTED: .06, APPROACH: 1.6, ENCOUNTER: .7, ECHO: 3, ESCAPE: .9, COOLDOWN: 4};
const NEXT = {SIGNAL_DETECTED: 'APPROACH', APPROACH: 'ENCOUNTER', ENCOUNTER: 'ECHO', ECHO: 'ESCAPE', ESCAPE: 'COOLDOWN', COOLDOWN: 'LISTENING'};
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
function finite(value, label) { if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${label} must be finite.`); return value; }

export function createMarineState({random = Math.random} = {}) {
  if (typeof random !== 'function') throw new TypeError('random must be a function.');
  const sessionId=globalThis.crypto?.randomUUID?.()||`marine-${Date.now()}-${Math.random()}`,startedAt=Date.now();
  const state = {phase: 'IDLE', inspecting: false, selectedScreen:'screen.upper_right', view:{yaw:0,pitch:0,zoom:1}, touch:{x:0,y:0,strength:0,active:false}, time: 0, phaseTime: 0, duration: 0, progress: 0, species: 'jelly', encounterCount: 0, level: 0, envelope: 0, threshold: .018, hold: .06, signalTime: 0, armed: true};
  state.viewStates=Object.fromEntries(MARINE_SCREEN_IDS.map(id=>[id,{yaw:0,pitch:0,zoom:1}]));state.view=state.viewStates[state.selectedScreen];
  let quietTime = 0, high = false,remoteLevel=0,remoteHold=0,remoteUntil=0;
  function enter(phase) {
    Object.assign(state, {phase, phaseTime: 0, duration: DURATIONS[phase], progress: 0, signalTime: 0});
    high = false;
    if (phase === 'LISTENING') quietTime = 0;
  }
  function chooseSpecies() {
    const weights = SPECIES_WEIGHTS.filter(([id]) => id!=='algae'&&(!state.encounterCount || id !== state.species));
    const total = weights.reduce((sum, [, weight]) => sum + weight, 0);
    let value = clamp(finite(random(), 'random result'), 0, .999999) * total;
    for (const [id, weight] of weights) { value -= weight; if (value < 0) return id; }
    return weights.at(-1)[0];
  }
  function call(species = 'auto') {
    if (typeof species !== 'string' || (species !== 'auto' && !Object.hasOwn(SPECIES, species))) throw new TypeError('Unknown marine species.');
    if (!['IDLE', 'LISTENING'].includes(state.phase)) return false;
    state.species = species === 'auto' ? chooseSpecies() : species;
    state.inspecting = false; state.encounterCount++;
    state.armed = false;
    enter('SIGNAL_DETECTED');
    return true;
  }
  function start() { state.inspecting=false; if (state.phase === 'IDLE') { state.armed = true; enter('LISTENING'); } return state; }
  function stop() { remoteLevel=remoteHold=0;state.touch.active=false;state.touch.strength=0;state.inspecting=false; enter('IDLE'); Object.assign(state, {level: 0, envelope: 0, armed: true}); quietTime = 0; return state; }
  function setParameters(patch) {
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) throw new TypeError('parameters must be an object.');
    const next = {};
    for (const [key, value] of Object.entries(patch)) {
      if (!['threshold', 'hold'].includes(key)) throw new TypeError(`Unknown MARINE parameter: ${key}`);
      next[key] = key === 'threshold' ? clamp(finite(value, key), .005, .3) : clamp(finite(value, key), .04, 1.5);
    }
    Object.assign(state, next); state.signalTime = 0; high = false;
    return {threshold: state.threshold, hold: state.hold};
  }
  function step(dt, level = 0) {
    finite(dt, 'dt'); finite(level, 'level');
    if (dt < 0) throw new RangeError('dt must not be negative.');
    dt = Math.min(dt, .1);
    state.time += dt; state.phaseTime += dt;
    remoteHold=Math.max(0,remoteHold-dt);
    state.level = clamp(Math.max(level,remoteHold>0&&Date.now()<remoteUntil?remoteLevel:0), 0, 1);
    state.envelope += (state.level - state.envelope) * (1 - Math.exp(-dt * (state.level > state.envelope ? 22 : 8)));
    if (state.phase === 'LISTENING') {
      const low = state.threshold * .62;
      if (state.level < low) {
        high = false; state.signalTime = 0; quietTime += dt;
        if (quietTime >= .4) state.armed = true;
      } else {
        quietTime = 0;
        if (state.level >= state.threshold) high = true;
        if (state.armed && high) state.signalTime += dt;
        if (state.armed && state.signalTime + 1e-9 >= state.hold) call();
      }
    } else {
      state.signalTime = 0;
      if (state.duration && state.phaseTime + 1e-9 >= state.duration) enter(NEXT[state.phase]);
    }
    state.progress = state.duration ? clamp(state.phaseTime / state.duration, 0, 1) : 0;
    return state;
  }
  function setView(patch){
    if(!patch||typeof patch!=='object'||Array.isArray(patch))throw new TypeError('Invalid view.');
    const next={};for(const [key,value] of Object.entries(patch)){if(!['yaw','pitch','zoom'].includes(key))throw new TypeError('Unknown view parameter.');finite(value,key);next[key]=key==='zoom'?clamp(value,.55,2.2):key==='pitch'?clamp(value,-1.15,1.15):clamp(value,-Math.PI,Math.PI);}if(state.selectedScreen==='screen.right.01'){delete next.yaw;delete next.pitch;}if(state.selectedScreen==='screen.right.03'){delete next.yaw;delete next.pitch;delete next.zoom;}Object.assign(state.view,next);return {...state.view};
  }
  function orbit(dx,dy){finite(dx,'orbit x');finite(dy,'orbit y');return setView({yaw:Math.atan2(Math.sin(state.view.yaw+clamp(dx,-.5,.5)),Math.cos(state.view.yaw+clamp(dx,-.5,.5))),pitch:state.view.pitch+clamp(dy,-.5,.5)});}
  function zoom(factor){finite(factor,'zoom factor');if(factor<=0)throw new RangeError('Zoom factor must be positive.');return setView({zoom:state.view.zoom*clamp(factor,.5,2)});}
  function contact(input){if(!input||typeof input.active!=='boolean')throw new TypeError('Invalid contact.');const next={x:clamp(finite(input.x??0,'contact x'),-1,1),y:clamp(finite(input.y??0,'contact y'),-1,1),strength:clamp(finite(input.strength??.7,'contact strength'),0,1),active:input.active};if(!next.active)next.strength=0;if(state.selectedScreen==='screen.right.03')return {...state.touch};Object.assign(state.touch,next);return {...state.touch};}
  function setRemoteLevel(level){finite(level,'remote level');if(state.phase==='IDLE')return false;remoteLevel=clamp(level,0,1);remoteHold=.5;remoteUntil=Date.now()+500;return true;}
  function selectScreen(id){if(!MARINE_SCREEN_IDS.includes(id))throw new TypeError('Unknown marine screen.');if(id==='screen.right.03'){state.touch.active=false;state.touch.strength=0;}state.selectedScreen=id;state.view=state.viewStates[id];return id;}
  function inspect(species){if(!Object.hasOwn(SPECIES,species))throw new TypeError('Unknown marine species.');stop();state.species=species;state.inspecting=true;return state;}
  return {sessionId,startedAt,state, step, start, stop, call, inspect, selectScreen,setView,orbit,zoom,contact,setRemoteLevel,setParameters, snapshot: () => ({...state,viewStates:Object.fromEntries(Object.entries(state.viewStates).map(([id,v])=>[id,{...v}])),view:{...state.view},touch:{...state.touch}})};
}
