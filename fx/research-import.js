// A browser-local, single-month container. This module has no upload transport.
import {ResearchProvider} from './research-provider.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const DB='kurumi-fx:research-data-v1',STORE='months',HEADER=1024*1024,MAX=17*1024*1024;
function database(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE,{keyPath:'key'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(Error('无法读取这台设备的历史行情'));});}
async function operation(mode,fn,{signal,beforeWrite}={}){signal?.throwIfAborted();const db=await database();try{signal?.throwIfAborted();beforeWrite?.();return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,mode);const abort=()=>{try{tx.abort();}catch{}};signal?.addEventListener('abort',abort,{once:true});let result;const cleanup=()=>signal?.removeEventListener('abort',abort);tx.oncomplete=()=>{cleanup();resolve(result);};tx.onerror=tx.onabort=()=>{cleanup();reject(signal?.aborted?signal.reason:Error('历史行情未保存，请检查本机空间'));};if(signal?.aborted){abort();return;}const r=fn(tx.objectStore(STORE));r.onsuccess=()=>result=r.result;});}finally{db.close();}}
export async function inspectResearchPackage(file){
 if(!file||!Number.isSafeInteger(file.size)||file.size<1||file.size>MAX)throw Error('这个历史文件大小不正确');
 const prefix=new Uint8Array(await file.slice(0,HEADER).arrayBuffer()),nl=prefix.indexOf(10);if(nl<0)throw Error('无法识别这个历史文件');
 let header;try{header=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(prefix.slice(0,nl)));}catch{throw Error('无法识别这个历史文件');}
 if(header.format!=='kurumi-fx-research-package-v1')throw Error('这个文件不是分钟历史行情');
 const raw=header.manifest,baseURL='https://local.invalid/admin/research/months/local.json';
 const fetch=async url=>{if(String(url)!==new URL(raw.gzip.file,baseURL).href)return new Response(null,{status:404});return new Response(file.slice(nl+1));};
 const provider=new ResearchProvider(raw,{baseURL,fetch});if(file.size!==nl+1+raw.gzip.bytes)throw Error('历史文件不完整');
 return {provider,manifest:provider.manifest,rawManifest:raw};
}
export async function importResearchPackage(file,{signal,beforeWrite}={}){
 signal?.throwIfAborted();
 const {provider,manifest,rawManifest}=await inspectResearchPackage(file);
 // The first load validates the complete bounded month before it is persisted.
 await provider.loadDay(manifest.days[0].date);
 const key=manifest.id+'@'+manifest.version;
 signal?.throwIfAborted();await operation('readwrite',s=>s.put({key,label:rawManifest.utcMonth,file}),{signal,beforeWrite});return key;
}
export async function listImportedResearchPackages(){try{return await operation('readonly',s=>s.getAll());}catch{return[];}}
export function createLocalResearchFile(manifest,gzip){
 if(!(gzip instanceof ArrayBuffer)||gzip.byteLength<1||gzip.byteLength>16*1024*1024)throw Error('历史文件大小无效');
 const header=JSON.stringify({format:'kurumi-fx-research-package-v1',manifest})+'\n';if(new TextEncoder().encode(header).byteLength>HEADER)throw Error('历史文件说明过大');
 return new File([header,gzip],'history.fxresearch',{type:'application/octet-stream'});
}
