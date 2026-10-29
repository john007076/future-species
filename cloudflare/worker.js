const EVENTS=new Set(['future-species:control','future-species:state']);
const JSON_HEADERS={'Content-Type':'application/json; charset=utf-8'};
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:JSON_HEADERS});

export class FutureSpeciesRoom{
 constructor(state,env){this.state=state;this.env=env;this.sessions=new Set();this.media=new Map();}
 async fetch(request){
  const url=new URL(request.url);
  if(request.headers.get('Upgrade')==='websocket')return this.connect(request);
  if(url.pathname==='/api/health')return json({ok:true,clients:this.sessions.size,service:'future-species'});
  if(url.pathname==='/api/layout')return this.layout(request);
  if(url.pathname==='/api/media'&&request.method==='POST')return this.upload(request);
  if(url.pathname.startsWith('/api/media/'))return this.download(url.pathname.slice('/api/media/'.length));
  return json({error:'Not found.'},404);
 }
 connect(request){
  const pair=new WebSocketPair(),[client,server]=Object.values(pair);server.accept();this.sessions.add(server);
  const remove=()=>this.sessions.delete(server);server.addEventListener('close',remove);server.addEventListener('error',remove);
  server.addEventListener('message',event=>{
   if(typeof event.data!=='string'||event.data.length>262144)return;
   try{
    const message=JSON.parse(event.data);if(message.type!=='custom'||!EVENTS.has(message.event)||!message.data||typeof message.data!=='object')return;
    for(const socket of this.sessions)if(socket.readyState===1)socket.send(event.data);
   }catch{}
  });
  const protocol=request.headers.get('Sec-WebSocket-Protocol');
  return new Response(null,{status:101,webSocket:client,headers:protocol?{'Sec-WebSocket-Protocol':protocol}:{}});
 }
 async layout(request){
  if(request.method==='GET'){const layout=await this.state.storage.get('layout');return layout?new Response(JSON.stringify(layout),{headers:JSON_HEADERS}):new Response(null,{status:204});}
  if(request.method!=='POST')return json({error:'Method not allowed.'},405);
  try{
   const layout=await request.json();if(![1,2].includes(layout?.version)||!layout.screens||typeof layout.screens!=='object')return json({error:'Invalid layout.'},400);
   if(JSON.stringify(layout).length>1_000_000)return json({error:'Layout is too large.'},413);
   await this.state.storage.put('layout',layout);return json({ok:true});
  }catch{return json({error:'Invalid JSON.'},400);}
 }
 async upload(request){
  const length=Number(request.headers.get('Content-Length')||0);if(length>64*1024*1024)return json({error:'Media exceeds the 64 MB cloud limit.'},413);
  const type=request.headers.get('Content-Type')||'application/octet-stream';if(!/^(image|video)\//.test(type))return json({error:'Only image or video media is accepted.'},415);
  const data=await request.arrayBuffer();if(data.byteLength>64*1024*1024)return json({error:'Media exceeds the 64 MB cloud limit.'},413);
  const id=crypto.randomUUID(),name=request.headers.get('X-File-Name')||'media';this.media.set(id,{data,type,name,created:Date.now()});
  if(this.media.size>12)this.media.delete(this.media.keys().next().value);
  return json({url:`./api/media/${id}`,name});
 }
 download(id){
  const item=this.media.get(id);if(!item)return json({error:'Media expired or not found.'},404);
  if(Date.now()-item.created>30*60*1000){this.media.delete(id);return json({error:'Media expired.'},410);}
  return new Response(item.data,{headers:{'Content-Type':item.type,'Cache-Control':'no-store'}});
 }
}

export default{
 async fetch(request,env){
  const url=new URL(request.url),remote=request.headers.get('Upgrade')==='websocket'||url.pathname.startsWith('/api/');
  if(remote){const room=env.FUTURE_SPECIES_ROOM.get(env.FUTURE_SPECIES_ROOM.idFromName('installation'));return room.fetch(request);}
  return env.ASSETS.fetch(request);
 },
};
