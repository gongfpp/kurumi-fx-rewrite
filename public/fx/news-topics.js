// Display preference only: these labels say nothing about price direction or surprise.
// Keep this map independent of the market generator and its unrevealed variants.
const TOPICS=['employment','inflation','growth','rate_guidance'];
const eventTopics=new Map([
 ['payroll','美国就业数据','employment'],
 ['extra_japan_wages','春季工资谈判','employment'],
 ['extra_us_wages','美国薪资压力','employment'],
 ['cpi','日本物价数据','inflation'],
 ['extra_us_inflation','美国通胀意外降温','inflation'],
 ['extra_japan_consumption','日本消费恢复','growth'],
 ['extra_us_growth_slow','美国增长放缓','growth'],
 ['extra_us_retail','美国零售走强','growth'],
 ['extra_japan_output','日本工业调查转弱','growth'],
 ['boj','日本央行会议','rate_guidance'],
 ['fed','美日利差','rate_guidance'],
 ['extra_rate_patience','日本政策耐心论','rate_guidance']
].flatMap(([id,chain,topic])=>[[id,topic],[chain,topic]]));
const archiveTopics=new Map(Object.entries({
 employment:['employment','wages','labor_demand','labor_market','labor_slack','labour_slack','full_time_jobs','job_composition','employment_composition','participation','job_openings','unemployment','labor_costs','labour_costs','real_wages'],
 inflation:['inflation','inflation_forecast','inflation_expectations','inflation_pressure','consumer_prices','core_prices','producer_prices','imported_inflation','disinflation'],
 growth:['growth','gdp','gdp_revision','growth_forecast','growth_rebalancing','growth_slowdown','growth_softness','global_growth','economic_outlook','national_accounts','industrial_production','industrial_output','inventory_adjustment','personal_income_spending','business_sentiment','business_survey','consumer_spending','consumption','domestic_demand'],
 rate_guidance:['rate_guidance','monetary_policy','policy_minutes','forward_guidance','policy_guidance','policy_threshold','policy_normalization','policy_expectations','rate_expectations','low_rates']
}).flatMap(([topic,aliases])=>aliases.map(alias=>[alias,topic])));

export function revealedNewsTopics(state,event,{flash=false}={}){
 if([1,2,3].includes(state.historical?.version))return [];
 const beat=Number.isInteger(state.beat)?state.beat:0;
 // Prefer the already delivered record. Old saves may retain only flashShown;
 // then the caller's current visible event supplies id/chain, never its outcome.
 const last=state.lastEvent;
 let visible=last?.beat===beat?last:null;
 if(!visible&&(flash&&event?.beat===beat||state.pending?.beat===beat&&state.pending.flashShown&&(event?.beat===undefined||event.beat===beat)))visible=event;
 if(!visible||visible.swan)return [];
 const topic=eventTopics.get(visible.id)||eventTopics.get(visible.chain);
 return topic?[topic]:[];
}

export function archiveTopicMatch(entry,revealedTopics){
 if(!Array.isArray(revealedTopics))return 0;
 const topics=revealedTopics.filter(topic=>TOPICS.includes(topic));
 if(!topics.length)return 0;
 const labels=[entry.catalyst,...(Array.isArray(entry.scenarioTags)?entry.scenarioTags:[])];
 // A single bounded bonus, within the existing diversity tier. Unknown labels
 // never exclude an article or create a new bag. Do not inspect directional tags.
 return labels.some(label=>topics.includes(archiveTopics.get(label)))?1:0;
}
