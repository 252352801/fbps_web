import {Signature} from '../../../services/entity/Signature.entity';
export interface CreateContractBody{
  borrowApplyId:string,
  companyName:string,
  contractType:string,//
  rolloverApplyId?:string,//展期申请ID
  contractTitle:string,
  contractNum:string,
  fileLoadId:string,
  resourceId:string,
  fileName:string,
  memberId:string,
  signature?:Signature[],
  isSign:number
}
