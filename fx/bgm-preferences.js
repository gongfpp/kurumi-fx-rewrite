export const BGM_PREFERENCES_KEY='fx-bgm-preferences-v1';
export const BGM_DEFAULT_VOLUME=.2;
// No BGM preference existed before v1. Respect the old explicit global mute;
// absence of a value is the new default, never permission to overwrite old saves.
export function readBgmPreferences(storage) {
  const quiet={enabled:false,volume:BGM_DEFAULT_VOLUME,mode:'follow',selectedId:null};
  try {
    const entry=storage.readItem?.(BGM_PREFERENCES_KEY);
    if(entry&&!entry.available)return quiet;
    const raw=entry?entry.value:storage.getItem(BGM_PREFERENCES_KEY);
    if(raw!==null){
      const saved=JSON.parse(raw);
      if(saved?.version!==1||typeof saved.enabled!=='boolean')return quiet;
      return {enabled:saved.enabled,volume:Number.isFinite(saved.volume)?Math.max(0,Math.min(.65,saved.volume)):BGM_DEFAULT_VOLUME,
        mode:saved.mode==='manual'?'manual':'follow',selectedId:typeof saved.selectedId==='string'?saved.selectedId:null};
    }
    const legacy=storage.readItem?.('fx-girl-settings');
    if(legacy&&!legacy.available)return quiet;
    return {...quiet,enabled:(legacy?legacy.value:storage.getItem('fx-girl-settings'))!=='mute'};
  }catch{return quiet;}
}

// Host lifecycle pauses do not change preferences. Explicit controls do, while
// failed persistence leaves this session usable and never writes other save keys.
export function bindBgmPreferences(player,{storage,document=globalThis.document}={}) {
  const saved=readBgmPreferences(storage),previous=player.onPreference;
  player.setVolume(saved.volume);
  if(saved.mode==='manual'&&saved.selectedId)void player.selectTrack(saved.selectedId);
  player.onPreference=state=>{
    previous?.(state);
    try{storage.setItem(BGM_PREFERENCES_KEY,JSON.stringify({version:1,enabled:state.wanted&&!state.muted,
      volume:state.volume,mode:state.mode,selectedId:state.selectedId}));}catch{/* Keep the current user choice even when storage is unavailable. */}
  };
  const resume=event=>{
    if(!event?.isTrusted||event.repeat||event.ctrlKey||event.metaKey||event.altKey)return;
    // Let a keyboard-activated music control apply its choice before fallback.
    if(event.type==='keydown'&&event.target?.closest?.('.bgm-panel'))return;
    const state=player.getState();
    if(!state.hidden&&!state.destroyed&&state.wanted&&!state.muted&&!state.unlocked)void player.play(event);
  };
  document?.addEventListener('click',resume);document?.addEventListener('keydown',resume);
  if(saved.enabled)void player.startAutomatically();
  return ()=>{document?.removeEventListener('click',resume);document?.removeEventListener('keydown',resume);player.onPreference=previous;};
}
