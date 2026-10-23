// Observed-market wording follows the user's 2026-10-14 facts-only requirement.
// The historical Gemini snapshot remains preserved in its existing provenance.
export const NEWS_MARKET_COPY = Object.freeze({
 labels:{recap:'盘面回顾',background:'历史背景',details:'详情',unknownTime:'未核实发布时间'},
 recap:'{pair}在{from}至{to}期间，从{start}运行至{last}（{change}%），区间{low}至{high}。',
 crossPair:{
  opening:{title:'{pair}交易时段开始',copy:'当前报价为{last}。'},
  observed:{title:'{pair}盘面更新',copy:'已记录区间内，报价由{start}变为{last}（{change}%），区间{low}至{high}。'}
 }
});
