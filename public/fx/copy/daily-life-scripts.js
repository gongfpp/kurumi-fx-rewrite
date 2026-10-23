// Exact reviewed Gemini candidate text. Unillustrated drafts are not bundled.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const DAILY_LIFE_SCRIPTS=freeze({
  "daily-life-pocket-candy": {
    "id": "daily-life-pocket-candy",
    "order": 1,
    "title": "帆布包底的草莓糖",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美盘腿坐在地毯上，把帆布包倒在膝头翻找，摸出一颗不知放了多久的草莓硬糖。",
        "lines": [
          [
            "久留美",
            "找到了……不对，怎么翻出一颗糖？"
          ]
        ]
      },
      {
        "action": "她把糖果举到台灯前，眯起一只眼睛辨认包装背面磨损的小字。",
        "lines": [
          [
            "久留美",
            "包装没漏气……字太小了，应该没过期吧。"
          ]
        ]
      },
      {
        "action": "她剥开糖纸直接塞进嘴里，下一秒整张脸皱成一团，肩膀酸得猛地一缩。",
        "lines": [
          [
            "久留美",
            "呜！好酸……这不是普通的草莓味！"
          ]
        ]
      },
      {
        "action": "久留美鼓着半边腮帮子，含着糖慢慢呼出一口气，眼神放空盯着天花板。",
        "lines": [
          [
            "久留美",
            "……不过，好像一下子清醒多了。"
          ]
        ]
      }
    ]
  },
  "daily-life-bird-strap": {
    "id": "daily-life-bird-strap",
    "order": 2,
    "title": "斗鸡眼的胖麻雀",
    "fromDay": 2,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "friendStudy"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "萌智子"
    ],
    "dialoguePanels": [
      {
        "action": "两人并排坐在校园木质长椅上，久留美忍不住一直瞅萌智子帆布包上的胖麻雀挂件。",
        "lines": [
          [
            "久留美",
            "萌智子，你包上这只鸟……眼睛贴歪了吧？"
          ],
          [
            "萌智子",
            "这是故意做成斗鸡眼的，很有人气。"
          ]
        ]
      },
      {
        "action": "久留美伸出手指戳了一下那只圆滚滚的毛绒鸟，挂件在空中呆滞地晃了两晃。",
        "lines": [
          [
            "久留美",
            "不管怎么看都像流水线失误啊……"
          ],
          [
            "萌智子",
            "这种蠢萌感才是精髓。"
          ]
        ]
      },
      {
        "action": "萌智子伸手捏了捏麻雀的肚子，挂件突然发出极小声又干瘪的“哔啾”声。",
        "lines": [
          [
            "萌智子",
            "按这里还会叫。"
          ],
          [
            "久留美",
            "等下，怎么叫声这么敷衍！"
          ]
        ]
      },
      {
        "action": "久留美抿着嘴强忍着笑意，手还悬在半空，萌智子平静地把包往她那边挪了一寸。",
        "lines": [
          [
            "久留美",
            "噗……太怪了，再让我按一下看看。"
          ],
          [
            "萌智子",
            "轻点捏，别把它捏扁了。"
          ]
        ]
      }
    ]
  },
  "daily-life-wall-cat": {
    "id": "daily-life-wall-cat",
    "order": 3,
    "title": "围墙上的访客",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美推开金属窗户，晚风微微吹起她额前的碎发，她双手叠放在窗框上向外眺望放松肩膀。",
        "lines": [
          [
            "久留美",
            "外面的空气稍微凉一点了，透透气正好……"
          ]
        ]
      },
      {
        "action": "窗外不远处的红砖围墙顶端，一只灰白条纹的野猫正揣着前爪蹲坐着，转头与久留美对上视线。",
        "lines": [
          [
            "久留美",
            "咦？围墙上什么时候蹲了一只猫……"
          ]
        ]
      },
      {
        "action": "久留美把身子稍稍探出窗台，轻轻搓动拇指和食指，小声发出想要吸引猫咪靠近的呼唤。",
        "lines": [
          [
            "久留美",
            "喂，过来看看？……这里可没有敌意哦。"
          ]
        ]
      },
      {
        "action": "红砖围墙顶端已空无一物，野猫早已不见踪影，久留美探出窗外招手的手僵在半空。",
        "lines": [
          [
            "久留美",
            "完全被无视了……它肯定是赶着去巡逻领地。"
          ]
        ]
      }
    ]
  },
  "daily-life-kicked-eraser": {
    "id": "daily-life-kicked-eraser",
    "order": 5,
    "title": "柜底深处的橡皮",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美单手合上桌面的笔记本，手肘不小心把桌角的小橡皮碰掉了下去。",
        "lines": [
          [
            "久留美",
            "哇，掉了！"
          ]
        ]
      },
      {
        "action": "她反应飞快，下意识抬起右脚想用脚背把掉落的橡皮垫回桌上。",
        "lines": [
          [
            "久留美",
            "看我的脚下反应——！"
          ]
        ]
      },
      {
        "action": "橡皮正好砸在脚尖处，啪嗒一声反弹，直接贴着地板滑进了矮柜最深处的黑缝里。",
        "lines": [
          [
            "久留美",
            "……诶？怎么直接踹进柜子底下了？！"
          ]
        ]
      },
      {
        "action": "久留美整个人趴在地毯上，把脸贴着地板往柜缝里看，里面一片漆黑。",
        "lines": [
          [
            "久留美",
            "早知道就让它直接掉地上了……周末再掏吧。"
          ]
        ]
      }
    ]
  },
  "daily-life-tangled-bike": {
    "id": "daily-life-tangled-bike",
    "order": 7,
    "title": "卡住的自行车把",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "傍晚的校园车棚里，久留美握着自己的旧自行车车把，发现龙头和旁边的车把严丝合缝卡在一起。",
        "lines": [
          [
            "久留美",
            "怎么正好卡得这么紧……"
          ]
        ]
      },
      {
        "action": "她两手分别抓着车座和把手用力向后拽，旁边的车子跟着晃了晃，差点带倒一整排。",
        "lines": [
          [
            "久留美",
            "等等，可不能把别人的车也拽倒了。"
          ]
        ]
      },
      {
        "action": "久留美松开手深吸一口气，弯下腰扶住前轮，小心翼翼地把自己的龙头倾斜着转了个角度。",
        "lines": [
          [
            "久留美",
            "慢慢往侧面转一点……避开刹车线。"
          ]
        ]
      },
      {
        "action": "车子顺畅地从车架里滑了出来，久留美直起腰轻巧地扶正车身，拍了拍车座上的灰尘。",
        "lines": [
          [
            "久留美",
            "顺利脱困！骑车吹吹晚风正好。"
          ]
        ]
      }
    ]
  },
  "daily-life-hot-cocoa": {
    "id": "daily-life-hot-cocoa",
    "order": 8,
    "title": "保温杯里的热可可",
    "fromDay": 2,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "friendStudy"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "萌智子"
    ],
    "dialoguePanels": [
      {
        "action": "傍晚微凉的公交站台长椅上，萌智子旋开随身的小保温杯盖子，热气袅袅升起，久留美侧头看去。",
        "lines": [
          [
            "久留美",
            "还随身带保温杯呀？里面是红茶吗？"
          ],
          [
            "萌智子",
            "不是。"
          ]
        ]
      },
      {
        "action": "久留美凑近轻轻嗅了嗅，飘出来的热气里带着浓郁甜腻的奶香，她有些惊讶地眨眨眼。",
        "lines": [
          [
            "久留美",
            "好浓的巧克力味……竟然是甜的？"
          ],
          [
            "萌智子",
            "是热可可，加了棉花糖。"
          ]
        ]
      },
      {
        "action": "萌智子两手捧着杯盖小口啜饮，表情依旧平静淡然，耳侧发丝被微风轻轻拂动。",
        "lines": [
          [
            "久留美",
            "你平时那么理性，口味原来这么小孩子气。"
          ],
          [
            "萌智子",
            "多动脑需要补充糖分，这叫合理配置。"
          ]
        ]
      },
      {
        "action": "萌智子侧过脸，对上久留美目不转睛的视线，平静地把小杯盖往久留美面前递了递。",
        "lines": [
          [
            "萌智子",
            "盯得这么明显，想喝就分你一口。"
          ],
          [
            "久留美",
            "那……那我就尝一小口！"
          ]
        ]
      }
    ]
  },
  "daily-life-cold-water": {
    "id": "daily-life-cold-water",
    "order": 10,
    "title": "彻底晾凉的温水",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "arcs": [],
      "fallback": [],
      "story": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美双手捧着刚倒满开水的白色马克杯，杯口冒着腾腾热气，她嘟起嘴轻轻吹了吹。",
        "lines": [
          [
            "久留美",
            "好烫……先在桌上晾两分钟再喝。"
          ]
        ]
      },
      {
        "action": "她把杯子搁在木桌边，整个人靠在转椅椅背上仰起头，双臂举过头顶用力伸了个懒腰。",
        "lines": [
          [
            "久留美",
            "趁水晾凉的空档，正好伸展一下肩膀。"
          ]
        ]
      },
      {
        "action": "她望着窗外的夜空出神发了会儿呆，回过神来重新伸手端起桌角的马克杯。",
        "lines": [
          [
            "久留美",
            "差不多温热了吧，正好大口喝完。"
          ]
        ]
      },
      {
        "action": "她大口灌了一口水，水温却已经彻底冰凉，她鼓着腮帮子咽下去，低头看着杯底发呆。",
        "lines": [
          [
            "久留美",
            "怎么凉得这么彻底……我到底发呆了多久？"
          ]
        ]
      }
    ]
  },
  "daily-life-street-lamps": {
    "id": "daily-life-street-lamps",
    "order": 11,
    "title": "依次亮起的路灯",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美双手轻搭在走廊金属栏杆上，晚霞渐渐褪去，街景笼罩在微蓝的暮色之中。",
        "lines": [
          [
            "久留美",
            "天色暗得比想象中还要快一点。"
          ]
        ]
      },
      {
        "action": "楼下一盏暖黄色的路灯闪烁了两下随后稳稳亮起，在沥青路面上投出一圈圆形光晕。",
        "lines": [
          [
            "久留美",
            "亮起来了……第一盏是街角这边的。"
          ]
        ]
      },
      {
        "action": "街道远处的路灯沿着路面一盏接一盏依次泛起黄光，连成一条柔和延伸的光带。",
        "lines": [
          [
            "久留美",
            "接着是第二盏、第三盏……像排好队一样。"
          ]
        ]
      },
      {
        "action": "晚风拂起久留美的碎发，她抱起双臂抵挡初升的凉意，转身准备走回室内。",
        "lines": [
          [
            "久留美",
            "稍微有点起风了，差不多该回去了。"
          ]
        ]
      }
    ]
  },
  "daily-life-toothpaste-tube": {
    "id": "daily-life-toothpaste-tube",
    "order": 16,
    "title": "最后一点牙膏",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美站在洗手台前，双手把几乎扁平的牙膏皮从尾端一折一折往前卷紧。",
        "lines": [
          [
            "久留美",
            "应该还能再挤出一次的量……"
          ]
        ]
      },
      {
        "action": "她用大拇指从折缝处用力往前推挤，管口终于颤巍巍探出一小截圆滚滚的白牙膏。",
        "lines": [
          [
            "久留美",
            "很好，正好够刷一次。"
          ]
        ]
      },
      {
        "action": "她刚把牙刷毛凑过去接，那小团牙膏顺势滑脱，啪嗒一声直接掉进了水池下水口旁。",
        "lines": [
          [
            "久留美",
            "……啊，掉下去了。"
          ]
        ]
      },
      {
        "action": "久留美拧开水龙头把洗手池冲净，顺手把用空的牙膏皮插进杯中，关上水龙头。",
        "lines": [
          [
            "久留美",
            "算了，明天直接换新的吧。"
          ]
        ]
      }
    ]
  },
  "daily-life-folding-umbrella": {
    "id": "daily-life-folding-umbrella",
    "order": 18,
    "title": "收拢的长柄伞",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "arcs": [],
      "fallback": [],
      "story": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "地上一把完全撑开晾干的黑色长柄伞，久留美弯腰按下伞骨滑扣将伞面收合。",
        "lines": [
          [
            "久留美",
            "伞面完全干透了，收起来吧。"
          ]
        ]
      },
      {
        "action": "她一手握着伞柄，另一手顺着伞骨走向一折一折地理顺散开的伞面褶皱。",
        "lines": [
          [
            "久留美",
            "每道折痕理平整，卷出来才好看。"
          ]
        ]
      },
      {
        "action": "她捏起细魔术贴绑带往伞身绕了一圈，发现贴面朝外毛面朝里，搭扣没有粘住。",
        "lines": [
          [
            "久留美",
            "咦？反了……扣带刚才卷反了一圈。"
          ]
        ]
      },
      {
        "action": "久留美把带子翻正重新绕紧，拇指轻轻一压让魔术贴严丝合缝粘好，把伞靠墙立正。",
        "lines": [
          [
            "久留美",
            "正过来一贴就整齐了，收工。"
          ]
        ]
      }
    ]
  },
  "daily-life-ginkgo-leaf": {
    "id": "daily-life-ginkgo-leaf",
    "order": 21,
    "title": "教材里的银杏叶",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "arcs": [],
      "fallback": [],
      "story": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美在书桌前翻开一本厚教材，夹在书页间的一片金黄干银杏叶随之滑落在桌上。",
        "lines": [
          [
            "久留美",
            "咦……怎么夹了一片银杏叶在里面？"
          ]
        ]
      },
      {
        "action": "她捏起细细的叶柄迎着台灯光线端详，扇形叶脉纹路完整，叶面被压得格外平顺。",
        "lines": [
          [
            "久留美",
            "压得很平整啊，好像是上学期顺手夹的。"
          ]
        ]
      },
      {
        "action": "她指尖轻抚过叶片边缘，随后把它端正移到当前正在阅读的书页正中间。",
        "lines": [
          [
            "久留美",
            "当时好像是为了记一道题的页码……"
          ]
        ]
      },
      {
        "action": "久留美轻轻合拢教材，只让小小的叶柄露在书脊顶端，将书本整齐推至桌角。",
        "lines": [
          [
            "久留美",
            "正好，现在接着当书签用吧。"
          ]
        ]
      }
    ]
  },
  "daily-life-pencil-shaving": {
    "id": "daily-life-pencil-shaving",
    "order": 26,
    "title": "完整的一圈铅笔屑",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美坐得笔直，指尖沉稳捏着木质铅笔，缓缓送入小型金属卷笔刀中。",
        "lines": [
          [
            "久留美",
            "角度放平，轻轻转一圈……"
          ]
        ]
      },
      {
        "action": "卷笔刀侧口处匀速吐出一整片连贯而完整的波浪状木屑，边缘泛着新鲜木纹。",
        "lines": [
          [
            "久留美",
            "顺着木纹走，完全没有断。"
          ]
        ]
      },
      {
        "action": "最后一圈木花完好脱落，露出削得细腻尖挺的铅笔芯，久留美轻轻停下手指。",
        "lines": [
          [
            "久留美",
            "呼，笔尖削得刚刚好。"
          ]
        ]
      },
      {
        "action": "她将铅笔端正平放在桌上，看着小托盘里圆整立体的木花，悄悄弯起眉眼。",
        "lines": [
          [
            "久留美",
            "看着齐整的木屑，心情变顺畅了。"
          ]
        ]
      }
    ]
  },
  "daily-life-first-raindrop": {
    "id": "daily-life-first-raindrop",
    "order": 29,
    "title": "撞在窗上的第一滴雨",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美单手支着下巴看着窗外灰白发沉的天空，空气透着明显的闷燥感。",
        "lines": [
          [
            "久留美",
            "天色好沉，稍微有点闷呢。"
          ]
        ]
      },
      {
        "action": "窗外的树叶突然齐刷刷翻动起来，一股夹杂着泥土气息的湿润凉风吹拂窗帘边缘。",
        "lines": [
          [
            "久留美",
            "起风了，有潮湿的味道。"
          ]
        ]
      },
      {
        "action": "透明玻璃正中央啪的一声绽开一颗浑圆的深色水渍，水滴顺着玻璃缓缓滑下。",
        "lines": [
          [
            "久留美",
            "哇，好大的一滴雨点。"
          ]
        ]
      },
      {
        "action": "久留美轻轻将窗缝推开些许，闭上双眼迎着扑面而来的湿润凉意深吸一口气。",
        "lines": [
          [
            "久留美",
            "吹进来的风变凉爽多了。"
          ]
        ]
      }
    ]
  },
  "daily-life-roommate-energy-can": {
    "id": "daily-life-roommate-energy-can",
    "order": 6,
    "title": "递过来的能量饮料",
    "fromDay": 2,
    "toDay": 30,
    "contexts": [
      "roommate"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "康子"
    ],
    "dialoguePanels": [
      {
        "action": "康子半倚在微开的房门边，手里拎着一罐黑色易拉罐饮料递过来，久留美从桌旁惊讶地抬头。",
        "lines": [
          [
            "康子",
            "顺手多拿了一罐，给你。"
          ],
          [
            "久留美",
            "诶？特地给我的吗？"
          ]
        ]
      },
      {
        "action": "久留美双手接过易拉罐，罐身渗出的冰凉水汽让她手指缩了缩，康子抱着手臂站在门边。",
        "lines": [
          [
            "久留美",
            "冰冰凉凉的正好，今晚还能多看会儿走势。"
          ],
          [
            "康子",
            "盘都停了，你对着静止的折线念经呢？"
          ]
        ]
      },
      {
        "action": "久留美两手握着易拉罐鼓起腮帮子，康子侧过身子，指了指手腕假装提醒时间。",
        "lines": [
          [
            "久留美",
            "复盘也是必要的功课好不好……"
          ],
          [
            "康子",
            "喝完就老实睡觉，别睁着眼睛硬熬。"
          ]
        ]
      },
      {
        "action": "康子背过身摆了摆手朝走廊走去，久留美低头看着手里的饮料罐，嘴角扬起一点笑意。",
        "lines": [
          [
            "康子",
            "明天要是顶着黑眼圈，我可不管你。"
          ],
          [
            "久留美",
            "知道啦……谢了，康子。"
          ]
        ]
      }
    ]
  },
  "daily-life-sticker-residue": {
    "id": "daily-life-sticker-residue",
    "order": 15,
    "title": "封底的残胶",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美翻转手中的空白记事本，发现背面贴着一张小条形码标签，指甲试着抠起边角。",
        "lines": [
          [
            "久留美",
            "这种贴纸最麻烦了，撕不好就留胶……"
          ]
        ]
      },
      {
        "action": "她放慢呼吸，小心捏住掀起的标签一角，以极低的角度轻轻向后拉扯撕开。",
        "lines": [
          [
            "久留美",
            "慢慢来……只要角度压平就没问题。"
          ]
        ]
      },
      {
        "action": "标签在撕到最后边缘时脆生生断开，封底上赫然留下一道撕裂的白纸皮与发黏的胶印。",
        "lines": [
          [
            "久留美",
            "啊……偏偏在最后一点断掉了！"
          ]
        ]
      },
      {
        "action": "久留美鼓着腮帮子，用大拇指指腹贴在残胶上来回用力搓动，搓出几缕微小的灰屑。",
        "lines": [
          [
            "久留美",
            "只能用手指一点点搓掉了……真费工夫。"
          ]
        ]
      }
    ]
  },
  "daily-life-sluggish-sensor-tap": {
    "id": "daily-life-sluggish-sensor-tap",
    "order": 20,
    "title": "迟钝的感应水龙头",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "教学楼走廊尽头的洗手池前，久留美将双手平伸在感应水龙头下方，水流没有出现。",
        "lines": [
          [
            "久留美",
            "……咦，手伸得不够靠前吗？"
          ]
        ]
      },
      {
        "action": "久留美微微倾身，用指尖抹了抹感应窗的黑色玻璃，再次把手凑近出水口下方。",
        "lines": [
          [
            "久留美",
            "还是没反应……难道是停水了？"
          ]
        ]
      },
      {
        "action": "久留美刚收回手准备转身，水龙头突然哗的一声喷出一股水流落在水池中央。",
        "lines": [
          [
            "久留美",
            "哇，这反应也太慢了吧！"
          ]
        ]
      },
      {
        "action": "久留美慌忙把手重新凑过去，水流却正好戛然而止，掌心里只落下一两滴水珠。",
        "lines": [
          [
            "久留美",
            "……根本是在故意跟我作对嘛。"
          ]
        ]
      }
    ]
  },
  "daily-life-junk-mail": {
    "id": "daily-life-junk-mail",
    "order": 9,
    "title": "信箱里的传单",
    "fromDay": 3,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "roommate"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "康子"
    ],
    "dialoguePanels": [
      {
        "action": "一楼金属信箱排前，久留美拉开信箱铁门，哗啦啦掉出一大叠花花绿绿的外卖与促销广告。",
        "lines": [
          [
            "久留美",
            "几天没看，怎么塞了这么多广告纸。"
          ],
          [
            "康子",
            "投递员可真勤快，全照顾你这格了。"
          ]
        ]
      },
      {
        "action": "康子双手插在连帽衫口袋里斜靠着墙，久留美一张张快速翻检，生怕漏掉了重要通知。",
        "lines": [
          [
            "康子",
            "全当废纸扔掉不就得了。"
          ],
          [
            "久留美",
            "等等，这张披萨单上有免费小食券！"
          ]
        ]
      },
      {
        "action": "久留美举着亮黄色的优惠券两眼放光，康子凑上前看了一眼最下方的灰色极小字。",
        "lines": [
          [
            "久留美",
            "点大份就送烤薯角，好像挺划算的？"
          ],
          [
            "康子",
            "醒醒，底下写着仅限周二工作日午市。"
          ]
        ]
      },
      {
        "action": "久留美嘴角抽搐，顺手把一整叠传单整齐投进旁边的废纸回收箱，康子轻哼了一声。",
        "lines": [
          [
            "久留美",
            "用不上的券等于没发……全回收！"
          ],
          [
            "康子",
            "早说了让你直接扔，偏要浪费眼力。"
          ]
        ]
      }
    ]
  },
  "daily-life-pebble-mochi": {
    "id": "daily-life-pebble-mochi",
    "order": 12,
    "title": "像烤年糕的石子",
    "fromDay": 2,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "friendStudy"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "萌智子"
    ],
    "dialoguePanels": [
      {
        "action": "两人走在校园碎石道上，萌智子突然在路边停下蹲身，久留美驻足低头看她。",
        "lines": [
          [
            "久留美",
            "怎么突然停下了？鞋带开了吗？"
          ],
          [
            "萌智子",
            "没有，在看脚边。"
          ]
        ]
      },
      {
        "action": "萌智子站起身摊开掌心，托着一枚扁圆光滑的灰白鹅卵石向久留美展示。",
        "lines": [
          [
            "久留美",
            "这不就是普通的碎石子吗？"
          ],
          [
            "萌智子",
            "你不觉得它长得很像烤年糕吗？"
          ]
        ]
      },
      {
        "action": "久留美歪着头仔细打量，石子中间微微鼓起，侧边刚好有一道浅褐色的天然裂纹。",
        "lines": [
          [
            "久留美",
            "这么一说……中间鼓起来的地方确实有点像。"
          ],
          [
            "萌智子",
            "表面还有一道烤焦的印子。"
          ]
        ]
      },
      {
        "action": "萌智子把小石子轻轻搁在花坛泥土表面，拍了拍手指，久留美抱胸站在旁边看着。",
        "lines": [
          [
            "久留美",
            "我还以为你会带回去收藏呢。"
          ],
          [
            "萌智子",
            "放在花坛泥土里看起来更逼真。"
          ]
        ]
      }
    ]
  },
  "daily-life-papercut-crease": {
    "id": "daily-life-papercut-crease",
    "order": 13,
    "title": "贴歪了的创口贴",
    "fromDay": 3,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "roommate"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "康子"
    ],
    "dialoguePanels": [
      {
        "action": "康子站在窗台边单手笨拙地撕着创口贴包装，右手食指上有一道浅红划痕，久留美走近看。",
        "lines": [
          [
            "久留美",
            "你手指怎么了？划破了？"
          ],
          [
            "康子",
            "被复印纸切了一下，包装纸真难撕。"
          ]
        ]
      },
      {
        "action": "久留美伸手指尖按住包装纸底端边缘，示意康子顺着易撕口往下拉开。",
        "lines": [
          [
            "久留美",
            "别硬扯，按住这里撕比较顺手。"
          ],
          [
            "康子",
            "知道了，我又不是不会撕。"
          ]
        ]
      },
      {
        "action": "康子迅速把胶布往指尖上一裹，胶带两端不小心粘在了一起，留下一个翘起的死褶。",
        "lines": [
          [
            "康子",
            "啧，胶带贴歪了。"
          ],
          [
            "久留美",
            "噗……要不要重新换一张？"
          ]
        ]
      },
      {
        "action": "康子用拇指用力把翘起的褶皱按平在指腹上，偏过头不再看自己的手指。",
        "lines": [
          [
            "康子",
            "用不着，能止血就行，哪来那么多讲究。"
          ],
          [
            "久留美",
            "好好，能用就行。"
          ]
        ]
      }
    ]
  },
  "daily-life-wobbly-table": {
    "id": "daily-life-wobbly-table",
    "order": 14,
    "title": "晃动的公共圆桌",
    "fromDay": 3,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "friendStudy",
        "roommate"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "萌智子",
      "康子"
    ],
    "dialoguePanels": [
      {
        "action": "三人围在休息室圆桌旁刚放下随身包，桌面突然咔噔一声向久留美这边倾斜了一下。",
        "lines": [
          [
            "久留美",
            "哇，这桌子有一只脚是悬空的。"
          ],
          [
            "康子",
            "难怪刚才那桌人全换位子了。"
          ]
        ]
      },
      {
        "action": "久留美双手按紧桌沿稳住重心，康子摸了摸口袋，萌智子从笔记本边缘抽出一张厚便签。",
        "lines": [
          [
            "久留美",
            "得找个东西垫一下才行。"
          ],
          [
            "康子",
            "我这只有两张揉成团的废收据。"
          ]
        ]
      },
      {
        "action": "萌智子把折叠整齐的厚便签平整地推入悬空的桌脚缝隙，动作极其利落干脆。",
        "lines": [
          [
            "萌智子",
            "松手试一下，我垫了一张硬纸卡。"
          ],
          [
            "久留美",
            "这么快就垫平了？"
          ]
        ]
      },
      {
        "action": "久留美用力按了按桌面发现完全不晃了，康子靠在椅背上抱着手臂看向萌智子。",
        "lines": [
          [
            "康子",
            "动作倒是挺麻利。"
          ],
          [
            "萌智子",
            "桌子不平，放杯子容易洒。"
          ]
        ]
      }
    ]
  },
  "daily-life-crosswalk-timing": {
    "id": "daily-life-crosswalk-timing",
    "order": 17,
    "title": "路口的信号灯",
    "fromDay": 2,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "friendStudy"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "萌智子"
    ],
    "dialoguePanels": [
      {
        "action": "街角斑马线前亮着红灯，久留美探身张望路口车流，萌智子并肩安静站立。",
        "lines": [
          [
            "久留美",
            "这个路口的红灯好像总是特别久。"
          ],
          [
            "萌智子",
            "车流量这么大，急也没用。"
          ]
        ]
      },
      {
        "action": "久留美百无聊赖地抬脚踩着马路牙子边缘试着保持平衡，萌智子侧头看她。",
        "lines": [
          [
            "久留美",
            "干等好无聊，我都想踩着马路牙子走平衡木了。"
          ],
          [
            "萌智子",
            "别乱动，小心踩空崴到脚。"
          ]
        ]
      },
      {
        "action": "正在等待的机动车流中，一辆车身印着棕色小熊图案的货车停下，萌智子视线定格在小熊上。",
        "lines": [
          [
            "久留美",
            "咦？你在看什么？"
          ],
          [
            "萌智子",
            "那辆车门上的熊……挺可爱的。"
          ]
        ]
      },
      {
        "action": "人行道绿灯伴着提示音亮起，久留美轻快迈步踏上斑马线，萌智子收回视线跟在她身侧。",
        "lines": [
          [
            "久留美",
            "走啦走啦，绿灯了，小熊也开走咯。"
          ],
          [
            "萌智子",
            "我知道，看着路走。"
          ]
        ]
      }
    ]
  },
  "daily-life-bunny-tissues": {
    "id": "daily-life-bunny-tissues",
    "order": 19,
    "title": "印着兔子的纸巾",
    "fromDay": 3,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "roommate"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "康子"
    ],
    "dialoguePanels": [
      {
        "action": "康子从连帽衫口袋摸出一包便携纸巾，包装正中印着硕大的卡通白兔，久留美转头瞧见。",
        "lines": [
          [
            "久留美",
            "这纸巾包装……和你头上的发卡是同一只兔子吧？"
          ],
          [
            "康子",
            "路边发传单顺手拿的，别瞎琢磨。"
          ]
        ]
      },
      {
        "action": "久留美指了指包装袋边角的版权标，康子抽出一张纸巾捏在手里，面不改色。",
        "lines": [
          [
            "久留美",
            "这分明是周边限定款，传单哪有送这个的。"
          ],
          [
            "康子",
            "包装印什么又影响不了纸巾擦灰。"
          ]
        ]
      },
      {
        "action": "康子低头用纸巾擦掉袖口沾上的一抹粉笔灰，随后把纸巾包重新塞回口袋里。",
        "lines": [
          [
            "久留美",
            "喜欢兔子又不是坏事，干嘛非要嘴硬。"
          ],
          [
            "康子",
            "谁嘴硬了，我只是不在意印花而已。"
          ]
        ]
      },
      {
        "action": "康子双手插回卫衣口袋目不斜视往前走，久留美背着包步调轻松跟在旁边。",
        "lines": [
          [
            "康子",
            "走你的路，别盯着别人的口袋看。"
          ],
          [
            "久留美",
            "好好，我不说就是了。"
          ]
        ]
      }
    ]
  },
  "daily-life-hop-sparrow": {
    "id": "daily-life-hop-sparrow",
    "order": 22,
    "title": "台阶前的圆麻雀",
    "fromDay": 2,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "friendStudy"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "萌智子"
    ],
    "dialoguePanels": [
      {
        "action": "两人并排坐在校园室外台阶上，一只灰褐色的小麻雀在前方两米处一跳一跳地觅食。",
        "lines": [
          [
            "萌智子",
            "别动，前面有一只。"
          ],
          [
            "久留美",
            "看到了，好圆的小鸟。"
          ]
        ]
      },
      {
        "action": "萌智子收敛呼吸，上身以极慢的速度缓缓前倾，目不转睛地注视着前方的雀鸟。",
        "lines": [
          [
            "萌智子",
            "只要动作够慢，它就不会飞走……"
          ],
          [
            "久留美",
            "你连睫毛都快不眨了。"
          ]
        ]
      },
      {
        "action": "小麻雀突然歪过小脑袋，好奇地打量起萌智子垂在胸前的紫发，试探着跳近半步。",
        "lines": [
          [
            "久留美",
            "它不仅没被吓跑，好像还在看你的头发。"
          ],
          [
            "萌智子",
            "……真的跳过来了。"
          ]
        ]
      },
      {
        "action": "麻雀轻巧扑棱翅膀飞向树梢，两人同时呼出一口气，转过头相视一笑。",
        "lines": [
          [
            "久留美",
            "……飞走了呢。"
          ],
          [
            "萌智子",
            "嗯，刚才离得很近。"
          ]
        ]
      }
    ]
  },
  "daily-life-bookshelf-misplaced": {
    "id": "daily-life-bookshelf-misplaced",
    "order": 23,
    "title": "放串行的书脊",
    "fromDay": 3,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "roommate"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "康子"
    ],
    "dialoguePanels": [
      {
        "action": "校园阅览室书架前，康子双臂抱胸，视线在同一排书脊上来回搜寻，神情微烦。",
        "lines": [
          [
            "康子",
            "系统明明说在这架，怎么死活找不到。"
          ],
          [
            "久留美",
            "你在找那本绿皮的统计教材？"
          ]
        ]
      },
      {
        "action": "康子抬手戳了戳书架中间的空位，久留美退后半步抬头打量更高一层的书格。",
        "lines": [
          [
            "康子",
            "编号就在这，八成被谁顺手拿走了。"
          ],
          [
            "久留美",
            "等等，上面那层好像插错了一本。"
          ]
        ]
      },
      {
        "action": "久留美踮起脚尖，从上一排文学书里准确抽出一本厚重的绿皮书，递到康子面前。",
        "lines": [
          [
            "久留美",
            "看，被哪个粗心的人放错行了。"
          ],
          [
            "康子",
            "……哈，还真在上面。"
          ]
        ]
      },
      {
        "action": "康子接过书在手里颠了颠，低头翻开目录页，嘴角不自在地微微扬起一丝认可。",
        "lines": [
          [
            "康子",
            "眼力倒挺好，算我欠你一次。"
          ],
          [
            "久留美",
            "顺手而已，你快看你的吧。"
          ]
        ]
      }
    ]
  },
  "daily-life-wind-fluttering-flyer": {
    "id": "daily-life-wind-fluttering-flyer",
    "order": 4,
    "title": "被风吹起的长廊海报",
    "fromDay": 2,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "friendStudy"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "萌智子"
    ],
    "dialoguePanels": [
      {
        "action": "久留美抬手按住连廊公告栏上被风吹得啪嗒作响的海报一角，萌智子站在一旁看着脱落的图钉。",
        "lines": [
          [
            "久留美",
            "这一角被风吹得一直响呢。"
          ],
          [
            "萌智子",
            "下面的塑料图钉刚才掉在地上了。"
          ]
        ]
      },
      {
        "action": "久留美蹲下身从地砖缝边捡起那枚红色小图钉，抬头向萌智子展示。",
        "lines": [
          [
            "久留美",
            "看，正好落在地砖缝里没滚远！"
          ],
          [
            "萌智子",
            "运气不错，直接按回去就行了。"
          ]
        ]
      },
      {
        "action": "久留美踮起脚尖使劲把图钉按进木质公告板，木板略硬，她抿着嘴手腕微微用力。",
        "lines": [
          [
            "久留美",
            "呜……这里的木板比想象中硬好多。"
          ],
          [
            "萌智子",
            "用掌心平着推，别光靠指尖用力。"
          ]
        ]
      },
      {
        "action": "图钉终于完全压紧，久留美甩了甩手掌舒了口气，萌智子伸手轻轻碰了碰固定好的海报边缘。",
        "lines": [
          [
            "久留美",
            "哼哼，我其实刚才正打算换掌心呢。"
          ],
          [
            "萌智子",
            "是是，至少现在它不会再啪嗒响了。"
          ]
        ]
      }
    ]
  },
  "daily-life-shifting-sunset": {
    "id": "daily-life-shifting-sunset",
    "order": 24,
    "title": "移过头顶的树荫",
    "fromDay": 3,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "friendStudy",
        "roommate"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "萌智子",
      "康子"
    ],
    "dialoguePanels": [
      {
        "action": "三人并排坐在花坛长椅上，西斜的夕阳正巧晃在康子脸上，康子抬手遮在额前。",
        "lines": [
          [
            "康子",
            "好晃眼……太阳怎么偏偏全照我脸上了。"
          ],
          [
            "久留美",
            "谁让你挑了最靠边的那个位置呀。"
          ]
        ]
      },
      {
        "action": "康子往久留美身边靠了靠借阴凉，久留美笑着往中间挪腾出身位。",
        "lines": [
          [
            "康子",
            "久留美你往那边让让，给我借点阴凉。"
          ],
          [
            "久留美",
            "来来来，挤一挤就挡住了。"
          ]
        ]
      },
      {
        "action": "萌智子从包里取出一本摊开的大开本讲义，从旁侧伸手替康子遮挡斜照的阳光。",
        "lines": [
          [
            "萌智子",
            "用这个遮一下。"
          ],
          [
            "康子",
            "……谢了，算你反应快。"
          ]
        ]
      },
      {
        "action": "夕阳渐渐落向树冠背后，橙红暮光柔和地漫过长椅，三人并肩坐着吹拂傍晚的微风。",
        "lines": [
          [
            "久留美",
            "太阳落下去一点了，现在吹风好舒服。"
          ],
          [
            "康子",
            "哼……那就再坐五分钟再回去。"
          ]
        ]
      }
    ]
  },
  "daily-life-task-crossed-off": {
    "id": "daily-life-task-crossed-off",
    "order": 25,
    "title": "划掉备忘的一笔",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美坐在桌前，目光停留在桌面一角贴着的一张淡粉色便签纸上，上面写着“还卡”。",
        "lines": [
          [
            "久留美",
            "啊，借书卡下午出门时已经顺便还过了。"
          ]
        ]
      },
      {
        "action": "她从笔筒里抽出一支黑色签字笔，笔尖在便签纸文字正上方微微悬停顿住。",
        "lines": [
          [
            "久留美",
            "把做完的事划掉，是这一天最爽快的时候。"
          ]
        ]
      },
      {
        "action": "笔尖干脆利落地划过纸面，一道笔直有力的横线整齐地穿透了便签上的字迹。",
        "lines": [
          [
            "久留美",
            "搞定，一笔勾销。"
          ]
        ]
      },
      {
        "action": "她顺手揭下便签对折成小方块，手指轻轻一弹，纸团稳稳落入桌下的小废纸篓中。",
        "lines": [
          [
            "久留美",
            "桌角空出一块，看着整洁多了。"
          ]
        ]
      }
    ]
  },
  "daily-life-synchronized-pigeons": {
    "id": "daily-life-synchronized-pigeons",
    "order": 27,
    "title": "步调一致的花坛鸽子",
    "fromDay": 2,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "friendStudy"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "萌智子"
    ],
    "dialoguePanels": [
      {
        "action": "萌智子轻轻用手肘碰了碰身旁走着的久留美，视线投向低矮的花坛石沿。",
        "lines": [
          [
            "萌智子",
            "久留美，看石沿那边。"
          ]
        ]
      },
      {
        "action": "石沿上并排走着两只胖乎乎的鸽子，爪子迈出的节奏分毫不差，宛如同步行进。",
        "lines": [
          [
            "久留美",
            "两只鸽子的步调完全一样？"
          ]
        ]
      },
      {
        "action": "萌智子双手插在风衣口袋里侧头观赏，久留美在一旁抿嘴忍俊不禁。",
        "lines": [
          [
            "萌智子",
            "像刚结业的仪仗队呢。"
          ],
          [
            "久留美",
            "连点头的频率都分毫不差。"
          ]
        ]
      },
      {
        "action": "其中一只鸽子突然歪头啄了下地面的落叶，原本严肃的同步步伐瞬间乱成一团。",
        "lines": [
          [
            "萌智子",
            "啊，左边那只抢跑了。"
          ],
          [
            "久留美",
            "噗，队形一下子散掉了。"
          ]
        ]
      }
    ]
  },
  "daily-life-hair-cowlick": {
    "id": "daily-life-hair-cowlick",
    "order": 28,
    "title": "翘起的一缕发丝",
    "fromDay": 3,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "roommate"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "康子"
    ],
    "dialoguePanels": [
      {
        "action": "久留美正低头靠在窗台边翻看笔记本，头顶翘起一根格外显眼的粉色呆毛。",
        "lines": [
          [
            "康子",
            "喂，你头顶那是怎么回事。"
          ]
        ]
      },
      {
        "action": "康子伸出食指，啪嗒一声轻弹在那根翘起的发丝上，发丝弹簧般晃动两下。",
        "lines": [
          [
            "久留美",
            "哎？头顶怎么了吗？"
          ]
        ]
      },
      {
        "action": "久留美反手按住乱翘的头发，康子把头扭开，唇角挂着习以为常的嫌弃弧度。",
        "lines": [
          [
            "康子",
            "呆毛翘得像雷达接收器。"
          ],
          [
            "久留美",
            "肯定是刚才靠着椅背压到了……"
          ]
        ]
      },
      {
        "action": "康子顺手将吹进穿堂风的窗户往里拉严实了一半，挡住了呼呼吹向久留美的冷风。",
        "lines": [
          [
            "康子",
            "窗缝风大，压平了再吹。"
          ],
          [
            "久留美",
            "康子其实注意得很细呢。"
          ]
        ]
      }
    ]
  },
  "daily-life-corridor-echoes": {
    "id": "daily-life-corridor-echoes",
    "order": 30,
    "title": "连廊里的脚步声",
    "fromDay": 1,
    "toDay": 30,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "挑高的空旷连廊内，久留美迈出一步踩在水磨石地面上，空灵的踏地声在两侧墙壁间回荡。",
        "lines": [
          [
            "久留美",
            "这里的回声……怎么响成这样？"
          ]
        ]
      },
      {
        "action": "久留美转头环视左右两头空荡的走道，双手微提衣角，小心翼翼地踮起脚尖向前迈出一步。",
        "lines": [
          [
            "久留美",
            "这样踮着脚走，总该没声音了吧。"
          ]
        ]
      },
      {
        "action": "久留美重心微晃了一下，鞋底边缘蹭过地面发出一声尖锐短促的摩擦声。",
        "lines": [
          [
            "久留美",
            "呜……擦到地面反而更响了！"
          ]
        ]
      },
      {
        "action": "久留美索性将脚跟实实踩回地面，两手插进大衣口袋，低头大步流星地朝前走去。",
        "lines": [
          [
            "久留美",
            "反正走廊空着，走快点穿过去算了。"
          ]
        ]
      }
    ]
  },
  "daily-life-pingpong-bounce": {
    "id": "daily-life-pingpong-bounce",
    "order": 31,
    "title": "场边的颠球纪录",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美站在长椅边，小心翼翼地一下下颠着橙色乒乓球，目光跟着球一上一下。",
        "lines": [
          [
            "久留美",
            "这次节奏很好，已经连续二十个了……"
          ]
        ]
      },
      {
        "action": "乒乓球稍微往旁边飘了一点，久留美急忙侧跨半步去接，动作略显僵硬。",
        "lines": [
          [
            "久留美",
            "等等，别往风里跑啊。"
          ]
        ]
      },
      {
        "action": "球弹在拍子木边边缘，“嗒”的一声飞向旁边的空草皮，久留美扑空抓了个寂寞。",
        "lines": [
          [
            "久留美",
            "啊，偏得也太干脆了吧。"
          ]
        ]
      },
      {
        "action": "久留美站在草皮边，低头看着托在掌心的乒乓球，嘴角带着一点无奈的笑意。",
        "lines": [
          [
            "久留美",
            "停在二十七个啊……下次争取到三十吧。"
          ]
        ]
      }
    ]
  },
  "daily-life-campus-sculpture": {
    "id": "daily-life-campus-sculpture",
    "order": 32,
    "title": "长廊边的几何雕塑",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "friendStudy"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "萌智子"
    ],
    "dialoguePanels": [
      {
        "action": "久留美和萌智子停在雕塑前，久留美歪着脑袋端详最上方翘起的那截尖角。",
        "lines": [
          [
            "久留美",
            "萌智子，这怎么看都像没睡醒被压扁的羊角面包。"
          ],
          [
            "萌智子",
            "你的联想总是直接跳到便利店货架。"
          ]
        ]
      },
      {
        "action": "萌智子双手抱臂后退了一步，换了个角度看向雕塑镂空的中段。",
        "lines": [
          [
            "萌智子",
            "从侧面看的话，倒有点像快融化的回形针。"
          ]
        ]
      },
      {
        "action": "久留美学着萌智子的姿势也往后退，结果差点踩到路沿边缘，赶紧稳住身形。",
        "lines": [
          [
            "久留美",
            "哇，后退看好像更怪了！"
          ],
          [
            "萌智子",
            "小心脚底下，别真被面包绊倒。"
          ]
        ]
      },
      {
        "action": "两人并肩继续往前走，久留美回头又瞅了一眼雕塑，嘴角带着轻松的笑意。",
        "lines": [
          [
            "久留美",
            "不过把回形针和面包拼在一起，作者会哭吧。"
          ],
          [
            "萌智子",
            "那就装作我们什么都没说过。"
          ]
        ]
      }
    ]
  },
  "daily-life-bench-sketch": {
    "id": "daily-life-bench-sketch",
    "order": 33,
    "title": "休息区的速写模特",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "roommate"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "康子"
    ],
    "dialoguePanels": [
      {
        "action": "久留美双手平放在膝盖上，肩膀坐得笔直，视线斜斜瞥向康子的速写本。",
        "lines": [
          [
            "久留美",
            "这个坐姿真的行吗，我感觉后背都硬了。"
          ],
          [
            "康子",
            "别动，你嘴角抽筋我就只能画苦瓜了。"
          ]
        ]
      },
      {
        "action": "久留美鼻尖有点痒，忍不住偷偷吸了吸鼻子，眼睛眨巴了两下。",
        "lines": [
          [
            "久留美",
            "康子，还要多久啊，我想挠一下鼻子……"
          ]
        ]
      },
      {
        "action": "康子将速写板平平搁在膝头，单手搭在画纸边缘，抬起眼眸没好气地看向对面的久留美。",
        "lines": [
          [
            "康子",
            "行了行了，本来也没指望你能定住超过三分钟。"
          ]
        ]
      },
      {
        "action": "久留美立刻垮下肩膀揉揉鼻梁，凑过脑袋去看康子画纸上的线条轮廓。",
        "lines": [
          [
            "久留美",
            "哇，其实画得挺好看嘛！"
          ],
          [
            "康子",
            "只是线条概括得好，少自作多情。"
          ]
        ]
      }
    ]
  },
  "daily-life-blackboard-cat": {
    "id": "daily-life-blackboard-cat",
    "order": 34,
    "title": "空教室的角落留白",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美两手握着长板擦，把黑板中央密密麻麻的板书擦出一大片干净的深色。",
        "lines": [
          [
            "久留美",
            "终于擦完大半了，今天老师写得真满。"
          ]
        ]
      },
      {
        "action": "板擦挪到右下角时，久留美看到粉笔盒旁画着一只火柴棍大小的歪头简笔小猫。",
        "lines": [
          [
            "久留美",
            "咦，这谁偷偷画的小猫啊。"
          ]
        ]
      },
      {
        "action": "久留美举着板擦悬在小猫头顶上方几厘米处，犹豫了一下没按下去。",
        "lines": [
          [
            "久留美",
            "胡子画得这么歪，擦掉好像有点可惜。"
          ]
        ]
      },
      {
        "action": "擦得一干二净的黑板右下角端正保留着那只粉笔小猫，板擦已归位在粉笔槽内，久留美站在黑板前轻轻拍打着沾灰的双掌。",
        "lines": [
          [
            "久留美",
            "留你在这里值班到下一节课吧。"
          ]
        ]
      }
    ]
  },
  "daily-life-desk-shadow-play": {
    "id": "daily-life-desk-shadow-play",
    "order": 35,
    "title": "台灯前的手影游戏",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美合上摊开的讲义，伸手在台灯光束前比出交错的手势，墙上映出一团影子。",
        "lines": [
          [
            "久留美",
            "小学的飞鸟手势……应该是这样交叉来着？"
          ]
        ]
      },
      {
        "action": "墙上的影子翅膀长短不一，两只手掌晃了晃，看起来像一只扑腾的胖鸽子。",
        "lines": [
          [
            "久留美",
            "怎么看都像吃太饱飞不动的鸽子啊。"
          ]
        ]
      },
      {
        "action": "久留美试图翘起小拇指修饰出鸟尾巴，结果手指骨节一别扭，影子直接散架变成一团乱影。",
        "lines": [
          [
            "久留美",
            "痛痛痛，手指根本掰不到那个角度！"
          ]
        ]
      },
      {
        "action": "久留美放下酸软的手腕甩了甩，看着墙上只剩自己脑袋的圆影子吐了吐舌头。",
        "lines": [
          [
            "久留美",
            "算了，我果然没有当皮影戏大师的天赋。"
          ]
        ]
      }
    ]
  },
  "daily-life-rehearsal-beat": {
    "id": "daily-life-rehearsal-beat",
    "order": 36,
    "title": "排练室外的轻快节拍",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "走廊侧墙前，久留美抱着单肩包停步，侧耳听着门缝里漏出的敲击声。",
        "lines": [
          [
            "久留美",
            "里面是在练习换节奏吗，顿挫感好明显。"
          ]
        ]
      },
      {
        "action": "中景侧面镜头，久留美右脚脚跟微抬，脚尖一下一下在灰色地砖上轻点。",
        "lines": [
          [
            "久留美",
            "咚、哒、咚咚哒……意外地挺顺畅嘛。"
          ]
        ]
      },
      {
        "action": "特写久留美的脚尖悬在半空，门内声音戛然而止，她整个人愣在原地。",
        "lines": [
          [
            "久留美",
            "哎，怎么偏偏卡在重音前面停了？"
          ]
        ]
      },
      {
        "action": "久留美已走在远离排练室的走廊上迈步前行，侧脸上带着一抹浅浅的笑意。",
        "lines": [
          [
            "久留美",
            "害我的脚尖也跟着悬在半空好一会儿。"
          ]
        ]
      }
    ]
  },
  "daily-life-paper-airplane": {
    "id": "daily-life-paper-airplane",
    "order": 37,
    "title": "方桌上的平衡试飞",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "俯视方桌，久留美两手捏着一只刚折好的白纸飞机，仔细对齐两边的机翼边缘。",
        "lines": [
          [
            "久留美",
            "两边折痕好像压得不太对称呢。"
          ]
        ]
      },
      {
        "action": "平视特写，久留美单手伸出一根食指，把纸飞机中央托在指尖上微微摇晃。",
        "lines": [
          [
            "久留美",
            "不过只要能稳在这里，应该就没问题。"
          ]
        ]
      },
      {
        "action": "纸飞机歪向一边滑落，久留美连忙摊开手掌接住，机头碰在掌心软软瘪了一角。",
        "lines": [
          [
            "久留美",
            "稍微晃一下就直接侧翻了啊。"
          ]
        ]
      },
      {
        "action": "桌上的旧笔记本已经合拢并从书页间露出一角折纸，久留美双手托腮注视着封面。",
        "lines": [
          [
            "久留美",
            "先留着吧，等回去再找张硬点的纸试试。"
          ]
        ]
      }
    ]
  },
  "daily-life-park-guideboard": {
    "id": "daily-life-park-guideboard",
    "order": 38,
    "title": "导览图外的近在咫尺",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "friendStudy"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "萌智子"
    ],
    "dialoguePanels": [
      {
        "action": "仰视镜头，萌智子手指隔空顺着导览图上的红色虚线描画，神情专注。",
        "lines": [
          [
            "萌智子",
            "顺着这道环线穿过假山，差不多要走十分钟。"
          ]
        ]
      },
      {
        "action": "久留美站在萌智子斜后方，随意转头看向路边树丛，伸手拍了拍萌智子的手肘。",
        "lines": [
          [
            "久留美",
            "萌智子，你先看一眼左边那个矮树桩。"
          ]
        ]
      },
      {
        "action": "中景包含两人，树丛旁立着一块写着“北门直行二十米”的矮木牌，萌智子收回手望过去。",
        "lines": [
          [
            "萌智子",
            "……原来出口根本就在我们眼皮底下？"
          ]
        ]
      },
      {
        "action": "久留美背着手轻快地朝树桩方向迈步，萌智子跟在后头忍不住笑了笑。",
        "lines": [
          [
            "久留美",
            "偶尔不看地图反而找得更快呢。"
          ],
          [
            "萌智子",
            "这次算你眼尖，完全被这幅大图误导了。"
          ]
        ]
      }
    ]
  },
  "daily-life-trail-rock-paper": {
    "id": "daily-life-trail-rock-paper",
    "order": 39,
    "title": "林间岔路的一局定音",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "roommate"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "康子"
    ],
    "dialoguePanels": [
      {
        "action": "两人站在人字形路口中央，久留美指指左侧平路，康子斜视着右侧被树荫覆盖的小坡。",
        "lines": [
          [
            "久留美",
            "左边看着好走很多，右边好像有点陡。"
          ],
          [
            "康子",
            "少啰嗦，挑来挑去天都黑了，猜拳定。"
          ]
        ]
      },
      {
        "action": "双人手部特写与半身，久留美出了布，康子利落地伸出剪刀，康子眉毛微扬。",
        "lines": [
          [
            "康子",
            "剪刀。那就走右边树荫底下。"
          ]
        ]
      },
      {
        "action": "久留美低头看着自己张开的五指，鼓了鼓嘴颊看向康子。",
        "lines": [
          [
            "久留美",
            "你平时第一把明明最喜欢出石头的！"
          ],
          [
            "康子",
            "谁会把固定套路留着给你抓现行？"
          ]
        ]
      },
      {
        "action": "康子已经双手插兜踩上右边的落叶石子路，久留美快走两步跟在侧后方。",
        "lines": [
          [
            "久留美",
            "走在树荫下面果然凉快多啦！"
          ],
          [
            "康子",
            "只是顺路走这边而已，别磨蹭。"
          ]
        ]
      }
    ]
  },
  "daily-life-library-sneeze": {
    "id": "daily-life-library-sneeze",
    "order": 40,
    "title": "阅览室里的无声拉锯",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美坐在安静的阅览角桌前，微微仰起脸眨着眼，鼻尖轻微皱起。",
        "lines": [
          [
            "久留美",
            "鼻尖怎么突然觉得有点痒痒的。"
          ]
        ]
      },
      {
        "action": "久留美迅速侧身避开桌面，抬起一侧手臂将口鼻稳稳埋进弯曲的手肘内侧。",
        "lines": [
          [
            "久留美",
            "唔……要来了……"
          ]
        ]
      },
      {
        "action": "久留美仍保持手肘掩面的姿势，双眼轻轻闭起，只发出一声细微的轻响。",
        "lines": [
          [
            "久留美",
            "……啾。就这？"
          ]
        ]
      },
      {
        "action": "久留美放下手肘环顾空荡荡的四周桌椅，抬起食指轻轻蹭了蹭脸颊。",
        "lines": [
          [
            "久留美",
            "周围明明没人，这也太大惊小怪了。"
          ]
        ]
      }
    ]
  },
  "daily-life-convex-mirror": {
    "id": "daily-life-convex-mirror",
    "order": 41,
    "title": "不规则曲面哈哈镜",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美站在校园免费展廊的不规则曲面哈哈镜中央前，好奇打量镜中被横向拉宽变圆的脸庞倒影。",
        "lines": [
          [
            "久留美",
            "哇，整张脸变圆鼓鼓的。"
          ]
        ]
      },
      {
        "action": "久留美已在哈哈镜左侧曲面区域前站定，注视着镜中呈现出起伏波浪状的身体轮廓倒影。",
        "lines": [
          [
            "久留美",
            "噗，肩膀像在跳波浪舞。"
          ]
        ]
      },
      {
        "action": "久留美已在哈哈镜右侧不同的不规则曲面区域前站定，挺起胸膛打量镜中拉长且神气的倒影。",
        "lines": [
          [
            "久留美",
            "这边看着挺修长帅气的嘛！"
          ]
        ]
      },
      {
        "action": "久留美在展廊通道边缘停住脚步，侧过头回望着映出滑稽变形的曲面镜。",
        "lines": [
          [
            "久留美",
            "好玩，继续逛去！"
          ]
        ]
      }
    ]
  },
  "daily-life-gate-tongue-twister": {
    "id": "daily-life-gate-tongue-twister",
    "order": 42,
    "title": "校门前的小绕口",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "friendStudy"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "萌智子"
    ],
    "dialoguePanels": [
      {
        "action": "久留美双手背在身后站在台阶上，向身旁抱胸站立的萌智子侧过头提议。",
        "lines": [
          [
            "久留美",
            "等人好无聊，来玩青葡萄碰粉葡萄？"
          ],
          [
            "萌智子",
            "听起来毫无难度，我先来。"
          ]
        ]
      },
      {
        "action": "萌智子紫发垂肩、未戴眼镜，嘴角微微抿紧，眉头微蹙停在绕口令说急卡壳的瞬间。",
        "lines": [
          [
            "萌智子",
            "青葡萄碰粉……捧葡萄。啧，咬舌了。"
          ]
        ]
      },
      {
        "action": "久留美单手叉腰，略微昂起下巴神气张口，眼神充满自信。",
        "lines": [
          [
            "久留美",
            "看我的，这有什么难的！"
          ],
          [
            "久留美",
            "青葡萄碰粉葡萄，青葡萄……粉萄！"
          ]
        ]
      },
      {
        "action": "两人在台阶上对视，萌智子嘴角微扬，久留美轻咳一声别开视线。",
        "lines": [
          [
            "萌智子",
            "彼此彼此，大家都没好到哪去嘛。"
          ],
          [
            "久留美",
            "刚才那下只是嘴唇没跟上节奏！"
          ]
        ]
      }
    ]
  },
  "daily-life-paper-cup-tower": {
    "id": "daily-life-paper-cup-tower",
    "order": 43,
    "title": "休息区的纸杯塔",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "roommate"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "康子"
    ],
    "dialoguePanels": [
      {
        "action": "桌面上五只纸杯均呈倒扣状态，底层三只杯子整齐排开，第二层两只纸杯杯沿各自平稳架在下层杯底之间且最后一只已被久留美放稳，康子手中拿着第六只纸杯准备叠上顶层。",
        "lines": [
          [
            "久留美",
            "二层稳了，现在就差最顶上那只。"
          ],
          [
            "康子",
            "手别抖，看准中间的缝隙放。"
          ]
        ]
      },
      {
        "action": "康子伸出两根手指轻轻捏着最上面一只纸杯的杯沿，屏住呼吸慢慢下放。",
        "lines": [
          [
            "康子",
            "别出声……我要松手了。"
          ]
        ]
      },
      {
        "action": "纸杯塔完美成型立在桌面上，久留美和康子同时收回双手僵在半空，眼睛一眨不眨。",
        "lines": [
          [
            "久留美",
            "……成了？"
          ],
          [
            "康子",
            "别大声，气流会把它吹歪的。"
          ]
        ]
      },
      {
        "action": "两人保持着身体前倾不敢乱动的姿势互相对视，眼角都带着克制的小得意。",
        "lines": [
          [
            "久留美",
            "我连气都不敢喘，真的好稳！"
          ],
          [
            "康子",
            "哼，我们配合起来还真挺厉害的。"
          ]
        ]
      }
    ]
  },
  "daily-life-low-horizontal-bar": {
    "id": "daily-life-low-horizontal-bar",
    "order": 44,
    "title": "操场边的低单杠",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "挎包已妥善放在单杠旁平整的地面上，久留美双手正稳稳搭在齐腰高的低单杠横杆上。",
        "lines": [
          [
            "久留美",
            "高度刚好到腰，试着撑一下看看。"
          ]
        ]
      },
      {
        "action": "久留美双臂发力向下推杠，双脚脚尖顺势离开地面几公分，身体平稳悬起。",
        "lines": [
          [
            "久留美",
            "唔……两只手感觉还挺沉的！"
          ]
        ]
      },
      {
        "action": "侧面视角，久留美直臂支撑在单杠上，双脚悬在草坪上方仅仅十厘米，微微晃动了一下。",
        "lines": [
          [
            "久留美",
            "三秒、四秒……其实一点也不难嘛。"
          ]
        ]
      },
      {
        "action": "久留美双脚已稳稳立于平坦草坪上，低头轻轻揉着掌心，神情放松。",
        "lines": [
          [
            "久留美",
            "落地很稳。偶尔活动一下也挺好的。"
          ]
        ]
      }
    ]
  },
  "daily-life-pond-toy-sailboat": {
    "id": "daily-life-pond-toy-sailboat",
    "order": 45,
    "title": "水池边的漂流帆",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美慢步走过水池边，目光被水面上漂浮的一只蓝色小玩具塑料帆船吸引。",
        "lines": [
          [
            "久留美",
            "谁落在这儿的小帆船，晃晃悠悠的。"
          ]
        ]
      },
      {
        "action": "一阵微风拂过水面泛起涟漪，小帆船的白色塑料帆晃动着朝岸边缓缓漂来。",
        "lines": [
          [
            "久留美",
            "顺着水纹漂过来了……会碰壁吗？"
          ]
        ]
      },
      {
        "action": "久留美蹲在石阶边缘，双手悬空在水面上方轻轻煽动掌风，试着让帆船借力滑开。",
        "lines": [
          [
            "久留美",
            "往旁边偏一点，那边水面更宽。"
          ]
        ]
      },
      {
        "action": "玩具小帆船已在池塘中央随微风平稳顺流漂行，久留美安稳立于池边平坦地面，静静目送小船远去。",
        "lines": [
          [
            "久留美",
            "滑过去了。这趟漂流还挺顺利的嘛。"
          ]
        ]
      }
    ]
  },
  "daily-life-thread-needle": {
    "id": "daily-life-thread-needle",
    "order": 46,
    "title": "桌前穿针线",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美坐在木桌前，两手分别捏着细缝衣针与捻尖的棉线头，微微眯眼对准针孔。",
        "lines": [
          [
            "久留美",
            "线头别散，就差一点点……"
          ]
        ]
      },
      {
        "action": "棉线端头刚刚穿过针孔冒出一小截，久留美双手僵在半空一动不动，眼睛瞪圆。",
        "lines": []
      },
      {
        "action": "久留美屏着气极其小心地捏住探出针孔的线头，嘴角微微翘起。",
        "lines": [
          [
            "久留美",
            "成了，可千万别滑脱啊。"
          ]
        ]
      },
      {
        "action": "久留美将穿好的针线平放在桌面上，整个人松弛地靠在椅背上。",
        "lines": [
          [
            "久留美",
            "呼，刚才连眨眼都忘了。"
          ]
        ]
      }
    ]
  },
  "daily-life-cold-joke-walk": {
    "id": "daily-life-cold-joke-walk",
    "order": 47,
    "title": "步道小冷话",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "friendStudy"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "萌智子"
    ],
    "dialoguePanels": [
      {
        "action": "久留美与萌智子在步道上并肩走着，久留美突然放慢脚步侧头看向身边的萌智子。",
        "lines": [
          [
            "久留美",
            "萌智子，考你一个，树叶什么时候最困？"
          ]
        ]
      },
      {
        "action": "萌智子紫发垂肩、未戴眼镜，双手插在外套口袋里转过脸平静回望。",
        "lines": [
          [
            "萌智子",
            "秋天落下来的时候？"
          ]
        ]
      },
      {
        "action": "久留美停住脚步，竖起食指神气地晃了晃，嘴角得意扬起。",
        "lines": [
          [
            "久留美",
            "是风一吹就沙沙响的时候，像在打呼噜！"
          ]
        ]
      },
      {
        "action": "萌智子站在步道旁看着久留美，嘴角泛起一丝极淡的微弱笑意。",
        "lines": [
          [
            "萌智子",
            "……这比树林里的风还要凉一点。"
          ],
          [
            "久留美",
            "嘿嘿，只要你接话就算我赢！"
          ]
        ]
      }
    ]
  },
  "daily-life-bulletin-lost-found": {
    "id": "daily-life-bulletin-lost-found",
    "order": 48,
    "title": "手绘寻物图",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [
        "roommate"
      ],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美",
      "康子"
    ],
    "dialoguePanels": [
      {
        "action": "两人并立在告示栏前，久留美微微倾身指着手绘启事上一团歪扭的椭圆图案。",
        "lines": [
          [
            "久留美",
            "康子你看，这画的到底是什么挂件？"
          ]
        ]
      },
      {
        "action": "头戴兔饰的康子抱臂立于一旁，蹙眉盯着纸面上两个多出来的圈圈。",
        "lines": [
          [
            "康子",
            "怎么看都像压扁了的收纳小袋吧。"
          ]
        ]
      },
      {
        "action": "久留美凑近告示栏看清图样角落里极其纤细的铅笔小字，嘴唇微张。",
        "lines": [
          [
            "久留美",
            "等等，底下写着……‘自制针织水杯套’？"
          ]
        ]
      },
      {
        "action": "康子别过脸看向走廊另一头，神色中透着一丝无可奈何。",
        "lines": [
          [
            "康子",
            "……那画成两只耳朵也太难辨认了。"
          ],
          [
            "久留美",
            "不过看习惯了还挺可爱的！"
          ]
        ]
      }
    ]
  },
  "daily-life-finger-snap-bench": {
    "id": "daily-life-finger-snap-bench",
    "order": 49,
    "title": "长椅试响指",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美独自坐在木长椅一端，右手拇指与中指用力贴合蓄势。",
        "lines": [
          [
            "久留美",
            "平时别人好像都是这么打的……"
          ]
        ]
      },
      {
        "action": "久留美指尖滑擦而过，只发出极轻微的沙沙摩擦声，手停在半空。",
        "lines": [
          [
            "久留美",
            "诶，完全没发出脆响？"
          ]
        ]
      },
      {
        "action": "久留美调整手势让中指自然击向掌心，指缝间随之激出一声清脆的“啪”。",
        "lines": [
          [
            "久留美",
            "呀，打出来了！原来靠的是敲到掌心！"
          ]
        ]
      },
      {
        "action": "久留美收拢右手轻轻搭在膝盖上，低头看着微红的指肚，眼神满足。",
        "lines": [
          [
            "久留美",
            "掌握门道了，偶尔玩一下还挺解闷。"
          ]
        ]
      }
    ]
  },
  "daily-life-panoramic-photo": {
    "id": "daily-life-panoramic-photo",
    "order": 50,
    "title": "全景弯曲相",
    "fromDay": 31,
    "toDay": 50,
    "contexts": [
      "quiet"
    ],
    "outcomes": [
      "flat",
      "profit",
      "loss"
    ],
    "trauma": "any",
    "requires": {
      "story": [],
      "arcs": [],
      "fallback": []
    },
    "characters": [
      "久留美"
    ],
    "dialoguePanels": [
      {
        "action": "久留美双手平端已有手机立在空旷广场中央，屏幕亮着全景横向取景框。",
        "lines": [
          [
            "久留美",
            "这么宽的地方，正好试一下全景拍摄。"
          ]
        ]
      },
      {
        "action": "久留美保持平端姿势缓慢匀速向右侧转动上半身，视线紧盯屏幕辅助线。",
        "lines": [
          [
            "久留美",
            "匀速转过去……手别抖……"
          ]
        ]
      },
      {
        "action": "久留美放下手臂低头看屏幕，照片里远处笔直的阶梯被拼合成了波浪形。",
        "lines": [
          [
            "久留美",
            "噗，好好的石阶怎么全变成波浪了。"
          ]
        ]
      },
      {
        "action": "久留美单手握手机垂在身侧，抬头望着远处平直的建筑台阶，忍不住抿嘴笑。",
        "lines": [
          [
            "久留美",
            "虽然拍歪了，不过留着看也挺有趣的。"
          ]
        ]
      }
    ]
  }
});
