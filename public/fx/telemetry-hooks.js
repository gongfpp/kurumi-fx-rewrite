// Only these fixed, schema-compatible categories may be used by new gameplay hooks.
// Do not add player input, amounts, export contents, error text or save data here.
const hook = (name,target,kind,reason) => Object.freeze({name,target,detail:Object.freeze({kind,reason})});
export const FX_TELEMETRY_HOOKS = Object.freeze({
  settlement_begin: hook('transition','daily-settlement','settlement','begin'),
  settlement_summary: hook('screen_view','daily-summary','settlement','summary'),
  settlement_living_cost: hook('screen_view','daily-living-cost','settlement','living-cost'),
  settlement_family: hook('screen_view','daily-family','settlement','family'),
  settlement_complete: hook('settlement_confirm','daily-settlement','settlement','complete'),
  living_cost_applied: hook('settlement_confirm','living-cost','living-cost','applied'),
  father_discovered: hook('story_seen','father-discovery','family-funds','discovered'),
  father_take: hook('item_used','father','family-funds','taken'),
  father_repay: hook('story_choice','father-repay','family-funds','repaid'),
  quick_borrow: hook('item_used','quick-borrow','loan','borrowed'),
  quick_repay: hook('story_choice','quick-repay','loan','repaid'),
  warning_margin: hook('story_seen','margin-warning','risk-warning','low-margin'),
  warning_living_cost: hook('story_seen','living-cost-warning','risk-warning','low-cash'),
  warning_debt: hook('story_seen','debt-warning','risk-warning','debt-due'),
  export_preview: hook('screen_view','report-export','export','preview'),
  export_download: hook('story_choice','report-export','export','download-requested'),
  export_shared: hook('story_choice','report-export','export','shared'),
  export_cancelled: hook('story_choice','report-export','export','cancelled'),
  export_failed: hook('error','report-export','export','failed'),
  settlement_failed: hook('error','daily-settlement','settlement','failed'),
  storage_failed: hook('error','local-save','storage','failed'),
});
