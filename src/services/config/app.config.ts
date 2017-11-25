import {environment} from '../../environments/environment';
/**
 * 环境
 */
interface Environment{
  production?: boolean,
  test?:boolean,
  development?:boolean
}
interface Host{
  api:string;
  oauth:string;
  file:string;
}
interface System{
  name:string;
  link:{
    dev:string,
    test:string,
    prod:string
  };
  active?:boolean;
}
/**
 * 主机地址
 */
class HostManage{
  dev:string;
  test:string;
  prod:string;

  /**
   * 构造函数
   * @param dev 开发环境地址
   * @param test 测试环境地址
   * @param prod 生产环境地址
   */
  constructor(dev:string,test:string,prod:string){
    this.dev=dev;
    this.test=test;
    this.prod=prod;
  }

  /**
   * 获取当前环境主机地址
   * @param env
   * @returns {string}
   */
  getCurrentHost(env:Environment){
    if(env.production){
      return this.prod;
    }else if(env.test){
      return this.test;
    }else{
      return this.dev;
    }
  }
}
class Config{
  name: string;
  version: string;
  env: Environment;
  private host:{
    dev:Host,
    test:Host,
    prod:Host
  };
  private systems:System[];
  constructor(){
    this.init();
    this.initEnv();
    this.initHost();
    this.initSystems();
  }
  init(){
    this.name='fbps_web';
    this.version='0.01';
    this.env={
      production:environment.production,
      test:environment.test,
      development:environment.development
    };
    this.host={
      dev:{
        api:'http://192.168.10.10:8090/fbps/',
        oauth:'http://192.168.10.10:8090/ims/',
        file:'http://121.46.18.25:8090/oss/'
      },
      test:{
        api:'http://192.168.10.10:9090/fbps/',
        oauth:'http://192.168.10.10:9090/ims/',
        file:'http://121.46.18.25:9090/oss/'
      },
      prod:{
        api:'http://192.168.10.10:9090/fbps/',
        oauth:'http://192.168.10.10:9090/ims/',
        file:'http://121.46.18.25:8080/oss/'
      }
    };
    this.systems=[{
      name:'金融SaaS云平台',//系统名称
      link:{//链接
        dev:'',
        test:'',
        prod:'',
      },
      active:false //是否激活（当前系统）
    },{
      name:'金融业务处理系统',
      link:{//链接
        dev:'http://192.168.10.10:8091/fbps',
        test:'http://192.168.10.10:9091/fbps',
        prod:'',
      },
      active:true
    },{
      name:'客户关系管理系统',
      link:{//链接
        dev:'http://192.168.10.10:8091/crm',
        test:'http://192.168.10.10:9091/crm',
        prod:'',
      },
      active:false
    },{
      name:'金融风控管理系统',
      link:{//链接
        dev:'http://192.168.10.10:8091/rcm',
        test:'http://192.168.10.10:9091/rcm',
        prod:'',
      },
      active:false
    },{
      name:'银行账户管理系统',
      link:{//链接
        dev:'',
        test:'',
        prod:'',
      },
      active:false
    },{
      name:'后台综合管理系统',
      link:{//链接
        dev:'http://192.168.10.10:8091/ims',
        test:'http://192.168.10.10:9091/ims',
        prod:'',
      },
      active:false
    }];
  }

  initEnv() {
    //根据外部环境(assets/config/environment.js)设置覆盖当前环境设置
    if (window['config'] && typeof window['config'] === 'object') {
      //env
      let env: string = window['config']['env'];
      (typeof env === 'string') && (env = env.toLowerCase());
      if (env === 'prod' || env === 'production') {
        this.env.production = true;
        this.env.test = false;
        this.env.development = false;
      } else if (env === 'test') {
        this.env.production = false;
        this.env.test = true;
        this.env.development = false;
      } else if (env === 'dev' || env === 'development') {
        this.env.production = false;
        this.env.test = false;
        this.env.development = true;
      }
    }
  }

  initHost(){
    if(window['config']&&typeof window['config']==='object'){
      let host=window['config']['host'];
      let regUrl=/^http[s]?:\/\/\S+/;
      if(host&&typeof host==='object'){
        for(let o in host){
          if(o in this.host){
           for(let k in host[o+'']){
             if(regUrl.test(host[o+''][k+''])){
               this.host[o+''][k+'']=host[o+''][k+''];
             }
           }
          }
        }
      }
    }
  }
  initSystems(){
    if(window['config']&&typeof window['config']==='object'){
      let systems=window['config']['systems'];
      if(systems&&systems instanceof Array){
        let newSystems=[];
        for(let sys of systems){
          if(typeof sys['name']==='string'&&sys['link']&&typeof sys['link']==='object'){
            let system:System={
              name:sys['name'],
              link:{
                dev:sys['link']['dev']||'',
                test:sys['link']['test']||'',
                prod:sys['link']['prod']||''
              },
              active:!!sys['active']
            };
            newSystems.push(system);
          }
        }
        if(newSystems.length>0){
          this.systems=newSystems;
        }
      }
    }
  }


  getHost():Host{
    if(this.env.production){
      return this.host.prod;
    }else if(this.env.test){
      return this.host.test;
    }else if(this.env.development){
      return this.host.dev;
    }
  }

  getSystems():{
    name:string,
    link:string,
    active?:boolean
  }[]{
    let systems=[];
    for(let sys of this.systems){
      let link='';
      if(this.env.production){
        link=sys.link.prod;
      }else if(this.env.test){
        link=sys.link.test;
      }else if(this.env.development){
        link=sys.link.dev;
      }
      let system={
        name:sys.name,
        link:link,
        active:!!sys.active
      };
      systems.push(system);
    }
    return systems;
  }
}


