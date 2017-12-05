export interface QueryContractBody{
  companyName?:string;
  borrowApplyId?:string;
  beginTime?:string;
  endTime?:string;
  eSignatureStatus?:string;//合同状态（空或者-1表示全部）
  page?:number;
  rows?:number;
}
