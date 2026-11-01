import {SPECIES} from './state.js';
export function applyMarineRemoteControl({message,marine,panel,onTelemetry,onChannel}){
 if(message?.targetSession&&message.targetSession!==marine.sessionId)return false;
 if(message?.type==='marineSelect')return marine.selectScreen(message.id);
 if(message?.type==='marineView')return marine.setView(message.patch);
 if(message?.type==='marineOrbit')return marine.orbit(message.dx,message.dy);
 if(message?.type==='marineZoom')return marine.zoom(message.factor);
 if(message?.type==='marineContact')return marine.contact(message.input);
 if(message?.type==='marineListen'){marine.start();return true;}
 if(message?.type==='marineAudioLevel')return marine.setRemoteLevel(message.level);
 if(message?.type==='marineStateRequest'){onTelemetry();return true;}
 if(message?.type==='marineInspect'){if(!Object.hasOwn(SPECIES,message.species))throw new TypeError('Unknown marine species.');panel.inspect(message.species);return true;}
 if(message?.type==='marineCall'){if(message.species!=='auto'&&!Object.hasOwn(SPECIES,message.species))throw new TypeError('Unknown marine species.');return panel.simulate(message.species);}
 if(message?.type==='marineInputDone'){void panel.finishInput();return true;}
 if(message?.type==='marineStop'){panel.stop();return true;}
 if(message?.type==='marineParameters'){marine.setParameters(message.patch);return true;}
 if(message?.type==='marineChannel'&&typeof message.enabled==='boolean'){return onChannel(message.id,message.enabled);}
 return false;
}
export function marineTelemetry(marine,channels,source='installation'){return {type:'marineTelemetry',source,sessionId:marine.sessionId,startedAt:marine.startedAt,state:marine.snapshot(),channels:Object.fromEntries(channels)};}
export function archiveSpeciesAt(u,v){if(!Number.isFinite(u)||!Number.isFinite(v))return null;const x=u*400,y=(1-v)*380;if(x<16||x>=385||y<78||y>=312)return null;const col=Math.floor((x-16)/123),row=Math.floor((y-78)/78);if((x-16)%123>115||(y-78)%78>70)return null;return Object.keys(SPECIES)[row*3+col]||null;}