//基本配置
export const config=new Config();
//host
export const host=config.getHost();
//项目主接口地址
export  const host_api=host.api;
//认证相关接口地址
export const host_oauth=host.oauth;
//文件相关接口地址
export const host_file=host.file;


/*文件服务接口*/
export const api_file={
  upload:host_file+'file/upload',
  download:host_file+'file/download',
  preview:host_file+'file/preview',
  delete:host_file+'file/delete',
  info:host_file+'file/getInfo',
};

export const API = {
  /*-----------------------------------授权类---------------------------------------*/
  signIn:{//登录
    url: 'oauth/login',
    method: 'post'
  },
  refreshToken:{//更新token
    url: 'oauth/refreshToken',
    method: 'get'
  },
  /*-----------------------------------贷款类---------------------------------------*/
  loanList:{//贷款申请列表
    url: 'lms/financeApply/applyList',
    method: 'get'
  },
  loanDetail:{//贷款详情
    url: 'lms/financeApply/applyDetail',
    method: 'get'
  },
  firstApprove:{//用款一审
    url:'lms/financeApply/firstApprove',
    method: 'post'
  },
  loanApprove:{//用款申请审批
    url: 'lms/financeApply/approve',
    method: 'post'
  },
  loanReview:{//用款申请二审
    url: 'lms/financeApply/secondApprove',
    method: 'post'
  },
  updateLoanStatus:{//更新贷款单状态
    url:'/Loan/UpdateLoanStatus',
    method:'post'
  },
  loanPay:{//放款
    url:'lms/financeApply/pay',
    method:'post'
  },
  cancelLoan:{
    url:'lms/financeApply/cancelApply',
    method:'post'
  },
  getBankCard:{
    url:'sys/user/getBankCard', //memberId=20171101000001&type=1    type:0收款卡   1还款卡
    method:'get'
  },
  loanProveData:{//121用款证明材料列表
    url:'lms/financeApply/proveDataList',
    method:'post'
  },
  /*-----------------------------------展期类---------------------------------------*/
  rolloverList:{//展期申请列表
    url:'lms/rolloverApply/applyList',
    method:'post'
  },
  rollover:{//展期详情
    url:'lms/rolloverApply/applyDetail',
    method:'get'
  },
  approveRollover:{//展期审批
    url:'lms/rolloverApply/approve',
    method:'post'
  },
  /*-----------------------------------还款类---------------------------------------*/
  createRepaymentNotify:{//生成还款通知
    url:'/lms/repaymentNotify/saveRepaymentNotify',
    method:'post'
  },
  acceptRepayment:{//受理还款
    url:'lms/repaymentNotify/acceptRepayment',
    method:'post'
  },
  checkRepayment:{//还款核销
    url:'lms/repaymentNotify/checkRepaymentNotify',
    method:'post'
  },
  repayPlanList:{//还款计划列表
    url:'lms/repaymentPlan/repaymentPlanList',
    method:'post'
  },
  repaymentNotifyList:{//还款通知列表
    url:'lms/repaymentNotify/repaymentNotifyList',
    method:'post'
  },
  createRepayPlanPreview:{
    url:'lms/repaymentPlan/repayPlanPreview',
    method:'post'
  },
  /*-----------------------------------产品类---------------------------------------*/
  productList:{//产品列表
    url:'/base/products/getList',
    method:'post'
  },
  product:{//产品详情
    url:'base/products/getById',
    method:'get'
  },
  createProduct:{//添加产品
    url:'base/products/create',
    method:'post'
  },
  updateProduct:{//修改产品
    url:'base/products/update',
    method:'post'
  },
  updateProductStatus:{//更改产品状态
    url:'/Product/UpdateStatus',
    method:'post'
  },
  configProduct:{//产品参数配置
    url:'base/products/config',
    method:'post'
  },
  productConfigList:{//产品配置列表
    url:'base/products/getProductsAttachList',
    method:'get'
  },
  deleteProductConfig:{//删除产品配置
    url:'base/products/deleteConfig',
    method:'post'
  },
  updateProductsStatus:{
    url:'base/products/updateProductsStatus',
    method:'post'
  },
  getProveData:{//产品融资证明附件列表
    url:'base/products/getProveDataList',
    method:'post'
  },
  /*-----------------------------------合同类---------------------------------------*/
  createContract:{//合同添加
    url:'tw/contract/createContract',
    method:'post'
  },
  contractList:{//合同列表
    url:'tw/contract/contractList',
    method:'get'
  },
  signContract:{//合同送签
    url:'/Contract/Sign',
    method:'post'
  },
  deleteContract:{//合同删除
    url:'tw/contract/deleteContract',
    method:'post'
  },
  /*-----------------------------------数据类---------------------------------------*/
  resource:{//资方列表
    url:'/base/resource/getList',
    method:'get'
  },
  createCapital:{//资方添加
    url:'/Capital/Create',
    method:'post'
  },
  deleteCapital:{//资方删除
    url:'/Capital/delete',
    method:'post'
  },
  signatories:{
    url:'/tw/contract/userList',
    method:'post'
  },
  accountInfo:{//虚拟账户详情
    url:'acct/Account/getAccountInfo',
    method:'get'
  },
  bankAccountFlow:{//虚拟账户low流水
    url:'acct/Account/getFlow',
    method:'get'
  },
  contractSignatories:{
    url:'tw/contract/getSignList',
    method:'get'
  },

  /*-----------------------------------系统类---------------------------------------*/
  systemLogs:{//系统日志
    url:'sys/log/logList',
    method:'post'
  },

  /*-----------------------------------字典类---------------------------------------*/
  dictionary:{//字典
    url:'/base/dictionary/dictionaryList',
    method:'get'
  }
};

