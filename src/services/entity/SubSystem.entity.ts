/**
 * 子系统
 */
export class SubSystem {
  subsystemCode:string;//子系统编码
  name:string;//子系统名
  serverIp:string;//子系统IP
  interfaceProtocol:string;//接口协议
  initByObj(obj:any):SubSystem{
    if(typeof obj==='object'){
      this.subsystemCode=obj.subsystemCode;
      this.name=obj.name;
      this.serverIp=obj.serverIp;
      this.interfaceProtocol=obj.interfaceProtocal;
    }
    return this;
  }
}
