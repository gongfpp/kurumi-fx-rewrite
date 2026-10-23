// Only the owner-gated game route enables research. Public Pages is unchanged.
export const RESEARCH_BUILD=/^\/admin\/research\/game(?:\/|$)/.test(globalThis.location?.pathname||'');
