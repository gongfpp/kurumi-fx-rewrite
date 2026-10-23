import {FIRSTDAY_BACKSTORY_ASSETS} from './contextual-manga-firstday-backstory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {BORROWING_CONTINUATION_ASSETS} from './contextual-manga-borrowing-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LINK_DAILY_ASSETS} from './contextual-manga-links-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {REVERSAL_DAILY_ASSETS} from './contextual-manga-reversal-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {VERIFIED_DAILY_ASSETS} from './contextual-manga-verified-daily.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DAILY_EXTENSION_ASSETS} from './contextual-manga-daily-extension.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {RESTRAINT_MANGA_ASSETS,RESTRAINT_MANGA_NODES,RESTRAINT_MANGA_ARCS} from './contextual-manga-restraint-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {PROFIT_MANGA_ASSETS,PROFIT_MANGA_NODES,PROFIT_MANGA_ARCS} from './contextual-manga-profit-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {BORROWED_MANGA_ASSETS,BORROWED_MANGA_NODES,BORROWED_MANGA_ARCS} from './contextual-manga-borrowed-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Reviewed, fixed character history. No triggers, live prices, or game-account mutations.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const CONTEXTUAL_MANGA_ASSETS=freeze({
  ...FIRSTDAY_BACKSTORY_ASSETS,
  ...BORROWING_CONTINUATION_ASSETS,
  ...REVERSAL_DAILY_ASSETS,
  ...LINK_DAILY_ASSETS,
  ...DAILY_EXTENSION_ASSETS,
  ...VERIFIED_DAILY_ASSETS,
  ...BORROWED_MANGA_ASSETS,
  ...PROFIT_MANGA_ASSETS,
  ...RESTRAINT_MANGA_ASSETS,
  "145": {
    "record": 145,
    "path": "./manga/contextual-def/145.jpg",
    "sha256": "6aa8c9d56a97283cdf0164558c78714f8c132c7201ae1d338dd2c06fdf85849f",
    "dimensions": [
      839,
      457
    ]
  },
  "147": {
    "record": 147,
    "path": "./manga/contextual-def/147.jpg",
    "sha256": "75c675598c4d8f20192937b9651b1e56a7eebd12863d518cf573ba15ed040a9a",
    "dimensions": [
      806,
      465
    ]
  },
  "148": {
    "record": 148,
    "path": "./manga/contextual-def/148.jpg",
    "sha256": "434813e989e59b6ef9b1cf4e189f72acd708ce23f49d046dba0548000db4fea7",
    "dimensions": [
      809,
      388
    ]
  },
  "149": {
    "record": 149,
    "path": "./manga/contextual-def/149.jpg",
    "sha256": "082cad55118f8b85654e14f2e49e582e9d1411844e31e88ebd9c7be1039f831a",
    "dimensions": [
      802,
      463
    ]
  },
  "150": {
    "record": 150,
    "path": "./manga/contextual-def/150.jpg",
    "sha256": "f7172a0f7e049f54245bde28e9f2177a1804e659512c93166f59087ccafde9ad",
    "dimensions": [
      608,
      475
    ]
  },
  "151": {
    "record": 151,
    "path": "./manga/contextual-def/151.jpg",
    "sha256": "5111a86a056c7af34009e44b7e31426ce5d16b774b2972f5c605421a8d3075af",
    "dimensions": [
      805,
      504
    ]
  },
  "157": {
    "record": 157,
    "path": "./manga/contextual-def/157.jpg",
    "sha256": "55676377e3f6f3dd56d9a9f63592f95e9edce10004c12eae4f3deced069a05dc",
    "dimensions": [
      726,
      476
    ]
  },
  "158": {
    "record": 158,
    "path": "./manga/contextual-def/158.jpg",
    "sha256": "bec143c0bcab8652ce7dfebe87a15f8821e69d8d493313ddd4261ea4ca5b66cb",
    "dimensions": [
      490,
      152
    ]
  },
  "159": {
    "record": 159,
    "path": "./manga/contextual-def/159.jpg",
    "sha256": "a25e60c67dd0f744f18cd923569bd7aeecb749f3df15749956cffd85f09a08a4",
    "dimensions": [
      877,
      315
    ]
  },
  "161": {
    "record": 161,
    "path": "./manga/contextual-def/161.jpg",
    "sha256": "81787521fdad699204749f9e3d40a3a52bb47c818ec1c4d142d81666f42438d2",
    "dimensions": [
      903,
      587
    ]
  },
  "162": {
    "record": 162,
    "path": "./manga/contextual-def/162.jpg",
    "sha256": "97b2a740754e5b9568b6c628c73d7f3baa53396bc2326cd122386480e0bb136d",
    "dimensions": [
      438,
      475
    ]
  },
  "166": {
    "record": 166,
    "path": "./manga/contextual-def/166.jpg",
    "sha256": "13ef7376d27bc7a9d8189ead3c744daa9112f70bd71520d089fc4a7af3d1606c",
    "dimensions": [
      560,
      424
    ]
  },
  "167": {
    "record": 167,
    "path": "./manga/contextual-def/167.jpg",
    "sha256": "7dc9aa1862ca29b5e7c98fe4a841c7de2363492076c76745f609c02b1d9e5b5f",
    "dimensions": [
      888,
      463
    ]
  },
  "169": {
    "record": 169,
    "path": "./manga/contextual-def/169.jpg",
    "sha256": "32a69dbfff2c36fac61eea2dce38fcfb5a1757cb18ea4cec0cd93b072943ec8f",
    "dimensions": [
      888,
      496
    ]
  },
  "130": {
    "record": 130,
    "path": "./manga/contextual-def/130.jpg",
    "sha256": "bce31fd9f56e52387bffd68c3f3fe6313c0397959aefe56a2ed90ce38fd47d18",
    "dimensions": [
      629,
      485
    ]
  },
  "131": {
    "record": 131,
    "path": "./manga/contextual-def/131.jpg",
    "sha256": "56701bb03ee9cdf635300ec7e08525ee7136cf89c0d372a00bc935eb9ce6ee0e",
    "dimensions": [
      792,
      420
    ]
  },
  "132": {
    "record": 132,
    "path": "./manga/contextual-def/132.jpg",
    "sha256": "bce48ac519e9db7d9dbbe46fd75ff4f57e7a81cf426875daaeeb062443c3a720",
    "dimensions": [
      857,
      523
    ]
  },
  "133": {
    "record": 133,
    "path": "./manga/contextual-def/133.jpg",
    "sha256": "72b2b4d237367276d35c944cbe3c992291f4286fd6871ab85d642df01ee18905",
    "dimensions": [
      857,
      407
    ]
  },
  "134": {
    "record": 134,
    "path": "./manga/contextual-def/134.jpg",
    "sha256": "f72fd026b0114bd387f74b52d13ea471eed3f8af3b220d888b18c44397f6bf57",
    "dimensions": [
      792,
      421
    ]
  },
  "135": {
    "record": 135,
    "path": "./manga/contextual-def/135.jpg",
    "sha256": "b7e07dca76f6c27c89a1629e477fba5c36aa835206a988c520e9cf0edaa89cfa",
    "dimensions": [
      840,
      515
    ]
  },
  "97": {
    "record": 97,
    "path": "./manga/contextual-def/97.jpg",
    "sha256": "53ccf9b691f0ed6325ce51329168390d8c39913f0b100f322f5c2775f492f411",
    "dimensions": [
      425,
      401
    ]
  },
  "98": {
    "record": 98,
    "path": "./manga/contextual-def/98.jpg",
    "sha256": "8c093f23dcadbbc5304b2b948a543918f7fedf73c9b2dc040fc958b90c229452",
    "dimensions": [
      839,
      958
    ]
  },
  "99": {
    "record": 99,
    "path": "./manga/contextual-def/99.jpg",
    "sha256": "d290f8000d6057b13a802d91bf71a3eecffa17355e3742e05adecb423004fb5f",
    "dimensions": [
      797,
      380
    ]
  },
  "100": {
    "record": 100,
    "path": "./manga/contextual-def/100.jpg",
    "sha256": "56e9d5334433e948f245c1063ad2d594892f6d8500057b521fac27d96612e466",
    "dimensions": [
      790,
      666
    ]
  },
  "101": {
    "record": 101,
    "path": "./manga/contextual-def/101.jpg",
    "sha256": "d686c5fc1bc5fa03f1f39ee969d2d20c26aae9d3f23aaadc98163504acb01cfd",
    "dimensions": [
      790,
      70
    ]
  },
  "103": {
    "record": 103,
    "path": "./manga/contextual-def/103.jpg",
    "sha256": "2da54ba7d620b7c359b0c92ea2d723755fbf4b11a26ae5b946498b217d83f1a2",
    "dimensions": [
      866,
      510
    ]
  },
  "104": {
    "record": 104,
    "path": "./manga/contextual-def/104.jpg",
    "sha256": "060049f7f1b1aca6e2d1cac6f85dd6d4388bd4d647db9579a00113b4f8308377",
    "dimensions": [
      872,
      1287
    ]
  }
});
export const CONTEXTUAL_MANGA_NODES=freeze([
  ...BORROWED_MANGA_NODES,
  ...PROFIT_MANGA_NODES,
 ...RESTRAINT_MANGA_NODES,
  {
    "id": "loan-funds-return",
    "chapter": 12,
    "title": "想把本金赚回来",
    "people": "芽吹",
    "pages": [
      13,
      20,
      21
    ],
    "positionOwner": "芽吹 · 银行余额与FX入金",
    "before": "芽吹又想起了剩下的助学贷款。她的银行账户里，还有638,321日元。",
    "panels": [
      {
        "record": 145,
        "alt": "手机显示山师芽吹的银行账户余额638,321日元，文字提及剩下的助学贷款"
      },
      {
        "record": 147,
        "alt": "芽吹坐在电脑前给自己打气；海外FX账户余额600,000日元，标明600,000日元入金"
      },
      {
        "record": 148,
        "alt": "芽吹举着钞票，想先赚回最初的二十万本金"
      }
    ],
    "after": "她向海外FX账户入金六十万日元，告诉自己不能再失败。她的第一个目标，是把最初的二十万本金赚回来。",
    "arc": "borrowed-recovery"
  },
  {
    "id": "short-recovery-plan",
    "chapter": 12,
    "title": "她设想的下跌",
    "people": "芽吹",
    "pages": [
      22,
      24
    ],
    "positionOwner": "芽吹 · USD/JPY空头",
    "before": "芽吹把目光转向美元兑日元。她觉得自己经历过英镑交易，已经成长了，认定美元涨不起来。",
    "panels": [
      {
        "record": 149,
        "alt": "美元兑日元走势图旁，芽吹的想法是自己已经成长，美元不可能上涨；画面没有人物"
      },
      {
        "record": 150,
        "alt": "芽吹在电脑前开始交易；记录为USD/JPY 105.355日元，十手做空"
      },
      {
        "record": 151,
        "alt": "从现在指向未来的示意图，画出芽吹想象中跌向一百日元区间的路径"
      }
    ],
    "after": "她在105.355日元做空十手，已经开始想象一路跌到一百日元区间的未来。",
    "arc": "borrowed-recovery"
  },
  {
    "id": "short-add-risk",
    "chapter": 13,
    "title": "加仓之后的风险线",
    "people": "芽吹",
    "pages": [
      2,
      3,
      4
    ],
    "positionOwner": "芽吹 · USD/JPY空头浮动盈亏",
    "before": "芽吹又追加做空十手，总共拿着二十手。她盼着下跌能挽回局面，也知道反过来上涨，亏损就会加快。",
    "panels": [
      {
        "record": 157,
        "alt": "芽吹的分支示意图：追加十手后共二十手，下跌有望挽回，上涨会加速亏损"
      },
      {
        "record": 158,
        "alt": "文字裁图标出109.6与风险线，没有人物或已触发强平的记录"
      },
      {
        "record": 159,
        "alt": "上涨的K线旁列出浮动盈亏负293,500日元"
      }
    ],
    "after": "109.6成了她担心的风险线。眼前的浮动盈亏，已经是负293,500日元。",
    "arc": "borrowed-recovery"
  },
  {
    "id": "living-cost-plan",
    "chapter": 13,
    "title": "连生活费也想投进去",
    "people": "芽吹",
    "pages": [
      6
    ],
    "positionOwner": "芽吹 · 追加生活费计划",
    "before": "面对浮亏，芽吹又想了一个办法：把生活费全部入金。",
    "panels": [
      {
        "record": 161,
        "alt": "芽吹在房间里宣布接下来要把生活费全部入金"
      },
      {
        "record": 162,
        "alt": "水杯、面包边和面包插图，配着芽吹设想每天只吃一顿的文字"
      }
    ],
    "after": "她甚至盘算着，每天只吃一顿，靠自来水和面包边省下生活费。",
    "arc": "borrowed-recovery"
  },
  {
    "id": "deposit-and-drawdown",
    "chapter": 13,
    "title": "入金也追不上浮亏",
    "people": "芽吹",
    "pages": [
      7,
      8
    ],
    "positionOwner": "芽吹 · 入金与USD/JPY空头浮亏",
    "before": "九月十八日，芽吹又入金十万日元，海外FX账户余额变成七十万日元。她仍坐在电脑前。",
    "panels": [
      {
        "record": 166,
        "alt": "九月十八日，芽吹坐在电脑前；海外FX账户余额700,000日元，另标100,000日元入金"
      },
      {
        "record": 167,
        "alt": "芽吹冒汗盯着电脑，浮动盈亏为负507,900日元"
      },
      {
        "record": 169,
        "alt": "芽吹惊慌地回看两周内将近四日元的上涨，担心再这样涨就来不及继续入金"
      }
    ],
    "after": "可浮亏已到507,900日元。她看着两周内将近四日元的上涨，担心照这个速度，即使省吃俭用也撑不到两个月。",
    "arc": "borrowed-recovery"
  },
  {
    "id": "full-position-confidence",
    "chapter": 11,
    "title": "一个人也能行吗",
    "people": "芽吹",
    "pages": [
      29,
      30
    ],
    "positionOwner": "芽吹 · 国内FX账户余额",
    "before": "芽吹拍下鼠标，满脑子都是赚大钱。",
    "panels": [
      {
        "record": 130,
        "alt": "芽吹睁大眼睛拍下鼠标，喊着赚大钱"
      },
      {
        "record": 131,
        "alt": "芽吹流着汗给自己鼓劲；国内FX账户余额695,100日元"
      }
    ],
    "after": "国内FX账户里有695,100日元。她一边冒汗，一边鼓励自己：只有一个人，也能战斗。",
    "arc": "twenty-seconds"
  },
  {
    "id": "hundred-lot-entry",
    "chapter": 11,
    "title": "一口气买入一百手",
    "people": "芽吹",
    "pages": [
      31,
      35
    ],
    "positionOwner": "芽吹 · GBP/USD多头浮动盈亏",
    "before": "芽吹张开双臂，一口气满仓买入一百手英镑兑美元。记录上的价格是1.67810美元。",
    "panels": [
      {
        "record": 132,
        "alt": "芽吹背对屏幕张开双臂；GBP/USD 1.67810美元，一百手买入"
      },
      {
        "record": 133,
        "alt": "黑底画面列出浮动盈亏正500,000日元，没有人物"
      }
    ],
    "after": "接着，五十万日元的浮盈出现在眼前。",
    "arc": "twenty-seconds"
  },
  {
    "id": "twenty-second-profit",
    "chapter": 11,
    "title": "只看见了二十秒",
    "people": "芽吹",
    "pages": [
      36,
      37
    ],
    "positionOwner": "芽吹 · GBP/USD多头浮动盈亏",
    "before": "十八点三十分，浮盈还在一秒一秒往上跳。芽吹盯着数字，渐渐失去了对金额大小的感觉。",
    "panels": [
      {
        "record": 134,
        "alt": "芽吹坐在桌前；十八点三十分七秒到十秒依次显示正503,298、521,488、549,211、560,650"
      },
      {
        "record": 135,
        "alt": "十八点三十分二十秒，浮动盈亏变成负9,897日元；芽吹呆住，旁白写盈利只出现二十秒"
      }
    ],
    "after": "到了十八点三十分二十秒，浮动盈亏变成负9,897日元。她能看见盈利的时间，仅仅二十秒。",
    "arc": "twenty-seconds"
  },
  {
    "id": "first-pair-opinion",
    "chapter": 7,
    "title": "前辈觉得会跌",
    "people": "久留美与芽吹",
    "pages": [
      27,
      28
    ],
    "positionOwner": null,
    "before": "芽吹和久留美看起英镑兑日元。久留美先疑惑了一下，为什么挑了这个货币。",
    "panels": [
      {
        "record": 97,
        "alt": "GBP/JPY下行K线图，配着为什么看英镑的疑问；画面没有人物"
      },
      {
        "record": 98,
        "alt": "久留美置身下跌K线环绕的夸张画面，判断应该会跌"
      }
    ],
    "after": "看着图表，久留美给出了自己的判断：应该会跌吧。",
    "arc": "follow-confidence"
  },
  {
    "id": "first-follow-short",
    "chapter": 7,
    "title": "第一笔相信前辈",
    "people": "芽吹与久留美",
    "pages": [
      29,
      30,
      32
    ],
    "positionOwner": "芽吹 · GBP/JPY空头",
    "before": "芽吹从身后抱住久留美，兴奋地决定卖出。第一笔交易，她选择相信前辈。",
    "panels": [
      {
        "record": 99,
        "alt": "芽吹从身后抱住惊讶的久留美，表示第一笔交易选择相信前辈并卖出"
      },
      {
        "record": 100,
        "alt": "芽吹张臂做空；图内具名GBP/JPY十手做空"
      },
      {
        "record": 101,
        "alt": "黑底文字写着要是自己也卖出就赚到了；没有人物或实际盈利金额"
      }
    ],
    "after": "芽吹做空了十手英镑兑日元。久留美随后有些懊悔，想着自己要是也卖出就好了。",
    "arc": "follow-confidence"
  },
  {
    "id": "copying-confidence",
    "chapter": 8,
    "title": "她越来越相信前辈",
    "people": "芽吹",
    "pages": [
      17,
      18
    ],
    "positionOwner": "芽吹 · 海外FX账户余额",
    "before": "芽吹开始觉得，只要每次都照久留美前辈的话交易，就能一直赢下去。",
    "panels": [
      {
        "record": 103,
        "alt": "芽吹笑着托腮，设想照久留美的话交易就能保证胜利"
      },
      {
        "record": 104,
        "alt": "芽吹在钞票飞舞的夸张画面中庆祝连胜；海外FX账户余额354,560日元，括号列出增量154,560日元"
      }
    ],
    "after": "接连的胜利让她喜不自胜。那时，她的海外FX账户余额是354,560日元，画面列出的增量为154,560日元。",
    "arc": "follow-confidence"
  }
]);
export const CONTEXTUAL_MANGA_ARCS=freeze({
  ...BORROWED_MANGA_ARCS,
  ...PROFIT_MANGA_ARCS,
 ...RESTRAINT_MANGA_ARCS,
  "borrowed-recovery": [
    "loan-funds-return",
    "short-recovery-plan",
    "short-add-risk",
    "living-cost-plan",
    "deposit-and-drawdown"
  ],
  "twenty-seconds": [
    "full-position-confidence",
    "hundred-lot-entry",
    "twenty-second-profit"
  ],
  "follow-confidence": [
    "first-pair-opinion",
    "first-follow-short",
    "copying-confidence"
  ]
});
