import {Component} from '@angular/core';
import {ActivatedRoute,Params,Router } from '@angular/router';
import {Rollover} from '../../../../services/entity/Rollover.entity';
import {Paginator} from '../../../../services/entity/Paginator.entity';
import {RolloverService} from './rollover.service';
import {OauthService} from '../../../../services/oauth/oauth.service';
import {fadeInAnimation} from '../../../../animations/index';
import 'rxjs/add/operator/switchMap';
@Component({
  selector: 'loan-rollover',
  templateUrl: './rollover.component.html',
  styleUrls: ['./rollover.component.less'],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class RolloverComponent {
  loading: boolean;//是否正在加载
  tableData: Rollover[];//表格数据
  paginator: Paginator;
  tabs: {//
    tabName: string,
    status: number[]|number,
    active: boolean
  }[];
  path:string='';
  constructor(
    private rolloverSvc: RolloverService,
    private actRoute:ActivatedRoute,
    public oauth:OauthService,
    private router:Router
  ) {
    this.init();
    this.subscribeRouteParams();
  }

  /**
   * 初始化
   */
  init() {
    this.tableData = [];
    this.paginator = new Paginator();
    this.loading = false;
    this.tabs = [{
      tabName: '新申请',
      status: 201,
      active: false
    }, {
      tabName: '受理中',
      status: [203,204,205,206],//203待配合同   204待确认合同  205待风控审批 206待送签合同
      active: false
    }, {
      tabName: '展期中',
      status: 211,
      active: false
    }/*,{
      tabName: '已结清',
      status: 303,
      active: false
    },{
      tabName: '已逾期',
      status: 401,
      active: false
    },{
      tabName: '异常结束',
      status: 500,
      active: false
    },{
      tabName: '审批不通过',
      status: 503,
      active: false
    },{
      tabName: '拒绝合同',
      status: 505,
      active: false
    }*/];
    this.path=this.router.url.split(';')[0];
  }

  subscribeRouteParams(){
    this.actRoute.params.subscribe((params:Params)=>{
      let tabIndex=params['tab']?parseInt(params['tab']):0;
      let page=params['page']?parseInt(params['page']):0;
      let rows=params['rows']?parseInt(params['rows']):this.paginator.size;
      let companyName=params['companyName']?params['companyName']:'';
      let borrowApplyId=params['borrowApplyId']?params['borrowApplyId']:'';
      this.paginator.index=page;
      this.paginator.size=rows;
      this.changeTab(tabIndex);
      this.query();
    });
  }

  /**
   *
   * @param tab
   */
  changeTab(tabIndex:number) {
    for (let o of this.tabs) {
      o.active = false;
    }
    this.tabs[tabIndex].active = true;
  }

  private getStatus(): number[]|number|string {
    for (let o of this.tabs) {
      if (o.active) {
        let status;
        if(o.status instanceof Array){
          status=o.status.toString();
        }else{
          status=o.status;
        }
        return status;
      }
    }
    return -1;
  }

  /**
   * 查询
   */
  query() {
    if (this.loading) {
      return;
    }

    let query = {
      status: this.getStatus(),
      page: this.paginator.index + 1,
      row: this.paginator.size
    };
    this.loading = true;
    this.rolloverSvc.queryLoans(query)
      .then((res)=> {
        this.loading = false;
        this.paginator.count = res.count;
        this.tableData = res.items;
      });
  }

  search() {
    this.paginator.reset();
    this.tableData = [];
    this.query();
  }

  navigate(){
    let tab=0;
    for(let i=0,len=this.tabs.length;i<len;i++){
      if(this.tabs[i].active){
        tab=i;
        break;
      }
    }
    let params:{
      tab:number,
      page:number,
      rows:number
    }={
      tab:tab,
      page:this.paginator.index,
      rows:this.paginator.size,
    };

    this.router.navigate([this.path,params]);
  }

}
