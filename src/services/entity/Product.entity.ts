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
  status:number;//状态
  isNewRecord:boolean;//


  initByObj(obj:any):Product{
    if(obj&&typeof obj==='object'){
      this.productId=obj.productId;
      this.productName=obj.productName;
      this.productCompany=obj.productCompany;
      this.productRemark=obj.productRemark;
      this.beginDate=obj.beginDate;
      this.expiryDate=parseFloat(obj.expiryDate);
      this.productRequirement=obj.productRequirement;
      this.productAppScope=parseInt(obj.productAppScope);
      this.productAreaScope=parseInt(obj.productAreaScope);
      this.productType=parseInt(obj.productType);
      this.valueLimit=obj.valueLimit;
      this.interestType=obj.interestType;
      this.borrowHowlong=obj.borrowHowlong;
      this.rolloverHowlong=parseFloat(obj.rolloverHowlong);
      this.rolloverDeposit=parseFloat(obj.rolloverDeposit);
      this.rolloverInterestValue=parseFloat(obj.rolloverInterestValue);
      this.overdueInterestValue=parseFloat(obj.overdueInterestValue);
      this.status=parseInt(obj.status);
      this.isNewRecord=obj.isNewRecord;
    }
    return this;
  }
}
