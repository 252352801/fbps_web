import {env} from './env.config';
export interface Host{
  fbps:string;
  ims:string;
  file:string;
}


//export
export const host:Host=(()=>{
  let _host:Host={
    fbps:'',
    ims:'',
    file:''
  };
  let config:{
    dev?:Host,
    test?:Host,
    prod?:Host
  }={};
  {//获取外部配置
    let hostConfig=window['config']&&typeof window['config']==='object'&&window['config']['host'];
    if(hostConfig&&typeof hostConfig==='object'){
      let regUrl=/^http[s]?:\/\/\S+$/;
      for(let o in hostConfig){
        if(!(o in config)){
          config[o+'']={
            fbps:'',
            ims:'',
            file:''
          }
        }
        for(let k in hostConfig[o+'']){
          if(regUrl.test(hostConfig[o+''][k+''])){
            config[o+''][k+'']=hostConfig[o+''][k+''];
          }
        }
      }
    }
  }
  if(env.production){
    _host.fbps=config.prod.fbps;
    _host.ims=config.prod.ims;
    _host.file=config.prod.file;
  }else if(env.test){
    _host.fbps=config.test.fbps;
    _host.ims=config.test.ims;
    _host.file=config.test.file;
  }else{
    _host.fbps=config.dev.fbps;
    _host.ims=config.dev.ims;
    _host.file=config.dev.file;
  }
  return _host;
})();
