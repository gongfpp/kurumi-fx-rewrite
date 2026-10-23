// A publication link is optional. Never infer a URL from an archive ID,
// headline, source name or the current page location.
export function originalPublicationUrl(event){
 if(typeof event?.sourceUrl!=='string'||!event.sourceUrl.trim())return null;
 try{
  const value=event.sourceUrl.trim();if(!/^https?:\/\//i.test(value))return null;
  const url=new URL(value);
  return ['http:','https:'].includes(url.protocol)&&!url.username&&!url.password?value:null;
 }catch{return null;}
}
// Display policy is separate from the archive's factual/publication review.
// Missing links must not remove required attribution or license information.
export function newsSourceDetails(event={}){
 if(event?.contentKind==='fictional_market_event'||event?.swan)return {url:null,attribution:'',licenseUrl:null};
 const text=value=>typeof value==='string'?value.trim():'';
 return {url:originalPublicationUrl(event),
  attribution:[text(event?.sourceAttribution),text(event?.summaryNotice)].filter(Boolean).join(' · '),
  licenseUrl:originalPublicationUrl({sourceUrl:event?.sourceLicenseUrl})};
}
export function renderArchiveSource(document,event){
 event=event??{};
 const details=document.getElementById('news-archive-details'),source=document.getElementById('news-archive-source');
 if(!details||!source)return;
 const {url,attribution,licenseUrl}=newsSourceDetails(event);
 details.hidden=!(url||attribution||licenseUrl);source.hidden=!url;
 if(url){source.href=url;source.target='_blank';source.rel='noopener noreferrer';source.textContent='原始发布';}else source.removeAttribute('href');
 let notice=document.getElementById('news-source-attribution'),license=document.getElementById('news-source-license');
 if(attribution&&!notice){notice=document.createElement('span');notice.id='news-source-attribution';details.append(notice);}
 if(notice){notice.hidden=!attribution;notice.textContent=attribution?`${url?' · ':''}${attribution}`:'';}
 if(licenseUrl&&!license){license=document.createElement('a');license.id='news-source-license';license.target='_blank';license.rel='noopener noreferrer';details.append(license);}
 if(license){license.hidden=!licenseUrl;if(licenseUrl){license.href=licenseUrl;license.textContent=`${url||attribution?' · ':''}CC BY 4.0`;}else license.removeAttribute('href');}
}
