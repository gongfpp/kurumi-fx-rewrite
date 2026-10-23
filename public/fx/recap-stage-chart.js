import {marketInfo,positionMarket} from './market-book.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {orderedRecapTrades,recapUpperBound} from './recap-timeline.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {formatTradingTime} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const node=(doc,tag,attrs={})=>{const e=doc.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;};
// Compress unrecorded session gaps geometrically, never synthesize market data.
// Timestamp interpolation is only for the replay cursor / receipt marker x-axis.
export function recapCandlePosition(candles,timestamp,{left=0,right=1,end}={}){
 if(!candles.length)return left;
 const slot=(right-left)/candles.length,first=candles[0].timestamp,last=candles.at(-1).timestamp;
 if(timestamp<=first)return left+slot/2;
 const i=recapUpperBound(candles,timestamp,c=>c.timestamp);if(i<candles.length){const a=candles[i-1].timestamp,b=candles[i].timestamp;return left+slot*(i-.5+Math.max(0,Math.min(1,(timestamp-a)/Math.max(1,b-a))));}
 return left+slot*(candles.length-.5+.5*Math.max(0,Math.min(1,(timestamp-last)/Math.max(1,(end??last+900000)-last))));
}
// Reserve a conservative 12 SVG units per character at the 12px label size.
// Pick endpoints before the optional middle tick; omit duplicate/colliding labels
// without moving their timestamps or the candle / trade geometry.
export function recapTimeTicks(candidates,{left,right,gap=8}){
 const kept=[];
 for(const [timestamp,anchor,X] of candidates){
  const label=formatTradingTime(timestamp)+' JST',width=label.length*12;
  const offset=anchor==='end'?width:anchor==='middle'?width/2:0;
  const begin=Math.max(left,Math.min(right-width,X-offset)),finish=begin+width;
  if(width>right-left||kept.some(t=>t.label===label||!(finish+gap<=t.begin||begin>=t.finish+gap)))continue;
  kept.push({timestamp,anchor,x:begin+offset,label,begin,finish});
 }
 return kept.sort((a,b)=>a.timestamp-b.timestamp);
}
export function createRecapStageChart(doc,snapshot){
 const root=doc.createElement('div');root.className='recap-stage-chart';
 const narrow=(doc.defaultView?.innerWidth||720)<=480,width=narrow?360:720,left=narrow?12:24,right=width-72;
 const market=marketInfo(snapshot.chartSymbol);
 const svg=node(doc,'svg',{viewBox:`0 0 ${width} 230`,role:'img','aria-label':`${market.symbol} 当天 K 线与真实成交节点，纵轴日元/${market.name}，按 JST 交易时间回放`});root.append(svg);
 const candles=snapshot.candles||[],trades=orderedRecapTrades(snapshot).map((t,eventIndex)=>({...t,eventIndex})).filter(t=>positionMarket(t)===market.symbol);
 if(!candles.length){const note=doc.createElement('p');note.textContent='今天没有已记录 K 线；仅展示实际成交。';root.append(note);}
 const times=[...candles.map(c=>c.timestamp),...trades.map(t=>t.timestamp),snapshot.timestamp].filter(Number.isFinite),start=times.length?Math.min(...times):0,end=Math.max(start+1,...times,...(Number.isFinite(snapshot.timestamp)?[]:candles.map(c=>c.timestamp+900000)));
 const prices=(candles.length?candles.flatMap(c=>[c.high,c.low]):trades.map(t=>t.exit??t.entry)).filter(Number.isFinite),lo=prices.length?Math.min(...prices):0,hi=prices.length?Math.max(...prices):1,pad=Math.max(.025,(hi-lo)*.14),min=lo-pad,max=hi+pad;
 const x=t=>candles.length?recapCandlePosition(candles,t,{left,right,end}):left+(t-start)/(end-start)*(right-left),y=p=>178-(p-min)/(max-min)*150;
 for(let i=0;i<4;i++){const value=min+(max-min)*i/3,Y=y(value),label=node(doc,'text',{x:right+8,y:Y+4,fill:'#d5c4d7','font-size':11});label.textContent=value.toFixed(3);svg.append(node(doc,'line',{x1:left,x2:right,y1:Y,y2:Y,stroke:'#ffffff19'}),label);}
 const gaps=candles.slice(1).flatMap((c,i)=>c.timestamp-candles[i].timestamp>(candles[i].periodMinutes||15)*90000?[{before:candles[i],after:c}]:[]);
 for(const gap of gaps){const X=(x(gap.before.timestamp)+x(gap.after.timestamp))/2;svg.append(node(doc,'line',{x1:X,x2:X,y1:28,y2:178,stroke:'#ffffff25','stroke-dasharray':'2 5','data-session-gap':'true'}));}
 if(gaps.length)root.title='按已记录 K 线等距排列；时间标签保留真实交易时刻';
 const bars=candles.map((c,i)=>{const g=node(doc,'g',{'data-replay-candle':i,opacity:.18}),color=c.close>=c.open?'#8cface':'#ff87b2',X=x(c.timestamp),w=Math.max(2,Math.min(14,(right-left)/Math.max(1,candles.length)*.65));g.append(node(doc,'line',{x1:X,x2:X,y1:y(c.high),y2:y(c.low),stroke:color,'stroke-width':1.7}),node(doc,'rect',{x:X-w/2,y:Math.min(y(c.open),y(c.close)),width:w,height:Math.max(2,Math.abs(y(c.close)-y(c.open))),fill:color}));svg.append(g);return {g,c};});
 const markers=trades.map(t=>{const c=candles[recapUpperBound(candles,t.timestamp,c=>c.timestamp)-1]||candles[0],price=Number.isFinite(t.exit)?t.exit:Number.isFinite(t.entry)?t.entry:c?.close??0,X=x(t.timestamp),Y=Math.max(27,Math.min(177,y(price))),g=node(doc,'g',{'data-replay-trade':t.eventIndex,'data-replay-symbol':market.symbol,opacity:0}),color=t.type==='open'?'#c4b2ff':t.pnl>=0?'#83f8c3':'#ff90b2',title=node(doc,'title');title.textContent=`${formatTradingTime(t.timestamp)} ${market.symbol} ${t.type==='open'?'开仓':'平仓'} · 成交价 ${price.toFixed(3)}${Number.isFinite(t.pnl)?' · 盈亏 ¥'+t.pnl.toFixed(2):''}`;g.append(node(doc,'circle',{cx:X,cy:Y,r:7,fill:'#272031',stroke:color,'stroke-width':2}),title);const label=node(doc,'text',{x:X,y:Y-12,'text-anchor':'middle',fill:color,'font-size':12});label.textContent=t.type==='open'?'开':t.pnl>=0?'+':'−';g.append(label);svg.append(g);return{g,t,eventIndex:t.eventIndex};});
 const cursor=node(doc,'line',{x1:24,x2:24,y1:18,y2:187,stroke:'#ffda86','stroke-width':2,'stroke-dasharray':'4 4'}),head=node(doc,'circle',{cx:24,cy:18,r:4,fill:'#ffda86'});svg.append(cursor,head);
 const middle=candles[Math.floor(candles.length/2)]?.timestamp??(start+end)/2,ticks=[[end,'end',x(end)],[start,'start',x(start)],...(!narrow?[[middle,'middle',x(middle)]]:[])];
 for(const tick of recapTimeTicks(ticks,{left,right})){const label=node(doc,'text',{x:tick.x,y:215,fill:'#c5b6cc','font-size':12,'text-anchor':tick.anchor});label.textContent=tick.label;svg.append(label);}
 // Existing completed-day candles form a dim context from entry; the replay
 // highlights only the recorded cursor position, without fabricating missing bars.
 // Only changed bars/markers touch the DOM. Replays and reverse seeks use the
 // same delta ranges, so there is no full opacity rewrite on every RAF.
 const reveals=bars.map(({g,c})=>({g,at:Math.min(c.availableAt??c.timestamp+(c.periodMinutes||15)*60000,end)})).sort((a,b)=>a.at-b.at);
 let shownBars=0,shownMarkers=0,lastX=null,lastScanState=null,lastRadius=null;
 const reveal=(items,from,to,dim=0)=>{for(let i=Math.min(from,to);i<Math.max(from,to);i++)items[i].g.setAttribute('opacity',to>from?1:dim);};
 return{root,update(frame){
  const t=frame.scanTime??frame.timestamp??end,settling=!!frame.scoringEvent,finished=frame.complete||frame.reconciled;
  // The last candle remains a dim context until the shared clock has completed
  // the final amount beat. Reaching a closing receipt is not a completed replay.
  const eligible=frame.complete?reveals.length:recapUpperBound(reveals,t,c=>c.at),nextBars=frame.reconciled===false?Math.min(eligible,Math.max(0,reveals.length-1)):eligible,nextMarkers=frame.complete?markers.length:recapUpperBound(markers,(frame.eventCount||0)-1,m=>m.eventIndex);
  reveal(reveals,shownBars,nextBars,.18);reveal(markers,shownMarkers,nextMarkers);shownBars=nextBars;shownMarkers=nextMarkers;
  const X=x(t);if(X!==lastX){cursor.setAttribute('x1',X);cursor.setAttribute('x2',X);head.setAttribute('cx',X);lastX=X;}
  const state=finished?'complete':settling?'settling':'scanning';
  if(state!==lastScanState){root.dataset?root.dataset.scanState=state:root.setAttribute?.('data-scan-state',state);cursor.setAttribute('stroke-width',settling?3.5:2);lastScanState=state;}
  const radius=settling?(frame.scoreBeat&&frame.elapsed-frame.scoreBeat.atMs<=150?7:5):4;
  if(radius!==lastRadius){head.setAttribute('r',radius);lastRadius=radius;}
 }};
}
