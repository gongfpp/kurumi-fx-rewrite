// Approved original four-panel dinner; nineteen existing stories remain unchanged.
// Eligibility uses the existing paid receipt and both character-introduction gates.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const DINNER_EXPANSION_20_ASSETS=freeze({
  "dinner-new-20": {
    "path": "./generated/dinner-stories-v3/dinner-friend-photo.webp",
    "width": 1254,
    "height": 1254,
    "sha256": "850b7f5f824ece3edcb73741a4eb60aca203722623035c0b419f30b5943189f8",
    "people": 3,
    "characters": [
      "久留美",
      "芽吹",
      "安子"
    ],
    "panels": 4,
    "panelRects": [
      [
        7,
        6,
        617,
        617
      ],
      [
        631,
        6,
        617,
        617
      ],
      [
        7,
        630,
        617,
        616
      ],
      [
        631,
        630,
        617,
        616
      ]
    ],
    "reviewed": true,
    "independentComic": true,
    "kind": "original-fan-art",
    "dialogueId": "dinner-expansion20-20261012:dinner-new-20",
    "alt": "先别动筷",
    "tier": "dinner-friends",
    "cost": 8000,
    "food": "western-izakaya-seafood-salad-pasta",
    "storyBeats": [
      "photograph-food",
      "mebuki-poses",
      "yasuko-candid-shot",
      "request-original-photo"
    ],
    "tags": [
      "dinner-story",
      "receipt-backed",
      "dinner-friends",
      "friend-photo",
      "party-3"
    ]
  }
});
export const DINNER_EXPANSION_20_STORIES=freeze({
  "dinner-new-20": {
    "title": "先别动筷",
    "characters": [
      "久留美",
      "芽吹",
      "安子"
    ],
    "people": 3,
    "dialogueId": "dinner-expansion20-20261012:dinner-new-20",
    "tier": "dinner-friends",
    "requiresMebuki": true,
    "requiresYasuko": true,
    "dialoguePanels": [
      {
        "lines": [
          [
            "久留美",
            "等一下，我先拍一张全景。"
          ]
        ]
      },
      {
        "lines": [
          [
            "芽吹",
            "前辈拍我也行呀！"
          ],
          [
            "安子",
            "你挡着后面的沙拉了。"
          ]
        ]
      },
      {
        "lines": [
          [
            "久留美",
            "那你们别动——拍好了。"
          ],
          [
            "安子",
            "喂，我都还没准备好！"
          ]
        ]
      },
      {
        "lines": [
          [
            "芽吹",
            "哈哈，安子这表情好逗！"
          ],
          [
            "安子",
            "……等下把原图传我一份。"
          ]
        ]
      }
    ],
    "lines": [
      [
        "久留美",
        "等一下，我先拍一张全景。"
      ],
      [
        "芽吹",
        "前辈拍我也行呀！"
      ],
      [
        "安子",
        "你挡着后面的沙拉了。"
      ],
      [
        "久留美",
        "那你们别动——拍好了。"
      ],
      [
        "安子",
        "喂，我都还没准备好！"
      ],
      [
        "芽吹",
        "哈哈，安子这表情好逗！"
      ],
      [
        "安子",
        "……等下把原图传我一份。"
      ]
    ]
  }
});
