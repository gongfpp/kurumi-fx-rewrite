// Two reviewed wordless four-panel sheets; dialogue remains the exact saved Gemini source.
// No source IDs, receipt format, accounting or historical read records are migrated.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const LIFE_RELAX_SCENES=freeze([
  {
    "id": "life-relax-river-01",
    "dialogueId": "life-relax-art-20261012:life-relax-river-01",
    "receiptDialogueSourceId": "life-action-20261012:relax:river",
    "semanticReadKey": "life-scene:life-relax-river-01",
    "category": "relax",
    "optionId": "river",
    "order": 1,
    "approved": true,
    "title": "河边",
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
        "action": "蹲在岸边挑起一块扁石，露出期待的笑。",
        "lines": [
          [
            "久留美",
            "挑了块最扁的石头，今天一定要漂出三道水花。"
          ]
        ]
      },
      {
        "action": "向河面抛出同一块石头，水面只出现一次落水水花。",
        "lines": [
          [
            "久留美",
            "出手——啪，一下就沉底了。"
          ]
        ]
      },
      {
        "action": "低头空手比划出手角度，石头已经沉下，只剩水波。",
        "lines": [
          [
            "久留美",
            "……角度不对，完全没弹起来。"
          ]
        ]
      },
      {
        "action": "坐在岸石上放松，看着一圈圈散开的涟漪。",
        "lines": [
          [
            "久留美",
            "不过水波一圈一圈散开的样子，看着倒挺舒服的。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-relax-art-20261012:life-relax-river-01",
      "path": "./generated/life-relax-v1/river-stone-ripples-v1.webp",
      "sha256": "7471fb63c1aaf0fecf7fd245ed267de4922950a282034795b647fa094275beb2",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          15,
          14,
          522,
          698
        ],
        [
          548,
          14,
          522,
          698
        ],
        [
          15,
          723,
          522,
          710
        ],
        [
          548,
          723,
          522,
          710
        ]
      ]
    }
  },
  {
    "id": "life-relax-park-01",
    "dialogueId": "life-relax-art-20261012:life-relax-park-01",
    "receiptDialogueSourceId": "life-action-20261012:relax:park",
    "semanticReadKey": "life-scene:life-relax-park-01",
    "category": "relax",
    "optionId": "park",
    "order": 1,
    "approved": true,
    "title": "公园",
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
        "action": "坐在长椅上拿着黑屏手机，手指停在屏幕前。",
        "lines": [
          [
            "久留美",
            "坐下前本来想拿手机定个十分钟闹钟。"
          ]
        ]
      },
      {
        "action": "靠向椅背，拿手机的手落低，没有设置闹钟。",
        "lines": [
          [
            "久留美",
            "但连抬手按屏幕都觉得麻烦。"
          ]
        ]
      },
      {
        "action": "手机放在身旁的椅面上，抬头感受轻风。",
        "lines": [
          [
            "久留美",
            "算了，靠风吹得冷不冷来决定什么时候走吧。"
          ]
        ]
      },
      {
        "action": "仍坐在长椅上前倾，双手支撑椅面，手机留在身边。",
        "lines": [
          [
            "久留美",
            "……要是起大风了就立刻站起来。"
          ]
        ]
      }
    ],
    "art": {
      "reviewed": true,
      "independentComic": true,
      "panels": 4,
      "people": 1,
      "dialogueId": "life-relax-art-20261012:life-relax-park-01",
      "path": "./generated/life-relax-v1/park-bench-breeze-v1.webp",
      "sha256": "5f79ffed82caf2e0112b3c3ea30cc5dded55581bfab48b0af4f91bd33aead9f3",
      "width": 1086,
      "height": 1448,
      "panelRects": [
        [
          18,
          14,
          519,
          686
        ],
        [
          549,
          14,
          520,
          686
        ],
        [
          18,
          711,
          519,
          720
        ],
        [
          549,
          711,
          520,
          720
        ]
      ]
    }
  }
]);
