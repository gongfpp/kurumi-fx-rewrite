import {VOLATILITY_FIELDS} from './daily-volatility.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Public game aggregates only. Never infer a lifetime peak from a trimmed history.
const money = value => Number.isFinite(value) && value >= 0 && value <= 1e10;
export const HALL_FIELDS = Object.freeze(['maxPositionMargin','maxOrderMargin','playSeconds']);
export function newHallMetrics(){return {version:1,maxPositionMargin:0,maxOrderMargin:0,playMilliseconds:0};}
export function readHallMetrics(state){
 const h=state?.hallMetrics;
 if(!h||h.version!==1||!money(h.maxPositionMargin)||!money(h.maxOrderMargin)||h.maxOrderMargin>h.maxPositionMargin||!Number.isFinite(h.playMilliseconds)||h.playMilliseconds<0||h.playMilliseconds>1e13)return {maxPositionMargin:null,maxOrderMargin:null,playSeconds:null};
 const round=n=>Math.round((n+Number.EPSILON)*100)/100;
 return {maxPositionMargin:round(h.maxPositionMargin),maxOrderMargin:round(h.maxOrderMargin),playSeconds:Math.floor(h.playMilliseconds/1000)};
}
export function recordHallPosition(state){
 if(readHallMetrics(state).maxPositionMargin===null)return;
 const positions=state.positions?.length?state.positions:state.position?[state.position]:[];
 if(positions.some(p=>!money(p.margin)))return;
 const total=positions.reduce((n,p)=>n+p.margin,0);
 if(!money(total))return;
 state.hallMetrics.maxPositionMargin=Math.max(state.hallMetrics.maxPositionMargin,total);
 state.hallMetrics.maxOrderMargin=Math.max(state.hallMetrics.maxOrderMargin,0,...positions.map(p=>p.margin));
}
// Visible, focused play only. Monotonic intervals are capped, so sleep, hidden
// tabs and a blocked save never become hours of invented play time.
export function createHallPlayClock({now=()=>performance.now()}={}){
 let previous=null,current=null,wasActive=false;
 return {sample(state,{active=false}={}){
  const at=now(),same=current===state,delta=previous===null?0:at-previous;const allowed=wasActive;previous=at;current=state;wasActive=active;
  if(!same||!active||!allowed||state?.phase==='ending'||readHallMetrics(state).playSeconds===null||!Number.isFinite(delta)||delta<0||delta>5000)return;
  state.hallMetrics.playMilliseconds=Math.min(1e13,state.hallMetrics.playMilliseconds+delta);
 },reset(){previous=null;current=null;wasActive=false;}};
}
export function hallScoreForServer(score,supported,volatilitySupported=false){
 const clean={...score};if(!supported)for(const key of HALL_FIELDS)delete clean[key];if(!volatilitySupported)for(const key of VOLATILITY_FIELDS)delete clean[key];return clean;
}
export function hallMetricLabels(row,{yen,signed,percent}){
 const unknown='尚无记录',amount=v=>v==null?unknown:yen(v),profit=v=>v==null?unknown:signed(v);
 const seconds=row.playSeconds,time=Number.isFinite(seconds)&&seconds>=0?(seconds<60?'不到 1 分钟':seconds<3600?`${Math.floor(seconds/60)} 分钟`:`${Math.floor(seconds/3600)} 小时 ${Math.floor(seconds%3600/60)} 分钟`):unknown;
 return [...(Number.isFinite(row.lotteryIncome)&&row.lotteryIncome>=0?[['彩票税前奖金',amount(row.lotteryIncome)]]:[]),['累计赚亏',profit(row.totalProfit)],['日收益波动',row.volatilityVersion===1&&row.volatilityComplete===true&&Number.isFinite(row.dailyVolatility)&&row.dailyVolatility>=0&&Number.isSafeInteger(row.volatilitySamples)&&row.volatilitySamples>=2?percent(row.dailyVolatility)+' · '+row.volatilitySamples+'日':unknown],['平均每天',row.dailyReturnRate==null?unknown:percent(row.dailyReturnRate)],['最大持仓本金',amount(row.maxPositionMargin)],['最大单笔本金',amount(row.maxOrderMargin)],['最赚的一单',profit(row.maxOrderProfit)],['最亏的一单',profit(row.maxOrderLoss)],['游玩时长',time],['赚钱胜率',row.winRate==null?unknown:percent(row.winRate)],['最高杠杆',row.maxLeverage==null?unknown:`${row.maxLeverage} 倍`],['最多连赢',row.maxWinningStreak==null?unknown:`${row.maxWinningStreak} 单`],['最多连亏',row.maxLosingStreak==null?unknown:`${row.maxLosingStreak} 单`],['被强平',row.liquidatedOrders==null?unknown:`${row.liquidatedOrders} 单`],['扣债后家底',amount(row.netAssets)]];
}
