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
  initByObj(obj:any):User{
    if(typeof obj==='object'){
      this.accessToken=obj.accessToken;
      this.mobile=obj.mobile;
      this.departCode=obj.departCode;
      this.employeeId=obj.employeeId;
      this.employeeName=obj.employeeName;
      this.expiresIn=obj.expiresIn*1000;
      this.isManager=!!obj.isManager;
      if(obj['subsysFuncs'] instanceof Array){
        this.subsysFuncs=[];
        for(let o of obj['subsysFuncs']){
          this.subsysFuncs.push(new SubSystemFunction().initByObj(o));
        }
      }
      if(obj['roles'] instanceof Array){
        this.roles=[];
        for(let o of obj['roles']){
          this.roles.push(new Role().initByObj(o));
        }
      }
      if(typeof obj['subsystem']==='object'){
        this.subsystem=new SubSystem().initByObj(obj['subsystem']);
      }
    }
    return this;
  }
}
