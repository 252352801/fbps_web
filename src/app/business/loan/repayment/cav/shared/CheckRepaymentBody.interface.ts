import {SubmitBankCard} from './SubmitBankCard.interface';
export interface CheckRepaymentBody {
  repaymentNotifyId:string;//通知ID
  borrowApplyId:string;//借款申请单id
  currentPeriod:string|number;//本期数
  operator:string;//操作者
  auditPwd:string;//审核口令
  remarks?:string;//审批意见
  employeeId?:string;//线上还款必填
  bankList?:SubmitBankCard[]//转账银行list ,线上还款必填
}
