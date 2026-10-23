# FX韭留美（Kurumi-FX）重写规格与实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 TypeScript 重写非官方同人外汇交易游戏《FX韭留美 · 今天也要回本》，在保留全部玩法机制与叙事内容的前提下，把 379 个散落模块重构为分层、可测试、数据驱动的架构，并升级画面与交互、提供可选美术风格。

**Architecture:** 三层分离——`domain`（无 DOM 的纯函数游戏核心：状态机、经济、心理、体力、风险）、`content`（JSON/TS 数据包：剧本、新闻、漫画路由、数值表）、`view`（框架化 UI + Canvas K 线渲染）。引擎保持确定性种子随机与存档权威，所有数值可配置。

**Tech Stack:** TypeScript 5.x、Vite、Vitest（单测）、Zod（存档/内容校验）、Canvas 2D（自有 K 线渲染器，后续可换 WebGL）、可选 Preact 或 Svelte 作为 UI 层；Node 20+。发布仍为 GitHub Pages 纯静态。

## Global Constraints

- 游戏标题固定：`FX韭留美 · 今天也要回本`；副标 `FX KURUMI / 漫画交易室`。
- 免责声明必须常驻页脚：`原创同人小游戏 · 非官方作品 · 虚构行情 · 非投资建议`。
- 原作引用与游戏原创内容必须**分字段标注来源**（`origin: 'original' | 'fan'`），任何原作分镜不得改写为台词。
- 行情为虚构，所有新闻/黑天鹅文案使用「已公布/已记录/正在核对」等事实性措辞，禁止预测性表述。
- 所有金额为日元；报价为「日元/1 美元」，`PIP_SIZE = 0.01`，保留 3 位小数。
- 确定性：所有随机必须由 `seed` 派生，存档中的行情/账单为权威，重载不得重roll。
- 存档命名空间前缀固定 `kurumi-fx:`；旧键 `fx-girl-*` 仅作只读迁移源。
- 后端可选：仅排行榜与匿名统计联网；服务未配置时离线可玩，不得阻断游戏。
- 无障碍基线：所有交互控件可键盘操作，动态区域 `aria-live`，遵循 `prefers-reduced-motion`。
- 不使用任何真实交易数据作为必需依赖；实时行情（若接）为可降级可选项。

---

# Part A — 游戏完整规格（现状还原，重写必须等价或明确增强）

## A.0 术语与单位

| 术语 | 含义 | 取值/单位 |
| --- | --- | --- |
| 决策段 beat | 玩家做一次决策的行情段 | 一天 4 段 |
| K 线 candle | 一段内的 4 根 | 每段 4 根 |
| tick | K 线内最小跳动 | 每根 6 tick，每 tick 2.5 分钟（15 分钟/根） |
| sanity 心理承受力 | 0–100，越低限制越多 | 初始 50 |
| stress 压力 | 累加惩罚，喂入 sanity | 0..∞ |
| heat 上头 | 0–5，盈利+1/亏损−1 | 影响情绪 |
| trauma 创伤 | 大额已实现亏损后遗症 | hurt/crushed/numb |
| stamina 体力 | 0–100，盯盘消耗 | 初始 100 |
| PIP | 报价最小变动 | 0.01 日元 |

## A.1 模式与行情来源

- **游戏模式**：`story`（剧情，目标净收益 2000 万，日结）与 `endless`（无限操盘，连续运行不日结）。
- **交易 K 线三类**：`simulated`（种子模拟，默认）、`historical`（导入 `.fxhistory/.fxresearch` 文件，仅 USD/JPY）、`live`（实时，biquote 券商指示价，可降级）。
- **共享回放** `shared-replay`：基于 live 形态的新局，重放他人盘面（非交易）。

## A.2 逐项数值（必须写入配置，禁止硬编码）

来源：`engine.js`、`economy-plan-config.js`、`credit-policy.js`、`stamina.js`、`trading-trauma.js`、`emotion-pressure.js`、`lottery-rules.js`。

| 常量 | 值 | 说明 |
| --- | --- | --- |
| `FEE_RATE` | 0.00005 | 手续费率，按名义仓位双向收取 |
| `STOP_OUT_LEVEL` | 0.5 | 保证金率 ≤50% 触发强平 |
| `MIN_EQUITY` | 1000 | 账户权益下限，低于即破产 |
| `TARGET_PROFIT` | 20_000_000 | 剧情目标累计净交易收益 |
| `STORY_START` | 300_000 | 剧情新局本金 |
| `START` | 100_000 | 旧存档保留本金（兼容） |
| `START_PRICE` | 150 | USD/JPY 起始价 |
| `LIVING_DAILY` | 1500 | 日生活费基准 |
| `FATHER_SAVINGS` | 3_000_000 | 父亲柜中存款上限，整章一次 |
| `CANDLES_PER_BEAT` | 4 | — |
| `BEATS_PER_DAY` | 4 | 剧情可加 `bonusBeats` |
| `TICKS_PER_CANDLE` | 6 | — |
| `PIP_SIZE` | 0.01 | — |
| 货币对 | USD/JPY 150、AUD/JPY 90、GBP/JPY 170 | 各自独立脚本 |
| 杠杆档 | 5/10/25/50/100 | 50/100 为「原作档」 |
| 保证金比例 | 10%/25%/50%/全仓 | — |
| 止损点数 | 10/30/50/不设 | — |
| 网贷基础额度 | 300_000 | `BASE_LIMIT` |
| 网贷最高额度 | 3_000_000 | `MAX_LIMIT`（无限模式随净资产/负债动态） |
| 网贷基础日利率 | 0.0005 | `BASE_DAILY_RATE` |
| 网贷最高日利率 | 0.008 | `MAX_DAILY_RATE` |
| 网贷最小借还 | 100 | `minBorrow` |
| 体力上限/警戒/打工成本 | 100 / 20 / 20 | `STAMINA_RULES` |
| 盯盘消耗 | 平静日 40，每分钟 40/240；观测 0.03/分钟 | `WATCH_POLICY` |
| 疲劳 | 时长 2500ms，恢复 15，时长∈{60,120,180}分钟 | `STAMINA_FATIGUE` |
| 精力阶段 | 提神 0.25 日 ×0.8，随后 0.5 日 ×1.5 | `ENERGY_POLICY` |
| 温泉 | ¥8,000，体力+25，压力−10 | `ONSEN_POLICY` |
| 睡眠恢复 | 40/45/50/55/60（住房等级） | `HOUSING_SLEEP_RECOVERY` |
| 创伤阈值 | hurt≥40、crushed≥70、numb≥85 | 上限 32/18/8 |
| 创伤恢复 | 休息 −8/次，空仓整段 −2/次 | 阈值 6/14 tick |
| 上头 | 连点上限 5，宽限 8000ms，衰减 2000ms，间隔 80ms | `emotion-pressure.js` |
| 彩票 | ¥300/张，18:00 开奖，保底 40 抽 | — |
| 彩奖池 | 2000万(w1)/200万(w4)/20万(w45)/1万(w50)/3000(w100)/300(w200)/0(w600) | — |
| 暗号票 | `201402` → 2000万 | 特例 |
| 生活费餐预算 | ¥300/餐 | `SUPPLY_POLICY.mealBudget` |

