/**
 * （银行）账户流水
 */
export class BankAccountFlow{
  dealTime:string;//交易时间
  amount:number;//交易金额
  availableBalance:number;//可用余额
  oppoAcctNo:string;//对方账户号
  oppoAcctName:string;//对方账户名
  tradeType:number;//交易类型0：全部 1：出账；2：入账； 3：冲正5：锁定金额；6：解锁金额9：冻结金额；10：解冻金额11：手续费； 12：代收手续费
  createTime:string;//创建时间
  myAcctNo:string;//我方帐号
  myAcctName:string;//我方帐户名
  remark:string;//备注

  initByObj(obj:any):BankAccountFlow{
    if(obj&&typeof obj==='object'){
      this.dealTime=obj.dealTime;
      this.amount=parseFloat(obj.amount);
      this.availableBalance=parseFloat(obj.availableBalance);
      this.oppoAcctNo=obj.oppoAcctNo;
      this.oppoAcctName=obj.oppoAcctName;
      this.tradeType=parseInt(obj.tradeType);
      this.createTime=obj.createTime;
      this.myAcctNo=obj.myAcctNo;
      this.myAcctName=obj.myAcctName;
      this.remark=obj.remark;
    }
    return this;

  }
}
