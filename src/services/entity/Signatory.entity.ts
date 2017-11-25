/**
 * 签章用户 */
export class Signatory{
  memberId:string;//会员ID
  name:string;//	会员名称,
  twUserId:string;//天威用户ID
  type:number;//类型

  initByObj(obj:any):Signatory{
    if(obj&&typeof obj==='object'){
      this.memberId=obj.memberId;
      this.name=obj.name;
      this.twUserId=obj.twUserId;
      this.type=parseInt(obj.type);
    }
    return this;
  }
}
