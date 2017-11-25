import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DemoService} from './demo.service';
import {OauthService} from '../../services/oauth/oauth.service';
import {AreaPicker} from '../../directives/areaPicker/areaPicker.directive';

@Component({
  selector: 'demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.less'],
  providers: [DemoService]
})
export class DemoComponent {

  areaPicker1: AreaPicker;
  areaPicker2: AreaPicker;
  address1:string='';
  address2:string='';
  constructor(private router: Router, private demoSvc: DemoService, private oauth: OauthService) {
    this.areaPicker1 = new AreaPicker();
    this.areaPicker1.items = [{
      label: '省份',
      key: 'name',
      data: [],
      selected: (data)=> {
        setTimeout(()=>{
          this.areaPicker1.setData([{
            name: '广州'
          },{
            name: '阳江'
          },{
            name: '佛山'
          }]);
        },500);
      }
    },{
      label: '城市',
      key: 'name',
      data: [],
      selected: (data)=> {
        setTimeout(()=>{
          this.areaPicker1.setData([{
            name: '天河区'
          },{
            name: '海珠区'
          },{
            name: '番禺区'
          }]);
        },500);
      }
    },{
      label: '地区',
      key: 'name',
      data: [],
      selected: (data)=> {
      }
    }];
    this.areaPicker1.init=()=>{
      setTimeout(()=>{
        this.areaPicker1.setData([{
          name: '广东省'
        },{
          name: '广西壮族自治区'
        },{
          name: '日本省'
        }]);
      },500);
    };
    this.areaPicker1.done=(values)=>{
      console.log(values);
    };






    this.areaPicker2 = new AreaPicker();
    this.areaPicker2.items = [{
      label: '省份',
      key: 'name.test',
      data: [],
      selected: (data)=> {
       // setTimeout(()=>{
          this.areaPicker2.setData([{
            name: '广州'
          },{
            name: '阳江'
          },{
            name: '佛山'
          }]);
       // },500);
      }
    },{
      label: '城市',
      key: 'name',
      data: [],
      selected: (data)=> {

      //  setTimeout(()=>{
          this.areaPicker2.setData([{
            name: '天河区'
          },{
            name: '海珠区'
          },{
            name: '番禺区'
          }]);
      //  },500);
      }
    },{
      label: '地区',
      key: 'name',
      data: [],
      selected: (data)=> {
      }
    }];
    this.areaPicker2.init=()=>{
      this.areaPicker2.setData([{
        name:{
          test:'美国省'
        }
      },{
        name:{
          test:'日本省'
        }
      },{
        name:{
          test:'韩国省'
        }
      }]);
    };
    this.areaPicker2.done=(values)=>{
      console.log(values);
      this.address2=values[0].name.test+'/'+values[1].name+'/'+values[2].name;
    };
  }
}
