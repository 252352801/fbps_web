/**
 * 产品配置
 */
export class ProductConfig{
  id:string;//
  productId:string;//产品ID
  appId:string;//渠道ID
  interestValue:number;//利率
  interestType:number;//计息方式
  paymentWay:number;//还款方式
  rateCycle:string;//贷款周期

  initByObj(obj:any):ProductConfig{
    if(obj&&typeof obj==='object'){
      this.id=obj.id;
      this.productId=obj.productId;
      this.appId=obj.appId;
      this.interestValue=parseFloat(obj.interestValue);
      this.interestType=parseInt(obj.interestType);
      this.paymentWay=parseInt(obj.paymentWay);
      this.rateCycle=obj.rateCycle;
    }
    return this;
  }
}
