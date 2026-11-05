import {STATIONS,RAIL_ROUTES,railPose,railStop,nextStation} from './public/world.js';
const approach=(v,t,r,dt)=>v+(t-v)*(1-Math.exp(-r*dt));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const blockKey=(a,b)=>[a,b].sort().join('|');
function claim(room,v,key){const owner=room.reservations.get(key);if(owner&&owner!==v.id&&room.vehicles.some(q=>q.id===owner&&!q.wreck&&q.block===key)){v.signal=true;v.speed=0;return false;}if(v.block&&v.block!==key&&room.reservations.get(v.block)===v.id)room.reservations.delete(v.block);room.reservations.set(key,v.id);v.block=key;v.signal=false;return true;}
function travelDirection(v,direction){if(direction===v.direction)return;v.direction=direction;const station=STATIONS.find(q=>q.routes.includes(v.route)&&Math.abs(q.distances[v.route]-v.s)<1.5);if(station){v.lastStop=station.id;v.nextStop=nextStation(v).id;}else{const old=v.lastStop;v.lastStop=v.nextStop;v.nextStop=old;}}
export function updateRailService(room,v,i,dt){
 if(i.w||i.s||i.brake){v.auto=false;v.dwell=0;}
 if(v.dwell>0){v.dwell=Math.max(0,v.dwell-dt);v.speed=approach(v.speed,0,10,dt);return;}
 if(!v.auto){const input=(i.w?1:0)-(i.s?1:0),rate=input&&input*v.speed<0?7:4.2;v.speed=clamp(v.speed+input*rate*dt,-42,42);if(i.brake)v.speed=approach(v.speed,0,7,dt);if(!input)v.speed=approach(v.speed,0,.035,dt);if(Math.abs(v.speed)>.0001)travelDirection(v,Math.sign(v.speed));}
 if(!claim(room,v,blockKey(v.lastStop,v.nextStop)))return;
 const next=railStop(v.nextStop)||nextStation(v),delta=next.distances[v.route]-v.s;
 if(v.auto){const turnout=v.sidings.includes(next.id)&&Math.abs(delta)<210,limit=turnout?10:v.consist==='freight'?30:42,target=v.direction*(v.consist==='freight'||next.id.endsWith('Tunnel')?limit:Math.min(limit,Math.sqrt(Math.max(0,4.8*Math.abs(delta)))));v.speed=approach(v.speed,target,1.2,dt);}
 const previous=v.s;v.s+=v.speed*dt;
 if(v.route==='main'&&((v.s>=RAIL_ROUTES.main.length-20&&(v.speed>0||v.portalWaiting==='east'))||(v.s<=140&&(v.speed<0||v.portalWaiting==='west')))){
  const east=v.s>=RAIL_ROUTES.main.length-20,last=east?'westTunnel':'eastTunnel',target=east?'forest':'industry',key=blockKey(last,target),entrySpeed=v.speed;
  if(claim(room,v,key)){if(v.portalWaiting&&v.portalSpeed)v.speed=v.portalSpeed;v.portalWaiting=null;v.portalSpeed=0;v.s=east?140:RAIL_ROUTES.main.length-20;v.lastStop=last;v.nextStop=target;v.tunnelTrips=(v.tunnelTrips||0)+1;v.portalSerial=(v.portalSerial||0)+1;room.event('Mountain tunnel link: emerging on the opposite side of Pine County.');}
  else {v.portalSpeed=entrySpeed||v.portalSpeed;v.portalWaiting=east?'east':'west';v.s=east?RAIL_ROUTES.main.length-20:140;}
  Object.assign(v,railPose(v.s,v.route,v.sidings));return;
 }
 v.s=clamp(v.s,0,RAIL_ROUTES[v.route].length-20);Object.assign(v,railPose(v.s,v.route,v.sidings));
 for(const station of STATIONS.filter(s=>s.routes.includes(v.route))){const s=station.distances[v.route];if((previous-s)*(v.s-s)<=0&&Math.abs(previous-v.s)>1e-7&&Math.abs(previous-s)>.01){room.arrive(v,station);break;}}
}
