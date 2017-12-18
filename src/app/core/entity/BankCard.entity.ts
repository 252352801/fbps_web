
export class BankCard {
  bankName: string;//银行名称
  cardId: string;//银行卡ID
  cardName: string;//开户名
  cardNo:string;//银行卡号
  lineNo:string;//联行号
  subbankName: string;//支行名称
  resourceId:string;//资方id
  authStatus: number;
  authStatusDic: string;
  createBy: string;
  createTime:string;
  isDefault: boolean;
  isDefaultDic:boolean;
  isDelete:boolean;
  isNewRecord:boolean;
  memberId: string;
  remarks: string;
  type: number;
  typeDic:string;
  updateBy: string;
  updateTime:string;


  init(obj?:any):BankCard{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.authStatus=obj.authStatus;
      instance.authStatusDic=obj.authStatusDic;
      instance.bankName=obj.bankName;
      instance.cardId=obj.cardId;
      instance.cardName=obj.cardName;
      instance.cardNo=obj.cardNo;
      instance.createBy=obj.createBy;
      instance.createTime=obj.createTime;
      instance.isDefault=obj.isDefault;
      instance.isDefaultDic=obj.isDefaultDic;
      instance.isDelete=obj.isDelete;
      instance.isNewRecord=obj.isNewRecord;
      instance.lineNo=obj.lineNo;
      instance.memberId=obj.memberId;
      instance.remarks=obj.remarks;
      instance.subbankName=obj.subbankName;
      instance.type=obj.type;
      instance.typeDic=obj.typeDic;
      instance.updateBy=obj.updateBy;
      instance.updateTime=obj.updateTime;
      instance.resourceId=obj.resourceId;
      return instance;
    }
  }
  static create(obj?:any):BankCard{
    return new BankCard().init(obj);
  }
}
