import {bindBgmLifecycle} from './bgm-player.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

const STATUS={empty:'曲目还在准备中',muted:'背景音乐已静音',paused:'背景音乐已暂停',loading:'正在载入曲目…',hidden:'切到后台，音乐已暂停',playing:'正在播放',destroyed:'播放器已关闭'};
const TAGS={neutral:'日常',focus:'专注',tension:'紧张',gain:'盈利',loss:'亏损',crisis:'危机',numb:'麻木',relief:'缓和'};
const time=seconds=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
const canPause=state=>state.wanted&&!state.muted&&(!state.error||state.playing);

// Mount into a dedicated empty element. Returned dispose() removes only this panel.
// The caller owns the player and should destroy it when leaving the game entirely.
export function mountBgmPanel(root,player,{lifecycle=true}={}) {
  if(!root?.ownerDocument)throw new TypeError('BGM panel needs a DOM root');
  const doc=root.ownerDocument,controls={},disposers=[];
  const node=(tag,cls,text)=>{const el=doc.createElement(tag);if(cls)el.className=cls;if(text)el.textContent=text;return el;};
  const listen=(el,type,fn)=>{el.addEventListener(type,fn);disposers.push(()=>el.removeEventListener(type,fn));};
  const button=(key,label,fn)=>{const el=node('button','bgm-button',label);el.type='button';controls[key]=el;listen(el,'click',fn);return el;};
  const panel=node('section','bgm-panel');panel.setAttribute('aria-label','背景音乐');
  const header=node('div','bgm-heading');header.append(node('span','bgm-eyebrow','BGM'),node('strong','','背景音乐'));
  const status=node('span','bgm-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');header.append(status);panel.append(header);
  const now=node('div','bgm-now'),title=node('strong','bgm-title'),artist=node('span','bgm-artist');now.append(title,artist);panel.append(now);
  const transport=node('div','bgm-transport');
  transport.append(button('play','播放',event=>{if(canPause(player.getState()))player.pause();else void player.play(event);}),
    button('next','下一首',event=>void player.next({event})),button('mute','取消静音',event=>void player.setMuted(!player.getState().muted,event)));
  const volumeLabel=node('label','bgm-volume','音量');const volume=node('input');volume.type='range';volume.min='0';volume.max='65';volume.step='1';volume.setAttribute('aria-label','背景音乐音量，最高 65%');
  const volumeValue=node('output');volumeLabel.append(volume,volumeValue);transport.append(volumeLabel);panel.append(transport);
  listen(volume,'input',()=>player.setVolume(Number(volume.value)/100));
  const modes=node('div','bgm-modes');modes.setAttribute('role','group');modes.setAttribute('aria-label','背景音乐选曲方式');
  modes.append(button('follow','自动切换',()=>void player.setMode('follow')),button('manual','手动选曲',()=>void player.setMode('manual')));panel.append(modes);
  const sceneLabel=node('p','bgm-scene');sceneLabel.setAttribute('aria-live','polite');panel.append(sceneLabel);
  const hint=node('p','bgm-hint','背景音乐默认开启；浏览器限制时，点击页面后播放。静音、暂停和音量会记住。自动切换会跟随交易、结算和剧情换曲，播完后续播相近曲目；手动选曲或下一首会改为按列表顺序播放。');panel.append(hint);
  const catalog=node('details','bgm-catalog'),summary=node('summary','','曲目列表与授权信息'),list=node('ul','bgm-tracks');catalog.append(summary,list);panel.append(catalog);
  const trackButtons=new Map();
  for(const track of player.tracks){
    const item=node('li'),pick=node('button','bgm-track');pick.type='button';
    pick.append(node('span','bgm-track-title',track.title),node('small','',`${track.artist} · ${time(track.duration)} · ${track.sceneTags.map(tag=>TAGS[tag]).join(' / ')}`));
    pick.setAttribute('aria-label',`选择 ${track.title}，${track.artist}`);listen(pick,'click',event=>void player.selectTrack(track.id,{event}));trackButtons.set(track.id,pick);item.append(pick);
    const credit=node('details','bgm-credit'),caption=node('summary','','作者与许可');credit.append(caption,node('p','',track.credit));if(track.modifications)credit.append(node('p','bgm-modifications',track.modifications));
    const link=(text,url)=>{const a=node('a','',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;};
    const links=node('p','bgm-credit-links');links.append(link('作品来源',track.sourceUrl),link(track.license.name,track.license.url));credit.append(links);
    item.append(credit);list.append(item);
  }
  if(!player.tracks.length)list.append(node('li','bgm-empty','仅在作品、作者和授权核验完成后加入真实曲目。'));
  root.append(panel);
  const unsubscribe=player.subscribe(state=>{
    const disabled=!state.tracks.length||state.destroyed;
    panel.dataset.status=state.status;panel.dataset.mode=state.mode;sceneLabel.textContent=state.mode==='follow'?`自动切换 · ${TAGS[state.scene]||'日常'}`:'手动选曲 · 按曲目列表顺序播放';status.textContent=state.error==='blocked'?'点击页面后播放背景音乐':state.error?'曲目暂时无法播放，请重试或换一首':STATUS[state.status]||'';
    title.textContent=state.track?.title||'暂无已核验曲目';artist.textContent=state.track?`${state.track.artist}${state.voiceActive?' · 对白期间自动降低音量':''}`:'';
    for(const el of Object.values(controls))el.disabled=disabled;
    controls.play.textContent=canPause(state)?'暂停':state.error?'重试':'播放';controls.play.setAttribute('aria-label',canPause(state)?'暂停背景音乐':state.error?'重试背景音乐':'播放背景音乐');
    controls.mute.textContent=state.muted?'取消静音':'静音';controls.mute.setAttribute('aria-pressed',String(state.muted));
    controls.next.disabled=disabled||state.tracks.length<2;
    for(const mode of ['follow','manual'])controls[mode].setAttribute('aria-pressed',String(state.mode===mode));
    volume.disabled=disabled;volume.value=String(Math.round(state.volume*100));volumeValue.textContent=`${Math.round(state.volume*100)}%`;volume.setAttribute('aria-valuetext',volumeValue.textContent);
    for(const [id,el] of trackButtons){el.disabled=disabled;el.setAttribute('aria-pressed',String(id===state.selectedId));}
  });
  const unbind=lifecycle?bindBgmLifecycle(player,{document:doc,page:doc.defaultView}):()=>{};
  return {element:panel,dispose(){unsubscribe();unbind();for(const dispose of disposers)dispose();panel.remove();}};
}
