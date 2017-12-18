import {env} from './env.config';
export interface System {
  name: string;
  link: string;
  active?: boolean;
}

//export
export const systems: System[] = (()=> {
  let sys = [];
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



