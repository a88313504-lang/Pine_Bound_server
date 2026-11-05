import {createGzip,createGunzip} from 'node:zlib';
import http from 'node:http';
import {stat} from 'node:fs/promises';
import {readFileSync,existsSync} from 'node:fs';
import {createReadStream} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {randomBytes} from 'node:crypto';
import {Room} from './simulation.mjs';
import {MODES} from './public/world.js';
const aliasPath=new URL('./public/assets/asset-aliases.json',import.meta.url),assetAliases=existsSync(aliasPath)?JSON.parse(readFileSync(aliasPath,'utf8')):{};
const root=fileURLToPath(new URL('./public/',import.meta.url));
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.glb':'model/gltf-binary','.json':'application/json','.txt':'text/plain','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'};
export function createGameServer({transport='sse',publicOrigin=process.env.PUBLIC_URL||''}={}){
const rooms=new Map(),sessions=new Map(),streams=new Map(),limits=new Map();let inviteOrigin='';try{const u=new URL(publicOrigin);if(['http:','https:'].includes(u.protocol))inviteOrigin=u.origin;}catch{}
const json=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost'),host=req.headers.host||'';if(/^[a-z0-9-]+\.trycloudflare\.com(?::443)?$/i.test(host))inviteOrigin=new URL('https://'+host).origin;
 // API mutations must come from this origin. No cross-origin API access is granted.
 if(req.method==='POST'&&req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return json(res,403,{error:'Use the same game server for the page and API.'});
 if(url.pathname==='/health')return json(res,200,{ok:true,rooms:rooms.size,players:sessions.size});
 if(url.pathname==='/api/events'&&req.method==='GET'){const token=url.searchParams.get('token'),s=sessions.get(token);if(!s)return json(res,401,{error:'Session expired. Rejoin from the menu.'});streams.get(token)?.end();res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});res.write('retry: 1000\n\n');streams.set(token,res);req.on('close',()=>{if(streams.get(token)===res)streams.delete(token);});return;}
 if(url.pathname.startsWith('/api/')&&req.method==='POST'){
 let body='';for await(const part of req){body+=part;if(body.length>4096)return json(res,413,{error:'Request too large'});}let d;try{d=JSON.parse(body);}catch{return json(res,400,{error:'Invalid JSON'});}
 if(url.pathname==='/api/join'){
 const ip=req.socket.remoteAddress,rate=limits.get(ip)||{time:Date.now(),count:0};if(Date.now()-rate.time>60000){rate.time=Date.now();rate.count=0;}limits.set(ip,rate);if(++rate.count>30)return json(res,429,{error:'Too many joins. Try again in a minute.'});
 let code=String(d.code||'').toUpperCase().trim();if(code&&!/^[A-Z0-9]{3,12}$/.test(code))return json(res,400,{error:'Room code needs 3–12 letters or digits.'});
 const intent=d.intent||(code?'join':'create');if(!['join','create'].includes(intent))return json(res,400,{error:'Choose create room or join room.'});let room;
 if(intent==='join'){if(!code)return json(res,400,{error:'Enter the host’s room code.'});room=rooms.get(code);if(!room||!room.players.size)return json(res,404,{error:'Room not found on this server. Open the same invite link as your host and check the code. After a server restart, create a fresh room.'});}
 else{if(!Object.hasOwn(MODES,d.mode))return json(res,400,{error:'Unknown game mode'});if(code&&rooms.has(code))return json(res,409,{error:'That room already exists. Join it instead.'});if(rooms.size>=100)return json(res,503,{error:'Server full'});if(!code){do{code=randomBytes(3).toString('hex').toUpperCase();}while(rooms.has(code));}room=new Room(code,d.mode);rooms.set(code,room);}
 const spawn=intent==='join'?(room.spawnRegion||[...room.players.values()][0]?.home):d.spawn,p=room.add(String(d.name||'Explorer').replace(/[<>]/g,''),spawn);if(intent==='create')room.spawnRegion=p.home;const token=randomBytes(24).toString('hex');sessions.set(token,{room,id:p.id});const origin=inviteOrigin||('http://'+host),inviteUrl=new URL('/?room='+encodeURIComponent(code)+'&mode='+encodeURIComponent(room.mode),origin).href,localOnly=['localhost','127.0.0.1','[::1]'].includes(new URL(origin).hostname);return json(res,200,{token,id:p.id,code,mode:room.mode,transport,joinedExisting:intent==='join',spawn:p.home,playerCount:room.players.size,inviteUrl,localOnly,snapshot:room.snapshot()});
 }
 const token=req.headers.authorization?.replace(/^Bearer /,''),s=sessions.get(token);if(!s||!s.room.players.has(s.id))return json(res,401,{error:'Session expired. Rejoin from the menu.'});
 if(url.pathname==='/api/input'){s.room.input(s.room.players.get(s.id),d);return json(res,200,transport==='poll'?{ok:true,snapshot:s.room.snapshot()}:{ok:true});}
 if(url.pathname==='/api/leave'){s.room.remove(s.id);sessions.delete(token);streams.get(token)?.end();streams.delete(token);return json(res,200,{ok:true});}
 return json(res,404,{error:'Unknown API route'});
 }
 if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'Method not allowed'});
 const filename=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':assetAliases[decodeURIComponent(url.pathname)]||assetAliases[url.pathname]||url.pathname));if(!filename.startsWith(root))return json(res,403,{error:'Forbidden'});
 let stored=filename,precompressed=false,info;try{info=await stat(stored);}catch(error){if(error.code!=='ENOENT')throw error;stored=filename+'.gz';info=await stat(stored);precompressed=true;}if(!info.isFile())throw Error('Not found');
 const acceptsGzip=/(?:^|[,\s])gzip(?:[,;\s]|$)/.test(req.headers['accept-encoding']||''),etag='W/"'+info.size.toString(16)+'-'+Math.trunc(info.mtimeMs).toString(16)+'"',cache=url.pathname.startsWith('/assets/')?'public, max-age=604800':'no-cache';
 const headers={'Content-Type':mime[path.extname(filename)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':cache,ETag:etag,Vary:'Accept-Encoding'};if(req.headers['if-none-match']===etag){res.writeHead(304,headers);return res.end();}
 const compress=!precompressed&&acceptsGzip&&/\.(js|json|css|html)$/.test(filename);if(precompressed&&acceptsGzip||compress)headers['Content-Encoding']='gzip';if(!compress&&(!precompressed||acceptsGzip))headers['Content-Length']=info.size;res.writeHead(200,headers);if(req.method==='HEAD')return res.end();
 const file=createReadStream(stored);file.on('error',()=>res.destroy());res.on('close',()=>file.destroy());if(compress||precompressed&&!acceptsGzip){const transform=compress?createGzip():createGunzip();transform.on('error',()=>res.destroy());file.pipe(transform).pipe(res);}else file.pipe(res);
 }catch(e){if(!res.headersSent)json(res,e.code==='ENOENT'?404:400,{error:e.code==='ENOENT'?'Not found':e.message});else res.end();}});
 let last=performance.now(),broadcast=0;const timer=setInterval(()=>{const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;for(const [code,r]of rooms){r.tick(dt);if(!r.players.size)rooms.delete(code);}broadcast++;if(broadcast%2===0){const snapshots=new Map();for(const [token,s]of sessions){if(!s.room.players.has(s.id)){sessions.delete(token);streams.get(token)?.end();streams.delete(token);continue;}const stream=streams.get(token);if(stream){if(stream.writableLength>256000){stream.end();streams.delete(token);continue;}if(!snapshots.has(s.room))snapshots.set(s.room,JSON.stringify(s.room.snapshot()));stream.write(`data: ${snapshots.get(s.room)}\n\n`);}}}if(broadcast%1200===0)for(const [ip,r]of limits)if(Date.now()-r.time>60000)limits.delete(ip);},1000/30);
 server.on('close',()=>clearInterval(timer));return {server,rooms,sessions,shutdown(){clearInterval(timer);for(const r of streams.values())r.end();server.close();server.closeAllConnections();}};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const app=createGameServer({transport:process.argv.includes('--public')?'poll':'sse'});const port=Number(process.env.PORT||3000);app.server.listen(port,process.env.HOST||'0.0.0.0',()=>console.log(`Pinebound ready: http://localhost:${port}\nFor friends, use this computer's LAN address or deploy this Node project to an HTTPS host.`));}
