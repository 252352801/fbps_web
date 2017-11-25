import {Pipe, PipeTransform, Injectable} from '@angular/core';
import {DictionaryService} from '../../services/dictionary/dictionary.service';

@Pipe({
  name: 'dictionary',
  pure: false
})
@Injectable()
export class DictionaryPipe implements PipeTransform {

  private static loadedLoanStatus:boolean=false;
  private static loadedRepaymentWay:boolean=false;
  private static loadedProductType:boolean=false;
  private static loadedInterestType:boolean=false;
  private static loadedSignatoryType:boolean=false;
  private static loadedSystemLogType:boolean=false;
  private result:any;
  constructor(private dictionarySvc: DictionaryService) {
  }
  transform(value: any, key: string): any {
    if(!this.result) {
      let dictionaryMap;
      switch (key) {
        case this.dictionarySvc.loanStatus.name:
          dictionaryMap=this.dictionarySvc.loanStatus;
          if (!DictionaryPipe.loadedLoanStatus) {
            DictionaryPipe.loadedLoanStatus = true;
            this.dictionarySvc.loadLoanStatus();
          }
          break;
        case this.dictionarySvc.repaymentWay.name:
          dictionaryMap=this.dictionarySvc.repaymentWay;
          if (!DictionaryPipe.loadedRepaymentWay) {
            DictionaryPipe.loadedRepaymentWay = true;
            this.dictionarySvc.loadRepaymentWay();
          }
          break;
        case this.dictionarySvc.productType.name:
          dictionaryMap=this.dictionarySvc.productType;
          if (!DictionaryPipe.loadedProductType) {
            DictionaryPipe.loadedProductType = true;
            this.dictionarySvc.loadProductType();
          }
          break;
        case this.dictionarySvc.interestType.name:
          dictionaryMap=this.dictionarySvc.interestType;
          if (!DictionaryPipe.loadedInterestType) {
            DictionaryPipe.loadedInterestType = true;
            this.dictionarySvc.loadInterestType();
          }
          break;
        case this.dictionarySvc.signatoryType.name:
          dictionaryMap=this.dictionarySvc.signatoryType;
          if (!DictionaryPipe.loadedSignatoryType) {
            DictionaryPipe.loadedSignatoryType = true;
            this.dictionarySvc.loadSignatoryType();
          }
          break;
        case this.dictionarySvc.systemLogType.name:
          dictionaryMap=this.dictionarySvc.systemLogType;
          if (!DictionaryPipe.loadedSystemLogType) {
            DictionaryPipe.loadedSystemLogType = true;
            this.dictionarySvc.loadSystemLogType();
          }
          break;
      }
      if(dictionaryMap.value&&dictionaryMap.value.length>=0){
        let item = this.dictionarySvc.matchByValue(dictionaryMap, value);
        this.result=(item ? item.label : '');
      }
    }
    return this.result;
  }
}

