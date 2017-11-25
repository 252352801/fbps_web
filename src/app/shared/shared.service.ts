import {Injectable} from '@angular/core';
import {AsideMenu} from '../../services/entity/AsideMenu.entity';
import {Resource} from '../../services/entity/Resource.entity';
import {MyHttpClient} from '../../services/myHttp/myhttpClient.service';
import {FileInfo} from '../../services/entity/FileInfo.entity';
import {host_oauth,api_file} from '../../services/config/app.config';
@Injectable()
export class SharedService{
  asideMenus:AsideMenu[]=[];//左侧菜单
  capitals:Resource[]=[];//资方
  constructor(
    private myHttp:MyHttpClient
  ){

  }

  replace(str:string,subStr:string,targetStr?:string):string{
    let target=(targetStr===undefined?'':targetStr);
    return (str+'').replace(new RegExp(subStr),target);
  }

  /**
   * 字符串替换
   * @param str
   * @param subStr
   * @param targetStr
   * @returns {string}
   */
  replaceAll(str:string,subStr:string,targetStr?:string):string{
    let target=(targetStr===undefined?'':targetStr);
      return (str+'').replace(new RegExp(subStr,'g'),target);
  }

  /**
   * 获取资方列表
   * @returns {any}
   */
  getCapitals(): Promise<Resource[]> {
    if(this.capitals.length>0){
      return Promise.resolve(this.capitals);
    }else{
      return this.myHttp.get({
        api: this.myHttp.api.resource,
        query: {
          resourceType:1
        }
      }).toPromise()
        .then((res)=> {
          let resources = [];
          let result = res;
          if (result.status === 200) {
            for (let o of result.body.records) {
              let resource = new Resource().initByObj(o);
              resources.push(resource);
            }
          }
          return Promise.resolve(resources);
        });
    }
  }

  /**
   * 退出登录
   * @param body
   * @returns {Promise<Promise<{ok: boolean, message: string}>>|PromiseLike<{ok: boolean, message: string}>|wdpromise.Promise<T>|promise.Promise<Promise<{ok: boolean, message: string}>>|Promise<{ok: boolean, message: string}>|IPromise<{ok: boolean, message: string}>|any}
   */
  signOut(body: {
    employeeId: string
  }): Promise<{ok: boolean,message: string}> {
    return this.myHttp.post({
      url: host_oauth+'iam/employee/logout',
      body: body
    }).toPromise()
      .then((res)=> {
        let data = {
          ok: false,
          message: ''
        };
        let response = res;
        data.ok = (response.status == 200);
        data.message = response.message;
        return Promise.resolve(data);
      });
  }


  /**
   * 根据文件ID获取文件信息
   * @param fileId
   * @returns {any}
   */
  getFileInfo(fileId:string):Promise<{ok:boolean,data:FileInfo}>{
    return this.myHttp.post({
      url:api_file.info,
      body:{
        fileId:fileId
      }
    }).toPromise()
      .then((res)=> {
        let data = {
          ok:false,
          data:null
        };
        let result = res;
        if (result.status === 200) {
          data.ok=true;
          data.data=new FileInfo().initByObj(result.body);
        }
        return Promise.resolve(data);
      });
  }

  /**
   * 删除文件
   * @param fileId
   * @returns Promise<{status:boolean,message:string}
   */
  deleteFile(fileId:string):Promise<{status:boolean,message:string}>{
    return this.myHttp.post({
      url:api_file.delete,
      body:{
        fileId:fileId
      }
    }).toPromise()
      .then((res)=> {
        let data = {
          status:false,
          message:''
        };
        let result = res;
        if (result.status === 200) {
        }
        data.status=(result.status==200);
        data.message=result.message||'';
        return Promise.resolve(data);
      });
  }

}
