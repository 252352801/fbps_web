import {SubSystemFunction} from './SubSystemFunction.entity'
/**
 * 角色
 */
export class Role{
  roleCode:string;//角色编码
  roleName:string;//角色名称
  departCode:string;//部门编码
  departName:string;//部门名称
  createTime:string;//创建时间
  updateTime:string;//更新时间
  remark:string;//说明,
  roleFunctions:SubSystemFunction[];
  init(obj?:any):Role{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.roleCode=obj.roleCode;
      instance.roleName=obj.roleName;
      instance.departCode=obj.departCode;
      if(obj.department) {
        instance.departName = obj.department.departName;
      }
      instance.createTime=obj.createTime;
      instance.updateTime=obj.updateTime;
      instance.remark=obj.remark;
      if(obj.roleFunctions instanceof Array){
        instance.roleFunctions=[];
        for(let fn of obj.roleFunctions){
          instance.roleFunctions.push(SubSystemFunction.create(fn));
        }
      }
    }
    return instance;
  }
  static create(obj?:any):Role{
    return new Role().init(obj);
  }
}
