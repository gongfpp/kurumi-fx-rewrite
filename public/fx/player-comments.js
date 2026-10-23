import {randomUUID} from './uuid.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {serviceConfiguration} from './service-config.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {kurumiStorage} from './storage-namespace.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Match the API's existing nickname rules without rewriting the player's input.
const commentAliasError=value=>{
 const alias=value.normalize('NFKC').trim().replace(/\s+/gu,' ');
 if([...alias].length>16)return '昵称最多 16 字，请缩短后重试。';
 if(!/^[\p{L}\p{N} ._-]*$/u.test(alias))return '昵称含不支持的符号，请使用文字、数字、空格或 . _ -。';
 return '';
};

// Render every user-controlled value as text, never markup or links.
export function renderPlayerComments(list,rows,{document=list.ownerDocument}={}){
 const fragment=document.createDocumentFragment();
 for(const row of rows.slice(0,50)){
  const item=document.createElement('li'),author=document.createElement('strong'),text=document.createElement('span');
  item.dataset.commentId=row.id;author.textContent=`${row.alias || '匿名玩家'}：`;text.textContent=row.text;
  item.append(author,text);fragment.append(item);
 }
 list.replaceChildren(fragment);
}
export function mountPlayerComments(root,{document=root.ownerDocument,fetch=globalThis.fetch.bind(globalThis),configuration=serviceConfiguration(),getAlias=()=>document.getElementById('ranking-name')?.value||'',storage,crypto=globalThis.crypto,onPublicRows=()=>{},onFailure=()=>{}}={}){
 const form=root.querySelector('form'),input=root.querySelector('textarea'),button=form.querySelector('button'),status=root.querySelector('[role=status]'),list=root.querySelector('ul'),identity=root.querySelector('[data-comment-author]');
 let pending=false,reading=false,disposed=false,composing=false,attempt=null,visitor=null,revision=0,publicRows=[],composerStatus=false;
 try{storage??=kurumiStorage();visitor=storage.getItem('fx-api-v1-comment-visitor');if(!/^[a-zA-Z0-9_-]{16,80}$/.test(visitor||'')){visitor=randomUUID(crypto);storage.setItem('fx-api-v1-comment-visitor',visitor);}}catch{visitor=randomUUID(crypto);}
 const author=()=>getAlias().trim()||'匿名玩家';
 const showAuthor=()=>{identity.textContent=`以「${author()}」留言，所有玩家可见。请勿填写个人隐私。`;};
 const requestFailures=new WeakSet();
 const failure=(kind,status=0)=>{const error=Object.assign(new Error('Comment request failed'),{kind,status});requestFailures.add(error);return error;};
 const reportFailure=(scope,error)=>{try{onFailure(scope,error.kind,error.status)?.catch?.(()=>{});}catch{}};
 const sendFailureCopy=error=>{
  if(error.kind==='network-error')return '发送结果暂未确认，重试不会重复留言。';
  if(error.kind==='timeout')return '发送结果暂未确认，重试不会重复留言。';
  if(error.kind==='invalid-response')return '留言未获确认，请重试';
  if(error.status===429)return '留言发送较快，请稍等 30 秒再试';
  if(error.status===400)return '留言未通过校验，请检查内容和昵称后重试。';
  if(error.status===409)return '留言编号已使用，请重新发送';
  return '留言暂不可用，请稍后重试';
 };
 const validRow=row=>row&&typeof row==='object'&&typeof row.id==='string'&&typeof row.alias==='string'&&typeof row.text==='string';
 const request=async(options={},expectedId=null)=>{
  const controller=new AbortController(),writing=options.method==='POST';let timeout,status=0;
  // Bound fetch and body decoding even if an embedded transport ignores abort.
  // The late result is consumed by the race but can never update composer state.
  const deadline=new Promise((_resolve,reject)=>{timeout=setTimeout(()=>{reject(failure('timeout',status));controller.abort();},12000);});
  try{
   return await Promise.race([deadline,(async()=>{
    const response=await fetch(configuration.origin+'/api/fx/comments',{credentials:'omit',cache:'no-store',...options,signal:controller.signal});
    status=Number.isInteger(response.status)&&response.status>=100&&response.status<=599?response.status:0;
    if(!response.ok)throw failure('http-error',status);
    const result=await response.json();
    if(!result||typeof result!=='object'||(writing?result.ok!==true||!result.row||!validRow(result.row)||result.row.id!==expectedId:!Array.isArray(result.rows)||!result.rows.every(validRow)))throw failure('invalid-response',status);
    return result;
   })()]);
  }catch(error){
   const classified=requestFailures.has(error)?error:failure(error?.name==='AbortError'?'timeout':error?.name==='SyntaxError'?'invalid-response':'network-error',status);
   reportFailure(writing?'comments-write':'comments-read',classified);throw classified;
  }finally{clearTimeout(timeout);}
 };
 async function refresh(){
  if(disposed||reading||pending||document.hidden||!configuration.configured)return;
  reading=true;const startedRevision=revision;
  try{const data=await request();if(disposed||pending||startedRevision!==revision)return;publicRows=Array.isArray(data.rows)?data.rows.slice(0,50):[];renderPlayerComments(list,publicRows);onPublicRows(publicRows);if(!composerStatus)status.textContent=data.rows.length?'':'还没有玩家留言。';}
  catch{if(!disposed&&!pending&&!composerStatus&&startedRevision===revision)status.textContent='暂时读不到留言，稍后会重试。';}finally{reading=false;}
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(pending||!configuration.configured)return;if(disposed||composing||event.isComposing)return;
  composerStatus=true;revision++;
  const text=input.value.trim(),alias=getAlias().trim();if(!text||[...text].length>200){status.textContent='请输入 1–200 字的留言。';return;}
  const aliasError=commentAliasError(alias);if(aliasError){status.textContent=aliasError;return;}
  if(!attempt||attempt.text!==text||attempt.alias!==alias)attempt={id:randomUUID(crypto),visitor,text,alias};
  pending=true;button.disabled=true;input.disabled=true;status.textContent='正在公开发送…';
  try{const result=await request({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(attempt)},attempt.id);if(disposed)return;
   revision++;const row=result.row,item=document.createElement('li'),name=document.createElement('strong'),message=document.createElement('span');name.textContent=`${row.alias}：`;message.textContent=row.text;item.dataset.commentId=row.id;for(const old of [...list.children])if(old.dataset.commentId===row.id)old.remove();item.append(name,message);list.prepend(item);while(list.children.length>50)list.lastElementChild.remove();publicRows=[row,...publicRows.filter(old=>old.id!==row.id)].slice(0,50);onPublicRows(publicRows);input.value='';attempt=null;status.textContent='已公开发送。';
  }catch(error){if(error.kind==='http-error'&&error.status===409)attempt=null;if(!disposed)status.textContent=sendFailureCopy(error);}
  finally{pending=false;if(!disposed){button.disabled=false;input.disabled=false;}}
 });
 // Selecting an IME candidate is not consent to publish the unfinished draft.
 // Wait for compositionend and a fresh submit; never auto-send on compositionend.
 input.addEventListener('compositionstart',()=>{composing=true;});
 input.addEventListener('compositionend',()=>{composing=false;});
 input.addEventListener('input',()=>{if(!pending){composerStatus=false;status.textContent='';}});
 input.addEventListener('focus',showAuthor);document.getElementById('ranking-name')?.addEventListener('input',showAuthor);showAuthor();
 if(configuration.configured){refresh();}else{button.disabled=true;status.textContent='留言服务尚未配置。';}
 const timer=setInterval(refresh,30000);document.addEventListener('visibilitychange',refresh);
 return {refresh,dispose(){disposed=true;clearInterval(timer);document.removeEventListener('visibilitychange',refresh);}};
}
