import LZString from './vendor/lz-string.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export const SAVE_FORMAT='kurumi-save-lz-v1';
export const SAVE_ENVELOPE_VERSION=14;
export const HISTORY_CONTINUATION_SAVE_VERSION=18;
const HISTORY_FORMAT='kurumi-save-history-continuation-v1';
export const SAVE_COMPRESSION_THRESHOLD=256*1024;
export const MAX_SAVE_CHARACTERS=16*1024*1024;
export const MAX_ENVELOPE_CHARACTERS=4*1024*1024;
export const MAX_TOTAL_CHARACTERS=24*1024*1024;
// These are corruption checks, not authentication or a security signature.
function checksum(text){let value=2166136261;for(let i=0;i<text.length;i++){value^=text.charCodeAt(i);value=Math.imul(value,16777619);}return (value>>>0).toString(16).padStart(8,'0');}
function checkRaw(raw){if(typeof raw!=='string'||raw.length>MAX_SAVE_CHARACTERS)throw new RangeError('Save length limit');}
function compress(raw){checkRaw(raw);return {length:raw.length,checksum:checksum(raw),data:LZString.compressToUTF16(raw)};}
function decompress(part){
 if(!part||!Number.isSafeInteger(part.length)||part.length<1||part.length>MAX_SAVE_CHARACTERS||typeof part.data!=='string'||part.data.length>MAX_ENVELOPE_CHARACTERS||!/^[a-f0-9]{8}$/.test(part.checksum))throw new TypeError('Invalid save payload');
 const raw=LZString._decompress(part.data.length,16384,index=>part.data.charCodeAt(index)-32,part.length);
 if(typeof raw!=='string'||raw.length!==part.length||checksum(raw)!==part.checksum)throw new TypeError('Damaged save payload');
 return raw;
}
// Only decoded strings are cached. Callers still parse a fresh state object.
// Two slots bound memory and avoid repeated decompression during guard checks.
const decodedCache=new Map();
export function inspectSave(raw){
 checkRaw(raw);if(decodedCache.has(raw))return {...decodedCache.get(raw),importRaws:[...decodedCache.get(raw).importRaws]};
 const parsed=JSON.parse(raw);
 const wrapped=[SAVE_ENVELOPE_VERSION,HISTORY_CONTINUATION_SAVE_VERSION].includes(parsed?.version)||typeof parsed?.format==='string'&&parsed.format.startsWith('kurumi-save-');
 if(!wrapped)return {currentRaw:raw,recoveryRaw:null,importRaws:[],compressed:false};
 if(raw.length>MAX_ENVELOPE_CHARACTERS||!(parsed.version===SAVE_ENVELOPE_VERSION&&parsed.format===SAVE_FORMAT||parsed.version===HISTORY_CONTINUATION_SAVE_VERSION&&parsed.format===HISTORY_FORMAT))throw new TypeError('Unsupported save envelope');
 const imports=parsed.imports??[];
 if(!Array.isArray(imports)||imports.length>32)throw new RangeError('Save import archive limit');
 const parts=[parsed.current,...(parsed.recovery===null?[]:[parsed.recovery]),...imports];
 if(parts.some(p=>!Number.isSafeInteger(p?.length)||p.length<1)||parts.reduce((sum,p)=>sum+p.length,0)>MAX_TOTAL_CHARACTERS)throw new RangeError('Save total length limit');
 const currentRaw=decompress(parsed.current),recoveryRaw=parsed.recovery===null?null:decompress(parsed.recovery),importRaws=imports.map(decompress);
 // Never permit recursive envelopes or unknown future state versions inside one.
 for(const value of [currentRaw,recoveryRaw,...importRaws])if(value!==null){const state=JSON.parse(value);if(!state||typeof state!=='object'||Array.isArray(state)||!Number.isInteger(state.version)||state.version<2||(state.version>=SAVE_ENVELOPE_VERSION&&![15,16,17].includes(state.version))||state.format)throw new TypeError('Invalid enclosed game state');}
 const result={currentRaw,recoveryRaw,importRaws,compressed:true};decodedCache.set(raw,result);if(decodedCache.size>2)decodedCache.delete(decodedCache.keys().next().value);return {...result,importRaws:[...importRaws]};
}
export function decodeSaveRaw(raw){return inspectSave(raw).currentRaw;}
let cachedRecoveryRaw=null,cachedRecovery=null;
export function encodeSaveRaw(currentRaw,previousRaw=null,{replacement=false}={}){
 checkRaw(currentRaw);
 const previous=previousRaw===null?null:inspectSave(previousRaw);
 const continuation=JSON.parse(currentRaw)?.historyContinuation?.version===1||previous?.compressed&&JSON.parse(previousRaw)?.version===HISTORY_CONTINUATION_SAVE_VERSION;
 if(!continuation&&![15,16,17].includes(JSON.parse(currentRaw)?.version)&&currentRaw.length<SAVE_COMPRESSION_THRESHOLD&&!previous?.compressed&&!replacement)return currentRaw;
 // The first durable original is retained forever; never nest old envelopes.
 const recoveryRaw=previous?.compressed?previous.recoveryRaw:previousRaw;
 if(recoveryRaw!==cachedRecoveryRaw){cachedRecoveryRaw=recoveryRaw;cachedRecovery=recoveryRaw===null?null:compress(recoveryRaw);}
 const importRaws=[...(previous?.importRaws||[])];
 if(replacement&&previous&&!importRaws.includes(previous.currentRaw))importRaws.push(previous.currentRaw);
 if(importRaws.length>32||currentRaw.length+(recoveryRaw?.length||0)+importRaws.reduce((n,r)=>n+r.length,0)>MAX_TOTAL_CHARACTERS)throw new RangeError('Save total length limit');
 const result=JSON.stringify({version:continuation?HISTORY_CONTINUATION_SAVE_VERSION:SAVE_ENVELOPE_VERSION,format:continuation?HISTORY_FORMAT:SAVE_FORMAT,current:compress(currentRaw),recovery:cachedRecovery,imports:importRaws.map(compress)});
 if(result.length>MAX_ENVELOPE_CHARACTERS)throw new RangeError('Encoded save length limit');
 // Reject before touching disk if our bounded decoder cannot recover every byte.
 const checked=inspectSave(result);
 if(checked.currentRaw!==currentRaw||checked.recoveryRaw!==recoveryRaw||checked.importRaws.length!==importRaws.length||checked.importRaws.some((value,i)=>value!==importRaws[i]))throw new TypeError('Save round trip failed');
 return result;
}
