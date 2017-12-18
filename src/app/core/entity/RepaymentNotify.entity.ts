/**
 * 还款实体
 */
export class RepaymentNotify{
  borrowApplyId:string;//贷款单号
  status:number;//状态（1新建、2已受理、3还款成功、-2受理不通过)
  statusName:string;//状态名
  repaymentDate:string;//还款日期
  currentPeriod:number;//还款期数
  memberId:string;//会员ID
  accountRepaymentWay:number;//账户还款方式  0:线上  1:线下
  createTime:string;//创建日期
  repaymentAmount:number|string;//还款金额
  repaymentNotifyId:string;//还款通知id
  companyName:string;//企业名称
  fileLoadId:string;//还款凭证提取码
  constructor(){

  }
  init(obj?:any):RepaymentNotify{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.repaymentNotifyId=obj.repaymentNotifyId;
      instance.borrowApplyId=obj.borrowApplyId;
      instance.companyName=obj.companyName;
      instance.createTime=obj.createTime;
      instance.repaymentAmount=obj.repaymentAmount;
      instance.memberId=obj.memberId;
      instance.repaymentDate=obj.repaymentDate;
      instance.currentPeriod=parseInt(obj.currentPeriod);
      instance.status=parseInt(obj.status);
      instance.statusName=obj.statusName;
      instance.accountRepaymentWay=parseInt(obj.accountRepaymentWay);
      instance.fileLoadId=obj.fileLoadId;
    }
    return instance;
  }

  static create(obj?:any):RepaymentNotify{
    return new RepaymentNotify().init(obj);
  }

}
