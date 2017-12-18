/**
 * 签章信息 */
export class Signature{
  id:string|number;//ID
  userId:string;//天威会员ID
  name:string;//名字
  page:number;//	签章页码,
  positionX:number;//X坐标
  positionY:number;//Y坐标,

  constructor(){

  }

  init(obj?:any):Signature{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.id=obj.contractId;
      instance.userId=obj.userId;
      instance.name=obj.name;
      instance.page=parseInt(obj.page);
      instance.positionX=parseFloat(obj.positionX);
      instance.positionY=parseFloat(obj.positionY);
    }
    return instance;
  }

  static create(obj?:any):Signature{
    return new Signature().init(obj);
  }
}
