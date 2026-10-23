import {INVESTOR_COPY} from './copy/npc-investors.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

const ACTORS = [
  {id:'paper-kite',actor:'多头纸鸢',stance:'long'},
  {id:'headwind',actor:'空头逆风',stance:'short'},
  {id:'little-stool',actor:'观望小凳',stance:'watch'}
];
const CLOSE_TYPES = new Set(['close','half','stop','liquidation','rescue','closing','receipt']);
const finite = (value, fallback=0) => Number.isFinite(value) ? value : fallback;
const positive = value => Number.isFinite(value) && value>0;
const count = value => Math.max(0,Math.floor(finite(value)));
const sign = move => Math.abs(move)<.0003 ? 0 : Math.sign(move);
const hash = text => {
  let value=2166136261;
  for (let i=0;i<text.length;i++) value=Math.imul(value^text.charCodeAt(i),16777619);
  return value>>>0;
};

function completedToday(s,day) {
  const candles=Array.isArray(s.candles)?s.candles:[];
  // Deliberately never inspect the unfinished candle's changing prices.
  const closed=candles.filter(c=>c?.closed===true&&!c.historical&&positive(c.open)&&positive(c.close));
  const today=closed.filter(c=>c.day===day);
  if (today.length || closed.some(c=>Number.isFinite(c.day))) return today;
  // Older saves can lack candle dates. Infer only an already-completed slice;
  // at a new day's opening, yesterday's candles cannot become today's orders.
  const inDay=count(s.beat)*4+count(s.pending?.candle);
  return inDay?closed.slice(-inDay):[];
}

function recentTrade(s,day,beat) {
  const isRecent=t=>t&&t.day===day&&Number.isFinite(t.beat)&&t.beat<=beat&&t.beat>=Math.max(0,beat-1);
  const last=s.lastTrade;
  if (isRecent(last)) return last;
  const history=Array.isArray(s.history)?s.history:[];
  for (let i=history.length-1;i>=0;i--) if (isRecent(history[i])) return history[i];
  return null;
}

function observation(s,candles,trade,day,beat) {
  const event=s.lastEvent;
  const seen=event&&(!Number.isFinite(event.day)||event.day===day)&&Number.isFinite(event.beat)
    &&event.beat<=beat&&event.beat>=Math.max(0,beat-1);
  // lastEvent is the engine's revealed record, never a planned headline.
  if (seen&&s.swanSeen===true&&event.swan===true) return 'shock';
  if (trade&&CLOSE_TYPES.has(trade.type)&&Number.isFinite(trade.pnl)) {
    if (trade.type==='liquidation') return 'liquidation';
    if (trade.type==='stop') return 'stopped';
    return trade.pnl>.01?'closedWin':trade.pnl<-.01?'closedLoss':'closedFlat';
  }
  const latest=candles.at(-1),previous=candles.at(-2);
  if (latest&&previous) {
    const before=sign(previous.close/previous.open-1),after=sign(latest.close/latest.open-1);
    if (before&&after&&before!==after) return after>0?'reversalUp':'reversalDown';
  }
  if (seen&&/干预/.test(`${event.title||''} ${event.chain||''}`)) return 'intervention';
  const positions=Array.isArray(s.positions)&&s.positions.length?s.positions:s.position?[s.position]:[];
  if (positions.some(p=>p&&(finite(p.leverage)>=50||finite(p.risk)>=20))) return 'risk';
  if (finite(s.family?.outstanding)+finite(s.loan?.outstanding)>0) return 'debt';
  if (!latest) return 'waiting';
  const direction=sign(latest.close/latest.open-1);
  return direction>0?'up':direction<0?'down':'flat';
}

/**
 * Three fictional investors, read-only and deterministic from observed facts.
 * The long/short NPCs each mark a display-only reference position from today's
 * first completed candle open to the last completed close. These are independent
 * of player orders, exclude fees, and never imply an NPC execution or cash flow.
 * No live price/tick, clock, RNG, storage, or planned market data is consulted.
 * Returned IDs change at completed candles, confirmed trades or observed events;
 * consumers may render on every tick without creating new chatter on every tick.
 */
export function investorMessages(state, {limit=3}={}) {
  if (!state||typeof state!=='object') return [];
  const mode=state.mode??'story';
  if (!['story','endless'].includes(mode)) return [];
  const take=Number.isFinite(limit)?Math.min(3,count(limit)):3;
  if (!take) return [];
  const day=Math.max(1,count(state.day)),beat=count(state.beat);
  const candles=completedToday(state,day),first=candles[0],latest=candles.at(-1);
  const direction=latest?sign(latest.close/first.open-1):null;
  const route=direction===null?'waiting':direction>0?'up':direction<0?'down':'flat';
  const trade=recentTrade(state,day,beat);
  const watch=observation(state,candles,trade,day,beat);
  const tradeKey=trade?[trade.type,trade.positionId,trade.day,trade.beat,trade.entry,trade.exit,trade.pnl,trade.margin].join(':'):'';
  const frame=[mode,state.runId||'',finite(state.seed),day,beat,count(state.completedCandles),candles.length,
    first?.open,latest?.open,latest?.close,tradeKey].join('|');
  return ACTORS.slice(0,take).map(npc=>{
    const topic=npc.stance==='watch'?watch:route;
    const lines=INVESTOR_COPY[npc.stance][topic];
    const key=hash(`${frame}|${npc.id}|${topic}`),index=key%lines.length;
    return {id:`npc-${npc.id}-${key.toString(36)}`,actor:npc.actor,stance:npc.stance,text:lines[index]};
  });
}
