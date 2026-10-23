import {LIFE_RELAX_SCENES} from './life-relax-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIFE_FRIEND_SCENES} from './life-friend-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Only independently reviewed full four-panel sheets are registered here.
// Receipt sources retain their original IDs/text; adding artwork never rewrites saves.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const LIFE_SCENE_CATALOG=freeze([
  {
    "id": "life-work-cafe-01",
    "dialogueId": "life-work-art-20261012:life-work-cafe-01",
    "receiptDialogueSourceId": "life-action-20261012:work:cafe",
    "semanticReadKey": "life-scene:life-work-cafe-01",
    "category": "work",
    "optionId": "cafe",
    "order": 1,
    "approved": true,
    "title": "咖啡店",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "滑溜的棕色围裙摊散，久留美皱眉接住滑开的折面。",
        "lines": [
          [
            "久留美",
            "这条围裙的面料太滑了，折三次滑开两次。"
          ]
        ]
      },
      {
        "action": "伏身按平同一围裙，将两边对齐折成双层长方形。",
        "lines": [
          [
            "久留美",
            "我就不信叠不齐它。"
          ]
        ]
      },
      {
        "action": "围裙卷已在摊开的手掌上保持形状，她松开另一手，惊喜确认。",
        "lines": [
          [
            "久留美",
            "先对折再卷起来……咦，这样居然完全不散架？"
          ]
        ]
      },
      {
        "action": "侧身把同一卷围裙放在已打开储物柜的中层，肩膀放松。",
        "lines": [
          [
            "久留美",
            "早知道一开始就卷着放进储物柜了。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-20261012:life-work-cafe-01",
      "path": "./generated/life-work-v1/cafe-apron-roll-v1.webp",
      "sha256": "959f8b5a27563ea627fd02a02edadbe0310ba3137cc5e3fac2069a96c7a0d76b",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  {
    "id": "life-work-bookstore-01",
    "dialogueId": "life-work-art-20261012:life-work-bookstore-01",
    "receiptDialogueSourceId": "life-action-20261012:work:bookstore",
    "semanticReadKey": "life-scene:life-work-bookstore-01",
    "category": "work",
    "optionId": "bookstore",
    "order": 1,
    "approved": true,
    "title": "书店",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "检查打开的空围裙口袋，找不到笔，表情疑惑。",
        "lines": [
          [
            "久留美",
            "口袋里的圆珠笔去哪了……刚才还在手里的。"
          ]
        ]
      },
      {
        "action": "转向刚归位的三本参考书，一手抵下巴，一手伸向书脊。",
        "lines": [
          [
            "久留美",
            "该不会顺手夹进哪本刚归位的参考书了吧？"
          ]
        ]
      },
      {
        "action": "第三本红词典拉出倾斜，蓝色圆珠笔明确夹在书页顶端，发现后取出。",
        "lines": [
          [
            "久留美",
            "顺着书脊摸过去……哈，果然插在第三本词典里。"
          ]
        ]
      },
      {
        "action": "三本词典放回齐列，把同一蓝色银夹圆珠笔放回围裙口袋，露出不好意思的笑。",
        "lines": [
          [
            "久留美",
            "差点给买书的客人附赠一支文具。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-20261012:life-work-bookstore-01",
      "path": "./generated/life-work-v1/bookstore-lost-pen-v1.webp",
      "sha256": "4d59092fed026f51873a8f9f0a2bda838b4e3b369e2f1424d8e6a05170cb723d",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          12,
          522,
          684
        ],
        [
          548,
          12,
          522,
          684
        ],
        [
          16,
          705,
          522,
          727
        ],
        [
          548,
          705,
          522,
          727
        ]
      ]
    }
  },
  {
    "id": "life-work-convenience-01",
    "dialogueId": "life-work-art-20261012:life-work-convenience-01",
    "receiptDialogueSourceId": "life-action-20261012:work:convenience",
    "semanticReadKey": "life-scene:life-work-convenience-01",
    "category": "work",
    "optionId": "convenience",
    "order": 1,
    "approved": true,
    "title": "便利店",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "五瓶乌龙茶已推齐，仍有背标与侧标混向，她皱眉发现问题。",
        "lines": [
          [
            "久留美",
            "刚把整排乌龙茶推平，才发现标签全冲着不同方向。"
          ]
        ]
      },
      {
        "action": "她握住最右茶瓶的瓶身转正，前四瓶已经面向顾客。",
        "lines": [
          [
            "久留美",
            "……算了，反正也是最后收尾，顺手拧正吧。"
          ]
        ]
      },
      {
        "action": "她撤手俯身检查五个齐列的正面叶标，露出满意的笑。",
        "lines": [
          [
            "久留美",
            "正面全冲前排，这样看着确实痛快多了。"
          ]
        ]
      },
      {
        "action": "她站直抱臂得意，旁边同一排五瓶仍然正面齐列。",
        "lines": [
          [
            "久留美",
            "下一班要是夸货架整齐，可全是我的功劳。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-20261012:life-work-convenience-01",
      "path": "./generated/life-work-v1/convenience-labels-v1.webp",
      "sha256": "c5af77e743349d0e6d2fd3a9bf802e4c2f153dd602e6d14029f9c347d65b00fe",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          17,
          13,
          519,
          689
        ],
        [
          550,
          13,
          519,
          689
        ],
        [
          17,
          712,
          519,
          720
        ],
        [
          550,
          712,
          519,
          720
        ]
      ]
    }
  },
  {
    "id": "life-work-flyer-01",
    "dialogueId": "life-work-art-verbatim-20261019:life-work-flyer-01",
    "receiptDialogueSourceId": "work-expansion-20261015:flyer",
    "semanticReadKey": "life-scene:life-work-flyer-01",
    "category": "work",
    "optionId": "flyer",
    "order": 1,
    "approved": true,
    "title": "雨点落下来之前",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "路口的传单刚摆好，雨就下了起来。",
        "lines": []
      },
      {
        "action": "久留美抱着剩下的传单挪到棚下，雨落在屋檐外。",
        "lines": [
          [
            "久留美",
            "刚摆好传单就下雨，只好挪到有顶棚的路口。"
          ]
        ]
      },
      {
        "action": "她递出最后一张传单。",
        "lines": []
      },
      {
        "action": "传单已发完，她空着手在棚下放松肩膀。",
        "lines": [
          [
            "久留美",
            "剩下的总算发完。下次出门先看天气，不看汇率。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-verbatim-20261019:life-work-flyer-01",
      "path": "./generated/life-work-verbatim-v1/flyer-rain-shelter-v1.png",
      "sha256": "517ae2fec8ae3c0a0d37ffc7a3655004e07b0f67c6112919dee4ac7cc55c44f0",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  {
    "id": "life-work-warehouse-01",
    "dialogueId": "life-work-art-verbatim-20261019:life-work-warehouse-01",
    "receiptDialogueSourceId": "work-expansion-20261015:warehouse",
    "semanticReadKey": "life-scene:life-work-warehouse-01",
    "category": "work",
    "optionId": "warehouse",
    "order": 1,
    "approved": true,
    "title": "追上错误的货箱",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "两只货箱上的圆形与三角标签贴反了。",
        "lines": []
      },
      {
        "action": "久留美在装车前拦停货箱。",
        "lines": [
          [
            "久留美",
            "两个箱子的标签贴反了，装车前才拦下来。"
          ]
        ]
      },
      {
        "action": "她揭起两箱的标签，交换回对应的位置。",
        "lines": []
      },
      {
        "action": "标签已贴好，她放下酸累的手臂。",
        "lines": [
          [
            "久留美",
            "手臂抬不起来了。工资倒是实实在在到了。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-verbatim-20261019:life-work-warehouse-01",
      "path": "./generated/life-work-verbatim-v1/warehouse-swapped-labels-v1.png",
      "sha256": "b3ab6e57fbb356a014cd9e3960a0e3befc1febc1e299e25a2330b77a12fc5298",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  {
    "id": "life-work-dishwashing-01",
    "dialogueId": "life-work-art-verbatim-20261019:life-work-dishwashing-01",
    "receiptDialogueSourceId": "work-expansion-20261015:dishwashing",
    "semanticReadKey": "life-scene:life-work-dishwashing-01",
    "category": "work",
    "optionId": "dishwashing",
    "order": 1,
    "approved": true,
    "title": "晚餐高峰的盘子",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "水池刚清空，最后一只干净盘子放进沥水架。",
        "lines": []
      },
      {
        "action": "下一摞脏盘子又到了水池边。",
        "lines": [
          [
            "久留美",
            "刚清空水池，下一摞盘子又来了。"
          ]
        ]
      },
      {
        "action": "她继续清洗盘子。",
        "lines": []
      },
      {
        "action": "最后一只盘子入架，她放松肩膀叹气。",
        "lines": [
          [
            "久留美",
            "最后一只盘子洗完，比平仓还想叹气。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-verbatim-20261019:life-work-dishwashing-01",
      "path": "./generated/life-work-verbatim-v1/dishwashing-last-plate-v1.png",
      "sha256": "feee1a39f5789a647c000a87c355279d8a818486005525ec6a3df3cf5e2d3560",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  {
    "id": "life-work-campusArchive-01",
    "dialogueId": "life-work-art-verbatim-20261019:life-work-campusArchive-01",
    "receiptDialogueSourceId": "work-expansion-20261015:campusArchive",
    "semanticReadKey": "life-scene:life-work-campusArchive-01",
    "category": "work",
    "optionId": "campusArchive",
    "order": 1,
    "approved": true,
    "title": "少掉的一页",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "她坐着对照目录核查资料。",
        "lines": []
      },
      {
        "action": "她发现资料夹里少了一页。",
        "lines": [
          [
            "久留美",
            "装订前对了一遍目录，果然少了一页。"
          ]
        ]
      },
      {
        "action": "她把缺页补回原来的位置。",
        "lines": []
      },
      {
        "action": "资料齐备，她坐着安静收尾。",
        "lines": [
          [
            "久留美",
            "补回去就能交差。今天这份工作允许我坐着慢慢来。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-verbatim-20261019:life-work-campusArchive-01",
      "path": "./generated/life-work-verbatim-v1/campus-archive-missing-page-v1.png",
      "sha256": "7d135ab115babf5abf5244816442067e9afdd1d11721f03b3e10081ce4340516",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  {
    "id": "life-work-proofreading-01",
    "dialogueId": "life-work-art-verbatim-20261019:life-work-proofreading-01",
    "receiptDialogueSourceId": "work-expansion-20261015:proofreading",
    "semanticReadKey": "life-scene:life-work-proofreading-01",
    "category": "work",
    "optionId": "proofreading",
    "order": 1,
    "approved": true,
    "title": "漏掉的一个字",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "久留美沿稿件同一行反复指读。",
        "lines": []
      },
      {
        "action": "她俯近稿件，看见同一处空缺。",
        "lines": [
          [
            "久留美",
            "同一句读了三遍，才看见漏掉的那个字。"
          ]
        ]
      },
      {
        "action": "红笔在那一处画圈和插入标记，不写出补字。",
        "lines": []
      },
      {
        "action": "她把笔轻放纸旁，肩膀放松，安静停顿。",
        "lines": [
          [
            "久留美",
            "上次一起看资料的办法还真管用。红笔比下单键安静多了。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-verbatim-20261019:life-work-proofreading-01",
      "path": "./generated/life-work-verbatim-v1/proofreading-missing-character-v1.png",
      "sha256": "1b5aa938282edfe285a1ac911ceb4cc0868fc511295753fe1102c330a4e3ebb5",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  {
    "id": "life-work-eventSetup-01",
    "dialogueId": "life-work-art-verbatim-20261019:life-work-eventSetup-01",
    "receiptDialogueSourceId": "work-expansion-20261015:eventSetup",
    "semanticReadKey": "life-scene:life-work-eventSetup-01",
    "category": "work",
    "optionId": "eventSetup",
    "order": 1,
    "approved": true,
    "title": "歪斜的展板",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "展板刚立起来就向一侧歪斜。",
        "lines": []
      },
      {
        "action": "她扶住展板，查看底座。",
        "lines": [
          [
            "久留美",
            "展板刚立起来就往一边倒，只好重新固定底座。"
          ]
        ]
      },
      {
        "action": "她重新拧紧底座的固定钮。",
        "lines": []
      },
      {
        "action": "展板全部站稳，她弯膝扶腿歇一下。",
        "lines": [
          [
            "久留美",
            "闭馆前终于全部站稳。今天站不稳的是我的腿。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-verbatim-20261019:life-work-eventSetup-01",
      "path": "./generated/life-work-verbatim-v1/event-setup-stable-base-v1.png",
      "sha256": "f2d48568e37a286805820f92ef5c72bdbeaaf113039c2fccd39f8e92e4c1bcf1",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  {
    "id": "life-work-petCare-01",
    "dialogueId": "life-work-art-verbatim-20261019:life-work-petCare-01",
    "receiptDialogueSourceId": "work-expansion-20261015:petCare",
    "semanticReadKey": "life-scene:life-work-petCare-01",
    "category": "work",
    "optionId": "petCare",
    "order": 1,
    "approved": true,
    "title": "纸箱里的猫",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "她低头寻找还没找到的猫。",
        "lines": []
      },
      {
        "action": "她发现猫躲在纸箱里面。",
        "lines": [
          [
            "久留美",
            "安子介绍的猫，比约好的见面时间还难找。"
          ]
        ]
      },
      {
        "action": "她空着手耐心等候，猫从纸箱里走出。",
        "lines": []
      },
      {
        "action": "猫肯吃饭，她跟着松了一口气。",
        "lines": [
          [
            "久留美",
            "最后从纸箱里请出来了。它肯吃饭，我也跟着松了口气。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-verbatim-20261019:life-work-petCare-01",
      "path": "./generated/life-work-verbatim-v1/pet-care-cardboard-cat-v1.png",
      "sha256": "72857d6c2342adfa638b8f76a8c479a3ff6e32797071810b472f36109f9b4b5b",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  {
    "id": "life-work-translation-01",
    "dialogueId": "life-work-art-verbatim-20261019:life-work-translation-01",
    "receiptDialogueSourceId": "work-expansion-20261015:translation",
    "semanticReadKey": "life-scene:life-work-translation-01",
    "category": "work",
    "optionId": "translation",
    "order": 1,
    "approved": true,
    "title": "反复确认的术语",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "久留美对照稿件里的两段文字。",
        "lines": []
      },
      {
        "action": "她指向两段中对应的位置，发现含义不同。",
        "lines": [
          [
            "久留美",
            "同一个词在两段里意思不一样，差点整页翻错。"
          ]
        ]
      },
      {
        "action": "她翻开教学笔记，对照着逐项列清。",
        "lines": []
      },
      {
        "action": "她收齐稿件放入交稿袋，扶额歇一下。",
        "lines": [
          [
            "久留美",
            "翻出教学笔记，一项项列清楚才交稿。脑子比手还累。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-verbatim-20261019:life-work-translation-01",
      "path": "./generated/life-work-verbatim-v1/translation-term-check-v1.png",
      "sha256": "43dacd7fe5843b3698b525d5de30d19d1c8e7866bc3d172a851d541829a3ca13",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  {
    "id": "life-work-remoteData-01",
    "dialogueId": "life-work-art-verbatim-20261019:life-work-remoteData-01",
    "receiptDialogueSourceId": "work-expansion-20261015:remoteData",
    "semanticReadKey": "life-scene:life-work-remoteData-01",
    "category": "work",
    "optionId": "remoteData",
    "order": 1,
    "approved": true,
    "title": "重复的记录",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "久留美独自在家，照着原表录入。",
        "lines": []
      },
      {
        "action": "她停下来，发现屏上两行重复的标记。",
        "lines": [
          [
            "久留美",
            "录到最后才发现两行编号相同，得回头核对原表。"
          ]
        ]
      },
      {
        "action": "她回头逐行核对纸上的原表。",
        "lines": []
      },
      {
        "action": "录入结束，她合上电脑，收回疲累的手。",
        "lines": [
          [
            "久留美",
            "自己住倒是没人打断。可是敲完这些数字，我不想再看行情了。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-verbatim-20261019:life-work-remoteData-01",
      "path": "./generated/life-work-verbatim-v1/remote-data-duplicate-record-v1.png",
      "sha256": "8f1f39ceb31f4b55b6f3b9efd1feca5b065f9b69d14781fa8b695c6117c58f89",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  {
    "id": "life-work-buildingCaretaker-01",
    "dialogueId": "life-work-art-verbatim-20261019:life-work-buildingCaretaker-01",
    "receiptDialogueSourceId": "work-expansion-20261015:buildingCaretaker",
    "semanticReadKey": "life-scene:life-work-buildingCaretaker-01",
    "category": "work",
    "optionId": "buildingCaretaker",
    "order": 1,
    "approved": true,
    "title": "楼道里的水迹",
    "characters": [
      "久留美",
      "匿名维修师傅"
    ],
    "people": 2,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "她巡楼时发现墙脚渗水。",
        "lines": []
      },
      {
        "action": "她打电话通知画外的管理人。",
        "lines": [
          [
            "久留美",
            "巡楼时看见墙角渗水，先通知管理人，再把路口围好。"
          ]
        ]
      },
      {
        "action": "她用路锥和横杆围好通路。",
        "lines": []
      },
      {
        "action": "匿名维修师傅接手，她在围挡外看着。",
        "lines": [
          [
            "久留美",
            "维修师傅接手了。能在问题变大前发现一次，也挺好。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 2,
      "dialogueId": "life-work-art-verbatim-20261019:life-work-buildingCaretaker-01",
      "path": "./generated/life-work-verbatim-v1/caretaker-water-handoff-v1.png",
      "sha256": "fe7a7baab726ea9c4b7bb1c6e52212f70a9424e588706f76a2b114ef29eb9b61",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  {
    "id": "life-work-radioMonitor-01",
    "dialogueId": "life-work-art-verbatim-20261019:life-work-radioMonitor-01",
    "receiptDialogueSourceId": "work-expansion-20261015:radioMonitor",
    "semanticReadKey": "life-scene:life-work-radioMonitor-01",
    "category": "work",
    "optionId": "radioMonitor",
    "order": 1,
    "approved": true,
    "title": "杂音后面的声音",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "久留美戴着耳机，把同一小段反复重听。",
        "lines": []
      },
      {
        "action": "她拿起标注纸，对照短波形细听。",
        "lines": [
          [
            "久留美",
            "同一小段反复听，终于分清是关门声还是鼓点。"
          ]
        ]
      },
      {
        "action": "她完成本批标注，按下确认。",
        "lines": []
      },
      {
        "action": "她摘下耳机放在桌上，闭眼安静休息。",
        "lines": [
          [
            "久留美",
            "坐着也会累耳朵。标完这一批，先安静一会儿。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-work-art-verbatim-20261019:life-work-radioMonitor-01",
      "path": "./generated/life-work-verbatim-v1/radio-monitor-quiet-after-batch-v1.png",
      "sha256": "51550f368500594d0d9ca5da99bb4e00a3aa241fa2f2a4af2fecafddd9e53272",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  {
    "id": "life-work-tutoring-01",
    "dialogueId": "life-work-art-verbatim-20261019:life-work-tutoring-01",
    "receiptDialogueSourceId": "work-expansion-20261015:tutoring",
    "semanticReadKey": "life-scene:life-work-tutoring-01",
    "category": "work",
    "optionId": "tutoring",
    "order": 1,
    "approved": true,
    "title": "终于讲懂的分数题",
    "characters": [
      "久留美",
      "匿名学生"
    ],
    "people": 2,
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "dialoguePanels": [
      {
        "action": "匿名学生抬手提问，她看向模糊笔记。",
        "lines": []
      },
      {
        "action": "她指着模糊笔记讲解。",
        "lines": [
          [
            "久留美",
            "萌智子介绍的学生，问我为什么分母不能直接加。"
          ]
        ]
      },
      {
        "action": "学生自己落笔，她在旁观察。",
        "lines": []
      },
      {
        "action": "学生完成后，她安心微笑。",
        "lines": [
          [
            "久留美",
            "讲到他能自己做出来，我才发现这比猜涨跌踏实。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 2,
      "dialogueId": "life-work-art-verbatim-20261019:life-work-tutoring-01",
      "path": "./generated/life-work-verbatim-v1/tutoring-unreadable-notes-v2.png",
      "sha256": "f4201fd802f21633a466055d805fb9b5f35d3b7ee9ef387800719a3f2c7c58fe",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          16,
          13,
          521,
          685
        ],
        [
          548,
          13,
          521,
          685
        ],
        [
          16,
          709,
          521,
          723
        ],
        [
          548,
          709,
          521,
          723
        ]
      ]
    }
  },
  ...LIFE_RELAX_SCENES,
  ...LIFE_FRIEND_SCENES
]);
