/**
 * 资方
 */
export class ProveData{
  productId:string;//产品id
  serialId:string;//序列号
  fileLoadId:string;//文件ID
  fileType:string;//文件类型
  fileTypeName:string;//文件类型名称

  static create(obj?:any){
    let instance=new ProveData();
    if(obj&&typeof obj==='object'){
      instance.productId=obj.productId;
      instance.serialId=obj.serialId;
      instance.fileType=obj.fileType;
      instance.fileTypeName=obj.fileTypeName;
      instance.fileLoadId=obj.fileLoadId;
    }
    return instance;
  }
}
