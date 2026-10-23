// Authored fallback art for actions missing an exact approved original-manga panel.
// Provenance belongs in the source viewer/credits, not in in-scene disclaimers.
export const PROP_EVENT_ART = Object.freeze({
  energy:{path:'./generated/props-v1/energy.webp',alt:'久留美在桌前喝能量饮料',kind:'generated-game-art'},
  celebration:{path:'./generated/props-v1/spa.webp',alt:'久留美在温泉休息区的按摩椅上放松',kind:'generated-game-art'},
  mochiko:{path:'./generated/character-profit-v1/mochiko-watch-v3.webp',alt:'久留美请萌智子帮忙，两人核对持仓；萌智子指着屏幕，久留美点头回应。',kind:'generated-game-art'},
  takeaway:{path:'./comics/event-takeaway.webp',grid:[1,0,2,2],alt:'久留美吃外卖便当',kind:'existing-game-art'},
  noodles:{path:'./comics/event-takeaway.webp',grid:[1,1,2,2],alt:'久留美在夜里吃杯面',kind:'existing-game-art'},
});
export const LIVING_EVENT_ART = Object.freeze({
  friend:{path:'./generated/props-v1/friend-meal.webp',alt:'朋友拿出自己的钱包请久留美吃一顿饭',kind:'generated-game-art'},
  feast:{path:'./generated/props-v1/feast.webp',alt:'久留美在餐馆吃一顿丰盛的晚餐',kind:'generated-game-art'},
});
export function propEventArt(propId,{applied=false}={}) {
  // A failed purchase or a hover is not evidence the character used the item.
  return applied && Object.hasOwn(PROP_EVENT_ART,propId) ? PROP_EVENT_ART[propId] : null;
}
export function livingEventArt({kind,applied=false,amount,tradingNet,knownFriend=false,traumaActive=false}={}) {
  if(!applied || !Number.isFinite(amount) || amount<0 || !Number.isFinite(tradingNet))return null;
  if(kind==='friend'&&amount===0&&tradingNet<0&&knownFriend)return LIVING_EVENT_ART.friend;
  if(kind==='feast'&&amount>0&&tradingNet>0&&!traumaActive)return LIVING_EVENT_ART.feast;
  return null;
}
