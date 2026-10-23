import {MAIN_GAME_SAVE_SLOTS} from './save-slots.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {encodeProgress} from './save-encoder.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {inspectSave,SAVE_COMPRESSION_THRESHOLD} from './save-codec.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {storageFailure} from './storage.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Progress is an optimistic, per-mode session. Compare the exact durable bytes,
// not a timestamp (or this tab's failed-write overlay), before every write.
// Web Locks make that comparison + write exclusive between current app pages.
export function createSaveSession({storage,key,legacyKey=null,restore,locks=globalThis.navigator?.locks,encode=encodeProgress,lifeSceneMigration=null,staminaFatigueMigration=false,lockTimeoutMs=10000,setTimer=setTimeout,clearTimer=clearTimeout}) {
  if(!Number.isFinite(lockTimeoutMs)||lockTimeoutMs<=0||typeof setTimer!=='function'||typeof clearTimer!=='function')throw TypeError('Invalid save lock timeout');
  // Main-game migration policy is injected; archived runtimes stay isolated.
  const hasLifeSceneSource=state=>lifeSceneMigration?.hasSource(state)===true;
  const sceneBackupKey=lifeSceneMigration?.enabled===true&&['fx-girl-campaign-v3','fx-girl-historical-story-v1','fx-girl-live-story-v1','fx-girl-shared-replay-story-v1'].includes(key)?key+':pre-life-scenes-v1':null;
  const staminaBackupKey=staminaFatigueMigration&&(MAIN_GAME_SAVE_SLOTS.includes(key)||['fx-girl-shared-replay-story-v1','fx-girl-shared-replay-endless-v1'].includes(key))?key+':pre-stamina-fatigue-v2':null;
  const economyBackupKey=staminaBackupKey?key+':pre-economy-v1':null;
  const lifeBackupKey=staminaBackupKey&&['fx-girl-campaign-v3','fx-girl-historical-story-v1','fx-girl-live-story-v1','fx-girl-shared-replay-story-v1'].includes(key)?key+':pre-life-actions-v1':null;
  const read=()=>{
    const current=storage.readItem(key);
    const legacy=current.available&&current.value===null&&legacyKey?storage.readItem(legacyKey):null;
    return {current,legacy,raw:current.value??legacy?.value??null,failure:!current.available?storage.failureFor?.(key):legacy&&!legacy.available?storage.failureFor?.(legacyKey):null};
  };
  let baseline=read(),raw=baseline.raw,localRaw=raw,queue=Promise.resolve(),epoch=0;
  let savedText=null;try{savedText=raw===null?null:inspectSave(raw).currentRaw;}catch{}
  let revision=0,importPending=false,latestRun=null;
  let baselineMetadata=null,completedSnapshot=null;
  const invalidate=()=>{baselineMetadata=null;completedSnapshot=null;};
  // Retain only immutable migration decisions, never the caller's state object.
  const metadata=state=>({preV9:Number.isInteger(state?.version)&&state.version<9,v9:state?.version>=9,livingV2:state?.lifestyle?.version===2,story:state?.mode==='story',theftV1:state?.family?.theftDiscovery?.version===1,hasTheft:!!state?.family?.theftDiscovery,lifeV1:state?.lifeActions?.version===1,hasLife:!!state?.lifeActions,sceneSource:!!sceneBackupKey&&hasLifeSceneSource(state),fatigueV2:!!staminaBackupKey&&(state?.stamina?.version===2||state?.stamina?.version===3&&!!state.stamina.fatigue),economyV1:!!economyBackupKey&&state?.stamina?.version===3&&state?.housingEconomy?.version===1&&state?.workEconomy?.version===1});
  const previousMetadata=()=>{
    if(baselineMetadata?.raw===baseline.raw)return baselineMetadata.value;
    let value={};
    if(baseline.raw!==null){const archive=inspectSave(baseline.raw);value=metadata(JSON.parse(archive.currentRaw));
      // pre-v9 historically checks the outer durable version, not its payload.
      if(archive.compressed)value.preV9=false;
    }
    baselineMetadata={raw:baseline.raw,value};return value;
  };
  let status='ready',reason='',failure=null;
  const decode=value=>{try{return value===null?null:restore(value);}catch{return null;}};
  const available=value=>value.current.available&&(!value.legacy||value.legacy.available);
  const invalid=value=>value.raw!==null&&!decode(value.raw);
  const fail=(next,why='',detail=null)=>{completedSnapshot=null;if(next==='conflict'||next==='invalid')baselineMetadata=null;status=next;reason=why;failure=detail;return false;};
  if(!available(baseline))fail('memory','storage',baseline.failure);
  else if(invalid(baseline))fail('invalid','schema');
  const blocked=()=>status==='conflict'||status==='invalid';
  function check() {
    if(blocked())return false;
    const latest=read();
    if(!available(latest)){fail('memory','storage',latest.failure);return true;}
    // A previously unreadable slot can only be claimed once proven empty.
    if(!available(baseline)) {
      if(latest.raw!==null)return fail('conflict','unreadable-baseline');
      baseline=latest;invalidate();
    }
    if(latest.current.value!==baseline.current.value||latest.legacy?.value!==baseline.legacy?.value)return fail('conflict','changed');
    return true;
  }
  return {
    key,legacyKey,
    get raw(){return raw;},get localRaw(){return localRaw;},
    get status(){return status==='saved'&&savedText!==localRaw?'pending':status;},get reason(){return reason;},get failure(){return failure?{...failure}:null;},get blocked(){return blocked();},
    check,
    save(state,options={}) {
      if(importPending&&!options.replacement)return Promise.resolve(false);
      const text=JSON.stringify(state),run=String(state.runId??`seed:${state.seed}:${state.mode}`);
      if(latestRun!==null&&latestRun!==run){epoch++;invalidate();}latestRun=run;
      const generation=epoch,ticket=++revision,large=text.length>=SAVE_COMPRESSION_THRESHOLD;
      // Live/multi-market/life states use the worker even below the size threshold.
      // Drop obsolete queued encodings, but let the in-flight write make progress.
      const coalesce=large||[15,16,17].includes(state.version)||options.replacement||savedText!==baseline.raw;localRaw=text;if(!blocked())status='pending';
      const write=async()=>{
        if(generation!==epoch||coalesce&&ticket!==revision||!check())return false;
        if(options.replacement&&raw!==options.expectedRaw)return false;
        if(!locks?.request)return fail('memory','coordination');
        // Only a fully successful write in this epoch may skip encoding. The
        // lock and fresh durable checks below still run for identical text.
        const unchanged=!options.replacement&&completedSnapshot?.text===text&&completedSnapshot.raw===baseline.raw;
        let durableText;
        if(!unchanged)try{const encoded=encode(text,baseline.raw,{replacement:!!options.replacement});durableText=typeof encoded==='string'?encoded:await encoded;}catch{return generation===epoch&&!blocked()?fail('memory','encoding'):false;}
        const controller=new AbortController();let active=true,timer;
        const deadline=new Promise((_,reject)=>{timer=setTimer(()=>{active=false;controller.abort();reject(Object.assign(Error('Save coordination timeout'),{name:'TimeoutError'}));},lockTimeoutMs);});
        try {
          return await Promise.race([deadline,locks.request('fx-progress:'+key,{mode:'exclusive',signal:controller.signal},()=>{
            // A timed-out request may still be granted by a test/old lock adapter.
            // Its captured bytes must never land after the UI resumes or retries.
            if(!active)return false;
            // Let an in-flight snapshot of this run land even when newer ticks
            // are waiting, otherwise a busy market could starve every save.
            if(generation!==epoch||!check())return false;
            const latest=read();
            if(!available(latest))return fail('memory','storage',latest.failure);
            if(unchanged){
              // A failed read or reload while waiting may invalidate this proof.
              if(completedSnapshot?.text!==text||completedSnapshot.raw!==baseline.raw)return fail('memory','storage',failure);
              status='saved';reason='';failure=null;return true;
            }
            const nextMetadata=metadata(JSON.parse(text)),previous=previousMetadata();
            // Keep the exact last pre-economy envelope in this registered slot.
            if(nextMetadata.economyV1&&baseline.raw!==null&&!previous.economyV1){
              const backup=storage.readItem(economyBackupKey);
              if(!backup.available||backup.value===null&&!storage.setItem(economyBackupKey,baseline.raw))return fail('memory','migration-backup',storage.failureFor?.(economyBackupKey));
            }
            // Preserve the exact pre-v9 bytes once before replacing an older schema.
            // Backups stay in this mode's namespace and are never overwritten.
            if(previous.preV9&&nextMetadata.v9){
              const backupKey=key+':pre-v9',backup=storage.readItem(backupKey);
              if(!backup.available||backup.value===null&&!storage.setItem(backupKey,baseline.raw))return fail('memory','migration-backup',storage.failureFor?.(backupKey));
            }
            // Preserve the exact pre-housing bytes once, including compressed
            // envelopes. The namespace allows only known save-slot backups.
            if(baseline.raw!==null&&nextMetadata.livingV2&&!previous.livingV2){
              const backupKey=key+':pre-living-v2',backup=storage.readItem(backupKey);
              if(!backup.available||backup.value===null&&!storage.setItem(backupKey,baseline.raw))return fail('memory','migration-backup',storage.failureFor?.(backupKey));
            }
            if(baseline.raw!==null&&nextMetadata.story&&nextMetadata.theftV1&&!previous.hasTheft){
              const backupKey=key+':pre-father-theft-v1',backup=storage.readItem(backupKey);
              if(!backup.available||backup.value===null&&!storage.setItem(backupKey,baseline.raw))return fail('memory','migration-backup',storage.failureFor?.(backupKey));
            }
            // The first life-action write preserves the exact prior durable state.
            // Older clients reject v17; the scoped backup remains a recovery path.
            if(baseline.raw!==null&&nextMetadata.lifeV1&&!previous.hasLife){
              const backupKey=key+':pre-life-actions-v1',backup=storage.readItem(backupKey);
              if(!backup.available||backup.value===null&&!storage.setItem(backupKey,baseline.raw))return fail('memory','migration-backup',storage.failureFor?.(backupKey));
            }
            // Preserve the full latest v17 state before its first registered scene
            // source is written. The older pre-life-actions backup can be much older.
            // Capture the queued snapshot's decision, not later mutations of state.
            if(nextMetadata.sceneSource&&baseline.raw!==null&&!previous.sceneSource){
              const backup=storage.readItem(sceneBackupKey);
              if(!backup.available||backup.value===null&&!storage.setItem(sceneBackupKey,baseline.raw))return fail('memory','migration-backup',storage.failureFor?.(sceneBackupKey));
            }
            // Fatigue is an optional component upgrade even in small v12/v13
            // saves. Preserve the exact durable envelope before its first v2 write.
            // This shares the primary slot lock and never overwrites the archive.
            if(nextMetadata.fatigueV2&&baseline.raw!==null&&!previous.fatigueV2){
              const backup=storage.readItem(staminaBackupKey);
              if(!backup.available||backup.value===null&&!storage.setItem(staminaBackupKey,baseline.raw))return fail('memory','migration-backup',storage.failureFor?.(staminaBackupKey));
            }
            // The encoder can return plain bytes or an envelope. Keep the
            // original outer-version migration rule without decoding its body.
            let outerPreV9=nextMetadata.preV9;
            if(durableText!==text){let version;try{version=JSON.parse(durableText)?.version;}catch{}outerPreV9=Number.isInteger(version)&&version<9;}
            if(!storage.setItem(key,durableText))return fail('memory','storage',storage.failureFor?.(key));
            // After migration, the current slot is authoritative. Never delete
            // the legacy slot, which is still a recovery source for the user.
            baseline={current:{available:true,value:durableText},legacy:null,raw:durableText};
            baselineMetadata={raw:durableText,value:{...nextMetadata,preV9:outerPreV9}};completedSnapshot={raw:durableText,text};
            raw=durableText;savedText=text;status='saved';reason='';failure=null;return true;
          })]);
        } catch(error) {return generation===epoch&&!blocked()?fail('memory','coordination',controller.signal.aborted?{operation:'lock',kind:'timeout'}:storageFailure(error,'lock')):false;}
        finally{active=false;clearTimer(timer);}
      };
      queue=queue.then(write,write);return queue;
    },
    async replaceFromBackup(state,expectedRaw) {
      if(importPending||blocked()||raw!==expectedRaw||!check()||!decode(JSON.stringify(state)))return false;
      const beforeLocal=localRaw,beforeRun=latestRun;importPending=true;epoch++;invalidate();
      try{const saved=await this.save(state,{replacement:true,expectedRaw});if(!saved){localRaw=beforeLocal;latestRun=beforeRun;storage.forgetItem(key);}return saved;}
      finally{importPending=false;}
    },
    // Only an explicit user choice may replace this page with another save.
    // Cancel queued writes so a pre-reload snapshot cannot be written afterward.
    reload() {
      invalidate();const latest=read();
      if(!available(latest)){reason='storage';failure=latest.failure;return {ok:false,reason};}
      if(invalid(latest)){fail('invalid','schema');return {ok:false,reason};}
      epoch++;latestRun=null;baseline=latest;raw=latest.raw;localRaw=raw;savedText=raw===null?null:inspectSave(raw).currentRaw;status='ready';reason='';failure=null;
      storage.forgetItem(key);
      return {ok:true,state:decode(raw)};
    },
    backup(state) {
      const latest=read();
      let recoveryRaw=null,importRaws=[];try{const archive=raw===null?null:inspectSave(raw);recoveryRaw=archive?.recoveryRaw??null;importRaws=archive?.importRaws??[];}catch{}
      // Expose this first-boundary archive through the existing download only.
      // readItem bypasses failed-write overlays: cached/unreadable bytes are not
      // advertised as a durable recovery. It may belong to an earlier run.
      const sceneBackup=sceneBackupKey?storage.readItem(sceneBackupKey):null;
      const sceneRecovery=sceneBackup?.available&&sceneBackup.value!==null?{lifeSceneRecoveryRaw:sceneBackup.value}:{};
      const staminaBackup=staminaBackupKey?storage.readItem(staminaBackupKey):null;
      const staminaRecovery=staminaBackup?.available&&staminaBackup.value!==null?{staminaFatigueRecoveryRaw:staminaBackup.value}:{};
      const economyBackup=economyBackupKey?storage.readItem(economyBackupKey):null;
      const economyRecovery=economyBackup?.available&&economyBackup.value!==null?{economyRecoveryRaw:economyBackup.value}:{};
      // If life upgraded first, this older checkpoint is the pre-v17 recovery.
      // Both archives keep their own compatibility boundary and exact bytes.
      const lifeBackup=lifeBackupKey?storage.readItem(lifeBackupKey):null;
      const lifeRecovery=lifeBackup?.available&&lifeBackup.value!==null?{lifeActionsRecoveryRaw:lifeBackup.value}:{};
      return {...sceneRecovery,...staminaRecovery,...economyRecovery,...lifeRecovery,recoveryRaw,importRaws,format:'fx-save-conflict-backup-v1',key,local:state,baselineRaw:raw,
        storedRaw:latest.current.available?latest.current.value:null,
        legacyRaw:latest.legacy?.available?latest.legacy.value:null,
        storageReadable:available(latest),saveDiagnostic:{status:status==='saved'&&savedText!==localRaw?'pending':status,reason,failure:failure?{...failure}:null,localCharacters:localRaw?.length??0,storedCharacters:latest.current.value?.length??0}};
    }
  };
}
