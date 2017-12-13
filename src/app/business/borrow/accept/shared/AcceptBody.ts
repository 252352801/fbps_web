export interface AcceptBody{
  auditOneBy:string,//一审人员
  borrowApplyId:string,//借款单ID
  financeProveDataVos?:{//证明材料列表
    fileType:string,
    fileLoadId:string,
  }[],
  remarks:string,//一审意见
  status: string|number //新状态
}
