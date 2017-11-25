/**
 * 还款实体
 */
export class RepaymentNotify{
  repaymentNotifyId:string;//还款通知id
  borrowApplyId:string;//贷款单号
  createTime:string;//创建时间
  memberId:string;//会员ID
  companyName:string;//企业名称
  repaymentPlan:number;//还款期数
  stage:number;//还款总期数
  repaymentDate:string;//还款日期
  repaymentAmount:number;//还款金额
  status:number;//状态
  statusName:string;//状态名
  isNewRecord:boolean;//是否是新记录
  accountRepaymentWay:number;//还款账户
  updateTime:string;//核销日期
  constructor(){

  }

  initByObj(obj:any):RepaymentNotify{
    if(obj&&typeof obj==='object'){
      this.repaymentNotifyId=obj.repaymentNotifyId;
      this.borrowApplyId=obj.borrowApplyId;
      this.companyName=obj.companyName;
      this.createTime=obj.createTime;
      this.memberId=obj.memberId;
      this.repaymentPlan=parseInt(obj.repaymentPlan);
      this.stage=parseInt(obj.stage);
      this.repaymentDate=obj.repaymentDate;
      this.repaymentAmount=parseFloat(obj.repaymentAmount);
      this.status=parseInt(obj.status);
      this.statusName=obj.statusName;
      this.isNewRecord=obj.isNewRecord;
      this.accountRepaymentWay=parseInt(obj.accountRepaymentWay);
      this.updateTime=obj.updateTime;
    }
    return this;
  }

}
