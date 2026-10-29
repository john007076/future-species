export function createDataBridge({setDisplay,setContent,onError=console.error}){
 const sockets=new Set();
 function apply(message){
  const data=typeof message==='string'?JSON.parse(message):message;
  if(data?.address){
   const match=/^\/screen\/([^/]+)\/(brightness|saturation|contrast|scanlines|mode)$/.exec(data.address);
   if(!match)throw new Error('Unsupported OSC-style address: '+data.address);
   return setDisplay('screen.'+match[1],{[match[2]]:data.value});
  }
  if(!data?.screen)throw new TypeError('Data message needs a screen ID.');
  if(data.display)setDisplay(data.screen,data.display);
  if(data.content)setContent(data.screen,data.content);
 }
 function connect(url){
  const socket=new WebSocket(url);sockets.add(socket);
  socket.addEventListener('message',event=>{try{apply(event.data);}catch(error){onError(error);}});
  socket.addEventListener('close',()=>sockets.delete(socket));
  socket.addEventListener('error',()=>onError(new Error('WebSocket data channel failed: '+url)));
  return socket;
 }
 function close(){for(const socket of sockets)socket.close();sockets.clear();}
 return {apply,connect,close};
}
