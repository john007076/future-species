import {defineConfig} from 'vite';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
import {WebSocketServer} from 'ws';

const layoutPath=resolve('references/runtime-layout.json'),media=new Map();
const CONTROL='future-species:control',STATE='future-species:state';
function relay(server){if(server.ws)for(const event of [CONTROL,STATE])server.ws.on(event,data=>server.ws.send(event,data));}
function previewRelay(server){
 const sockets=new WebSocketServer({server:server.httpServer});
 sockets.on('connection',socket=>socket.on('message',raw=>{
  try{const message=JSON.parse(raw.toString());if(message.type!=='custom'||![CONTROL,STATE].includes(message.event))return;
   for(const client of sockets.clients)if(client.readyState===1)client.send(raw.toString());
  }catch{}
 }));
 server.httpServer.on('close',()=>sockets.close());
}
function middleware(server){
 relay(server);
 server.middlewares.use('/api/layout',async(request,response)=>{
  response.setHeader('Content-Type','application/json; charset=utf-8');
  try{
   if(request.method==='GET'){try{response.end(await readFile(layoutPath,'utf8'));}catch{response.statusCode=204;response.end();}return;}
   if(request.method==='POST'){
    let body='';for await(const chunk of request){body+=chunk;if(body.length>1_000_000)throw new Error('Layout is too large.');}
    const layout=JSON.parse(body);if(![1,2].includes(layout?.version)||!layout.screens)throw new Error('Invalid layout.');
    await mkdir(dirname(layoutPath),{recursive:true});await writeFile(layoutPath,JSON.stringify(layout,null,2)+'\n');response.end(JSON.stringify({ok:true}));return;
   }
   response.statusCode=405;response.end(JSON.stringify({error:'Method not allowed.'}));
  }catch(error){response.statusCode=400;response.end(JSON.stringify({error:error.message}));}
 });
 server.middlewares.use('/api/media',async(request,response)=>{
  if(request.method==='POST'){
   const chunks=[];let size=0;for await(const chunk of request){chunks.push(chunk);size+=chunk.length;if(size>150_000_000){response.statusCode=413;response.end();return;}}
   const id=randomUUID(),type=request.headers['content-type']||'application/octet-stream',name=request.headers['x-file-name']||'media';
   media.set(id,{data:Buffer.concat(chunks),type,name});response.setHeader('Content-Type','application/json');response.end(JSON.stringify({url:`./api/media/${id}`,name}));return;
  }
  const id=request.url?.slice(1),item=media.get(id);if(!item){response.statusCode=404;response.end();return;}
  response.setHeader('Content-Type',item.type);response.setHeader('Cache-Control','no-store');response.end(item.data);
 });
}
export default defineConfig({
 base:'./',plugins:[{name:'future-species-live-control',configureServer:middleware,configurePreviewServer(server){middleware(server);previewRelay(server);}}],
 server:{host:'0.0.0.0',port:5173,strictPort:true},preview:{host:'0.0.0.0',port:4173,strictPort:true},
 build:{rolldownOptions:{input:{main:resolve('index.html'),controller:resolve('controller.html'),air:resolve('air.html'),airRemote:resolve('air-remote.html')}}},
});
