// New wordless game-adaptation CGs. Existing art and original-manga identities
// remain unchanged; these illustrations do not add stories or performances.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const common={
 kind:'generated-game-art',panels:1,reviewed:true,hasEmbeddedText:false,
 width:1536,height:1024,dimensions:[1536,1024],
 presentation:{preserveWholeImage:true,objectFit:'contain',allowDialogueOverlay:false},
 review:{content:'pixel-reviewed',currentBuild:'pending',humanAcceptance:'pending'},
 consumer:{reader:'main-story',accounting:false,marketDirection:false,storyCountContribution:0,performanceCountContribution:0},
 generation:{tool:'image_gen.imagegen',model:null,modelDisclosure:'not-reported-by-tool',date:'2026-10-15'}
};
export const MAIN_STORY_ART_ASSETS=freeze({
 'two-notebooks':{
  ...common,id:'main-story-two-notebooks-v1',path:'./generated/main-story-v1/night-two-notebooks.png',
  sha256:'5d0eb26ed16e12f46eb6ee978a7ac1d39b8bd3580de7fa300acd31631aac26cc',bytes:2052435,
  characters:['久留美'],people:1,
  alt:'夜间，久留美坐在台灯旁，看着桌上并排打开的新旧两本笔记。',
  briefId:'main-story-art-01',storyDays:[1,10,25],
  source:{kind:'generated-game-art',sha256:'5d0eb26ed16e12f46eb6ee978a7ac1d39b8bd3580de7fa300acd31631aac26cc',dimensions:[1536,1024],metadataRefs:['MAIN_STORY_ART_ASSETS:two-notebooks']}
 },
 'campus-bench':{
  ...common,id:'main-story-campus-bench-v1',path:'./generated/main-story-v1/campus-bench-listening.png',
  sha256:'f567d38fd14648da5fbd4183351ff68f9e9c3cdba564275d6d71133a185e785c',bytes:2438926,
  characters:['久留美','萌智子'],people:2,
  alt:'校园长椅上，久留美欲言又止，紫发的萌智子转身听她说话，合起的笔记本放在两人之间。',
  briefId:'main-story-art-02',storyDays:[15,35],
  source:{kind:'generated-game-art',sha256:'f567d38fd14648da5fbd4183351ff68f9e9c3cdba564275d6d71133a185e785c',dimensions:[1536,1024],metadataRefs:['MAIN_STORY_ART_ASSETS:campus-bench']}
 },
 'close-review':{
  ...common,id:'main-story-close-review-v1',path:'./generated/main-story-v1/dawn-close-review.png',
  sha256:'cbaff6f5d98e6365dbf9e21e30fe0ecce11794e1dd054e518d5b51f46da667ad',bytes:2134513,
  characters:['久留美'],people:1,
  alt:'清晨，久留美合上自己的新笔记本，旧日记仍摊在桌上，另一只手离开鼠标。',
  briefId:'main-story-art-03',storyDays:[50],
  source:{kind:'generated-game-art',sha256:'cbaff6f5d98e6365dbf9e21e30fe0ecce11794e1dd054e518d5b51f46da667ad',dimensions:[1536,1024],metadataRefs:['MAIN_STORY_ART_ASSETS:close-review']}
 }
});
const byDay=new Map(Object.values(MAIN_STORY_ART_ASSETS).flatMap(art=>art.storyDays.map(day=>[day,art])));
// Pure presentation lookup: never advance days, change money or select markets.
export function mainStoryArtForDay(day){return Number.isInteger(day)?byDay.get(day)??null:null;}
