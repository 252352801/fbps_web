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

/**
 * 字典
 */
@Injectable()
export class DictionaryService {

  static store:{
    keyword:string,
    data:Dictionary[]
  }[]=[];
  constructor(private myHttp: MyHttpClient) {
    let signatoryType=[new Dictionary(),new Dictionary(),new Dictionary()];
    signatoryType[0].label = '全部';
    signatoryType[0].value = -1;
    signatoryType[1].label = '企业';
    signatoryType[1].value = 0;
    signatoryType[2].label = '个人';
    signatoryType[2].value = 1;
    DictionaryService.store.push({
      keyword:'signatory_type',
      data:signatoryType
    });
  }

  //-----------
  get(keyword:string):Dictionary[]{
    for(let o of DictionaryService.store){
      if(o.keyword===keyword){
        return o.data;
      }
    }
  }
  matchLabelByValue(keyword:string,value:any):string{
    let dictionary=this.get(keyword);
    if (dictionary) {
      for (let o of dictionary) {
        if (o.value == value) {
          return o.label;
        }
      }
    }
  }
  load(keyword:string):Promise<Dictionary[]>{
    let localData=this.get(keyword);
    if(localData){
      return Promise.resolve(localData);
    }else{
      return this.myHttp.get({
        api: this.myHttp.api.dictionary,
        query: {
          type: keyword
        }
      }).toPromise()
        .then((res)=> {
          let items:Dictionary[]= [];
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
          if(!this.get(keyword)){
            DictionaryService.store.push({
              keyword:keyword,
              data:items
            });
          }
          return Promise.resolve(items);
        })
        .catch((err)=>{

        });
    }
  }
}

