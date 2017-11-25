/**
 * 该文件用于打包后项目的配置
 */
var config={
  /*
   env 全局环境变量
   生产环境 prod production
   测试环境 test
   测试环境 dev development
   */
  env:'',
  host:{
    //开发访问地址
    dev:{
      api:'http://192.168.10.10:8090/fbps/',//api地址
      oauth:'http://192.168.10.10:8090/ims/',//认证地址
      file:'http://121.46.18.25:9090/oss/'//文件服务器地址
    },
    //测试访问地址
    test:{
      api:'http://192.168.10.10:9090/fbps/',//api地址
      oauth:'http://192.168.10.10:9090/ims/',//认证地址
      file:'http://121.46.18.25:9090/oss/'//文件服务器地址
    },
    //生产访问地址
    prod:{
      api:'',//api地址
      oauth:'',//认证地址
      file:'http://121.46.18.25:8080/oss/'//文件服务器地址
    }
  },
  //登录页系统列表
  systems:[{
    name:'金融SaaS云平台',//系统名称
    link:{//链接
      dev:'',
      test:'',
      prod:''
    },
    active:false //是否激活（当前系统）
  },{
    name:'金融业务处理系统',
    link:{//链接
      dev:'http://192.168.10.10:8091/fbps',
      test:'http://192.168.10.10:9091/fbps',
      prod:''
    },
    active:true
  },{
    name:'客户关系管理系统',
    link:{//链接
      dev:'http://192.168.10.10:8091/crm',
      test:'http://192.168.10.10:9091/crm',
      prod:''
    },
    active:false
  },{
    name:'金融风控管理系统',
    link:{//链接
      dev:'http://192.168.10.10:8091/rcm',
      test:'http://192.168.10.10:9091/rcm',
      prod:''
    },
    active:false
  },{
    name:'银行账户管理系统',
    link:{//链接
      dev:'',
      test:'http://192.168.10.10:9090/ams',
      prod:''
    },
    active:false
  },{
    name:'后台综合管理系统',
    link:{//链接
      dev:'http://192.168.10.10:8091/ims',
      test:'http://192.168.10.10:9091/ims',
      prod:''
    },
    active:false
  }]
};

