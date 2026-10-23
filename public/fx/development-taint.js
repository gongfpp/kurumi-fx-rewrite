// Debugging permanently disqualifies the same campaign, including a restored
// pre-edit backup. This marker is separate from the mutable game snapshot.
const ID=/^[a-zA-Z0-9_-]{8,80}$/;
export function taintKey(campaign){if(!ID.test(campaign||''))throw Error('本局标识无效');return 'fx-api-v1-developer-taint-'+campaign;}
export function hasDevelopmentTaint(state,storage){
 if(state?.developmentTaint||state?.developer?.edited)return true;
 const key=taintKey(state?.runId);
 if(!storage?.getItem)throw Error('无法读取开发测试标记，暂不提交成绩');
 // Even a corrupt marker fails closed. No function removes or clears it.
 return storage.getItem(key)!==null;
}
export function markDevelopmentTaint(state,storage){
 const key=taintKey(state?.runId);
 if(!storage?.setItem||!storage?.getItem)throw Error('无法保存开发测试标记，暂不能修改存档');
 if(storage.setItem(key,'1')===false)throw Error('开发测试标记未能持久保存，暂不能修改存档');
 if(storage.getItem(key)!=='1')throw Error('开发测试标记未保存，暂不能修改存档');
 state.developmentTaint=true;
 return true;
}
