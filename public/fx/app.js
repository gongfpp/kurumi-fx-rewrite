import {suspendLiveRun,resumeLiveRun} from './engine.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountLotteryCard,mountLotteryView} from './lottery-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasLotteryCheat} from './lottery-ranking.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {purchaseLotteryTicket,redeemLotteryCode} from './engine.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {SHARED_REPLAY_CONFIG,replayConfigured} from './shared-replay-config.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createSharedReplayController} from './shared-replay-controller.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isSharedReplay} from './shared-replay-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sharedReplayPresentation} from './shared-replay-presentation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {randomUUID} from './uuid.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {decorateSkitChrome} from './skit-chrome.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {captureSkitState,rememberDailySkitOutcome,renderSkitStatus} from './skit-outcome.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createSkitLine} from './skit-dialogue.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountMainStory} from './main-story-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {endingOriginalPresentation,mountEndingOriginal} from './ending-original-story.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {endingPresentationContext,endingPresentationState,endingPresentationMedia,bindEndingPresentation} from './ending-presentation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectEndingVariantArt} from './ending-variant-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectEndingVariantDialogue,mountEndingVariantDialogue} from './ending-variant-dialogue.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountSingleActionCard} from './single-action-card.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountStaminaFatigue} from './stamina-fatigue.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {staminaStatus,requestStaminaRest,suspendStaminaWatching} from './engine.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {lifeActionStatus,lifeActionOptions,commitLifeAction} from './engine.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountLifeActionPicker} from './life-action-picker.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountMangaCollection} from './manga-collection.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountOriginalStoryLibrary} from './original-story-library.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {observeMangaCollectionArtwork} from './manga-collection-observer.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountLifeHousingPicker} from './life-housing-picker.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {quoteHousingSelection} from './living-services.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIFESTYLES} from './consumption-ledger.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountPixelFrontend} from './pixel-frontend.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createPixelDialogController} from './pixel-dialog-controller.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {marketPlaybackOpen} from './engine.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createDirectBiquoteSource as createBiquoteSource} from './biquote-direct-source.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createLiveChartHistory} from './live-chart-history.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createChartQuoteLabel} from './chart-quote-label.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {renderChartQuoteLabel} from './chart-quote-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {applyLiveMarketSnapshot} from './engine.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {marketRunningLabel,renderHistoricalSourceLabel} from './market-source-label.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isLiveMarket,isOrdinaryLive,marketSourceOf,liveQuote,liveTradingReady,livePositionsReady,liveStatusLabel} from './live-market-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountPlayfulLoan} from './playful-loan.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createHallPlayClock,hallMetricLabels} from './hall-metrics.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {activeMarket,marketInfo,positionMarket,marketPrice,captureMarket} from './market-book.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountMarketSelector} from './market-selector.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectMarket,enableMarkets} from './engine.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
function createGame(seed,options={}){return baseCreateGame(seed,{...options,multiMarket:true});}
function restoreGame(raw){const state=baseRestoreGame(raw);return state?enableMarkets(state):null;}
import {saveWarning} from './save-warning.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createChartRiskHeartbeat} from './chart-risk-heartbeat.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createSaveIndicator} from './save-indicator.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {marketNewsView} from './news-market-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountNewsDetails} from './news-details-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mobileNewsItems,mountMobileNewsList} from './mobile-news-list.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {bindFloatingDismissal} from './floating-dismissal.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountPlayerComments} from './player-comments.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isDailyFamilyNarrative,selectDailyFamilyLines} from './daily-family-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountLiquidationSequence} from './liquidation-sequence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LiveRanking,LeaderboardBroadcast} from './live-ranking.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {acquireGameHistory} from './history-game.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountMarketSourcePicker} from './market-source-picker.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {KURUMI_SERVICE_ORIGIN} from './service-config.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {importResearchPackage} from './research-import.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountTradingExpression} from './trading-expression-overlay.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountFatherAmountControls} from './father-amount-controls.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {historicalStepMilliseconds,advanceHistoricalPlayback} from './historical-playback.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {displayCandles,candlePeriodLabel,candlePeriodNotice,nextCandlePeriod,quoteRefreshMarkup} from './candle-period.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {RESEARCH_BUILD} from './research-config.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {eveningReceiptScenes,mountEveningReceipts} from './evening-receipts-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {preserveScroll} from './preserve-scroll.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {importHistoricalPackage} from './historical-import.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {HistoricalMarketLibrary,advanceHistoricalBatch} from './historical-market.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isResearch,isHistorical,historicalReady,hasHistoricalFeed} from './historical-replay.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {historicalSimulationActive,startHistoricalContinuation,historicalSourceNotice} from './history-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createSavedContextualManga} from './contextual-manga-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountContextualManga} from './contextual-manga-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const contextualMangaDelivery=createSavedContextualManga();
import {selectDailyArtwork,mountDailyArtwork} from './daily-stage-one-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyArtMemory} from './daily-art-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {lifeActionStory,mountLifeActionStory,mountLifeActionReward} from './life-action-story.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createLifeSceneMemory} from './life-scene-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {orderLossView} from './order-loss-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createChartRenderState} from './chart-render-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountCharacterStoryReader} from './character-story-reader.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createEventComicPresenter} from './event-comic-presenter.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountConsumptionStatement} from './consumption-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {positionRiskView,renderPositionRisk} from './position-risk-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {candlePlot,createChartViewport} from './chart-viewport.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {showGeneratedPortrait} from './portrait-display.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createCloseAllControl,closeAllToken,closeAllModalOpen} from './close-all-control.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createFloatingRisk} from './floating-risk.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {narrativeAudioContext,createNarrativeCueGate} from './narrative-audio.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {quoteStepMilliseconds,visibleQuoteStep,hasCanonicalGrid} from './quote-grid.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {quoteRefreshMilliseconds} from './quote-packages.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {quotePackageMarkup,quotePackagePresentation} from './quote-package-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {movingAverageSeries,movingAverageSettings,movingAveragePath} from './moving-average.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {settledComicArt,isSevereSettledLoss} from './settled-comic-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {propEventArt,livingEventArt} from './prop-event-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectFinalPortrait,markPortraitTradingAction} from './final-portrait.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createFloatingReaction} from './floating-reaction.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {prepareDailyNarrative,finishDailyNarrative} from './day-narrative.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {fatherDiscoveryHint,fatherItemIllustration,applyFatherDiscovery} from './father-discovery.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {renderFatherIllustration,renderFatherSequence} from './father-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountLivingReceipt} from './living-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {canRequestWalkaway,walkawayConfirmation,requestWalkaway} from './walkaway.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

import {buildResultsReport} from './results-report.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountResultsReport} from './results-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

import {settlementPresentation,enterSettlementStory,canConfirmSettlementStory,completeSettlementStory} from './settlement-stage.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {buildRecapSnapshot} from './daily-recap.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountDailyRecap} from './recap-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {timedCandles,timeAxisTicks,formatTradingTime,currentTradingTimestamp,reportTradingTimestamp,TRADING_TIME_NOTICE} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {setMangaImage,configureMangaImageObserver} from './manga-images.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
configureMangaImageObserver(observeMangaCollectionArtwork);

import {BgmPlayer} from './bgm-player.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {bindBgmPreferences} from './bgm-preferences.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountBgmPanel} from './bgm-panel.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectBgmScene,voiceMixActive} from './bgm-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createEmotionOverview} from './emotion-overview.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {terminalCueForEvent} from './terminal-cues.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {GENERATED_EXTREME_EXPRESSIONS} from './generated-emotion-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';


import {createInvestorDanmaku,mountCommentCredits} from './investor-danmaku.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {quotePackageName} from './quote-packages.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

import {observeNumericLayout} from './numeric-layout.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createVoiceContextSelector} from './voice-timing.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

import {unlockSafeAudio} from './audio-envelope.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {enhanceDialogs} from './dialogs.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createEmotionControls} from './emotion-controls.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectMangaPortrait,showMangaPortrait} from './manga-portraits.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectNarrativeManga,selectDailyManga,sealedDailyMangaOutcome} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {renderMangaSelection} from './manga-render.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ALL_ACHIEVEMENTS as ACHIEVEMENTS,evaluateAchievements,createAchievementToast,renderAchievementBook} from './achievements.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectDailyScene} from './daily-scene.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createReportCard as createShareCard} from './share-card-variants.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {buildShareFile,canShareFile,shareReportFile} from './share-export.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createGameStorage} from './storage.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {kurumiStorage, storageEventMatches} from './storage-namespace.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createSaveSession} from './life-save-session.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountProgressRestore} from './progress-restore.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sliderOrderAmount,randomOrderAmount,orderAmountPresets,normalizeOrderAmount,draftOrderAmount,orderAmountRatio,nearestOrderRatio,ratioOrderAmount,orderDraftIntent,orderIntentAction} from './amount-controls.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {renderPercentageOrderControl} from './percentage-order-control.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {runPerformance} from './performance.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {readRunStatistics} from './run-statistics.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {TERMINAL_HELP} from './copy/terminal-help.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {QUICK_HELP,LIBRARY_COPY} from './copy/library-ui.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {returnFormula,createFormulaHelp} from './return-formula.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountOpeningReader} from './opening-reader.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {PROP_LINES} from './copy/items.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {UI_COPY} from './copy/ui.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {formatQuote as quote,formatQuantity,directionLabel,positionQuantity} from './market.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {TRANSITION_COPY,dailyContinueLabel} from './copy/transitions.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FXLeaderboard} from './leaderboard.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {AutomaticLeaderboard,automaticRankingStatusText} from './auto-leaderboard.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {RankingLifecycle} from './ranking-lifecycle.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasDevelopmentTaint} from './development-taint.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {setImage,assetURL} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {itemUnlocked,itemDiscovered,itemUnavailableReason} from './item-events.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ensurePropInventoryArt} from './prop-inventory-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {inventoryModel,renderInventory,loadInventoryStyles} from './inventory-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIFE_WORK_JOBS,WORK_ITEM_EFFECTS} from './life-work.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createGame as baseCreateGame, takeAction, advanceTick, nextDay, equity, unrealized, mood, currentEvent, useProp, mentalState, mentalReadout, selectCandlePeriod, purchaseQuoteRefresh, quotePackageState, tradingProfit, restoreGame as baseRestoreGame, START, TARGET_PROFIT, settleDay, finishTradingDay, chooseRecapAction, finalizeDayLiving, selectLifestyle, consumptionStatement, dailyReturnMetrics, beginRest, finishCampaign, finishEndlessCampaign, finishRunImmediately, endingCondition, pendingStory, chooseStory, restrictions, dailyLeverageUnlocked, DEBUFFS, repayFather,beatsPerDay,nearStopOrders,topUpMargin,rescueClose,borrowNetwork,repayNetwork,networkLoanTerms,debtSummary,positionsOf,positionUnrealized,positionNetUnrealized,positionStopLoss,accountMetrics,orderPreview,accountLiquidationEstimate,enableRealtime,advanceMarket,advanceQuote,tradingOpen,canCloseAtKnownQuote} from './engine.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

import {FXAudio} from './audio.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {MarketClock} from './market-clock.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {bindMarketLifecycle} from './page-lifecycle.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {GameMotion} from './motion.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {tradeImpactTiming} from './trade-impact-timing.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createHistoricalGapTransition} from './historical-gap-transition.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {MOODS, PROPS} from './content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {VoicePlayer,VOICE_LINES} from './voice.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountVoiceLibrary} from './voice-library.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountFatherTakeVoice} from './father-take-voice.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FXTelemetry,capitalBucket,pnlBucket} from './telemetry.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountDeveloperUI} from './developer-ui.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {comicCaptions,approvedQuote} from './dialogue.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Every edit is verified by the independent service; Pages never receives a password.
const $ = id => document.getElementById(id);
const storage=createGameStorage(()=>kurumiStorage());
import {yen,signed} from './display-format.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {renderEffectList} from './effect-list-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
let selectedMarket=['historical','live'].includes(storage.getItem('fx-girl-market-source'))?storage.getItem('fx-girl-market-source'):'simulated';
const slot=(mode,market=selectedMarket)=>`${mode}:${market}`;
const saveKeyFor=(mode,market=selectedMarket)=>market==='shared-replay'?`fx-girl-shared-replay-${mode}-v1`:market==='live'?`fx-girl-live-${mode}-v1`:market==='historical'?`fx-girl-historical-${mode}-v1`:mode==='endless'?'fx-girl-endless-v1':'fx-girl-campaign-v3';
let selectedMode=storage.getItem('fx-girl-mode')==='endless'?'endless':'story';
if(selectedMarket==='historical'&&!storage.getItem(saveKeyFor(selectedMode)))selectedMarket='simulated';
let saveKey=saveKeyFor(selectedMode);
const settingsKey = 'fx-girl-settings';
let developerBackupKey=selectedMode==='endless'?'fx-endless-developer-backup-v1':'fx-girl-developer-backup-v3';
const fresh = (mode=selectedMode,historical=null,market=selectedMarket) => createGame(crypto.getRandomValues(new Uint32Array(1))[0],{mode,historical,live:market==='live'});
const historicalLibrary=new HistoricalMarketLibrary();
let marketSourcePicker;
let historyAcquireController;
let historicalLoad=null;
const saveSessions=new Map(),modeStates=new Map();
function sessionFor(mode,market=selectedMarket){const key=slot(mode,market);if(!saveSessions.has(key))saveSessions.set(key,createSaveSession({storage,key:saveKeyFor(mode,market),legacyKey:market==='simulated'&&mode==='story'?'fx-girl-campaign-v2':null,restore:raw=>{const saved=restoreGame(raw);return saved?.mode===mode&&marketSourceOf(saved).replace('historical-mixed','historical')===market?saved:null;}}));return saveSessions.get(key);}
let saveSession=sessionFor(selectedMode);
const initialSave=saveSession.raw;
let state=enableRealtime(restoreGame(initialSave)||fresh());
const firstVisit=!initialSave&&!storage.getItem('fx-girl-mode');
let deferredScene=null;
let pixelFrontend=null;
let pixelDialogController=null;
let lifePicker=null;
let mangaCollection=null;
const sceneKey=()=>`${stateGeneration}:${state.mode}:${state.runId}:${state.day}:${state.phase}`;
let orderAmount=draftOrderAmount(state), shareUrl=null,shareFile=null,shareBusy=false,shareRequest=0,stateGeneration=0;
let shareStyle='original',shareSession=null;
const lifeSceneMemory=createLifeSceneMemory({memory:dailyArtMemory,getState:()=>state,getContext:()=>`${stateGeneration}:${state.mode}:${marketSourceOf(state).replace('historical-mixed','historical')}:${state.runId}`,getSavedState:()=>restoreGame(saveSession.raw),isBlocked:()=>saveSession.blocked});
const achievementKey='fx-jiuliumei-achievements-v1';
let achievementProfile;try{achievementProfile=JSON.parse(storage.getItem(achievementKey)||'{}');}catch{achievementProfile={};}
let maSettings;try{maSettings=movingAverageSettings(JSON.parse(storage.getItem('fx-moving-averages')||'null'));}catch{maSettings=movingAverageSettings(null);}
let quoteBusyGeneration=-1;
let leverage=25, stop=.5, stopPips=30, speed=1, actionBusy=false,  shownFlashTimer, toastTimer, propFrame,propPresentationRun=0;
let sound = storage.getItem(settingsKey)!=='mute';
// Legacy voice preferences do not opt users into playback. Every clip needs its button.
let fullMotion=true;
state.runId ||= randomUUID();
// null means temporarily unreadable: pause dynamic telemetry, never mark permanent test mode.
function isDevelopmentTainted(){try{const tainted=hasDevelopmentTaint(state,{getItem:key=>{if(!storage.readItem)return storage.getItem(key);const entry=storage.readItem(key);if(!entry.available)throw Error('privacy-unavailable');return entry.value;}});if(tainted)state.developmentTaint=true;return tainted;}catch{return null;}}
function isDevelopmentRun(){return [2,3].includes(state.historical?.version)||isDevelopmentTainted();}
const telemetry=new FXTelemetry({enabled:!RESEARCH_BUILD&&storage.getItem('fx-girl-analytics')!=='off',testMode:isDevelopmentRun(),getTestMode:isDevelopmentRun,getMetrics:run=>{if(run!==state.runId)return {};const p=runPerformance(state);return {realizedPnl:p.totalProfit,initialCapital:p.initialEquity,closedTrades:p.closedTrades,metricsComplete:readRunStatistics(state).complete};},build:new URL(import.meta.url).searchParams.get('v')||'local-unversioned'});
const hallPlayClock=createHallPlayClock();
let hallLastInteraction=performance.now();
const sampleHallTime=()=>hallPlayClock.sample(state,{active:!document.hidden&&document.hasFocus()&&!saveSession.blocked&&!progressRestoreBusy&&performance.now()-hallLastInteraction<60000});
for(const event of ['pointerdown','keydown'])document.addEventListener(event,input=>{if(input.target.closest?.('[data-frontend-target]'))return;sampleHallTime();hallLastInteraction=performance.now();},{passive:true});
document.addEventListener('visibilitychange',()=>hallPlayClock.reset());
window.addEventListener('blur',()=>hallPlayClock.reset());
setInterval(sampleHallTime,1000);
const reportFailure=(scope,kind,status)=>telemetry.failure(scope,kind,status);
const leaderboard=new FXLeaderboard({onFailure:reportFailure});
const automaticLeaderboard=new AutomaticLeaderboard({client:leaderboard,storage});
const rankingLifecycle=new RankingLifecycle({getState:()=>state,getGeneration:()=>stateGeneration,isBlocked:()=>saveSession.blocked,persist,report:s=>buildResultsReport(s,{recap:buildRecapSnapshot(s)}),automatic:automaticLeaderboard,onStatus:updateAutomaticRankingStatus});
const liveRankingEnabled=()=>!RESEARCH_BUILD&&isDevelopmentRun()===false&&telemetry.enabled&&!telemetry.dnt;
const rankingBroadcastRoot=document.createElement('div');rankingBroadcastRoot.className='leaderboard-broadcast';rankingBroadcastRoot.setAttribute('aria-hidden','true');document.body.append(rankingBroadcastRoot);
const rankingBroadcast=new LeaderboardBroadcast({client:leaderboard,root:rankingBroadcastRoot,enabled:liveRankingEnabled,visible:()=>!document.hidden&&!document.querySelector('dialog[open]')});
const liveRanking=new LiveRanking({client:leaderboard,storage,getState:()=>state,persist,report:s=>buildResultsReport(s),isBlocked:()=>saveSession.blocked,enabled:liveRankingEnabled,visible:()=>!document.hidden,online:()=>navigator.onLine!==false,onSubmitted:()=>{rankingEligibility();void rankingBroadcast.refresh(state.mode);}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){liveRanking.clear();rankingBroadcast.clear();void liveRanking.submit({leaving:true});}else liveRanking.update();});
window.addEventListener('pagehide',()=>{liveRanking.clear();rankingBroadcast.clear();void liveRanking.submit({leaving:true});});
window.addEventListener('online',()=>liveRanking.resume());
let lastMood=null;
const bucket=n=>n<25?'0-24':n<50?'25-49':n<75?'50-74':'75-100';
function track(name,target,detail={},key){try{if(key)telemetry.emit(name,target,{detail,dedupeKey:state.runId+':'+key});else telemetry.action(name,target,detail);}catch{/* Statistics never block game progress. */}}
function trackExit(t){if(t)track('trade_close',t.type,{direction:t.direction===1?'long':'short',pnlBucket:pnlBucket(t.pnl),leverage:t.leverage},`exit:${state.day}:${t.positionId||t.id||'legacy'}:${t.type}:${t.margin}:${t.pnl}`);}
const bgm=new BgmPlayer({onUpdate:state=>setText('music-open',state.playing?'音乐 · 开':state.loading?'音乐 · 载入':'背景音乐')});
const audio = new FXAudio();
audio.configure({sound,soundVolume:.5});
const narrativeCues=createNarrativeCueGate({play:(kind,opts)=>audio.effect(kind,opts)});
const voice=new VoicePlayer({onUpdate:()=>render(),onPlay:line=>track('voice_play',line.id,{mood:mood(state),dialogueId:line.id}),onReject:line=>track('voice_rejected',line.id,{reason:'playback-unavailable',dialogueId:line.id})});
const motion = new GameMotion();motion.configure(fullMotion,true);document.body.classList.toggle('motion-full',fullMotion);
const moodInfo = MOODS;
const selectVoiceContext=createVoiceContextSelector();
const floatingReaction=createFloatingReaction();
const tradingExpression=mountTradingExpression({portrait:$('portrait').parentElement,speech:$('speech'),getState:()=>state,canEnter:()=>!actionBusy&&!saveSession.blocked&&tradingOpen(state)});
for(const direction of ['long','short'])tradingExpression.bind($(direction),direction);
const liquidationSequence=mountLiquidationSequence({host:$('position-card'),getContext:()=>`${stateGeneration}:${state.mode}:${state.runId}:${state.day}:${state.phase}`,isBlocked:()=>saveSession.blocked||document.hidden||!tradingOpen(state),reduced:()=>!motion.enabled||!fullMotion,format:signed,onSettle:receipt=>terminalFeedback({type:'close',...receipt,liquidated:true}),onEmotion:trades=>tradingExpression.trade(trades)});
const emotionOverview=createEmotionOverview();
const closeAllControl=createCloseAllControl({getContext:()=>({
  token:closeAllToken({generation:stateGeneration,mode:state.mode,runId:state.runId,day:state.day,positions:positionsOf(state)}),
  canClose:canCloseAtKnownQuote(state)&&!actionBusy&&!saveSession.blocked&&!document.hidden&&!closeAllModalOpen(document)
}),guard:guardProgress,close:button=>sendAction('close',null,button)});
closeAllControl.bind($('position-close-all'));
const floatingRisk=createFloatingRisk({closeControl:closeAllControl,getRiskContext:()=>closeAllToken({generation:stateGeneration,mode:state.mode,runId:state.runId,day:state.day,positions:positionsOf(state)})});
let staminaFatigue=null;
let lotteryCardUI=null,lotteryRevealUI=null,lotteryRevealSavePending=false;
const lotteryAnnounced=new Set((state.lottery?.tickets||[]).filter(t=>t.status==='settled').map(t=>t.id));
const actionCardContext=()=>`${stateGeneration}:${state.mode}:${state.runId}:${state.day}`;
const singleActionCard=mountSingleActionCard({getModel:()=>({
  mode:state.mode,sanity:state.sanity,stamina:staminaStatus(state),energyStage:staminaStatus(state).energyStage,positions:positionsOf(state),risk:accountLiquidationEstimate(state),context:actionCardContext(),
  portfolioToken:closeAllToken({generation:stateGeneration,mode:state.mode,runId:state.runId,day:state.day,positions:positionsOf(state)}),
  active:['decision','playing'].includes(state.phase)&&!saveSession.blocked,
  canRest:!actionBusy&&!saveSession.blocked&&staminaStatus(state).canRest,
  canFinishDay:!actionBusy&&!progressRestoreBusy&&!saveSession.blocked&&canCloseAtKnownQuote(state),
  blinkAllowed:!actionBusy&&!saveSession.blocked
}),closeControl:closeAllControl,onRest:requestRestFromCard,onFinishDay:({context})=>{if(context===actionCardContext())$('finish-day').onclick();},motionEnabled:()=>motion.enabled&&fullMotion});
function updateLegacyRestControl(){
  const button=$('finish-day'),endless=state.mode==='endless',rest=endless&&document.body.dataset.frontend!=='pixel'&&staminaStatus(state).low;
  button.hidden=document.body.dataset.frontend==='pixel'||endless&&!rest;
  button.disabled=actionBusy||progressRestoreBusy||saveSession.blocked||(rest?positionsOf(state).length>0||!['decision','playing'].includes(state.phase):endless||!canCloseAtKnownQuote(state));
  setText('finish-day',rest?'去休息':'提前收盘');
  button.title=rest?(positionsOf(state).length?'先平仓，再休息':'休息一下，恢复体力'):'按当前报价全平并计入手续费和借款利息，复盘与剧情后结清今天生活费';
}
function updateActionViews(){
  const energy=staminaStatus(state).energyStage||{};setText('energy-stage-hint',energy.label?`${energy.label} · ${energy.phase==='fatigue'?'盯盘耗体增加':'随后会进入疲劳期'}`:'');$('energy-stage-hint').hidden=!energy.label;
  updateLegacyRestControl();
  // Pixel has one fixed action lane. The original skin retains its risk floater.
  floatingRisk.update(document.body.dataset.frontend==='pixel'?null:accountLiquidationEstimate(state));
  singleActionCard.refresh();staminaFatigue?.refresh();
}
document.addEventListener('kurumi:frontendchange',updateActionViews);
document.addEventListener('beforetoggle',event=>{if(event.target?.tagName==='DIALOG'&&event.newState==='open')suspendStaminaWatching(state);},true);
function requestRestFromCard({context}){
  if(context!==actionCardContext()||actionBusy||document.hidden||closeAllModalOpen(document)||positionsOf(state).length||!guardProgress())return;
  actionBusy=true;marketClock.stop();let result;
  try{
    result=requestStaminaRest(state);
    if(result.applied){
      audio.unlock();
      if(!result.endless){
        track('transition','daily-settlement',{kind:'settlement',reason:'begin'},`settle:${state.day}`);
        track('day_end','day',{mood:mood(state),equityBucket:capitalBucket(equity(state)),pnlBucket:pnlBucket(result.report?.net||0)},`day-end:${state.day}`);
      }
    }
  }catch(error){toast(error.message,'loss');}
  finally{actionBusy=false;render();}
  if(result?.applied&&!result.endless)showDaySettlement();
}

