import {DeveloperAccess} from './developer-access.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DeveloperSession} from './developer-session.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {applyDeveloperPatch,developerValues} from './developer.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

export function mountDeveloperUI({root=document,leaderboard,storage,getState,getGeneration,guard,canEdit,backupKey,restore,replace,pause,onTaint,notify,render,now=()=>Date.now()}){
 const $=id=>root.getElementById(id),access=new DeveloperAccess({leaderboard,now});
 const session=new DeveloperSession({access,storage,getState,getGeneration,guard,backupKey,restore,patch:applyDeveloperPatch,replace,onTaint,now});
 const dialog=root.createElement('dialog');dialog.id='developer-access-dialog';dialog.className='developer-dialog';
 // Static explanatory markup only; the server-supplied link is checked by
 // DeveloperAccess before assigning href. This public page has no password UI.
 dialog.innerHTML='<h2>验证开发者模式</h2><p>请在独立服务的本人安全页输入密码。验证会将本局永久标为开发测试，已有成绩退出排行榜；恢复存档也不会撤销。每次编辑都要联网复核。</p><p id="developer-access-status" role="status"></p><p><a id="developer-access-link" target="_blank" rel="noopener noreferrer" hidden>打开本人密码验证页 ↗</a></p><button id="developer-access-check" type="button" disabled>我已验证，检查解锁</button><button id="developer-access-cancel" type="button">取消</button>';
 root.body.append(dialog);
 const editor=$('developer-dialog'),form=$('developer-form'),status=$('developer-access-status'),link=$('developer-access-link'),check=$('developer-access-check');
 let expiryTimer=null,deadline=0,uiGeneration=0;
 function message(text){status.textContent=text;}
 function disableEditor(disabled){for(const element of form.elements)element.disabled=disabled;if(!disabled){$('dev-sanity').disabled=$('dev-auto-sanity').checked;$('developer-restore').disabled=!session.hasBackup();}}
 function clearExpiry(){clearTimeout(expiryTimer);expiryTimer=null;deadline=0;}
 function closeLocally(){uiGeneration++;clearExpiry();disableEditor(true);link.hidden=true;link.removeAttribute('href');check.disabled=true;}
 async function revoke(){closeLocally();try{await session.cancel();}catch{notify('本页开发入口已关闭；服务端撤销未确认，原会话最多 15 分钟后失效。');}}
 function fail(error){message(error.message);notify(error.message);if(editor.open)editor.close();else disableEditor(true);}
 function showEditor(result,generation){
  if(generation!==uiGeneration||!dialog.open||!guard()||!canEdit()||result.expiresAt<=now())throw Error('游戏状态或验证已变化，请重试');
  const state=getState();pause();
  const values=developerValues(state);for(const [key,value] of Object.entries(values))$('dev-'+key).value=value;
  $('dev-auto-sanity').checked=!!state.developer?.edited&&state.developer.sanityOverride===null;
  for(const option of $('dev-phase').options)option.disabled=option.hidden=state.mode==='endless'&&option.value!=='decision';
  if(state.mode==='endless')$('dev-phase').value='decision';
  $('developer-error').textContent=state.position?'请先平仓并等行情暂停，再应用数据。':'已通过本人密码验证。本局永久为开发测试局。';
  disableEditor(false);closeVerifiedDialog('authorized');
  deadline=result.expiresAt;expiryTimer=setTimeout(()=>{if(editor.open){notify('开发会话已过期，请重新输入密码验证。');editor.close('expired');}},Math.max(0,deadline-now()));
  editor.showModal();render();
 }
 async function open(){
  if(session.busy||!guard()||!canEdit())return;
  const generation=++uiGeneration;link.hidden=true;link.removeAttribute('href');check.disabled=true;disableEditor(true);message('正在检查本局开发权限…');dialog.returnValue='';dialog.showModal();
  try{const result=await session.open();if(generation!==uiGeneration)return;if(result.authorized){showEditor(result,generation);return;}link.href=result.url;link.hidden=false;check.disabled=false;message('先打开安全页完成本人登录及密码验证，再回来检查解锁。请求 10 分钟内有效。');}
  catch(error){if(generation===uiGeneration)fail(error);}
 }
 $('developer-open').onclick=open;
 check.onclick=async()=>{if(session.busy)return;const generation=uiGeneration;check.disabled=true;message('正在复核…');try{showEditor(await session.confirm(),generation);}catch(error){if(generation===uiGeneration){message(error.message);check.disabled=false;}}};
 $('developer-access-cancel').onclick=()=>dialog.close('cancelled');
 // Native close events are queued. Invalidate synchronously at the close
 // request, before any pending status/edit promise can resume. The authorized
 // transition alone calls the captured native close without revoking.
 const closeVerifiedDialog=dialog.close.bind(dialog);
 for(const panel of [dialog,editor]){
  const close=panel.close.bind(panel);
  panel.close=value=>{if(!panel.open)return;void revoke();close(value);};
  panel.addEventListener('cancel',event=>{event.preventDefault();panel.close('cancelled');},true);
 }
 $('dev-auto-sanity').onchange=()=>{$('dev-sanity').disabled=$('dev-auto-sanity').checked;};
 async function edit(kind){
  if(session.busy||!editor.open||!guard()||!canEdit())return;
  if(deadline<=now()){editor.close('expired');notify('开发会话已过期，请重新验证');return;}
  const values={};if(kind==='apply'){for(const key of ['cash','reserve','profit','debt','day','beat','price','stress','sanity'])values[key]=Number($('dev-'+key).value);if($('dev-auto-sanity').checked)values.sanity=null;values.phase=$('dev-phase').value;}
  disableEditor(true);try{await session.edit(kind,values);notify(kind==='restore'?'已恢复本局修改前存档；开发测试标记仍保留。':'开发测试数据已应用，原存档可恢复。');}
  catch(error){$('developer-error').textContent=error.message;fail(error);}
 }
 form.onsubmit=event=>{event.preventDefault();void edit('apply');};$('developer-restore').onclick=()=>void edit('restore');
 disableEditor(true);
 return {available:()=>access.configured(),close:async()=>{if(editor.open)editor.close();if(dialog.open)dialog.close();await revoke();}};
}
