/**
 * 资方
 */
export class Capital {
  capitalId: string;//ID
  companyName: string;//资方名称
  cardNo: string;//银行卡号
  cardName: string;//开户名
  bankName: string;//银行名称
  subbankName: string;//支行名称
  lineNo: string;//联行号
  rate: number;//分润比例

  init(obj?: any): Capital {
    let instance = this;
    if (obj && typeof obj === 'object') {
      instance.capitalId = obj.capitalId;
      instance.companyName = obj.companyName;
      instance.cardNo = obj.cardNo;
      instance.cardName = obj.cardName;
      instance.bankName = obj.bankName;
      instance.subbankName = obj.subbankName;
      instance.lineNo = obj.lineNo;
      instance.rate = obj.rate;
      return instance;
    }
  }

  static create(obj?: any): Capital {
    return new Capital().init(obj);
  }

}
