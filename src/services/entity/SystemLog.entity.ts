/**
 * 系统日志
 * */
export class SystemLog{
  type:number;//类型
  id:string;//相关操作的唯一ID
  title:string;//日志标题
  remarks:string;//	备注,
  createBy:string;//创建者
  createTime:string;//创建时间,
  status:string|number;//日志状态码
  constructor(){

  }

  initByObj(obj:any):SystemLog{
    if(obj&&typeof obj==='object'){
      this.type=parseInt(obj.type);
      this.id=obj.id;
      this.title=obj.title;
      this.remarks= obj.remarks ;
      this.createBy=obj.createBy;
      this.createTime=obj.createTime;
      this.status=obj.status;
    }
    return this;
  }
}
