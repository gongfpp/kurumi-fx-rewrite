// Pure presentation helpers extracted from app.js; retain its rounding and sign behavior.
export const yen = value => `${value<0?'−':''}¥${Math.abs(value).toLocaleString('zh-CN',{maximumFractionDigits:2})}`;
export const signed = value => `${value>0?'+':''}${yen(value)}`;
