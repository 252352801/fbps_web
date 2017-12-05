export interface AcceptBody{
  auditOneBy:string,
  borrowApplyId:string,
  financeProveDataVos?:{
    fileType:string,
    fileLoadId:string,
  }[],
  remarks:string,
  status: string|number
}
