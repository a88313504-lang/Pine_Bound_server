import {createReadStream,existsSync,readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import {pipeline} from 'node:stream/promises';
import {once} from 'node:events';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
process.chdir(root);
const raw=readFileSync('game-data-manifest.json'), manifest=JSON.parse(raw), id=createHash('sha256').update(raw).digest('hex'), marker='public/.pinebound-bundle-id';
if(existsSync(marker)&&readFileSync(marker,'utf8').trim()===id&&existsSync('public/world.js')&&existsSync('test/room-joining.test.mjs')){console.log('Pinebound game data already restored.');process.exit(0);}
for(const p of manifest.parts){if(!/^game-data\.tar\.part\d{3}$/.test(p.file))throw Error('Invalid data part name');let bytes=0;const hash=createHash('sha256');for await(const chunk of createReadStream(p.file)){bytes+=chunk.length;hash.update(chunk);}if(bytes!==p.bytes||hash.digest('hex')!==p.sha256)throw Error('Data verification failed: '+p.file);}
console.log('Verified '+manifest.parts.length+' parts; restoring public game files and tests.');
const child=spawn('tar',['-xf','-'],{cwd:root,stdio:['pipe','inherit','inherit'],windowsHide:true});
const finished=once(child,'close');
async function* chunks(){for(const p of manifest.parts)for await(const chunk of createReadStream(p.file))yield chunk;}
await pipeline(chunks(),child.stdin);
const [code]=await finished;if(code!==0)throw Error('tar extraction failed: '+code);
if(!existsSync('public/world.js')||!existsSync('public/index.html')||!existsSync('test/room-joining.test.mjs'))throw Error('Incomplete restored game data');
mkdirSync('public',{recursive:true});writeFileSync(marker,id+'\n');console.log('Pinebound game data ready.');
