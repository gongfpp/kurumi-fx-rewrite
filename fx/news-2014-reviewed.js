// Existing Gemini factual summaries, independently source-reviewed. Display-only.
// Preserve dates, release vintages, attribution and review limits; never price inputs.
export const NEWS_2014_REVIEWED = Object.freeze([
  {
    "id": "2014-01-29-boe-carney-currency-unions",
    "date": "2014-01-29",
    "eventDate": "2014-01-29",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "Carney explains fiscal and banking foundations for a durable currency union",
    "sourceName": "BOE",
    "sourceUrl": "https://www.bankofengland.co.uk/-/media/boe/files/speech/2014/the-economics-of-currency-unions.pdf",
    "sourceLocator": "Cover p.1; opening p.2; banking union pp.7–8; conclusion p.10",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "In an Edinburgh speech, Mark Carney said a successful currency union needs arrangements for banking support and shared fiscal risk.",
      "He said any sterling arrangement for an independent Scotland would require negotiation between the two parliaments; he did not endorse or reject Scottish independence."
    ],
    "numericFacts": {},
    "referencePeriod": {
      "start": "2014-01-29",
      "end": "2014-01-29"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "GBP"
    ],
    "pairs": [
      "GBPJPY"
    ],
    "catalyst": "currency_union_risk",
    "eventType": "currency_union_risk",
    "eventFamily": "BOE:currency_union_risk",
    "eventKey": "BOE:currency_union_risk:2014-01-29:2014-01-29:2014-01-29:boe-carney-currency-unions",
    "independentEventId": "BOE:currency_union_risk:2014-01-29:2014-01-29:2014-01-29:boe-carney-currency-unions",
    "publicationDate": "2014-01-29",
    "publishedAt": null,
    "publicationLocalTime": null,
    "publicationTimeZone": "Europe/London",
    "publicationTimePrecision": "date",
    "availableAfterJst": "2014-01-30T18:00:00+09:00",
    "availabilityBasis": "Conservative next-calendar-day 18:00 JST gate, after the whole local publication day in each source timezone used here. This is not the claimed publication time.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "sterling",
      "scotland",
      "currency_union",
      "fiscal_backstop"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "unclear",
      "rationale": "Currency-arrangement uncertainty is relevant to sterling risk discussions, but this technical speech alone gives no reliable directional signal.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "卡尼谈独立苏格兰建立货币联盟条件",
    "summary": "卡尼表示成功的货币联盟需银行支持与财政共担；独立苏格兰若要安排英镑货币联盟，需由两地议会协商确定。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [],
    "researchCautions": [
      "Do not introduce the September referendum outcome into this January event.",
      "The technical speech is not a new currency agreement or a political endorsement."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "3bdddfcf4ddaa4e486e430766300e538e5e6b081b57384c3d8742b863143e711"
    },
    "sourceAttribution": "Bank of England; independent factual summary of the identified speaker and dated speech",
    "sourcePolicyUrl": "https://www.bankofengland.co.uk/legal",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy BOE in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "3bdddfcf4ddaa4e486e430766300e538e5e6b081b57384c3d8742b863143e711"
    }
  },
  {
    "id": "2014-02-20-us-january-cpi",
    "date": "2014-02-20",
    "eventDate": "2014-02-20",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "January US CPI: modest monthly rise with household energy gains",
    "sourceName": "BLS",
    "sourceUrl": "https://www.bls.gov/news.release/archives/cpi_02202014.htm",
    "sourceLocator": "Embargo header and first four paragraphs",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "The January CPI-U rose 0.1% seasonally adjusted from December and 1.6% over twelve months before seasonal adjustment.",
      "The core CPI rose 0.1% monthly and 1.6% annually; household energy price increases accounted for most of the headline monthly rise."
    ],
    "numericFacts": {
      "cpi_mom_sa_pct": 0.1,
      "cpi_yoy_nsa_pct": 1.6,
      "core_cpi_mom_sa_pct": 0.1,
      "core_cpi_yoy_nsa_pct": 1.6
    },
    "referencePeriod": {
      "start": "2014-01-01",
      "end": "2014-01-31"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "USD"
    ],
    "pairs": [
      "USDJPY"
    ],
    "catalyst": "inflation",
    "eventType": "inflation",
    "eventFamily": "BLS:inflation",
    "eventKey": "BLS:inflation:2014-01-01:2014-01-31:2014-02-20:us-january-cpi",
    "independentEventId": "BLS:inflation:2014-01-01:2014-01-31:2014-02-20:us-january-cpi",
    "publicationDate": "2014-02-20",
    "publishedAt": "2014-02-20T08:30:00-05:00",
    "publicationLocalTime": "08:30",
    "publicationTimeZone": "America/New_York",
    "publicationTimePrecision": "minute",
    "availableAfterJst": "2014-02-20T22:30:00+09:00",
    "availabilityBasis": "Official release embargo/header time, converted to JST; no earlier display.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "inflation",
      "household_energy",
      "core_prices"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "mixed",
      "rationale": "Modest inflation provides limited support for faster tightening; rising headline prices and subdued core inflation point in different directions.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "美国1月CPI同比上涨1.6%",
    "summary": "1月CPI-U季调环比涨0.1%，未季调同比涨1.6%；核心CPI环比涨0.1%、同比涨1.6%，家庭能源为主要拉动项。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [],
    "researchCautions": [
      "CPI is not the Fed’s PCE inflation target measure."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "7bd63adba9b12bcedb2dd7ad7877bc32b8500a9abb75c29f43900d0104f3a1a2"
    },
    "sourceAttribution": "Source: U.S. Bureau of Labor Statistics",
    "sourcePolicyUrl": "https://www.bls.gov/opub/copyright-information.htm",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy BLS in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "7bd63adba9b12bcedb2dd7ad7877bc32b8500a9abb75c29f43900d0104f3a1a2"
    }
  },
  {
    "id": "2014-03-13-au-february-employment",
    "date": "2014-03-13",
    "eventDate": "2014-03-13",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "February Australian employment gain coexists with higher participation",
    "sourceName": "ABS",
    "sourceUrl": "https://www.abs.gov.au/AUSSTATS/abs@.nsf/Lookup/6202.0Main%2BFeatures1Feb%202014?OpenDocument=",
    "sourceLocator": "Archived issue release header and February seasonally adjusted key points",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "February seasonally adjusted employment increased by 47,300, including an 80,500 increase in full-time work and a 33,300 decline in part-time work.",
      "The unemployment rate was 6.0%; participation rose 0.2 percentage points to 64.8%. The release reports a 0.1-point unemployment-rate increase using unrounded estimates although rounded January and February rates both display 6.0%."
    ],
    "numericFacts": {
      "employment_change_sa_persons": 47300,
      "fulltime_change_sa_persons": 80500,
      "parttime_change_sa_persons": -33300,
      "unemployment_rate_sa_pct": 6.0,
      "participation_rate_sa_pct": 64.8
    },
    "referencePeriod": {
      "start": "2014-02-01",
      "end": "2014-02-28"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "AUD"
    ],
    "pairs": [
      "AUDJPY"
    ],
    "catalyst": "employment",
    "eventType": "employment",
    "eventFamily": "ABS:employment",
    "eventKey": "ABS:employment:2014-02-01:2014-02-28:2014-03-13:au-february-employment",
    "independentEventId": "ABS:employment:2014-02-01:2014-02-28:2014-03-13:au-february-employment",
    "publicationDate": "2014-03-13",
    "publishedAt": "2014-03-13T11:30:00+11:00",
    "publicationLocalTime": "11:30",
    "publicationTimeZone": "Australia/Sydney",
    "publicationTimePrecision": "minute",
    "availableAfterJst": "2014-03-13T09:30:00+09:00",
    "availabilityBasis": "Official release embargo/header time, converted to JST; no earlier display.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "employment",
      "participation",
      "full_time_jobs"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "mixed",
      "rationale": "A large employment gain may support AUD, while rising unemployment and falling aggregate hours complicate a simple bullish reading.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "澳大利亚2月季调就业增4.73万人",
    "summary": "2月季调就业增加4.73万人，其中全职增8.05万人；失业率为6.0%，劳动参与率上升0.2个百分点至64.8%。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [],
    "researchCautions": [
      "Use this release vintage, including its later-revised employment estimate.",
      "Do not claim unemployment was unchanged: rounded levels and unrounded changes differ."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "ccbc70b45fe799e5d379a213b5f4efd38f2d5d8a5fac8d4ca528ba06344e9689"
    },
    "sourceAttribution": "Australian Bureau of Statistics; independently summarized from the dated release; accessed 11 October 2026",
    "sourcePolicyUrl": "https://www.abs.gov.au/website-privacy-copyright-and-disclaimer",
    "sourceLicenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy ABS in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "ccbc70b45fe799e5d379a213b5f4efd38f2d5d8a5fac8d4ca528ba06344e9689"
    }
  },
  {
    "id": "2014-04-10-au-march-employment",
    "date": "2014-04-10",
    "eventDate": "2014-04-10",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "March Australian unemployment rate declines to 5.8%",
    "sourceName": "ABS",
    "sourceUrl": "https://www.abs.gov.au/AUSSTATS/abs@.nsf/Lookup/6202.0Main%2BFeatures1Mar%202014?OpenDocument=",
    "sourceLocator": "Archived issue release header and March seasonally adjusted key points",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "March seasonally adjusted employment increased by 18,100 and the unemployment rate declined to 5.8%.",
      "Full-time employment fell by 22,100 while part-time employment rose by 40,200; participation declined to 64.7%."
    ],
    "numericFacts": {
      "employment_change_sa_persons": 18100,
      "unemployment_rate_sa_pct": 5.8,
      "fulltime_change_sa_persons": -22100,
      "parttime_change_sa_persons": 40200,
      "participation_rate_sa_pct": 64.7
    },
    "referencePeriod": {
      "start": "2014-03-01",
      "end": "2014-03-31"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "AUD"
    ],
    "pairs": [
      "AUDJPY"
    ],
    "catalyst": "employment",
    "eventType": "employment",
    "eventFamily": "ABS:employment",
    "eventKey": "ABS:employment:2014-03-01:2014-03-31:2014-04-10:au-march-employment",
    "independentEventId": "ABS:employment:2014-03-01:2014-03-31:2014-04-10:au-march-employment",
    "publicationDate": "2014-04-10",
    "publishedAt": "2014-04-10T11:30:00+10:00",
    "publicationLocalTime": "11:30",
    "publicationTimeZone": "Australia/Sydney",
    "publicationTimePrecision": "minute",
    "availableAfterJst": "2014-04-10T10:30:00+09:00",
    "availabilityBasis": "Official release embargo/header time, converted to JST; no earlier display.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "employment",
      "unemployment",
      "job_composition"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "mixed",
      "rationale": "Lower unemployment can support AUD expectations, but the gain was in part-time jobs and participation declined.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "澳大利亚3月失业率降至5.8%",
    "summary": "3月季调就业增1.81万人，兼职增4.02万人而全职降2.21万人；失业率降至5.8%，劳动参与率微降至64.7%。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [],
    "researchCautions": [
      "This release reports a 0.2-point fall based on unrounded estimates; do not recompute it by subtracting rounded 6.1 and 5.8."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "76c48a60f16a45f9dd62a5b1dc001ece52d565124d5741a5343aab3771fb7f75"
    },
    "sourceAttribution": "Australian Bureau of Statistics; independently summarized from the dated release; accessed 11 October 2026",
    "sourcePolicyUrl": "https://www.abs.gov.au/website-privacy-copyright-and-disclaimer",
    "sourceLicenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy ABS in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "76c48a60f16a45f9dd62a5b1dc001ece52d565124d5741a5343aab3771fb7f75"
    }
  },
  {
    "id": "2014-04-15-us-march-cpi",
    "date": "2014-04-15",
    "eventDate": "2014-04-15",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "March US CPI annual inflation increases from 1.1% to 1.5%",
    "sourceName": "BLS",
    "sourceUrl": "https://www.bls.gov/news.release/archives/cpi_04152014.htm",
    "sourceLocator": "Embargo header and first four paragraphs",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "March CPI-U rose 0.2% seasonally adjusted on the month and 1.5% year over year before seasonal adjustment, versus 1.1% annual inflation in February.",
      "Core CPI rose 0.2% monthly and 1.7% annually; food and shelter were important contributors to the monthly headline rise."
    ],
    "numericFacts": {
      "cpi_mom_sa_pct": 0.2,
      "cpi_yoy_nsa_pct": 1.5,
      "previous_cpi_yoy_nsa_pct": 1.1,
      "core_cpi_mom_sa_pct": 0.2,
      "core_cpi_yoy_nsa_pct": 1.7
    },
    "referencePeriod": {
      "start": "2014-03-01",
      "end": "2014-03-31"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "USD"
    ],
    "pairs": [
      "USDJPY"
    ],
    "catalyst": "inflation",
    "eventType": "inflation",
    "eventFamily": "BLS:inflation",
    "eventKey": "BLS:inflation:2014-03-01:2014-03-31:2014-04-15:us-march-cpi",
    "independentEventId": "BLS:inflation:2014-03-01:2014-03-31:2014-04-15:us-march-cpi",
    "publicationDate": "2014-04-15",
    "publishedAt": "2014-04-15T08:30:00-04:00",
    "publicationLocalTime": "08:30",
    "publicationTimeZone": "America/New_York",
    "publicationTimePrecision": "minute",
    "availableAfterJst": "2014-04-15T21:30:00+09:00",
    "availabilityBasis": "Official release embargo/header time, converted to JST; no earlier display.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "inflation",
      "shelter",
      "food_prices"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "supportive",
      "rationale": "A pickup in inflation may support expectations for eventual US tightening, subject to prior market expectations and other data.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "美国3月CPI同比升至1.5%",
    "summary": "3月CPI-U季调环比涨0.2%，未季调同比升至1.5%（前值1.1%）；核心CPI同比涨1.7%，食品和住房为主要拉动力。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [],
    "researchCautions": [],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "ab51be43fa59479c5c4c86fbdc3f30d00a7b7943ca6a0b067b022cc41149bf7d"
    },
    "sourceAttribution": "Source: U.S. Bureau of Labor Statistics",
    "sourcePolicyUrl": "https://www.bls.gov/opub/copyright-information.htm",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy BLS in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "ab51be43fa59479c5c4c86fbdc3f30d00a7b7943ca6a0b067b022cc41149bf7d"
    }
  },
  {
    "id": "2014-04-30-us-gdp-q1-advance",
    "date": "2014-04-30",
    "eventDate": "2014-04-30",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "First estimate puts first-quarter US GDP growth at 0.1% annualized",
    "sourceName": "BEA",
    "sourceUrl": "https://www.bea.gov/news/2014/gross-domestic-product-1st-quarter-2014-advance-estimate",
    "sourceLocator": "Embargo header, first three paragraphs and GDP footnote",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "BEA’s advance estimate reported real GDP growth at a 0.1% seasonally adjusted annual rate in the first quarter of 2014, after 2.6% in the fourth quarter of 2013.",
      "Consumer spending added to growth while exports, inventories and several investment components subtracted. The estimate was explicitly preliminary."
    ],
    "numericFacts": {
      "real_gdp_qoq_annualized_pct": 0.1,
      "previous_quarter_real_gdp_qoq_annualized_pct": 2.6
    },
    "referencePeriod": {
      "start": "2014-01-01",
      "end": "2014-03-31"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "USD"
    ],
    "pairs": [
      "USDJPY"
    ],
    "catalyst": "gdp",
    "eventType": "gdp",
    "eventFamily": "BEA:gdp",
    "eventKey": "BEA:gdp:2014-01-01:2014-03-31:2014-04-30:us-gdp-q1-advance",
    "independentEventId": "BEA:gdp:2014-01-01:2014-03-31:2014-04-30:us-gdp-q1-advance",
    "publicationDate": "2014-04-30",
    "publishedAt": "2014-04-30T08:30:00-04:00",
    "publicationLocalTime": "08:30",
    "publicationTimeZone": "America/New_York",
    "publicationTimePrecision": "minute",
    "availableAfterJst": "2014-04-30T21:30:00+09:00",
    "availabilityBasis": "Official release embargo/header time, converted to JST; no earlier display.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "growth",
      "growth_slowdown",
      "advance_estimate"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "negative",
      "rationale": "A sharp growth slowdown may weaken the case for early tightening and weigh on USD expectations, without proving an FX reaction.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "美国一季度实际GDP初值年化增0.1%",
    "summary": "一季度实际GDP初值季调年化环比增长0.1%，前季为2.6%；消费支出提供拉动，出口、库存与投资项目形成拖累。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [
      "2014-06-25-us-gdp-q1-third"
    ],
    "researchCautions": [
      "Independent earlier release vintage for the same quarter, not a duplicate of the June third estimate.",
      "Do not mention the later -2.9% third estimate before June 25.",
      "0.1% is annualized quarter-on-quarter, not ordinary quarterly or year-on-year growth."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "1dda35d236a067b09c2a82cd273169c14098481b61d2cbc57805cbf889fceb4a"
    },
    "sourceAttribution": "Source: U.S. Bureau of Economic Analysis",
    "sourcePolicyUrl": "https://www.bea.gov/help/faq/145",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy BEA in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "1dda35d236a067b09c2a82cd273169c14098481b61d2cbc57805cbf889fceb4a"
    }
  },
  {
    "id": "2014-06-12-boe-carney-mansion-house",
    "date": "2014-06-12",
    "eventDate": "2014-06-12",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "Carney says first rate increase could arrive earlier than market expectations",
    "sourceName": "BOE",
    "sourceUrl": "https://www.bankofengland.co.uk/-/media/boe/files/speech/2014/mark-carney-speech-at-the-lord-mayors-banquet-for-bankers-and-merchants-of-the-city-of-london.pdf",
    "sourceLocator": "Cover p.1 and macroeconomic balance section pp.4–5; BOE landing page independently dates publication June 12",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "At Mansion House, Carney said the first Bank Rate increase might arrive earlier than markets expected, while emphasizing a data-dependent path.",
      "He reiterated that eventual rate increases were expected to be gradual and limited; the speech did not announce a rate increase."
    ],
    "numericFacts": {},
    "referencePeriod": {
      "start": "2014-06-12",
      "end": "2014-06-12"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "GBP"
    ],
    "pairs": [
      "GBPJPY"
    ],
    "catalyst": "policy_guidance",
    "eventType": "policy_guidance",
    "eventFamily": "BOE:policy_guidance",
    "eventKey": "BOE:policy_guidance:2014-06-12:2014-06-12:2014-06-12:boe-carney-mansion-house",
    "independentEventId": "BOE:policy_guidance:2014-06-12:2014-06-12:2014-06-12:boe-carney-mansion-house",
    "publicationDate": "2014-06-12",
    "publishedAt": null,
    "publicationLocalTime": null,
    "publicationTimeZone": "Europe/London",
    "publicationTimePrecision": "date",
    "availableAfterJst": "2014-06-13T18:00:00+09:00",
    "availabilityBasis": "Conservative next-calendar-day 18:00 JST gate, after the whole local publication day in each source timezone used here. This is not the claimed publication time.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "rate_expectations",
      "forward_guidance",
      "policy_normalization"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "supportive",
      "rationale": "An earlier possible UK tightening path may support GBP yield expectations, but this was conditional guidance.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "英央行卡尼称首次加息或早于预期",
    "summary": "卡尼演讲称首次加息时点或早于市场预期，但强调紧缩取决于经济数据，未来加息料渐进有限；未宣布利率变动。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [],
    "researchCautions": [
      "BOE date corroboration: https://www.bankofengland.co.uk/speech/2014/mark-carney-speech-at-the-lord-mayors-banquet-for-bankers-and-merchants-of-the-city-of-london",
      "BIS mirror labels June 13 in one metadata field; the BOE original and cover establish June 12. No exact release minute verified."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "297c0305d9f7488a4d2821b808cfad970650b76b75e33c129e946ec6a6f2443f"
    },
    "sourceAttribution": "Bank of England; independent factual summary of the identified speaker and dated speech",
    "sourcePolicyUrl": "https://www.bankofengland.co.uk/legal",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy BOE in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "297c0305d9f7488a4d2821b808cfad970650b76b75e33c129e946ec6a6f2443f"
    }
  },
  {
    "id": "2014-07-03-rba-stevens-exchange-rate",
    "date": "2014-07-03",
    "eventDate": "2014-07-03",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "Stevens warns the Australian dollar remains overvalued",
    "sourceName": "RBA",
    "sourceUrl": "https://www.rba.gov.au/speeches/2014/sp-gov-030714.html",
    "sourceLocator": "Speech date header; Economic Update and The Exchange Rate sections",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "In Hobart, Governor Glenn Stevens said the exchange rate remained high and that most measures pointed to overvaluation against terms-of-trade trends and Australian production costs.",
      "He said recent strong GDP growth probably overstated the ongoing growth pace and that near-term growth was expected to be a little below trend."
    ],
    "numericFacts": {},
    "referencePeriod": {
      "start": "2014-07-03",
      "end": "2014-07-03"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "AUD"
    ],
    "pairs": [
      "AUDJPY"
    ],
    "catalyst": "exchange_rate_guidance",
    "eventType": "exchange_rate_guidance",
    "eventFamily": "RBA:exchange_rate_guidance",
    "eventKey": "RBA:exchange_rate_guidance:2014-07-03:2014-07-03:2014-07-03:rba-stevens-exchange-rate",
    "independentEventId": "RBA:exchange_rate_guidance:2014-07-03:2014-07-03:2014-07-03:rba-stevens-exchange-rate",
    "publicationDate": "2014-07-03",
    "publishedAt": null,
    "publicationLocalTime": null,
    "publicationTimeZone": "Australia/Sydney",
    "publicationTimePrecision": "date",
    "availableAfterJst": "2014-07-04T18:00:00+09:00",
    "availabilityBasis": "Conservative next-calendar-day 18:00 JST gate, after the whole local publication day in each source timezone used here. This is not the claimed publication time.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "exchange_rate",
      "terms_of_trade",
      "growth_rebalancing"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "negative",
      "rationale": "Official concern about an expensive currency can fit AUD-softness or intervention-speculation contexts; no intervention or new rate decision was announced.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "澳联储主席史蒂文斯警示澳元高估",
    "summary": "史蒂文斯表示澳元汇率依然偏高且多数指标显示高估；近期GDP增速或夸大势头，短期增长预计略低于趋势水平。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [
      "2014-12-02-rba-exchange-rate-assessment"
    ],
    "researchCautions": [
      "This July speech is a separate earlier public event from the December policy statement.",
      "Do not claim an official AUD target, an exchange intervention, or a verified exchange-rate fall."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "3255ef2b43564794481e4b1e14b93ec87f4dea3edf3a4b50df8d14c79c582b0c"
    },
    "sourceAttribution": "Source: Reserve Bank of Australia 2014",
    "sourcePolicyUrl": "https://www.rba.gov.au/copyright/",
    "sourceLicenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy RBA in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "3255ef2b43564794481e4b1e14b93ec87f4dea3edf3a4b50df8d14c79c582b0c"
    }
  },
  {
    "id": "2014-08-07-au-july-employment",
    "date": "2014-08-07",
    "eventDate": "2014-08-07",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "July Australian unemployment rate rises to 6.4%",
    "sourceName": "ABS",
    "sourceUrl": "https://www.abs.gov.au/AUSSTATS/abs@.nsf/Lookup/6202.0Main%2BFeatures1Jul%202014?OpenDocument=",
    "sourceLocator": "Archived issue release header and July seasonally adjusted key points",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "In the July release vintage, seasonally adjusted employment declined by 300 and unemployment increased by 43,700.",
      "The unemployment rate rose 0.3 percentage points to 6.4%, and aggregate monthly hours worked declined 0.9%."
    ],
    "numericFacts": {
      "employment_change_sa_persons": -300,
      "unemployed_change_sa_persons": 43700,
      "unemployment_rate_sa_pct": 6.4,
      "unemployment_rate_change_pp": 0.3,
      "hours_worked_mom_sa_pct": -0.9
    },
    "referencePeriod": {
      "start": "2014-07-01",
      "end": "2014-07-31"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "AUD"
    ],
    "pairs": [
      "AUDJPY"
    ],
    "catalyst": "employment",
    "eventType": "employment",
    "eventFamily": "ABS:employment",
    "eventKey": "ABS:employment:2014-07-01:2014-07-31:2014-08-07:au-july-employment",
    "independentEventId": "ABS:employment:2014-07-01:2014-07-31:2014-08-07:au-july-employment",
    "publicationDate": "2014-08-07",
    "publishedAt": "2014-08-07T11:30:00+10:00",
    "publicationLocalTime": "11:30",
    "publicationTimeZone": "Australia/Sydney",
    "publicationTimePrecision": "minute",
    "availableAfterJst": "2014-08-07T10:30:00+09:00",
    "availabilityBasis": "Official release embargo/header time, converted to JST; no earlier display.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "employment",
      "unemployment",
      "labour_slack"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "negative",
      "rationale": "Weaker labour conditions may reduce expected tightening and weigh on AUD, conditional on expectations.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "澳大利亚7月失业率升至6.4%",
    "summary": "7月季调就业微降300人，失业人数增4.37万人；失业率环比上升0.3个百分点至6.4%，总工作时长环比下降0.9%。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [],
    "researchCautions": [
      "Preserve the August 7 vintage; Australian labour force seasonal estimates were subsequently revised."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "1c5c373a04221e02fcaf7d7a2070533ba187881bfc84538ff2bf704dd1aab730"
    },
    "sourceAttribution": "Australian Bureau of Statistics; independently summarized from the dated release; accessed 11 October 2026",
    "sourcePolicyUrl": "https://www.abs.gov.au/website-privacy-copyright-and-disclaimer",
    "sourceLicenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy ABS in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "1c5c373a04221e02fcaf7d7a2070533ba187881bfc84538ff2bf704dd1aab730"
    }
  },
  {
    "id": "2014-08-13-au-wage-price-index-june",
    "date": "2014-08-13",
    "eventDate": "2014-08-13",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "Australian second-quarter wage index rises 0.6% quarterly and 2.6% annually",
    "sourceName": "ABS",
    "sourceUrl": "https://www.abs.gov.au/AUSSTATS/abs@.nsf/Lookup/6345.0Main%2BFeatures1Jun%202014",
    "sourceLocator": "Archived issue release header; June Key Figures and Key Points",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "The Australian wage price index for total hourly pay excluding bonuses increased 0.6% seasonally adjusted in the June quarter and 2.6% over the year.",
      "Seasonally adjusted private-sector annual wage growth was 2.4%, while public-sector wage growth was 2.8%."
    ],
    "numericFacts": {
      "wpi_qoq_sa_pct": 0.6,
      "wpi_yoy_sa_pct": 2.6,
      "private_wpi_yoy_sa_pct": 2.4,
      "public_wpi_yoy_sa_pct": 2.8
    },
    "referencePeriod": {
      "start": "2014-04-01",
      "end": "2014-06-30"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "AUD"
    ],
    "pairs": [
      "AUDJPY"
    ],
    "catalyst": "wages",
    "eventType": "wages",
    "eventFamily": "ABS:wages",
    "eventKey": "ABS:wages:2014-04-01:2014-06-30:2014-08-13:au-wage-price-index-june",
    "independentEventId": "ABS:wages:2014-04-01:2014-06-30:2014-08-13:au-wage-price-index-june",
    "publicationDate": "2014-08-13",
    "publishedAt": "2014-08-13T11:30:00+10:00",
    "publicationLocalTime": "11:30",
    "publicationTimeZone": "Australia/Sydney",
    "publicationTimePrecision": "minute",
    "availableAfterJst": "2014-08-13T10:30:00+09:00",
    "availabilityBasis": "Official release embargo/header time, converted to JST; no earlier display.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "wages",
      "labour_costs",
      "inflation_pressure"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "unclear",
      "rationale": "Wage-cost news is relevant to Australian inflation and interest-rate expectations, but these levels alone do not establish a surprise or currency direction.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "澳大利亚二季度工资指数同比涨2.6%",
    "summary": "二季度不含奖金时薪工资价格指数季调环比增0.6%，同比增2.6%；私营部门年增2.4%，公共部门年增2.8%。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [
      "2014-02-19-au-wage-price-index"
    ],
    "researchCautions": [
      "A different reference quarter and publication from the existing December 2013 WPI entry.",
      "Do not describe this fixed-job wage price measure as household earnings or average weekly pay."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "3be0561875333ee16c95d3e36bedd7f77321348efa1b32365b63d4e6d93828d2"
    },
    "sourceAttribution": "Australian Bureau of Statistics; independently summarized from the dated release; accessed 11 October 2026",
    "sourcePolicyUrl": "https://www.abs.gov.au/website-privacy-copyright-and-disclaimer",
    "sourceLicenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy ABS in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "3be0561875333ee16c95d3e36bedd7f77321348efa1b32365b63d4e6d93828d2"
    }
  },
  {
    "id": "2014-08-22-fed-yellen-jackson-hole",
    "date": "2014-08-22",
    "eventDate": "2014-08-22",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "Yellen describes two-sided conditions for the timing of policy normalization",
    "sourceName": "FED",
    "sourceUrl": "https://www.federalreserve.gov/newsevents/speech/yellen20140822a.htm",
    "sourceLocator": "Speech date/title and concluding monetary-policy discussion",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "At Jackson Hole, Janet Yellen discussed labour-market slack beyond the unemployment rate.",
      "She said faster-than-expected improvement in employment or inflation could bring forward rate increases; weaker progress could instead delay them."
    ],
    "numericFacts": {},
    "referencePeriod": {
      "start": "2014-08-22",
      "end": "2014-08-22"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "USD"
    ],
    "pairs": [
      "USDJPY"
    ],
    "catalyst": "policy_guidance",
    "eventType": "policy_guidance",
    "eventFamily": "FED:policy_guidance",
    "eventKey": "FED:policy_guidance:2014-08-22:2014-08-22:2014-08-22:fed-yellen-jackson-hole",
    "independentEventId": "FED:policy_guidance:2014-08-22:2014-08-22:2014-08-22:fed-yellen-jackson-hole",
    "publicationDate": "2014-08-22",
    "publishedAt": null,
    "publicationLocalTime": null,
    "publicationTimeZone": "America/Denver",
    "publicationTimePrecision": "date",
    "availableAfterJst": "2014-08-23T18:00:00+09:00",
    "availabilityBasis": "Conservative next-calendar-day 18:00 JST gate, after the whole local publication day in each source timezone used here. This is not the claimed publication time.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "labour_slack",
      "rate_expectations",
      "policy_normalization"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "mixed",
      "rationale": "Conditional guidance can support either a hawkish or dovish interpretation depending on later incoming data; it is not a one-way trading signal.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "耶伦称加息时机取决于就业与通胀进展",
    "summary": "耶伦在杰克逊霍尔指出，劳动力市场仍存闲置。若就业或通胀好转快于预期可能提前加息，进展疲弱则可能推迟。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [],
    "researchCautions": [
      "No target-rate change was announced.",
      "Do not use knowledge of later FOMC decisions to resolve this speech’s conditional branches."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "6c8ce2746054970cbd30dcd55071b8f63fa29780b08c1017140047b622c2e6da"
    },
    "sourceAttribution": "Source: Board of Governors of the Federal Reserve System",
    "sourcePolicyUrl": "https://www.federalreserve.gov/disclaimer.htm",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy FED in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "6c8ce2746054970cbd30dcd55071b8f63fa29780b08c1017140047b622c2e6da"
    }
  },
  {
    "id": "2014-09-08-jp-gdp-q2-second-preliminary",
    "date": "2014-09-08",
    "eventDate": "2014-09-08",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "Japan second-quarter GDP contraction revised from 1.7% to 1.8% quarterly",
    "sourceName": "ESRI",
    "sourceUrl": "https://www.esri.cao.go.jp/en/sna/data/sokuhou/files/2014/qe142_2/pdf/gaiyou1422_e.pdf",
    "sourceLocator": "Dated page 1, comparison of first and second preliminary real GDP estimates",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "The second preliminary estimate revised Japanese real GDP in April–June 2014 to a 1.8% seasonally adjusted quarterly contraction from the first estimate of 1.7%.",
      "The corresponding annualized decline was revised from 6.8% to 7.1%."
    ],
    "numericFacts": {
      "real_gdp_qoq_sa_pct": -1.8,
      "previous_estimate_real_gdp_qoq_sa_pct": -1.7,
      "real_gdp_qoq_annualized_pct": -7.1,
      "previous_estimate_real_gdp_qoq_annualized_pct": -6.8
    },
    "referencePeriod": {
      "start": "2014-04-01",
      "end": "2014-06-30"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "JPY"
    ],
    "pairs": [
      "USDJPY",
      "AUDJPY",
      "GBPJPY"
    ],
    "catalyst": "gdp_revision",
    "eventType": "gdp_revision",
    "eventFamily": "ESRI:gdp_revision",
    "eventKey": "ESRI:gdp_revision:2014-04-01:2014-06-30:2014-09-08:jp-gdp-q2-second-preliminary",
    "independentEventId": "ESRI:gdp_revision:2014-04-01:2014-06-30:2014-09-08:jp-gdp-q2-second-preliminary",
    "publicationDate": "2014-09-08",
    "publishedAt": null,
    "publicationLocalTime": null,
    "publicationTimeZone": "Asia/Tokyo",
    "publicationTimePrecision": "date",
    "availableAfterJst": "2014-09-09T18:00:00+09:00",
    "availabilityBasis": "Conservative next-calendar-day 18:00 JST gate, after the whole local publication day in each source timezone used here. This is not the claimed publication time.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "growth",
      "gdp_revision",
      "post_tax_demand"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "negative",
      "rationale": "A deeper contraction may strengthen easing expectations and weigh on JPY, implying upward bias in JPY-quoted crosses; safe-haven demand can act in the opposite direction.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "日本二季度实际GDP环比下修至-1.8%",
    "summary": "内阁府二次初值显示，日本2014年二季度实际GDP季调环比增速由-1.7%下修至-1.8%，年化降幅由6.8%扩大至7.1%。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [
      "2014-08-13-jp-gdp-q2-first-preliminary"
    ],
    "researchCautions": [
      "Independent September revision publication, not another copy of August’s first estimate.",
      "Exact release minute not independently confirmed; next-day 18:00 JST gate used.",
      "Only the revised estimate is new at this event; preserve its historical vintage."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "f8add45afa797baad4cef3f073d6bbfb86d0c47b8b17a460052e0553c3ad8592"
    },
    "sourceAttribution": "Cabinet Office, Government of Japan (ESRI); independently summarized from the dated GDP release; accessed 11 October 2026",
    "sourcePolicyUrl": "https://www.cao.go.jp/notice/rule.html",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy ESRI in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "f8add45afa797baad4cef3f073d6bbfb86d0c47b8b17a460052e0553c3ad8592"
    }
  },
  {
    "id": "2014-09-09-boe-carney-tuc-guidance",
    "date": "2014-09-09",
    "eventDate": "2014-09-09",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "Carney links gradual rate increases to wages, productivity and remaining slack",
    "sourceName": "BOE",
    "sourceUrl": "https://www.bankofengland.co.uk/-/media/boe/files/speech/2014/mark-carney-speech-at-the-trades-union-congress.pdf",
    "sourceLocator": "Cover p.1; monetary-policy discussion pp.12–13",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "Carney said labour-market slack remained and that wage growth relative to productivity was important for inflation.",
      "He described a forecast conditioned on market expectations for rate increases beginning by spring; he stressed that the actual path depended on the economy and that rises were expected to be gradual and limited."
    ],
    "numericFacts": {},
    "referencePeriod": {
      "start": "2014-09-09",
      "end": "2014-09-09"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "GBP"
    ],
    "pairs": [
      "GBPJPY"
    ],
    "catalyst": "policy_guidance",
    "eventType": "policy_guidance",
    "eventFamily": "BOE:policy_guidance",
    "eventKey": "BOE:policy_guidance:2014-09-09:2014-09-09:2014-09-09:boe-carney-tuc-guidance",
    "independentEventId": "BOE:policy_guidance:2014-09-09:2014-09-09:2014-09-09:boe-carney-tuc-guidance",
    "publicationDate": "2014-09-09",
    "publishedAt": null,
    "publicationLocalTime": null,
    "publicationTimeZone": "Europe/London",
    "publicationTimePrecision": "date",
    "availableAfterJst": "2014-09-10T18:00:00+09:00",
    "availabilityBasis": "Conservative next-calendar-day 18:00 JST gate, after the whole local publication day in each source timezone used here. This is not the claimed publication time.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "wages",
      "labour_slack",
      "rate_expectations"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "mixed",
      "rationale": "The prospect of eventual tightening may support GBP while remaining slack and gradualism temper it; do not present spring as a promised hike date.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "卡尼称加息取决于经济且预计渐进有限",
    "summary": "卡尼称劳动力仍有闲置；引用以市场春季加息预期为假设的预测时强调，实际路径取决于经济，预计加息将是渐进且有限的。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [
      "2014-08-13-boe-recovery-broadening"
    ],
    "researchCautions": [
      "Conditional forecast discussion is not an MPC commitment to a spring 2015 hike.",
      "A speech one month after the Inflation Report is an independent public event; do not simply retell the old report."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "af9ae2dcfddf0040d5084f0d3465203c11d6b207346346d2f499fdc41af88300"
    },
    "sourceAttribution": "Bank of England; independent factual summary of the identified speaker and dated speech",
    "sourcePolicyUrl": "https://www.bankofengland.co.uk/legal",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy BOE in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "af9ae2dcfddf0040d5084f0d3465203c11d6b207346346d2f499fdc41af88300"
    }
  },
  {
    "id": "2014-09-17-us-august-cpi",
    "date": "2014-09-17",
    "eventDate": "2014-09-17",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "US CPI records its first seasonally adjusted monthly decline since April 2013",
    "sourceName": "BLS",
    "sourceUrl": "https://www.bls.gov/news.release/archives/cpi_09172014.htm",
    "sourceLocator": "Embargo header and opening five paragraphs",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "August CPI-U declined 0.2% seasonally adjusted, its first monthly fall since April 2013; annual headline inflation slowed to 1.7% from 2.0%.",
      "Energy prices fell 2.6% and gasoline prices fell 4.1%. Core CPI was unchanged on the month and rose 1.7% over the year."
    ],
    "numericFacts": {
      "cpi_mom_sa_pct": -0.2,
      "cpi_yoy_nsa_pct": 1.7,
      "previous_cpi_yoy_nsa_pct": 2.0,
      "energy_mom_sa_pct": -2.6,
      "gasoline_mom_sa_pct": -4.1,
      "core_cpi_mom_sa_pct": 0.0,
      "core_cpi_yoy_nsa_pct": 1.7
    },
    "referencePeriod": {
      "start": "2014-08-01",
      "end": "2014-08-31"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "USD"
    ],
    "pairs": [
      "USDJPY"
    ],
    "catalyst": "inflation",
    "eventType": "inflation",
    "eventFamily": "BLS:inflation",
    "eventKey": "BLS:inflation:2014-08-01:2014-08-31:2014-09-17:us-august-cpi",
    "independentEventId": "BLS:inflation:2014-08-01:2014-08-31:2014-09-17:us-august-cpi",
    "publicationDate": "2014-09-17",
    "publishedAt": "2014-09-17T08:30:00-04:00",
    "publicationLocalTime": "08:30",
    "publicationTimeZone": "America/New_York",
    "publicationTimePrecision": "minute",
    "availableAfterJst": "2014-09-17T21:30:00+09:00",
    "availabilityBasis": "Official release embargo/header time, converted to JST; no earlier display.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "disinflation",
      "energy_prices",
      "core_prices"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "negative",
      "rationale": "Softer inflation can reduce expectations of rapid US tightening and fit USD-softness contexts, although other news can dominate.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "美国8月CPI环比降0.2% 同比升1.7%",
    "summary": "美国8月CPI-U季调环比降0.2%，同比升幅由2.0%放缓至1.7%；能源价格环比降2.6%，核心CPI环比持平、同比升1.7%。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [],
    "researchCautions": [
      "Separate source and catalyst from the same-day FOMC decision.",
      "Do not merge the CPI release time with the later FOMC announcement."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "75321f6d222406a2420e29c9b62d40836dd3ef5cdafcb7436f051c91b87f9ff2"
    },
    "sourceAttribution": "Source: U.S. Bureau of Labor Statistics",
    "sourcePolicyUrl": "https://www.bls.gov/opub/copyright-information.htm",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy BLS in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "75321f6d222406a2420e29c9b62d40836dd3ef5cdafcb7436f051c91b87f9ff2"
    }
  },
  {
    "id": "2014-10-01-boe-forbes-sterling-inflation",
    "date": "2014-10-01",
    "eventDate": "2014-10-01",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "Forbes examines disinflation from sterling’s earlier appreciation",
    "sourceName": "BOE",
    "sourceUrl": "https://www.bankofengland.co.uk/-/media/boe/files/speech/2014/the-economic-impact-of-sterlings-recent-moves.pdf",
    "sourceLocator": "Cover p.1; qualifications p.2; recent trends pp.3–4; inflation discussion pp.15–16",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "Kristin Forbes reported that sterling’s nominal effective exchange-rate index had appreciated 14.5% from March 2013 to July 2014.",
      "She argued that the appreciation was still restraining inflation, while explicitly saying that her remarks did not predict the next exchange-rate move or change the Bank’s no-exchange-rate-target policy."
    ],
    "numericFacts": {
      "sterling_nominal_effective_appreciation_mar2013_jul2014_pct": 14.5
    },
    "referencePeriod": {
      "start": "2013-03-01",
      "end": "2014-07-31"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "GBP"
    ],
    "pairs": [
      "GBPJPY"
    ],
    "catalyst": "exchange_rate_analysis",
    "eventType": "exchange_rate_analysis",
    "eventFamily": "BOE:exchange_rate_analysis",
    "eventKey": "BOE:exchange_rate_analysis:2013-03-01:2014-07-31:2014-10-01:boe-forbes-sterling-inflation",
    "independentEventId": "BOE:exchange_rate_analysis:2013-03-01:2014-07-31:2014-10-01:boe-forbes-sterling-inflation",
    "publicationDate": "2014-10-01",
    "publishedAt": null,
    "publicationLocalTime": null,
    "publicationTimeZone": "Europe/London",
    "publicationTimePrecision": "date",
    "availableAfterJst": "2014-10-02T18:00:00+09:00",
    "availabilityBasis": "Conservative next-calendar-day 18:00 JST gate, after the whole local publication day in each source timezone used here. This is not the claimed publication time.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "sterling",
      "exchange_rate_pass_through",
      "inflation"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "mixed",
      "rationale": "An exchange-rate disinflation channel may temper tightening pressure, but Forbes also distinguishes domestic price pressure; no reliable immediate directional inference follows.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "福布斯称英镑前期升值仍在抑制通胀",
    "summary": "福布斯指出，英镑名义有效汇率自2013年3月至2014年7月升值14.5%，仍在抑制通胀；央行不设汇率目标。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [],
    "researchCautions": [
      "14.5% describes a nominal effective currency basket over a past interval, not GBPJPY or the day’s return.",
      "The views are Forbes’s personal MPC-member analysis, not a new policy vote.",
      "Model simulations are not verified real-world causal effects."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "3e9152bc1e78d5336ae55344fc457ac1f9d28ba9e6b35f3ea07bb5f534bd0b93"
    },
    "sourceAttribution": "Bank of England; independent factual summary of the identified speaker and dated speech",
    "sourcePolicyUrl": "https://www.bankofengland.co.uk/legal",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy BOE in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "3e9152bc1e78d5336ae55344fc457ac1f9d28ba9e6b35f3ea07bb5f534bd0b93"
    }
  },
  {
    "id": "2014-10-17-boe-haldane-twin-peaks",
    "date": "2014-10-17",
    "eventDate": "2014-10-17",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "Haldane says rates could stay lower for longer than he previously expected",
    "sourceName": "BOE",
    "sourceUrl": "https://www.bankofengland.co.uk/-/media/boe/files/speech/2014/twin-peaks.pdf",
    "sourceLocator": "BOE landing publication date; speech conclusion printed pp.12–13",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "Haldane said his economic assessment had become less optimistic than three months earlier.",
      "He cited weaker global growth, geopolitical and financial risks, and subdued wage and commodity-price pressures as reasons rates could remain low for longer without endangering the inflation target."
    ],
    "numericFacts": {},
    "referencePeriod": {
      "start": "2014-10-17",
      "end": "2014-10-17"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "GBP"
    ],
    "pairs": [
      "GBPJPY"
    ],
    "catalyst": "policy_guidance",
    "eventType": "policy_guidance",
    "eventFamily": "BOE:policy_guidance",
    "eventKey": "BOE:policy_guidance:2014-10-17:2014-10-17:2014-10-17:boe-haldane-twin-peaks",
    "independentEventId": "BOE:policy_guidance:2014-10-17:2014-10-17:2014-10-17:boe-haldane-twin-peaks",
    "publicationDate": "2014-10-17",
    "publishedAt": null,
    "publicationLocalTime": null,
    "publicationTimeZone": "Europe/London",
    "publicationTimePrecision": "date",
    "availableAfterJst": "2014-10-18T18:00:00+09:00",
    "availabilityBasis": "Conservative next-calendar-day 18:00 JST gate, after the whole local publication day in each source timezone used here. This is not the claimed publication time.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "low_rates",
      "global_growth",
      "disinflation"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "negative",
      "rationale": "A more dovish individual assessment can fit softer UK rate expectations and GBP weakness, but it is not an MPC rate decision.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "霍尔丹称低利率维持时间或长于此前预期",
    "summary": "霍尔丹表示对经济前景不及此前乐观，受全球增长疲弱、地缘与金融风险及薪资商品价格承压影响，利率维持低位时间或更长。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [],
    "researchCautions": [
      "Attribute the judgment to Andy Haldane; do not turn it into a unanimous MPC decision.",
      "Date confirmation: https://www.bankofengland.co.uk/speech/2014/twin-peaks"
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "7788c27f74ea5b19ca2d0f6f8e8bb0620cf1561c154d817f73f8dccd02b8fede"
    },
    "sourceAttribution": "Bank of England; independent factual summary of the identified speaker and dated speech",
    "sourcePolicyUrl": "https://www.bankofengland.co.uk/legal",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy BOE in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "7788c27f74ea5b19ca2d0f6f8e8bb0620cf1561c154d817f73f8dccd02b8fede"
    }
  },
  {
    "id": "2014-10-30-us-gdp-q3-advance",
    "date": "2014-10-30",
    "eventDate": "2014-10-30",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "US third-quarter GDP first estimated at 3.5% annualized growth",
    "sourceName": "BEA",
    "sourceUrl": "https://www.bea.gov/index.php/news/2014/gross-domestic-product-3rd-quarter-2014-advance-estimate",
    "sourceLocator": "Embargo header and first five paragraphs",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "The advance estimate put third-quarter US real GDP growth at a 3.5% seasonally adjusted annual rate, following 4.6% in the second quarter.",
      "Consumption, exports, business investment and government spending added to growth, while private inventory investment subtracted."
    ],
    "numericFacts": {
      "real_gdp_qoq_annualized_pct": 3.5,
      "previous_quarter_real_gdp_qoq_annualized_pct": 4.6
    },
    "referencePeriod": {
      "start": "2014-07-01",
      "end": "2014-09-30"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "USD"
    ],
    "pairs": [
      "USDJPY"
    ],
    "catalyst": "gdp",
    "eventType": "gdp",
    "eventFamily": "BEA:gdp",
    "eventKey": "BEA:gdp:2014-07-01:2014-09-30:2014-10-30:us-gdp-q3-advance",
    "independentEventId": "BEA:gdp:2014-07-01:2014-09-30:2014-10-30:us-gdp-q3-advance",
    "publicationDate": "2014-10-30",
    "publishedAt": "2014-10-30T08:30:00-04:00",
    "publicationLocalTime": "08:30",
    "publicationTimeZone": "America/New_York",
    "publicationTimePrecision": "minute",
    "availableAfterJst": "2014-10-30T21:30:00+09:00",
    "availabilityBasis": "Official release embargo/header time, converted to JST; no earlier display.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "growth",
      "advance_estimate",
      "consumption"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "down",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "mixed",
      "rationale": "Continued expansion may support USD yield expectations, while slower growth than the prior quarter is a countervailing fact. Market consensus was not verified.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "美国三季度实际GDP初值年化环比增3.5%",
    "summary": "美国三季度实际GDP季调年化环比初值增长3.5%，二季度为4.6%；消费、出口、商业投资和政府支出均对增长形成支撑。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [
      "2014-11-25-us-gdp-q3-second"
    ],
    "researchCautions": [
      "Independent advance release, preceding the already-stored second estimate.",
      "Do not leak the November 3.9% or December 5.0% estimates into October.",
      "Annualized quarter-on-quarter, not year-on-year."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "732426d32a1559258b4e9a339f0ec0a7dcf3174f8de8514400abf1668ce9bdb9"
    },
    "sourceAttribution": "Source: U.S. Bureau of Economic Analysis",
    "sourcePolicyUrl": "https://www.bea.gov/help/faq/145",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy BEA in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "732426d32a1559258b4e9a339f0ec0a7dcf3174f8de8514400abf1668ce9bdb9"
    }
  },
  {
    "id": "2014-12-08-jp-gdp-q3-second-preliminary",
    "date": "2014-12-08",
    "eventDate": "2014-12-08",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "Japanese third-quarter contraction deepens in the second preliminary estimate",
    "sourceName": "ESRI",
    "sourceUrl": "https://www.esri.cao.go.jp/en/sna/data/sokuhou/files/2014/qe143_2/pdf/gaiyou1432_e.pdf",
    "sourceLocator": "Page 1 comparison table; visually checked rendered page because web PDF text encoding was corrupt",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "Japan’s second preliminary GDP estimate revised the July–September real quarterly contraction to 0.5% from 0.4%.",
      "The annualized contraction was revised to 1.9% from 1.6%; private non-residential investment was revised from a 0.2% quarterly decline to a 0.4% decline."
    ],
    "numericFacts": {
      "real_gdp_qoq_sa_pct": -0.5,
      "previous_estimate_real_gdp_qoq_sa_pct": -0.4,
      "real_gdp_qoq_annualized_pct": -1.9,
      "previous_estimate_real_gdp_qoq_annualized_pct": -1.6,
      "private_nonresidential_investment_qoq_sa_pct": -0.4,
      "previous_private_nonresidential_investment_qoq_sa_pct": -0.2
    },
    "referencePeriod": {
      "start": "2014-07-01",
      "end": "2014-09-30"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "JPY"
    ],
    "pairs": [
      "USDJPY",
      "AUDJPY",
      "GBPJPY"
    ],
    "catalyst": "gdp_revision",
    "eventType": "gdp_revision",
    "eventFamily": "ESRI:gdp_revision",
    "eventKey": "ESRI:gdp_revision:2014-07-01:2014-09-30:2014-12-08:jp-gdp-q3-second-preliminary",
    "independentEventId": "ESRI:gdp_revision:2014-07-01:2014-09-30:2014-12-08:jp-gdp-q3-second-preliminary",
    "publicationDate": "2014-12-08",
    "publishedAt": null,
    "publicationLocalTime": null,
    "publicationTimeZone": "Asia/Tokyo",
    "publicationTimePrecision": "date",
    "availableAfterJst": "2014-12-09T18:00:00+09:00",
    "availabilityBasis": "Conservative next-calendar-day 18:00 JST gate, after the whole local publication day in each source timezone used here. This is not the claimed publication time.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "growth",
      "gdp_revision",
      "business_investment"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "negative",
      "rationale": "Weaker output may reinforce easing expectations and weigh on JPY, although risk aversion can support it; all three JPY crosses require that caveat.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "日本三季度实际GDP环比下修至-0.5%",
    "summary": "内阁府二次初值显示，日本三季度实际GDP季调环比增速由-0.4%下修至-0.5%，年化降幅由1.6%扩大至1.9%。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [
      "2014-11-17-jp-gdp-q3-first-preliminary"
    ],
    "researchCautions": [
      "Independent December revision, not a duplicate of November’s first estimate.",
      "Exact release minute was not independently confirmed; next-day 18:00 JST gate used.",
      "Local evidence: jp-q3-second-page1.png."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "8671a59973dacab842a16624b308009ea8be47f772f28a3e6be6fee218316d66"
    },
    "sourceAttribution": "Cabinet Office, Government of Japan (ESRI); independently summarized from the dated GDP release; accessed 11 October 2026",
    "sourcePolicyUrl": "https://www.cao.go.jp/notice/rule.html",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy ESRI in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "8671a59973dacab842a16624b308009ea8be47f772f28a3e6be6fee218316d66"
    }
  },
  {
    "id": "2014-12-15-us-november-industrial-production",
    "date": "2014-12-15",
    "eventDate": "2014-12-15",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "US industrial production rises 1.3% in November",
    "sourceName": "FED",
    "sourceUrl": "https://www.federalreserve.gov/releases/g17/20141215/",
    "sourceLocator": "Release date and first two paragraphs",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "November industrial production increased 1.3% and manufacturing output increased 1.1%.",
      "Utilities output rose 5.1% amid colder-than-usual weather. Capacity utilization reached 80.1%, equal to the release’s long-run average."
    ],
    "numericFacts": {
      "industrial_production_mom_sa_pct": 1.3,
      "manufacturing_output_mom_sa_pct": 1.1,
      "utilities_output_mom_sa_pct": 5.1,
      "capacity_utilization_pct": 80.1
    },
    "referencePeriod": {
      "start": "2014-11-01",
      "end": "2014-11-30"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "USD"
    ],
    "pairs": [
      "USDJPY"
    ],
    "catalyst": "industrial_production",
    "eventType": "industrial_production",
    "eventFamily": "FED:industrial_production",
    "eventKey": "FED:industrial_production:2014-11-01:2014-11-30:2014-12-15:us-november-industrial-production",
    "independentEventId": "FED:industrial_production:2014-11-01:2014-11-30:2014-12-15:us-november-industrial-production",
    "publicationDate": "2014-12-15",
    "publishedAt": null,
    "publicationLocalTime": null,
    "publicationTimeZone": "America/New_York",
    "publicationTimePrecision": "date",
    "availableAfterJst": "2014-12-16T18:00:00+09:00",
    "availabilityBasis": "Conservative next-calendar-day 18:00 JST gate, after the whole local publication day in each source timezone used here. This is not the claimed publication time.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "industrial_output",
      "manufacturing",
      "capacity_utilization"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "supportive",
      "rationale": "Broad manufacturing gains can support US growth and rate expectations; some utility strength was weather-related.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "美国11月工业产出环比增1.3%",
    "summary": "美联储公布11月工业产出环比增1.3%，制造业产出增1.1%；受寒冷天气拉动公用事业产出增5.1%，产能利用率升至80.1%。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [],
    "researchCautions": [
      "Exact release minute not verified in the consulted HTML; conservative date gate used.",
      "This is a production release, not a measured FX reaction."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "04c0fa28ef48a20ec7cbf6da6b78b1155ff5df86a551c4c57e05c21b8ba0aca8"
    },
    "sourceAttribution": "Source: Board of Governors of the Federal Reserve System",
    "sourcePolicyUrl": "https://www.federalreserve.gov/disclaimer.htm",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy FED in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "04c0fa28ef48a20ec7cbf6da6b78b1155ff5df86a551c4c57e05c21b8ba0aca8"
    }
  },
  {
    "id": "2014-12-23-us-gdp-q3-third",
    "date": "2014-12-23",
    "eventDate": "2014-12-23",
    "eventDateMeaning": "Public release or public speech date; statistical reference period is separate.",
    "researchLabel": "US third-quarter GDP growth revised to 5.0% annualized",
    "sourceName": "BEA",
    "sourceUrl": "https://www.bea.gov/news/2014/gross-domestic-product-3rd-quarter-2014-third-estimate-corporate-profits-3rd-quarter-2014",
    "sourceLocator": "Embargo header; first three paragraphs; real PCE paragraph",
    "sourceCheckedAt": "2026-10-10",
    "factStatus": "official_publication_verified",
    "factBullets": [
      "The third estimate revised US third-quarter real GDP growth to a 5.0% seasonally adjusted annual rate from 3.9% in the second estimate.",
      "Consumer spending and non-residential fixed investment were stronger than previously estimated; real consumer spending growth was 3.2% at an annual rate."
    ],
    "numericFacts": {
      "real_gdp_qoq_annualized_pct": 5.0,
      "previous_estimate_real_gdp_qoq_annualized_pct": 3.9,
      "real_pce_qoq_annualized_pct": 3.2
    },
    "referencePeriod": {
      "start": "2014-07-01",
      "end": "2014-09-30"
    },
    "dataVintage": "values_or_policy_views_in_this_publication_not_latest_revised_series",
    "currencies": [
      "USD"
    ],
    "pairs": [
      "USDJPY"
    ],
    "catalyst": "gdp_revision",
    "eventType": "gdp_revision",
    "eventFamily": "BEA:gdp_revision",
    "eventKey": "BEA:gdp_revision:2014-07-01:2014-09-30:2014-12-23:us-gdp-q3-third",
    "independentEventId": "BEA:gdp_revision:2014-07-01:2014-09-30:2014-12-23:us-gdp-q3-third",
    "publicationDate": "2014-12-23",
    "publishedAt": "2014-12-23T08:30:00-05:00",
    "publicationLocalTime": "08:30",
    "publicationTimeZone": "America/New_York",
    "publicationTimePrecision": "minute",
    "availableAfterJst": "2014-12-23T22:30:00+09:00",
    "availabilityBasis": "Official release embargo/header time, converted to JST; no earlier display.",
    "eligibleBeforePublication": false,
    "scenarioTags": [
      "growth",
      "gdp_revision",
      "consumption"
    ],
    "scenarioTagBasis": "editorial_inference_for_topic_matching",
    "applicableDirections": [
      "up",
      "down",
      "range"
    ],
    "editorialPreferredDirections": [
      "up",
      "range"
    ],
    "applicableVolatility": [
      "normal",
      "high"
    ],
    "volatilityTagBasis": "editorial_topic_matching_not_measured_fx_volatility",
    "directionInterpretation": {
      "kind": "conditional_editorial_inference_not_verified_market_reaction",
      "currencyBias": "supportive",
      "rationale": "An upward growth revision may support USD and earlier-tightening expectations, conditional on what was already priced.",
      "caveat": "Conditional on expectations and other currency-side developments. No actual FX return, surprise versus consensus, or causal price response has been verified."
    },
    "observedMarketDirection": null,
    "observedMarketReturn": null,
    "observedPriceImpact": null,
    "priceEngineInput": false,
    "matchingSemantics": "Filter by actual simulated/historical timestamp, 2014 year and pair first. Prefer topics compatible with the market context. Never assert this release caused the observed move. JPY strengthening means these three quoted pairs fall.",
    "productionEnabled": true,
    "publicationReviewRequired": true,
    "workflowStatus": "runtime_integrated_candidate_pending_acceptance",
    "summaryKind": "original_factual_summary",
    "title": "美国三季度实际GDP年化三估上修至5.0%",
    "summary": "美国三季度实际GDP季调年化环比增速在第三次估算中由3.9%上修至5.0%；实际个人消费支出年化环比增长3.2%。",
    "sourceTextOrImageReuseAuthorized": false,
    "relatedExistingIds": [
      "2014-11-25-us-gdp-q3-second"
    ],
    "researchCautions": [
      "Different independent publication and materially changed figure from the existing second estimate.",
      "Do not use 5.0% before December 23; do not call this ordinary quarterly or year-on-year growth."
    ],
    "contentKind": "historical_fact",
    "copyReview": "independent_passed_against_provided_official_source_facts",
    "sourcePolicyReviewStatus": "original_factual_summary_only_reviewed",
    "copyProvenance": {
      "copySHA256": "7362a8c51e4632c3d29ab723e44d5e87c938161034a02cd1f43664cdf8418549"
    },
    "sourceAttribution": "Source: U.S. Bureau of Economic Analysis",
    "sourcePolicyUrl": "https://www.bea.gov/help/faq/145",
    "sourceAdaptation": "Independent short factual summary; no source text, charts, images or logos reproduced.",
    "publicationReview": {
      "status": "original_factual_summary_reviewed",
      "reviewScope": "original_factual_summary_only",
      "reviewedAt": "2026-10-11",
      "sourceTextOrImageReuseAuthorized": false,
      "sourceRestrictionRecord": "See policy BEA in docs/research/news-2014-source-review.json; only independent factual summary reviewed.",
      "reviewEvidenceFile": "docs/research/news-2014-source-review.json",
      "copySHA256": "7362a8c51e4632c3d29ab723e44d5e87c938161034a02cd1f43664cdf8418549"
    }
  }
]);