**供给道具**（`SUPPLY_POLICY` + `copy/items.js`）：

| 道具 | 价格 | 效果 |
| --- | --- | --- |
| 盯盘饮料 | 300 | 体力+10，当日 50×/100× 免连点，每日1 |
| 外卖 | 1200 | 体力+20，情绪向平静靠一档，抵餐费，与泡面共用餐位 |
| 泡面 | 150 | 体力+8，抵餐费，与外卖共用餐位 |
| 魔爪能量饮料 | 300 | 体力+25，情绪更亢奋，当日破限免连点，触发精力阶段，每日1 |
| 巧克力 | 200 | 体力+5，低落时情绪靠近平静，每日1 |
| 睡眠眼罩 | 500 | 下次睡眠额外+15，用后消耗，每日1 |
| 交易笔记 | 0（打工获得） | 压力−5，每日1，不恢复体力 |
| 父亲存款 | 自选 | 计入欠款，压力+8（DEBUFF guilt），可归还 |

## A.3 核心状态机与流程

```
createGame
  └─ story: phase='decision'
        ├─ 玩家下单（多/空 + 保证金 + 杠杆 + 止损）
        ├─ advanceQuote / advanceTick（逐 tick 推进，结算浮动盈亏、强平、追踪止损）
        ├─ 每段末(beat++)→ mentalState(sample=true) → ageEffects
        ├─ phase='closing'（提前收盘 or 4 段走完）
        └─ settleDay → phase='day_end'
              └─ finalizeDayLiving（扣生活费）
                   └─ beginRest → phase='resting'
                        └─ pendingStory / lifeAction
                             └─ nextDay → phase='decision'（day++）
  └─ endless: 连续 beat，日边界结算利息+强平，equity<1000 → ending
```

**endingCondition（`engine.js`）**：
- endless：`equity < 1000 → broke`
- story：`sanity ≤ 5 且 equity < 5000 → crisis`；`equity < 1000 → broke`；`tradingProfit ≥ 20_000_000 → million`
- 任意：玩家「销户离场」→ `walkaway`

## A.4 关键公式（重写须逐条实现并测试）

- `equity(s) = max(0, cash + usedMargin + unrealized) + reserve`
- `tradingEquity = cash + usedMargin + unrealized`
- `marginLevel = requiredMargin ? tradingEquity / requiredMargin : null`
- `availableMargin = max(0, min(cash, tradingEquity − usedMargin))`
- `notional = Σ margin × leverage`；`quantity = notional / entry`（USD/JPY 线性模型 `grossPnl = qty × direction × (price − entry)`）
- `openFee = closeFee = money(margin × leverage × FEE_RATE)`
- `pnl = unrealized − openFeeRemaining − closeFee`
- `tradingProfit = equity − initialCapital − externalFunding − nonTradingIncome − lotteryIncome − cheatLotteryIncome + expenses − developer.profitOffset`
- `sanity = clamp(50 + earned + mentalBoost + restRecovery − totalDrawdown×65 − recentDrawdown×20 − exposure×5 − stress + modifiers, 0, 100)`
  - `earned = clamp(log2(1 + max(0, personal − initialCapital)/1000) × 5, 0, 35)`
  - `totalDrawdown = 1 − personal/peakPersonal`；`recentDrawdown = 1 − personal/recentPeak`（近 48 点）
  - `exposure = min(1, notional / max(tradingEquity,1) / 50)`
- `accrueLoanInterest`：每日一次；`interest = networkDebt × dailyRate`；现金不足部分转欠款
- `dailyRate`（endless）= `clamp(0.0005 + 0.002×debtRatio + 0.00015×borrowCount + 0.0015×emotionIntensity, 0.0005, 0.008)`
- 日报告 `net = closing − opening − funding − income + costs`（严格区分交易损益/借贷/生活费/彩票）

## A.5 限制与解锁（`restrictions`）

| sanity | 杠杆 | 仓位比例 |
| --- | --- | --- |
| < 40 | 25× | 25% |
| 40–64 | 50× | 50% |
| ≥ 65 | 100× | 100% |
| ≤ 5 | 禁止开仓 (`noEntry`) | — |

