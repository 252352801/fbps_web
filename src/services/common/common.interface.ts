export interface LoanFlowQuery{
  borrowApplyId:string//借款单id
}

export  interface RepaymentFlowQuery{
  borrowApplyId:string;//借款单id
  repaymentPlan:string|number;//还款期数
}
