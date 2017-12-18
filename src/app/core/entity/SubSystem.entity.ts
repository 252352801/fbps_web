/**
 * 子系统
 */
export class SubSystem {
  subsystemCode:string;//子系统编码
  name:string;//子系统名
  serverIp:string;//子系统IP
  interfaceProtocol:string;//接口协议

  init(obj?:any):SubSystem{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.subsystemCode=obj.subsystemCode;
      instance.name=obj.name;
      instance.serverIp=obj.serverIp;
      instance.interfaceProtocol=obj.interfaceProtocal;
    }
    return instance;
  }
  static create(obj?:any):SubSystem{
    return new SubSystem().init(obj);
  }
}
