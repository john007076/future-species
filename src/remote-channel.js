const CONTROL='future-species:control',STATE='future-species:state';

export function createRemoteChannel({onControl=()=>{},onState=()=>{}}){
 const hot=import.meta.hot,bus='BroadcastChannel'in globalThis?new BroadcastChannel('future-species-remote'):null;
 let socket=null;
 function receive(event,payload){if(event===CONTROL)onControl(payload);if(event===STATE)onState(payload);}
 if(hot){hot.on(CONTROL,onControl);hot.on(STATE,onState);}
 else if(location.host){
  try{
   socket=new WebSocket(`${location.protocol==='https:'?'wss':'ws'}://${location.host}`,'vite-hmr');
   socket.addEventListener('message',event=>{try{const message=JSON.parse(event.data);if(message.type==='custom')receive(message.event,message.data);}catch{}});
  }catch{}
 }
 bus?.addEventListener('message',event=>receive(event.data?.event,event.data?.payload));
 function send(event,payload){
  if(hot){hot.send(event,payload);return;}
  if(socket?.readyState===WebSocket.OPEN){socket.send(JSON.stringify({type:'custom',event,data:payload}));return;}
  bus?.postMessage({event,payload});
 }
 return {
  mode:hot?'vite-websocket':socket?'websocket':'broadcast',sendControl:payload=>send(CONTROL,payload),sendState:payload=>send(STATE,payload),
  close(){bus?.close();socket?.close();},
 };
}
