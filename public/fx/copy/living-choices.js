// Housing balance and short UI copy approved for the 2026-10-17 economy update.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const homes=[['basic','父亲家·久留美的房间'],['comfortable','老旧木造公寓·1K'],['generous','团地·翻新2DK'],['premium','高级公寓·2LDK'],['penthouse','塔楼顶层·3LDK']];
export const LIVING_CHOICE_COPY=freeze({
 options:homes.map(([id,label])=>({id,label,
 buttonTemplate:'{label}（搬入 {moveInCost} ｜ {dailyTotal}/日）',
 costBreakdownTemplate:'搬入一次 {moveInCost} ｜ 餐食 {dailyBasics} ｜ 住房 {dailyRent} ｜ 合计 {dailyTotal}/日',
 recoveryDescription:'付清当日生活费后，睡眠恢复{sleepRecovery}体力。',
 capDescription:'眼罩使下次睡眠额外恢复15体力，体力上限100。',
 currentStatusTemplate:'当前住处：{label}',scheduledNextDayTemplate:'第{effectiveDay}日搬入{label}',
 insufficientBalanceText:'可用资金不足，搬入{label}需要{moveInCost}。'})),
 shared:{adjustTitle:'住处与生活安排',terms:'搬入费仅在更换住处时收取一次，新住处的每日生活费从下一交易日生效。付清当日生活费才有对应住房的睡眠恢复。',
 pendingMoveTemplate:'第{effectiveDay}日搬入{label}。',servicePaidTemplate:'已支付{label}生活费：餐食 {basicPaid}，住房 {rentPaid}。',
 servicePartialTemplate:'今日生活费未付清，睡眠按基础恢复。',rentPaidTemplate:'住房支出：{rentPaid}',basicsPaidTemplate:'餐食支出：{basicPaid}',
 receivedRecoveryTemplate:'住房恢复：压力减少 {actualStressRelief}，休息恢复增加 {actualRestRecovery}。',
 discountDescription:'今日已买餐食可抵扣日常生活费中的一餐300日元，最多一次。',noodlesCaption:'应急泡面餐',noodlesDescription:'恢复10体力，并抵扣今日生活费中的一餐300日元。',noodlesRecapDescription:'今日餐食已抵扣一餐300日元。',livingOrdinaryReceiptLabel:'每日生活费',livingDiscountedReceiptLabel:'每日生活费（已抵餐食）'},
 compactDisplay:{options:homes.map(([id])=>({id,buttonTemplate:'{label} {dailyTotal}/日',subtitleTemplate:'搬入 {moveInCost} ｜ 睡眠恢复{sleepRecovery}',scheduledNextDayTemplate:'第{effectiveDay}日生效'})),shared:{termsCompact:'搬入费一次收取，新住处的每日费率下一交易日生效；付清生活费后享对应睡眠恢复。',detailTitle:'查看明细'}}
});
export const renderLivingCopy=(template,values)=>String(template||'').replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g,(match,key)=>Object.hasOwn(values,key)?String(values[key]):match);
