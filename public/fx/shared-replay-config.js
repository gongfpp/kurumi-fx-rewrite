// Deliberately empty: enable only after endpoint deployment/auth/browser verification.
export const SHARED_REPLAY_CONFIG=Object.freeze({enabled:false,endpoint:null,allowedOrigin:null,verifiedEndpoint:null});
export function replayConfigured(c){try{const u=new URL(c?.endpoint);return c.enabled===true&&c.verifiedEndpoint===u.href&&c.allowedOrigin===u.origin&&u.protocol==='https:'&&!u.username&&!u.password&&!u.hash;}catch{return false;}}
