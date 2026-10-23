// Split the original effect-wide cubic-bezier(.2,.8,.2,1) at its .2/.7
// keyframe progress using de Casteljau. A linear outer clock lets us insert a
// genuinely still 3200 ms hold without stretching the original motion/exit.
export function tradeImpactTiming(heat){
  const originalDuration=1100-heat*55,holdDuration=3200,duration=originalDuration+holdDuration;
  const arrival=originalDuration*.04944536907105419,settled=originalDuration*.20925562214022236;
  const resting={opacity:1,transform:'translate(-50%,-50%) scale(1) rotate(-2deg)'};
  return {frames:[
    {opacity:0,transform:'translate(-50%,-50%) scale(.65) rotate(-8deg)',offset:0,easing:'cubic-bezier(.3607210117889478,.3567196711917723,.6892729533985664,.6895801691682009)'},
    {opacity:1,transform:'translate(-50%,-50%) scale(1.1) rotate(2deg)',offset:arrival/duration,easing:'cubic-bezier(.33732630424964893,.43567196711917716,.6067559660042264,.7608353309108705)'},
    {...resting,offset:settled/duration,easing:'linear'},
    {...resting,offset:(settled+holdDuration)/duration,easing:'cubic-bezier(.1518624723337815,.76166775441453,.39508980200036165,1)'},
    {opacity:0,transform:'translate(-50%,-60%) scale(1.08)',offset:1}
  ],options:{duration,easing:'linear'}};
}