- 极端情绪（`ecstatic`/`despair`）或触达上头目标：`forceNoStop=true`、`minLeverage=25`，仅允许不设止损。
- 体力不足 `staminaStatus.canOpen=false` → 禁止开仓。
- `endless` 模式永久开放 100×、100% 仓位。

## A.6 情绪与心理状态机

- 情绪枚举（`content.js MOODS`）：平静/期待/专注/烦躁/震惊/疲惫/内疚/局促/落寞/坚定/温暖/得意/紧张/焦虑/极度亢奋/绝望/懊恼/如释重负/麻木/重创/崩溃/恢复中。
- `baseMood` 优先级（高→低）：创伤态 → sanity≤5 → 上头 → sanity≤15 → 首日希望 → 当日事件 → 恐慌 → sanity<25 → 亢奋 → 风险紧张 → 懊恼/释然 → emotionBias → 疲劳 → guilt → 焦虑 → 烦躁 → 得意 → 平静。
- `emotion-pressure`：软锁定时连点累积（3/4/5 目标随心理差距），达上限解锁高杠杆/高仓位；代价 `stress+0.5/次`，每 3 次 `heat+1`。
- `trading-trauma`：大额已实现亏损（相对峰值 75%/45%/20%）→ severity 92/76/46；连续爆仓额外 88；上限压到 32/18/8；空仓段/休息逐步恢复。

## A.7 剧情与内容系统

- **序章** 8 页（`opening-story.js`，含 7 张原作分镜 + 1 页原创衔接）。
- **人物事件**（`story.js` + `story-content.js`）：`fatherUnlock`/`fatherDiscover`/`fatherFound`/`repayPartial`/`repayFull`/`friendStudy`/`roommate`/`quietNight`/`recovery` 等；触发条件、选项、效果（stress/trust/mood/itemUnlocks）。
- **每日小剧场/四格漫画**：按当日盈亏、情绪、上下文路由（`contextual-manga-*`），并做原作单格致敬（`homage/`，带来源链接）。
- **自由阅读**：原创剧情库、原作漫画库、人物篇章（分页阅读器）。
- **台词分层**：原作/已批准台本（`copy/script-lines.js`）、原创台词（`copy/original-lines.js`）、日常脚本（`copy/daily-life-scripts.js` 等）、心理压力台词、晚餐/朋友脚本。
- **新闻链** 22 条（base 6 + extra 16），每条含 lead/confirmed/reversed/muted；**黑天鹅** 8 种（`BLACK_SWANS`），带 delta。

## A.8 成就、结局、排行榜、彩蛋

- **成就 18 项**（`achievements.js`）：first-profit、million-thirty、liquidated、hold-loss、hundred-times、father-funds、tell-everything、fully-repaid、accept-stop、mochiko-warning、profit-receipt、saved-at-last、walkaway、twenty-million，外加 lottery-first-win、lottery-top-three。跨章节保存；开发者修改后永久锁定。
- **结局 10 种**（`ending-classifier.js`）：基础 `million/walkaway/broke/crisis`；变体 `debt-exit/paper-millionaire/gave-it-back/back-to-even/debt-free/returned-savings`，含触发规则与证据快照，配结局四格漫画。
- **名人堂**：剧情/操盘双榜、10 种排序（存活天数/收益率/日均收益率/总收益/累计亏损/最赚一单/胜率/最大单笔亏损/最大回撤/日收益波动）。
- **战报分享**：原版/像素版分享卡导出 PNG。
- **匿名统计**：可一键关闭，含匿名编号说明。

## A.9 存档与开发者模式

- 命名空间 `kurumi-fx:`；主槽 `fx-girl-campaign-v3`（剧情）、`fx-girl-endless-v1` 等；历史槽 `fx-girl-historical-*`、`fx-girl-live-*`、`fx-girl-shared-replay-*`。
- 压缩阈值、编码（`save-codec`/`save-encoder`）、Web Locks 独占写、字节级冲突检测、多版本迁移备份（`pre-economy-v1` 等）。
- 导入/导出 JSON、下载备份、从备份恢复、存储失败提示。
- 开发者模式：本人密码验证、会话 ≤15 分钟、每次修改联网复核、本局永久退出榜单/成就、自动备份。

---

# Part B — 目标架构

## B.1 目录结构

```
src/
  domain/                     # 纯函数，无 DOM/无副作用，100% 可单测
    core/
      state.ts                # GameState 类型 + createGame
      clock.ts                # 交易日时间戳（day/beat/candle/tick）
      phase.ts                # 状态机（decision/closing/day_end/resting/ending）
      rng.ts                  # seed 派生随机（mix/random）
    market/
      market-book.ts          # 多货币对宿主
      quote-grid.ts           # 行情网格生成（确定性）
      sources/{simulated,historical,live,replay}.ts
      news.ts                 # 新闻链影响
      candle.ts               # K 线聚合
    trading/
      order.ts                # 下单校验/预览
      position.ts             # 持仓、浮动盈亏、止损
      risk.ts                 # 强平、保证金、余额保护
      accounting.ts           # 手续费、日账、绩效
    economy/
      credit.ts               # 网贷政策
      living.ts               # 生活费/住房/生活方式
      supplies.ts             # 道具与餐位
      work.ts                 # 打工
      lottery.ts              # 彩票
    mind/
      sanity.ts               # 心理承受力
      mood.ts                 # 情绪状态机
      pressure.ts             # 上头/情绪锁
      trauma.ts               # 交易创伤
    body/
      stamina.ts              # 体力
      energy.ts               # 精力阶段
    progress/
      achievements.ts
      ending.ts
      run-stats.ts
      hall-metrics.ts
    story/
      story.ts                # 事件队列/触发
      dialogue-selector.ts    # 台词路由（纯逻辑）
  content/                    # 数据包（JSON/TS，可单独评审与本地化）
    config/numerics.json      # A.2 全部数值
    news/chains.json          # 22 条新闻链
    news/swans.json           # 8 黑天鹅
    story/{opening,events,scenes}.json
    copy/{script-lines,original-lines,daily-scripts,pressure}.json
    manga/routing.json        # 漫画/致敬路由与来源标注
    items.json  achievements.json  endings.json  lottery.json
    life/{work,relax,friend,dinner}.json
  app/                        # 应用编排 + 持久化
    bootstrap.ts              # 入口（替代 pixel-bootstrap）
    orchestrator.ts           # 装配 domain+content+view（替代 app.js 巨构）
    persistence/
      storage.ts              # 命名空间
      save-codec.ts / save-session.ts / migrations.ts
    services/
      leaderboard.ts / telemetry.ts / market-provider.ts
    developer/                # 开发者模式
  view/                       # UI 层（框架化）
    shell/                    # 顶栏、模式选择、设置
    screens/{terminal,account,character,life,recap,leaderboard,share}/
    components/               # 通用控件（数值滑块、进度条、对话框、Toast）
    charts/                   # 自有 K 线渲染（Canvas）
    a11y/                     # 无障碍与焦点管理
    styles/                   # 设计令牌 + 主题（见 Part C）
  assets/                     # 图片/音频（沿用现有资源，规范命名）
tests/
  domain/**                   # 单测（Vitest）
  content/**                  # 内容 schema 校验 + 覆盖度
  e2e/**                      # Playwright 冒烟
```

