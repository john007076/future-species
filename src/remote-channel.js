const CONTROL='future-species:control',STATE='future-species:state';

export function createRemoteChannel({onControl=()=>{},onState=()=>{}}){
 const hot=import.meta.hot,bus='BroadcastChannel'in globalThis?new BroadcastChannel('future-species-remote'):null;
 let socket=null,reconnectTimer=null,closed=false;
 function receive(event,payload){if(event===CONTROL)onControl(payload);if(event===STATE)onState(payload);}
 if(hot){hot.on(CONTROL,onControl);hot.on(STATE,onState);}
 function connect(){
  if(closed||hot||!location.host)return;
  try{
   const next=new WebSocket(`${location.protocol==='https:'?'wss':'ws'}://${location.host}`,'vite-hmr');socket=next;
   next.addEventListener('message',event=>{try{const message=JSON.parse(event.data);if(message.type==='custom')receive(message.event,message.data);}catch{}});
   next.addEventListener('close',()=>{if(socket===next){socket=null;if(!closed)reconnectTimer=setTimeout(connect,1500);}});
   next.addEventListener('error',()=>next.close());
  }catch{reconnectTimer=setTimeout(connect,2000);}
 }
 if(!hot)connect();
 bus?.addEventListener('message',event=>receive(event.data?.event,event.data?.payload));
 function send(event,payload){
  if(hot){hot.send(event,payload);return;}
  if(socket?.readyState===WebSocket.OPEN){socket.send(JSON.stringify({type:'custom',event,data:payload}));return;}
  bus?.postMessage({event,payload});
 }
 return {
  mode:hot?'vite-websocket':'websocket',sendControl:payload=>send(CONTROL,payload),sendState:payload=>send(STATE,payload),
  close(){closed=true;clearTimeout(reconnectTimer);bus?.close();socket?.close();socket=null;},
 };
}
