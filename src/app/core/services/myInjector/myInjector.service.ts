import {Injectable,Injector,ReflectiveInjector,Provider} from '@angular/core';
@Injectable()
export class MyInjector{
  private static myInjector:Injector;
  constructor(private injector:Injector){
    MyInjector.myInjector=this.injector;
  }
  static getInstance(){
    return  MyInjector.myInjector;
  }
}
export const myInjector={
  get:(token: any, notFoundValue?: any):any=>{
    return MyInjector.getInstance().get(token,notFoundValue);
  }
};


