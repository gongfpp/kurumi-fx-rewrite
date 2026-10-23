// Explicit game presentation wins over the OS hint without changing that setting.
// Components outside the game can still request their reduced-motion fallback.
export function systemReducedMotion(root=globalThis.document){
 return !root?.body?.classList?.contains?.('motion-full')&&!!root?.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}
