// These MP3s already contain 400ms of silence, an 80ms fade at the source
// onset and a 30ms tail. Finish the runtime ramp inside the silent pre-roll;
// repeating a long ramp over speech hides short interjections and word endings.
export function recordedVoiceEnvelope(line){
 const lead=Math.max(0,Number.isFinite(line?.leadInSeconds)?line.leadInSeconds:.4);
 const span=Math.max(.03,Number.isFinite(line?.end-line?.start)?line.end-line.start:1);
 const rampMs=lead>0?Math.min(24,lead*1000):Math.min(16,span*1000*.04);
 return {leadInSeconds:0,coldMs:rampMs,warmMs:Math.min(16,rampMs),tailMs:Math.min(10,span*1000*.02)};
}

export const VOICE_STOP_FADE_MS=80;
