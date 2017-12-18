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
  /**
   * 初始化
   * @param obj
   * @returns {SystemLog}
   */
  init(obj?:any):SystemLog{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.type=parseInt(obj.type);
      instance.id=obj.id;
      instance.title=obj.title;
      instance.remarks= obj.remarks ;
      instance.createBy=obj.createBy;
      instance.createTime=obj.createTime;
      instance.status=obj.status;
    }
    return instance;
  }
  static create(obj?:any):SystemLog{
    return new SystemLog().init(obj);
  }
}
