import {PROP_STORIES} from './prop-stories.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FATHER_THEFT_SCENES} from './father-theft-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIVING_MOVE_SCENES} from './living-move-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {APPROVED_FOUR_SKITS} from './approved-four-skits.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Original four-panel game dialogue. Receipt gating lives in ../comic-scenes.js.
// Keep this text aligned with the reviewed pixels; art/source records stay separate.
const ORIGINAL_ACTION_SCENES = Object.freeze({
  "shrine-walk": {
    "title": "去神社走走",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "……先不看了。"
      ],
      [
        "久留美",
        "收起来。"
      ],
      [
        "久留美",
        "这里倒挺安静。"
      ],
      [
        "久留美",
        "坐一会儿。"
      ]
    ]
  },
  "noodles-today": {
    "title": "今天关灯吃泡面",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "今天省一点。"
      ],
      [
        "久留美",
        "再等三分钟。"
      ],
      [
        "久留美",
        "灯也关了。"
      ],
      [
        "久留美",
        "……还挺香。"
      ]
    ]
  },
  "takeaway": {
    "title": "外卖到了",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "终于来了。"
      ],
      [
        "久留美",
        "今天吃这个。"
      ],
      [
        "久留美",
        "嗯，好吃。"
      ],
      [
        "久留美",
        "收拾好了。"
      ]
    ]
  },
  "energy": {
    "title": "再来一轮",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "还有一轮。"
      ],
      [
        "久留美",
        "开了。"
      ],
      [
        "久留美",
        "……醒一点了。"
      ],
      [
        "久留美",
        "再看一会儿。"
      ]
    ]
  },
  "spa": {
    "title": "温泉小憩",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "先歇一下。"
      ],
      [
        "久留美",
        "肩膀好硬。"
      ],
      [
        "久留美",
        "呼……"
      ],
      [
        "久留美",
        "舒服多了。"
      ]
    ]
  },
  "mochiko-watch": {
    "title": "萌智子帮忙",
    "characters": [
      "久留美",
      "萌智子"
    ],
    "people": 2,
    "lines": [
      [
        "久留美",
        "帮我看一下。"
      ],
      [
        "萌智子",
        "先看你的持仓。"
      ],
      [
        "萌智子",
        "这里。"
      ],
      [
        "久留美",
        "嗯，看到了。"
      ]
    ]
  },
  "dinner-small": {
    "title": "请吃一顿饭",
    "characters": [
      "久留美",
      "匿名朋友"
    ],
    "people": 2,
    "lines": [
      [
        "久留美",
        "今天我请。"
      ],
      [
        "久留美",
        "两份这个。"
      ],
      [
        "久留美",
        "慢慢吃。"
      ],
      [
        "久留美",
        "我来结账。"
      ]
    ]
  },
  "dinner-friends": {
    "title": "请朋友聚餐",
    "characters": [
      "久留美",
      "匿名朋友"
    ],
    "people": 2,
    "lines": [
      [
        "久留美",
        "今天我请。"
      ],
      [
        "久留美",
        "别一下点太多。"
      ],
      [
        "久留美",
        "先吃吧。"
      ],
      [
        "久留美",
        "说好了，我来。"
      ]
    ]
  },
  "dinner-feast": {
    "title": "丰盛晚餐",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "今晚奢侈一点。"
      ],
      [
        "久留美",
        "点得有点多啊。"
      ],
      [
        "久留美",
        "这块也吃掉。"
      ],
      [
        "久留美",
        "吃饱了。"
      ]
    ]
  },
  "dinner-banquet": {
    "title": "今晚我请",
    "characters": [
      "久留美",
      "匿名朋友"
    ],
    "people": 2,
    "lines": [
      [
        "久留美",
        "这次订好了。"
      ],
      [
        "久留美",
        "都坐吧。"
      ],
      [
        "久留美",
        "够吃就好。"
      ],
      [
        "久留美",
        "账单给我。"
      ]
    ]
  },
  "father-discover": {
    "title": "柜中的信封",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "这个柜子……"
      ],
      [
        "久留美",
        "爸爸的存款。"
      ],
      [
        "久留美",
        "……"
      ],
      [
        "久留美",
        "先放着。"
      ]
    ]
  },
  "father-borrow": {
    "title": "已经拿走的钱",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "那次，我从柜子里拿走了钱。"
      ],
      [
        "久留美",
        "已经拿走了。"
      ],
      [
        "久留美",
        "拿走的数目，已经记下了。"
      ],
      [
        "久留美",
        "那时想着，一定要还回去。"
      ]
    ]
  },
  "father-found": {
    "title": "父亲发现了",
    "characters": [
      "久留美",
      "父亲"
    ],
    "people": 2,
    "lines": [
      [
        "父亲",
        "柜子里的钱呢？"
      ],
      [
        "父亲",
        "是你拿的？"
      ],
      [
        "久留美",
        "……是我。"
      ],
      [
        "久留美",
        "我会还。"
      ]
    ]
  },
  "father-repay-part": {
    "title": "先还一部分",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "先还这些。"
      ],
      [
        "久留美",
        "装好了。"
      ],
      [
        "久留美",
        "放回原处。"
      ],
      [
        "久留美",
        "剩下的还记着。"
      ]
    ]
  },
  "father-repaid": {
    "title": "放回去了",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "最后这些。"
      ],
      [
        "久留美",
        "放回去了。"
      ],
      [
        "久留美",
        "还清了。"
      ],
      [
        "久留美",
        "……终于。"
      ]
    ]
  },
  "loan-funded": {
    "title": "借款到账",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "就借这些。"
      ],
      [
        "久留美",
        "确认。"
      ],
      [
        "久留美",
        "到账了……"
      ],
      [
        "久留美",
        "还款也得记上。"
      ]
    ]
  },
  "loan-repay-part": {
    "title": "先还一点",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "先还一部分。"
      ],
      [
        "久留美",
        "这笔够了。"
      ],
      [
        "久留美",
        "付好了。"
      ],
      [
        "久留美",
        "还有剩下的。"
      ]
    ]
  },
  "loan-repaid": {
    "title": "网贷还清了",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "最后一笔。"
      ],
      [
        "久留美",
        "还上。"
      ],
      [
        "久留美",
        "清了。"
      ],
      [
        "久留美",
        "今晚能少想一件事。"
      ]
    ]
  },
  "living-basic": {
    "title": "普通的一餐",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "做点简单的。"
      ],
      [
        "久留美",
        "够吃就行。"
      ],
      [
        "久留美",
        "开饭。"
      ],
      [
        "久留美",
        "明天再说。"
      ]
    ]
  },
  "living-comfortable": {
    "title": "好好吃饭",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "今天也好好吃。"
      ],
      [
        "久留美",
        "水果留到最后。"
      ],
      [
        "久留美",
        "吃饱了。"
      ],
      [
        "久留美",
        "收拾一下。"
      ]
    ]
  },
  "living-generous": {
    "title": "宽裕的一天",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "今天买齐了。"
      ],
      [
        "久留美",
        "慢慢吃吧。"
      ],
      [
        "久留美",
        "茶也泡好了。"
      ],
      [
        "久留美",
        "歇一会儿。"
      ]
    ]
  },
  "friend-treat": {
    "title": "朋友请客",
    "characters": [
      "久留美",
      "匿名朋友"
    ],
    "people": 2,
    "lines": [
      [
        "久留美",
        "……没什么胃口。"
      ],
      [
        "朋友",
        "先吃一点。"
      ],
      [
        "久留美",
        "嗯。"
      ],
      [
        "久留美",
        "谢谢。"
      ]
    ]
  },
  "quote-2hz": {
    "title": "流畅行情",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "有点慢。"
      ],
      [
        "久留美",
        "换流畅的。"
      ],
      [
        "久留美",
        "今天先用这个。"
      ],
      [
        "久留美",
        "好，再看。"
      ]
    ]
  },
  "quote-4hz": {
    "title": "高刷行情",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "还想再快一点。"
      ],
      [
        "久留美",
        "高刷档。"
      ],
      [
        "久留美",
        "确认好了。"
      ],
      [
        "久留美",
        "看清楚再动。"
      ]
    ]
  },
  "settled-gain": {
    "title": "今天赚了",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "收盘了。"
      ],
      [
        "久留美",
        "今天赚到了。"
      ],
      [
        "久留美",
        "先放下。"
      ],
      [
        "久留美",
        "呼……"
      ]
    ]
  },
  "settled-severe-loss": {
    "title": "亏损之后",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "……亏了。"
      ],
      [
        "久留美",
        "怎么会这样。"
      ],
      [
        "久留美",
        "不看了。"
      ],
      [
        "久留美",
        "……"
      ]
    ]
  },
  "settled-small-loss": {
    "title": "小亏一天",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "还是亏了一点。"
      ],
      [
        "久留美",
        "记下来。"
      ],
      [
        "久留美",
        "唉。"
      ],
      [
        "久留美",
        "今天到这里。"
      ]
    ]
  },
  "settled-no-trade": {
    "title": "空仓一天",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "今天没动。"
      ],
      [
        "久留美",
        "翻两页吧。"
      ],
      [
        "久留美",
        "空仓一天。"
      ],
      [
        "久留美",
        "睡了。"
      ]
    ]
  },
  "stop-loss": {
    "title": "止损成交",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "到线了。"
      ],
      [
        "久留美",
        "平掉了。"
      ],
      [
        "久留美",
        "就亏这些吧。"
      ],
      [
        "久留美",
        "先缓一缓。"
      ]
    ]
  },
  "liquidation": {
    "title": "被强平了",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "等等……"
      ],
      [
        "久留美",
        "仓位呢？"
      ],
      [
        "久留美",
        "被平了。"
      ],
      [
        "久留美",
        "……"
      ]
    ]
  },
  "closed-profit": {
    "title": "盈利落袋",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "就这里。"
      ],
      [
        "久留美",
        "平仓。"
      ],
      [
        "久留美",
        "这笔赚到了。"
      ],
      [
        "久留美",
        "好！"
      ]
    ]
  },
  "loan-interest": {
    "title": "又到结息日",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "又到结息了。"
      ],
      [
        "久留美",
        "这笔利息扣了。"
      ],
      [
        "久留美",
        "记下实际扣款。"
      ],
      [
        "久留美",
        "借款还得早点还。"
      ]
    ]
  },
  "half-profit": {
    "title": "先收一半",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "lines": [
      [
        "久留美",
        "先收一半。"
      ],
      [
        "久留美",
        "就这么多。"
      ],
      [
        "久留美",
        "落袋了。"
      ],
      [
        "久留美",
        "还有一半。"
      ]
    ]
  },
  "walkaway": {
    "title": "主动离场",
    "characters": [
      "久留美",
      "萌智子"
    ],
    "people": 2,
    "lines": [
      [
        "久留美",
        "今天到此为止。"
      ],
      [
        "久留美",
        "关了。"
      ],
      [
        "久留美",
        "出去走走。"
      ],
      [
        "久留美",
        "……天气还不错。"
      ]
    ]
  }
});

// The approved revision owns both its exact dialogue and matching artwork.
export const ACTION_SCENES=Object.freeze({...ORIGINAL_ACTION_SCENES,...PROP_STORIES,...LIVING_MOVE_SCENES,...FATHER_THEFT_SCENES,
 'dinner-small':APPROVED_FOUR_SKITS['dinner-small'],
 'shrine-walk':APPROVED_FOUR_SKITS['shrine-walk'],
});
