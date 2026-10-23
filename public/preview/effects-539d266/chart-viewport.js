import {movingAveragePath} from './moving-average.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {formatTradingTime,timeAxisTicks} from './trading-time.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
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
export function candlePlot(candles,averages=[],{count=12,offset=0,zoom=1,height=280,dark=true,id='market',visibleCount=Infinity,currentPrice}={}){
 const window=candleWindow(candles,{count,offset}),bars=window.candles,ma=averages.map(a=>({...a,values:a.values.slice(window.start,window.end)}));
 const scale=candleScale(bars,ma,{zoom}),w=660,left=12,right=75,top=20,bottom=38,h=height,plotBottom=h-bottom;
 const y=v=>top+(scale.high-v)/(scale.high-scale.low)*(plotBottom-top),dx=(w-left-right)/Math.max(1,bars.length),x=i=>left+dx*(i+.5),labelColor=dark?'#c9c2d2':'#705565',grid=dark?'#494454':'#dcc3d0';
 const clip=`candle-clip-${id}`,parts=[`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="已发生行情，纵轴日元/美元，横轴游戏时间 JST"><defs><clipPath id="${clip}"><rect x="${left}" y="${top}" width="${w-left-right}" height="${plotBottom-top}"/></clipPath></defs>`];
 for(let i=0;i<5;i++){const value=scale.high-(scale.high-scale.low)*i/4,Y=y(value);parts.push(`<line x1="${left}" x2="${w-right}" y1="${Y}" y2="${Y}" stroke="${grid}" stroke-dasharray="3 5"/><text x="${w-right+8}" y="${Y+4}" fill="${labelColor}" font-size="11">${price(value)}</text>`);}
 bars.forEach((c,i)=>{const X=x(i),color=c.close>=c.open?(dark?'#8ae4bf':'#248b68'):(dark?'#f58cba':'#bc4276'),globalIndex=window.start+i;
  const title=`${formatTradingTime(c.timestamp,{full:true})} · 开 ${price(c.open)} / 高 ${price(c.high)} / 低 ${price(c.low)} / 收 ${price(c.close)}`;
  parts.push(`<g data-recap-candle="${globalIndex}" opacity="${globalIndex<visibleCount?1:.12}"><title>${title}</title><g clip-path="url(#${clip})"><line x1="${X}" x2="${X}" y1="${y(c.high)}" y2="${y(c.low)}" stroke="${color}" stroke-width="1.5"/><rect x="${X-dx*.27}" y="${Math.min(y(c.open),y(c.close))}" width="${Math.max(1,dx*.54)}" height="${Math.max(1.5,Math.abs(y(c.open)-y(c.close)))}" fill="${color}"/></g>`);
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
 if(scale.zoom>1)notice.push('“全幅”恢复原幅度');
 return{html:parts.join(''),notice:notice.join(' · '),window,scale};
}
export function createChartViewport(doc,{count=12,onChange=()=>{}}={}){
 const state={count,offset:0,zoom:1,height:280},root=doc.createElement('div');root.className='candle-view-controls';root.setAttribute('aria-label','K线可视范围，不改变行情');
 const buttons=[];
 const button=(label,action)=>{const b=doc.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>{action();sync();onChange(state);};root.append(b);return b;};
 for(const [size,label]of [[12,'近12根'],[30,'近30根'],[0,'全部']]){const b=button(label,()=>{state.count=size;state.offset=0;});buttons.push([size,b]);}
 const plus=button('纵轴＋',()=>state.zoom=Math.min(128,state.zoom*2));plus.setAttribute('aria-label','放大纵轴，超出范围的K线会标记');
 const minus=button('纵轴－',()=>state.zoom=Math.max(1,state.zoom/2));minus.setAttribute('aria-label','缩小纵轴');
 button('全幅',()=>state.zoom=1);button('拉高图表',()=>state.height=state.height===280?440:280);
 const label=doc.createElement('label'),slider=doc.createElement('input');label.className='candle-history';label.textContent='回看';slider.type='range';slider.min='0';slider.max='0';slider.value='0';slider.setAttribute('aria-label','回看较早K线，右端为最新');slider.oninput=()=>{state.offset=Number(slider.max)-Number(slider.value);onChange(state);};label.append(slider);root.append(label);
 function sync(){for(const [size,b]of buttons)b.setAttribute('aria-pressed',String(state.count===size));plus.disabled=state.zoom>=128;minus.disabled=state.zoom<=1;}
 sync();return{root,state,update(total){const max=state.count>0?Math.max(0,total-state.count):0;state.offset=clamp(state.offset,0,max);slider.max=String(max);slider.value=String(max-state.offset);slider.disabled=max===0;label.hidden=max===0;sync();}};
}
