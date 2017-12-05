
export interface AcceptRepaymentBody{
  repaymentNotifyId:string;//还款通知ID
  borrowApplyId:string;//借款申请单id
  currentPeriod:number;//还款期数
  accountRepaymentWay:string;//还款方式 0：线上还款 1：凭证还款
  repaymentRelDate: string;//还款日期
  operator: string;//操作者
  totalRelAmount:number//实际还款金额
  errorRemark?:string;//误差原因
  accountFlowIds?:string;//三级流水ID集合，多个用逗号分隔 ps:线上还款填写
  fileLoadId?:string;//凭证文件id ps:线下还款填写
  realFlowId?:string;//还款凭证中的流水号ID，凭证还款选填
  remarks?:string;//审批建议
}
