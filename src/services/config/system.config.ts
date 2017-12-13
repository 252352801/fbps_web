import {env} from './env.config';
export interface System {
  name: string;
  link: string;
  active?: boolean;
}
const config = [{
  name: '金融SaaS云平台',//系统名称
  link: {//链接
    dev: '',
    test: '',
    prod: '',
  },
  active: false //是否激活（当前系统）
}, {
  name: '金融业务处理系统',
  link: {//链接
    dev: 'http://192.168.10.10:8091/fbps',
    test: 'http://192.168.10.10:9091/fbps',
    prod: 'http://fsmp.money56.com:8083/fbps',
  },
  active: true
}, {
  name: '客户关系管理系统',
  link: {//链接
    dev: 'http://192.168.10.10:8091/crm',
    test: 'http://192.168.10.10:9091/crm',
    prod: 'http://fsmp.money56.com:8083/crm',
  },
  active: false
}, {
  name: '金融风控管理系统',
  link: {//链接
    dev: 'http://192.168.10.10:8091/rcm',
    test: 'http://192.168.10.10:9091/rcm',
    prod: 'http://fsmp.money56.com:8083/rcm',
  },
  active: false
}, {
  name: '银行账户管理系统',
  link: {//链接
    dev: 'http://192.168.10.10:8090/ams',
    test: 'http://192.168.10.10:9090/ams',
    prod: 'fsmp.money56.com:8082/ams',
  },
  active: false
}, {
  name: '后台综合管理系统',
  link: {//链接
    dev: 'http://192.168.10.10:8091/ims',
    test: 'http://192.168.10.10:9091/ims',
    prod: 'http://fsmp.money56.com:8083/ims',
  },
  active: false
}];




























//export
export const systems: System[] = (()=> {
  let sys = config;
  {
    let systems = window['config'] && typeof window['config'] === 'object' && window['config']['systems'];
    if (systems && systems instanceof Array) {
      let newSystems = [];
      for (let sys of systems) {
        if (typeof sys['name'] === 'string' && sys['link'] && typeof sys['link'] === 'object') {
          let system = {
            name: sys['name'],
            link: {
              dev: sys['link']['dev'] || '',
              test: sys['link']['test'] || '',
              prod: sys['link']['prod'] || ''
            },
            active: !!sys['active']
          };
          newSystems.push(system);
        }
      }
      if (newSystems.length > 0) {
        sys = newSystems;
      }
    }
  }

    let result: System[] = [];
    for (let s of sys) {
      let link = '';
      if (env.production) {
        link = s.link.prod;
      } else if (env.test) {
        link = s.link.test;
      } else if (env.development) {
        link = s.link.dev;
      }
      let system = {
        name: s.name,
        link: link,
        active: !!s.active
      };
      result.push(system);
    }

  return result;
})();



