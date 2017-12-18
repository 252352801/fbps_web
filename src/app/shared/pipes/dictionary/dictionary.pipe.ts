  import {Pipe, PipeTransform, Injectable} from '@angular/core';
import {DictionaryService} from '../../../core/services/dictionary/dictionary.service';

@Pipe({
  name: 'dictionary',
  pure: false
})
@Injectable()
export class DictionaryPipe implements PipeTransform {


  private static loadingDictionaries:{
    keyword:string,//字典关键字
    loading:boolean//是否在加载
  }[]=[];
  private result:any;
  constructor(private dictionarySvc: DictionaryService) {
  }
  loadDictionary(keyword:string,value:any){
    let isExit=false;
    for(let o of DictionaryPipe.loadingDictionaries){
      if(o.keyword===keyword){
        isExit=true;
        if(!o.loading){
          o.loading=true;
          this.dictionarySvc.load(keyword);
        }
        break;
      }
    }
    if(!isExit){
      DictionaryPipe.loadingDictionaries.push({
        keyword:keyword,
        loading:true
      });
      this.dictionarySvc.load(keyword);
    }
  }

  transform(value: any, key: string): any {
    if(!this.result){
      this.loadDictionary(key,value);
      let label = this.dictionarySvc.matchLabelByValue(key,value);
      this.result=(label ? label : '');
    }
    return this.result;
  }
}

