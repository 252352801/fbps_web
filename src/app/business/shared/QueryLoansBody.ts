export interface QueryLoansBody{
  companyName?:string,//公司名
  status?:string|number,//状态  多个用逗号相连
  borrowApplyId?:string,//借款单ID
  limitDay?:number,//距离到期天数
  page?:number,//页数 从1开始
  rows?:number,//每页大小
  beginTime?:string,//开始时间
  endTime?:string,//结束时间
  isOver?:string|number,//是否查询逾期,逾期传1 不逾期不传
}
