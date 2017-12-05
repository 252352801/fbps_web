/**
 * 还款计划
 */
export class RepayPlanPreview {

  currentPeriod: number;//还款期数
  repaymentCapital: number;//还款本金
  repaymentInterest: number;//还款利息
  repaymentDate: string;//还款日期

  init(obj?:any):RepayPlanPreview{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.currentPeriod = parseInt(obj.currentPeriod);
      instance.repaymentCapital = parseFloat(obj.repaymentCapital);
      instance.repaymentInterest = parseFloat(obj.repaymentInterest);
      instance.repaymentDate =obj.repaymentDate;
    }
    return instance;
  }
  static create(obj?:any):RepayPlanPreview{
    return new RepayPlanPreview().init(obj);
  }

}
