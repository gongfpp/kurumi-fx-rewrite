# 原站功能 / 布局 对照审计（v1.1.0 → 目标全量复刻）

对照来源：`gongfpp/kurumi-fx-pages` 的 `index.html`（原站单页）与其 28 个 `<dialog>`。
状态：✅ 已有　⚠️ 部分　❌ 缺失。

## 1. 顶部 / 全局
| 功能 | 原站 | 现状 |
| --- | --- | --- |
| 模式选择（剧情/操盘·无限） | `mode-dialog` · 剧情模式▾ | ❌ 只有剧情 |
| 行情源（模拟盘/历史真实/实时真实） | `data-market*` | ❌ |
| 像素前端切换（原版/像素双皮肤） | `data-frontend` · 像素版 | ❌ 仅主题色 |
| 背景音乐 | `bgm-dialog`/`bgm-panel` · ♪ | ⚠️ 有设置面板 |
| 音效开关 | ♪ 音效关 | ✅ |
| 原声目录 | `voice-library-dialog` | ✅（无状态/重播细节） |
| 匿名统计 / 隐私说明 | `privacy-dialog` | ❌ |
| 玩法帮助 | `help-dialog` · ? | ✅ |
| 名人堂 | `leaderboard-dialog` | ⚠️ 缺投稿/公开昵称/重试上榜 |
| 成就 | `achievements-dialog` | ✅ |
| 开发者模式 | `developer-dialog`·密码验证 | ❌ UI |
| 存档：下载/恢复/冲突 | `save-restore-dialog`/`save-conflict-dialog` | ⚠️ 仅自动存 |
| 重开确认 | `restart-dialog` | ❌ 直接重开 |

## 2. 交易终端
| 功能 | 原站 | 现状 |
| --- | --- | --- |
| K 线周期切换（日K/15分/5分/1分） | `data-candle-period` | ❌ 固定 |
| 均线 MA5/10/20 | MA5/MA10/MA20 按钮 | ❌ |
| 报价倍速 1/2/4× | `data-speed` | ❌ |
| 交易K线 + 单位说明 | aria “日元/美元” | ✅ |
| 快讯 / 新闻 | 快讯条 + 记录 | ⚠️ 有，缺“投资者短评/玩家留言 + 短评出处” |
| 投资者短评/玩家留言 | `comment-credits-dialog` | ❌ |
| 风险警示 | `risk-alerts` | ❌ |

## 3. 下单 / 账户
| 功能 | 原站 | 现状 |
| --- | --- | --- |
| 做多/做空 | ✅ | ✅ |
| 杠杆 5/10/25/50×·原作档/100×·原作档 | `data-leverage` | ⚠️ 缺“原作档”标注 |
| 仓位比例 10/25/50/全仓 | `data-stake` | ❌ |
| 金额预设 ¥1,000/5,000/10,000/50,000/100,000 | `data-amount-preset` | ❌ |
| 🎲 随机会金额 | `amount-random` | ❌ |
| 止损 10/30/50/不设 | `data-stop-pips` | ✅ |
| 保证金率与强平说明 | “了解保证金率与强平” | ⚠️ 有强平价，缺说明弹层 |
| 追加保证金 | `margin-dialog` | ❌ |
| 全部减半 / 全部平仓 / 一键平仓 | ✅ | ⚠️ 缺“全部减半/一键平仓”语义 |
| 提交成交反馈 | `trade-toast` | ❌ 仅日志 |

## 4. 心理 / 情绪
| 功能 | 原站 | 现状 |
| --- | --- | --- |
| 心理承受力条 + 数值 | `sanity-fill`/`sanity-text` | ✅ |
| 上头压力面板 + 连点突破 | `emotion-pressure-panel/meter/status` | ❌ 仅 domain |
| 情绪杠杆限制说明 | `emotion-order-rule` | ⚠️ 文本提示 |
| 体力与情绪 | ✅ | ✅ |
| 精力阶段（提神/疲劳） | `energy-stage-hint` | ❌ |

## 5. 生活 / 经济
| 功能 | 原站 | 现状 |
| --- | --- | --- |
| 住房选择（搬家） | `life-housing-dialog` | ⚠️ 并入生活弹窗 |
| 生活菜单 / 工作 / 放松 / 朋友 | ✅ | ✅ |
| 道具购买动画 | `prop-dialog` | ⚠️ 直接使用 |
| 贷款（借入/归还金额档） | `loan-dialog` | ⚠️ 有档位，缺“借入可借上限/归还填写金额” |
| 父亲的柜中存款（取用金额档） | `father-take-dialog` | ⚠️ 有档位，缺“关上柜门/那把抽屉钥匙”分镜 |
| 归还 | `repay-dialog` | ⚠️ 并入 |
| 彩票 | `lottery-dialog` | ✅ |

## 6. 剧情 / 漫画 / 内容
| 功能 | 原站 | 现状 |
| --- | --- | --- |
| 序章（翻页/跳过） | `opening-dialog` | ⚠️ 列表式，无翻页/跳过 |
| 每日剧情选择 | `story-dialog`/`day-story-*` | ⚠️ 内联，非独立弹窗 |
| 每日小剧场 / 四格 | `day-result-manga`/`day-contextual-manga` | ✅ |
| 人物篇章阅读器（上/下一页/位置） | `character-story-dialog` | ❌ |
| 原创剧情库 | `original-story-library-dialog` | ❌ |
| 原作漫画查看 | `settings-original-manga` | ❌ |
| 结局（漫画/结果/摘要） | `ending-dialog` | ⚠️ 面板，缺结果摘要项 |
| 收手离场（收手并上榜/继续本局） | `walkaway-dialog` | ❌ 直接离场 |
| 破产/危机（救援/销户） | `bankrupt-dialog` | ❌ |
| 战报分享（原版/像素，下载/系统分享） | `share-dialog` | ⚠️ 仅导出 JSON |
| 日结复盘（收益/账单/四格/分享/收据） | `day-dialog`/`daily-recap` | ⚠️ 简化 |
| 详情说明 | `detail-dialog` | ✅ |

## 结论
原站约 28 个对话框 + 大量终端控件。当前实现覆盖核心玩法与主要弹窗，但**明确缺失**：
模式选择、行情源、像素前端、投资者短评、风险警示、成交反馈、追加保证金、破产救援、销户确认、分享卡、人物篇章/原创剧情库/原作漫画阅读、存档备份与恢复、开发者 UI、隐私/匿名统计、K线周期与均线、倍速、仓位比例/金额预设/随机、全部减半、上头连点交互、精力阶段提示、序章翻页。

后续按此清单逐项补齐。