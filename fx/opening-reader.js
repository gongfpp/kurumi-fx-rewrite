import {OPENING_PAGES,openingPanel,createOpeningSession} from './opening-story.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {setMangaImage} from './manga-images.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {setImage} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {openingCompanionArt} from './opening-anime-stills.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

export function mountOpeningReader({root=document,frame,getState,guard,save,onFinish,openSource,startingCapital=100000,targetProfit=20000000}){
  const $=id=>root.getElementById(id),dialog=$('opening-dialog'),footer=$('opening-nav');
  let sourcePage=OPENING_PAGES[0],saveRevision=0;
  const money=value=>'¥'+value.toLocaleString('zh-CN',{maximumFractionDigits:0});
  function render({index,page,replay}){
    sourcePage=page;dialog.dataset.page=page.id;
    $('opening-count').textContent=`序章 · ${String(index+1).padStart(2,'0')} / ${String(OPENING_PAGES.length).padStart(2,'0')}`;
    $('opening-title').textContent=page.title;$('opening-copy').textContent=page.text;
    $('opening-back').disabled=index===0;
    $('opening-skip').textContent=replay?'结束重看':'跳过序章';
    $('opening-skip').setAttribute('aria-label',replay?'结束重看，返回当前交易':'跳过序章，进入交易室');
    $('opening-next-label').textContent=index===OPENING_PAGES.length-1&&replay?'回到交易室 →':page.next;
    $('opening-next-hint').textContent=index===OPENING_PAGES.length-1?(replay?'返回':'开始'):'下一页';
    $('opening-next').setAttribute('aria-label',index===OPENING_PAGES.length-1?(replay?'结束重看，回到交易室':'读完序章，进入交易室'):`下一页：${OPENING_PAGES[index+1].title}`);
    $('opening-save').textContent=replay?'重看中':'正在保存阅读进度…';
    frame.replaceChildren();
    const panel=openingPanel(page);
    if(panel){
      const figure=root.createElement('figure');figure.className='opening-panel';
      const img=root.createElement('img');img.alt=page.alt;img.width=panel.imageSize[0];img.height=panel.imageSize[1];
      setMangaImage(img,panel.original,{loading:'eager'});figure.append(img);frame.append(figure);
      const companion=openingCompanionArt(page);
      if(companion){
        const extra=root.createElement('figure');extra.className='opening-panel opening-companion';
        const art=root.createElement('img');art.alt=companion.alt;art.width=companion.imageSize[0];art.height=companion.imageSize[1];art.loading='eager';art.decoding='async';
        // Optional source view never registers a manga unlock or blocks reading.
        setImage(art,companion.original,{onStatus:status=>{extra.hidden=status==='unavailable';}});extra.append(art);frame.append(extra);
      }
    }else{
      const sheet=root.createElement('section');sheet.className='opening-terminal-sheet';sheet.setAttribute('aria-label','本局的起点');
      const caption=root.createElement('span');caption.className='opening-terminal-kicker';caption.textContent='FX / USD・JPY';
      const label=root.createElement('p');label.textContent='这一局的开局资金';
      const amount=root.createElement('strong');amount.textContent=money(Number.isFinite(getState().startEquity)?getState().startEquity:startingCapital);
      const unit=root.createElement('small');unit.textContent='日元';
      const goal=root.createElement('p');goal.className='opening-goal';goal.textContent='赚回 '+money(targetProfit)+' 的愿望，仍在前面。';
      const prompt=root.createElement('p');prompt.className='opening-prompt';prompt.textContent=replay?'回到交易室，继续你的这一局。':'先看行情，或者试着下第一单。接下来，由你决定。';
      sheet.append(caption,label,amount,unit,goal,prompt);frame.append(sheet);
    }
    const scroller=dialog.querySelector('.dialog-scroll');if(scroller)scroller.scrollTop=0;
  }
  const session=createOpeningSession({getState,guard,save,onPage:render,onFinish:result=>{saveRevision++;dialog.close();onFinish(result);}});
  function watch(result){
    if(!result)return;
    const revision=++saveRevision;
    result.saved.then(saved=>{
      if(revision!==saveRevision||!dialog.open)return;
      $('opening-save').textContent=result.replay?'重看中':saved?'阅读进度已保存':'阅读进度未能保存，请勿刷新';
    }).catch(()=>{if(revision===saveRevision&&dialog.open)$('opening-save').textContent='阅读进度未能保存，请勿刷新';});
  }
  function move(delta,event){if(event?.detail>1||event?.repeat)return;watch(session.move(delta));}
  $('opening-back').onclick=event=>move(-1,event);
  $('opening-next').onclick=event=>move(1,event);
  $('opening-skip').onclick=()=>session.skip();
  dialog.addEventListener('cancel',event=>{event.preventDefault();session.skip();});
  dialog.addEventListener('close',()=>{saveRevision++;session.dismiss();});
  dialog.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();move(event.key==='ArrowLeft'?-1:1,event);
  });
  return {
    open(options={}){
      // enhanceDialogs owns the scroll shell. Keep only this reader's navigation
      // outside that scroller so long panels never hide next/back/skip controls.
      if(footer.parentElement!==dialog)dialog.append(footer);
      const result=session.open(options);if(!result)return;
      if(!dialog.open)dialog.showModal();
      $('opening-next').focus({preventScroll:true});watch(result);
    }
  };
}