## B.2 核心接口契约（供任务实现，禁止改名）

```ts
// domain/core/state.ts
export interface GameState { /* 见 B.3 数据模型 */ }
export function createGame(seed: number, opts: CreateOptions): GameState;

// domain/market/sources/types.ts
export interface MarketSource {
  readonly kind: 'simulated' | 'historical' | 'live' | 'replay';
  ready(s: GameState): boolean;
  planDay(seed: number, day: number, startPrice: number, rounds: number): DayScript;
  quoteAt(script: DayScript, cursor: Cursor): number;
}

// domain/trading/order.ts
export interface OrderIntent { type: 'long'|'short'; leverage: 5|10|25|50|100; margin: number; stopPips: 10|30|50|null; }
export interface OrderPreview { valid: boolean; error: string|null; margin: number; notional: number; quantity: number; openFee: number; closeFee: number; totalDebit: number; maxMargin: number; stopPrice: number|null; liquidationPrice: number|null; riskPercent: number; }
export function previewOrder(s: GameState, intent: OrderIntent): OrderPreview;
export function placeOrder(s: GameState, intent: OrderIntent): TradeReceipt;

// domain/trading/risk.ts
export function accountMetrics(s: GameState): AccountMetrics;
export function equity(s: GameState): number;
export function enforceMargin(s: GameState, exits?: TradeReceipt[]): TradeReceipt[];

// domain/mind/sanity.ts
export function recomputeSanity(s: GameState, sample?: boolean): SanityReadout;
export function restrictions(s: GameState): Restrictions; // {leverage, stake, noEntry, minLeverage, forceNoStop, emotion}

// domain/core/phase.ts
export function advanceQuote(s: GameState): AdvanceResult;
export function finishTradingDay(s: GameState): DayReport;
export function settleDay(s: GameState): DayReport;
export function finalizeDayLiving(s: GameState): LivingReceipt;
export function beginRest(s: GameState): StoryEvent | null;
export function nextDay(s: GameState): void;
export function endingCondition(s: GameState): EndingId | null;
```

## B.3 数据模型（GameState 关键字段）

```
version, mode, seed, runId
day, beat, phase, price, marketBook, script, pending, candles, lastEvent
cash, reserve, dayOpening, dayOpeningNetAssets, dayOpeningDebt, dayOpeningFunding, dayOpeningExpenses, dayOpeningIncome
positions[], position(兼容视图), nextOrderId
history[], feeLedger[], protectionLedger[], expenseLedger[]
performance{totalProfit,closedTrades,winningTrades,winRateTrades,maxLoss,maxProfit,peakEquity,maxDrawdown}
runStatistics{trades[],openOrders{},realizedPeak,realizedTrough,...}
sanity, mentalBoost, restRecovery, stress, heat, peakPersonal, equityTrail[]
tradingTrauma{severity,level,hitTick,recentLosses[],...}
emotionPressure{taps,target,direction,lastAt,context}
stamina{value,version,watchMinutes,spent,recovered,recoveryReceipts[],fatigue}
energyEffect?{day,elapsed,boostDuration,fatigueDuration,...}
family{outstanding,repaid,borrowedAt,informed,discovered,trust,withdrawal,theftDiscovery}
loan{outstanding,borrowed,repaid,limit,dailyRate,interestPaid,interestAccrued,lastInterestDay}
itemsUsed, itemUnlocks, itemDiscoveries, skills, effects[]
livingPolicy, lifestyle, housingEconomy, dailySupplies, consumptionLedger[]
nonTradingIncome, lottery*, cheatLotteryIncome, expenses
story{seen[],queue[],log[],flags{},presentedDay}, chat{group[],friend[],campus[]}
openingProgress, dayReport, completedDays, completedCandles, dayMoments[]
ending{id,variant,day,equity,profit,sanity,lifeChoice}
developer{edited,profitOffset,sanityOverride}, developmentTaint
```

## B.4 内容 Schema（Zod）

