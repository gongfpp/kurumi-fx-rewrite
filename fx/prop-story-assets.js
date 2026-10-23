// Exact independent four-panel artwork approved after pixel review.
export const PROP_STORY_ASSETS=Object.freeze({
  "prop-daily-drink-first-use": {
    "path": "./generated/prop-scenes-v1/prop-daily-drink-first-use.webp",
    "width": 1086,
    "height": 1448,
    "sha256": "33a4400a884f9c9e67e06fc3cbddad4d8a98d04d9c0befa13a9950169051c303",
    "panels": 4,
    "panelRects": [
      [
        10,
        8,
        524,
        700
      ],
      [
        552,
        8,
        524,
        700
      ],
      [
        10,
        725,
        524,
        713
      ],
      [
        552,
        725,
        524,
        713
      ]
    ],
    "dialogueId": "prop-daily-drink-first-use",
    "people": 1,
    "characters": [
      "久留美"
    ],
    "reviewed": true,
    "independentComic": true,
    "kind": "original-fan-art",
    "alt": "瓶盖与水珠"
  }
});

export const PROP_STORY_REVIEWS=Object.freeze(Object.fromEntries(Object.values(PROP_STORY_ASSETS).map(asset=>[asset.path,{
 primaryUse:'story-dialogue',character:asset.characters.join('与'),characters:[...asset.characters],
 emotion:'多阶段剧情',intensity:null,events:[],directions:[],hasEmbeddedText:false,textOriginal:null,
 faceClarity:'scene-scale',textClarity:'no-text',status:'verified',identityStatus:'verified',identityDescription:asset.characters.join('与'),exclusions:['story-only','not-live-trading-expression'],
}])));
