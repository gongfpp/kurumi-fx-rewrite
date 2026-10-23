const yen=n=>'¥'+Math.abs(n).toLocaleString('zh-CN',{maximumFractionDigits:2});
// A paid receipt is a static statement. Rendering never schedules animation,
// audio, accounting or a delay before the player can continue.
export function mountLivingReceipt(container,receipt){
 const doc=container.ownerDocument;container.replaceChildren();container.hidden=false;container.className='living-receipt';
 const summary=doc.createElement('div');summary.className='living-receipt-summary';
 const h=doc.createElement('h3');h.textContent='生活费 −'+yen(receipt.amount||0);summary.append(h);
 if(Number.isFinite(receipt.netAssetsAfter)){const balance=doc.createElement('p');balance.textContent='净资产 '+(receipt.netAssetsAfter<0?'−':'')+yen(receipt.netAssetsAfter);summary.append(balance);}
 container.append(summary);
 return{finish(){},dispose(){}};
}
