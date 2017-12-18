/**
 * 文件
 */
export class FileInfo{
  fileId:string;
  fileName:string;
  fileType:string;
  businessType:string;
  fileSize:number;
  uploadTime:string;

  init(obj?:any):FileInfo{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.fileId=obj.fileId;
      instance.fileName=obj.fileName;
      instance.fileType=obj.fileType;
      instance.businessType=obj.businessType;
      instance.fileSize=parseFloat(obj.fileSize);
      instance.uploadTime=obj.uploadTime;
      return instance;
    }
  }
  static create(obj?:any):FileInfo{
    return new FileInfo().init(obj);
  }
}
