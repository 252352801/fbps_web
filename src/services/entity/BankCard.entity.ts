
export class BankCard {
  authStatus: number;
  authStatusDic: string;
  bankName: string;
  cardId: string;
  cardName: string;
  cardNo:string;
  createBy: string;
  createTime:string;
  isDefault: boolean;
  isDefaultDic:boolean;
  isDelete:boolean;
  isNewRecord:boolean;
  lineNo:string;
  memberId: string;
  remarks: string;
  subbankName: string;
  type: number;
  typeDic:string;
  updateBy: string;
  updateTime:string;
  initByObj(obj:any):BankCard{
    if(obj&&typeof obj==='object'){
      this.authStatus=obj.authStatus;
      this.authStatusDic=obj.authStatusDic;
      this.bankName=obj.bankName;
      this.cardId=obj.cardId;
      this.cardName=obj.cardName;
      this.cardNo=obj.cardNo;
      this.createBy=obj.createBy;
      this.createTime=obj.createTime;
      this.isDefault=obj.isDefault;
      this.isDefaultDic=obj.isDefaultDic;
      this.isDelete=obj.isDelete;
      this.isNewRecord=obj.isNewRecord;
      this.lineNo=obj.lineNo;
      this.memberId=obj.memberId;
      this.remarks=obj.remarks;
      this.subbankName=obj.subbankName;
      this.type=obj.type;
      this.typeDic=obj.typeDic;
      this.updateBy=obj.updateBy;
      this.updateTime=obj.updateTime;
    }
    return this;

  }
}
