// History is selected in the opening panel, without a second confirmation step.
export function mountMarketSourcePicker({document,library,onSelect=()=>{},importFile,acquireHistory,cancelAcquire=()=>{},getMode=()=>null}){
 const $=id=>document.getElementById(id),panel=$('history-choice-step');
 let rows=[],loading=null,target='mode',ready=false,busy=false,failed=false,generation=0,request=null,requestMode=null,importController=null;
 const status=text=>{$('history-choice-status').textContent=text;};
 const rowFor=()=>rows.find(r=>r.date==='2014-02-14');
 function paint(){$('history-file-open').hidden=rows.length>0;$('history-file-open').disabled=busy;$('history-choice-retry').hidden=!failed||busy;panel.setAttribute?.('aria-busy',String(busy));}
 function show(prefix){target=prefix;const anchor=document.querySelector?.(`[data-market-prefix="${prefix}"][data-market="historical"]`)?.parentElement;anchor?.after(panel);panel.hidden=false;paint();}
 function cancel(){generation++;cancelAcquire();importController?.abort();request=null;busy=false;paint();}
 function choose(prefix,market){if(market!=='historical'){cancel();if(target===prefix)panel.hidden=true;}$(prefix+'-market').value=market;for(const b of document.querySelectorAll(`[data-market-prefix="${prefix}"]`)){const active=b.dataset.market===market;b.setAttribute('aria-pressed',String(active));b.classList.toggle('selected',active);}if(market==='historical')show(prefix);onSelect(prefix,market);}
 async function load(){
  if(loading)return loading;
  loading=(async()=>{try{
   await library.catalog();const found=[];for(const dataset of library.datasets){const p=await library.provider(dataset);for(const d of p.manifest.days)found.push({datasetId:dataset.id,date:d.date});}rows=found.sort((a,b)=>a.date.localeCompare(b.date));
   ready=true;
   if(!panel.hidden)show(target);return rows;
  }finally{loading=null;paint();}})();return loading;
 }
 async function activate(prefix,mode=getMode(prefix)||'endless'){
  if(request&&target===prefix)return request;
  cancel();requestMode=mode;choose(prefix,'historical');const token=generation;busy=true;failed=false;status('正在读取历史行情…');paint();
  request=(async()=>{await Promise.resolve();try{
   if(!ready)await load();if(token!==generation)return;
   if(!rowFor(prefix,mode)){
    if(!acquireHistory)throw Error('这台设备还没有历史行情。可选择本机文件。');
    const dataset='2014-02';
    await acquireHistory({datasets:[dataset]});if(token!==generation)return;ready=false;await load();
   }
   if(token!==generation)return;if(!rowFor(prefix,mode))throw Error(mode==='story'?'缺少2014年2月14日历史行情，无法开始剧情':'这一年暂无可用的历史行情');status('');show(prefix);
  }catch(error){if(token!==generation)return;failed=true;status(error.name==='TimeoutError'?'历史行情载入超时，请重试。':error.message||'历史行情暂时无法读取，请重试。');}finally{if(token===generation){busy=false;request=null;paint();}}})();return request;
 }
 for(const b of document.querySelectorAll('[data-market-prefix]'))b.onclick=()=>b.dataset.market==='historical'?activate(b.dataset.marketPrefix):choose(b.dataset.marketPrefix,b.dataset.market);
 for(const prefix of ['mode','restart'])$(prefix+'-dialog').addEventListener?.('close',()=>{if(target===prefix){cancel();panel.hidden=true;}});
 $('history-choice-retry').onclick=()=>{ready=false;return activate(target,requestMode||undefined);};
 $('history-file-open').onclick=()=>$('history-local-file').click();
 $('history-local-file').onchange=async e=>{const file=e.target.files?.[0];if(!file||busy)return;const token=generation;importController=new AbortController();busy=true;failed=false;status('正在读取历史文件…');paint();try{await importFile(file,{signal:importController.signal});if(token!==generation)return;ready=false;await load();if(token===generation)status('');}catch(error){if(token===generation){failed=true;status(error.message||'这个历史文件无法读取。');}}finally{e.target.value='';if(token===generation){busy=false;paint();}}};
 return {load,select:choose,async options(prefix,mode='endless'){
  if(!ready)await load();
  if(!rowFor(prefix,mode)&&acquireHistory&&(!request||requestMode!==mode)){if(request)cancel();void activate(prefix,mode);}
  const token=generation,pending=request;if(pending&&!rowFor(prefix,mode))await pending;
  if(token!==generation||$(prefix+'-market').value!=='historical')throw Error('已取消历史行情载入');
  const chosen=rowFor(prefix,mode);if(!chosen){const text=mode==='story'?'缺少2014年2月14日历史行情，无法开始剧情':'历史行情尚未载入，请在开局界面重试';status(text);throw Error(text);}
  const result=await library.options(chosen.datasetId,chosen.date);if(token!==generation||$(prefix+'-market').value!=='historical')throw Error('已取消历史行情载入');return result;
 }};
}
