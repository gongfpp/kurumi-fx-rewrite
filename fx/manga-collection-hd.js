// Alternate full-page originals for three already-collected panels. No new unlocks.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const MANGA_COLLECTION_HD_SOURCES=freeze([
  {
    "record": 28,
    "legacySha256": "1c1b4ffc94318e6c41a9a1bc792ae02827c43387e0d1e57c554793d95f648699",
    "legacyPath": "./manga/context-long-profit.jpg",
    "path": "./manga/collection-hd/record-28-jp.jpg",
    "sha256": "67a82a6a9649f18778932b24307d0c09779151bb26380c6e083899f7fc70031d",
    "dimensions": [
      1441,
      2048
    ],
    "bytes": 494392,
    "kind": "original-manga-page",
    "language": "ja",
    "sourcePageURL": "https://prtimes.jp/main/html/rd/p/000008894.000007006.html",
    "sourceDownloadURL": "https://prtimes.jp/im/action.php?run=html&page=releaseimage&company_id=7006&release_id=8894",
    "archiveMember": "sub2.jpg",
    "alt": "久留美捧着手机欢呼；同页显示澳元兑日元持仓浮盈139,500日元。"
  },
  {
    "record": 31,
    "legacySha256": "0435b533eae72afb00cba7879c2be7ce0ee3b50f2fb10c6a244d5f9902eaf401",
    "legacyPath": "./manga/context-long-loss.jpg",
    "path": "./manga/collection-hd/record-31-jp.jpg",
    "sha256": "a0425ea6d0322060e0720466dab09d52a00f858e50db4638a83b04549f51a84e",
    "dimensions": [
      1441,
      2048
    ],
    "bytes": 774558,
    "kind": "original-manga-page",
    "language": "ja",
    "sourcePageURL": "https://prtimes.jp/main/html/rd/p/000008894.000007006.html",
    "sourceDownloadURL": "https://prtimes.jp/im/action.php?run=html&page=releaseimage&company_id=7006&release_id=8894",
    "archiveMember": "sub4.jpg",
    "alt": "久留美拿着手机发愣；同页显示澳元兑日元持仓浮亏57,500日元。"
  },
  {
    "record": 35,
    "legacySha256": "9236b6766367b430c54f67cd72ff70eb03baded10b4be465e9a00e0b393ec6c3",
    "legacyPath": "./manga/characters-v1/35.jpg",
    "path": "./manga/collection-hd/record-35-jp.jpg",
    "sha256": "08d3a6846794c0cef3a1aae04e8f4be2395c11b383ebbf9fad191dae00663fb2",
    "dimensions": [
      1441,
      2048
    ],
    "bytes": 717690,
    "kind": "original-manga-page",
    "language": "ja",
    "sourcePageURL": "https://prtimes.jp/main/html/rd/p/000008894.000007006.html",
    "sourceDownloadURL": "https://prtimes.jp/im/action.php?run=html&page=releaseimage&company_id=7006&release_id=8894",
    "archiveMember": "sub3.jpg",
    "alt": "久留美的神情僵住；同页的损益评估从负98,500变为负105,000日元。"
  }
]);
export function collectionHdEdition(entry,{readOnlyPreview=false}={}){
 if((!readOnlyPreview&&entry?.unlocked!==true)||entry?.source?.kind!=='original-manga'||entry.id!=='sha256:'+entry.sha256)return null;
 return MANGA_COLLECTION_HD_SOURCES.find(row=>row.record===entry.record&&row.legacySha256===entry.sha256&&row.legacyPath===entry.path)||null;
}
