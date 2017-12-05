/**
 * 产品
 */
export class Product{
  productId:string;//产品ID
  productName:string;//产品名
  productRemark:string;//产品简介
  productCompany:string;//发布公司
  beginDate:string;//开始时间
  expiryDate:number;//有效期 0 长期，1：1年，2：2年
  productRequirement:string;//条件要求
  productAppScope:number;//应用范围   0 所有平台，1 指定渠道
  productAreaScope:number;//地域范围  0全国,1指定地域
  productType:number|string;//类别  0保理类,1信用类,2消费类
  valueLimit:string;//额度范围
  interestType:number;//利息类别 (0日利息,1月利息)
  borrowHowlong:string;//贷款周期
  rolloverHowlong:number;//展期天数
  rolloverDeposit:number;//展期保证金  （百分比）
  rolloverInterestValue:number;//展期利率  （百分比）
  overdueInterestValue:number;//逾期日罚息利率  (百分比)
  penaltyRate:number;//罚息利率  (百分比)
  status:number;//状态
  isNewRecord:boolean;//

  init(obj:any):Product{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.productId=obj.productId;
      instance.productName=obj.productName;
      instance.productCompany=obj.productCompany;
      instance.productRemark=obj.productRemark;
      instance.beginDate=obj.beginDate;
      instance.expiryDate=parseFloat(obj.expiryDate);
      instance.productRequirement=obj.productRequirement;
      instance.productAppScope=parseInt(obj.productAppScope);
      instance.productAreaScope=parseInt(obj.productAreaScope);
      instance.productType=parseInt(obj.productType);
      instance.valueLimit=obj.valueLimit;
      instance.interestType=obj.interestType;
      instance.borrowHowlong=obj.borrowHowlong;
      instance.rolloverHowlong=parseFloat(obj.rolloverHowlong);
      instance.rolloverDeposit=parseFloat(obj.rolloverDeposit);
      instance.rolloverInterestValue=parseFloat(obj.rolloverInterestValue);
      instance.overdueInterestValue=parseFloat(obj.overdueInterestValue);
      instance.penaltyRate=parseFloat(obj.penaltyRate);
      instance.status=parseInt(obj.status);
      instance.isNewRecord=obj.isNewRecord;
    }
    return instance;
  }
  static create(obj:any):Product{
    return new Product().init(obj);
  }
}
