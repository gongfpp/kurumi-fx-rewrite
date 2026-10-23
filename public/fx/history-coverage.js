// This inventory is the existing anonymous-game allowlist, not a new grant to
// publish other local research. A month label never proves a whole year's data.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const APPROVED_GAME_HISTORY=freeze([
 {id:'2014-02',symbol:'USDJPY',precision:'tick-bid-ask',paths:[{path:'2014-02/package.fxhistory.gz',bytes:4916015,sha256:'bc75bc22cc39bc4226d2391d581edd19b6e14fefa4f09eacd7e0dfc608ff0b2a'}],firstObservedAt:1391378403273,lastObservedAt:1393624799880,jstDates:24,observations:949455,quoteSide:'bid-ask',timestampMeaning:'source-tick-time'},
 {id:'2008-10',symbol:'USDJPY',precision:'M1-OHLC',paths:[{path:'2008-10/manifest.json',bytes:26661,sha256:'e4ef3d8ab47ebffe391b59e0c8b28a587768cd30985cef8826da01d825c32dc5'},{path:'2008-10/USDJPY-2008-10.forexite.m1.csv.gz',bytes:429204,sha256:'da10482677dfaf6493a3e762e9137c23635130b2f13addfec0abd6ccfdc10fdd'}],observations:32629,quoteSide:'unverified-single-price-OHLC',timestampMeaning:'unknown-open-or-close-label',availabilityModel:'label-plus-60-seconds'}
]);
export const HISTORICAL_COVERAGE_GAPS=freeze({fullYear:'not-verified',GBPUSD:'no-approved-game-input',AUDUSD:'no-approved-game-input',forexitePriceSide:'unverified-single-price-OHLC',m1TimestampMeaning:'unknown-open-or-close-label',privateThreePair2014FebruaryMarch:'local-research-only',qualityHold:'retained',exhaustion:'continue-simulated-from-last-real-price'});
export function describeHistoricalCoverage(manifest,{rawM1,payloadVerified=false}={}){
 const days=manifest.days||[],m1=manifest.quoteType==='observed-single-close';
 const dates=days.map(d=>d.date),ranges=rawM1?.days||[];
 const first=m1&&ranges.length?Date.parse(ranges[0].firstLabelUTC)+60000:days[0]?.first;
 const last=m1&&ranges.length?Date.parse(ranges.at(-1).lastLabelUTC)+60000:days.at(-1)?.last;
 return freeze({datasetId:manifest.id,symbol:manifest.symbol,precision:m1?'M1-OHLC':'tick-bid-ask',dates,dateCount:dates.length,observations:rawM1?.rows??(days.every(d=>Number.isSafeInteger(d.count))?days.reduce((n,d)=>n+d.count,0):null),countsBasis:'declared-manifest',payloadVerified,firstObservedAt:Number.isFinite(first)?first:null,lastObservedAt:Number.isFinite(last)?last:null,quoteSide:m1?manifest.research?.quoteSide:'bid-ask',timestampMeaning:m1?manifest.research?.timestampMeaning:'source-tick-time',availabilityModel:m1?manifest.research?.availabilityModel:'source-timestamp',fullYearVerified:false,continuousCoverageVerified:false,exhaustion:'continue-simulated-from-last-real-price'});
}
