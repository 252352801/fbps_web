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

  initByObj(obj:any):FileInfo{
    if(obj&&typeof obj==='object'){
      this.fileId=obj.fileId;
      this.fileName=obj.fileName;
      this.fileType=obj.fileType;
      this.businessType=obj.businessType;
      this.fileSize=parseFloat(obj.fileSize);
      this.uploadTime=obj.uploadTime;
    }
    return this;
  }
}
