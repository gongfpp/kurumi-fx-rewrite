// Presentation only: no game-state writes, original artwork, or unlock hints.
const silhouettes=Object.freeze({dailyDrink:'can',takeaway:'box',noodles:'bowl',energy:'can',celebration:'towel',father:'wallet',mochiko:'person'});
export function renderUndiscoveredItems({document,box,ids,discoveredIds}){
 const hidden=new Set(ids.filter(id=>!discoveredIds.has(id)));
 for(const node of [...box.children])if(node.dataset.undiscoveredProp&&!hidden.has(node.dataset.undiscoveredProp))node.remove();
 for(const id of hidden){
  if([...box.children].some(node=>node.dataset.undiscoveredProp===id))continue;
  const button=document.createElement('button');button.type='button';button.className='item-undiscovered';button.dataset.undiscoveredProp=id;button.disabled=true;
  button.setAttribute('aria-label','未发现的道具，暂不可使用');
  const art=document.createElement('span');art.className='item-silhouette-art';art.setAttribute('aria-hidden','true');
  const silhouette=document.createElement('span');silhouette.className=`item-silhouette item-silhouette--${silhouettes[id]||'box'}`;silhouette.setAttribute('aria-hidden','true');
  const label=document.createElement('b');label.textContent='未发现';
  const lock=document.createElement('span');lock.className='item-silhouette-lock';lock.setAttribute('aria-hidden','true');
  art.append(silhouette,lock);button.append(art,label);box.append(button);
 }
}
