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

  init(obj:any):ProductConfig{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.id=obj.id;
      instance.productId=obj.productId;
      instance.appId=obj.appId;
      instance.interestValue=parseFloat(obj.interestValue);
      instance.interestType=parseInt(obj.interestType);
      instance.paymentWay=parseInt(obj.paymentWay);
      instance.rateCycle=obj.rateCycle;
    }
    return instance;
  }
  static create(obj:any):ProductConfig{
    return new ProductConfig().init(obj);
  }
}