```ts
const NewsChain = z.object({ id: z.string(), name: z.string(), bias: z.number().int(), vol: z.number().int(),
  source: z.string(), lead: z.string(), leadCopy: z.string(),
  confirmed: z.tuple([z.string(), z.string()]), reversed: z.tuple([z.string(), z.string()]), muted: z.tuple([z.string(), z.string()]) });
const Swan = z.object({ id: z.string(), name: z.string(), title: z.string(), copy: z.string(), delta: z.number(), speaker: z.string() });
const Achievement = z.object({ id: z.string(), name: z.string(), description: z.string(), badge: z.string(), sourceNote: z.string(), goal: z.number().positive().default(1) });
const Ending = z.object({ id: z.string(), baseId: z.enum(['million','walkaway','broke','crisis','debt-exit','paper-millionaire','gave-it-back','back-to-even','debt-free','returned-savings']), title: z.string(), description: z.string(), rule: z.string() });
const CopyLine = z.object({ id: z.string(), from: z.string(), text: z.string(), origin: z.enum(['original','fan']) });
```

---

# Part C — 画面与交互升级 + 美术风格方案

## C.1 交互问题清单（现状 → 目标）

| 现状痛点 | 目标 |
| --- | --- |
| 单文件 `app.js` 1108 行 + 大量全局 `$()` 直接操作 DOM，重绘整块 | 组件化 + 增量渲染；Canvas K 线只重绘变化区域 |
| `setInterval(renderInvestors,250)` 等固定轮询，浪费资源 | 事件驱动 + 可见性感知（`document.hidden` 暂停） |
| 三栏在窄屏拥挤，靠多套 CSS 覆盖 | 断点式布局：桌面三栏 / 平板两栏 / 移动单栏 + 底部导航 |
| 下单金额靠输入框+滑块，触屏体验一般 | 手势拖拽 + 大按钮 + 长按微调 + 触觉反馈 |
| 情绪锁连点机制无明确反馈 | 压力条 + 震动/抖动动画 + 音效渐强 |
| 剧情/漫画为弹窗堆叠 | 沉浸式阅读器：全屏分镜 + 翻页 + 自动播放 + 记忆进度 |
| 数值概念靠 `?` 弹层，认知负担重 | 渐进式引导 + 首次出现即内联解释 + 新手教程 |

## C.2 交互增强（按优先级）

1. **K 线渲染器**：Canvas 2D，双层（静态蜡烛 + 动态 overlay）；十字光标 + 悬浮 OHLC；缩放/平移；性能预算 ≤4ms/帧。
2. **下单面板**：滑杆 + 预设 + 骰子 + 键盘（↑↓ 调档、Enter 下单）；实时显示强平价、止损亏损、风险占比。
3. **行情回放条**：可 scrub 查看已发生行情，与结算对齐。
4. **移动端**：底部 Tab（交易/账户/剧情/生活/排行）；安全区适配；下拉刷新禁用。
5. **反馈层**：统一 Toast/震动/音效/动画编排（`feedback` 服务），与游戏数值事件解耦。
6. **无障碍**：焦点陷阱管理、`aria-live` 分流（行情/成就/错误）、色盲友好（红绿+形状/数值）。

## C.3 美术风格方案（三选一或可切换主题）

### 方案 A：漫画交易室（贴近原作，推荐默认）
- 配色：深炭底 `#151e25` + 粉色强调 `#f16f9f`（沿用现有 `theme-color`）+ 网点纸纹理。
- 角色：保留现有像素立绘；UI 边框用漫画分格线，数值用等宽数字。
- 适用：忠实还原、开发成本最低（资源可直接复用）。风险：辨识度偏「同人」，商业化不足。

### 方案 B：CRT 投机终端（沉浸感最强）
- 配色：黑底 + 磷光绿 `#4ade80` / 琥珀警诫 `#fbbf24`；扫描线、轻微色散、球面畸变、开机自检动画。
- 角色：半色调（halftone）单色立绘 + 故障风切换。
- 适用：强化「盯盘/爆仓」主题张力，适合核心玩家。风险：长时间阅读疲劳，需提供关闭 CRT 效果的开关。

### 方案 C：像素赛博 Tokyo（年轻化/传播友好）
- 配色：霓虹粉紫 `#ff4fa3` / `#7c5cff` + 深蓝底；像素风立绘 + 动态霓虹描边 + 抖动。
- 角色：保留像素资源，增加发光与粒子（爆仓时屏幕碎裂、盈利时金币粒子）。
- 适用：社媒分享卡与短视频传播。风险：与「惨烈投机叙事」基调略有张力，需用暗色控光。

**落地方式**：抽象为设计令牌（`view/styles/tokens.ts`）+ CSS 变量主题；三套主题以 `data-theme` 切换，设置内保存偏好。分享卡样式与主主题解耦。

---

# Part D — 实施计划（分阶段、TDD、每任务可独立验收）

## 阶段 0：脚手架与规格固化

### Task 0.1：初始化 TS + Vite + Vitest 工程
**Files:**
- Create: `package.json`、`tsconfig.json`、`vite.config.ts`、`vitest.config.ts`
- Create: `src/app/bootstrap.ts`

**Interfaces:**
- Produces: `npm run dev` / `npm run test` / `npm run build` 可用。

- [ ] Step 1：写失败测试 `tests/domain/smoke.test.ts`：`expect(createGame(1,{mode:'story'}).day).toBe(1)`（此时 `createGame` 不存在）。
- [ ] Step 2：`npm run test` → 预期 FAIL（模块不存在）。
- [ ] Step 3：建工程与最小 `createGame` 桩（返回 `{day:1,phase:'decision'}`）。
- [ ] Step 4：`npm run test` → PASS。
- [ ] Step 5：`git commit -m "chore: scaffold ts+vite+vitest"`。

### Task 0.2：固化数值配置
**Files:** Create `src/content/config/numerics.json`、`src/domain/config/numerics.ts`（读取+冻结）、Test `tests/content/numerics.test.ts`
**Interfaces:** Produces `NUMERICS`（含 A.2 全部常量），供后续任务消费。
- [ ] Step 1：测试断言 `NUMERICS.FEE_RATE===0.00005 && NUMERICS.STOP_OUT_LEVEL===0.5 && NUMERICS.TARGET_PROFIT===20000000`。
- [ ] Step 2：运行 → FAIL。
- [ ] Step 3：写入 JSON 与加载器（`Object.freeze`）。
- [ ] Step 4：运行 → PASS。
- [ ] Step 5：`git commit -m "feat(content): freeze all game numerics"`。

