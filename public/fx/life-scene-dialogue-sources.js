import {LIFE_FRIEND_DIALOGUE_SOURCES} from './life-friend-dialogues.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Append-only receipt snapshots, independent of scene artwork or retirement.
// Preserve every published sourceId, origin, speaker and text byte forever.
// Routine text-only sources do not count as new four-panel artwork.
// Five actual Gemini-reviewed exchanges; shrine reuses approved game text.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const LIFE_SCENE_DIALOGUE_SOURCES=freeze([
  {
    "category": "work",
    "optionId": "convenience",
    "dialogue": {
      "sourceId": "life-action-20261012:work:convenience",
      "origin": "gemini-game-dialogue",
      "lines": [
        {
          "from": "久留美",
          "text": "刚把整排乌龙茶推平，才发现标签全冲着不同方向。"
        },
        {
          "from": "久留美",
          "text": "……算了，反正也是最后收尾，顺手拧正吧。"
        },
        {
          "from": "久留美",
          "text": "正面全冲前排，这样看着确实痛快多了。"
        },
        {
          "from": "久留美",
          "text": "下一班要是夸货架整齐，可全是我的功劳。"
        }
      ]
    }
  },
  {
    "category": "work",
    "optionId": "cafe",
    "dialogue": {
      "sourceId": "life-action-20261012:work:cafe",
      "origin": "gemini-game-dialogue",
      "lines": [
        {
          "from": "久留美",
          "text": "这条围裙的面料太滑了，折三次滑开两次。"
        },
        {
          "from": "久留美",
          "text": "我就不信叠不齐它。"
        },
        {
          "from": "久留美",
          "text": "先对折再卷起来……咦，这样居然完全不散架？"
        },
        {
          "from": "久留美",
          "text": "早知道一开始就卷着放进储物柜了。"
        }
      ]
    }
  },
  {
    "category": "work",
    "optionId": "bookstore",
    "dialogue": {
      "sourceId": "life-action-20261012:work:bookstore",
      "origin": "gemini-game-dialogue",
      "lines": [
        {
          "from": "久留美",
          "text": "口袋里的圆珠笔去哪了……刚才还在手里的。"
        },
        {
          "from": "久留美",
          "text": "该不会顺手夹进哪本刚归位的参考书了吧？"
        },
        {
          "from": "久留美",
          "text": "顺着书脊摸过去……哈，果然插在第三本词典里。"
        },
        {
          "from": "久留美",
          "text": "差点给买书的客人附赠一支文具。"
        }
      ]
    }
  },
  {
    "category": "relax",
    "optionId": "shrine",
    "dialogue": {
      "sourceId": "life-action-20261012:relax:shrine",
      "origin": "existing-game-dialogue",
      "lines": [
        {
          "from": "久留美",
          "text": "先不看了。"
        },
        {
          "from": "久留美",
          "text": "明天顺利一点吧。"
        },
        {
          "from": "久留美",
          "text": "就看一眼……"
        },
        {
          "from": "久留美",
          "text": "……出了神社再看。"
        }
      ]
    }
  },
  {
    "category": "relax",
    "optionId": "river",
    "dialogue": {
      "sourceId": "life-action-20261012:relax:river",
      "origin": "gemini-game-dialogue",
      "lines": [
        {
          "from": "久留美",
          "text": "挑了块最扁的石头，今天一定要漂出三道水花。"
        },
        {
          "from": "久留美",
          "text": "出手——啪，一下就沉底了。"
        },
        {
          "from": "久留美",
          "text": "……角度不对，完全没弹起来。"
        },
        {
          "from": "久留美",
          "text": "不过水波一圈一圈散开的样子，看着倒挺舒服的。"
        }
      ]
    }
  },
  {
    "category": "relax",
    "optionId": "park",
    "dialogue": {
      "sourceId": "life-action-20261012:relax:park",
      "origin": "gemini-game-dialogue",
      "lines": [
        {
          "from": "久留美",
          "text": "坐下前本来想拿手机定个十分钟闹钟。"
        },
        {
          "from": "久留美",
          "text": "但连抬手按屏幕都觉得麻烦。"
        },
        {
          "from": "久留美",
          "text": "算了，靠风吹得冷不冷来决定什么时候走吧。"
        },
        {
          "from": "久留美",
          "text": "……要是起大风了就立刻站起来。"
        }
      ]
    }
  }
  ,...LIFE_FRIEND_DIALOGUE_SOURCES
]);
