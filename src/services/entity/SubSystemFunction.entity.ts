/**
 * 子系统功能节点
 */
export class SubSystemFunction {
  subsystemCode:string;//子系统编码
  subsystemName:string;//子系统名称
  functionPoint:string;//功能节点代码
  label:string;//功能节点名称

  init(obj?:any):SubSystemFunction{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.subsystemCode=obj.subsystemCode;
      instance.functionPoint=obj.functionPoint;
      instance.label=obj.label||'';
      if(obj['subsystem']&&typeof obj['subsystem']==='object'){
        instance.subsystemName=obj['subsystem']['name'];
      }
    }
    return instance;
  }
  static create(obj?:any):SubSystemFunction{
    return new SubSystemFunction().init(obj);
  }

}
