import {MANGA_PANELS} from './manga-panels.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
// Trophy references are labelled as inspiration, not screenshots of this save.
const mappings=Object.freeze({
 'first-profit':{panel:'profit',note:'原作第 1 话第 45 页首单确认盈利。游戏解锁依据本局手续费后真实平仓结果；不采用图中 +24,000。'},
 'million-thirty':{panel:'million-thirty',note:'原作第 5 话第 23 页为一次确定收益 130 万。游戏条件是累计已实现净收益，二者不当成同一张账单。'},
 'accept-stop':{panel:'accept-stop',note:'原作第 4 话第 2 页是下决心止损。游戏把这个决心变成一次真实 stop 成交，不声称原图已经执行。'},
 'twenty-million':{panel:'recovery-vow',note:'游戏自拟成就名。原作第 1 话第 11 页是“想赚回两千万”的目标，并非原作已经赚到钱；本局以累计已实现净利润兑现这个 IF。'}
});
export function achievementManga(id){const map=mappings[id],panel=map&&MANGA_PANELS[map.panel];return panel?{panel,note:map.note}:null;}
