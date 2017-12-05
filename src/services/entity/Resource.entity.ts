/**
 * 资方/渠道
 */
export class Resource{
  resourceId:string;//ID
  resourceName:string;//名称

  init(obj?:any):Resource{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.resourceId=obj.resourceId;
      instance.resourceName=obj.resourceName;
    }
    return instance;
  }
  static create(obj?:any):Resource{
    let instance=new Resource();
    if(obj&&typeof obj==='object'){
      instance.resourceId=obj.resourceId;
      instance.resourceName=obj.resourceName;
    }
    return new Resource().init(obj);
  }
}
