export class Rollover{
  rolloverApplyId:string;//展期单号
  borrowApplyId:string;//贷款单号
  memberId:string;//会员ID
  repaymentCapital:number;//还款金额/展期金额
  companyName:string;//企业名称
  status:number;//申请状态
  statusName:string;//申请状态文字
  createTime:string;//创建时间
  currentPeriodStr:string|number;//还款期数文字
  rolloverDate:string;//申请承诺还款日期
  comfirmRolloverDate:string;//批准还款日期
  realRolloverDate:string;//实际还款日期
  rolloverRate:number;//展期利率
  repaymentInterest:number;//本期利息
  rolloverDeposit:number;//展期保证金
  remark:string;//申请理由
  fileLoadId:string;//展期凭证文件提取码
  auditOneBy:string;//一审人员
  auditOneTime:string;//一审时间
  auditOneRemarks:string;//一审意见
  auditTwoBy:string;//二审人员
  auditTwoTime:string;//二审时间
  auditTwoRemarks:string;//二审意见
  init(obj?:any):Rollover{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.rolloverApplyId=obj.rolloverApplyId;
      instance.borrowApplyId=obj.borrowApplyId;
      instance.memberId=obj.memberId;
      instance.repaymentCapital=parseFloat(obj.repaymentCapital);
      instance.companyName=obj.companyName;
      instance.status=parseInt(obj.status);
      instance.statusName=obj.statusName;
      instance.createTime=obj.createTime;
      instance.currentPeriodStr=obj.currentPeriodStr;
      instance.rolloverDate=obj.rolloverDate;
      instance.comfirmRolloverDate=obj.comfirmRolloverDate;
      instance.realRolloverDate=obj.realRolloverDate;
      instance.rolloverRate=parseFloat(obj.rolloverRate);
      instance.repaymentInterest=parseFloat(obj.repaymentInterest);
      instance.rolloverDeposit=parseFloat(obj.rolloverDeposit);
      instance.remark=obj.remark;
      instance.fileLoadId=obj.fileLoadId;
      instance.auditOneBy=obj.auditOneBy;
      instance.auditOneTime=obj.auditOneTime;
      instance.auditOneRemarks=obj.auditOneRemarks;
      instance.auditTwoBy=obj.auditTwoBy;
      instance.auditTwoTime=obj.auditTwoTime;
      instance.auditTwoRemarks=obj.auditTwoRemarks;
    }
    return instance;
  }

  static create(obj?:any):Rollover{
    return new Rollover().init(obj);
  }

}
