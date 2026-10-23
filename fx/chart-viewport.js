import {marketInfo} from './market-book.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {movingAveragePath} from './moving-average.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {formatTradingTime,timeAxisTicks} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const price=v=>Number(v).toFixed(3);
// Presentation only: source OHLC, timestamps and moving averages are never edited.
export function candleWindow(candles,{count=12,offset=0}={}){
 const length=candles.length,size=count>0?Math.min(length,Math.max(1,Math.trunc(count))):length;
 const back=clamp(Math.trunc(offset)||0,0,Math.max(0,length-size)),end=length-back,start=Math.max(0,end-size);
 return{candles:candles.slice(start,end),start,end,total:length,offset:back,hiddenBefore:start,hiddenAfter:length-end};
}
export function candleScale(candles,averages=[],{zoom=1,center}={}){
 const values=candles.flatMap(c=>[c.low,c.high]).concat(averages.flatMap(a=>a.values)).filter(Number.isFinite);
 const min=values.length?Math.min(...values):0,max=values.length?Math.max(...values):1,padding=Math.max(.01,(max-min)*.08);
 const fullLow=Math.max(.000001,min-padding),fullHigh=max+padding,factor=clamp(Number(zoom)||1,1,128),span=(fullHigh-fullLow)/factor;
 const middle=factor===1?(fullHigh+fullLow)/2:Number.isFinite(center)?center:candles.at(-1)?.close??(fullHigh+fullLow)/2;
 const low=Math.max(.000001,middle-span/2),high=low+span;
 return{low,high,zoom:factor,fullLow,fullHigh,clippedCandles:candles.filter(c=>c.low<low||c.high>high).length,clippedAverages:averages.filter(a=>a.values.some(v=>Number.isFinite(v)&&(v<low||v>high))).length};
}
// Monetary curves have irregular timestamps; index-based tick selection can overlap.
export function spacedTimeTicks(points,x,{maxTicks=4,gap=84}={}){
 const candidates=timeAxisTicks(points,{maxTicks}),last=candidates.at(-1);if(candidates.length<2)return candidates;
 const result=[candidates[0]];
 for(const tick of candidates.slice(1,-1))if(x(tick)-x(result.at(-1))>=gap&&x(last)-x(tick)>=gap)result.push(tick);
 if(x(last)-x(result.at(-1))>=gap)result.push(last);return result;
}
export function candlePlot(candles,averages=[],{count=12,offset=0,zoom=1,height=280,width=660,headerHeight=0,dark=true,id='market',visibleCount=Infinity,currentPrice,symbol='USD/JPY',timeLabel='游戏时间 JST'}={}){
 const market=marketInfo(symbol),window=candleWindow(candles,{count,offset}),bars=window.candles,ma=averages.map(a=>({...a,values:a.values.slice(window.start,window.end)}));
 const scale=candleScale(bars,ma,{zoom}),w=Number.isFinite(width)&&width>0?width:660,left=12,right=75,top=20+Math.max(0,Number(headerHeight)||0),bottom=38,h=Number.isFinite(height)&&height>0?height:280,plotBottom=h-bottom;
 const y=v=>top+(scale.high-v)/(scale.high-scale.low)*(plotBottom-top),dx=(w-left-right)/Math.max(1,bars.length),x=i=>left+dx*(i+.5),labelColor=dark?'#c9c2d2':'#705565',grid=dark?'#494454':'#dcc3d0';
 // Cap sparse bodies without moving their timestamp slots or changing price geometry.
 const bodyWidth=Math.min(24,Math.max(1,dx*.54));
 const clip=`candle-clip-${id}`,parts=[`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMinYMin meet" role="img" aria-label="${market.symbol} 已发生行情，纵轴日元/${market.name}，横轴${timeLabel}"><defs><clipPath id="${clip}"><rect x="${left}" y="${top}" width="${w-left-right}" height="${plotBottom-top}"/></clipPath></defs>`];
 for(let i=0;i<5;i++){const value=scale.high-(scale.high-scale.low)*i/4,Y=y(value);parts.push(`<line x1="${left}" x2="${w-right}" y1="${Y}" y2="${Y}" stroke="${grid}" stroke-dasharray="3 5"/><text x="${w-right+8}" y="${Y+4}" fill="${labelColor}" font-size="11">${price(value)}</text>`);}
 bars.forEach((c,i)=>{const X=x(i),color=c.close>=c.open?(dark?'#8ae4bf':'#248b68'):(dark?'#f58cba':'#bc4276'),globalIndex=window.start+i;
  const title=`${formatTradingTime(c.timestamp,{full:true})} · 开 ${price(c.open)} / 高 ${price(c.high)} / 低 ${price(c.low)} / 收 ${price(c.close)}`;
  parts.push(`<g data-recap-candle="${globalIndex}" opacity="${globalIndex<visibleCount?1:.12}"><title>${title}</title><g clip-path="url(#${clip})"><line x1="${X}" x2="${X}" y1="${y(c.high)}" y2="${y(c.low)}" stroke="${color}" stroke-width="1.5"/><rect x="${X-bodyWidth/2}" y="${Math.min(y(c.open),y(c.close))}" width="${bodyWidth}" height="${Math.max(1.5,Math.abs(y(c.open)-y(c.close)))}" fill="${color}"/></g>`);
  if(c.high>scale.high)parts.push(`<path data-clipped="high" d="M${X-4},${top+7}L${X},${top}L${X+4},${top+7}" fill="none" stroke="${color}" stroke-width="2"><title>超出纵轴：实际最高 ${price(c.high)}</title></path>`);
  if(c.low<scale.low)parts.push(`<path data-clipped="low" d="M${X-4},${plotBottom-7}L${X},${plotBottom}L${X+4},${plotBottom-7}" fill="none" stroke="${color}" stroke-width="2"><title>超出纵轴：实际最低 ${price(c.low)}</title></path>`);
  parts.push('</g>');
 });
 for(const a of ma){const path=movingAveragePath(a.values,{x,y});if(path)parts.push(`<path data-ma="${a.period}" clip-path="url(#${clip})" d="${path}" fill="none" stroke="${a.color}" stroke-width="1.5"/>`);}
 for(const tick of timeAxisTicks(bars,{maxTicks:3})){parts.push(`<text x="${x(tick.index)}" y="${h-9}" text-anchor="${tick.index===0?'start':tick.index===bars.length-1?'end':'middle'}" fill="${labelColor}" font-size="11">${tick.label}</text>`);}
 if(Number.isFinite(currentPrice)&&!window.hiddenAfter){const Y=clamp(y(currentPrice),top,plotBottom),arrow=currentPrice>scale.high?'↑ ':currentPrice<scale.low?'↓ ':'';parts.push(`<line clip-path="url(#${clip})" x1="${left}" x2="${w-right}" y1="${y(currentPrice)}" y2="${y(currentPrice)}" stroke="#cf7ba5" stroke-dasharray="4 4"/><rect x="${w-right+3}" y="${Y-10}" width="69" height="20" rx="3" fill="#f2a5c8"/><text x="${w-right+37}" y="${Y+4}" text-anchor="middle" fill="#2b2230" font-size="10">${arrow}${price(currentPrice)}</text>`);}
 parts.push('</svg>');
 const hidden=window.hiddenBefore+window.hiddenAfter,notice=[`${window.total?window.start+1:0}–${window.end} / ${window.total} 根`,hidden?`窗外 ${hidden} 根，选“全部”查看`:'全部已记录行情',scale.zoom>1?`纵轴 ${scale.zoom}×`:'完整纵轴'];
 if(scale.clippedCandles)notice.push(`▲▼ ${scale.clippedCandles} 根超出纵轴，尖针未删除`);
 if(scale.clippedAverages)notice.push(`${scale.clippedAverages} 条均线部分超出纵轴`);
 return{html:parts.join(''),notice:notice.join(' · '),window,scale};
}
export function createChartViewport(doc,{count=12,onChange=()=>{}}={}){
 const baseHeight=doc.defaultView?.matchMedia?.('(max-width:690px)').matches?196:280;
 const state={count,offset:0,zoom:1,height:baseHeight},root=doc.createElement('div');root.className='candle-view-controls';root.setAttribute('aria-label','K线可视范围，不改变行情');
 let total=0,overview=null,context;
 const button=(label,action)=>{const b=doc.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>{action();sync();onChange(state);};root.append(b);return b;};
 const all=button('全部',()=>{
  if(overview){state.count=overview.count;state.offset=overview.offset===0?0:Math.max(0,total-overview.end);overview=null;}
  else {overview={count:state.count,offset:state.offset,end:total-state.offset};state.count=0;state.offset=0;}
 });all.setAttribute('aria-label','全览已记录行情，再点返回刚才的横轴范围');
 // Keep the rightmost visible candle anchored while changing the horizontal span.
 const visibleSize=()=>state.count>0?Math.min(total,Math.max(1,state.count)):total;
 function resizeHorizontal(enlarge){
  const size=visibleSize();if(size<1)return;
  const next=clamp(enlarge?Math.floor(size/1.5):Math.ceil(size*1.5),1,total);
  if(next===size)return;
  overview=null;state.count=next===total?0:next;
 }
 const horizontalPlus=button('横轴＋',()=>resizeHorizontal(true));horizontalPlus.setAttribute('aria-label','放大横轴，减少可见K线根数');
 const horizontalMinus=button('横轴－',()=>resizeHorizontal(false));horizontalMinus.setAttribute('aria-label','缩小横轴，增加可见K线根数');
 const label=doc.createElement('label'),slider=doc.createElement('input');label.className='candle-history';label.textContent='回看';slider.type='range';slider.min='0';slider.max='0';slider.value='0';slider.setAttribute('aria-label','回看较早K线，右端为最新');slider.oninput=()=>{state.offset=Number(slider.max)-Number(slider.value);onChange(state);};label.append(slider);root.append(label);
 function sync(){
  const max=state.count>0?Math.max(0,total-state.count):0;state.offset=clamp(state.offset,0,max);slider.max=String(max);slider.value=String(max-state.offset);slider.disabled=max===0;label.hidden=max===0;
  all.setAttribute('aria-pressed',String(Boolean(overview)));
  horizontalPlus.disabled=visibleSize()<=1;horizontalMinus.disabled=visibleSize()>=total;
 }
 sync();return{root,state,update(length,nextContext=context){
  if(context!==undefined&&nextContext!==context){overview=null;state.count=count;state.offset=0;}
  context=nextContext;total=Math.max(0,Math.trunc(Number(length))||0);sync();
 }};
}
