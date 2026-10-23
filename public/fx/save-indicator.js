// Presentation only: never delays, coalesces or changes a durable save.
export function createSaveIndicator(element,{delay=700,minimum=600,now=()=>performance.now(),schedule=setTimeout,cancel=clearTimeout}={}) {
  let session=null,timer=null,pendingSince=null,shownSince=null,warning=false;
  const put=(key,value)=>{if(element[key]!==value)element[key]=value;};
  const clear=()=>{if(timer!==null)cancel(timer);timer=null;};
  function update(next) {
    if(next!==session){clear();session=next;pendingSince=null;shownSince=null;warning=false;}
    const status=session.status,blocked=session.blocked,pending=status==='pending',saved=status==='saved';
    clear();
    if(blocked||(!saved&&!pending)||(pending&&!!session.reason))warning=true;
    else if(saved)warning=false;
    element.dataset.saveWarning=String(warning);
    const title=blocked?'已暂停本页，未覆盖其他页面的进度':saved?'进度已保存':pending?'正在保存，完成前请勿刷新或关闭':'浏览器暂时无法安全保存，刷新或关闭后本页进度会丢失';
    put('title',title);
    if(warning){
      pendingSince=null;shownSince=null;
      put('textContent',blocked?'存档待处理':'进度仅在本页');
    }else if(pending){
      pendingSince??=now();
      const remaining=delay-(now()-pendingSince);
      if(shownSince!==null||remaining<=0){shownSince??=now();put('textContent','保存中');}
      else {put('textContent','✓');timer=schedule(()=>update(session),remaining);}
    }else{
      pendingSince=null;
      const remaining=shownSince===null?0:minimum-(now()-shownSince);
      if(remaining>0)timer=schedule(()=>update(session),remaining);
      else {shownSince=null;put('textContent','✓');}
    }
    return {warning};
  }
  return {update,destroy:clear};
}
