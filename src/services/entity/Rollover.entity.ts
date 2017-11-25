export class Rollover{
  rolloverApplyId:string;//展期单号
  repaymentPrinciple:number;//还款金额/展期金额
  memberId:string;//会员ID
  companyName:string;//企业名称
  borrowApplyId:string;//贷款单号
  createTime:string;//创建时间
  repaymentPlan:string|number;//还款期数
  remark:string;//申请理由
  rolloverTime:string;//申请日期
  status:number;//申请状态
  statusName:string;//申请状态文字
  auditOneBy:string;//一审人员
  auditOneRemarks:string;//一审意见
  auditOneTime:string;//一审时间

  initByObj(obj:any):Rollover{
    if(obj&&typeof obj ==='object'){
      this.rolloverApplyId=obj.rolloverApplyId;
      this.repaymentPrinciple=parseFloat(obj.repaymentPrinciple+'');
      this.memberId=obj.memberId;
      this.companyName=obj.companyName;
      this.borrowApplyId=obj.borrowApplyId;
      this.createTime=obj.createTime;
      this.repaymentPlan=obj.repaymentPlan;
      this.remark=obj.remark;
      this.rolloverTime=obj.rolloverTime;
      this.status=parseInt(obj.status);
      this.statusName=obj.statusName;
      this.auditOneBy=obj.auditOneBy;
      this.auditOneRemarks=obj.auditOneRemarks;
      this.auditOneTime=obj.auditOneTime;

    }
    return this;
  }
}
