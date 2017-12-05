import {SubSystemFunction} from './SubSystemFunction.entity'
import {SubSystem} from './SubSystem.entity'
import {Role} from './Role.entity'
/**
 * User
 */
export class User {
  accessToken:string;
  mobile:string;
  departCode:string;
  roles:Role[];
  employeeId:string;
  employeeName:string;
  subsysFuncs:SubSystemFunction[];
  subsystem:SubSystem;
  expiresIn:number;
  isManager:boolean;//是否是主管

  /**
   * 初始化
   * @param obj
   * @returns {User}
   */
   init(obj?:any):User{
     let instance=this;
     if(obj&&typeof obj==='object'){
       instance.accessToken=obj.accessToken;
       instance.mobile=obj.mobile;
       instance.departCode=obj.departCode;
       instance.employeeId=obj.employeeId;
       instance.employeeName=obj.employeeName;
       instance.expiresIn=obj.expiresIn*1000;
       instance.isManager=!!obj.isManager;
       if(obj['subsysFuncs'] instanceof Array){
         instance.subsysFuncs=[];
         for(let o of obj['subsysFuncs']){
           instance.subsysFuncs.push(new SubSystemFunction().init(o));
         }
       }
       if(obj['roles'] instanceof Array){
         instance.roles=[];
         for(let o of obj['roles']){
           instance.roles.push(new Role().init(o));
         }
       }
       if(typeof obj['subsystem']==='object'){
         instance.subsystem=new SubSystem().init(obj['subsystem']);
       }
     }
     return instance;
  }

  /**
   * 新建一个实例
   * @param obj
   * @returns {User}
   */
  static create(obj?:any):User{
    let instance=new User();
    return instance.init(obj);
  }
}
