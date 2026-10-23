// New-run selection only. Providers retain the full validated source outside
// save state; a chart preview never executes a quote or changes an account.
// Sixteen complete 15-minute bars give the default chart useful context.
// Require another hour in that same uninterrupted run after the opening.
const MINUTE=60000,PERIOD=15*MINUTE,WARMUP=16*PERIOD,PLAYABLE=60*MINUTE;
const rowsOf=data=>data.ticks||data.bars||[];
const timeOf=row=>Array.isArray(row)?row[0]:row.availableAt;
export function selectHistoricalOpening(manifest,data){
 if(data.validated!==true)throw Error('历史行情尚未验证');
 const rows=rowsOf(data);if(!rows.length)return null;
 const threshold=manifest.gapThresholdMs;let from=0,best=null;
 for(let end=1;end<=rows.length;end++){
  if(end<rows.length&&timeOf(rows[end])-timeOf(rows[end-1])<=threshold)continue;
  const earliest=Math.ceil((timeOf(rows[from])+WARMUP)/PERIOD)*PERIOD;
  let index=from;while(index<end&&timeOf(rows[index])<earliest)index++;
  if(index<end){const remaining=timeOf(rows[end-1])-timeOf(rows[index]);
   if(remaining>=PLAYABLE&&(!best||remaining>best.remaining))best={index,from,remaining};
  }
  from=end;
 }
 // Tiny or sparse imports keep their first real quote; no invented warm-up,
 // date change, interpolation, or promise of coverage is needed to start them.
 return best?Object.freeze({at:timeOf(rows[best.index]),warmupFrom:timeOf(rows[best.from])}):null;
}
export function historicalOpeningIndex(data,opening){
 const rows=rowsOf(data);if(!opening)return 0;
 if(!Number.isSafeInteger(opening.at)||!Number.isSafeInteger(opening.warmupFrom)||opening.warmupFrom>opening.at)throw Error('历史开局时间无效');
 const index=rows.findIndex(row=>timeOf(row)===opening.at);
 if(index<0||opening.warmupFrom<timeOf(rows[0]))throw Error('历史开局时间不在当日行情内');
 return index;
}
