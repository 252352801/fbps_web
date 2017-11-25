/**
 * 资方/渠道
 */
export class Resource{
  resourceId:string;//ID
  resourceName:string;//ID

  initByObj(obj:any):Resource{
    if(obj&&typeof obj==='object'){
      this.resourceId=obj.resourceId;
      this.resourceName=obj.resourceName;
    }
    return this;
  }
}