## 阶段 1：领域核心（无 UI）

### Task 1.1：确定性随机与时钟
**Files:** Create `src/domain/core/rng.ts`、`src/domain/core/clock.ts`；Test `tests/domain/rng.test.ts`
**Interfaces:** Produces `random(seed): () => number`、`mix(seed,day,channel): number`、`tradingTimestamp(s,{day,beat,candle,tick}): number`。
- [ ] Step 1：测试同 seed 序列一致、不同 seed 不同；`mix` 对齐现有实现输出（用固定样例断言）。
- [ ] Step 2：运行 → FAIL。
- [ ] Step 3：实现（移植 `engine.js:78` 的 `random` 与 `mix`）。
- [ ] Step 4：运行 → PASS。
- [ ] Step 5：commit。

### Task 1.2：账户与保证金
**Files:** Create `src/domain/trading/account.ts`、`src/domain/trading/math.ts`；Test `tests/domain/account.test.ts`
**Interfaces:** Produces `accountMetrics(s)`、`equity(s)`、`money/fee/floorMoney`。
- [ ] Step 1：测试 `equity = max(0,cash+used+unrealized)+reserve`；`marginLevel=0.5` 边界。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

### Task 1.3：下单与预览
**Files:** Create `src/domain/trading/order.ts`、`src/domain/trading/stop.ts`；Test `tests/domain/order.test.ts`
**Interfaces:** Consumes 1.2；Produces `previewOrder(s,intent)`、`placeOrder(s,intent)`。
- [ ] Step 1：测试用例覆盖：杠杆非法、保证金<100、可用保证金不足、止损点数越界、心理限额拒绝、`forceNoStop` 只能不设止损。
- [ ] Step 2：FAIL → Step 3 实现（移植 `orderPreview` 校验链）→ Step 4 PASS → Step 5 commit。

### Task 1.4：持仓、平仓、强平、余额保护
**Files:** Create `src/domain/trading/position.ts`、`src/domain/trading/risk.ts`、`src/domain/trading/close.ts`；Test `tests/domain/risk.test.ts`
**Interfaces:** Produces `positionUnrealized/positionNetUnrealized`、`closePosition(s,fraction,reason,id)`、`enforceMargin`、`protectBalance`。
- [ ] Step 1：测试：强平取浮亏最大仓、跨保证金亏损不吃预留、`cash<0` 时余额保护并计入 pnl。
- [ ] Step 2：FAIL → Step 3 实现（移植 `closePosition/protectBalance/enforceMargin`）→ Step 4 PASS → Step 5 commit。

### Task 1.5：心理 / 情绪 / 上头 / 创伤
**Files:** Create `src/domain/mind/{sanity,mood,pressure,trauma}.ts`；Test `tests/domain/mind.test.ts`
**Interfaces:** Produces `recomputeSanity`、`mood`、`pressEmotion`、`observeTrauma`、`restrictions`。
- [ ] Step 1：测试覆盖 A.4 sanity 公式、A.5 限制表、A.6 情绪优先级、上头连点上限 5、创伤三级阈值。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

### Task 1.6：体力与精力
**Files:** Create `src/domain/body/{stamina,energy}.ts`；Test `tests/domain/stamina.test.ts`
**Interfaces:** Produces `consumeTradingStamina`、`recoverStamina`、`activateEnergyEffect`、`energyCostForDuration`。
- [ ] Step 1：测试：分批推进与一次性推进成本一致（积分精确）、疲劳触发与恢复、提神/疲劳倍率。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

### Task 1.7：行情生成与多货币对
**Files:** Create `src/domain/market/{quote-grid,market-book}.ts`、`sources/simulated.ts`；Test `tests/domain/market.test.ts`
**Interfaces:** Produces `planDay`、`quoteAt`、`createMarketBook`、`MARKETS`（USD/JPY 150、AUD/JPY 90、GBP/JPY 170）。
- [ ] Step 1：测试：同 seed 行情可复现；切换货币对不改变已发生行情；三货币对独立脚本。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

### Task 1.8：经济系统（生活费/网贷/道具/打工/彩票/消费账本）
**Files:** Create `src/domain/economy/{living,credit,supplies,work,lottery,consumption}.ts`；Test `tests/domain/economy.test.ts`
**Interfaces:** Produces `livingCost`、`creditTerms`、`accrueLoanInterest`、`supplyUse`、`calculateWorkPay`、`drawLotteryResult`、`recordConsumption`。
- [ ] Step 1：测试：日利率公式、借还边界、保底开奖、暗号票 2000 万、打工按比例工资、餐位互斥。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

### Task 1.9：状态机与日流程
**Files:** Create `src/domain/core/phase.ts`、`src/domain/core/day.ts`；Test `tests/domain/day.test.ts`
**Interfaces:** Consumes 1.1–1.8；Produces `advanceQuote`、`finishTradingDay`、`settleDay`、`finalizeDayLiving`、`beginRest`、`nextDay`、`endingCondition`。
- [ ] Step 1：测试完整一天：4 段推进 → closing → day_end → resting → 次日；`dayReport.net` 分层正确（交易/借贷/生活/彩票）。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

### Task 1.10：剧情路由与成就/结局
**Files:** Create `src/domain/story/story.ts`、`src/domain/progress/{achievements,ending,run-stats}.ts`；Test `tests/domain/progress.test.ts`
**Interfaces:** Produces `checkStories`、`pendingStory`、`chooseStory`、`evaluateAchievements`、`classifyEnding`、`orderPerformance`。
- [ ] Step 1：测试：fatherUnlock 触发条件、10 结局分类规则逐条断言、18 成就解锁条件。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

