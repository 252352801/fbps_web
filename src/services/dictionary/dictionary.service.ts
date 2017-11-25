import {Injectable} from '@angular/core';
import {MyHttpClient} from '../myHttp/myhttpClient.service';

export class Dictionary {
  constructor() {

  }

  description: string;
  id: string;
  isNewRecord: boolean;
  label: string;
  sort: string;
  type: string;
  value: any
}
export interface DictionaryMap {
  name: string;//名称
  keyword: string;//服务端查询关键字
  value: Dictionary[];//服务端查询关键字
}

/**
 * 字典
 */
@Injectable()
export class DictionaryService {

  loanStatus: DictionaryMap = {
    name: 'loanStatus',
    keyword: 'loan_status',
    value: []
  };
  repaymentWay: DictionaryMap = {
    name: 'repaymentWay',
    keyword: 'payment_way',
    value: []
  };
  productType: DictionaryMap = {
    name: 'productType',
    keyword: 'product_type',
    value: []
  };
  interestType: DictionaryMap = {
    name: 'interestType',
    keyword: 'interest_type',
    value: []
  };
  rateCycle: DictionaryMap = {
    name: 'rateCycle',
    keyword: 'rate_cycle',
    value: []
  };
  signatoryType: DictionaryMap = {
    name: 'signatoryType',
    keyword: 'signatory_type',
    value: []
  };

  systemLogType:DictionaryMap = {
    name: 'systemLogType',
    keyword: 'log_type',
    value: []
  };
  proveData:DictionaryMap={
    name: 'proveData',
    keyword: 'prove_data',
    value: []
  };

  constructor(private myHttp: MyHttpClient) {
    this.signatoryType.value.push(new Dictionary());
    this.signatoryType.value.push(new Dictionary());
    this.signatoryType.value.push(new Dictionary());
    this.signatoryType.value[0].label = '全部';
    this.signatoryType.value[0].value = -1;
    this.signatoryType.value[1].label = '企业';
    this.signatoryType.value[1].value = 0;
    this.signatoryType.value[2].label = '个人';
    this.signatoryType.value[2].value = 1;
  }

  loadLoanStatus(): Promise<Dictionary[]> {
    if (this.loanStatus.value.length > 0) {
      return Promise.resolve(this.loanStatus.value);
    } else {
      return this.load(this.loanStatus)
        .then((data)=> {
          this.loanStatus.value = data;
          return Promise.resolve(this.loanStatus.value);
        });
    }
  }

  loadRepaymentWay(): Promise<Dictionary[]> {
    if (this.repaymentWay.value.length > 0) {
      return Promise.resolve(this.repaymentWay.value);
    } else {
      return this.load(this.repaymentWay)
        .then((data)=> {
          this.repaymentWay.value = data;
          return Promise.resolve(this.repaymentWay.value);
        });
    }
  }

  loadProductType(): Promise<Dictionary[]> {
    if (this.productType.value.length > 0) {
      return Promise.resolve(this.productType.value);
    } else {
      return this.load(this.productType)
        .then((data)=> {
          this.productType.value = data;
          return Promise.resolve(this.productType.value);
        });
    }
  }

  loadInterestType(): Promise<Dictionary[]> {
    if (this.interestType.value.length > 0) {
      return Promise.resolve(this.interestType.value);
    } else {
      return this.load(this.interestType)
        .then((data)=> {
          this.interestType.value = data;
          return Promise.resolve(this.interestType.value);
        });
    }
  }

  loadRateCycle(): Promise<Dictionary[]> {
    if (this.rateCycle.value.length > 0) {
      return Promise.resolve(this.rateCycle.value);
    } else {
      return this.load(this.rateCycle)
        .then((data)=> {
          this.rateCycle.value = data;
          return Promise.resolve(this.rateCycle.value);
        });
    }
  }
  loadSignatoryType(): Promise<Dictionary[]> {
    return Promise.resolve(this.signatoryType.value);
  }

  loadSystemLogType(): Promise<Dictionary[]> {
    if (this.systemLogType.value.length > 0) {
      return Promise.resolve(this.systemLogType.value);
    } else {
      return this.load(this.systemLogType)
        .then((data)=> {
          this.systemLogType.value = data;
          return Promise.resolve(this.systemLogType.value);
        });
    }
  }

  loadProveData(): Promise<Dictionary[]> {
    if (this.proveData.value.length > 0) {
      return Promise.resolve(this.proveData.value);
    } else {
      return this.load(this.proveData)
        .then((data)=> {
          this.proveData.value = data;
          return Promise.resolve(this.proveData.value);
        });
    }
  }

  //-----------

  load(dictionaryMap: DictionaryMap): Promise<Dictionary[]> {
    return this.myHttp.get({
      api: this.myHttp.api.dictionary,
      query: {
        type: dictionaryMap.keyword
      }
    }).toPromise()
      .then((res)=> {
        let items = [];
        let data = res;
        if (data.status == 200) {
          let records = data.body.records;
          for (let o of records) {
            let dictionary = new Dictionary();
            dictionary.description = o.description;
            dictionary.id = o.id;
            dictionary.isNewRecord = o.isNewRecord;
            dictionary.label = o.label;
            dictionary.sort = o.sort;
            dictionary.type = o.type;
            dictionary.value = o.value;
            items.push(dictionary);
          }
        }
        return Promise.resolve(items);
      });
  }
  matchByValue(dictionaryMap: DictionaryMap, value: any): Dictionary {
    let dictionary: Dictionary[]=dictionaryMap.value;
    if (dictionary) {
      for (let o of dictionary) {
        if (o.value == value) {
          return o;
        }
      }
    }
  }
}

