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

  initByObj(obj:any):Role{
    if(typeof obj==='object'){
      this.roleCode=obj.roleCode;
      this.roleName=obj.roleName;
      this.departCode=obj.departCode;
      if(obj.department) {
        this.departName = obj.department.departName;
      }
      this.createTime=obj.createTime;
      this.updateTime=obj.updateTime;
      this.remark=obj.remark;
      if(obj.roleFunctions instanceof Array){
        this.roleFunctions=[];
        for(let fn of obj.roleFunctions){
          this.roleFunctions.push(new SubSystemFunction().initByObj(fn));
        }
      }
    }
    return this;
  }
}
