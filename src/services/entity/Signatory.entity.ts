/**
 * 签章用户 */
export class Signatory{
  memberId:string;//会员ID
  name:string;//	会员名称,
  twUserId:string;//天威用户ID
  type:number;//类型

   init(obj?:any):Signatory{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.memberId=obj.memberId;
      instance.name=obj.name;
      instance.twUserId=obj.twUserId;
      instance.type=parseInt(obj.type);
    }
    return instance;
  }
  static create(obj?:any):Signatory{
    return new Signatory().init(obj);
  }
}
