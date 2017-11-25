/**
 * 签章信息 */
export class Signature{
  id:number;//ID
  userId:string;//天威会员ID
  name:string;//名字
  page:number;//	签章页码,
  positionX:number;//X坐标
  positionY:number;//Y坐标,

  constructor(){

  }

  initByObj(obj:any):Signature{
    if(obj&&typeof obj==='object'){
      this.id=parseInt(obj.id);
      this.userId=obj.userId;
      this.name=obj.name;
      this.page=parseInt(obj.page);
      this.positionX=parseFloat(obj.positionX);
      this.positionY=parseFloat(obj.positionY);
    }
    return this;
  }
}
