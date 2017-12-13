import {environment} from '../../environments/environment';
export interface Environment{
  production?: boolean,
  test?:boolean,
  development?:boolean
}
export const env:Environment=(()=>{
  let _env:Environment={
    production:environment.production,
    test:environment.test,
    development:environment.development
  };
  {
    //根据外部环境(assets/config/environment.js)设置覆盖当前环境设置
    if (window['config'] && typeof window['config'] === 'object') {
      //env
      let outerEnv: string = window['config']['env'];
      (typeof outerEnv === 'string') && (outerEnv = outerEnv.toLowerCase());
      if (outerEnv === 'prod' || outerEnv === 'production') {
        _env.production = true;
        _env.test = false;
        _env.development = false;
      } else if (outerEnv === 'test') {
        _env.production = false;
        _env.test = true;
        _env.development = false;
      } else if (outerEnv === 'dev' || outerEnv === 'development') {
        _env.production = false;
        _env.test = false;
        _env.development = true;
      }
    }
  }
  return _env;
})();
