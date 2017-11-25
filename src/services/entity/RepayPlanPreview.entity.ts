/**
 * 还款计划
 */
export class RepayPlanPreview {

  repaymentPlan: number;//还款期数
  repaymentPrinciple: number;//还款本金
  repaymentInterest: number;//还款利息
  repayRelAmount:number;//应还总额
  repaymentPlanDate: string;//还款日期
  status: number;//状态      （0未还、1已还）
  visible:boolean;

  initByObj(obj: any): RepayPlanPreview {
    if (obj&&typeof obj === 'object') {
      this.repaymentPlan = parseFloat(obj.repaymentPlan);
      this.repaymentPrinciple = parseFloat(obj.repaymentPrinciple);
      this.repayRelAmount = parseFloat(obj.repayRelAmount);
      this.repaymentInterest = parseFloat(obj.repaymentInterest);
      this.repaymentPlanDate = obj.repaymentPlanDate;
      this.status = parseInt(obj.status);
    }
    return this;
  }
}