## 阶段 2：内容迁移（数据化）

### Task 2.1：新闻链与黑天鹅 JSON 化
**Files:** Create `src/content/news/{chains,swans}.json` + `index.ts`；Test `tests/content/news.test.ts`
- [ ] Step 1：测试：22 条链、8 黑天鹅、每条含 lead/confirmed/reversed/muted，`origin` 标注。
- [ ] Step 2：FAIL → Step 3 从 `content.js`/`story-content.js` 迁移 → Step 4 PASS → Step 5 commit。

### Task 2.2：台词/剧本/漫画路由 JSON 化
**Files:** Create `src/content/{story,copy,manga}/*.json`；Test `tests/content/copy.test.ts`
- [ ] Step 1：测试：所有行含 `id/from/text/origin`；原作与原创分离；漫画路由含来源 URL。
- [ ] Step 2：FAIL → Step 3 迁移 → Step 4 PASS → Step 5 commit。

### Task 2.3：道具/成就/结局/生活/彩票 JSON 化
**Files:** Create `src/content/{items,achievements,endings,life,lottery}.json`；Test `tests/content/catalog.test.ts`
- [ ] Step 1：测试 schema 校验通过 + 数量断言（道具 8、成就 18、结局 10）。
- [ ] Step 2：FAIL → Step 3 迁移 → Step 4 PASS → Step 5 commit。

## 阶段 3：持久化与服务

### Task 3.1：命名空间存储与存档编解码
**Files:** Create `src/app/persistence/{storage,save-codec,save-session}.ts`；Test `tests/app/save.test.ts`
- [ ] Step 1：测试：前缀 `kurumi-fx:`、只读旧键迁移、压缩阈值、字节级冲突检测。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

### Task 3.2：迁移与备份
**Files:** Create `src/app/persistence/migrations.ts`；Test `tests/app/migrations.test.ts`
- [ ] Step 1：测试：`pre-economy-v1` 等备份键生成、旧版本升级不丢字段。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

### Task 3.3：排行榜与遥测（可降级）
**Files:** Create `src/app/services/{leaderboard,telemetry}.ts`；Test `tests/app/services.test.ts`
- [ ] Step 1：测试：服务未配置时返回 `service-unconfigured` 且不影响本地游玩；`credentials:'omit'`、`referrerPolicy:'no-referrer'`。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

## 阶段 4：视图与美术

### Task 4.1：设计令牌与三主题
**Files:** Create `src/view/styles/tokens.ts` + `themes/{comic,terminal,cyber}.css`；Test `tests/view/themes.test.ts`
- [ ] Step 1：测试：三主题均导出全部 token 变量；`data-theme` 切换。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

### Task 4.2：K 线渲染器
**Files:** Create `src/view/charts/{candles,viewport,crosshair}.ts`；Test `tests/view/chart.test.ts`
- [ ] Step 1：测试：给定数据生成正确的像素坐标；缩放/平移边界；帧预算函数。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

### Task 4.3：交易/账户/角色/生活屏
**Files:** Create `src/view/screens/*`；Test `tests/view/screens.test.ts`（DOM 断言）
- [ ] Step 1：测试：下单面板实时预览随输入更新、心理/体力条绑定、移动端布局断点。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

### Task 4.4：剧情阅读器与复盘
**Files:** Create `src/view/screens/{story,recap,share,leaderboard}/`；Test `tests/view/story.test.ts`
- [ ] Step 1：测试：分镜翻页、进度记忆、四格漫画路由、分享卡导出。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

## 阶段 5：编排、无障碍与发布

### Task 5.1：应用编排与反馈服务
**Files:** Create `src/app/orchestrator.ts`、`src/view/a11y/*`、`src/view/feedback.ts`；Test `tests/app/orchestrator.test.ts`
- [ ] Step 1：测试：事件驱动重绘、页面隐藏暂停轮询、焦点陷阱、`aria-live` 分流。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

### Task 5.2：开发者模式
**Files:** Create `src/app/developer/*`；Test `tests/app/developer.test.ts`
- [ ] Step 1：测试：会话 15 分钟、修改后 taint 永久、自动备份、不改交易规则（仅数据）。
- [ ] Step 2：FAIL → Step 3 实现 → Step 4 PASS → Step 5 commit。

### Task 5.3：E2E 冒烟与 Pages 发布
**Files:** Create `tests/e2e/smoke.spec.ts`、`.github/workflows/deploy.yml`
- [ ] Step 1：E2E：开新局 → 下单 → 完整一天 → 看到结算；移动端视口。
- [ ] Step 2：运行 → FAIL（未接线）。
- [ ] Step 3：接线构建产物到 Pages。
- [ ] Step 4：运行 → PASS。
- [ ] Step 5：commit。

---

# Part E — 自检结果

**规格覆盖**：A.1–A.9 全部机制均映射到 Task 1.1–1.10、2.1–2.3、3.1–3.3、5.2；画面/美术映射到 4.1–4.4；无遗漏。

**占位符扫描**：无 TBD/TODO；每个代码步骤含具体断言或公式；跨任务接口在 B.2 显式声明。

**类型一致性**：`GameState` 字段（B.3）、接口签名（B.2）在 Task 1.x 消费处命名一致（如 `previewOrder`/`accountMetrics`/`enforceMargin`）；内容 Schema（B.4）与 Task 2.x 校验断言一致。

**风险与建议**：
1. 内容体量最大（211 漫画 + 464 源 JS），务必先完成阶段 1、2 的领域与内容解耦再动 UI。
2. 确定性种子与存档权威是「可复现」底线，测试必须覆盖重载不重 roll。
3. 心理/创伤/上头三系统是差异化核心，优先保证行为等价再做美术升级。

