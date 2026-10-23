import {MANGA_PANELS} from './manga-panels.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Parallel original episodes. Fixed pictures and third-person narration only.
const reused={16:'short-entry',17:'leverage',19:'retreat',20:'profit'};
export const PROFIT_MANGA_ASSETS={
 ...Object.fromEntries(Object.entries(reused).map(([id,key])=>{const p=MANGA_PANELS[key];return [id,{record:Number(id),path:p.original,sha256:p.sha256,dimensions:p.imageSize}];})),
 ...{
  "13": {
    "record": 13,
    "sha256": "cfb367e10341ceb3eaa15536f45ab6932373f423ae4f7c974c3b334213c1b5ee",
    "dimensions": [
      747,
      614
    ],
    "path": "./manga/contextual-ijk/13.jpg"
  },
  "14": {
    "record": 14,
    "sha256": "62d70abce44387991481dbde6f68093865e6ef0c0196f3731819ee656da9b953",
    "dimensions": [
      753,
      354
    ],
    "path": "./manga/contextual-ijk/14.jpg"
  },
  "15": {
    "record": 15,
    "sha256": "e80f14d6306a99efd320c3c4ec569aa5c60e1fb22f9e32a020f27cf17edc9d24",
    "dimensions": [
      328,
      391
    ],
    "path": "./manga/contextual-ijk/15.jpg"
  },
  "18": {
    "record": 18,
    "sha256": "6cd571c934e006871266cbe41e06dd78113b4e78cee962030c097f9165003868",
    "dimensions": [
      332,
      555
    ],
    "path": "./manga/contextual-ijk/18.jpg"
  },
  "21": {
    "record": 21,
    "sha256": "237e33e1e2f642dca8961bdead9c2698cb5ccdf5bed1f36a5efe264ff9ee4ed5",
    "dimensions": [
      784,
      771
    ],
    "path": "./manga/contextual-ijk/21.jpg"
  },
  "136": {
    "record": 136,
    "sha256": "481aa94a770525d944baca480bae47c89f25fad9246e2d36ec77938b06ea02b5",
    "dimensions": [
      809,
      495
    ],
    "path": "./manga/contextual-ijk/136.jpg"
  },
  "137": {
    "record": 137,
    "sha256": "736e3b2dcb8890b01feff632c415cbf252fead0bf7bd499919ec5a810a26c63d",
    "dimensions": [
      809,
      332
    ],
    "path": "./manga/contextual-ijk/137.jpg"
  },
  "138": {
    "record": 138,
    "sha256": "d762285b18d42030ec3b6422988d83ba294278b61cb152b02961eff66e4f446f",
    "dimensions": [
      805,
      407
    ],
    "path": "./manga/contextual-ijk/138.jpg"
  },
  "139": {
    "record": 139,
    "sha256": "f84a08a36e4c5693a670e13446e5bdfc5ab00f445bf4b52ab7952bbc82ca7966",
    "dimensions": [
      805,
      401
    ],
    "path": "./manga/contextual-ijk/139.jpg"
  },
  "140": {
    "record": 140,
    "sha256": "fdeafa180ab626359759155a68908457ed7a0941d551d23d3090167df3291673",
    "dimensions": [
      809,
      426
    ],
    "path": "./manga/contextual-ijk/140.jpg"
  },
  "141": {
    "record": 141,
    "sha256": "d5aec40b2da27806c2dede463e6b9ac8b43fabcc9884e3fe1eac5a88857c4d83",
    "dimensions": [
      802,
      528
    ],
    "path": "./manga/contextual-ijk/141.jpg"
  },
  "142": {
    "record": 142,
    "sha256": "669442194b75a22b6568b980951545a2bdcc35b47a045a7192372ea1a5143535",
    "dimensions": [
      828,
      537
    ],
    "path": "./manga/contextual-ijk/142.jpg"
  },
  "143": {
    "record": 143,
    "sha256": "f6f4871fb93451de7e7169fab95f842d65eb5fa3d18d1ed577e07a5e970a9548",
    "dimensions": [
      805,
      547
    ],
    "path": "./manga/contextual-ijk/143.jpg"
  },
  "144": {
    "record": 144,
    "sha256": "6caf0acb3ad3d5344974b45f53634d2a84c192814a2b58d12c951ff1e43492e5",
    "dimensions": [
      809,
      506
    ],
    "path": "./manga/contextual-ijk/144.jpg"
  },
  "180": {
    "record": 180,
    "sha256": "b98542b3f12a145f4efc75c9f1f8c9f831e9bd5b21d27b92f984bd6c69f1d755",
    "dimensions": [
      1005,
      400
    ],
    "path": "./manga/contextual-ijk/180.jpg"
  },
  "182": {
    "record": 182,
    "sha256": "8363c4f8f4cf3473885d0a47e982229224f6275eb903263b6af805fe9222f710",
    "dimensions": [
      342,
      625
    ],
    "path": "./manga/contextual-ijk/182.jpg"
  },
  "183": {
    "record": 183,
    "sha256": "049c83d07fe5f1b738e4f9ee0ce263e50e1413cc04818dd3d861c76dec8a598a",
    "dimensions": [
      982,
      355
    ],
    "path": "./manga/contextual-ijk/183.jpg"
  },
  "184": {
    "record": 184,
    "sha256": "f845a814ac1a1c701cad9956477425748b9869fb88a9452dfdcb7820a1d9fbb6",
    "dimensions": [
      985,
      507
    ],
    "path": "./manga/contextual-ijk/184.jpg"
  },
  "187": {
    "record": 187,
    "sha256": "06d2c4c1090cdb3bb370925ed91d3c35e03765b39b8596cbaa76ebebe0bb4ae9",
    "dimensions": [
      519,
      521
    ],
    "path": "./manga/contextual-ijk/187.jpg"
  },
  "188": {
    "record": 188,
    "sha256": "c1b19e3fd9beff25447b4c23c560dc9fb34eae1c9f797715532a7f37e78d4752",
    "dimensions": [
      431,
      483
    ],
    "path": "./manga/contextual-ijk/188.jpg"
  },
  "189": {
    "record": 189,
    "sha256": "57d232bd2b193e7c0f1f56a74cea9043b687fd6e9009d450e8aa835ef3c3b48b",
    "dimensions": [
      1009,
      288
    ],
    "path": "./manga/contextual-ijk/189.jpg"
  },
  "190": {
    "record": 190,
    "sha256": "1ee2a9c293b28ab3997d178781b9ad0588a3f77db01e214cadb840ba477111ff",
    "dimensions": [
      525,
      550
    ],
    "path": "./manga/contextual-ijk/190.jpg"
  },
  "191": {
    "record": 191,
    "sha256": "1d0a0a024212a1a8c525512a45bc114548726d0a6f0407b2a0ad0f87eb155638",
    "dimensions": [
      469,
      643
    ],
    "path": "./manga/contextual-ijk/191.jpg"
  },
  "192": {
    "record": 192,
    "sha256": "b9ba16f4c36295f791a97d71e15b9a80adfea91f3ded43696585eb011a3e36c3",
    "dimensions": [
      1000,
      472
    ],
    "path": "./manga/contextual-ijk/192.jpg"
  },
  "193": {
    "record": 193,
    "sha256": "f087fdb9b23f97c6162a156498f93459d84d291f07112a73b7d6f2894727b51c",
    "dimensions": [
      557,
      459
    ],
    "path": "./manga/contextual-ijk/193.jpg"
  },
  "194": {
    "record": 194,
    "sha256": "78510190c593877d249ba9c1fdad0f39be78632e10d01a962538dce5e803aef2",
    "dimensions": [
      544,
      463
    ],
    "path": "./manga/contextual-ijk/194.jpg"
  }
}
};
export const PROFIT_MANGA_NODES=[
  {
    "id": "first-profit-plan",
    "arc": "realized-short-profit",
    "chapter": 1,
    "pages": [
      40,
      41
    ],
    "title": "先说好，见好就收",
    "people": "久留美",
    "positionOwner": null,
    "before": "久留美坐在电脑前，海外FX账户里有三十万日元。她给自己定下一个规矩：见好就收。",
    "panels": [
      {
        "record": 13,
        "alt": "久留美坐在电脑前，实名海外FX账户余额为300,000日元"
      },
      {
        "record": 14,
        "alt": "USD/JPY五分钟图表与久留美的Q版标识，旁边写着见好就收"
      },
      {
        "record": 15,
        "alt": "久留美认为美日还有下跌余地，旁边的蜡烛图突然上冲"
      }
    ],
    "after": "可看着美日，她又觉得还有下跌的余地。"
  },
  {
    "id": "first-profit-leverage",
    "arc": "realized-short-profit",
    "chapter": 1,
    "pages": [
      42,
      43,
      44
    ],
    "title": "赚得快，亏得也快",
    "people": "久留美",
    "positionOwner": null,
    "before": "久留美卖出了十枚。她想，只要低价买回来就行。",
    "panels": [
      {
        "record": 16,
        "alt": "久留美卖出后露出笑容，盘算等价格更低时买回"
      },
      {
        "record": 17,
        "alt": "久留美感叹杠杆威力，示意图列出汇率上下波动一日元对应的十万日元盈亏"
      },
      {
        "record": 18,
        "alt": "久留美兴奋地想象秒薪一千日元，画面没有已实现收益凭据"
      }
    ],
    "after": "她一边冒汗，一边开始想象秒薪一千日元。"
  },
  {
    "id": "first-profit-exit",
    "arc": "realized-short-profit",
    "chapter": 1,
    "pages": [
      44,
      45
    ],
    "title": "反弹了，撤退",
    "people": "久留美",
    "positionOwner": null,
    "before": "反弹突然出现，久留美立刻点击撤退。",
    "panels": [
      {
        "record": 19,
        "alt": "久留美看到反弹后惊慌点击，喊着立即撤退"
      },
      {
        "record": 20,
        "alt": "久留美庆祝确定盈利，实际损益面板从0日元变为正24,000日元"
      }
    ],
    "after": "实际损益跳到了正数。她终于把这笔利润留了下来。"
  },
  {
    "id": "first-profit-vow",
    "arc": "realized-short-profit",
    "chapter": 1,
    "pages": [
      46
    ],
    "title": "又有了底气",
    "people": "久留美",
    "positionOwner": null,
    "before": "久留美盯着确定收益的记录，笑得停不下来。",
    "panels": [
      {
        "record": 21,
        "alt": "久留美大笑，USD/JPY面板列出十枚确定收益正24,200日元与正24.2pips；她发誓把钱拿回来"
      }
    ],
    "after": "这次盈利，让她更相信自己能把钱赚回来。"
  },
  {
    "id": "mebuki-loss-message",
    "arc": "reversal-liquidation",
    "chapter": 12,
    "pages": [
      1,
      4
    ],
    "title": "数字越跳越快",
    "people": "芽吹与久留美",
    "positionOwner": null,
    "before": "芽吹愣住了。浮亏刚到十八万余日元，转眼又到了二十一万余。",
    "panels": [
      {
        "record": 136,
        "alt": "芽吹睁大眼睛，浮动盈亏负182,787日元"
      },
      {
        "record": 137,
        "alt": "芽吹惊慌，浮动盈亏扩大为负212,290日元"
      },
      {
        "record": 138,
        "alt": "芽吹给久留美发消息询问指标，回复提到英镑走势出乎意料"
      }
    ],
    "after": "她拿起手机，向久留美询问眼前的行情。"
  },
  {
    "id": "mebuki-brief-hope",
    "arc": "reversal-liquidation",
    "chapter": 12,
    "pages": [
      6,
      7,
      8
    ],
    "title": "她以为等到了救援",
    "people": "芽吹",
    "positionOwner": null,
    "before": "看到一根反弹的蜡烛，芽吹一度以为卡尼先生来帮她了。",
    "panels": [
      {
        "record": 139,
        "alt": "芽吹看着反弹的蜡烛兴奋地抬头，以为卡尼先生来帮忙"
      },
      {
        "record": 140,
        "alt": "芽吹脸色变了，浮动盈亏为负693,661日元"
      },
      {
        "record": 141,
        "alt": "芽吹惊慌地担心倒欠，以及该怎样向母亲解释"
      }
    ],
    "after": "可浮亏已经到了六十九万余日元。她开始害怕倒欠，也不知该怎样向母亲解释。"
  },
  {
    "id": "mebuki-zero-call",
    "arc": "reversal-liquidation",
    "chapter": 12,
    "pages": [
      9,
      10,
      11
    ],
    "title": "电话响起的时候",
    "people": "芽吹与康子",
    "positionOwner": null,
    "before": "账户余额变成了零，芽吹呆呆地盯着屏幕。",
    "panels": [
      {
        "record": 142,
        "alt": "芽吹目光呆滞，画面显示账户余额0日元"
      },
      {
        "record": 143,
        "alt": "康子坐在椅子上打电话，问芽吹是否还在玩FX"
      },
      {
        "record": 144,
        "alt": "芽吹背对画面，听到英镑相关提醒后道谢，说先挂了"
      }
    ],
    "after": "康子打来电话。芽吹低声道谢，先挂断了。"
  },
  {
    "id": "opposite-open-opinions",
    "arc": "opposite-directions",
    "chapter": 15,
    "pages": [
      2
    ],
    "title": "前辈们都看涨",
    "people": "久留美、芽吹与康子",
    "positionOwner": null,
    "before": "久留美发来消息：她做多了美日，六十手。芽吹仍坐在电脑前琢磨。",
    "panels": [
      {
        "record": 180,
        "alt": "久留美消息说做多美日六十手，实名账户板标出USD/JPY六十手买入、平均106.789日元"
      },
      {
        "record": 182,
        "alt": "芽吹坐在电脑前，想到久留美在这个位置出手"
      },
      {
        "record": 183,
        "alt": "康子发来美日看起来要涨的消息，芽吹惊讶连康子也打算做多"
      }
    ],
    "after": "连康子也觉得美日要涨，芽吹有些坐不住了。"
  },
  {
    "id": "opposite-two-to-one",
    "arc": "opposite-directions",
    "chapter": 15,
    "pages": [
      3,
      4,
      8
    ],
    "title": "二比一的分歧",
    "people": "芽吹与康子",
    "positionOwner": null,
    "before": "康子指出，美日已经从底部反弹，还问芽吹在这里新开空仓会不会害怕。",
    "panels": [
      {
        "record": 184,
        "alt": "康子指出美日已从底部反弹超过一日元，询问芽吹此时新开空仓是否害怕"
      },
      {
        "record": 187,
        "alt": "康子面部特写，上方是十月一日跌到十月十五日后回升的示意图"
      },
      {
        "record": 189,
        "alt": "芽吹想到久留美和康子都预测做多美日，心里数着二比一"
      },
      {
        "record": 188,
        "alt": "手机上的行情向上，浮动盈亏显示负48,500日元"
      }
    ],
    "after": "意见是二比一。她手里的浮动盈亏，已经变成负48,500日元。"
  },
  {
    "id": "opposite-mochiko-reply",
    "arc": "opposite-directions",
    "chapter": 15,
    "pages": [
      12
    ],
    "title": "她嘴上说的方向",
    "people": "萌智子",
    "positionOwner": null,
    "before": "萌智子说，她赞同芽吹的意见，美日会跌。",
    "panels": [
      {
        "record": 191,
        "alt": "萌智子说会跌，并表示赞同对方的意见"
      },
      {
        "record": 190,
        "alt": "萌智子口头说也来做空；同一画面的实名持仓板却写USD/JPY五十手做多、平均106.832日元"
      }
    ],
    "after": "嘴上说着做空，账户里却是多单。"
  },
  {
    "id": "opposite-floating-results",
    "arc": "opposite-directions",
    "chapter": 15,
    "pages": [
      15
    ],
    "title": "上涨之后",
    "people": "萌智子与芽吹",
    "positionOwner": null,
    "before": "萌智子又说，自己会一直坚持做多。",
    "panels": [
      {
        "record": 192,
        "alt": "萌智子表示自己会一直坚持做多"
      },
      {
        "record": 193,
        "alt": "美日上涨的K线旁，萌智子的浮动盈亏为正33,000日元"
      },
      {
        "record": 194,
        "alt": "芽吹抹着眼泪，仍在比较自己做空的平均成本"
      }
    ],
    "after": "她的多单出现了浮盈。芽吹仍在比较自己的空头均价。"
  }
];
export const PROFIT_MANGA_ARCS={
  "realized-short-profit": [
    "first-profit-plan",
    "first-profit-leverage",
    "first-profit-exit",
    "first-profit-vow"
  ],
  "reversal-liquidation": [
    "mebuki-loss-message",
    "mebuki-brief-hope",
    "mebuki-zero-call"
  ],
  "opposite-directions": [
    "opposite-open-opinions",
    "opposite-two-to-one",
    "opposite-mochiko-reply",
    "opposite-floating-results"
  ]
};
