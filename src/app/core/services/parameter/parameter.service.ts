import {Injectable} from '@angular/core'
import {Router} from '@angular/router';
interface ParameterData{
  path:string;
  data:any;
}

@Injectable()
export class ParameterService{
  collection:ParameterData[]=[];
  cacheName:string='Parameters';//存储名
  constructor(
    private router:Router
  ){

    let dataStr=localStorage.getItem(this.cacheName);
    try {
      let data = JSON.parse(dataStr);
      for (let o of data) {
        this.collection.push({
          path: o.path,
          data: o.data
        });
      }
    }catch (err){

    }


    window.addEventListener('beforeunload',()=>{
      let dataStr=JSON.stringify(this.collection);
      localStorage.setItem(this.cacheName,dataStr);
    });
  }

  set(path:string,data:any){
    let exist=false;
    for(let o of this.collection){
      if(o.path===path){
        exist=true;
        o.data=data;
        break;
      }
    }
    if(!exist) {
      this.collection.push({
        path: path,
        data: data
      });
    }
  }
  get(path){
    for(let o of this.collection){
      if(o.path===path){
        return o.data;
      }
    }
  }
  remove(path){
    for(let i=0,len=this.collection.length;i<len;i++){
      if(this.collection[i].path===path){
        this.collection.splice(i,1);
        break;
      }
    }
  }
  clear(){
    localStorage.removeItem(this.cacheName);
  }

}
