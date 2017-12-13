import {Injectable}     from '@angular/core';
import {HttpClient,HttpRequest,HttpHeaders,HttpParams}     from '@angular/common/http';


import {config} from '../config/app.config';
import {Observable} from "rxjs/Observable";
import {CookieService} from 'ng2-cookies';
export interface MyHttpAPIOptions {
  url: string;
  method: string;
}
export interface HttpClientOptions {
  body?: any,
  headers?: HttpHeaders,
  observe?:any,
  params?: HttpParams,
  reportProgress?: boolean,
  responseType?:string,//'arraybuffer'|'blob'|'json'|'text',
  withCredentials?: boolean,
}
export interface MyHttpParameters {
  url?: string;
  api?: MyHttpAPIOptions;
  body?: any,
  query?: any,
  params?: any,
  options?: HttpClientOptions|any
}
@Injectable()
export class MyHttpClient {
  api= config.api;
  constructor(private http: HttpClient) {
  }

  /**
   * 构建url
   * @param parameters
   * @returns {string}
   */
  private createUrl(parameters: MyHttpParameters): string {
    if(parameters.url){
      return parameters.url;
    }else{
      let url: string = parameters.api.url;
      let params = parameters.params;
      let query = parameters.query;
      if (params && typeof params === 'object') {//替换url中形如 /:id 的参数
        for (let o in params) {
          let reg = new RegExp("\/\\s*:\\s*" + o + "[^/?]*");
          url = url.replace(reg, '/' + params[o]);
        }
      }
      if (query && typeof query === 'object') {//替换url中形如  ?name=1&value=2  的数据
        url = url.replace(/\?[\s\S]*/, '');
        let urlParams = serializeURLParams(query);
        if (urlParams) {
          url += '?' + urlParams;
        }
      }
      return url;
    }
  }

  /**
   * request
   * @param parameters
   * @returns {Observable<Response>}
   */
  request(first:string,parameters: MyHttpParameters): Observable<any> {
    let url = this.createUrl(parameters);

    return this.http.request(first,url, parameters.options);
  }

  /**
   * get
   * @param parameters
   * @returns {Observable<Response>}
   */
  get(parameters: MyHttpParameters): Observable<any> {
    let url = this.createUrl(parameters);
    let options=parameters.options||{};
    return this.http.get(url, options);
  }

  /**
   * post
   * @param parameters
   * @returns {Observable<Response>}
   */
  post(parameters: MyHttpParameters): Observable<any> {
    let url = this.createUrl(parameters);
    let body = parameters.body || (parameters.options ? parameters.options.body : null);
    let options=parameters.options||{};
    return this.http.post(url, body,options);
  }

  /**
   * put
   * @param parameters
   * @returns {Observable<Response>}
   */
  put(parameters: MyHttpParameters): Observable<any> {
    let url = this.createUrl(parameters);
    let body = parameters.body || (parameters.options ? parameters.options.body : null);
    let options=parameters.options||{};
    return this.http.put(url, body,options);
  }

  /**
   * delete
   * @param parameters
   * @returns {Observable<Response>}
   */
  delete(parameters: MyHttpParameters): Observable<any> {
    let url = this.createUrl(parameters);
    let options=parameters.options||{};
    return this.http.delete(url, options);
  }

  /**
   * patch
   * @param parameters
   * @returns {Observable<Response>}
   */
  patch(parameters:MyHttpParameters): Observable<any> {
    let url = this.createUrl(parameters);
    let body = parameters.body || (parameters.options ? parameters.options.body : null);
    let options=parameters.options||{};
    return this.http.patch(url, body,options);
  }

  /**
   * head
   * @param parameters
   * @returns {Observable<Response>}
   */
  head(parameters: MyHttpParameters): Observable<any> {
    let url = this.createUrl(parameters);
    let options=parameters.options||{};
    return this.http.head(url,options);
  }

  /**
   * options
   * @param parameters
   * @returns {Observable<Response>}
   */
  options(parameters: MyHttpParameters): Observable<any> {
    let url = this.createUrl(parameters);
    let options=parameters.options||{};
    return this.http.options(url,options);
  }

}


/**
 * 将数据序列化成url参数
 * @param obj
 * @param mode 默认为0
 * 假设obj={a:1,b[1,2,{bb:3}]}
 * 0:转为键值对数据(中括号和点符号组合):a=1&b[0]=1&b[1]=2&b[2].bb=3
 * 1:转为键值对数据(全部使用中括号):a=1&b[0]=1&b[1]=2&b[2][bb]=3
 * 2:转为json字符串;a=1&b=[1,2,{"bb":3}]
 * @returns {string}
 */
export let serializeURLParams=(obj: any, mode?: number):any=>{
  let serialize =(obj: any, collector:string[], prevKey?:string)=>{
    if (obj === null || obj === undefined) {
      return
    }
    if (typeof obj === 'object') {
      for (let o in obj) {
        let curKey,
          newObj = obj[o + ''];
        if (mode === 1) {
          curKey = prevKey ? '[' + o + ']' : o + '';
        } else if (mode === 2) {
          curKey = o + '';
          newObj = JSON.stringify(newObj);
        } else {
          curKey = (obj instanceof Array) ? ('[' + o + ']') : ((prevKey ? '.' : '') + o);
        }
        let newKey = prevKey ? prevKey + curKey : curKey;
        serialize(newObj, collector, newKey);
      }
    } else {
      collector.push(prevKey ? (prevKey + '=' + obj) : obj);
    }
  };
  let params = [];
  serialize(obj, params);
  return (params.length > 0 ? params.join('&') : obj);
};
