import {buildShareSummary,buildCurveScale,achievementThumbnail} from './share-card.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ALL_ACHIEVEMENTS as ACHIEVEMENTS} from './achievements.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {assetURL} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {formatTradingTime,timeAxisTicks} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Approved 2026-10-12 pixel reference. Only the listed artwork rectangles are
// sampled; example amounts, captions and charts are never used as game data.
export const PIXEL_REPORT_ART=Object.freeze({
 path:'./pixel-assets/report-pixel-approved.png',
 size:Object.freeze([852,1846]),
 crops:Object.freeze({yen:[43,243,74,72],portrait:[59,335,164,161],chart:[55,556,76,73],wallet:[462,556,74,75],coins:[56,651,76,78],capital:[463,651,73,79],orders:[58,760,73,77],win:[461,760,75,77],profit:[55,867,80,80],loss:[461,867,76,80],leverage:[53,971,80,82],debt:[458,971,78,82],trophy:[52,1388,66,61]})
});
const C={paper:'#fffafd',ink:'#0a1255',pink:'#ff168f',mint:'#00bfa9',line:'#ff52ab',grid:'#d6dff8',muted:'#63719b'};
const money=n=>Number.isFinite(n)?(n<0?'−':'')+'¥'+Math.abs(n).toLocaleString('zh-CN',{maximumFractionDigits:2}):'—';
const signed=n=>Number.isFinite(n)?(n>0?'+':'')+money(n):'—';
const percent=n=>Number.isFinite(n)?(n*100).toFixed(2)+'%':'—';
function axisMoney(value,step){const abs=Math.abs(value),unit=abs>=1e8?1e8:abs>=1e6?1e4:1,suffix=unit===1e8?'亿':unit===1e4?'万':'',digits=Math.max(0,Math.min(4,-Math.floor(Math.log10(step/unit))));return (value<0?'−':'')+'¥'+(abs/unit).toLocaleString('zh-CN',{maximumFractionDigits:digits})+suffix;}
const signedPercent=n=>Number.isFinite(n)?(n>0?'+':'')+percent(n):'—';
const count=n=>Number.isFinite(n)?String(n):'—';
const font='"Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif';
async function loadImage(url,doc){
 const ImageClass=doc.defaultView?.Image||globalThis.Image;if(!url||!ImageClass)return null;
 return new Promise(resolve=>{const img=new ImageClass();let timer;const done=value=>{clearTimeout(timer);img.onload=img.onerror=null;resolve(value);};img.onload=()=>done(img.naturalWidth>0&&img.naturalHeight>0?img:null);img.onerror=()=>done(null);timer=setTimeout(()=>done(null),5000);img.crossOrigin='anonymous';img.src=url;});
}
export function pixelReportMetrics(s){
 const p=s.results.performance,a=s.results.account;
 return [
  ['chart','累计已实现交易收益率',signedPercent(s.recap.cumulative.returnRate),s.recap.cumulative.returnRate],['wallet','账户总资产',money(a.nominalAssets)],
  ['coins','净资产',money(a.netAssets)],['capital','初始本金',money(p.initialCapital)],
  ['orders','完整平仓订单',count(p.closedOrders)],['win','完整订单胜率',percent(p.winRate)],
  ['profit','最大整单盈利',signed(p.maxOrderProfit),p.maxOrderProfit],['loss','最大整单亏损',signed(p.maxOrderLoss),p.maxOrderLoss],
  ['leverage','最高使用杠杆',Number.isFinite(p.maxLeverage)?p.maxLeverage+'×':'—'],['debt','欠网贷',money(a.networkDebt)],
  ['debt','欠父亲',money(a.fatherDebt)],['wallet','当前浮动盈亏',signed(a.unrealized),a.unrealized],
  ['chart','最大交易回撤',percent(p.maxDrawdown)],['coins','净交易总收益',signed(p.realizedNetTradingPnl),p.realizedNetTradingPnl]
 ];
}
// All sections grow from their actual row count. No bitmap height limit or
// fixed viewport crop is applied to the exported original PNG.
export function pixelReportLayout(s){
 const metrics=pixelReportMetrics(s),grid={top:412,height:Math.ceil(metrics.length/2)*136+16};
 const today={top:grid.top+grid.height+24,height:338},cumulative={top:today.top+today.height+24,height:338};
 const special={top:cumulative.top+cumulative.height+24,height:92+Math.max(1,s.results.specialRecords.length)*56};
 const costs={top:special.top+special.height+24,height:272};
 const achievements={top:costs.top+costs.height+24,height:108+Math.max(1,s.completedAchievements.length)*100};
 const footer={top:achievements.top+achievements.height+24,height:184};
 return {width:1080,height:footer.top+footer.height,metrics,grid,today,cumulative,special,costs,achievements,footer};
}
export async function createPixelShareCard(state,options={}){
 const doc=options.document||globalThis.document;if(!doc)throw Error('战报图片需要浏览器画布');
 const s=buildShareSummary(state,options),layout=pixelReportLayout(s),canvas=doc.createElement('canvas');canvas.width=layout.width;canvas.height=layout.height;
 const ctx=canvas.getContext('2d');if(!ctx)throw Error('当前浏览器无法生成战报图片');
 const urls=[...new Set(s.completedAchievements.map(a=>achievementThumbnail(a.id)).filter(Boolean))];
 const [art,...images]=await Promise.all([loadImage(assetURL(PIXEL_REPORT_ART.path),doc),...urls.map(url=>loadImage(url,doc))]);
 const achievementArt=new Map(urls.map((url,i)=>[url,images[i]])),textBounds=[];
 ctx.imageSmoothingEnabled=false;ctx.fillStyle=C.paper;ctx.fillRect(0,0,canvas.width,canvas.height);
 const text=(value,x,y,width,size=28,color=C.ink,weight=700)=>{
  value=String(value);ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillStyle=color;
  const setFont=()=>ctx.font=`${weight} ${size}px ${font}`;setFont();
  while(size>12&&ctx.measureText(value).width>width){size--;setFont();}
  // maxWidth also bounds unusually large finite values or long translated text.
  ctx.fillText(value,x,y,width);const measured=ctx.measureText(value);
  textBounds.push({text:value,x,y,width:Math.min(width,measured.width),height:measured.actualBoundingBoxAscent||size,maxWidth:width});
 };
 const border=(x,y,w,h,color=C.line)=>{ctx.fillStyle='#fff';ctx.fillRect(x+4,y+4,w-8,h-8);ctx.fillStyle=color;for(const rect of [[x+8,y,w-16,3],[x+8,y+h-3,w-16,3],[x,y+8,3,h-16],[x+w-3,y+8,3,h-16],[x+3,y+3,5,5],[x+w-8,y+3,5,5],[x+3,y+h-8,5,5],[x+w-8,y+h-8,5,5]])ctx.fillRect(...rect);};
 const rule=(x,y,w,color=C.grid)=>{ctx.fillStyle=color;for(let p=0;p<w;p+=8)ctx.fillRect(x+p,y,4,2);};
 const icon=(key,x,y,w=80,h=w)=>{const crop=PIXEL_REPORT_ART.crops[key];if(art&&crop){const rx=art.naturalWidth/PIXEL_REPORT_ART.size[0],ry=art.naturalHeight/PIXEL_REPORT_ART.size[1];const scale=Math.min(w/crop[2],h/crop[3]),dw=crop[2]*scale,dh=crop[3]*scale;ctx.drawImage(art,crop[0]*rx,crop[1]*ry,crop[2]*rx,crop[3]*ry,x+(w-dw)/2,y+(h-dh)/2,dw,dh);}else{border(x,y,w,h,C.ink);text(key==='portrait'?'久留美':'¥',x+6,y+h*.65,w-12,Math.min(32,w*.45),C.pink);}};
 const color=value=>Number.isFinite(value)&&value<-.005?C.mint:Number.isFinite(value)&&value>.005?C.pink:C.ink;
 icon('yen',42,30,76);text('FX韭留美',136,86,410,52);text(`${s.mode==='endless'?'操盘 · 无尽':'剧情模式'} / ${s.kind}`,570,79,462,27);
 border(32,130,1016,258);icon('portrait',58,154,200,200);
 text(s.recap.primary.label,288,180,348,29);text('收益率',682,180,324,29);
 text(signed(s.recap.primary.profit),288,253,352,57,color(s.recap.primary.profit));text(signedPercent(s.recap.primary.returnRate),682,253,324,55,color(s.recap.primary.profit));
 ctx.fillStyle='#ffe4f2';ctx.fillRect(284,281,738,65);text(`第 ${s.day} 个游戏交易日 · 心理承受力 ${s.sanity} / 100`,302,324,704,28);
 border(32,layout.grid.top,1016,layout.grid.height);
 layout.metrics.forEach(([key,label,value,tint],i)=>{const x=52+i%2*500,y=layout.grid.top+18+Math.floor(i/2)*136;icon(key,x+6,y+17,80);text(label,x+110,y+44,350,26);text(value,x+110,y+94,350,40,color(tint));if(i>=2)rule(x,y-9,478);});
 for(let y=layout.grid.top+18;y<layout.grid.top+layout.grid.height-18;y+=8){ctx.fillStyle=C.grid;ctx.fillRect(539,y,2,4);}
 for(const [scope,title,box]of [['today',s.recap.curves.basis==='trading'?'今日交易资产曲线':'今日资金曲线',layout.today],['cumulative',s.recap.curves.basis==='trading'?'累计交易资产曲线':'累计资金曲线',layout.cumulative]]){
  border(32,box.top,1016,box.height);icon('chart',56,box.top+18,57);text(title,132,box.top+61,710,34);text('日元 / JST',826,box.top+60,186,20,C.muted);rule(58,box.top+85,960);
  const points=s.recap.curves[scope],scale=buildCurveScale(points.map(p=>p.nominalAssets)),plot={left:176,right:1002,top:box.top+112,bottom:box.top+271};
  const start=points[0]?.timestamp||0,range=Math.max(1,(points.at(-1)?.timestamp||start)-start),x=p=>plot.left+(p.timestamp-start)/range*(plot.right-plot.left),y=value=>plot.bottom-(value-scale.min)/(scale.max-scale.min)*(plot.bottom-plot.top);
  for(const value of scale.ticks){ctx.strokeStyle=C.grid;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(plot.left,y(value));ctx.lineTo(plot.right,y(value));ctx.stroke();text(axisMoney(value,scale.step),56,y(value)+7,108,18,C.muted,500);}
  ctx.strokeStyle=C.pink;ctx.lineWidth=4;ctx.beginPath();points.forEach((p,i)=>{i&&!p.gapBefore?ctx.lineTo(x(p),y(p.nominalAssets)):ctx.moveTo(x(p),y(p.nominalAssets));});ctx.stroke();ctx.fillStyle=C.pink;for(const p of points)ctx.fillRect(x(p)-3,y(p.nominalAssets)-3,6,6);
  const ticks=timeAxisTicks(points,{maxTicks:2}).filter((tick,i,ticks)=>i===0||tick.timestamp!==ticks[0].timestamp);ticks.forEach((tick,i)=>text(tick.label,i===0?plot.left:plot.right-260,box.top+306,260,21,C.ink,500));
 }
 const report=s.results,sp=layout.special; border(32,sp.top,1016,sp.height);text('特别记录',60,sp.top+54,950,34);
 if(!report.specialRecords.length)text(report.performance.complete?'这局还没有特别记录':'旧档订单记录不完整，未知项保留为空',60,sp.top+110,950,26,C.muted,500);
 report.specialRecords.forEach((record,i)=>{const value=['negative-net-assets','loss-over-initial'].includes(record.id)?money(record.value):String(record.value)+(record.id==='max-leverage'?'×':'');text(record.label,60,sp.top+110+i*56,526,26);text(value,600,sp.top+110+i*56,410,28,C.pink);});
 const costs=layout.costs;border(32,costs.top,1016,costs.height);text('费用与收支',60,costs.top+52,940,32);
 const f=report.fees,rows=[`今日费用后收支 ${signed(s.recap.daily.netResult)} · ${s.recap.daily.livingStatus==='pending'?'生活费待结':'生活费 '+money(s.recap.daily.costs.living)}`,`利息 ${money(s.recap.daily.costs.interest)} · 可选消费 ${money(s.recap.daily.costs.consumption)} · 借还本金 ${signed(s.recap.daily.fundingPrincipal)}`,`累计手续费 ${money(f.trading)} · 已付利息 ${money(f.interestPaid)} · 未付利息 ${money(f.interestAccrued)}`,`累计生活费 ${money(f.living)} · 累计可选消费 ${money(f.consumption)}`];
 rows.forEach((row,i)=>text(row,60,costs.top+104+i*44,948,24,C.ink,500));
 const ac=layout.achievements;border(32,ac.top,1016,ac.height);icon('trophy',56,ac.top+16,66);text(`已完成成就 ${s.completedAchievements.length} / ${ACHIEVEMENTS.length}`,140,ac.top+63,862,34);
 if(!s.completedAchievements.length)text('暂无已完成成就',66,ac.top+149,930,27,C.muted,500);
 s.completedAchievements.forEach((a,i)=>{const y=ac.top+88+i*100; border(58,y,964,86);const img=achievementArt.get(achievementThumbnail(a.id));if(img){const scale=Math.min(70/img.naturalWidth,70/img.naturalHeight),w=img.naturalWidth*scale,h=img.naturalHeight*scale;ctx.drawImage(img,68+(70-w)/2,y+8+(70-h)/2,w,h);}else text(a.badge,74,y+56,64,35,C.pink);text(a.name,156,y+56,836,30);});
 const foot=layout.footer;text('FX韭留美 · 交易战报'+(s.edited?' · 开发测试数据':''),48,foot.top+30,986,25);text(formatTradingTime(s.recap.timestamp,{full:true}),48,foot.top+70,986,22,C.muted,500);
 const partial=s.recap.curves.todayPartial||s.recap.curves.cumulativePartial||s.recap.curves.todaySampled;text(partial?'部分历史未记录或已采样，仅展示实际记录':'曲线连线不是逐笔走势',48,foot.top+107,986,20,C.muted,500);text(s.gameUrl,48,foot.top+147,986,19,C.muted,500);
 const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('战报图片生成失败')),'image/png'));
 return {blob,url:URL.createObjectURL(blob),filename:`FX韭留美-${s.mode==='endless'?'操盘':'剧情'}-第${s.day}天-${s.kind}-像素版${s.edited?'-测试':''}.png`,summary:s,style:'pixel',layout:{...layout,textBounds}};
}
