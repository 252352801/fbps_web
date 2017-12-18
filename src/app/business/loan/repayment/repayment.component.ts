import {Component} from '@angular/core';
import {RepaymentNotify} from '../../../core/entity/RepaymentNotify.entity';
import {RepaymentService} from './repayment.service';
import {Paginator} from '../../../core/entity/Paginator.entity';
import {ActivatedRoute,Params,Router} from '@angular/router';
import {fadeInAnimation} from 'app/shared/animations/index';
import {ParameterService} from '../../../core/services/parameter/parameter.service';
import {OauthService} from '../../../core/services/oauth/oauth.service';
@Component({
  selector: 'loan-repayment',
  templateUrl: './repayment.component.html',
  styleUrls: ['./repayment.component.less'],
  providers: [RepaymentService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class RepaymentComponent {
  loading: boolean;//是否正在加载
  tableData: RepaymentNotify[];
  tabs: {//
    tabName: string,
    status: number,
    active: boolean
  }[];
  paginator: Paginator;
  params: {//搜索参数
    companyName: string,
    borrowApplyId: string
  };
  path:string='';
  constructor(
    private repaymentSvc: RepaymentService,
    private actRoute: ActivatedRoute,
    private router: Router,
    public oauth: OauthService,
    private paramSvc: ParameterService,
  ) {
    this.init();
    this.subscribeRouteParams();
  }
  stringify(obj:any):string{
    return encodeURI(JSON.stringify(obj));
  }

  /**
   * 初始化
   */
  init() {
    this.tableData = [];
    this.paginator = new Paginator();
    this.loading = false;
    this.tabs = [{
      tabName: '新通知',
      status: 1,
      active: false
    }, {
      tabName: '待核销',
      status: 2,
      active: false
    }/*, {
      tabName: '还款成功',
      status: 3,
      active: false
    }, {
      tabName: '还款不通过',
      status: -2,
      active: false
    }*/];
    this.params = {
      companyName: '',
      borrowApplyId: ''
    };
    this.path=this.router.url.split(';')[0];
  }

  subscribeRouteParams(){
    this.actRoute.params.subscribe((params:Params)=>{
      let tabIndex=params['tab']?parseInt(params['tab']):0;
      let page=params['page']?parseInt(params['page']):0;
      let rows=params['rows']?parseInt(params['rows']):this.paginator.size;
      let companyName=params['companyName']?params['companyName']:'';
      let borrowApplyId=params['borrowApplyId']?params['borrowApplyId']:'';
      this.params.companyName=companyName;
      this.params.borrowApplyId=borrowApplyId;
      this.paginator.index=page;
      this.paginator.size=rows;
      this.changeTab(tabIndex);
      this.query();
    });
  }

  /**
   * 重置参数
   */
  resetParams() {
    this.params.borrowApplyId = '';
    this.params.companyName = '';
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

  /**
   * 查询
   */
  query() {
    if (this.loading) {
      return;
    }
    let status;
    for(let o of this.tabs){
      if(o.active){
        status=o.status;
        break;
      }
    }
    let query = {
      status:status,
      page: this.paginator.index + 1,
      row: this.paginator.size
    };
    this.loading = true;
    this.repaymentSvc.queryRepaymentNotifies(query)
      .then((res)=> {
        this.loading = false;
        this.paginator.count = res.count;
        this.tableData = res.items;
      })
      .catch((err)=>{
      this.tableData = [];
    });
  }

  search() {
    this.paginator.reset();
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
      rows:number,
      companyName?:string,
      borrowApplyId?:string,
    }={
      tab:tab,
      page:this.paginator.index,
      rows:this.paginator.size,
    };
    if(this.params.companyName!==''){
      params.companyName=this.params.companyName;
    }
    if(this.params.borrowApplyId!==''){
      params.borrowApplyId=this.params.borrowApplyId;
    }
    this.router.navigate([this.path,params]);
  }

  navigateWithData(path:string,data:any,commands:any[]){
    this.paramSvc.set(path,data);
    this.router.navigate(commands);
  }
}
