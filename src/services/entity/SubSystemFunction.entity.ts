/**
 * 子系统功能节点
 */
export class SubSystemFunction {
  subsystemCode:string;//子系统编码
  subsystemName:string;//子系统名称
  functionPoint:string;//功能节点代码
  label:string;//功能节点名称
  initByObj(obj:any):SubSystemFunction{
    if(typeof obj==='object'){
      this.subsystemCode=obj.subsystemCode;
      this.functionPoint=obj.functionPoint;
      this.label=obj.label||'';
      if(obj['subsystem']&&typeof obj['subsystem']==='object'){
        this.subsystemName=obj['subsystem']['name'];
      }
    }
    return this;
  }
}
