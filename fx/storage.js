// Storage failures keep the page playable. Only failed writes override reads;
// a successful write must not hide newer data from another page forever.
// Keep only an allowlisted error category, never browser error text or values.
export function storageFailure(error,operation) {
  const name=['QuotaExceededError','NS_ERROR_DOM_QUOTA_REACHED','SecurityError','NotAllowedError'].includes(error?.name)?error.name:'UnknownError';
  return {operation,kind:name==='QuotaExceededError'||name==='NS_ERROR_DOM_QUOTA_REACHED'?'quota':name==='SecurityError'||name==='NotAllowedError'?'access':'unavailable'};
}
export function createGameStorage(resolve=()=>globalThis.localStorage) {
  const overlay=new Map(),cache=new Map(),failures=new Map();
  const failed=(key,error,operation)=>failures.set(key,storageFailure(error,operation));
  function readItem(key) {
    try {
      const storage=resolve();if(!storage){failed(key,null,'read');return {available:false,value:cache.get(key)??null};}
      const value=storage.getItem(key)??null;cache.set(key,value);failures.delete(key);
      return {available:true,value};
    } catch(error) {failed(key,error,'read');return {available:false,value:cache.get(key)??null};}
  }
  return {
    readItem,
    failureFor(key){const failure=failures.get(key);return failure?{...failure}:null;},
    forgetItem(key){overlay.delete(key);},
    getItem(key) {
      if(overlay.has(key))return overlay.get(key);
      return readItem(key).value;
    },
    setItem(key,value) {
      const text=String(value);overlay.set(key,text);
      try{const storage=resolve();if(!storage){failed(key,null,'write');return false;}storage.setItem(key,text);overlay.delete(key);cache.set(key,text);failures.delete(key);return true;}catch(error){failed(key,error,'write');return false;}
    },
    removeItem(key) {
      overlay.set(key,null);
      try{const storage=resolve();if(!storage){failed(key,null,'remove');return false;}storage.removeItem(key);overlay.delete(key);cache.set(key,null);failures.delete(key);return true;}catch(error){failed(key,error,'remove');return false;}
    }
  };
}
