// Approved player help. Keep the reviewed text unchanged; calculations remain in run-statistics.js.
export const COMPLETE_ORDER_HELP = Object.freeze({
  extremes: "“最赚的一单/最亏的一单”仅统计已完全平仓的订单。其金额按同一完整订单的全部分批与最终平仓净额合并计算，并已包含开仓及平仓手续费。",
  winRate: "完整订单胜率＝盈利的完全平仓订单数÷全部完全平仓订单数×100%；净收益大于0.005日元计为盈利，盈亏绝对值不大于0.005日元算保本并计入分母，未完全平仓的订单不计入分子与分母。若暂无已完全平仓的订单，或无法可靠确定该指标时显示为未知而非0%。"
});
