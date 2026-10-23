// Revisit a certified receipt without turning its past action into a new one.
// Current balances come from the latest successful save, never an unsaved click.
const money=n=>`¥${n.toLocaleString('zh-CN',{maximumFractionDigits:2})}`;
export function comicContinuity(scene,state){
 const family=scene.id?.startsWith('father-discovery-')||['father-borrow','father-found','father-repay-part','father-repaid'].includes(scene.id),loan=['loan-funded','loan-repay-part','loan-repaid'].includes(scene.id);
 if(!family&&!loan)return scene;
 const account=family?state?.family:state?.loan,remaining=account?.outstanding;
 const result={...scene.result};
 if(Number.isFinite(remaining)&&remaining>=0)result.currentOutstanding=remaining;
 const lines=scene.lines.map(line=>[...line]);
 if(scene.id==='father-borrow'){
  const amount=scene.result.amount;
  lines[0][1]='那次，我从柜子里拿走了钱。';
  lines[1][1]=Number.isFinite(amount)?`拿了${money(amount)}。`:'已经拿走了。';
  lines[2][1]=account?.discovered?'后来，爸爸发现了。':account?.informed?'这件事，已经告诉爸爸了。':'拿走的数目，已经记下了。';
  lines[3][1]=remaining===0?'现在已经还清了。':remaining>0?`还有${money(remaining)}没还。`:'那时想着，一定要还回去。';
 }
 if(scene.id==='father-repay-part')lines[3][1]=remaining===0?'后来，剩下的也还清了。':remaining>0?`现在还差${money(remaining)}。`:'那次还了一部分。';
 if(scene.id==='father-found')lines[3][1]=remaining===0?'现在已经还清了。':'那时，我答应了会还。';
 if(scene.id==='loan-funded')lines[3][1]=remaining===0?'现在已经还清了。':'借款和还款，都记着呢。';
 if(scene.id==='loan-repay-part')lines[3][1]=remaining===0?'后来，剩下的也还清了。':'那次还了一部分。';
 if(scene.id==='loan-repaid'&&remaining>0)lines[3][1]='那一笔，当时已经还清了。';
 return {...scene,lines,result};
}
