import {importHistoricalPackage} from './historical-import.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createLocalResearchFile,importResearchPackage} from './research-import.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const ORIGIN='https://kurumi-fx-api.gongfpp.chatgpt.site';
const ROOT='/api/fx/history/';
const TICK={path:'2014-02/package.fxhistory.gz',bytes:4916015,sha256:'bc75bc22cc39bc4226d2391d581edd19b6e14fefa4f09eacd7e0dfc608ff0b2a',plainBytes:30003926,plainHash:'be0c299bf10fe20ad23963fe2c39580e33a44fba9db6821fd279b18a6f5782a8'};
const M1={path:'2008-10/manifest.json',bytes:26661,sha256:'e4ef3d8ab47ebffe391b59e0c8b28a587768cd30985cef8826da01d825c32dc5'};
const M1_DATA={path:'2008-10/USDJPY-2008-10.forexite.m1.csv.gz',bytes:429204,sha256:'da10482677dfaf6493a3e762e9137c23635130b2f13addfec0abd6ccfdc10fdd'};
async function bounded(stream,max,signal){if(!stream?.getReader)throw Error('历史行情响应无效');const r=stream.getReader(),parts=[];let size=0;try{for(;;){signal?.throwIfAborted();const {value,done}=await r.read();if(done)break;size+=value.byteLength;if(size>max){await r.cancel();throw Error('历史行情大小不符');}parts.push(value);}}finally{r.releaseLock();}signal?.throwIfAborted();const out=new Uint8Array(size);let at=0;for(const p of parts){out.set(p,at);at+=p.byteLength;}return out;}
async function verify(bytes,size,hash){if(bytes.length!==size)throw Error('历史行情不完整');const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');if(digest!==hash)throw Error('历史行情校验失败');return bytes;}
export function createOwnerHistoryTransport({fetch=globalThis.fetch,importTicks=importHistoricalPackage,importMinutes=importResearchPackage}={}){
 async function read(spec,signal){signal?.throwIfAborted();let r;try{r=await fetch(ORIGIN+ROOT+spec.path,{method:'GET',credentials:'include',cache:'no-store',redirect:'error',signal});}catch(e){signal?.throwIfAborted();throw Error('历史行情连接不可用，请检查登录状态或稍后重试');}if(r.status===401)throw Error('历史行情登录已过期，请先登录本人账号');if(r.status===403)throw Error('当前账号无法读取历史行情');if(!r.ok)throw Error('历史行情暂时无法载入');return verify(await bounded(r.body,spec.bytes,signal),spec.bytes,spec.sha256);}
 return {async acquire({signal,datasets=['2014-02','2008-10']}={}){if(!Array.isArray(datasets)||datasets.some(x=>!['2014-02','2008-10'].includes(x)))throw Error('不支持的历史数据集');const keys=[];const beforeWrite=()=>signal?.throwIfAborted();
  for(const id of [...new Set(datasets)]){signal?.throwIfAborted();if(id==='2014-02'){const gz=await read(TICK,signal);const plain=await verify(await bounded(new Blob([gz]).stream().pipeThrough(new DecompressionStream('gzip')),TICK.plainBytes,signal),TICK.plainBytes,TICK.plainHash);beforeWrite();keys.push(await importTicks(new File([plain],'USDJPY_2014-02.fxhistory',{type:'application/octet-stream'}),{signal,beforeWrite}));}
   else{const manifest=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(await read(M1,signal)));const data=await read(M1_DATA,signal);beforeWrite();keys.push(await importMinutes(createLocalResearchFile(manifest,data.buffer),{signal,beforeWrite}));}}
  beforeWrite();return keys;
 }};
}
export const acquireOwnerHistory=options=>createOwnerHistoryTransport().acquire(options);
