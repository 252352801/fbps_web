/**
 * 贷款实体
 */
export class Loan{
  borrowApplyId:string;//id
  memberId:string;//会员ID
  companyName:string;//公司名称
  applyAmount:number;//申请金额
  approveAmount:number;//最终确认金额
  productId:string;//贷款产品id
  productName:string;//贷款产品
  borrowHowlong:string;//融资周期
  repaymentWay:string;//还款方式
  cardId:string;//银行卡id
  cardNo:string;//银行账户
  isContract:boolean;//是否携带合同
  status:number;//状态
  statusName:string;//状态文字
  createTime:string;//创建时间
  auditOneTime:string;//审核时间
  auditOneBy:string;//审核员
  loanTime:string;//实际放款时间
  rate:number;//利率
  rateType:number;//计息方式
  limitTime:string;//还款日
  repayRelAmount:number;//应还金额
  remarks:string;//备注


  initByObj(obj:any):Loan{
    if(obj&&typeof obj==='object'){
      this.borrowApplyId=obj.borrowApplyId;
      this.memberId=obj.memberId;
      this.companyName=obj.companyName;
      this.applyAmount=parseFloat(obj.applyAmount);
      this.approveAmount=parseFloat(obj.approveAmount);
      this.productId=obj.productId;
      this.productName=obj.productName;
      this.borrowHowlong=obj.borrowHowlong;
      this.repaymentWay=obj.repaymentWay;
      this.cardId=obj.cardId;
      this.cardNo=obj.cardNo;
      this.isContract=obj.isContract;
      this.status=parseInt(obj.status);
      this.statusName=obj.statusName;
      this.createTime=obj.createTime;
      this.auditOneTime=obj.auditOneTime;
      this.auditOneBy=obj.auditOneBy;
      this.loanTime=obj.loanTime;
      this.rate=obj.rate;
      this.rateType=obj.rateType;
      this.limitTime=obj.limitTime;
      this.repayRelAmount=parseFloat(obj.repayRelAmount);
      this.remarks=obj.remarks||'-';
    }
    return this;
  }
}
