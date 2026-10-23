import {sealedDailyTradeEvidence} from './contextual-trade-evidence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

const positive=n=>Number.isFinite(n)&&n>0;
const nonnegative=n=>Number.isFinite(n)&&n>=0;

// A past borrowing receipt and the current liability must agree. Neither a
// loan unlock nor negative assets establishes that the player borrowed money.
export function priorBorrowedShortLossEvidence(state){
 const outcome=sealedDailyTradeEvidence(state),report=state?.dayReport,loan=state?.loan,borrow=loan?.lastBorrow;
 if(state?.mode!=='story'||!outcome||outcome.net>=0||!positive(report.openingDebt)||!borrow)return null;
 if(!Number.isSafeInteger(borrow.day)||borrow.day<1||borrow.day>=state.day||!positive(borrow.timestamp)||!positive(borrow.amount)||!positive(borrow.outstanding)||borrow.outstanding<borrow.amount)return null;
 if(!Number.isSafeInteger(loan.borrowCount)||loan.borrowCount<1||borrow.id!==`network-borrow:${loan.borrowCount}`||!positive(loan.borrowed)||loan.borrowed<borrow.amount||!positive(loan.outstanding)||!nonnegative(loan.repaid)||!nonnegative(loan.interestAccrued??0))return null;
 if(Math.abs(loan.borrowed+(loan.interestAccrued??0)-loan.repaid-loan.outstanding)>.02)return null;
 if(outcome.trades.some(t=>t.direction!==-1||t.exit<=t.entry||t.grossPnl>=0||t.pnl>=0||t.timestamp<=borrow.timestamp))return null;
 return {day:state.day,receipt:borrow.id,borrowedDay:borrow.day,outstanding:loan.outstanding,net:outcome.net,positions:outcome.positions};
}
