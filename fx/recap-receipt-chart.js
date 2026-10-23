import {buildReceiptRecap,receiptRecapBars} from './recap-receipts.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {recapUpperBound} from './recap-timeline.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {formatTradingTime} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

const money=value=>(value>0?'+':value<0?'−':'')+'¥'+Math.abs(value).toLocaleString('zh-CN',{maximumFractionDigits:2});
const node=(doc,tag,attributes={})=>{const element=doc.createElementNS('http://www.w3.org/2000/svg',tag);for(const [key,value]of Object.entries(attributes))element.setAttribute(key,value);return element;};

export function createReceiptRecapChart(doc,snapshot){
 const {timeline}=buildReceiptRecap(snapshot),receipts=receiptRecapBars(timeline);
 const root=doc.createElement('div');root.className='recap-stage-chart recap-receipt-chart';
 const width=(doc.defaultView?.innerWidth||720)<=480?360:720,left=18,right=width-18,zero=112;
 const svg=node(doc,'svg',{viewBox:`0 0 ${width} 230`,role:'img','aria-label':'按成交顺序回看已实现交易收益，向上盈利，向下亏损，金额为日元'});root.append(svg);
 const max=Math.max(1,...receipts.map(receipt=>Math.abs(receipt.value))),slot=(right-left)/Math.max(1,receipts.length),barWidth=Math.min(36,slot*.68);
 svg.append(node(doc,'line',{x1:left,x2:right,y1:zero,y2:zero,stroke:'#d5c4d7','stroke-width':1}));
 const unit=node(doc,'text',{x:left,y:16,fill:'#d5c4d7','font-size':12});unit.textContent='成交收益（¥）';svg.append(unit);
 const bars=receipts.map((receipt,index)=>{
  const x=left+(index+.5)*slot,height=Math.abs(receipt.value)/max*78,loss=receipt.value<0,color=loss?'#8cface':receipt.value>0?'#ff87b2':'#d5c4d7';
  const group=node(doc,'g',{'data-receipt-bar':index,'data-event-id':receipt.eventId,'data-at-ms':receipt.atMs,'data-center':x,'data-event-index':receipt.eventIndex,'data-pnl':receipt.value,'data-summary':receipt.summary,'data-direction':loss?'loss':receipt.value>0?'profit':'flat',opacity:0});
  const title=node(doc,'title');title.textContent=`${receipt.label} · ${formatTradingTime(receipt.timestamp)} JST · ${money(receipt.value)}`;
  const rect=node(doc,'rect',{x:x-barWidth/2,y:loss?zero:zero-height,width:barWidth,height,fill:color,...(receipt.summary?{'fill-opacity':.65,stroke:color,'stroke-dasharray':'3 2'}:{})});
  group.append(rect,title);
  if(!receipt.value)group.append(node(doc,'line',{x1:x-barWidth/2,x2:x+barWidth/2,y1:zero,y2:zero,stroke:color,'stroke-width':3}));
  const every=Math.max(1,Math.ceil(receipts.length/(width<=360?4:8)));
  if(index%every===0||index===receipts.length-1){const label=node(doc,'text',{x,y:211,'text-anchor':'middle',fill:'#d5c4d7','font-size':11});label.textContent=receipt.label;group.append(label);}
  svg.append(group);return {group,receipt,x};
 });
 if(!bars.length){const empty=node(doc,'text',{x:width/2,y:145,'text-anchor':'middle',fill:'#d5c4d7','font-size':14});empty.textContent='今日没有已结成交';svg.append(empty);}
 // A group is hit at its centre, never at a slot edge. Simultaneous receipts
 // retain separate bars; the bracket shows the complete span hit by one scan.
 const anchors=[{progress:0,x:left}];
 for(let i=0;i<bars.length;){let j=i+1;while(j<bars.length&&bars[j].receipt.progress===bars[i].receipt.progress)j++;const point={progress:bars[i].receipt.progress,x:(bars[i].x+bars[j-1].x)/2,first:bars[i].x,last:bars[j-1].x};if(anchors.at(-1).progress===point.progress)anchors[anchors.length-1]=point;else anchors.push(point);i=j;}
 // After the last receipt the scan rests on its centre through the landing.
 if(anchors.at(-1).progress<1)anchors.push({...anchors.at(-1),progress:1});
 const bracket=node(doc,'line',{x1:left,x2:left,y1:zero,y2:zero,stroke:'#ffda86','stroke-width':4,opacity:0,'data-receipt-hit-span':'true'});svg.append(bracket);
 const cursor=node(doc,'line',{x1:left,x2:left,y1:25,y2:192,stroke:'#ffda86','stroke-width':2,'data-receipt-cursor':'true'});svg.append(cursor);
 let shown=0;
 return {root,update(frame){
  const next=frame.complete?bars.length:recapUpperBound(bars,(frame.eventCount||0)-1,bar=>bar.receipt.eventIndex);
  for(let i=Math.min(shown,next);i<Math.max(shown,next);i++)bars[i].group.setAttribute('opacity',next>shown?1:0);
  shown=next;
  const progress=frame.complete?1:frame.receiptScanProgress||0,index=Math.max(0,recapUpperBound(anchors,progress,point=>point.progress)-1),from=anchors[index],to=anchors[index+1]||from;
  const fraction=to===from?0:(progress-from.progress)/Math.max(1e-9,to.progress-from.progress),x=from.x+(to.x-from.x)*fraction;
  cursor.setAttribute('x1',x);cursor.setAttribute('x2',x);
  const hit=anchors[index],sinceHit=(progress-hit.progress)*Math.max(1,timeline.source.finishAt);bracket.setAttribute('x1',hit.first??x);bracket.setAttribute('x2',hit.last??x);bracket.setAttribute('opacity',hit.last>hit.first&&sinceHit>=0&&sinceHit<=150?1:0);
  root.setAttribute('data-scan-state',frame.complete||frame.reconciled?'complete':frame.slowing?'slowing':'scanning');
 }};
}
