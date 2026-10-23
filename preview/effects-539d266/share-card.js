import {buildResultsReport} from './results-report.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {buildRecapSnapshot} from './daily-recap.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {formatTradingTime,timeAxisTicks} from './trading-time.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {grossPnlAt} from './market.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {runPerformance} from './performance.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {ACHIEVEMENTS,achievementProgress} from './achievements.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
const finite=(n,fallback=0)=>Number.isFinite(n)?n:fallback;
const amount=n=>(n<0?'−':'')+'¥'+Math.abs(n).toLocaleString('zh-CN',{maximumFractionDigits:2});
const signed=n=>(n>0?'+':'')+amount(n);
const records=s=>(s.history||[]).filter(t=>t.type!=='open'&&Number.isFinite(t.pnl));
// Completed-trade net P/L, live mark-to-market P/L and debt are deliberately separate.
export function buildShareSummary(state={},options={}) {
  const positions=Array.isArray(state.positions)?state.positions:state.position?[state.position]:[];
  const floating=finite(options.unrealized,positions.reduce((sum,p)=>sum+finite(p.unrealized,finite(grossPnlAt(p,state.price))),0));
  const realized=records(state), day=Math.max(1,Math.floor(finite(state.day,1))), candidate=options.report===null?null:options.report||state.dayReport;
  const report=['day_end','resting','ending'].includes(state.phase)&&candidate?.day===day?candidate:null;
  const eq=finite(options.equity,Math.max(0,finite(state.cash)+finite(state.reserve)+positions.reduce((sum,p)=>sum+finite(p.margin),0)+floating));
  const performance=runPerformance(state),total=performance.totalProfit, daily=realized.filter(t=>t.day===day).reduce((sum,t)=>sum+t.pnl,0);
  const totalFees=finite(state.feesPaid,finite(state.totalFees,(state.history||[]).reduce((sum,t)=>sum+(t.type==='open'?finite(t.fee):finite(t.closeFee,finite(t.fee))),0)));
  const completedAchievements=achievementProgress(state,options.achievementProfile).filter(a=>a.unlocked).map(({id,name,badge})=>({id,name,badge}));
  const recap=options.recap||buildRecapSnapshot(state,options);
  return {recap,results:buildResultsReport(state,{recap}),title:'FX韭留美',day,kind:options.variant==='ranking'?'完整战绩':state.mode==='endless'?'操盘战报':report?report.livingSettlement?.status==='pending'?'交易复盘 · 生活费待结':'收盘战报':'盘中战报',equity:eq,...performance,
    realizedProfit:total,dayRealizedProfit:daily,unrealized:floating,
    tradingProfit:finite(options.tradingProfit,eq-100000-finite(state.externalFunding)+finite(state.expenses)-finite(state.developer?.profitOffset)),
    dayTradingProfit:report?finite(report.net):null,
    feesPaid:totalFees, debt:Math.max(0,finite(state.family?.outstanding)+finite(state.loan?.outstanding)),livingCost:finite(report?.livingCost),funding:finite(state.externalFunding),
    tradeCount:performance.closedTrades,winRate:performance.winRate===null?null:performance.winRate*100,
    positionCount:positions.length,completedAchievements,achievementCount:options.achievementProfile?completedAchievements.length:Math.max(0,Math.floor(finite(options.achievementCount))),
    moodLabel:options.moodLabel||'今日心情',sanity:Math.round(finite(state.sanity,50)),edited:!!(state.developmentTaint||state.developer?.edited),
    gameUrl:String(options.gameUrl||globalThis.location?.href||''),
    equityTrail:(state.equityTrail||[]).filter(Number.isFinite).slice(-48),
    trailLabel:'交易本金趋势 · 已扣净借入，加回道具支出',
    caption:''};
}
// A single scale governs labels, grid lines and the polyline, including flat or
// negative balances. Nice intervals keep monetary ticks readable in the PNG.
export function buildCurveScale(values){
 const filtered=values.filter(Number.isFinite),trail=filtered.length?filtered:[100000],low=Math.min(...trail),high=Math.max(...trail);
 const span=high-low,pad=span>0?Math.max(.01,span*.08):Math.max(1,Math.abs(low)*.005);
 const raw=(span+pad*2)/4,power=10**Math.floor(Math.log10(raw)),step=[1,2,5,10].find(n=>n*power>=raw)*power;
 const min=Math.floor((low-pad)/step)*step,max=Math.ceil((high+pad)/step)*step;
 const count=Math.round((max-min)/step),ticks=Array.from({length:count+1},(_,i)=>Number((min+i*step).toPrecision(12)));
 return {min,max,step,ticks};
}
function axisAmount(value,step){
 const abs=Math.abs(value),sign=value<0?'−':'';
 const unit=abs>=1e8?1e8:abs>=1e6?1e4:1,suffix=unit===1e8?'亿':unit===1e4?'万':'';
 const digits=Math.max(0,Math.min(4,-Math.floor(Math.log10(step/unit))));
 return sign+'¥'+(abs/unit).toLocaleString('zh-CN',{maximumFractionDigits:digits})+suffix;
}
function wrap(ctx,text,x,y,maxWidth,lineHeight,maxLines=4){let line='',count=0;for(const char of String(text)){if(ctx.measureText(line+char).width>maxWidth&&line){ctx.fillText(line,x,y);y+=lineHeight;if(++count>=maxLines)return y;line=char;}else line+=char;}if(line)ctx.fillText(line,x,y);return y+lineHeight;}
const fonts={body:'system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'};
async function portraitImage(url,doc){
 if(!url)return null;const ImageClass=doc.defaultView?.Image||globalThis.Image;if(!ImageClass)return null;
 return new Promise(resolve=>{const image=new ImageClass();let timer;const done=value=>{clearTimeout(timer);image.onload=image.onerror=null;resolve(value);};image.onload=()=>done(image);image.onerror=()=>done(null);timer=setTimeout(()=>done(null),5000);image.src=url;});
}
export async function createShareCard(state,options={}) {
 const doc=options.document||globalThis.document;if(!doc)throw Error('战报图片需要浏览器画布');
 const s=buildShareSummary(state,options),achievementRows=Math.max(1,Math.ceil(s.completedAchievements.length/2)),footerY=1430+achievementRows*80+26,extraRecords=Math.max(0,s.results.specialRecords.length-4)*48;
 const canvas=doc.createElement('canvas');canvas.width=1080;canvas.height=footerY+330+extraRecords;const ctx=canvas.getContext('2d');if(!ctx)throw Error('当前浏览器无法生成战报图片');
 const report=s.results,p=report.performance,a=report.account,knownAmount=value=>Number.isFinite(value)?amount(value):'—',knownSigned=value=>Number.isFinite(value)?signed(value):'—',knownPercent=value=>Number.isFinite(value)?(value*100).toFixed(2)+'%':'—';
 const ink='#282431',muted='#876f7f',pink='#f16f9f',darkPink='#ba3e78',green='#198c67',red='#c34179',line='#e7cbd9';
 ctx.fillStyle='#fff7fb';ctx.fillRect(0,0,1080,canvas.height);ctx.fillStyle=pink;ctx.fillRect(0,0,1080,18);
 const font=(size,weight=500)=>ctx.font=`${weight} ${size}px ${fonts.body}`;
 const label=(text,x,y,size=20,color=muted)=>{font(size);ctx.fillStyle=color;ctx.fillText(String(text),x,y);};
 const num=(text,x,y,size=32,color=ink,maxWidth=1032-x)=>{font(size,800);while(size>18&&ctx.measureText(String(text)).width>maxWidth){size--;font(size,800);}ctx.fillStyle=color;ctx.fillText(String(text),x,y);};
 const rule=y=>{ctx.strokeStyle=line;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(48,y);ctx.lineTo(1032,y);ctx.stroke();};
 num('FX韭留美',48,87,42);label(`${s.mode==='endless'?'操盘 · 无尽':'剧情模式'} / ${s.kind}`,48,129,23,darkPink);if(s.edited)label('开发测试数据',770,85,22,red);
 const image=await portraitImage(options.portraitUrl,doc);ctx.fillStyle='#ffe0ed';ctx.fillRect(48,169,178,178);
 if(image){ctx.save();ctx.beginPath();ctx.rect(48,169,178,178);ctx.clip();const crop=options.portraitCrop||[0,0,image.naturalWidth,image.naturalHeight],cw=crop[2]-crop[0],ch=crop[3]-crop[1],scale=Math.max(178/cw,178/ch),w=cw*scale,h=ch*scale;ctx.drawImage(image,crop[0],crop[1],cw,ch,48+(178-w)/2,169+(178-h)/2,w,h);ctx.restore();}else num('久留美',66,266,28,darkPink);
 label(`${s.moodLabel} · ${s.recap.primary.label}`,252,196,22,darkPink);num(signed(s.recap.primary.profit),252,253,52,s.recap.primary.profit>=0?green:red,780);label(`收益率 ${s.recap.primary.returnRate===null?'—':(s.recap.primary.returnRate>=0?'+':'')+(s.recap.primary.returnRate*100).toFixed(2)+'%'}`,252,291,26,s.recap.primary.profit>=0?green:red);label(`第 ${s.day} 个游戏交易日 · 心理承受力 ${s.sanity} / 100`,252,329,20); 
 rule(375);label('累计已实现交易收益率',48,425,24);num(s.recap.cumulative.returnRate===null?'—':(s.recap.cumulative.returnRate>=0?'+':'')+(s.recap.cumulative.returnRate*100).toFixed(2)+'%',48,512,82,(s.recap.cumulative.returnRate||0)>=0?green:red);
 label('名义资产 / 扣债净资产',660,429,21);num(knownAmount(a.nominalAssets),660,474,34);num(knownAmount(a.netAssets),660,516,29);
 label('完整订单胜率 '+knownPercent(p.winRate),660,557,21);
 label(`初始 ${knownAmount(p.initialCapital)} · 已存活 ${p.daysSurvived} 天`,48,558,20);
 const metrics=[['净交易总收益',knownSigned(p.realizedNetTradingPnl)],['完整平仓订单',Number.isFinite(p.closedOrders)?String(p.closedOrders):'—'],['最高使用杠杆',Number.isFinite(p.maxLeverage)?p.maxLeverage+'×':'—'],['最大整单盈利',knownSigned(p.maxOrderProfit)],['最大整单亏损',knownSigned(p.maxOrderLoss)],['最大交易回撤',knownPercent(p.maxDrawdown)],['欠父亲',knownAmount(a.fatherDebt)],['欠网贷',knownAmount(a.networkDebt)],['当前浮动盈亏',knownSigned(a.unrealized)]];
 metrics.forEach(([key,value],i)=>{const x=48+(i%3)*334,y=592+Math.floor(i/3)*102;label(key,x,y,21);num(value,x,y+42,30,ink,310);});
 ctx.save();ctx.translate(0,110);rule(758);
 for(const [scope,title,offset]of [['today','今日资金曲线',0],['cumulative','累计资金曲线',506]]){
  label(title,48+offset,800,22);label('日元 / 游戏时间 JST',48+offset,825,15);
  const points=s.recap.curves[scope],trail=points.map(p=>p.nominalAssets),scale=buildCurveScale(trail),plot={left:125+offset,right:514+offset,top:844,bottom:932};
  const start=points[0]?.timestamp||0,range=Math.max(1,(points.at(-1)?.timestamp||start)-start),plotX=p=>plot.left+(p.timestamp-start)/range*(plot.right-plot.left),plotY=value=>plot.bottom-(value-scale.min)/(scale.max-scale.min)*(plot.bottom-plot.top);
  for(const value of scale.ticks){const y=plotY(value);ctx.strokeStyle='#f0dfe7';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(plot.left,y);ctx.lineTo(plot.right,y);ctx.stroke();ctx.textAlign='right';label(axisAmount(value,scale.step),plot.left-8,y+5,14);ctx.textAlign='left';}
  ctx.strokeStyle=darkPink;ctx.lineWidth=3;ctx.beginPath();points.forEach((p,i)=>{const x=plotX(p),y=plotY(p.nominalAssets);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
  for(const t of timeAxisTicks(points,{maxTicks:2})){ctx.textAlign=t.index===0?'left':'right';label(t.label,plotX(t),955,15);ctx.textAlign='left';}
 }
 label(s.recap.curves.todayPartial||s.recap.curves.cumulativePartial?'旧记录仅展示已知点；连线不是完整盘中路径':'名义资产曲线 · 借款可使资产增加，但不计入收益率',48,981,16);rule(1000);
 num('特别记录',48,1033,27);
 if(!report.specialRecords.length)label(p.complete?'这局还没有特别记录':'旧档订单记录不完整，未知项保留为空',48,1094,22);
 report.specialRecords.forEach((record,i)=>{const value=['negative-net-assets','loss-over-initial'].includes(record.id)?knownAmount(record.value):String(record.value)+(record.id==='max-leverage'?'×':'');label(record.label,48,1094+i*48,22,ink);ctx.textAlign='right';num(value,1032,1094+i*48,26,darkPink);ctx.textAlign='left';});
 ctx.translate(0,extraRecords);
 label(`今日费用后收支 ${signed(s.recap.daily.netResult)} · ${s.recap.daily.livingStatus==='pending'?'生活费待结':'生活费 '+amount(s.recap.daily.costs.living)}`,48,1299,21);
 label(`利息 ${amount(s.recap.daily.costs.interest)} · 可选消费 ${amount(s.recap.daily.costs.consumption)} · 借还本金 ${signed(s.recap.daily.fundingPrincipal)}`,48,1328,18);
 label(`累计手续费 ${knownAmount(report.fees.trading)} · 已付利息 ${knownAmount(report.fees.interestPaid)} · 未付利息 ${knownAmount(report.fees.interestAccrued)}`,48,1360,18);
 label(`累计生活费 ${knownAmount(report.fees.living)} · 累计可选消费 ${knownAmount(report.fees.consumption)}`,48,1390,18);ctx.translate(0,110);
 rule(1346);num('已完成成就',48,1394,27);label(`${s.completedAchievements.length} / ${ACHIEVEMENTS.length}`,930,1394,22,darkPink);
 if(!s.completedAchievements.length)label('暂无已完成成就',48,1468,23);
 s.completedAchievements.forEach((a,i)=>{const x=48+(i%2)*502,y=1430+Math.floor(i/2)*80;ctx.fillStyle='#ffe4ef';ctx.fillRect(x,y,482,64);ctx.fillStyle=darkPink;ctx.fillRect(x,y,64,64);ctx.textAlign='center';num(a.badge,x+32,y+42,22,'#fff7fb',56);ctx.textAlign='left';num(a.name,x+82,y+41,24,ink,384);});
 rule(footerY);label('模拟交易游戏',48,footerY+48,20);label(formatTradingTime(s.recap.timestamp,{full:true}),48,footerY+82,16);font(18);ctx.fillStyle=muted;wrap(ctx,s.gameUrl,320,footerY+48,710,25,2);
 ctx.restore();
 const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('战报图片生成失败')),'image/png'));return{blob,url:URL.createObjectURL(blob),filename:`FX韭留美-${s.mode==='endless'?'操盘':'剧情'}-第${s.day}天-${s.kind}${s.edited?'-测试':''}.png`,summary:s};
}
