/**
 * 贷款实体
 */
export class Loan {
  borrowApplyId: string;//id
  memberId: string;//会员ID
  companyName: string;//公司名称
  applyAmount: number;//申请金额
  approveAmount: number;//最终确认金额
  productId: string;//贷款产品id
  productName: string;//贷款产品
  ratedCycle: string;//融资周期
  paymentWay: string;//还款方式
  cardId: string;//银行卡id
  cardNo: string;//银行账户
  isContract: boolean;//是否携带合同
  status: number;//状态
  statusName: string;//状态文字
  createTime: string;//创建时间
  auditOneTime: string;//审核时间
  auditOneBy: string;//审核员
  loanTime: string;//实际放款时间
  rate: number;//利率
  rateType: number;//计息方式
  limitTime: string;//还款日
  toWhere: number|string;//放款去向 1：线下  2：线上
  remarks: string;//备注

  init(obj?: any): Loan {
    let instance = this;
    if (obj && typeof obj === 'object') {
      instance.borrowApplyId = obj.borrowApplyId;
      instance.memberId = obj.memberId;
      instance.companyName = obj.companyName;
      instance.applyAmount = parseFloat(obj.applyAmount);
      instance.approveAmount = parseFloat(obj.approveAmount);
      instance.productId = obj.productId;
      instance.productName = obj.productName;
      instance.ratedCycle = obj.ratedCycle;
      instance.paymentWay = obj.paymentWay;
      instance.cardId = obj.cardId;
      instance.cardNo = obj.cardNo;
      instance.isContract = obj.isContract;
      instance.status = parseInt(obj.status);
      instance.statusName = obj.statusName;
      instance.createTime = obj.createTime;
      instance.auditOneTime = obj.auditOneTime;
      instance.auditOneBy = obj.auditOneBy;
      instance.loanTime = obj.loanTime;
      instance.rate = obj.rate;
      instance.rateType = obj.rateType;
      instance.limitTime = obj.limitTime;
      instance.toWhere = obj.toWhere;
      instance.remarks = obj.remarks || '-';
      return instance;
    }
  }

  static create(obj?: any): Loan {
    return new Loan().init(obj);
  }
}