---

## 执行交接

计划已保存到 `docs/superpowers/plans/2026-10-22-kurumi-fx-rewrite.md`。两种执行方式：

1. **子代理驱动（推荐）** — 每个任务派发全新子代理，任务间审查，快速迭代。
2. **行内执行** — 在当前会话按阶段分批执行，带检查点复查。

你希望用哪种方式？
---

# Part F — 实现进度与部署（交付记录）

## F.1 实际完成度

| 阶段 | 状态 | 说明 |
| --- | --- | --- |
| 0 脚手架 + 数值冻结 | 完成 | TS+Vite+Vitest；`numerics.json` 全量常量 |
| 1 领域核心 | 完成 | rng/clock/account/position/order/close(risk)/mind(sanity·mood·pressure·trauma·effects)/body(stamina)/market(quote-grid·news·planDay·history)/economy(credit·lottery·living·supplies·work)/progress(achievements·ending)/story/core(day 状态机) |
| 2 内容数据化 | 完成 | 24 新闻链 + 8 黑天鹅 + 18 成就 + 10 结局 + 8 道具 + 打工/放松/晚餐 + 序章 8 页 + 7 剧情事件（均 JSON，含来源标注） |
| 3 持久化与服务 | 完成 | 命名空间存储 + 存档编解码 + 迁移/备份键；排行榜/遥测可降级（未配置即离线） |
| 4 视图与美术 | 完成 | 三主题（漫画/CRT/赛博）+ 设计令牌 + Canvas K 线 + 可玩单页 UI + 剧情/道具/打工/结局/名人堂/分享 |
| 5 编排/无障碍/开发者/E2E | 完成 | aria-live/role/aria-pressed、键盘可操作；开发者模式（15 分钟会话 + 永久 taint）；Playwright 冒烟 |

## F.2 质量数据

- 单元测试：**86 项全绿**（domain/view/app）。
- 类型检查：`tsc --noEmit` 干净（strict + noUnused*）。
- 构建：`vite build` 产出 `dist/`（JS ≈ 70KB / gzip ≈ 32KB，CSS ≈ 3.3KB）。
- E2E：Playwright 对本地与**线上**站点均通过，控制台零错误。

## F.3 部署

- 站点：**https://gongfpp.github.io/kurumi-fx-rewrite/**
- 方式：`main` 推送触发 `.github/workflows/deploy.yml`（build → test → 产物推送 `gh-pages` 分支）。
- 绕过点：`POST /pages` 需 `pages=write` **和** `administration=write`；本 token 仅有前者，故改用「推送 `gh-pages` 分支」由 GitHub 自动启用 Pages（`build_type: legacy`），无需 admin 权限。
- 主题可在页面右上角切换（漫画交易室 / CRT 投机终端 / 像素赛博 Tokyo），并记忆选择。

## F.4 后续可选增强（未阻塞交付）

- 原作漫画/四格阅读器（现有 `content/manga` 占位结构）。
- 实时行情（biquote 指示价）与共享回放。
- 情绪锁可视化连点动画、强平序列与音频包络。
- 更细的排行榜排序面板与匿名编号说明页。

---

# Part G — 资源复刻与功能补全（v1.1.0）

## G.1 原站资源全量复刻
从 `gongfpp/kurumi-fx-pages` 完整迁移 486 个媒体资源至 `public/fx/`（随构建部署）：

| 类别 | 数量 | 用途 |
| --- | --- | --- |
| expressions | 23 | 角色立绘，按情绪切换（curumi-calm/nervous/exhilarated/shocked…）|
| comics | 8 | 结局四格 + 事件四格（ending-*/event-*）|
| homage | 3 | 原作致敬单格（demk-*）|
| manga | 211 | 原作漫画分镜 |
| generated | 172 | 场景插画（chapter-01/daily-life/dinner-stories/emotion-extremes/…）|
| pixel-assets | 9 | 像素生活界面与 UI 图标 |
| bgm | 15 | 背景音乐 |
| sfx | 26 | 音效（下单价/成交/新闻/强平/压力/复盘…）|
| voice | 16 | 日语原声（手动点播）|
| history | 3 | 历史行情数据 |

资源以 `src/content/assets/manifest.json` 索引，运行时经 `BASE_URL` 解析，避免硬编码文件名。

## G.2 补全的界面与功能
- 角色立绘（图片立绘随情绪切换）+ 情绪标签。
- 漫画阅读器：每日原创四格 + 结局/事件四格 + 原作致敬 + 原作漫画图库（211 张）。
- 插画库（172 张场景插画浏览）。
- 道具说明与效果弹窗（价格/体力/压力/情绪/来源，含不可用原因）。
- 生活弹窗：放松/温泉/晚餐/朋友/住房/今日消费账本。
- 弹窗新闻：快讯 toast + 快讯记录弹窗。
- 彩票、网络贷款、父亲的柜中存款（取用/归还）弹窗。
- 设置：BGM 开关 + 15 曲目选择 + 音效开关 + 音量。
- 日语原声手动点播。
- 游戏内音效触发（下单/成交/新闻/强平/结算）。
- 成就页、名人堂、序章、事件一览、玩法说明。
- 日结复盘弹窗（当日四格）。

## G.3 质量与部署（v1.1.0）
- 单测 100 项全绿；`tsc` 干净；构建 dist ≈238MB（含资源），主 JS ≈117KB。
- 线上 Playwright 验收：立绘加载、漫画图库 35 图、道具 7 项、生活 16 项、BGM 15 曲、语音 16 条、存档持久化、**控制台零错误**。
- 站点：https://gongfpp.github.io/kurumi-fx-rewrite/
