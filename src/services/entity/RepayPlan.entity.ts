/**
 * 还款计划
 */
export class RepayPlan{
  repaymentId:string;//还款计划ID
  borrowApplyId:string;//贷款单号
  repaymentPlan:number;//还款期数
  repaymentPrinciple:number;//还款本金
  repaymentInterest:number;//还款利息
  repaymentPlanDate:string;//还款日期
  repaymentDate:string;//实际还款日期
  rolloverApplyId:string;//展期单号
  status:number;//状态      （0未还、1已还）
  statusName:string;//状态文字
  overTime:string;//核销日期
  overdueInterest:number;//罚息
  repayRelAmount:number;//应还总额
  payRelAmount:number;//实际还款金额
  errorAmount:number;//误差金额
  errorRemark:string;//误差原因

  initByObj(obj:any):RepayPlan{
    if(obj&&typeof obj==='object'){
      this.repaymentId=obj.repaymentId;
      this.borrowApplyId=obj.borrowApplyId;
      this.repaymentPlan=parseFloat(obj.repaymentPlan);
      this.repaymentPrinciple=parseFloat(obj.repaymentPrinciple);
      this.repaymentInterest=parseFloat(obj.repaymentInterest);
      this.repaymentPlanDate=obj.repaymentPlanDate;
      this.repaymentDate=obj.repaymentDate;
      this.rolloverApplyId=obj.rolloverApplyId;
      this.status=parseInt(obj.status);
      this.statusName=obj.statusName;
      this.overTime=obj.overTime;
      this.overdueInterest=parseFloat(obj.overdueInterest);
      this.repayRelAmount=parseFloat(obj.repayRelAmount);
      this.payRelAmount=parseFloat(obj.payRelAmount);
      this.errorAmount=parseFloat(obj.errorAmount);
      this.errorRemark=obj.errorRemark;
    }
    return this;
  }
}
