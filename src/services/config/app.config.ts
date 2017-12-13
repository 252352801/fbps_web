import {host,Host} from './host.config';
import {api} from './api.config';
import {systems,System} from './system.config';
import {env,Environment} from './env.config';
import {patterns} from './patterns.config';

class Config{
  name: string;
  version: string;
  env: Environment;
  host:Host;
  api=api;
  patterns=patterns;
  systems:System[];
  constructor(){
    this.init();
  }
  init(){
    this.name='fbps_web';
    this.version='0.01';
    this.env=env;
    this.host=host;
    this.host=host;
    this.systems=systems;
  }
}


//基本配置
export const config=new Config();


