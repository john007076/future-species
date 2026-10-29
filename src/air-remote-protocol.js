export function airTelemetry(state,channels){
 return {type:'airTelemetry',state:{...state,trail:[]},...(channels?{channels:Object.fromEntries(channels)}:{})};
}

export function applyAirRemoteControl({flight,message,onReset,onTelemetry,onViewState}){
 if(!message?.type)return false;
 if(message.type==='airStateRequest'){onTelemetry?.();return true;}
 if(message.type==='airInput'){flight.setInput(message.input);return true;}
 if(message.type==='airRelease'){flight.releaseInput();return true;}
 if(message.type==='airFieldInput'){flight.setFieldInput(message.input);return true;}
 if(message.type==='airFieldRelease'){flight.releaseFieldInput();return true;}
 if(message.type==='airParameters'){flight.setParameters(message.patch);return true;}
 if(message.type==='airViewState'&&typeof message.id==='string'&&typeof message.enabled==='boolean'){onViewState?.(message.id,message.enabled);return true;}
 if(message.type==='airReset')return onReset?.()??true;
 return false;
}
