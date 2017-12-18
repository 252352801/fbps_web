/**
 * 还款计划
 */
export class RepayPlan{
  repaymentId:string;//还款计划ID
  borrowApplyId:string;//贷款单号
  currentPeriod:number;//还款期数
  totalPeriod:number;//总期数
  repaymentCapital:number;//还款本金
  repaymentInterest:number;//还款利息
  rolloverInterest:number;//展期利息
  rolloverDeposit:number;//展期保证金
  overdueInterest:number;//逾期罚息
  repaymentAmount:number;//应还总额
  totalRelAmount:number;//累计已还金额
  errorAmount:number;//误差金额
  errorRemark:string;//误差原因
  repaymentDate:string;//计划还款日期
  repaymentRelDate:string;//实际还款日期
  overTime:string;//核销日期
  rolloverApplyId:string;//展期申请id
  status:number|string;//状态（0未还、1已还）
  statusName:string;//状态（0未还、1已还）

  init(obj?:any):RepayPlan{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.repaymentId=obj.repaymentId;
      instance.borrowApplyId=obj.borrowApplyId;
      instance.currentPeriod=parseFloat(obj.currentPeriod);
      instance.totalPeriod=parseFloat(obj.totalPeriod);
      instance.repaymentCapital=parseFloat(obj.repaymentCapital);
      instance.repaymentInterest=parseFloat(obj.repaymentInterest);
      instance.rolloverInterest=parseFloat(obj.rolloverInterest);
      instance.rolloverDeposit=parseFloat(obj.rolloverDeposit);
      instance.overdueInterest=parseFloat(obj.overdueInterest);
      instance.repaymentAmount=parseFloat(obj.repaymentAmount);
      instance.totalRelAmount=parseFloat(obj.totalRelAmount);
      instance.errorAmount=parseFloat(obj.errorAmount);
      instance.errorRemark=obj.errorRemark;
      instance.repaymentDate=obj.repaymentDate;
      instance.repaymentRelDate=obj.repaymentRelDate;
      instance.overTime=obj.overTime;
      instance.overTime=obj.overTime;
      instance.rolloverApplyId=obj.rolloverApplyId;
      instance.status=parseInt(obj.status);
      instance.statusName=obj.statusName;
    }
    return instance;
  }

  static create(obj?:any):RepayPlan{
    return new RepayPlan().init(obj);
  }
}