bindFloatingDismissal({element:$('trade-toast'),getPresentation:()=>toastTimer,dismiss:()=>{clearTimeout(toastTimer);$('trade-toast').hidden=true;}});
bindFloatingDismissal({element:$('news-flash'),getPresentation:()=>shownFlashTimer,dismiss:()=>{clearTimeout(shownFlashTimer);$('news-flash').hidden=true;}});
const shouldAnimate=()=>motion.enabled&&fullMotion;
const historicalGapTransition=createHistoricalGapTransition({elements:()=>[$('chart'),$('price')],animate:(...args)=>motion.animate(...args),enabled:()=>shouldAnimate()&&!document.hidden});
const eventComics=createEventComicPresenter({initialState:state,getContext:()=>`${stateGeneration}:${state.mode}:${state.runId}`,isBlocked:()=>saveSession.blocked,isPaused:()=>state.ending?.immediate===true,onReceipts:()=>syncEveningReceipts(),onAutoShown:()=>{void persist();},onIdle:()=>{marketClock.reschedule();continueScenes();}});
const investorDanmaku=createInvestorDanmaku($('investor-danmaku'),{onOpenComment:row=>openDetails(row.alias,[row.text])});
mountPlayerComments($('player-comments'),{onFailure:reportFailure,onPublicRows:rows=>investorDanmaku.setPlayerComments(rows)});
document.addEventListener('visibilitychange',()=>renderInvestors());
const sharedReplay=createSharedReplayController({config:SHARED_REPLAY_CONFIG,
 getContext:()=>({state,session:saveSession,generation:stateGeneration}),
 canRun:()=>pixelFrontend?.active===true&&actualPageActive&&!document.hidden&&!actionBusy&&!progressRestoreBusy&&!state.marketPaused&&marketPlaybackOpen(state)&&!document.querySelector('dialog[open]'),
 persist,onTick:result=>{if(result)afterTick(result,{paint:false,deferPaint:true});render();if(result?.dayEnded||state.phase==='closing')continueScenes();},onError:()=>{state.marketPaused=true;render();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)sharedReplay.pause();else sharedReplay.sync();});
window.addEventListener('pagehide',()=>sharedReplay.pause());
window.addEventListener('pageshow',()=>sharedReplay.sync());
const replayDialogs=new MutationObserver(()=>sharedReplay.sync());
replayDialogs.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
const actualMarketSource=createBiquoteSource();
const chartQuoteLabel=createChartQuoteLabel();
const actualMarketHistory=createLiveChartHistory({onChange:()=>render(),isCurrent:context=>state===context.state&&stateGeneration===context.generation&&state.runId===context.runId&&isOrdinaryLive(state)&&activeMarket(state)===context.symbol&&(state.candlePeriod??15)===context.minutes});
let actualSourceActive=false,actualHeartbeat=null,actualTarget=null,actualPaintMs=1000,actualPageActive=true,actualNeedsSync=false;
function syncLiveSource(){
 sharedReplay.sync();
 if(isOrdinaryLive(state)&&(actualTarget!==state||actualNeedsSync)){actualTarget=state;actualNeedsSync=false;const target=state;queueMicrotask(()=>{if(target===state&&!actionBusy&&!saveSession.blocked){const result=applyLiveMarketSnapshot(state,actualMarketSource.all(),{watching:!document.hidden&&!closeAllModalOpen(document)});if(result)afterTick(result,{paint:false,deferPaint:true});render();}else actualNeedsSync=true;});}
 const shouldRun=isOrdinaryLive(state)&&!state.liveSuspension?.active&&!saveSession.blocked&&state.phase!=='ending'&&!document.hidden&&actualPageActive;
 if(shouldRun&&!actualSourceActive){actualSourceActive=true;actualMarketSource.start();}
 if(shouldRun&&(actualHeartbeat===null||actualPaintMs!==quoteRefreshMilliseconds(state))){if(actualHeartbeat!==null)clearInterval(actualHeartbeat);actualPaintMs=quoteRefreshMilliseconds(state);actualHeartbeat=setInterval(()=>{if(actualSourceActive&&!actionBusy&&guardProgress()){actualNeedsSync=false;const result=applyLiveMarketSnapshot(state,actualMarketSource.all(),{watching:!document.hidden&&!closeAllModalOpen(document)});if(result)afterTick(result,{paint:false,deferPaint:true});render();if(result?.dayEnded||state.phase==='closing')continueScenes();}},actualPaintMs);}
 else if(!shouldRun&&actualSourceActive){actualSourceActive=false;actualMarketSource.stop();if(actualHeartbeat!==null)clearInterval(actualHeartbeat);actualHeartbeat=null;}
}
actualMarketSource.subscribe(snapshots=>{
 if(!isOrdinaryLive(state)||saveSession.blocked||document.hidden)return;
 if(actionBusy){actualNeedsSync=true;return;}
 const result=applyLiveMarketSnapshot(state,snapshots,{watching:!document.hidden&&!closeAllModalOpen(document)});
 if(result)afterTick(result,{paint:false,deferPaint:true});
 render();if(result?.dayEnded||state.phase==='closing')continueScenes();
});
const marketClock=new MarketClock({
  canRun:()=>!isLiveMarket(state)&&!saveSession.blocked&&marketPlaybackOpen(state)&&!state.marketPaused&&!document.hidden,
  canStep:()=>!actionBusy&&!document.querySelector('dialog[open]')&&!staminaFatigue?.refresh(),
  interval:()=>isHistorical(state)?historicalStepMilliseconds(state,speed):quoteStepMilliseconds(state.script,speed),
  step:()=>{if(!guardProgress())return;const result=isHistorical(state)?advanceHistoricalPlayback(state,advanceQuote,{speed}):advanceQuote(state);if(!result)return;if(result.logicalSecondEnded||result.exits?.length||result.flash)afterTick(result,{paint:false});if(!marketPlaybackOpen(state)){continueScenes();void ensureHistoricalLoaded();}else if(isHistorical(state)&&!hasHistoricalFeed(state))void ensureHistoricalLoaded();},
  paintInterval:()=>quoteRefreshMilliseconds(state),
  paint:()=>{if(guardProgress())render();},
  onError:error=>{state.marketPaused=true;render();toast('行情暂缓：'+error.message,'loss');}
});
staminaFatigue=mountStaminaFatigue({getState:()=>state,canPresent:()=>!actionBusy&&!saveSession.blocked,
 canAdvance:s=>!s.marketPaused&&marketPlaybackOpen(s),advance:advanceQuote,
 onTick:result=>afterTick(result,{paint:false,deferPaint:state.stamina?.fatigue?.phase==='done'}),onChange:()=>{void persist();},
 onComplete:()=>{render();marketClock.start();continueScenes();void ensureHistoricalLoaded();},
 onError:error=>{state.marketPaused=true;render();toast('行情暂缓：'+error.message,'loss');},motionEnabled:()=>motion.enabled&&fullMotion});
function marketStatus(){
  $('terminal').dataset.marketSource=marketSourceOf(state);
  const sourcePresentation=renderHistoricalSourceLabel($('beat-label'),state,{symbol:activeMarket(state),onExplain:message=>toast(message)});
  $('terminal').dataset.marketSourceLabel=sourcePresentation?.label||'';
  $('terminal').dataset.marketSourceDescription=sourcePresentation?.description||'';
  const paused=state.marketPaused,modal=!!document.querySelector('dialog[open]');
  setText('market-phase',saveSession.blocked?'存档已变更 · 本页暂停':tradingOpen(state)?paused?'点倍速继续行情':document.hidden?'后台暂缓':modal?'查看窗口 · 行情暂缓':marketRunningLabel(state):state.phase==='closing'?'今日收盘':'休市');
  renderHistoricalStatus();
  if(isOrdinaryLive(state)){const history=actualMarketHistory.metadata,q=liveQuote(state);$('terminal').dataset.marketSourceLabel=!q?'等待行情':q.providerMarketState==='closed'?'休市报价':liveTradingReady(state)?'实时真实':'最后报价';setText('market-phase',saveSession.blocked?'存档已变更 · 本页暂停':['day_end','resting','closing','ending'].includes(state.phase)?'今日收盘':liveStatusLabel(state));const recent=history.symbol===activeMarket(state)?history.status==='ready'?'近期K线来自 biquote 历史数据，仅供图表显示':history.status==='unavailable'||history.status==='empty'?'近期K线暂不可用，仅显示已收报价':'近期K线载入中':'';setText('market-disclosure','原创同人小游戏 · 非官方作品 · biquote 券商指示行情 · 非投资建议'+(recent?' · '+recent:''));}
  if(isSharedReplay(state)){const p=sharedReplayPresentation(state,activeMarket(state));$('terminal').dataset.marketSourceLabel=p.label;setText('market-disclosure',p.description);setText('market-phase',state.liveMarket.replay.resetRequired?'回放已暂停':p.label);}
  for(const button of document.querySelectorAll('[data-speed]')){button.hidden=isLiveMarket(state);button.disabled=isLiveMarket(state);}syncLiveSource();
  setText('quote-package-open',candlePeriodLabel(state));$('quote-package-open').title='点击切换：日K → 15分钟 → 5分钟 → 1分钟';$('quote-package-open').disabled=actionBusy;$('quote-package-open').setAttribute('aria-label','切换K线周期，当前 '+candlePeriodLabel(state));renderQuoteRefreshChoices();
  updateLegacyRestControl();
}

const saveIndicator=createSaveIndicator($('saved'));
function updateSaveStatus(){
  const blocked=saveSession.blocked;
  const {warning}=saveIndicator.update(saveSession);
  $('storage-warning').hidden=!warning;$('storage-warning-panel').hidden=!warning;
  setText('storage-warning',saveWarning(saveSession,UI_COPY.storageWarning));
  closeAllControl.refresh();
  if(blocked){
    eventComics.invalidate();marketClock.stop();audio.pause();voice.stop();bgm.pause({remember:false});marketStatus();
    setText('save-conflict-copy',saveSession.status==='invalid'?'当前存档损坏、模式不匹配，或来自更新版本。为保护原数据，本页不会覆盖它。请先下载备份，修复后再重试载入。':'其他页面已更新此模式的存档。本页已暂停，未覆盖最新进度。你可以先下载本页备份，再载入最新存档；载入会替换本页进度。');
    if(!$('save-conflict-dialog').open)$('save-conflict-dialog').showModal();
  }
}
function guardProgress(){const ok=saveSession.check();if(!ok){updateSaveStatus();}return ok;}
let progressRestoreBusy=false;
function persist(){captureMarket(state);if(progressRestoreBusy)return Promise.resolve(false);const targetState=state,session=saveSession,generation=stateGeneration,comicTicket=eventComics.capture(state),contextualTicket=contextualMangaDelivery.capture(state),pending=session.save(state);updateSaveStatus();return pending.then(saved=>{if(targetState.liveMarket?.version===2)sharedReplay.saved({state:targetState,session,generation},saved);if(session===saveSession){updateSaveStatus();if(generation===stateGeneration){eventComics.commit(comicTicket,saved);if(saved)lifeSceneMemory.confirm();if(contextualMangaDelivery.commit(contextualTicket,{saved,state,blocked:saveSession.blocked}))syncContextualDaily();}}return saved;});}
// All state-changing controls, including keyboard-triggered clicks and forms,
// are checked before their handlers. Timer/scene mutations also check explicitly.
for(const type of ['click','submit','input','change','cancel'])document.addEventListener(type,event=>{
  if(event.target.closest?.('#save-restore-dialog')||event.target.closest?.('#save-conflict-dialog')||event.target.closest?.('[data-save-backup]'))return;
  if(!guardProgress()){event.preventDefault();event.stopImmediatePropagation();}
},true);
const emotionControls=createEmotionControls({getState:()=>state,getLimits:()=>restrictions(state),
  getContext:button=>({hardBlocked:!tradingOpen(state)||actionBusy||saveSession.blocked||accountMetrics(state).availableMargin<100*(1+Number(button?.dataset.leverage??leverage)*.00005),emotion:mood(state),profit:tradingProfit(state),unrealized:currentNetFloating()}),
  canInteract:()=>guardProgress()&&!actionBusy,onChange:result=>{if(result.accepted)mentalState(state);render();},audio,motion,motionEnabled:shouldAnimate});
