/**
 * 合同
 */
export class Contract{
  id:string;//ID
  twId:string;//天威合同ID
  borrowApplyId:string;//贷款编号
  companyName:string;//公司名
  title:string;//合同标题
  docNum:string;//合同编号
  fileId:string;//文件ID
  capitalId:string;//资方ID
  isSign:boolean;//是否需要送签
  createTime:string;//合同创建时间
  updateTime:string;//合同签署时间
  rrl:string;//合同路径
  status:number;//状态
  statusName:string;//状态名

  initByObj(obj:any):Contract{
    if(obj&&typeof obj==='object'){
      this.id=obj.id;
      this.twId=obj.twId;
      this.borrowApplyId=obj.borrowApplyId;
      this.companyName=obj.companyName;
      this.title=obj.title;
      this.docNum=obj.docNum;
      this.fileId=obj.fileId;
      this.capitalId=obj.capitalId;
      this.isSign=!!obj.isSign;
      this.createTime=obj.createTime;
      this.updateTime=obj.updateTime;
      this.rrl=obj.rrl;
      this.status=parseInt(obj.status);
      this.statusName=obj.statusName;
    }
    return this;
  }
}
