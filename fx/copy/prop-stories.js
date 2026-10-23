// Gemini-authored original game dialogue, preserved verbatim from the reviewed source.
// Scene gating remains in the existing receipt adapter, never in this text.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const PROP_STORIES=freeze({
  "prop-daily-drink-first-use": {
    "title": "瓶盖与水珠",
    "characters": [
      "久留美"
    ],
    "people": 1,
    "dialogueId": "prop-daily-drink-first-use",
    "dialoguePanels": [
      {
        "lines": [
          [
            "久留美",
            "这瓶饮料包装看着真简单。"
          ]
        ]
      },
      {
        "lines": [
          [
            "久留美",
            "水珠太多，一下没拧开。"
          ]
        ]
      },
      {
        "lines": [
          [
            "久留美",
            "垫着纸巾果然就扭开了。"
          ]
        ]
      },
      {
        "lines": [
          [
            "久留美",
            "好啦，总算顺利喝到了。"
          ]
        ]
      }
    ],
    "lines": [
      [
        "久留美",
        "这瓶饮料包装看着真简单。"
      ],
      [
        "久留美",
        "水珠太多，一下没拧开。"
      ],
      [
        "久留美",
        "垫着纸巾果然就扭开了。"
      ],
      [
        "久留美",
        "好啦，总算顺利喝到了。"
      ]
    ]
  }
});
