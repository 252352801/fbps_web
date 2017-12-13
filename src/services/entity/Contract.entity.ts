/**
 * 合同
 */
export class Contract{
  contractId:string;//ID
  eSignatureId:string;//天威合同ID
  borrowApplyId:string;//贷款编号
  companyName:string;//公司名
  fileLoadId:string;//文件ID
  contractTitle:string;//合同标题
  contractNum:string;//合同编号
  resourceId:string;//资方ID
  isSign:boolean;//是否需要送签
  createTime:string;//合同创建时间
  eSignatureTime:string;//合同签署时间
  comfirmDate:string;//合同签署时间
  eSignatureStatus:number|string;//状态
  eSignatureStatusDic:string;//状态名

  init(obj?:any):Contract{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.contractId=obj.contractId;
      instance.eSignatureId=obj.eSignatureId;
      instance.borrowApplyId=obj.borrowApplyId;
      instance.companyName=obj.companyName;
      instance.fileLoadId=obj.fileLoadId;
      instance.contractTitle=obj.contractTitle;
      instance.contractNum=obj.contractNum;
      instance.resourceId=obj.resourceId;
      instance.isSign=!!obj.isSign;
      instance.createTime=obj.createTime;
      instance.eSignatureTime=obj.eSignatureTime;
      instance.eSignatureStatus=obj.eSignatureStatus;
      instance.eSignatureStatusDic=obj.eSignatureStatusDic;
      instance.isSign=!(instance.eSignatureStatus==2);
      return instance;
    }
  }
  static create(obj?:any):Contract{
   return new Contract().init(obj);
  }
}
