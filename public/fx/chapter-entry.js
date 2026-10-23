// Navigation happens only after the current account has durably saved.
// No conversion, settlement, new balance, or mode change is performed here.
export async function enterOriginalChapter({isBusy,guard,lock,stop,save,current,navigate,report,unlock,resume}){
 if(isBusy()||!guard())return false;
 const token=current();let leaving=false;lock();stop();
 try{
  if(!await save()){report('当前进度还没保存好，请先重试保存，再进入原作首章。');return false;}
  if(current()!==token||!guard())return false;
  navigate('./chapter-01.html');leaving=true;return true;
 }catch{report('暂时没有进入章节；交易室进度仍保留，请重试。');return false;}
 finally{if(!leaving){unlock();resume();}}
}
