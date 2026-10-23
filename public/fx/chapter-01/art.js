// Original fan art for pre-trade scenes. These are not manga screenshots.
export const CHAPTER_ART=Object.freeze({
 preparation:Object.freeze({path:'./generated/chapter-01/preparation-original.webp',sha256:'49a4bbb2529cff70b96ff0b5d50799791e81ac4c066b91e171903c6be7a28ff1',width:1536,height:1024,alt:'成年久留美在电脑前整理账户资料与生活计划，尚未下单',caption:'入场之前，先把眼前的生活与目标摆在一起。'}),
 plan:Object.freeze({path:'./generated/chapter-01/exit-plan-original.webp',sha256:'185e0311985285229ed5db6df61ad1da365a581a6f252cfa81ae614201716c72',width:1536,height:1024,alt:'久留美看着没有方向标记的屏幕，用笔整理下单前的撤退计划',caption:'还没有成交，判断和撤退计划都握在自己手里。'})
});
export function chapterIllustration(state){return state.stage==='opening'?CHAPTER_ART.preparation:['plan','entry'].includes(state.stage)?CHAPTER_ART.plan:null;}
export function chapterOriginalPortrait(state){
 const floating=state.position?(state.price-state.position.entry)*state.position.quantity*state.position.direction:0;
 const mood=state.position?(floating<0?'nervous':'focused'):state.realized<0?'regretful':state.realized>0?'relieved':'focused';
 return {path:`./expressions/kurumi-${mood}.webp`,label:{focused:'认真判断',nervous:'持仓中的紧张',regretful:'面对已经兑现的损失',relieved:'平仓后的释然'}[mood],origin:'原创同人立绘'};
}
