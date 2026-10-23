import {LIFE_FRIEND_DIALOGUE_SCENES} from './life-friend-dialogues.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Four independently reviewed sheets bound to the original receipt sources.
// Rectangles follow the actual sheet gutters; text remains outside the image.
const assets={
 'life-friend-mochiko-01':{sha256:'079659a0922ae992be3d9d737787f88b7ca524e8453a62dffaae8b1c431ed085',gitBlob:'7e3937d53451fed3ff257e8196085c3ff58641b6',panelRects:[[0,0,535,664],[550,0,536,664],[0,678,535,770],[550,678,536,770]]},
 'life-friend-mochiko-02':{sha256:'31a902c4736370792e8847869ec3315ef21162ed971352b0ef05116928195e96',gitBlob:'a3c524af26f39aedce151ae4576ed4a86920b202',panelRects:[[0,0,531,716],[551,0,535,716],[0,733,531,715],[551,733,535,715]]},
 'life-friend-yasuko-01':{sha256:'b5a6f99cf1a68704a4d8243c0cd53f85e86a5d5b83e9224f8a9b00d24e4d9eec',gitBlob:'491b733ca467aeee239f9179ee34e33c0ecc1d16',panelRects:[[0,0,537,719],[550,0,536,719],[0,730,537,718],[550,730,536,718]]},
 'life-friend-yasuko-02':{sha256:'1286026f4f5b5822451419f19e7e2dc9d6aa79c5e90c9b939f2f216982bc019c',gitBlob:'10be8f685a84ca675a4e0c6faf8d8d15042d0a02',panelRects:[[0,0,535,714],[550,0,536,714],[0,732,535,716],[550,732,536,716]]}
};
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const LIFE_FRIEND_SCENES=freeze(LIFE_FRIEND_DIALOGUE_SCENES.map(scene=>({
 id:scene.id,dialogueId:scene.dialogueId,receiptDialogueSourceId:scene.dialogueId,semanticReadKey:`life-scene:${scene.id}`,
 category:'friend',optionId:scene.optionId,order:scene.order,approved:true,title:scene.title,
 characters:['久留美',scene.optionId==='mochiko'?'萌智子':'安子'],people:2,
 fromDay:scene.fromDay,toDay:scene.toDay,outcomes:scene.outcomes,trauma:scene.trauma,dialoguePanels:scene.panels,
 art:{...assets[scene.id],reviewed:true,independentComic:true,panels:4,people:2,dialogueId:scene.dialogueId,
  path:`./generated/life-friends-v1/${scene.id}.png`,width:1086,height:1448,kind:'generated-game-art',hasEmbeddedText:false,
  sourceCommit:'c870c01b24c6937af0c25c7a93598e203bac3f89'}
})));