window.addEventListener('storage',event=>{if(storageEventMatches(event.key,saveKey)||storageEventMatches(event.key,saveSession.legacyKey))guardProgress();});
function downloadProgressBackup(){
  const url=URL.createObjectURL(new Blob([JSON.stringify(saveSession.backup(state),null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.dataset.saveBackup='';link.href=url;link.download=`FX-${selectedMode}-进度备份.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
for(const button of document.querySelectorAll('[data-save-backup]'))button.onclick=downloadProgressBackup;
$('save-retry').onclick=async()=>{const generation=stateGeneration,saved=await persist();if(saved&&generation===stateGeneration&&state.phase==='ending'&&!saveSession.blocked)void rankingLifecycle.submit();};
$('save-conflict-dialog').addEventListener('cancel',event=>event.preventDefault());
$('save-load-latest').onclick=()=>{
  const loaded=saveSession.reload();
  if(!loaded.ok){setText('save-conflict-copy',loaded.reason==='storage'?'浏览器仍无法读取存档。请保留本页，可先下载进度备份，再重试。':'当前存档仍无法识别，未覆盖任何数据。请先下载备份，修复后再重试。');return;}
  applyLoadedProgress(loaded.state);
};
function applyLoadedProgress(loadedState){
  stateGeneration++;marketClock.stop();state=enableRealtime(loadedState||fresh());state.runId||=randomUUID();
  telemetry.setTestMode(isDevelopmentRun());voice.stop();floatingReaction.reset();lastMood=null;actionBusy=false;orderAmount=draftOrderAmount(state);$('order-amount').value=orderAmount;
  for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
  $('last-trade').textContent='';render();continueScenes();void ensureHistoricalLoaded();marketClock.start();
  const restoredGeneration=stateGeneration;queueMicrotask(()=>{if(restoredGeneration===stateGeneration)void retryLotteryDisqualification();});
}
mountProgressRestore({document,restore:restoreGame,isHistorical,marketSourceOf,getContext:()=>({session:saveSession,key:saveKey,mode:selectedMode,historical:selectedMarket==='historical',source:selectedMarket,generation:stateGeneration,day:state.day}),onError:message=>toast(message,'loss'),apply:async(candidate,context,expectedRaw)=>{
 if(actionBusy||progressRestoreBusy||context.session!==saveSession||context.generation!==stateGeneration)return false;
 progressRestoreBusy=true;actionBusy=true;marketClock.stop();
 try{const saved=await context.session.replaceFromBackup(candidate,expectedRaw);if(!saved)return false;applyLoadedProgress(candidate);modeStates.set(slot(selectedMode),state);toast('已从备份恢复进度');return true;}
 finally{progressRestoreBusy=false;actionBusy=false;updateSaveStatus();marketClock.reschedule();}
}});

function currentNarrativeAudio(){return narrativeAudioContext(state,{dayOpen:$('day-dialog').open,livingVisible:!$('living-receipt').hidden,propOpen:$('prop-dialog').open,propKind:$('prop-dialog').dataset.kind});}
function syncSceneMusic(){const sceneCue=currentNarrativeAudio()?.cue;void bgm.setScene(selectBgmScene(state,{sceneCue,accountEquity:equity(state),netFloating:currentNetFloating()}),{stabilize:!sceneCue&&['decision','playing'].includes(state.phase)});}
function syncVoiceDuck(){bgm.setVoiceActive(voiceMixActive(voice,document.querySelectorAll('audio[data-voice-id]')));}
function currentNetFloating(){return positionsOf(state).reduce((sum,position)=>sum+positionNetUnrealized(state,position),0);}
function currentRisk(){return Math.round(accountMetrics(state).usedMargin/Math.max(accountMetrics(state).tradingEquity,1)*100);}
function selectedOrder(type='long'){return {type,leverage,stop,stopPips,...orderIntentAction(state,orderAmount)};}
function refreshOrderIntent(){if(!orderDraftIntent(state))return;orderAmount=orderPreview(state,selectedOrder()).margin;$('order-amount').value=Number.isFinite(orderAmount)?orderAmount:'';}
function renderLiveOrderTicket(){refreshOrderIntent();const long=orderPreview(state,selectedOrder('long')),short=orderPreview(state,selectedOrder('short')),blocked=!tradingOpen(state)||actionBusy||saveSession.blocked;$('long').disabled=blocked||!long.valid;$('short').disabled=blocked||!short.valid;setText('order-validation',!long.valid&&!short.valid?long.error:'');$('order-validation').hidden=long.valid||short.valid;setText('preview-margin',yen(long.margin||0));setText('preview-notional',yen(long.notional||0));setText('preview-quantity',`${formatQuantity(long.quantity||0)} ${marketInfo(activeMarket(state)).base}`);setText('preview-fee',yen(long.openFee||0));setText('preview-debit',yen(long.totalDebit||0));setText('amount-selected',yen(orderAmount||0));renderAmountPresets(equity(state),Math.max(long.maxMargin||0,short.maxMargin||0),!blocked&&!restrictions(state).noEntry);renderPercentageOrderControl({document,amount:orderAmount,availableMargin:long.availableMargin,cap:Math.max(long.maxMargin||0,short.maxMargin||0),enabled:!blocked&&!restrictions(state).noEntry,blockedReason:saveSession.blocked?'进度尚未保存，请先处理保存提示。':actionBusy?'当前操作尚未结束，稍后再选额度。':!tradingOpen(state)?'当前不能新开仓。':restrictions(state).noEntry?'当前状态不能新开仓，恢复后可调整额度。':'',intent:orderDraftIntent(state),format:yen});return{long,short};}
function renderAmountPresets(totalAssets,cap,enabled){
 const amounts=orderAmountPresets(totalAssets);
 for(const [index,button] of [...document.querySelectorAll('[data-amount-preset]')].entries()){
  const amount=amounts[index];
  button.dataset.amountPreset=String(amount);
  button.textContent=amount>=1e8?`¥${amount/1e8}亿`:amount>=1e7?`¥${amount/1e4}万`:yen(amount);
  button.setAttribute('aria-label',`保证金 ${yen(amount)}`);button.title=yen(amount);
  button.disabled=!enabled||!Number.isFinite(cap)||cap<100||amount>cap;
  button.setAttribute('aria-pressed',String(amount===orderAmount));
 }
}
function selectedPercentage(){return (orderAmountRatio(orderAmount,accountMetrics(state).availableMargin)||0)*100;}
function setText(id,value){const element=$(id);if(element&&element.textContent!==String(value??''))element.textContent=value;}
let marketViewport;
const chartRenderState=createChartRenderState();
const chartHeartbeat=createChartRiskHeartbeat();
function chart(){
  if(!marketViewport){marketViewport=createChartViewport(document,{onChange:()=>chart()});$('chart').parentElement.before(marketViewport.root);marketViewport.root.prepend($('quote-package-open'));$('quote-package-open').after($('quote-refresh-options'));}
  const candles=isOrdinaryLive(state)?actualMarketHistory.view({state,generation:stateGeneration,symbol:activeMarket(state),minutes:state.candlePeriod??15},state.candles):(actualMarketHistory.cancel(),displayCandles(state));
  marketViewport.update(candles.length,`${state.mode}:${state.runId}:${state.candlePeriod??15}`);

  const quoteLabel=chartQuoteLabel(state,isSharedReplay(state)?{sourceMode:'replay',referenceClock:state.liveMarket.replay.playbackClock}:{}),displayedPrice=isLiveMarket(state)?quoteLabel.priceValue:state.price;
  const chartElement=$('chart'),dark=chartElement.ownerDocument?.body?.dataset?.frontend!=='pixel';
  chartElement.style.height=marketViewport.state.height+'px';
  const width=chartElement.clientWidth,height=chartElement.clientHeight||marketViewport.state.height;
  const settings=[state.mode,state.runId,state.candlePeriod??15,activeMarket(state),state.liveMarket?.version===1,displayedPrice,dark,width,height,marketViewport.state.count,marketViewport.state.offset,marketViewport.state.zoom,marketViewport.state.height,maSettings[5],maSettings[10],maSettings[20]];
  // Orders and risk views still refresh on every trade. Only unchanged price
  // geometry is reused; closed bars, older-bar corrections and controls count.
  setText('trading-clock-label',formatTradingTime(currentTradingTimestamp(state),{full:true})+' · '+candlePeriodNotice(state,{includeTimeZone:false}));
  if(chartRenderState.matches(candles,settings,chartElement.firstChild)){renderChartQuoteLabel(chartElement,quoteLabel);return;}
  const averages=movingAverageSeries(candles);
  for(const average of averages){const button=$('ma-'+average.period);button.setAttribute('aria-pressed',String(maSettings[average.period]));button.style.setProperty('--ma-color',average.color);setText('ma-value-'+average.period,average.latest===null?'—':quote(average.latest));}
  const view=candlePlot(candles,averages.filter(a=>maSettings[a.period]),{...marketViewport.state,dark,width,height,headerHeight:48,currentPrice:displayedPrice,id:'market',symbol:activeMarket(state),timeLabel:state.liveMarket?.version===1?'报价时间 JST':'游戏时间 JST'});
  $('chart').innerHTML=state.liveMarket?.version===1&&!candles.length?'':view.html;$('chart').style.height=marketViewport.state.height+'px';
  $('chart').setAttribute('aria-label',`${activeMarket(state)} 已发生行情，现价 ${quote(displayedPrice)} 日元/${marketInfo(activeMarket(state)).name}；绿色为收盘不低于开盘，粉色为收盘低于开盘。${view.notice}`);
  renderChartQuoteLabel(chartElement,quoteLabel);
  chartRenderState.commit(candles,settings,chartElement.firstChild);
}
let mainReturnHelp;
function renderReturnHelp(daily,performance){
  const host=$('day-return-group');if(!host)return;
  const formula=returnFormula({daily:{tradingNet:daily.tradingNet,returnDenominator:daily.denominator,returnRate:daily.returnRate,returnUnavailable:daily.returnUnavailable,openingNominal:state.dayOpening},cumulative:{realizedProfit:performance.totalProfit,returnDenominator:performance.initialEquity,returnRate:performance.returnRate}},state.mode==='endless'?'cumulative':'today',{settled:false});
  if(!mainReturnHelp){mainReturnHelp=createFormulaHelp(document,formula);host.append(mainReturnHelp);}else mainReturnHelp.updateFormula(formula);
}
function renderQuoteFrame(){
  if(saveSession.blocked)return;
  const metrics=accountMetrics(state),orders=positionsOf(state),enabled=canCloseAtKnownQuote(state)&&!actionBusy,account=equity(state);
  setText('price',quote(state.price));setText('inverse-rate',`1 ${marketInfo(activeMarket(state)).name} = ${quote(state.price)} 日元`);
  const base=state.candles.findLast(c=>c.day!==state.day)?.close||150,change=(state.price/base-1)*100;
  setText('change',`${change>=0?'+':''}${change.toFixed(3)}%`);$('change').className=change>=0?'positive':'negative';
  setText('equity',yen(account));setText('net-assets',yen(account-debtSummary(state).total));setText('available-margin',yen(metrics.availableMargin));
  setText('floating',signed(metrics.unrealized));$('floating').className=metrics.unrealized>=0?'positive':'negative';
  setText('margin-level',orders.length?`${(metrics.marginLevel*100).toFixed(1)}%`:'— 无持仓');
  renderLiveOrderTicket();const actualRatio=orderAmountRatio(orderAmount,metrics.availableMargin),highlightRatio=nearestOrderRatio(orderAmount,metrics.availableMargin);
  setText('stake-value',actualRatio===null?'—':`${Number((actualRatio*100).toFixed(2))}%`);for(const button of document.querySelectorAll('[data-stake]'))button.setAttribute('aria-pressed',String(Number(button.dataset.stake)===highlightRatio));
  renderCharacter();renderPositions(orders,enabled);updateActionViews();renderRiskAlerts();chart();pixelFrontend?.refresh();
}
function renderPositions(orders,enabled){
  const box=$('position-list'),ids=new Set(orders.map(p=>p.id)),accountRisk=accountLiquidationEstimate(state);
  const accountRisks=new Map([[activeMarket(state),accountRisk]]);
  const marketRisk=symbol=>{if(!accountRisks.has(symbol))accountRisks.set(symbol,accountLiquidationEstimate(state,null,symbol));return accountRisks.get(symbol);};
  for(const row of [...box.children])if(!ids.has(row.dataset.orderId))row.remove();
  for(const p of orders){
    let row=[...box.children].find(el=>el.dataset.orderId===p.id);
    if(!row){
      row=document.createElement('article');row.className='order-row';row.dataset.orderId=p.id;
      const head=document.createElement('div');head.className='order-row-head';
      const title=document.createElement('b'),tag=document.createElement('span'),detail=document.createElement('button');
      title.dataset.orderTitle='';tag.dataset.orderLeverage='';detail.className='help-dot';detail.textContent='?';detail.dataset.positionDetail=p.id;detail.setAttribute('aria-label',`查看订单 ${p.id} 详情`);head.append(title,tag,detail);row.append(head);
      for(const [field,label] of [['pnl','浮动盈亏'],['margin','保证金'],['stop','止损'],['entry','建仓价'],['current','当前价'],['quantity','数量']]){
        const line=document.createElement('div');line.className='order-row-data';const key=document.createElement('span'),val=document.createElement('b');key.textContent=label;val.dataset.orderField=field;if(field==='pnl')line.classList.add('order-live-pnl');if(['entry','current','quantity'].includes(field))line.classList.add('order-pixel-data');line.append(key,val);row.append(line);
      }
      const actions=document.createElement('div');actions.className='order-row-actions';
      for(const [action,label] of [['half','本单减半'],['close','本单平仓']]){const b=document.createElement('button');b.dataset.positionId=p.id;b.dataset.positionAction=action;b.textContent=label;actions.append(b);}row.append(actions);
      const bar=document.createElement('div');bar.className='stop-progress';bar.append(document.createElement('i'));row.append(bar);box.append(row);
    }
    row.querySelector('[data-order-title]').textContent=`#${p.id} · ${positionMarket(p)} · ${p.direction===1?'↗':'↘'} ${directionLabel(p.direction,positionMarket(p))}${p.pnlModel==='legacy-inverse-v5'?' · 旧版结算':''}`;
    row.querySelector('[data-order-leverage]').textContent=`${Number(p.leverage.toFixed(1))}×`;
    const net=positionUnrealized(state,p),loss=positionStopLoss(p),pnl=row.querySelector('[data-order-field="pnl"]');
    pnl.textContent=signed(net);pnl.className=net>=0?'positive':'negative';
    row.querySelector('[data-order-field="margin"]').textContent=yen(p.margin);
    row.querySelector('[data-order-field="entry"]').textContent=quote(p.entry);
    row.querySelector('[data-order-field="current"]').textContent=quote(marketPrice(state,positionMarket(p)));
    const quantity=positionQuantity(p);
    row.querySelector('[data-order-field="quantity"]').textContent=quantity===null?'旧版合约':`${formatQuantity(quantity)} ${marketInfo(positionMarket(p)).base}`;
    row.querySelector('[data-order-field="stop"]').textContent=Object.hasOwn(p,'stopPips')&&p.stopPips!==null?`${p.stopPips} 点 · 约 −${yen(loss)}`:p.stop===1?'不预设':`约 −${yen(loss)}`;
    for(const b of row.querySelectorAll('[data-position-action]'))b.disabled=actionBusy||!canCloseAtKnownQuote(state,p.id);
    renderPositionRisk(row.querySelector('.stop-progress'),positionRiskView(p,{price:marketPrice(state,positionMarket(p)),grossPnl:net,stopLoss:loss,accountEstimate:state.marketBook?marketRisk(positionMarket(p)):accountRisk}));
  }
}
function openDetails(title,lines,source=null,extra=null){
  setText('detail-title',title);const box=$('detail-copy');box.replaceChildren();for(const text of lines){const p=document.createElement('p');p.textContent=text;box.append(p);}if(extra){const copy=extra.cloneNode(true);copy.hidden=false;copy.removeAttribute('id');for(const node of copy.querySelectorAll('[id]'))node.removeAttribute('id');box.append(copy);}if(source){const a=document.createElement('a');a.textContent=source[0]+' ↗';a.href=source[1];a.target='_blank';a.rel='noopener';box.append(a);}$('detail-dialog').showModal();
}
const newsDetails=mountNewsDetails({document,openDetails});
const mobileNews=mountMobileNewsList({document,onClose:()=>continueScenes()});
function openPositionDetail(id){
  const p=positionsOf(state).find(p=>p.id===id);if(!p)return;
  const notional=p.notional??p.margin*p.leverage,legacy=p.pnlModel==='legacy-inverse-v5',symbol=positionMarket(p),info=marketInfo(symbol);
  const lines=[`${directionLabel(p.direction,symbol)}：${p.direction===1?'买入'+info.name+'、卖出日元':'卖出'+info.name+'、买入日元'}。`,`开仓 ${symbol} ${quote(p.entry)}，当前 ${quote(marketPrice(state,symbol))}，单位为日元/${info.name}。`,`保证金 ${yen(p.margin)}，开仓日元名义仓位 ${yen(notional)}。`];
  if(legacy)lines.push('旧存档持仓沿用旧版反向合约结算，保留原有盈亏。');
  else lines.push(`${info.name}数量 ${formatQuantity(positionQuantity(p))} ${info.base}；日元浮动盈亏 = 基础货币数量 ×（当前价 − 开仓价）× 方向（做多 +1，做空 −1）。`);
  lines.push(`已付开仓费用 ${yen(p.openFee||0)}，预计平仓费用 ${yen(notional*.00005)}。`,Number.isFinite(p.stopPrice)?`止损价 ${symbol} ${quote(p.stopPrice)} 日元/${info.name}。`:'未设置固定止损价。','浮动盈亏尚未扣除预计平仓费用。费用采用简化模型，开平各收开仓日元名义仓位的 0.005%。');
  if(state.marketBook&&positionsOf(state).some(other=>positionMarket(other)!==symbol))lines.push(`本单显示的账户强平距离只改变 ${symbol} 报价，假定其他币对报价不变；其他持仓波动时，这个估算也会变化。`);
  openDetails('订单 #'+p.id,lines);
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-help]');if(!b)return;const key=b.dataset.help,h=TERMINAL_HELP[key];if(h)openDetails(h.title,h.lines,h.source,key==='account'?$('account-details'):key==='order'?$('order-details'):key==='mental'?$('mental-detail'):null);});
const marketSelector=mountMarketSelector({select:$('market-symbol'),name:$('market-name'),getState:()=>state,canInteract:()=>!actionBusy&&!saveSession.blocked,onSelect:symbol=>{if(!guardProgress())return;try{if(selectMarket(state,symbol)){persist();render();}}catch(error){toast(error.message,'loss');}}});
const openingReader=mountOpeningReader({frame:$('opening-manga'),getState:()=>state,guard:guardProgress,save:persist,
  startingCapital:START,targetProfit:TARGET_PROFIT,
  openSource:(panel,note)=>panel?openMangaSource(panel,note):openDetails('关于这一页',[note],['原作背景 · 官方简介','https://fxkurumi-info.com/#introduction']),
  onFinish:()=>{continueScenes();}
});
function showOpening(options){if(state.mode==='endless')return;voice.stop();openingReader.open(options);}
let openingMode=selectedMode;
$('mode-open').onclick=()=>{openingMode=selectedMode;syncMarketSelectors('mode',selectedMarket);$('mode-dialog').showModal();};
function openMangaSource(p,reason){const img=document.createElement('img');setMangaImage(img,p.original,{loading:'eager'});img.alt='未经修改的原作来源图';img.style.width='100%';openDetails(`漫画来源 · 第 ${p.chapter} 话第 ${p.page} 页`,[`${p.character} / ${p.scene} / ${p.expression}`,reason,p.correction||p.meaning,'原图金额、图表与时间只属于漫画，不代表本局账户。'],['用户指定仓库 · 固定版本原文件',p.sourceURL],img);const shown=$('detail-copy').querySelector('img');if(shown)setMangaImage(shown,p.original,{loading:'eager'});}
function scenePortrait(s){return selectFinalPortrait(s,{sealedOutcome:sealedDailyMangaOutcome(s),floatingReaction:floatingReaction.observe(s)});}
function showPortraitSource(){const result=scenePortrait(state);if(result.kind==='manga')openMangaSource(result.panel,result.evidence);else{const image=document.createElement('img');setImage(image,result.path);image.style.width='100%';openDetails('素材出处',[result.sourceLabel,'本作角色插画'],null,image);}}

function setOpeningControlsBusy(busy){
 // Mode/restart waits share the action lock. Project it immediately: source
 // heartbeats skip while busy, so a previous render cannot clear these buttons.
 for(const id of ['mode-open','restart'])$(id).disabled=busy;
 if(busy)for(const id of ['long','short','hold','half','close','wait','position-close-all'])$(id).disabled=true;
 $('mode-start').disabled=busy;
 $('mode-restart').disabled=busy;
 for(const button of document.querySelectorAll('[data-play-mode], [data-market-prefix="mode"]'))button.disabled=busy;
}
for(const b of document.querySelectorAll('[data-play-mode]'))b.onclick=()=>{if(actionBusy)return;openingMode=b.dataset.playMode;refreshModeResumeLabels($('mode-market').value);};
$('mode-start').onclick=async()=>{
 if(actionBusy||!guardProgress())return;
 const mode=openingMode,market=$('mode-market').value,generation=stateGeneration,session=saveSession;let switched=false;
 actionBusy=true;setOpeningControlsBusy(true);marketClock.stop();
 try{
  const targetSession=sessionFor(mode,market),existing=(mode===selectedMode&&market===selectedMarket?state:modeStates.get(slot(mode,market)))||restoreGame(targetSession.raw);
  if(targetSession.blocked)throw Error('此模式的存档待处理，请先保留备份');
  const candidate=existing||fresh(mode,market==='historical'?await selectedHistoricalOptions('mode',mode):null,market);
  if(isHistorical(candidate))await historicalLibrary.restore(candidate);
  const saved=await persist();if(generation!==stateGeneration||session!==saveSession||saveSession.blocked)return;if(!saved)return;
  let selectedCandidate=candidate;if(candidate.liveSuspension?.active){selectedCandidate=structuredClone(candidate);resumeLiveRun(selectedCandidate);if(!await targetSession.save(selectedCandidate))throw Error('继续本局的进度尚未保存，请重试');if(generation!==stateGeneration||session!==saveSession)return;}
  modeStates.set(slot(selectedMode),state);selectedMode=mode;selectedMarket=market;saveKey=saveKeyFor(mode);saveSession=targetSession;stateGeneration++;switched=true;
  developerBackupKey=mode==='endless'?'fx-endless-developer-backup-v1':'fx-girl-developer-backup-v3';
  storage.setItem('fx-girl-mode',mode);storage.setItem('fx-girl-market-source',market);state=enableRealtime(selectedCandidate);state.runId||=randomUUID();modeStates.set(slot(mode,market),state);
  telemetry.setTestMode(isDevelopmentRun());voice.stop();floatingReaction.reset();lastMood=null;leverage=25;stopPips=30;stop=.5;orderAmount=draftOrderAmount(state);$('order-amount').value=orderAmount;
  $('mode-dialog').close();if(mode==='story'&&!state.openingSeen)showOpening();else continueScenes();
 }catch(error){setText('history-choice-status',error.message);}
 finally{setOpeningControlsBusy(false);if(switched||generation===stateGeneration&&session===saveSession){actionBusy=false;render();marketClock.start();if(switched)void retryLotteryDisqualification();}}
};
function checkAchievements(){
  const result=evaluateAchievements(state,achievementProfile);achievementProfile=result.profile;
  if(result.newlyUnlocked.length){try{storage.setItem(achievementKey,JSON.stringify(achievementProfile));}catch{}for(const def of result.newlyUnlocked){createAchievementToast(def);if(sound)soundEffect('terminal-fill',{level:.25});}}
  setText('achievement-count',String(Object.keys(achievementProfile.unlocked||{}).length));
  if($('achievements-dialog').open){renderAchievementBook($('achievement-book'),achievementProfile,state);mangaCollection?.refresh();}
}
function openAchievements(){renderAchievementBook($('achievement-book'),achievementProfile,state);mangaCollection?.showAchievements();$('achievements-dialog').showModal();}
async function openShare(variant='report'){
  if(typeof variant!=='string')variant='report';
  if(actionBusy||shareBusy)return;
  // One immutable capture per opening. Changing appearance never rereads live
  // market state or changes the report/ranking mode of the active preview.
  const snapshot=structuredClone(state),em=mood(snapshot),portrait=scenePortrait(snapshot);
  shareSession={snapshot,variant,options:{variant,equity:equity(snapshot),tradingProfit:tradingProfit(snapshot),unrealized:unrealized(snapshot),moodLabel:$('emotion-label').textContent||moodInfo[em]?.[0]||'平静',portraitUrl:assetURL(portrait.kind==='manga'?portrait.panel.original:portrait.path),portraitCrop:portrait.kind==='manga'?portrait.panel.cropPixels:null,gameUrl:location.href.split('#')[0],achievementProfile:structuredClone(achievementProfile),report:snapshot.dayReport,recap:structuredClone(dayRecapSnapshot||buildRecapSnapshot(snapshot))}};
  return renderShareStyle(shareStyle);
}
async function renderShareStyle(style){
  if(!shareSession||shareBusy)return;
  shareStyle=style==='pixel'?'pixel':'original';
  const session=shareSession,{snapshot,variant,options}=session,request=++shareRequest,dialog=$('share-dialog');
  setText('share-title',variant==='ranking'?'我的战绩':'这次的战报');
  dialog.dataset.reportStyle=shareStyle;
  for(const id of ['original','pixel'])$('share-style-'+id).setAttribute('aria-pressed',String(id===shareStyle));
  if(!dialog.open)dialog.showModal();
  shareFile=null;$('share-preview').hidden=true;$('share-actions').hidden=true;$('share-native').hidden=true;setText('share-status','正在制作战报…');
  try{
    const card=await createShareCard(snapshot,{...options,style:shareStyle});
    if(request!==shareRequest||session!==shareSession){URL.revokeObjectURL(card.url);return;}if(shareUrl)URL.revokeObjectURL(shareUrl);shareUrl=card.url;
    shareFile=buildShareFile(card);$('share-preview').src=shareUrl;$('share-preview').hidden=false;$('share-download').href=shareUrl;$('share-download').download=card.filename||`FX韭留美-第${snapshot.day}天.png`;$('share-original').href=shareUrl;$('share-actions').hidden=false;$('share-native').hidden=!canShareFile(shareFile);$('share-native').disabled=shareBusy;setText('share-status',(snapshot.developmentTaint||snapshot.developer?.edited)?'开发测试战报 · 不计入成就':'战报已生成，可保存原图');telemetry.hook('export_preview',{dedupeKey:String(request)});
  }catch(error){if(request!==shareRequest||session!==shareSession)return;telemetry.hook('export_failed');setText('share-status','战报生成失败：'+error.message);}
}
function syncDayReportPresentation(){
 const current=state.dayReport?.day===state.day&&['day_end','resting','ending'].includes(state.phase);
 dayRecapSnapshot=current?buildRecapSnapshot(state):null;
 const n=state.settlementNarrative,ready=state.mode==='story'&&n?.day===state.day&&n.fatherDiscovery&&n.effectsApplied&&state.family?.unlocked&&!state.fatherUsed;
 $('father-scene-use').hidden=!ready;$('father-scene-use').disabled=!ready;
 setText('father-scene-use','取用父亲的柜中存款 · 金额自选');
 if(dayRecapSnapshot){setText('day-total',yen(dayRecapSnapshot.account.nominalAssets));setText('day-net',`今日交易 ${signed(dayRecapSnapshot.daily.tradingNet)} · 累计已实现 ${signed(dayRecapSnapshot.cumulative.realizedProfit)}`);}
 pixelDialogController?.refreshSettlement();
}
function renderCharacter(){
  const trauma=tradingTrauma(state),portrait=scenePortrait(state),em=portrait.emotion||mood(state);
  setText('emotion-label',trauma.active?trauma.label:portrait.label||moodInfo[em]?.[0]||'平静');
  emotionOverview.render(state,em);document.body.dataset.trauma=trauma.active?trauma.mood:'';
  showGeneratedPortrait($('portrait'),portrait);
  const voiceContext=selectVoiceContext(state,{floating:currentNetFloating(),hasPositions:positionsOf(state).length>0});
  const voiced=voice.sync({enabled:!document.hidden&&!$('voice-library-dialog').open,emotion:em,speechId:state.speech?.id,run:state.runId,context:voiceContext});
  syncVoiceDuck();syncSceneMusic();
  const speech=trauma.active?trauma.line:voiced?.zh??portrait.line??'';setText('speech-content',speech);$('speech').hidden=!speech.trim();
  setText('voice-caption',voiced?`PV 原声 · ${voiced.speaker||'久留美'} · ${voiced.ja||''}`:'');$('voice-caption').hidden=!voiced;
  const available=voice.available(em),active=voice.loading||voice.playing;
  const voiceStatus=voice.lastError&&voice.lastError!=='no-match'?UI_COPY.voiceState[voice.lastError]:voice.loading?UI_COPY.voiceState.loading:voice.playing?UI_COPY.voiceState.playing:'';
  setText('voice-state',voiceStatus||'');$('voice-state').hidden=!voiceStatus;
  setText('voice-toggle',active?'停止原声':'播放当前原声');$('voice-toggle').hidden=!active&&!available.length;
  $('voice-toggle').disabled=!active&&!available.length;$('voice-toggle').setAttribute('aria-pressed',String(active));
  $('voice-toggle').title=active?'停止本段原声':available[0]?.zh||'';
  $('voice-replay').hidden=true;
}
function render(){
  if(!guardProgress())return;
  if(activeTradeImpact&&activeTradeImpactContext!==`${stateGeneration}:${state.mode}:${state.runId}:${state.day}`)clearTradeImpact();
  marketSelector.render();setText('ticket-symbol',activeMarket(state));setText('quantity-label',`${marketInfo(activeMarket(state)).name}数量（${marketInfo(activeMarket(state)).base}）`);
  liveRanking.update();if(!liveRankingEnabled()||document.hidden||document.querySelector('dialog[open]'))rankingBroadcast.clear();
  if(deferredScene?.key!==sceneKey())deferredScene=null;
  $('scene-resume').hidden=!deferredScene;
  const mental=mentalReadout(state),limit=restrictions(state);leverage=Math.max(limit.minLeverage,Math.min(leverage,limit.leverage));if(![5,10,25,50,100].includes(leverage))leverage=leverage<25?10:25;if(limit.forceNoStop){stopPips=null;stop=1;}
  const day=state.day,phase=state.phase,position=state.position,marketPlaying=phase==='playing',end=['day_end','resting','ending'].includes(phase),closing=phase==='closing';
  const account=equity(state),event=marketNewsView(state,currentEvent(state)),em=mood(state),info=moodInfo[em]||['平静','calm'];
  const dayNet=account-state.dayOpening-(state.externalFunding-state.dayOpeningFunding)+(state.expenses-state.dayOpeningExpenses)-((state.nonTradingIncome||0)-(state.dayOpeningIncome||0));
  const endless=state.mode==='endless',stats=runPerformance(state);
  setText('mode-open',endless?'操盘模式 ▾':'剧情模式 ▾');setText('restart','重开韭菜人生');
  setText('stage-name',`${endless?'操盘':'剧情'} · 第 ${day} 天`);
  setText('mission-title',endless?`已存活 ${stats.daysSurvived} 天`:end?'今日结算':'今日开盘');
  setText('mission-copy',endless?`已平仓 ${stats.closedTrades} 笔`:end?`收盘资产 ${yen(state.dayReport?.day===day?state.dayReport.closing:account)}`:`本日开盘 ${yen(state.dayOpening)} · ${state.beat*4+(state.pending?.candle||0)} / ${beatsPerDay(state)*4} 根 K 线`);
  setText('chapter-target',endless?`平仓收益率 ${stats.returnRate===null?'—':(stats.returnRate*100).toFixed(2)+'%'} · 累计平仓 ${signed(stats.totalProfit)}`:`交易净收益 ${signed(tradingProfit(state))} · 首章目标 +${yen(TARGET_PROFIT)}`);
  const trauma=tradingTrauma(state);
  renderCharacter();

  setText('mental-detail',`${trauma.active?trauma.explanation+' ':''}累计回撤 ${Math.round(mental.totalDrawdown*100)}% · 近期回撤 ${Math.round(mental.recentDrawdown*100)}% · ${endless?'心理承受力不限制操盘交易':limit.noEntry?'不能新开仓':`新单最多 ${limit.leverage}× · 合计保证金上限 ${Math.round(limit.stake*100)}%`}`);
  setText('sanity-text',`${Math.round(state.sanity)} / 100`);$('sanity-fill').style.width=state.sanity+'%';
  setText('price',quote(state.price));setText('inverse-rate',`1 ${marketInfo(activeMarket(state)).name} = ${quote(state.price)} 日元`);const base=state.candles.findLast(c=>c.day!==day)?.close||state.dayOpeningPrice||state.startPrice||150;
  const change=(state.price/base-1)*100;setText('change',`${change>=0?'+':''}${change.toFixed(3)}%`);$('change').className=change>=0?'positive':'negative';
  setText('beat-label',end||closing?'今日收盘':`当日行情 ${Math.min(state.beat*4+(state.pending?.candle||0)+1,beatsPerDay(state)*4)} / ${beatsPerDay(state)*4}`);
  setText('candle-label',marketPlaying?candlePeriodNotice(state,{includeTimeZone:false}):closing||end?state.dayReport?.earlyClose?.day===day?'已提前收盘':'今日收盘':'开盘中');
  if(isHistorical(state)){setText('mission-copy',`${state.historical.date} · 本日开盘 ${yen(state.dayOpening)}`);setText('beat-label',`${activeMarket(state)} · 历史行情`);setText('candle-label',`${state.historical.date} · ${candlePeriodNotice(state,{includeTimeZone:false})}`);}
  if(!isLiveMarket(state)){$('price').removeAttribute('title');$('change').removeAttribute('title');}
  if(isLiveMarket(state)){const label=chartQuoteLabel(state,isSharedReplay(state)?{sourceMode:'replay',referenceClock:state.liveMarket.replay.playbackClock}:{});setText('price',label.price);$('price').title=isSharedReplay(state)?sharedReplayPresentation(state,activeMarket(state)).description:label.priceLabel+' · '+label.status;setText('inverse-rate',label.priceValue===null?'':`1 ${marketInfo(activeMarket(state)).name} = ${label.price} 日元`);setText('change',label.percent);$('change').title=label.tooltip;$('change').className=label.ready?(label.change.startsWith('-')?'negative':'positive'):'';setText('beat-label',activeMarket(state)+' · '+(isSharedReplay(state)?'延迟共享回放':label.status));setText('candle-label',candlePeriodNotice(state,{includeTimeZone:false}));}
  marketStatus();
  setText('market-news-kind','新闻');
  newsDetails.render({...event,time:event.time,title:isResearch(state)&&!event.archiveId?`${activeMarket(state)} · 历史行情`:event.title,copy:isResearch(state)&&!event.archiveId?`${formatTradingTime(currentTradingTimestamp(state),{full:true})} · ${historicalSourceNotice(state)||(state.marketPaused?'已暂停':'交易中')}`:event.copy});
  mobileNews.render(mobileNewsItems(state,event));
  const metrics=accountMetrics(state),orders=positionsOf(state),canTrade=tradingOpen(state)&&!actionBusy,canClose=canCloseAtKnownQuote(state)&&!actionBusy;
  setText('equity',yen(account));setText('net-assets',yen(account-debtSummary(state).total));setText('total-debt',yen(debtSummary(state).total));setText('free-cash',yen(state.cash));setText('used-margin',yen(metrics.usedMargin));setText('reserve-amount',yen(state.reserve));setText('external-funding',yen(debtSummary(state).total));
  setText('available-margin',yen(metrics.availableMargin));setText('fees-paid',yen(metrics.feesPaid));
  setText('margin-level',orders.length?`${(metrics.marginLevel*100).toFixed(1)}%`:'— 无持仓');
  $('margin-level').className=orders.length&&metrics.marginLevel<=1?'negative':'';
  const todayMetrics=dailyReturnMetrics(state),displayPnl=endless?stats.totalProfit:todayMetrics.tradingNet,displayRate=endless?stats.returnRate:todayMetrics.returnRate;setText('pnl-period',endless?'累计平仓盈亏':todayMetrics.tradingNetPartial?'今日平仓 · 留存样本':'今日平仓盈亏');setText('day-pnl',signed(displayPnl));setText('day-return',displayRate===null?'—':`${displayRate>0?'+':''}${(displayRate*100).toFixed(2)}%`);$('day-pnl').className=displayPnl>=0?'positive':'negative';
  renderReturnHelp(todayMetrics,stats);
  $('position-card').hidden=false;$('position-empty').hidden=!!orders.length;for(const id of ['hold','half','close'])$(id).hidden=!orders.length;
  const ticket=renderLiveOrderTicket();const actualRatio=orderAmountRatio(orderAmount,metrics.availableMargin),highlightRatio=nearestOrderRatio(orderAmount,metrics.availableMargin);
  setText('stake-value',actualRatio===null?'—':`${Number((actualRatio*100).toFixed(2))}%`);setText('leverage-value',`${leverage}×`);for(const b of document.querySelectorAll('[data-leverage="100"]'))b.dataset.dailyUnlocked=String(dailyLeverageUnlocked(state));setText('stop-value',stopPips===null?'不预设':`${stopPips} 点`);
  $('emotion-order-rule').hidden=!limit.forceNoStop;setText('emotion-order-rule',`${info[0]}：只能不设止损，杠杆至少 25×`);
  const preview=ticket.long,shortPreview=ticket.short;
  setText('preview-margin',yen(preview.margin||0));setText('preview-notional',yen(preview.notional||0));setText('preview-quantity',`${formatQuantity(preview.quantity??(preview.notional||0)/state.price)} ${marketInfo(activeMarket(state)).base}`);setText('preview-fee',yen(preview.openFee||0));setText('preview-debit',yen(preview.totalDebit||0));
  const lossView=orderLossView(stopPips,preview,shortPreview,yen);
  setText('risk-label',lossView.label);setText('risk-amount',lossView.amount);setText('risk-note',lossView.note);$('risk-note').hidden=!lossView.note;
  const liquidation=p=>Number.isFinite(p.liquidationPrice)&&p.liquidationPrice>0?quote(p.liquidationPrice):'无单一价格线';
  setText('preview-liquidation',`多${marketInfo(activeMarket(state)).name} ${liquidation(preview)} / 空${marketInfo(activeMarket(state)).name} ${liquidation(shortPreview)} 日元报价`);
  renderLiquidation('liquidation-long',preview.liquidation,preview.valid);renderLiquidation('liquidation-short',shortPreview.liquidation,shortPreview.valid);
  updateActionViews();
  setText('order-validation',!preview.valid&&!shortPreview.valid?(preview.error||'当前不能新开仓'):'');$('order-validation').hidden=preview.valid||shortPreview.valid;
  $('order-validation').classList.toggle('invalid',!preview.valid&&!shortPreview.valid);
  for(const [attr,value] of [['stake',highlightRatio],['leverage',leverage],['stop',stop]])for(const button of document.querySelectorAll(`[data-${attr}]`)){button.setAttribute('aria-pressed',String(Number(button.dataset[attr])===value));button.disabled=!canTrade;}
  for(const id of ['long','short','wait','hold','half','close'])$(id).disabled=!(['half','close'].includes(id)?canClose:canTrade);for(const b of document.querySelectorAll('[data-stop-pips]')){b.setAttribute('aria-pressed',String(b.dataset.stopPips===(stopPips===null?'none':String(stopPips))));b.disabled=!canTrade||(limit.forceNoStop&&b.dataset.stopPips!=='none');}
  $('long').disabled ||= !preview.valid;$('short').disabled ||= !shortPreview.valid;
  closeAllControl.refresh();
  $('wait').hidden=true;$('hold').hidden=true;
  setText('position-count',`${orders.length} 笔`);setText('floating',signed(metrics.unrealized));$('floating').className=metrics.unrealized>=0?'positive':'negative';
  renderPositions(orders,canClose);
  renderTools();const limits=restrictions(state);
  for(const b of document.querySelectorAll('[data-leverage]'))b.disabled ||= (Number(b.dataset.leverage)>limits.leverage||Number(b.dataset.leverage)<limits.minLeverage);
  for(const b of document.querySelectorAll('[data-stake]'))b.disabled ||= Number(b.dataset.stake)>limits.stake;
  emotionControls.render();
  leverage=Math.min(leverage,limits.leverage);
  for(const b of document.querySelectorAll('[data-stop]'))b.disabled ||= Number(b.dataset.stop)>(limits.stop??1);
  const amountCap=Math.max(preview.maxMargin||0,shortPreview.maxMargin||0),canPickAmount=canTrade&&!limits.noEntry&&amountCap>=100;
  const amountCapHint=endless?`按可用保证金与手续费计算，当前上限 ${yen(amountCap)}`:`受心理承受力影响，当前上限 ${yen(amountCap)}`;
  $('amount-limit').title=amountCapHint;$('amount-slider-max').title=amountCapHint;
  for(const b of document.querySelectorAll('[data-amount-preset],#amount-max,#amount-random,#amount-slider')){b.disabled=!canPickAmount||(b.dataset.amountPreset&&Number(b.dataset.amountPreset)>amountCap);if(b.dataset.amountPreset)b.setAttribute('aria-pressed',String(Number(b.dataset.amountPreset)===orderAmount));}
  $('order-amount').disabled=!canPickAmount;
  $('amount-slider').max=Math.max(100,amountCap);$('amount-slider').value=Number.isFinite(orderAmount)?Math.max(100,Math.min(amountCap,orderAmount)):100;$('amount-slider').setAttribute('aria-valuetext',Number.isFinite(orderAmount)?yen(orderAmount):'请输入有效额度');
  setText('amount-slider-max',yen(amountCap));setText('amount-selected',Number.isFinite(orderAmount)?yen(orderAmount):'—');setText('amount-limit',amountCap>=100?`本单上限 ${yen(amountCap)} · 可用 ${yen(metrics.availableMargin)}`:'当前可开仓额度不足 ¥100');
  if(limits.noEntry){$('long').disabled=true;$('short').disabled=true;}
  renderEffectList($('effect-list'),state.effects,DEBUFFS);
  if(state.cash<100){$('long').disabled=true;$('short').disabled=true;}
  document.body.dataset.heat=String(state.heat);
  $('share-open').disabled=actionBusy;$('mode-open').disabled=actionBusy;
  $('restart').disabled=actionBusy;$('day-review').hidden=!['day_end','resting'].includes(phase);
  $('settle-day').hidden=!closing;$('settle-day').disabled=actionBusy;
  $('retire').hidden=phase==='ending';$('retire').disabled=!canRequestWalkaway(state)||actionBusy||saveSession.blocked;setText('retire',state.walkawayRequested?'离场结算中':isLiveMarket(state)&&positionsOf(state).length>0&&!liveTradingReady(state)?'保存持仓并离开':'销户离场');
  $('sound').textContent=sound?'♪ 音效开':'♪ 音效关';$('sound').setAttribute('aria-pressed',String(sound));
  $('developer-status').hidden=!isDevelopmentTainted();$('developer-open').disabled=actionBusy||!developerUI.available();
  setText('privacy-toggle',isDevelopmentTainted()?'测试存档 · 不统计':[2,3].includes(state.historical?.version)?'历史行情 · 不统计':telemetry.dnt?'浏览器已禁用统计':telemetry.enabled?'匿名统计 · 开':'匿名统计 · 关');$('privacy-toggle').disabled=false;
  telemetry.view({screen:$('story-dialog').open?'story':phase==='playing'?'market':phase==='closing'?'closing':phase==='resting'?'resting':phase==='ending'?'ending':end?'day_end':'trading',run:state.runId,day});
  if(lastMood!==em){track('mood_change',em,{mood:em,previousMood:lastMood||'none',sanityBucket:bucket(state.sanity)});lastMood=em;}
  track('news_seen',event.id,{newsId:event.id,day,beat:state.beat},`news:${day}:${state.beat}:${event.id}`);
  track('day_start','day',{day},`day-start:${day}`);
  chart();renderInvestors();renderRiskAlerts();checkAchievements();liquidationSequence.refresh();if(!liquidationSequence.active)tradingExpression.refresh();syncDayReportPresentation();persist();marketClock.start();pixelFrontend?.refresh();singleActionCard.refresh();lifePicker?.render();
}
function renderInvestors(){
 investorDanmaku.update(state,{paused:document.hidden||saveSession.blocked||!tradingOpen(state)||!!state.marketPaused||!!document.querySelector('dialog[open]'),reducedMotion:false});
}
// The comment clock is independent of candle renders, and pauses with the game.
setInterval(renderInvestors,250);
$('comment-credits-open').onclick=()=>{mountCommentCredits($('comment-credits'));$('comment-credits-dialog').showModal();};
function soundEffect(kind,opts){audio.effect(kind,opts);}
function terminalFeedback(event){const cue=terminalCueForEvent({...event,quiet:['numb','recovering'].includes(tradingTrauma(state).mood)});soundEffect(cue.kind,{level:cue.level});}
document.addEventListener('click',e=>{const b=e.target.closest('button:not(:disabled)');if(b&&!b.hasAttribute('data-frontend-target')&&(!b.hasAttribute('data-prop')||b.dataset.prop==='father')&&b.id!=='father-take-confirm'&&!['long','short','half','close'].includes(b.id)&&!b.dataset.positionAction&&!b.dataset.riskAction){audio.unlock();soundEffect('terminal-tap',{level:.3});}},true);
let activeTradeImpact=null,activeTradeImpactAnimation=null,activeTradeImpactContext=null;
function clearTradeImpact(){activeTradeImpactAnimation?.cancel();activeTradeImpact?.remove();activeTradeImpact=null;activeTradeImpactAnimation=null;activeTradeImpactContext=null;}
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTradeImpact();});
window.addEventListener('pagehide',clearTradeImpact);
function impact(label,amount,tone='gain'){
  clearTradeImpact();
  if(['numb','recovering'].includes(tradingTrauma(state).mood))return;
  const heat=state.heat||0,rate=Math.min(1.8,1+heat*.13);
  if(!shouldAnimate())return;
  activeTradeImpactContext=`${stateGeneration}:${state.mode}:${state.runId}:${state.day}`;
  const el=document.createElement('div');activeTradeImpact=el;el.className=`deal-impact ${tone}`;el.setAttribute('aria-hidden','true');
  const title=document.createElement('small'),value=document.createElement('b');title.textContent=label;value.textContent=amount;el.append(title,value);document.body.append(el);
  const timing=tradeImpactTiming(heat);
  activeTradeImpactAnimation=motion.animate(el,timing.frames,timing.options);
  activeTradeImpactAnimation?.finished.finally(()=>{el.remove();if(activeTradeImpact===el){activeTradeImpact=null;activeTradeImpactAnimation=null;}}).catch(()=>{});
  const force=2+heat*1.25;
  motion.animate($('pixel-frontend'),[{transform:'none'},{transform:`translate(${-force}px,${force*.4}px) rotate(-.2deg)`},{transform:`translate(${force}px,${-force*.3}px) rotate(.2deg)`},{transform:`translate(${-force*.4}px,0)`},{transform:'none'}],{duration:260+heat*25});
  const color=tone==='loss'?'#f284ba':heat>2?'#ffb84d':'#94eac4';
  motion.animate($('terminal'),[{boxShadow:`inset 0 0 0 3px ${color},0 0 ${24+heat*8}px ${color}99`},{boxShadow:'0 3px 0 #ded5dd'}],{duration:700});
  for(let i=0;i<8+heat*2;i++){
    const spark=document.createElement('i');spark.className='trade-spark';spark.style.background=color;spark.style.left='50%';spark.style.top='38%';document.body.append(spark);
    const angle=(i/(8+heat*2))*Math.PI*2,distance=60+heat*12+(i%3)*18;
    motion.animate(spark,[{opacity:1,transform:'translate(-50%,-50%) scale(1)'},{opacity:0,transform:`translate(calc(-50% + ${Math.cos(angle)*distance}px),calc(-50% + ${Math.sin(angle)*distance}px)) rotate(${i*40}deg) scale(.3)`}],{duration:650+i%3*70})?.finished.finally(()=>spark.remove()).catch(()=>{});
  }
}
function fly(label,from,to){if(!shouldAnimate())return;const a=from?.getBoundingClientRect?from.getBoundingClientRect():from,b=to?.getBoundingClientRect?to.getBoundingClientRect():to;if(!a||!b)return;
 const item=document.createElement('div');item.className='flying-order';item.textContent=label;item.style.left=`${a.x+a.width/2}px`;item.style.top=`${a.y+a.height/2}px`;document.body.append(item);
 motion.animate(item,[{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${b.x+b.width/2-a.x-a.width/2}px),calc(-50% + ${b.y+b.height/2-a.y-a.height/2}px)) scale(.72)`,opacity:.1}],{duration:560})?.finished.catch(()=>{}).finally(()=>item.remove());}
function toast(message,kind='neutral'){
 clearTimeout(toastTimer);const el=$('trade-toast');el.hidden=false;el.className=`trade-toast ${kind}`;el.textContent=message;
 motion.animate(el,[{transform:'translate(-50%,-18px)',opacity:0},{transform:'translate(-50%,0)',opacity:1},{transform:'translate(-50%,0)',opacity:1,offset:.7},{transform:'translate(-50%,-10px)',opacity:0}],{duration:2400});
 toastTimer=setTimeout(()=>el.hidden=true,shouldAnimate()?2400:2000);
}
function flash(event){event=marketNewsView(state,{...currentEvent(state),...event},{flash:true});if(event.archiveId)event={...event,title:`${event.time} · ${event.title}`};clearTimeout(shownFlashTimer);setText('flash-title',event.title);setText('flash-copy',event.copy);$('news-flash').hidden=false;
 motion.animate($('news-flash'),[{transform:'translateY(-14px)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:320});
 shownFlashTimer=setTimeout(()=>$('news-flash').hidden=true,3600);terminalFeedback({type:'news'});}
function tradeTotals(trades){const list=(trades||[]).filter(Boolean);return{count:list.length,margin:list.reduce((n,t)=>n+t.margin,0),pnl:list.reduce((n,t)=>n+t.pnl,0),liquidated:list.some(t=>t.type==='liquidation')};}
function afterTick(result,{paint=true,deferPaint=false}={}){
  if(result.flash){flash(result.flash);if(result.flash.swan)track('black_swan',result.flash.id,{newsId:result.flash.id,day:state.day,beat:result.flash.beat},`swan:${state.day}:${result.flash.id}`);}
  const exits=result.exits||[result.exit],total=tradeTotals(exits);for(const t of exits)trackExit(t);
  const forced=exits.filter(t=>t?.type==='liquidation'),ordinary=exits.filter(t=>t&&t.type!=='liquidation');
  if(total.count&&!forced.length){const tag='止损已触发';
    terminalFeedback({type:'close',...total});toast(`${tag} ${total.count} 笔 · ${signed(total.pnl)}`,total.pnl>=0?'gain':'loss');impact(tag,signed(total.pnl),total.pnl>=0?'gain':'loss');fly('平仓',$('position-card'),$('free-cash'));
  }else if(!total.count&&result.candleClosed)soundEffect('rattle',{rate:1+state.heat*.1,level:.12+state.heat*.02});
  if(forced.length)tradingExpression.hide();
  // Critical events paint immediately unless this callback owner paints the same slice once.
  if(!deferPaint&&(paint||total.count||result.flash||result.dayEnded||result.gapDurationMs||!tradingOpen(state)))render();
  if(result.gapDurationMs)historicalGapTransition.play();
  if(forced.length){liquidationSequence.push(forced);if(ordinary.length){const stops=tradeTotals(ordinary);toast(`止损已触发 ${stops.count} 笔 · ${signed(stops.pnl)}`,stops.pnl>=0?'gain':'loss');}}
  else if(total.count)tradingExpression.trade(exits);
  // Quote changes alone do not animate money; risk presentation owns heartbeat.
}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function sendAction(type,positionId=null,sourceButton=null){
  if(!guardProgress())return;
  if(actionBusy||!tradingOpen(state)&&!(['half','close'].includes(type)&&canCloseAtKnownQuote(state,positionId)))return;
  const button=sourceButton||$(type),buttonRect=button.getBoundingClientRect(),positionRect=$('position-card').getBoundingClientRect();
  actionBusy=true;audio.unlock();
  $('restart').disabled=true;for(const b of document.querySelectorAll('[data-prop]'))b.disabled=true;
  motion.animate(button,[{transform:'scale(1)'},{transform:'scale(.9) rotate(-2deg)'},{transform:'scale(1.06) rotate(1deg)'},{transform:'none'}],{duration:210});
  try{
    // Preserve the original pre-render trade normalization without a page repaint.
    const limit=restrictions(state);leverage=Math.max(limit.minLeverage,Math.min(leverage,limit.leverage));if(![5,10,25,50,100].includes(leverage))leverage=leverage<25?10:25;if(limit.forceNoStop){stopPips=null;stop=1;}
    const orderPercent=selectedPercentage();
    track('trade_attempt',type,{direction:type==='short'?'short':'long',stake:orderPercent,leverage,stop:stop*100,equityBucket:capitalBucket(equity(state))});
    markPortraitTradingAction(state,type);
    const result=takeAction(state,{...selectedOrder(type),...(positionId?{positionId}:{})});if(result.trade?.type==='open')track('trade_open',type,{direction:type==='long'?'long':'short',stake:orderPercent,leverage,stop:stop*100});else for(const t of result.trades||[result.trade])trackExit(t);
    if(type==='long'||type==='short'){
      const amount=result.trade.margin,label=directionLabel(type==='long'?1:-1,activeMarket(state));

      terminalFeedback({type:'open'});fly(`${label} ${yen(amount)}`,buttonRect,$('position-card'));impact(label,`${leverage}× · ${yen(amount)}`);
    }else if(result.trade){
      const total=tradeTotals(result.trades||[result.trade]),label=positionId?(type==='half'?'本单减半':'本单平仓'):(type==='half'?'全部减半':'全部平仓');

      terminalFeedback({type:'close',...total});fly(`${label} ${signed(total.pnl)}`,positionRect,$('free-cash'));impact(label,signed(total.pnl),total.pnl>=0?'gain':'loss');
    }else if(type==='hold'){impact('继续持有',signed(unrealized(state)),'hold');}
    else toast('空仓');
    actionBusy=false;render();tradingExpression.trade(result.trades||[result.trade]);marketClock.start();
  }catch(error){actionBusy=false;terminalFeedback({type:'reject'});track('trade_rejected',type,{reason:'unavailable'});toast(error.message,'loss');render();}
}
function renderLiquidation(id,estimate,valid){
 const box=$(id);box.replaceChildren();
 if(!valid){box.textContent='当前设置无法开仓';return;}
 if(!estimate||estimate.reason){box.textContent=estimate?.reason==='hedged'?'多空抵消，无单一强平价':'当前仓位无可达强平价';return;}
 const price=document.createElement('b'),move=document.createElement('b'),loss=document.createElement('b');price.textContent=quote(estimate.price)+' 日元报价';move.textContent=`${estimate.movePercent<0?'下跌':'上涨'} ${Math.abs(estimate.movePercent).toFixed(2)}%`;loss.textContent=yen(estimate.lossThreshold);
 box.append(price,' · ',move,document.createElement('br'),'账户浮亏达到 ',loss,'，触发强平');
 if(estimate.prices?.length>1)box.append(document.createElement('br'),'混合旧约有双向边界：',estimate.prices.map(p=>quote(p)+' 日元报价').join(' / '),'；以上显示最近边界。');
}
let dailyArtworkView=null,dailyArtworkSnapshot=null,dayRecapView=null,dayRecapSnapshot=null,storyConfirmAfter=0,livingView=null,narrativeRun=0;
function cancelNarrativePresentation(){narrativeRun++;livingView?.dispose();livingView=null;}
function renderDayRecap({animate=true}={}){
 dayRecapView?.dispose();dayRecapSnapshot=buildRecapSnapshot(state);setText('day-total',yen(dayRecapSnapshot.account.nominalAssets));setText('day-net',`今日交易 ${signed(dayRecapSnapshot.daily.tradingNet)} · 累计已实现 ${signed(dayRecapSnapshot.cumulative.realizedProfit)}`);
 dayRecapView=mountDailyRecap($('daily-recap'),dayRecapSnapshot,{settlementVariant:'trade-receipts-v1',supplementaryHost:$('day-recap-extras'),motion:animate&&shouldAnimate(),replayMotion:shouldAnimate,reducedMotion:false,onSound:soundEffect,onTimeline:(cues,options)=>audio.scheduleTimeline(cues,options),cash:accountMetrics(state).availableMargin,loanUnlocked:state.loan?.unlocked,loanTerms:networkLoanTerms(state),portraitUrl:assetURL(scenePortrait(state).path),moodLabel:$('emotion-label').textContent,usedGroups:(state.recapChoiceLedger||[]).filter(e=>e.day===state.day).map(e=>e.group),usedChoices:(state.recapChoiceLedger||[]).filter(e=>e.day===state.day).map(e=>e.id),onChoice:choice=>{
  if(actionBusy||!guardProgress())return;
  if(choice.loan){$('loan-open').click();return;}
  actionBusy=true;try{const receipt=chooseRecapAction(state,choice.id);actionBusy=false;preserveScroll($('day-recap-extras'),()=>{render();renderDayRecap({animate:false});},{focusSelector:'.recap-choices button:not(:disabled)',focusFallback:$('recap-next')});toast(receipt.cost?`${receipt.label} · 支付 ${yen(receipt.cost)}`:'今晚慢一点，先好好休息');}catch(error){toast(error.message,'loss');}finally{actionBusy=false;}
 }});
 pixelDialogController?.refreshSettlement();
}
$('day-dialog').addEventListener('close',()=>{lifeActionStoryView?.dispose();lifeActionStoryView=null;dailyArtworkView?.dispose();dailyArtworkView=null;cancelNarrativePresentation();dayRecapView?.dispose();dayRecapView=null;dayRecapSnapshot=null;pixelDialogController?.refreshSettlement();});
$('loan-dialog').addEventListener('close',()=>{if($('day-dialog').open)preserveScroll($('daily-recap'),()=>renderDayRecap({animate:false}));});
function settleLivingReceipt(){const result=finalizeDayLiving(state);return{...result,receipt:result.receipt||{amount:0,label:'今日生活费',legacy:true}};}

function displayFatherHint(){
 if(document.querySelector('dialog[open]'))return;
 const hint=fatherDiscoveryHint(state,{reducedMotion:!shouldAnimate()});if(!hint)return;
 const button=document.querySelector(hint.target);if(!button)return;
 button.classList.add('father-discovery-highlight');button.scrollIntoView?.({block:'nearest',behavior:shouldAnimate()?'smooth':'instant'});
 if(shouldAnimate())motion.animate(button,[{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'none'}],{duration:hint.maxDurationMs});
 applyFatherDiscovery(state,{type:'acknowledge-hint',eventId:hint.eventId});persist();
}
async function startNarrativeCompletion({choiceId}={}){
 cancelNarrativePresentation();const run=narrativeRun,target=state,session=saveSession,day=state.day,token=settlementPresentation(state)?.token;
 $('next-day').disabled=true;storyConfirmAfter=Infinity;
 const current=()=>run===narrativeRun&&state===target&&saveSession===session&&state.day===day&&settlementPresentation(state)?.token===token&&$('day-dialog').open;
 if(!current()||!guardProgress())return;
 try{
  const skitBefore=captureSkitState(state,mood(state)),result=finishDailyNarrative(state,{choiceId});
  if(!result.ok){
   if(result.reason==='needs-explicit-choice'){$('day-story-choices').replaceChildren();for(const choice of result.event.choices){const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent=choice.label;b.onclick=()=>startNarrativeCompletion({choiceId:choice.id});$('day-story-choices').append(b);}return;}
   throw Error('剧情状态已变化，请关闭后重新查看');
  }
  $('day-story-status').hidden=true;$('day-story-choices').replaceChildren();
  if(result.result?.event){const r=result.result;track('story_choice',r.event.id,{storyId:r.event.id,choiceId:r.choice.id});for(const id of r.unlocked||[])track('item_unlocked',id,{itemId:id,storyId:r.event.id});}
  const living=settleLivingReceipt(),host=$('living-receipt'),receiptKey=JSON.stringify(living.receipt);
  if(result.changed)rememberDailySkitOutcome(state,skitBefore,mood(state));
  renderSkitStatus($('day-skit-status'),state,mood(state));
  // Publish the final statement in this same turn, before any asynchronous save.
  // A save completion only unlocks navigation; it never replaces visible content.
  if(host.hidden||host.dataset.receiptToken!==token||host.dataset.receiptKey!==receiptKey){
   $('living-event-art').hidden=true;$('living-event-art').replaceChildren();
   livingView=mountLivingReceipt(host,living.receipt);host.dataset.receiptToken=token;host.dataset.receiptKey=receiptKey;
   mountConsumptionChoices();
  }
  if(result.hooks.length)state.pendingFatherHint=true;
  syncSceneMusic();syncDayReportPresentation();
  const saved=await persist();if(!current()||saveSession.blocked)return;
  if(!saved){
   setText('day-story-status','浏览器暂时无法安全保存，刷新或关闭后本页进度会丢失');$('day-story-status').hidden=false;
   const retry=document.createElement('button');retry.type='button';retry.className='secondary';retry.textContent='重试保存';retry.onclick=()=>startNarrativeCompletion();$('day-story-choices').replaceChildren(retry);return;
  }
  if(living.charged)track('settlement_confirm','living-cost',{kind:'living-cost',reason:'applied'},`living:${state.day}`);
  storyConfirmAfter=performance.now();$('next-day').disabled=false;
 }catch(error){track('error','daily-settlement',{kind:'settlement',reason:'failed'});setText('day-story-status',error.message);$('day-story-status').hidden=false;}
}
$('father-scene-use').onclick=()=>showProp('father');
function showDaySettlement(){if($('day-dialog').open||$('bankrupt-dialog').open)return;showDayDialog();}
$('day-dialog').addEventListener('cancel',e=>e.preventDefault());
let lifeActionStoryView=null;
function syncEveningReceipts(){
 lifeActionStoryView?.dispose();lifeActionStoryView=null;
 const host=$('day-evening-receipts');host?.replaceChildren();if(!host)return;host.hidden=true;
 // Family and later daily stories keep their established place. The chosen
 // action's exact exchange follows on this same settlement page.
 const scene=lifeActionStory(state);
 if(mountLifeActionReward(host,scene))host.hidden=false;
 // Keep the real work reward visible while the daily loss/recovery scene owns
 // its dialogue. A committed casual exchange must not erase that consequence.
 if(dailyArtworkSnapshot?.consequenceFirst)return;
 if(!scene||!(isDailyFamilyNarrative(state.settlementNarrative)||dailyArtworkSnapshot?.lifeReceiptFallback)||$('day-story-stage').hidden)return;
 host.hidden=false;const heading=document.createElement('h3');heading.textContent=scene.title;host.append(heading);
 // This repeated exchange is already read. Keep the fallback picture's pending
 // read ticket intact until its exact day's save succeeds.
 lifeActionStoryView=mountLifeActionStory(host,scene,{memory:dailyArtworkSnapshot?.lifeReceiptFallback?undefined:lifeSceneMemory.forSelection(scene)});
}
function syncContextualDaily(){return false;}
function dailyIllustrationChanged(selection){dailyArtworkSnapshot=selection;if(selection?.title)setText('day-title',selection.title);}
// Revalidate display only: the existing take/repay paths own every account effect.
function refreshOpenFamilyArtwork(){
 const narrative=state.settlementNarrative;
 if(!$('day-dialog').open||$('day-story-stage').hidden||!isDailyFamilyNarrative(narrative))return;
 dailyArtworkView?.dispose();dailyArtworkSnapshot=selectDailyArtwork(state,narrative,{memory:lifeSceneMemory,preferIllustrated:true});
 dailyArtworkView=mountDailyArtwork($('day-story-comic-frame'),dailyArtworkSnapshot,{showHeading:false,memory:lifeSceneMemory,onSelectionChange:dailyIllustrationChanged});
 const lines=$('day-story-lines');lines.replaceChildren();lines.hidden=!!dailyArtworkSnapshot?.frames;
 if(!lines.hidden)for(const [from,text] of selectDailyFamilyLines(state,narrative)){lines.append(createSkitLine(document,from,text));}
}
function showDayDialog(){
 if(state.mode==='endless')return;
 lifeActionStoryView?.dispose();lifeActionStoryView=null;
 const r=state.dayReport;if(!r)return;
 if(state.day===r.day&&state.phase==='day_end'){beginRest(state);render();}
 const stage=settlementPresentation(state),narrative=stage?.stage==='story'?prepareDailyNarrative(state,{accountEquity:equity(state)}):null,scene=selectDailyScene(state),event=narrative?.event||scene?.event;
 // Keep a same-day static receipt in place on re-entry. Never expose yesterday's.
 if($('living-receipt').dataset.receiptToken!==stage?.token||$('living-receipt').dataset.receiptKey!==JSON.stringify(r.livingSettlement?.receipt))for(const id of ['living-receipt','living-event-art']){const view=$(id);view.hidden=true;view.replaceChildren();delete view.dataset.receiptToken;delete view.dataset.receiptKey;}
 const storyVisible=stage?.stage==='story';$('day-dialog').dataset.recapLayout=storyVisible?'story':'profit-first';$('day-recap-extras').hidden=storyVisible;$('daily-recap').hidden=storyVisible;$('day-story-stage').hidden=!storyVisible;$('recap-next').hidden=storyVisible;$('next-day').hidden=!storyVisible;$('recap-next').dataset.eventToken=stage?.token||'';$('next-day').dataset.eventToken=stage?.token||'';
 setText('day-stage-label',storyVisible?'2 / 2 · 今日小剧场':'1 / 2 · 动态复盘');setText('day-title',!storyVisible?'今日战报':scene?.kind==='story'&&event?event.title:'今日小剧场');setText('day-subtitle',`第 ${r.day} 天 · ${r.earlyClose?'提前收盘':'收盘'} · ${formatTradingTime(reportTradingTimestamp(state,r),{full:true})}`);
 const frame=$('day-story-comic-frame');frame.hidden=true;frame.replaceChildren();$('day-story-lines').replaceChildren();
 // Select once: this exact daily story owns the heading and body together.
 // The independent saved mainline is only a fallback for an empty daily slot.
 dailyArtworkSnapshot=storyVisible?selectDailyArtwork(state,narrative,{memory:lifeSceneMemory,preferIllustrated:true}):null;
 let mainHost=document.getElementById('day-main-story');
 if(!mainHost){mainHost=document.createElement('section');mainHost.id='day-main-story';frame.before(mainHost);}
 mountMainStory(mainHost,storyVisible?narrative?.mainStory:null,{dailySelection:dailyArtworkSnapshot});
 $('turnaround-panel').hidden=true;$('homage-panel').hidden=true;
 if(event&&storyVisible)track('story_seen',event.id,{storyId:event.id,mood:mood(state)},`story:${event.id}`);
 for(const id of ['day-result-manga','day-contextual-manga','father-discovery-scene','day-story-fallback','day-evening-receipts']){const host=$(id);host.replaceChildren();host.hidden=true;}
 $('day-story-lines').hidden=true;
 if(storyVisible){
  dailyArtworkView?.dispose();dailyArtworkView=mountDailyArtwork(frame,dailyArtworkSnapshot,{showHeading:false,memory:lifeSceneMemory,onSelectionChange:dailyIllustrationChanged});
  // Only a selected narrative scene owns dialogue. Unrelated trading dialogue
  // must not be appended underneath a dinner or a distinct manga story.
  const family=isDailyFamilyNarrative(narrative);
  if(family&&!dailyArtworkSnapshot?.frames&&(dailyArtworkSnapshot||!narrative?.mainStory)){const familyLines=selectDailyFamilyLines(state,narrative),lines=dailyArtworkSnapshot?.dialoguePanels?(state.family?.outstanding===0&&state.family?.repaid>0?familyLines.slice(-1):[]):familyLines;$('day-story-lines').hidden=!lines.length;for(const [from,text] of lines){$('day-story-lines').append(createSkitLine(document,from,text));}}
  else if(!dailyArtworkSnapshot&&!narrative?.mainStory&&event){$('day-story-lines').hidden=false;for(const [from,text] of [...(event.lines||[]),...(event.choices?.[0]?.lines||[])]){$('day-story-lines').append(createSkitLine(document,from,text));}}
  if(dailyArtworkSnapshot)setText('day-title',dailyArtworkSnapshot.title);
  else if(narrative?.mainStory)setText('day-title',narrative.mainStory.title);
  syncEveningReceipts();renderSkitStatus($('day-skit-status'),state,mood(state));
 }
 setText('day-total',yen(r.closing));setText('day-net',`今日交易 ${signed(r.net)} · 累计已实现 ${signed(runPerformance(state).totalProfit)}`);
 setText('next-day',state.walkawayRequested?'销户离场':'明天开盘');if(storyVisible)decorateSkitChrome($('day-dialog'),{scene:dailyArtworkSnapshot,state});if(!storyVisible){cancelNarrativePresentation();renderDayRecap();}else dayRecapView?.finish();if(!$('day-dialog').open)$('day-dialog').showModal();track('screen_view',storyVisible?'daily-family':'daily-summary',{kind:'settlement',reason:storyVisible?'family':'summary'},`settlement-stage:${state.day}:${storyVisible?'story':'recap'}`);if(storyVisible&&narrative?.fatherFrames?.length)track('story_seen','father-discovery',{kind:'family-funds',reason:'discovered'},`father-discovery:${state.day}`);if(storyVisible){$('day-story-status').hidden=true;narrativeCues.emit(currentNarrativeAudio(),{fresh:!state.settlementNarrative?.effectsApplied});syncSceneMusic();startNarrativeCompletion();}

}
function mountConsumptionChoices(){
 mountConsumptionStatement($('living-receipt'),consumptionStatement(state),{onLifestyle:(plan,{opener}={})=>{
  if(actionBusy||!guardProgress())return;
  const parent=$('day-dialog'),host=$('living-receipt'),day=state.day,context=lifeContext(),scroller=parent.querySelector('.dialog-scroll'),scrollTop=scroller?.scrollTop,statementKey=JSON.stringify(consumptionStatement(state));
  openLifeHousing({selectedId:plan.id,returnLabel:'返回日结',onReturn:()=>{
   if(!parent.open||state.day!==day||lifeContext()!==context)return;
   if(statementKey===JSON.stringify(consumptionStatement(state))){if(opener?.isConnected&&!opener.disabled)opener.focus({preventScroll:true});}
   else preserveScroll(host,()=>{host.querySelector('.consumption-statement')?.remove();mountConsumptionChoices();const adjustment=host.querySelector('.living-adjustment');if(adjustment)adjustment.open=true;const target=[...host.querySelectorAll('.living-plan-choices button')].find(button=>button.value===plan.id&&!button.disabled)||adjustment?.querySelector('summary');target?.focus({preventScroll:true});});
   if(scroller&&Number.isFinite(scrollTop))scroller.scrollTop=scrollTop;
  }});
 }});
}
async function newChapter(){if(!$('restart-dialog').open)return;return restartChapter(false);}
async function restartChapter(terminal=false){
 terminal=terminal||state.phase==='ending';
 if((terminal?state.phase!=='ending':!$('restart-dialog').open)||actionBusy||!guardProgress())return;actionBusy=true;setOpeningControlsBusy(true);marketClock.stop();const generation=stateGeneration,originalState=state,originalSession=saveSession,terminalDialog=terminal?$('mode-dialog').open?$('mode-dialog'):$('ending-dialog').open?$('ending-dialog'):null:null;let replaced=false,terminalMode=null,terminalMarket=null;
 const current=()=>generation===stateGeneration&&state===originalState&&saveSession===originalSession&&guardProgress()&&(terminal?state.phase==='ending'&&(!terminalDialog||terminalDialog.open)&&(terminalDialog!==$('mode-dialog')||openingMode===terminalMode&&$('mode-market').value===terminalMarket):$('restart-dialog').open);
 setText('restart-error','');$('restart-error').hidden=true;
 try{
  const mode=$('mode-dialog').open?openingMode:selectedMode,market=terminal?$('mode-dialog').open?$('mode-market').value:selectedMarket:$('restart-market').value,historicalPrefix=terminal&&$('mode-dialog').open?'mode':'restart';
  if(terminal){terminalMode=mode;terminalMarket=market;$('restart-market').value=market;}
  // A failed terminal write must remain recoverable in this page. Starting a
  // new run would invalidate that save epoch, so certify it before replacement.
  if(terminal&&(!await persist()||!current()))return;
  const candidate=fresh(mode,market==='historical'?await selectedHistoricalOptions(historicalPrefix,mode):null,market);
  if(!current())return;
  const targetSession=sessionFor(mode,market);if(targetSession.blocked)throw Error('目标存档待处理，未开始新局');
  if(mode!==selectedMode||market!==selectedMarket){if(!await persist()||!current())return;}
  modeStates.set(slot(selectedMode),state);selectedMode=mode;selectedMarket=market;saveKey=saveKeyFor(selectedMode);saveSession=targetSession;storage.setItem('fx-girl-mode',mode);storage.setItem('fx-girl-market-source',market);
  developerBackupKey=mode==='endless'?'fx-endless-developer-backup-v1':'fx-girl-developer-backup-v3';
  stateGeneration++;replaced=true;rankingLifecycle.clear();state=enableRealtime(candidate);modeStates.set(slot(selectedMode),state);state.runId=randomUUID();telemetry.setTestMode(isDevelopmentRun());voice.stop();floatingReaction.reset();lastMood=null;orderAmount=draftOrderAmount(state);$('order-amount').value=orderAmount;leverage=25;stop=.5;stopPips=30;
  for(const d of document.querySelectorAll('dialog[open]'))d.close();$('last-trade').textContent='';if(state.mode==='story')showOpening();scrollTo({top:0,behavior:fullMotion?'smooth':'instant'});
 }catch(error){if(terminal){if(current())toast(error.message,'loss');}else if(current()){setText('restart-error',error.message);$('restart-error').hidden=false;}}
 finally{if(replaced||generation===stateGeneration){actionBusy=false;setOpeningControlsBusy(false);render();marketClock.start();}}
}
async function showProp(id,confirmed=false){
  if(actionBusy||!guardProgress()||!tradingOpen(state)&&!['day_end','resting'].includes(state.phase))return;
  if(id==='father'&&!confirmed){fatherAmountControls.refresh();renderFatherIllustration($('father-confirm-art'),fatherItemIllustration(state,{stage:'confirm',accountEquity:equity(state)}));$('father-take-dialog').showModal();return;}
  audio.unlock();let result,saveSucceeded=false;const generation=stateGeneration;
  try{result=useProp(state,id,id==='father'?{amount:Number($('father-take-amount').value)}:{});{if(id==='father')applyFatherDiscovery(state,{type:'sync-taken'});actionBusy=true;const saved=await persist();if(generation!==stateGeneration)return;actionBusy=false;if(saveSession.blocked)return;if(!saved){render();toast(id==='father'?'取款已保留在本页，存档未成功。请先重试保存。':'本次使用已保留在本页，存档未成功。请先重试保存，刷新可能丢失本次使用。','loss');return;}saveSucceeded=true;}}catch(error){if(generation!==stateGeneration)return;actionBusy=false;toast(error.message,'loss');return;}
  if(id==='father')track('item_used','father',{kind:'family-funds',reason:'taken'},'father-taken');else track('item_used',id,{itemId:id,mood:mood(state),equityBucket:capitalBucket(equity(state))});for(const t of result.trades||[result.trade])trackExit(t);for(const e of state.effects)track('debuff_applied',e.id,{debuffId:e.id,itemId:id,duration:e.remaining||0},`effect:${state.day}:${state.beat}:${id}:${e.id}`);
  const spec=id==='tradingNotes'?{name:'交易笔记'}:PROPS[id];render();
  // Taking the envelope invalidates an already-open discovery scene immediately.
  if(id==='father')refreshOpenFamilyArtwork();
  if(id!=='father'||state.mode==='endless'){soundEffect(id==='mochiko'?'terminal-fill':'terminal-close',{level:.3});toast(id==='father'?`到账 ${yen(result.amount)}`:`${spec.name}${result.cost?' · −'+yen(result.cost):''}${result.line?' · '+result.line:''}`);return;}
  const propArt=propEventArt(id,{applied:true});renderFatherIllustration($('father-applied-art'),id==='father'?fatherItemIllustration(state,{stage:'applied',result}):propArt?{art:propArt}:null);$('prop-comic-frame').hidden=true;setText('prop-title',spec.name);setText('prop-line',id==='father'?approvedQuote('V2-E03-05',state)?.text||'':PROP_LINES[id]||'');setText('prop-rule',spec.copy);
  $('prop-dialog').dataset.kind=id;$('prop-dialog').showModal();narrativeCues.emit(currentNarrativeAudio());syncSceneMusic();
  mountFatherTakeVoice($('prop-dialog'),{state,result,saveSucceeded,isCurrent:()=>generation===stateGeneration,
   beforePlay:()=>{voice.stop();for(const player of $('voice-list').querySelectorAll('audio'))player.pause();},
   onPlaybackChange:syncVoiceDuck,sourceLink:$('voice-library-dialog').querySelector('a[href]'),
   sourceTitle:$('voice-library-dialog').querySelector('h2'),sourceNote:$('voice-library-dialog').querySelector('.small-print')});
  const propRun=++propPresentationRun;
  const amount=result.amount||0,started=performance.now(),duration=shouldAnimate()?1500:0;
  if(amount){
    let soundStep=-1;
    const count=now=>{if(propRun!==propPresentationRun||generation!==stateGeneration||!$('prop-dialog').open)return;const progress=duration?Math.min(1,(now-started)/duration):1,ease=1-Math.pow(1-progress,3);setText('prop-amount',`+${yen(amount*ease)}`);
      const step=Math.floor(progress*7);if(step!==soundStep){soundStep=step;soundEffect('terminal-tap',{rate:Math.min(1.25,.9+step*.05),level:.25});}
      if(progress<1&&$('prop-dialog').open)propFrame=requestAnimationFrame(count);else if(progress===1)soundEffect('terminal-fill',{level:.4});};
    propFrame=requestAnimationFrame(count);

  }else{
    const total=tradeTotals(result.trades||[result.trade]);setText('prop-amount',result.trade?signed(total.pnl):result.cost?`−${yen(result.cost)}`:spec.caption);soundEffect(id==='mochiko'?'terminal-fill':'terminal-close',{level:.3});
  }
  motion.animate($('prop-dialog'),[{opacity:0,transform:'translateY(30px) scale(.85) rotate(-3deg)'},{opacity:1,transform:'translateY(0) scale(1.03) rotate(1deg)'},{opacity:1,transform:'none'}],{duration:600});
  motion.animate(document.querySelector('.prop-envelope'),[{transform:'rotate(-12deg) scale(.6)'},{transform:'rotate(8deg) scale(1.12)'},{transform:'rotate(-5deg) scale(1)'}],{duration:800});
}
function selectOrderAmount(value,{writeInput=true,intent=null}={}){
 if(actionBusy||!guardProgress())return;
 orderAmount=normalizeOrderAmount(value);
 if(intent)state.orderDraftIntent=intent;else delete state.orderDraftIntent;
 if(Number.isFinite(orderAmount))state.orderDraftAmount=orderAmount;
 if(writeInput)$('order-amount').value=Number.isFinite(orderAmount)?orderAmount:'';
 render();
}
function maxOrderAmount(){return Math.max(orderPreview(state,selectedOrder('long')).maxMargin||0,orderPreview(state,selectedOrder('short')).maxMargin||0);}
for(const b of document.querySelectorAll('[data-amount-preset]'))b.onclick=()=>{if(!b.disabled)selectOrderAmount(Number(b.dataset.amountPreset));};
$('amount-max').onclick=()=>selectOrderAmount(maxOrderAmount(),{intent:{mode:'max'}});
$('amount-slider').oninput=()=>selectOrderAmount(sliderOrderAmount(Number($('amount-slider').value),maxOrderAmount()));
$('percent-slider').oninput=()=>{if($('percent-slider').disabled)return;const ratio=Number($('percent-slider').value)/100;selectOrderAmount(ratioOrderAmount(ratio,accountMetrics(state).availableMargin,maxOrderAmount()),{intent:{mode:'ratio',ratio}});};
$('amount-random').onclick=()=>{selectOrderAmount(randomOrderAmount(maxOrderAmount()));setText('amount-random-status',`随机选择 ${yen(orderAmount)}`);};
for(const b of document.querySelectorAll('[data-stake],[data-leverage],[data-stop]'))b.addEventListener('click',()=>{if(b.dataset.stake){selectOrderAmount(ratioOrderAmount(Number(b.dataset.stake),accountMetrics(state).availableMargin,maxOrderAmount()),{intent:{mode:'ratio',ratio:Number(b.dataset.stake)}});return;}if(b.dataset.leverage)leverage=Number(b.dataset.leverage);if(b.dataset.stop)stop=Number(b.dataset.stop);render();});
$('order-amount').oninput=()=>selectOrderAmount(Number($('order-amount').value),{writeInput:false});
$('order-amount').onchange=()=>selectOrderAmount(Number($('order-amount').value));
$('position-list').onclick=e=>{const detail=e.target.closest('[data-position-detail]');if(detail){openPositionDetail(detail.dataset.positionDetail);return;}const b=e.target.closest('[data-position-action]');if(b&&!b.disabled)sendAction(b.dataset.positionAction,b.dataset.positionId,b);};
for(const b of document.querySelectorAll('[data-stop-pips]'))b.onclick=()=>{stopPips=b.dataset.stopPips==='none'?null:Number(b.dataset.stopPips);stop=stopPips===null?1:.5;render();};
for(const type of ['long','short','wait','hold','half','close'])$(type).addEventListener('click',()=>sendAction(type));
// Both close-all buttons are bound once through closeAllControl above.
function selectMarketSpeed(value){
 if(actionBusy||!guardProgress()||![1,2,4].includes(value))return;
 if(isHistorical(state)&&!historicalReady(state)){toast('请先处理历史行情提示');return;}
 speed=value;state.marketPaused=false;
 for(const option of document.querySelectorAll('[data-speed]'))option.setAttribute('aria-pressed',String(Number(option.dataset.speed)===speed));
 render();marketClock.reschedule();
}
for(const b of document.querySelectorAll('[data-speed]'))b.addEventListener('click',()=>selectMarketSpeed(Number(b.dataset.speed)));
$('finish-day').onclick=()=>{if(actionBusy||progressRestoreBusy||!guardProgress())return;if(state.mode==='endless'){if(document.body.dataset.frontend!=='pixel'&&staminaStatus(state).low)requestRestFromCard({context:actionCardContext()});return;}if(!canCloseAtKnownQuote(state))return;actionBusy=true;marketClock.stop();try{audio.unlock();finishTradingDay(state);track('transition','daily-settlement',{kind:'settlement',reason:'begin'},`settle:${state.day}`);for(const t of state.dayReport.trades)trackExit(t);}catch(error){toast(error.message);}finally{actionBusy=false;render();continueScenes();}};
$('tool-list').addEventListener('click',e=>{const b=e.target.closest('[data-prop]');if(b)showProp(b.dataset.prop);});
$('prop-done').onclick=()=>{cancelAnimationFrame(propFrame);$('prop-dialog').close();continueScenes();};
$('prop-dialog').addEventListener('close',()=>{propPresentationRun++;cancelAnimationFrame(propFrame);syncSceneMusic();});
$('prop-dialog').addEventListener('cancel',()=>{cancelAnimationFrame(propFrame);requestAnimationFrame(continueScenes);});
$('sound').onclick=()=>{sound=!sound;storage.setItem(settingsKey,sound?'sound':'mute');audio.unlock();audio.configure({sound,soundVolume:.5});soundEffect('terminal-tap',{level:.3});render();};
$('achievements-open').onclick=openAchievements;$('share-open').onclick=openShare;$('day-share').onclick=openShare;
$('share-style-original').onclick=()=>renderShareStyle('original');$('share-style-pixel').onclick=()=>renderShareStyle('pixel');
$('share-dialog').addEventListener('close',()=>{shareRequest++;shareSession=null;shareFile=null;if(shareUrl){URL.revokeObjectURL(shareUrl);shareUrl=null;}});
$('share-download').onclick=()=>{telemetry.hook('export_download');setText('share-status',UI_COPY.shareSaving);};
$('share-native').onclick=async()=>{if(shareBusy||!shareFile)return;const request=shareRequest;shareBusy=true;$('share-native').disabled=true;setText('share-status','正在打开系统分享…');const result=await shareReportFile(shareFile);shareBusy=false;if(request!==shareRequest)return;$('share-native').disabled=false;setText('share-status',UI_COPY.shareResult[result]);if(['shared','cancelled','failed'].includes(result))telemetry.hook('export_'+result);};
$('help').onclick=()=>$('help-dialog').showModal();for(const b of document.querySelectorAll('[data-close]'))b.onclick=()=>{$(b.dataset.close).close();continueScenes();};
function showNewChapter(){if(actionBusy||!guardProgress()||$('restart-dialog').open)return;if(state.phase==='ending'){void restartChapter(true);return;}$('restart-market').value=selectedMarket;setText('restart-error','');$('restart-error').hidden=true;$('restart-dialog').showModal();}
$('mode-restart').onclick=()=>{if(actionBusy||!guardProgress()||$('restart-dialog').open)return;if(state.phase==='ending'){void restartChapter(true);return;}$('restart-market').value=$('mode-market').value;setText('restart-error','');$('restart-error').hidden=true;$('restart-dialog').showModal();};
$('restart').onclick=showNewChapter;$('confirm-restart').onclick=newChapter;$('new-chapter').onclick=showNewChapter;
// A daily comic can have no pending one-time story (for example after quietNight).
// Acknowledge the closing screen itself so the dispatcher cannot reopen it.
$('recap-next').onclick=event=>{if(event.detail>1||!$('day-dialog').open||!guardProgress()||!enterSettlementStory(state,$('recap-next').dataset.eventToken))return;dayRecapView?.finish();storyConfirmAfter=Infinity;showDayDialog();$('day-dialog').querySelector('.dialog-scroll')?.scrollTo({top:0,behavior:'instant'});};
$('next-day').onclick=event=>{if(event?.detail>1||performance.now()<storyConfirmAfter||!$('day-dialog').open||!guardProgress()||!canConfirmSettlementStory(state,$('next-day').dataset.eventToken))return;try{if(!state.settlementNarrative?.effectsApplied||state.dayReport?.livingSettlement?.status==='pending')return;completeSettlementStory(state,$('next-day').dataset.eventToken);track('settlement_confirm','daily-settlement',{kind:'settlement',reason:'complete'},`settle-complete:${state.day}`);$('day-dialog').close();render();continueScenes();displayFatherHint();}catch(error){toast(error.message);}};
$('settle-day').onclick=()=>{try{audio.unlock();settleDay(state);track('transition','daily-settlement',{kind:'settlement',reason:'begin'},`settle:${state.day}`);for(const t of state.dayReport.trades)trackExit(t);track('day_end','day',{mood:mood(state),equityBucket:capitalBucket(equity(state)),pnlBucket:pnlBucket(state.dayReport.net)},`day-end:${state.day}`);render();showDaySettlement();}catch(error){toast(error.message);}};
function openWalkaway(){if(actionBusy||!guardProgress()||!canRequestWalkaway(state))return false;const confirmation=walkawayConfirmation(state);$('walkaway-dialog').dataset.suspendOnly=String(!!confirmation.suspendOnly);setText('walkaway-title',confirmation.title);setText('walkaway-copy',confirmation.copy);setText('walkaway-status','');$('walkaway-dialog').returnValue='';$('walkaway-dialog').showModal();$('walkaway-dialog').querySelector('[data-close]').focus({preventScroll:true});return true;}
$('retire').onclick=openWalkaway;
$('walkaway-confirm').onclick=async()=>{
 if(actionBusy||!$('walkaway-dialog').open||!guardProgress()||!canRequestWalkaway(state))return;
 const generation=stateGeneration;actionBusy=true;$('walkaway-confirm').disabled=true;marketClock.stop();
 try{const result=$('walkaway-dialog').dataset.suspendOnly==='true'?suspendLiveRun(state):requestWalkaway(state,{finishRunImmediately});if(result.suspended){if(!await persist()){if(generation!==stateGeneration)return;setText('walkaway-status','持仓已保留在本页，保存尚未成功。请重试保存后离开。');return;}if(generation!==stateGeneration)return;openingMode=selectedMode;syncMarketSelectors('mode',selectedMarket);$('walkaway-dialog').close('suspended');if($('leaderboard-dialog').open)$('leaderboard-dialog').close();$('mode-dialog').showModal();return;}cancelNarrativePresentation();dayRecapView?.finish();for(const id of ['day-dialog','story-dialog','bankrupt-dialog'])if($(id).open)$(id).close();deferredScene=null;$('scene-resume').hidden=true;$('walkaway-dialog').close('confirmed');}
 catch(error){setText('walkaway-status',error.message);}
 finally{if(generation===stateGeneration){actionBusy=false;$('walkaway-confirm').disabled=false;render();if(!$('walkaway-dialog').open)continueScenes();}}
};
$('ending-restart').onclick=()=>void restartChapter(true);
$('day-review').onclick=()=>{deferredScene=null;$('scene-resume').hidden=true;showDayDialog();};
// Escape is a presentation-only dismissal handled by enhanceDialogs.
function pauseAuditions(){for(const player of document.querySelectorAll('audio[data-voice-id]'))player.pause();}
window.addEventListener('pagehide',()=>{actualPageActive=false;syncLiveSource();});
window.addEventListener('pageshow',()=>{actualPageActive=true;syncLiveSource();});
bindMarketLifecycle({clock:marketClock,
 onSuspend:()=>{suspendStaminaWatching(state);persist();audio.pause();voice.stop();floatingReaction.reset();pauseAuditions();syncVoiceDuck();marketStatus();},
 onResume:()=>{if(!guardProgress())return false;audio.sync();renderCharacter();marketStatus();}
});
function replaceDeveloperState(next){
  stateGeneration++;marketClock.stop();state=enableRealtime(next);state.runId||=randomUUID();telemetry.setTestMode(isDevelopmentRun());voice.stop();floatingReaction.reset();lastMood=null;actionBusy=false;orderAmount=draftOrderAmount(state);$('order-amount').value=orderAmount;
  for(const d of document.querySelectorAll('dialog[open]'))d.close();
  $('last-trade').textContent='';render();continueScenes();marketClock.start();
}
const developerUI=mountDeveloperUI({leaderboard,storage,getState:()=>state,getGeneration:()=>stateGeneration,guard:guardProgress,canEdit:()=>!actionBusy&&!isHistorical(state)&&!isLiveMarket(state),
 backupKey:()=>developerBackupKey,restore:restoreGame,replace:replaceDeveloperState,
 pause:()=>{state.marketPaused=true;marketClock.stop();},onTaint:()=>{telemetry.setTestMode(isDevelopmentRun());void persist();},notify:toast,render});
let disposeAuditions=null;
$('voice-library-open').onclick=()=>{voice.stop();disposeAuditions?.();syncVoiceDuck();setText('voice-library-caption','');$('voice-library-status').hidden=true;disposeAuditions=mountVoiceLibrary($('voice-list'),VOICE_LINES,{beforePlay:()=>voice.stop(),onPlay:line=>track('voice_play',line.id,{dialogueId:line.id}),onError:line=>{setText('voice-library-caption','“'+line.zh+'”暂时无法播放，请重试或试听其他片段。');}});$('voice-library-dialog').showModal();};
$('voice-library-dialog').addEventListener('close',()=>{disposeAuditions?.();disposeAuditions=null;voice.stop();render();});
let marginPositionId=null;
function updateChartHeartbeat(){
  const heartbeat=chartHeartbeat.observe({context:`${stateGeneration}:${state.runId}:${activeMarket(state)}`,time:performance.now(),price:state.price,positions:positionsOf(state).length,metrics:accountMetrics(state),estimate:accountLiquidationEstimate(state),enabled:shouldAnimate()&&!document.hidden&&tradingOpen(state)});
  $('price').dataset.heartbeat=heartbeat.level;
  $('price').style.setProperty('--risk-heartbeat-duration',`${heartbeat.duration}ms`);
}
function renderRiskAlerts(){
 updateChartHeartbeat();
 const box=$('risk-alerts'),risks=nearStopOrders(state),visible=new Set(risks.map(r=>String(r.positionId)));
 box.hidden=risks.length===0;
 for(const row of [...box.children])if(!visible.has(row.dataset.riskId))row.remove();
 for(const risk of risks){telemetry.hook('warning_margin',{dedupeKey:`${state.runId}:${state.day}:${risk.positionId}`});let row=[...box.children].find(r=>r.dataset.riskId===String(risk.positionId));
  if(!row){row=document.createElement('div');row.className='risk-alert';row.dataset.riskId=risk.positionId;const text=document.createElement('b');text.className='risk-copy';row.append(text);for(const [action,label] of [['topup','追加保证金'],['exit','提前平仓']]){const b=document.createElement('button');b.dataset.riskAction=action;b.dataset.riskPosition=risk.positionId;b.textContent=label;row.append(b);}box.append(row);}
  row.querySelector('.risk-copy').textContent=`#${risk.positionId} · ${risk.kind==='stop'?'接近止损':'接近账户强平'} ${Math.round(risk.progress*100)}% · 浮亏 ${yen(risk.loss)}`;
  const b=row.querySelector('[data-risk-action="topup"]'),p=positionsOf(state).find(p=>p.id===risk.positionId);b.hidden=risk.kind!=='stop'||Object.hasOwn(p||{},'stopPips');b.disabled=!risk.canTopUp||actionBusy||!['decision','playing'].includes(state.phase);
  row.querySelector('[data-risk-action="exit"]').disabled=actionBusy||!['decision','playing'].includes(state.phase);
 }
 if($('margin-dialog').open&&!positionsOf(state).some(p=>p.id===marginPositionId)){setText('margin-error','该持仓已经平仓，无需追加。');$('margin-confirm').disabled=true;}
}
$('risk-alerts').onclick=e=>{const b=e.target.closest('[data-risk-action]');if(!b||b.disabled)return;const id=b.dataset.riskPosition;
 if(b.dataset.riskAction==='topup'){marginPositionId=id;const p=positionsOf(state).find(p=>p.id===id);if(!p)return;const max=Math.floor(accountMetrics(state).availableMargin);$('margin-amount').max=max;$('margin-amount').value=Math.min(max,1000);$('margin-confirm').disabled=false;setText('margin-error','');setText('margin-description',`#${id} · 可追加 ${yen(max)}。现金转为本单抵押，名义仓位不变，止损容许金额随保证金增加；账户保证金率不变。行情继续播放。`);$('margin-dialog').showModal();}
 else try{const r=rescueClose(state,id);trackExit(r.trade);render();toast(`#${id} 平仓 ${signed(r.trade.pnl)}`,r.trade.pnl>=0?'gain':'loss');}catch(error){toast(error.message,'loss');}
};
$('margin-max').onclick=()=>{$('margin-amount').value=Math.floor(accountMetrics(state).availableMargin);};
$('margin-confirm').onclick=()=>{try{const r=topUpMargin(state,marginPositionId,Number($('margin-amount').value));$('margin-dialog').close();render();toast(`#${marginPositionId} 已追加 ${yen(r.amount)}`);}catch(error){setText('margin-error',error.message);}};
let loanBusy=false;
function renderLoanDialog(){
 // Keep unchanged text nodes and controls stable while a visible quote refreshes.
 const update=(node,key,value)=>{if(node[key]!==value)node[key]=value;};
 const terms=networkLoanTerms(state),loan=state.loan,canBorrow=loan.unlocked&&terms.availableCredit>=terms.minBorrow;
 const rate=(terms.dailyRate*100).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
 update($('loan-summary'),'textContent',`网贷欠款 ${yen(loan.outstanding)} · 总额度 ${yen(terms.limit)} · 可再借 ${yen(terms.availableCredit)} · 日利率 ${rate}% · 预计下次利息 ${yen(terms.estimatedDailyInterest)}。`);
 update($('loan-assets'),'textContent',`账户总资产 ${yen(terms.nominalAssets)} · 欠款 ${yen(terms.totalDebt)} · 净资产 ${yen(terms.netAssets)} · 可还 ${yen(terms.maxRepayment)}`);
 update($('loan-rules'),'textContent',state.mode==='endless'?'每16根K线按当时利率结息，未付利息计入欠款。额度与利率随资产、债务、借款次数和情绪调整。':'每日收盘结息，提前结束同样结息；未付利息计入欠款。');
 update($('loan-borrow'),'disabled',loanBusy||!canBorrow);update($('loan-repay'),'disabled',loanBusy||terms.maxRepayment<=0);
 for(const b of $('loan-dialog').querySelectorAll('[data-loan-action]')){const limit=b.dataset.loanAction==='borrow'?terms.availableCredit:terms.maxRepayment,amount=b.dataset.loanAmount==='max'?limit:Number(b.dataset.loanAmount);update(b,'disabled',loanBusy||amount<=0||amount>limit||(b.dataset.loanAction==='borrow'&&(!canBorrow||amount<terms.minBorrow)));}
}
// Market timers pause behind dialogs, but emotional pressure still cools in wall time.
// Refresh only the visible quote; do not advance the market or change typed amounts.
setInterval(()=>{
 if($('loan-dialog').open&&!document.hidden&&!saveSession.blocked&&!loanBusy&&!actionBusy)renderLoanDialog();
},250);
function renderQuoteRefreshChoices(){
 $('quote-package-open').disabled=actionBusy;
 const node=$('quote-refresh-options'),html=quoteRefreshMarkup(state,{availableCash:Math.min(Math.max(0,state.cash),accountMetrics(state).availableMargin),canPurchase:tradingOpen(state),busy:actionBusy});
 // Compare the source markup, not browser-normalized innerHTML: rebuilding at
 // 20 fps replaces pressed buttons before pointerup and loses downgrade clicks.
 if(node.quoteRefreshMarkup!==html){node.innerHTML=html;node.quoteRefreshMarkup=html;}
}
async function executeQuotePackage(minutes,hz=null){
 if(quoteBusyGeneration===stateGeneration||actionBusy||!guardProgress())return;
 const generation=stateGeneration,session=saveSession;quoteBusyGeneration=generation;actionBusy=true;renderQuoteRefreshChoices();
 try{const result=hz===null?selectCandlePeriod(state,minutes):purchaseQuoteRefresh(state,hz);const saved=await persist();if(generation!==stateGeneration||session!==saveSession)return;if(saved)toast(result.charged?`${result.receipt.label} · ${yen(result.amount)}`:hz===null?`已切换${candlePeriodNotice(state,{includeTimeZone:false})}`:'已切换盘面刷新');}
 catch(error){toast(error.message,'loss');}
 finally{if(generation===stateGeneration&&session===saveSession){quoteBusyGeneration=-1;actionBusy=false;render();marketClock.reschedule();}}
}
$('quote-package-open').onclick=()=>executeQuotePackage(nextCandlePeriod(state));
$('quote-refresh-options').onclick=e=>{const b=e.target.closest('[data-quote-hz]');if(b&&!b.disabled)executeQuotePackage(null,Number(b.dataset.quoteHz));};
for(const b of document.querySelectorAll('[data-ma-toggle]'))b.addEventListener('click',()=>{const period=Number(b.dataset.maToggle);maSettings[period]=!maSettings[period];storage.setItem('fx-moving-averages',JSON.stringify(maSettings));chart();});
const playfulLoan=mountPlayfulLoan({dialog:$('loan-dialog'),controls:$('loan-controls'),getContext:()=>`${stateGeneration}:${state.runId}:${state.day}:${state.phase}`,getTerms:()=>networkLoanTerms(state),commit:amount=>executeLoanAction('borrow',amount,true),onError:error=>setText('loan-error',error.message),format:yen});
function executeLoanAction(kind,requested,confirmed=false){
 if(loanBusy||actionBusy||!$('loan-dialog').open||!guardProgress()||(!confirmed&&playfulLoan.active))return;
 loanBusy=true;
 try{const terms=networkLoanTerms(state),amount=requested==='max'?(kind==='borrow'?terms.availableCredit:terms.maxRepayment):Number(requested);if(kind==='borrow'&&!confirmed){setText('loan-error','');playfulLoan.begin(amount);return;}(kind==='borrow'?borrowNetwork:repayNetwork)(state,amount);track(kind==='borrow'?'item_used':'story_choice',kind==='borrow'?'quick-borrow':'quick-repay',{kind:'loan',reason:kind==='borrow'?'borrowed':'repaid'});$('loan-dialog').close();render();toast(`${kind==='borrow'?'借入':'归还'} ${yen(amount)}`);}
 catch(error){setText('loan-error',error.message);}
 finally{loanBusy=false;if($('loan-dialog').open)renderLoanDialog();}
}
$('loan-open').onclick=()=>{if(actionBusy||!guardProgress())return;setText('loan-error','');renderLoanDialog();$('loan-dialog').showModal();};
$('loan-borrow').onclick=()=>executeLoanAction('borrow',$('loan-amount').value);
$('loan-repay').onclick=()=>executeLoanAction('repay',$('loan-amount').value);
$('loan-quick-actions').onclick=e=>{const b=e.target.closest('[data-loan-action]');if(b&&!b.disabled)executeLoanAction(b.dataset.loanAction,b.dataset.loanAmount);};
let rankingMode='total',rankingGameMode=state.mode||'story',rankingSort='survival',rankingRequest=0,rankingBusy=false;
function rankingEligibility(){
 let submitted=false;try{submitted=state.phase==='ending'&&!hasDevelopmentTaint(state,storage)&&(automaticLeaderboard.completed.has(state.runId)||storage.getItem('fx-api-v1-finished-score-'+state.runId)==='1');}catch{}
 setText('ranking-eligibility',isDevelopmentTainted()?'开发测试局不进入名人堂':[2,3].includes(state.historical?.version)?'历史行情不进入名人堂':submitted?'本局成绩已自动上榜，可以修改昵称。':state.phase==='ending'?'终局成绩会在保存成功且联网后自动提交，默认匿名。':liveRankingEnabled()?'成交保存后自动上榜，之后约每 90 秒更新；结束后更新为最终成绩。':'进行中成绩不自动更新；结束本局后提交最终成绩。');
 const liveSubmitted=liveRanking.runs.get(state.runId)?.score;
 const sameMode=rankingGameMode===(state.mode||'story'),terminal=state.phase==='ending';
 $('ranking-walkaway').hidden=terminal||!sameMode;
 $('ranking-walkaway').disabled=actionBusy||saveSession.blocked||isDevelopmentRun()!==false||!canRequestWalkaway(state);
 setText('ranking-walkaway-note',!sameMode?'正在浏览另一模式的榜单；切回本局模式后可收手。':terminal?'':isDevelopmentTainted()?'开发测试局不能公开上榜。':[2,3].includes(state.historical?.version)?'历史行情不进入名人堂。':state.walkawayRequested?'正在离场结算，完成后自动上榜。':'结束当前'+(state.mode==='endless'?'操盘':'剧情')+'局，按当前报价平仓；结算保存成功后自动上榜。');
 $('ranking-submit-retry').hidden=!terminal||submitted||isDevelopmentRun()!==false;
 $('ranking-submit-retry').disabled=saveSession.blocked;
 $('ranking-publish').disabled=rankingBusy||!(submitted||liveSubmitted);return submitted||!!liveSubmitted;
}
function updateAutomaticRankingStatus(result){
 const text=automaticRankingStatusText(result);setText('automatic-score-status',text);setText('ranking-auto-status',text);rankingEligibility();
}
window.addEventListener('online',()=>{if(state.phase==='ending')void rankingLifecycle.submit();if(state.lottery?.disqualificationPending)void retryLotteryDisqualification();});
const percent=value=>Number.isFinite(value)?(value*100).toFixed(2)+'%':'—';
async function readRanking(){const request=++rankingRequest;setText('ranking-status','正在读取…');$('ranking-table').replaceChildren();for(const b of document.querySelectorAll('[data-ranking-game]'))b.setAttribute('aria-pressed',String(b.dataset.rankingGame===rankingGameMode));
 const syncSortOptions=supported=>{
  if(!Array.isArray(supported))return '';const pending=[];
  for(const option of $('ranking-sort').options||[]){
   const label=option.dataset.sortLabel||(option.dataset.sortLabel=option.textContent);
   option.disabled=!supported.includes(option.value);option.textContent=label+(option.disabled?'（暂未开放）':'');
   option.title=option.disabled?'当前服务尚未开放此榜单':'';if(option.disabled)pending.push(label);
  }
  return pending.length?' · 尚未开放：'+pending.join('、'):'';
 };
 try{const data=await leaderboard.read({mode:rankingMode,gameMode:rankingGameMode,sort:rankingSort,limit:20});if(request!==rankingRequest)return;
  const supported=leaderboard.sortCapabilities||data.sortContract?.supported||['survival','returnRate','dailyReturnRate','totalProfit','maxProfit','winRate','maxOrderLoss'],availability=syncSortOptions(supported);
  if(!data.rows.length){setText('ranking-status','这个模式还没有提交的成绩。'+availability);return;}
  const box=$('ranking-table');for(const r of data.rows){const card=document.createElement('article');card.className='ranking-entry';const header=document.createElement('div');header.className='ranking-entry-head';const name=document.createElement('b');name.textContent=`${Number.isInteger(r.rank)&&r.rank>0?r.rank+'. ':''}${r.name||'匿名交易员'}`;const days=document.createElement('strong');days.textContent=`${r.gameFinished===false?'进度 · ':'已结束 · '}存活 ${r.daysSurvived} 天`;header.append(name,days);card.append(header);const hero=document.createElement('div');hero.className='ranking-return';hero.textContent=percent(r.returnRate);const sub=document.createElement('span');sub.textContent='总收益率';hero.prepend(sub);if(Number.isFinite(r.returnRate))hero.classList.add(r.returnRate>=0?'positive':'negative');card.append(hero);const grid=document.createElement('div');grid.className='ranking-metrics';for(const [label,value] of hallMetricLabels(r,{yen,signed,percent})){const cell=document.createElement('div'),key=document.createElement('span'),val=document.createElement('b');key.textContent=label;val.textContent=value;cell.append(key,val);grid.append(cell);}card.append(grid);box.append(card);}setText('ranking-status',`${rankingGameMode==='endless'?'操盘':'剧情'}模式 · ${data.rows.length} 位玩家${availability}`);
 }catch(error){if(request===rankingRequest){const availability=syncSortOptions(leaderboard.sortCapabilities);setText('ranking-status',error.message+(error.code==='sort-unavailable'?'请选择其它榜单。':'，可点击重新读取。')+availability);}}
}
$('leaderboard-open').onclick=()=>{rankingGameMode=state.mode||'story';rankingEligibility();$('leaderboard-dialog').showModal();void readRanking();};
$('leaderboard-dialog').addEventListener('close',()=>{rankingRequest++;continueScenes();});
for(const b of document.querySelectorAll('[data-ranking-game]'))b.onclick=()=>{rankingGameMode=b.dataset.rankingGame;rankingEligibility();void readRanking();};
$('ranking-sort').onchange=()=>{rankingSort=$('ranking-sort').value;void readRanking();};
$('ranking-walkaway').onclick=()=>{if(rankingGameMode!==(state.mode||'story')||isDevelopmentRun()!==false)return;openWalkaway();};
$('walkaway-dialog').addEventListener('close',()=>{if($('walkaway-dialog').returnValue==='confirmed'&&$('leaderboard-dialog').open)$('leaderboard-dialog').close();else if($('leaderboard-dialog').open){rankingEligibility();$('ranking-walkaway').focus({preventScroll:true});}});
$('ranking-submit-retry').onclick=async()=>{if(state.phase!=='ending')return;$('ranking-submit-retry').disabled=true;await rankingLifecycle.submit();rankingEligibility();};
$('ranking-share').onclick=()=>openShare('ranking');
$('ranking-retry').onclick=()=>void readRanking();
$('ranking-form').onsubmit=async e=>{e.preventDefault();if(rankingBusy||!rankingEligibility())return;rankingBusy=true;rankingEligibility();setText('ranking-status','正在更新昵称…');try{await leaderboard.rename(state.runId,$('ranking-name').value.trim());await readRanking();setText('ranking-status','昵称已更新。');}catch(error){setText('ranking-status',error.message);}finally{rankingBusy=false;rankingEligibility();}};

for(const type of ['pointerdown','keydown'])document.addEventListener(type,event=>{if(!event.isTrusted||event.target.closest?.('[data-frontend-target]'))return;unlockSafeAudio(event);audio.unlock();},{capture:true});
$('order-amount').value=orderAmount;
setText('storage-warning',UI_COPY.storageWarning);setText('share-hint',UI_COPY.shareHint);
for(const text of QUICK_HELP.quick){const p=document.createElement('p');p.textContent=text;$('help-copy').append(p);}
setText('help-details-title',QUICK_HELP.detailsTitle);
setText('player-comment-history-label',LIBRARY_COPY.allComments);
for(const text of UI_COPY.help){const p=document.createElement('p');p.textContent=text;$('help-advanced-copy').append(p);}
mountBgmPanel($('bgm-panel'),bgm);
bindBgmPreferences(bgm,{storage,document});
$('music-open').onclick=()=>$('bgm-dialog').showModal();
mountOriginalStoryLibrary({root:document,getMangaCollection:()=>mangaCollection});
for(const type of ['play','pause','ended','error'])document.addEventListener(type,event=>{
 if(!event.target?.matches?.('audio[data-voice-id]'))return;
 if(type==='play'){voice.stop();for(const player of document.querySelectorAll('audio[data-voice-id]'))if(player!==event.target)player.pause();}
 syncVoiceDuck();
},true);
document.addEventListener('kurumi-voice-audition-change',syncVoiceDuck);
observeNumericLayout();
const characterReader=mountCharacterStoryReader({getState:()=>state,getContext:()=>`${stateGeneration}:${state.mode}:${state.runId}`,canOpen:()=>!actionBusy&&!saveSession.blocked&&!document.querySelector('dialog[open]')&&!document.querySelector('.settlement-dialog')});
enhanceDialogs({onClose:()=>{syncVoiceDuck();syncSceneMusic();},onDismiss:dialog=>{
  if(['day-dialog','story-dialog','ending-dialog','bankrupt-dialog'].includes(dialog.id)){
    deferredScene={key:sceneKey(),id:dialog.id};$('scene-resume').hidden=false;if(dialog.id==='day-dialog')render();
  }
}});
// A single menu submits through this app's original state, guard and save path.
const lifeContext=()=>`${stateGeneration}:${state.mode}:${marketSourceOf(state).replace('historical-mixed','historical')}:${state.runId}`;
function lifeModel(){
 const status=lifeActionStatus(state),blocked=actionBusy||saveSession.blocked;
 return {status:blocked?{...status,enabled:false,reason:saveSession.blocked?'请先处理存档提示。':'正在完成上一项操作。'}:status,
  options:Object.fromEntries(['dinner','friend','work','relax'].map(category=>[category,lifeActionOptions(state,category)])),contextToken:lifeContext(),
  character:{emotion:document.getElementById('emotion-label')?.textContent||'—',sanity:state.sanity,stamina:staminaStatus(state).value},
  housingLabel:consumptionStatement(state).lifestyle.label,housingEnabled:state.mode==='story'&&!blocked&&(tradingOpen(state)||['day_end','resting'].includes(state.phase))};
}
function commitChosenLifeAction(action){
 if(actionBusy||!guardProgress())return {ok:false,reason:'请先处理当前提示。'};
 if(action.contextToken!==lifeContext())return {ok:false,reason:'这一局已经变化，请重新打开生活菜单。'};
 actionBusy=true;marketClock.stop();
 try{
  const result=commitLifeAction(state,action);
  if(result.applied){audio.unlock();track('transition','daily-settlement',{kind:'settlement',reason:'begin'},`settle:${state.day}`);for(const trade of result.report?.trades||[])trackExit(trade);}
  return result;
 }catch(error){return {ok:false,reason:error.message};}
 finally{actionBusy=false;render();}
}
function housingModel(){
 if(state.mode!=='story')return {contextToken:lifeContext(),selectedId:null,currentLabel:lifeActionStatus(state).reason,options:[]};
 const statement=consumptionStatement(state),enabled=state.mode==='story'&&!actionBusy&&!saveSession.blocked&&(tradingOpen(state)||['day_end','resting'].includes(state.phase));
 const current=statement.currentHousing,pending=statement.scheduledHousing;
 return {contextToken:lifeContext(),selectedId:statement.lifestyle.id,currentLabel:`当前住处：${current.label}`,
  pendingLabel:pending?`已预约：第${pending.effectiveDay}日搬入${pending.plan.label}`:'',
  options:LIFESTYLES.map(plan=>{
   const quote=quoteHousingSelection(state,plan.id),affordable=accountMetrics(state).availableMargin+1e-6>=quote.moveInCost;
   const returning=!!pending&&current.id===plan.id,currency=value=>`¥${value.toLocaleString('zh-CN',{maximumFractionDigits:2})}`;
   return {...quote,id:plan.id,enabled:enabled&&affordable,
    reason:!enabled?'当前不能调整住处':!affordable?'可用资金不足以支付搬入费':!quote.changed?(pending?.toId===plan.id?'已预约':'当前安排'):'',
    summary:returning?`取消搬家预约，继续住在${plan.label}。已付搬入费不退还。`:`现在支付搬入费 ${currency(quote.moveInCost)}；第${quote.effectiveDay}日起 ${currency(quote.dailyCost)}/日`,
    actionLabel:!quote.changed?(pending?.toId===plan.id?'已预约':'当前住处'):returning?'取消搬家预约':quote.moveInCost?`支付 ${currency(quote.moveInCost)} 搬入费并预约`:'确认预约（搬入费 ¥0）'};
  })};
}
const lifeHousingPicker=mountLifeHousingPicker({document,dialog:$('life-housing-dialog'),getModel:housingModel,onChoose:action=>{
 if(actionBusy||!guardProgress())return {ok:false,reason:'请先处理当前提示。'};
 if(state.mode!=='story')return {ok:false,reason:lifeActionStatus(state).reason};
 if(action.contextToken!==lifeContext())return {ok:false,reason:'这一局已经变化，请返回生活菜单后重新选择。'};
 try{const result=selectLifestyle(state,action.id);render();return {ok:true,result,message:result.toId===state.livingHousing?.id?'已取消搬家预约；已付搬入费不退还。':`已预约第${result.effectiveDay}日搬入${result.label}，搬入费 ¥${result.moveInCost.toLocaleString('zh-CN',{maximumFractionDigits:2})}。`};}
 catch(error){return {ok:false,reason:error.message};}
}});
function openLifeHousing(options){
 if(state.mode!=='story')return false;
 if(actionBusy||!guardProgress())return false;
 return lifeHousingPicker.open(options);
}
lifePicker=mountLifeActionPicker({document,getModel:lifeModel,onChoose:commitChosenLifeAction,onHousing:openLifeHousing,onClose:()=>queueMicrotask(continueScenes)});
$('life-open').onclick=()=>{
 if(actionBusy||!guardProgress())return;
 if(state.mode!=='story'){toast(lifeActionStatus(state).reason);return;}
 if(state.mode==='story'&&state.dayReport?.day===state.day&&['day_end','resting'].includes(state.phase)){deferredScene=null;$('scene-resume').hidden=true;showDayDialog();return;}
 if(state.phase==='closing'){continueScenes();return;}
 lifePicker.open();
};
mangaCollection=mountMangaCollection({root:document,getProfile:()=>achievementProfile});
$('scene-resume').onclick=()=>{const deferred=deferredScene;deferredScene=null;$('scene-resume').hidden=true;if(deferred?.key===sceneKey()&&deferred.id==='day-dialog')showDayDialog();else continueScenes();};

function queueLotteryReveal(){
 const ticket=state.lottery?.tickets.find(row=>row.status==='settled'&&!lotteryAnnounced.has(row.id));
 if(!ticket||lotteryRevealSavePending||actionBusy||saveSession.blocked)return;
 const generation=stateGeneration;lotteryRevealSavePending=true;
 void persist().then(saved=>{
  if(!saved||generation!==stateGeneration)return;
  lotteryAnnounced.add(ticket.id);
  if(!document.querySelector('dialog[open]'))void openLotteryResult(ticket);
  else toast('彩票已开奖，可在每日补给查看。');
 }).finally(()=>{lotteryRevealSavePending=false;});
}
async function retryLotteryDisqualification(){
 if(actionBusy||!guardProgress()||!state.lottery?.disqualificationPending||!hasLotteryCheat(state))return;
 const generation=stateGeneration;
 try{if(!await persist()||generation!==stateGeneration)return;await leaderboard.disqualifyLottery(state,{saved:true});if(generation!==stateGeneration)return;state.lottery.disqualificationPending=false;await persist();}catch(error){if(generation===stateGeneration)toast(error.message,'loss');}
}
async function performLotteryAction(action){
 if(actionBusy||!guardProgress())return;
 const generation=stateGeneration;actionBusy=true;
 try{
  const result=action();
  if(result.excludePublicRanking)state.lottery.disqualificationPending=true;
  if(result.reason)throw Error({'already-purchased':'今天已经买过了','insufficient-funds':'可用资金不足','already-redeemed':'暗号已经兑换过了','invalid-code':'暗号不对'}[result.reason]||'当前无法领取');
  const saved=await persist();if(generation!==stateGeneration)return;
  if(!saved){toast('彩票进度已保留在本页，请重试保存后再查看。','loss');return;}
  if(result.excludePublicRanking){try{await leaderboard.disqualifyLottery(state,{saved:true});state.lottery.disqualificationPending=false;await persist();}catch(error){toast(error.message,'loss');}}
  toast(result.ticket?.kind==='cheat'?'暗号已兑换，次日揭晓。本局不参与公共排行榜。':'彩票已买好，次个游戏日开奖。');
 }catch(error){if(generation===stateGeneration)toast(error.message,'loss');}
 finally{if(generation===stateGeneration){actionBusy=false;render();}}
}
async function openLotteryResult(ticket){
 if(actionBusy||!guardProgress()||ticket?.status!=='settled')return;
 const generation=stateGeneration;actionBusy=true;
 try{
  if(!await persist()||generation!==stateGeneration)return;
  const current=state.lottery?.tickets.find(row=>row.id===ticket.id);if(!current||current.status!=='settled')return;
  lotteryRevealUI?.dispose();
  lotteryRevealUI=mountLotteryView($('lottery-reveal'),{ticket:current,saved:true,reducedMotion:!shouldAnimate(),onClose:()=>$('lottery-dialog').close()});
  $('lottery-dialog').showModal();
 }catch(error){toast(error.message,'loss');}
 finally{if(generation===stateGeneration){actionBusy=false;render();}}
}
function renderTools(){
 characterReader.refresh();
 const box=$('tool-list');loadInventoryStyles(document);
 const focusedLottery=lotteryCardUI?.root?.contains(document.activeElement)&&document.activeElement.tagName==='INPUT',lotterySelection=focusedLottery?[document.activeElement.selectionStart,document.activeElement.selectionEnd]:null;
 const model=inventoryModel({state,props:PROPS,jobs:LIFE_WORK_JOBS,effects:WORK_ITEM_EFFECTS,availableMargin:accountMetrics(state).availableMargin,canUse:tradingOpen(state)||['day_end','resting'].includes(state.phase),canUseFather:tradingOpen(state)||['day_end','resting'].includes(state.phase),busy:actionBusy,itemDiscovered,itemUnlocked});
 $('inventory-empty').hidden=true;setText('inventory-count',model.count+' 件');renderInventory({document,box,model});if(model.father)ensurePropInventoryArt(box.querySelector('[data-prop="father"]'),'father');
 if(state.mode==='story'){
  const codeValue=lotteryCardUI?.root?.querySelector('input')?.value||'';lotteryCardUI?.dispose();
  const section=document.createElement('section');section.className='inventory-lottery';box.append(section);
  lotteryCardUI=mountLotteryCard(section,{state,onPurchase:()=>performLotteryAction(()=>purchaseLotteryTicket(state)),onCode:code=>performLotteryAction(()=>redeemLotteryCode(state,{code})),onOpen:openLotteryResult,onError:error=>toast(error.message,'loss')});lotteryCardUI.root=section;
  section.querySelector('input').value=codeValue;if(focusedLottery){const input=section.querySelector('input');input.focus({preventScroll:true});input.setSelectionRange(...lotterySelection);}section.querySelectorAll('button').forEach(button=>{if(actionBusy)button.disabled=true;});
 }
 queueLotteryReveal();
 $('family-panel').hidden=!state.fatherUsed;setText('family-debt',`父亲的柜中存款 · 欠款 ${yen(state.family.outstanding)} · 已归还 ${yen(state.family.repaid)}`);$('repay-open').disabled=!tradingOpen(state)&&!['day_end','resting'].includes(state.phase)||state.family.outstanding<=0||accountMetrics(state).availableMargin<1;

 $('bankrupt-rescue').hidden=!state.family.unlocked||state.fatherUsed;
 const credit=networkLoanTerms(state);$('loan-panel').hidden=!state.loan?.discovered;setText('loan-state',state.loan?.unlocked?'已开放':'未解锁');setText('loan-effect',`当前额度 ${yen(credit.limit)} · 日利率 ${(credit.dailyRate*100).toFixed(3)}% · 当前欠款 ${yen(state.loan?.outstanding||0)}`);$('loan-open').disabled=!state.loan?.unlocked||!tradingOpen(state)&&!['day_end','resting'].includes(state.phase)||actionBusy;
}
function continueScenes(){
  if(!guardProgress())return;
  if(deferredScene?.key===sceneKey())return;
  if(state.phase==='ending'){if(!document.querySelector('dialog[open]')&&!document.querySelector('.settlement-dialog'))showEnding();return;}
  if(state.mode==='endless'){if(state.phase==='ending'&&!document.querySelector('dialog[open]')&&!document.querySelector('.settlement-dialog'))showEnding();return;}
  if(state.realtime&&state.phase==='closing'){if(state.liveMarket?.version===1&&!livePositionsReady(state))return;settleDay(state);track('transition','daily-settlement',{kind:'settlement',reason:'begin'},`settle:${state.day}`);for(const t of state.dayReport.trades)trackExit(t);render();}

 if(['playing','closing'].includes(state.phase)||document.querySelector('dialog[open]')||document.querySelector('.settlement-dialog'))return;
 if(eventComics.presentPending())return;
 if(state.mode==='story'&&!state.openingSeen){showOpening();return;}
 if(state.phase==='resting'&&state.dayReport?.day===state.day&&settlementPresentation(state)?.stage!=='complete'){showDayDialog();return;}
 const event=pendingStory(state);if(event){showStory(event);return;}
 if(state.phase==='day_end')showDaySettlement();else if(state.phase==='ending')showEnding();else if(state.phase==='resting'){track('rest_end','night',{day:state.day},`rest-end:${state.day}`);if(state.walkawayRequested){const forced=endingCondition(state);finishCampaign(state,['broke','crisis'].includes(forced)?forced:'walkaway');}else {if(isHistorical(state)&&!hasHistoricalFeed(state)&&!historicalSimulationActive(state)){void ensureHistoricalLoaded();return;}try{nextDay(state);}catch(error){toast(error.message);return;}}render();void ensureHistoricalLoaded();continueScenes();}else telemetry.view({screen:'trading',run:state.runId,day:state.day});
}
function showCaptions(id,lines){$(id).replaceChildren();lines.forEach((line,i)=>{const p=document.createElement('p');if(line)p.textContent=`${i+1} / ${line}`;$(id).append(p);});}
function renderStoryFrame(frame,event){if(event?.key==='friendStudy'){const art=propEventArt('mochiko',{applied:true});renderFatherIllustration(frame,{art});frame.className='story-scene-image';}else renderMangaSelection(frame,selectNarrativeManga(state,{kind:'event',event}),{openSource:openMangaSource});}

function showStory(event){
 telemetry.view({screen:'story',run:state.runId,day:state.day});track('story_seen',event.id,{storyId:event.id,mood:mood(state)},`story:${event.id}`);setText('story-title',event.title);
 renderStoryFrame($('story-comic-frame'),event);$('story-captions').hidden=true;
 $('story-lines').replaceChildren();for(const [from,text] of [...event.lines,...(event.choices.length===1?event.choices[0].lines:[])]){const p=document.createElement('p');p.textContent=`${from}：${text}`;$('story-lines').append(p);}
 const box=$('story-choices');box.replaceChildren();for(const choice of event.choices){const b=document.createElement('button');b.textContent=state.phase==='resting'?TRANSITION_COPY.restContinue:choice.label;b.dataset.storyChoice=choice.id;box.append(b);}$('story-dialog').showModal();
}
$('story-dialog').addEventListener('cancel',e=>e.preventDefault());
$('story-choices').addEventListener('click',e=>{const b=e.target.closest('[data-story-choice]');if(!b)return;try{const result=chooseStory(state,b.dataset.storyChoice);mentalState(state);track('story_choice',result.event.id,{storyId:result.event.id,choiceId:result.choice.id});for(const id of result.unlocked)track('item_unlocked',id,{itemId:id,storyId:result.event.id});$('story-dialog').close();render();continueScenes();}catch(error){toast(error.message);}});
$('privacy-toggle').onclick=()=>{setText('privacy-copy',UI_COPY.privacy);setText('privacy-state',telemetry.dnt?'浏览器 DNT / GPC 已关闭统计':isDevelopmentTainted()?'开发测试局不发送统计':[2,3].includes(state.historical?.version)?'历史行情不发送统计':telemetry.enabled?'当前：开启':'当前：关闭');setText('privacy-confirm',telemetry.enabled?'关闭匿名统计':'开启匿名统计');$('privacy-confirm').disabled=telemetry.dnt||isDevelopmentRun();$('privacy-dialog').showModal();renderTelemetryDiagnostics();};
$('privacy-confirm').onclick=()=>{const next=!telemetry.enabled;storage.setItem('fx-girl-analytics',next?'on':'off');telemetry.setEnabled(next);$('privacy-dialog').close();render();};
function resetRepayValidation(){ $('repay-amount').removeAttribute('aria-invalid');const limit=`可归还资金 ${yen(accountMetrics(state).availableMargin)} · 欠款 ${yen(state.family.outstanding)}`;if($('repay-limit').textContent!==limit)setText('repay-limit',limit); }
$('repay-open').onclick=()=>{const max=Math.floor(Math.min(accountMetrics(state).availableMargin,state.family.outstanding));$('repay-amount').max=max;$('repay-amount').value=Math.min(max,10000);resetRepayValidation();$('repay-dialog').showModal();};
$('repay-amount').addEventListener('input',resetRepayValidation);
$('repay-all').onclick=()=>{$('repay-amount').value=Math.floor(Math.min(accountMetrics(state).availableMargin,state.family.outstanding));resetRepayValidation();};
$('repay-confirm').onclick=()=>{
 const input=$('repay-amount'),amount=Number(input.value);
 try{const r=repayFather(state,amount);track('story_choice','father-repay',{kind:'family-funds',reason:'repaid'});input.removeAttribute('aria-invalid');$('repay-dialog').close();toast(`归还 ${yen(r.amount)}`);render();continueScenes();}
 catch(e){setText('repay-limit',e.message);const amountInvalid=(tradingOpen(state)||['day_end','resting'].includes(state.phase))&&(!Number.isFinite(amount)||amount<=0||amount>accountMetrics(state).availableMargin||amount>state.family.outstanding);if(amountInvalid){input.setAttribute('aria-invalid','true');input.focus();}else input.removeAttribute('aria-invalid');}
};
$('bankrupt-rescue').onclick=()=>{$('bankrupt-dialog').close();showProp('father');};
$('voice-toggle').onclick=()=>{
 if(document.hidden||document.querySelector('dialog[open]'))return;
 if(voice.playing||voice.loading){voice.stop();renderCharacter();return;}
 pauseAuditions();renderCharacter();voice.unlock();void voice.play(voice.lastMood,state.speech?.id);
};
const fatherAmountControls=mountFatherAmountControls($('father-take-dialog'),()=>state);
$('father-take-confirm').onclick=()=>{if(!$('father-take-amount').reportValidity())return;$('father-take-dialog').close();void showProp('father',true);};


function showEnding(){
 const viewState=state,viewSession=saveSession,viewGeneration=stateGeneration,e=state.ending,finalSnapshot=structuredClone(state),finalReport=buildResultsReport(finalSnapshot,{recap:buildRecapSnapshot(finalSnapshot)}),ending=finalReport.ending;
 const endingArt=selectEndingVariantArt(finalSnapshot,ending),selection=endingArt?null:selectNarrativeManga({...state,ending:{...e,variant:ending.variant}},{kind:'ending'});
 const original=endingOriginalPresentation(state,ending,endingArt,selection),media=original.media,context=endingPresentationContext(state,ending,media),theater=!endingPresentationState(state,context);
 $('ending-results').hidden=theater;if(theater)$('ending-results').replaceChildren();else mountResultsReport($('ending-results'),finalReport);
 $('automatic-score-status').hidden=theater;$('ending-restart').hidden=theater;$('ending-results-open').hidden=!theater;
 track('ending_seen',e.id,{kind:e.id,equityBucket:capitalBucket(e.equity),sanityBucket:bucket(e.sanity)},`ending:${e.id}`);
 setText('ending-title',`${ending.catalog.label} · ${ending.title}`);setText('ending-summary',`第 ${e.day} 天 · ${ending.description}`);
 const endingComic=$('ending-comic'),restoredBaseArt=state.mode==='story'&&!ending.variant&&['million','broke','crisis'].includes(e.id);
 endingComic.dataset.endingVariant=endingArt?.id||'';
 endingComic.hidden=!theater||!endingArt&&(state.mode==='story'&&!restoredBaseArt||!!ending.variant||e.id==='walkaway');
 if(!endingComic.hidden){
  setImage(endingComic,endingArt?.path||`./comics/ending-${e.id}.webp`,{onStatus:status=>{
   if(state===viewState&&saveSession===viewSession&&stateGeneration===viewGeneration&&(endingArt?endingComic.dataset.endingVariant===endingArt.id:restoredBaseArt&&state.ending?.id===e.id))endingComic.hidden=!!endingPresentationState(state,context)||status==='unavailable';
  }});
  if((endingArt||restoredBaseArt)&&endingComic.classList.contains('image-unavailable'))endingComic.hidden=true;
 }
 if(!theater||endingArt){$('ending-manga').replaceChildren();$('ending-manga').hidden=true;}
 else renderMangaSelection($('ending-manga'),selection,{openSource:openMangaSource});
 mountEndingOriginal($('ending-manga'),theater?original.selection:null);
 $('ending-comic').alt=ending.title;
 const endingCaptionHost=$('ending-captions'),endingDialogue=theater&&ending.variant?selectEndingVariantDialogue(finalSnapshot,ending,endingArt):null;
 endingCaptionHost.hidden=!theater||!!ending.variant&&!endingDialogue;
 if(ending.variant)mountEndingVariantDialogue(endingCaptionHost,endingDialogue,{root:document});
 else{endingCaptionHost.dataset.dialogueId='';endingCaptionHost.dataset.dialogueOrigin='';showCaptions('ending-captions',e.id==='walkaway'?['久留美也曾说过，要放弃 FX。','这一局，就先停在这里。']:comicCaptions(e.id,state));}
 setText('ending-before','');if(!$('ending-dialog').open)$('ending-dialog').showModal();
 bindEndingPresentation({dialog:$('ending-dialog'),button:$('ending-results-open'),images:endingArt?[endingComic]:[...($('ending-manga').querySelectorAll?.('img')||[]),...(!endingComic.hidden?[endingComic]:[])],context,
  getState:()=>state,getGeneration:()=>stateGeneration,getSession:()=>saveSession,canAdvance:()=>!actionBusy&&guardProgress(),
  getContext:()=>{const current=buildResultsReport(state).ending,art=selectEndingVariantArt(state,current),manga=art?null:selectNarrativeManga({...state,ending:{...state.ending,variant:current?.variant}},{kind:'ending'});return endingPresentationContext(state,current,endingOriginalPresentation(state,current,art,manga).media);},
  onAdvance:()=>{void persist();if(!saveSession.blocked)showEnding();}});
 void rankingLifecycle.submit();
}

function renderTelemetryDiagnostics(){const player=telemetry.identity(),d=telemetry.snapshot();setText('privacy-diagnostics',`我的匿名编号：${player||'未采集'}\n当前会话：${player&&telemetry.session||'未采集'}\n当前局：${player&&telemetry.context.run||'未采集'}\n可用这些编号在私有统计里查找自己的记录。会话随刷新更新；匿名编号在清理存储或关闭统计后重置。\n构建：${d.build}\n接收端：${d.endpoint||'未配置'}\n当前状态：${d.reason}\n待发送 ${d.queued} · 已确认 ${d.sent} · 失败尝试 ${d.failed}\n已过滤 ${d.filteredCount} · 最近原因 ${d.lastFilterReason||'无'}\n最近HTTP ${d.lastStatus||'无'} · 最近确认 ${d.lastSent?new Date(d.lastSent).toLocaleTimeString():'无'}`);}
telemetry.onStatus=()=>{if($('privacy-dialog').open)renderTelemetryDiagnostics();};

async function initializeHistoricalUI(){
 if(replayConfigured(SHARED_REPLAY_CONFIG))for(const prefix of ['mode','restart']){const live=document.querySelector(`[data-market-prefix="${prefix}"][data-market="live"]`);if(live){const option=live.cloneNode(true);option.dataset.market='shared-replay';option.textContent='延迟共享回放';option.setAttribute('aria-pressed','false');option.classList.remove('selected');live.after(option);const select=$(prefix+'-market');if(select.tagName==='SELECT'){const item=document.createElement('option');item.value='shared-replay';item.textContent='延迟共享回放';select.append(item);}}}
marketSourcePicker=mountMarketSourcePicker({document,library:historicalLibrary,getMode:prefix=>prefix==='restart'?selectedMode:openingMode,acquireHistory:({datasets})=>{historyAcquireController=new AbortController();return acquireGameHistory({datasets,signal:AbortSignal.any([historyAcquireController.signal,AbortSignal.timeout(120000)])});},cancelAcquire:()=>historyAcquireController?.abort(),onSelect:(prefix,market)=>{if(prefix==='mode')refreshModeResumeLabels(market);},importFile:async(file,options)=>{if(file.name?.toLowerCase().endsWith('.fxresearch'))return importResearchPackage(file,options);return importHistoricalPackage(file,options);}});
 syncMarketSelectors('mode',selectedMarket);$('restart-market').value=selectedMarket;
 $('historical-resume').onclick=()=>{if(guardProgress())void ensureHistoricalLoaded(true);};
 try{await marketSourcePicker.load();}catch(error){setText('history-choice-status',error.message||'历史行情暂时无法读取，请重试。');}await ensureHistoricalLoaded(true);
}
function syncMarketSelectors(prefix,market){if(marketSourcePicker)marketSourcePicker.select(prefix,market);else $(prefix+'-market').value=market;}
function selectedHistoricalOptions(prefix,mode){return marketSourcePicker.options(prefix,mode);}
async function ensureHistoricalLoaded(retry=false){
 if(!isHistorical(state)||historicalLoad||(!retry&&(hasHistoricalFeed(state)||state.historical.status==='error')))return;
 const target=state,generation=stateGeneration,paused=target.historical.resumeAfterLoad===false;historicalLoad=target;startHistoricalContinuation(target,target.historical.status==='exhausted'?'exhausted':'loading');target.marketPaused=paused;marketClock.start();
 try{await historicalLibrary.restore(target);if(target!==state||generation!==stateGeneration)return;target.marketPaused=paused;delete target.historical.resumeAfterLoad;render();continueScenes();marketClock.start();}
 catch(error){if(target!==state||generation!==stateGeneration)return;target.historical.status='error';target.historical.error=error.message;startHistoricalContinuation(target,'loading');target.marketPaused=paused;render();marketClock.start();}
 finally{historicalLoad=null;if(isHistorical(state)&&!hasHistoricalFeed(state)&&(state.historical.status==='loading'||target!==state&&state.historical.status!=='error'))queueMicrotask(()=>ensureHistoricalLoaded());}
}
function renderHistoricalStatus(){
 const h=state.historical,notice=historicalSourceNotice(state),box=$('historical-status');box.hidden=!isHistorical(state)||h?.status!=='error';setText('market-disclosure',isHistorical(state)?'原创同人小游戏 · 非官方作品':'原创同人小游戏 · 非官方作品 · 虚构行情 · 非投资建议');if(!h)return;
 const text=notice||'';
 setText('historical-status-copy',text);$('historical-resume').hidden=h.status!=='error';$('historical-resume').textContent='重试';
 if(h.status==='error')setText('market-phase',text);
 setText('market-disclosure',isHistorical(state)?'原创同人小游戏 · 非官方作品':'原创同人小游戏 · 非官方作品 · 虚构行情 · 非投资建议');
}

function refreshModeResumeLabels(market){
 for(const button of document.querySelectorAll('[data-play-mode]')){
  const active=button.dataset.playMode===openingMode;button.setAttribute('aria-pressed',String(active));button.classList.toggle('selected',active);
 }
 const saved=modeStates.get(slot(openingMode,market))||restoreGame(sessionFor(openingMode,market).raw);
 $('mode-start').textContent=saved?'继续游戏':'开始游戏';
 $('mode-resume-note').hidden=!saved;
 $('mode-resume-note').textContent=saved&&isHistorical(saved)?`继续 ${saved.historical.date} 的进度`:'继续原进度';
}

addEventListener('resize',()=>chart());

// Same controls and running game; layout callbacks paint views only.
pixelDialogController=createPixelDialogController({document,getSettlement:()=>({snapshot:dayRecapSnapshot,livingReceipt:state.dayReport?.livingSettlement?.receipt})});
pixelFrontend=mountPixelFrontend({document,onLayout:()=>{chart();pixelDialogController.refreshLayout();mangaCollection?.refresh();},onAvailabilityChange:active=>{if(active)marketClock.start();else marketClock.stop();}});

// One pixel presentation is ready before first render or entry dialogs.
await pixelFrontend?.ready;
void initializeHistoricalUI();
render();if(guardProgress()){void retryLotteryDisqualification();if(state.liveSuspension?.active){openingMode=selectedMode;syncMarketSelectors('mode',selectedMarket);$('mode-dialog').showModal();}else if(firstVisit)$('mode-dialog').showModal();else if(state.mode==='story'&&!state.openingSeen)showOpening();else continueScenes();}
new MutationObserver(records=>{if(!records.some(({target})=>target.tagName==='DIALOG'))return;if(records.some(({target,oldValue})=>target.tagName==='DIALOG'&&oldValue===null))suspendStaminaWatching(state);marketStatus();renderInvestors();marketClock.reschedule();}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open'],attributeOldValue:true});renderInvestors();marketClock.start();
