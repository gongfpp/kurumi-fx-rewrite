// Four original game-adaptation exchanges authored in this task under the
// user's current gpt-6.1-sol instruction. No Gemini call or artwork approval.
// Once committed, source IDs and exact lines are an append-only save contract.
// artStatus preserves this text-only delivery's provenance. Reviewed artwork
// is admitted separately by life-friend-scenes.js without rewriting receipts.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const LIFE_FRIEND_DIALOGUE_SCENES=freeze([
  {
    "id": "life-friend-mochiko-01",
    "optionId": "mochiko",
    "order": 1,
    "title": "标题先写好了",
    "setting": "校园桌边，今日交易已经结束",
    "panels": [
      {
        "action": "久留美翻开记录本，先给空白页写标题；萌智子坐在她旁边，神情平静。",
        "lines": [
          [
            "久留美",
            "收盘了。今天这一页，就叫“胜利记录”吧。"
          ],
          [
            "萌智子",
            "你先写日期。"
          ]
        ]
      },
      {
        "action": "萌智子指向标题下面仍空白的记录栏；久留美握着笔，嘴硬地抬起下巴。",
        "lines": [
          [
            "萌智子",
            "数字还没写，你就先起好名字了？"
          ],
          [
            "久留美",
            "标题有气势，写起来也有气势。"
          ]
        ]
      },
      {
        "action": "久留美划去旧标题，改为普通记录标题，低头核对已经封账的记录；不展示虚构金额或未来图表。",
        "lines": [
          [
            "久留美",
            "……“交易记录”。这样总行了吧。"
          ],
          [
            "萌智子",
            "这几个字不会替你改数字。"
          ]
        ]
      },
      {
        "action": "久留美指住页尾空白处，小声征询；萌智子把笔推回她手边，表情温和，不作获利庆祝。",
        "lines": [
          [
            "久留美",
            "那我在下面写一句“明天加油”，总可以吧？"
          ],
          [
            "萌智子",
            "可以。别把它填进收益那一栏。"
          ]
        ]
      }
    ],
    "category": "friend",
    "dialogueId": "life-friend-copy-20261013:life-friend-mochiko-01",
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "copyStatus": "review-ready",
    "artStatus": "not-generated"
  },
  {
    "id": "life-friend-mochiko-02",
    "optionId": "mochiko",
    "order": 2,
    "title": "只多走了两格",
    "setting": "校园公共桌，免费现成桌游",
    "panels": [
      {
        "action": "两人在棋盘两侧，久留美望着自己推远的棋子，伸手想拿回骰子；神情疲惫，不作狂喜或盈利庆祝。",
        "lines": [
          [
            "久留美",
            "这一步走得也太远了……我再掷一次。"
          ],
          [
            "萌智子",
            "你这一回合已经掷过了。"
          ]
        ]
      },
      {
        "action": "萌智子轻按骰子旁边的回合标记，指出已经翻到使用面；久留美的手停住。",
        "lines": [
          [
            "萌智子",
            "刚才这枚标记，还是你自己翻面的。"
          ],
          [
            "久留美",
            "我想给它翻回来。"
          ]
        ]
      },
      {
        "action": "萌智子指着棋盘路线，久留美用手指沿格子回数，找到多走的两格。",
        "lines": [
          [
            "萌智子",
            "先沿格子数一遍。"
          ],
          [
            "久留美",
            "……是我多走了两格。"
          ]
        ]
      },
      {
        "action": "久留美把同一颗棋子移回正确格子；萌智子收回骰子，准备自己的回合，气氛安静。",
        "lines": [
          [
            "久留美",
            "原来不用重开整局啊。"
          ],
          [
            "萌智子",
            "嗯。现在轮到我了。"
          ]
        ]
      }
    ],
    "category": "friend",
    "dialogueId": "life-friend-copy-20261013:life-friend-mochiko-02",
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "copyStatus": "review-ready",
    "artStatus": "not-generated"
  },
  {
    "id": "life-friend-yasuko-01",
    "optionId": "yasuko",
    "order": 1,
    "title": "椅子也想走",
    "setting": "已相识室友的宿舍共用桌",
    "panels": [
      {
        "action": "久留美把手机放在桌角，自信地展示刚收好的充电线；同一条线实际绕过椅脚。安子在桌边看她。",
        "lines": [
          [
            "久留美",
            "线都收好了。今天这桌子看着就很像会赚钱的样子。"
          ],
          [
            "安子",
            "桌子又不开仓。"
          ]
        ]
      },
      {
        "action": "久留美起身伸向手机，椅子被充电线拉偏；安子扶住桌边杯子，防止被带倒。",
        "lines": [
          [
            "久留美",
            "咦，椅子怎么还跟着我走？"
          ],
          [
            "安子",
            "别拽。杯子也想跟着你走了。"
          ]
        ]
      },
      {
        "action": "安子指向椅脚的绕线处；久留美蹲下来，顺着线解开打结的路线，露出不好意思的表情。",
        "lines": [
          [
            "安子",
            "你把线绕到椅子腿上了。"
          ],
          [
            "久留美",
            "……我还以为理得挺整齐。"
          ]
        ]
      },
      {
        "action": "同一条线改走桌后，久留美试着起身；杯子仍稳在安子手边，两人没有新的支付或交易动作。",
        "lines": [
          [
            "久留美",
            "这回总算能起身了。"
          ],
          [
            "安子",
            "你自己先站一遍。别再拉着杯子一起。"
          ]
        ]
      }
    ],
    "category": "friend",
    "dialogueId": "life-friend-copy-20261013:life-friend-yasuko-01",
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "copyStatus": "review-ready",
    "artStatus": "not-generated"
  },
  {
    "id": "life-friend-yasuko-02",
    "optionId": "yasuko",
    "order": 2,
    "title": "先放下水壶",
    "setting": "已相识室友的宿舍窗台",
    "panels": [
      {
        "action": "久留美对着同一盆栽的卷叶皱眉，水壶悬在花盆上方；安子看见底盘已经有水，出手制止。",
        "lines": [
          [
            "久留美",
            "这片叶子卷了，是不是没喝够？"
          ],
          [
            "安子",
            "你先别倒了。"
          ]
        ]
      },
      {
        "action": "水从花盆底盘溢到窗台，安子迅速把毛巾垫住；久留美停下倾斜的水壶。",
        "lines": [
          [
            "久留美",
            "怎么水都跑下面来了？"
          ],
          [
            "安子",
            "还好下面是窗台，不是床。"
          ]
        ]
      },
      {
        "action": "安子伸指检查已经湿透的土，久留美俯身看她指出的位置；盆栽仍保持原来的卷叶。",
        "lines": [
          [
            "安子",
            "土都湿透了。"
          ],
          [
            "久留美",
            "那它卷着也不一定是渴啊……"
          ]
        ]
      },
      {
        "action": "久留美将水壶放到一旁，擦拭窗台的一侧；安子拿起湿毛巾去拧，两人具体分工，植物没有突然长好。",
        "lines": [
          [
            "久留美",
            "今天先不给它加了。"
          ],
          [
            "安子",
            "嗯。你来擦这边，我去拧毛巾。"
          ]
        ]
      }
    ],
    "category": "friend",
    "dialogueId": "life-friend-copy-20261013:life-friend-yasuko-02",
    "fromDay": 1,
    "toDay": 50,
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "copyStatus": "review-ready",
    "artStatus": "not-generated"
  }
]);
export const LIFE_FRIEND_DIALOGUE_SOURCES=freeze(LIFE_FRIEND_DIALOGUE_SCENES.map(scene=>({category:'friend',optionId:scene.optionId,dialogue:{sourceId:scene.dialogueId,origin:'current-task-game-dialogue',lines:scene.panels.flatMap(panel=>panel.lines.map(([from,text])=>({from,text})))}})));
