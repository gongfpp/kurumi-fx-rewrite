// Failure text is based on observed operations; never infer private browsing,
// device space or corruption from a generic storage exception.
export function saveWarning(session,fallback) {
  if(session.blocked)return '检测到存档变化。本页已暂停，请先处理存档。';
  if(session.reason==='coordination'&&session.failure?.kind==='timeout')return '保存等待超时，原存档未被覆盖。本页进度仍保留，可重试保存或下载备份，请勿刷新或关闭。';
  if(session.reason==='coordination')return '浏览器暂不支持安全的跨页保存。本页仍可游玩，请勿刷新或关闭；可下载本页进度备份。';
  if(session.reason==='encoding')return '本页进度暂时无法打包保存，原存档未被覆盖。请先下载本页进度备份，勿刷新或关闭；之后可重试保存。';
  const detail=session.failure;
  const cause=detail?.kind==='quota'?'浏览器报告存储额度不足，进度未保存。':detail?.kind==='access'?'浏览器拒绝访问存档，进度未保存。':detail?.operation==='read'?'暂时无法读取原存档，本页没有覆盖它。':session.reason==='migration-backup'?'升级前的原存档备份未能保存，本页没有覆盖它。':null;
  return cause?cause+'请先下载本页进度备份，勿刷新或关闭；之后可重试保存。':fallback;
}
