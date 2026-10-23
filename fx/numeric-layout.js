// Keep the sign, currency and every digit in one visual token. Placeholder or
// explanatory text stays wrappable; no abbreviated financial values are used.
export function amountToken(value) {
  const text=String(value??'').trim();
  return /^[+−-]?¥\d[\d,]*(?:\.\d+)?$/.test(text)?{text,characters:Array.from(text).length}:null;
}
const selectors=['#equity','#floating','#day-pnl','#free-cash','#used-margin','#reserve-amount','#available-margin','#fees-paid','#external-funding','#day-total','#bankrupt-money','#prop-amount','#amount-selected','#amount-slider-max','#risk-amount','[data-order-field]','.account-row>b','.primary-estimate>b','#preview-fee','#preview-debit','#percent-available-margin','.mobile-quick-amount','#preview-quantity','.ranking-metrics b','.recap-profit','.recap-counter','.recap-stats dd'].join(',');
export function observeNumericLayout(root=document) {
  const update=records=>{
    const changed=new Set();
    if(!records){for(const element of root.querySelectorAll(selectors))changed.add(element);}
    else for(const record of records){
      // Quotes and recap frames change a few values. Do not rescan every
      // position, closed dialog and ranking row after unrelated page mutations.
      const target=record.target.nodeType===1?record.target:record.target.parentElement;
      for(let element=target;element;element=element.parentElement)if(element.matches(selectors))changed.add(element);
      for(const node of record.addedNodes||[]){
        if(node.nodeType!==1)continue;
        if(node.matches(selectors))changed.add(node);
        for(const element of node.querySelectorAll(selectors))changed.add(element);
      }
    }
    for(const element of changed){
      if(element.isConnected===false)continue;
      const text=String(element.textContent??'').trim();
      const tradeValue=['entry','current','quantity'].includes(element.dataset.orderField)
        && /^[+−-]?\d[\d,]*(?:\.\d+)?(?: [A-Z]{3})?$/.test(text);
      const token=amountToken(text)||(tradeValue?{text,characters:Array.from(text).length}:null);
      if(token){
        if(element.dataset.atomicAmount!=='')element.dataset.atomicAmount='';
        const characters=String(token.characters);
        if(element.style.getPropertyValue?.('--amount-characters')!==characters)element.style.setProperty('--amount-characters',characters);
      }
      else if(element.dataset.atomicAmount!==undefined){delete element.dataset.atomicAmount;element.style.removeProperty('--amount-characters');}
    }
  };
  const observer=new MutationObserver(update);observer.observe(root.body,{subtree:true,childList:true,characterData:true});update();
  return ()=>observer.disconnect();
}
