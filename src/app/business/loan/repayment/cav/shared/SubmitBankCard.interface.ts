export interface SubmitBankCard {
  amount: number,//金额
  toBankName: string,//银行名称
  toBankNo: string,//银行卡号
  toBankSub: string,//银行支行
  toLineNo: string,//联行号
  toAccountName: string,//账户名
  toAccountId?: string,//虚拟账户ID 资金汇集到虚拟帐号必填
}
