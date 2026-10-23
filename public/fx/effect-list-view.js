// The effect list owns plain paragraphs only. Reuse their slots across paints;
// read the current DOM so restored or moved frontend nodes need no cache reset.
export function renderEffectList(root,effects,definitions){
 const rows=[...root.children];
 for(const [index,effect] of effects.entries()){
  const def=definitions[effect.id]||{name:effect.id,copy:''};
  const text=`${def.name}${effect.remaining===null?'':` · 剩 ${effect.remaining} 段`}：${def.copy}`;
  let row=rows[index];
  if(!row){row=root.ownerDocument.createElement('p');root.append(row);}
  if(row.textContent!==text)row.textContent=text;
 }
 for(const row of rows.slice(effects.length))row.remove();
}
