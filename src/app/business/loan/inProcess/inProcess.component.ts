import {Component} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Loan} from '../../../../services/entity/Loan.entity';
import {Paginator} from '../../../../services/entity/Paginator.entity';
import {OauthService} from '../../../../services/oauth/oauth.service';
import {InProcessService} from './inProcess.service';
import {RepayPlan} from '../../../../services/entity/RepayPlan.entity';
import {fadeInAnimation} from '../../../../animations/index';
@Component({
  selector: 'loan-in-process',
  templateUrl: './inProcess.component.html',
  styleUrls: ['./inProcess.component.less'],
  providers: [InProcessService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class InProcessComponent {
  loading: boolean;//是否正在加载
  tableData: Loan[];//表格数据
  limitDay: number;//即将到期时间参考值
  paginator: Paginator;
  tabs: {//
    tabName: string,
    status: Array<number>|number,
    active: boolean
  }[];
  params: {//搜索参数
    companyName: string,
    borrowApplyId: string
  };
  modalRepaymentPlan = {
    visible: false,
    loading:false,
    data: [],
    submitted: false
  };

  path: string = '';

  constructor(private inProcessSvc: InProcessService,
              private actRoute: ActivatedRoute,
              public oauth: OauthService,
              private router: Router) {
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
    this.limitDay = 7;
    this.tabs = [{
      tabName: '全部',
      status: [207,211,300,301,302,401],
      active: false
    }, {
      tabName: '即将到期',
      status: 207,
      active: false
    }, {
      tabName: '已逾期',
      status: 401,
      active: false
    }];
    this.params = {
      companyName: '',
      borrowApplyId: ''
    };
    this.path = this.router.url.split(';')[0];
  }

  subscribeRouteParams() {
    this.actRoute.params.subscribe((params: Params)=> {
      let tabIndex = params['tab'] ? parseInt(params['tab']) : 0;
      let page = params['page'] ? parseInt(params['page']) : 0;
      let rows = params['rows'] ? parseInt(params['rows']) : this.paginator.size;
      let companyName = params['companyName'] ? params['companyName'] : '';
      let borrowApplyId = params['borrowApplyId'] ? params['borrowApplyId'] : '';
      this.params.companyName = companyName;
      this.params.borrowApplyId = borrowApplyId;
      this.paginator.index = page;
      this.paginator.size = rows;
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
  changeTab(tabIndex) {
    for (let o of this.tabs) {
      o.active = false;
    }
    this.tabs[tabIndex].active = true;
  }

  private getStatus(): string {
    for (let o of this.tabs) {
      if (o.active) {
        let status = o.status;
        if (typeof status === 'number') {
          return status + '';
        } else if (status instanceof Array) {
          return status.join(',');
        }
      }
    }
    return null;
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
      limitDay: this.tabs[1].active ? this.limitDay : null,
      companyName: this.params.companyName || null,
      borrowApplyId: this.params.borrowApplyId || null,
      page: this.paginator.index + 1,
      rows: this.paginator.size
    };
    this.loading = true;
    this.inProcessSvc.queryLoans(query)
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

  openRepaymentPlanModal(borrowApplyId:string) {
    this.modalRepaymentPlan.loading=true;
    this.inProcessSvc.getRepayPlanList(borrowApplyId)
      .then((res)=>{
        this.modalRepaymentPlan.data=res;
        this.modalRepaymentPlan.loading=false;
      });
    this.modalRepaymentPlan.visible = true;
  }

  closeRepaymentPlanModal() {
    this.modalRepaymentPlan.visible = false;
  }


  navigate() {
    let tab = 0;
    for (let i = 0, len = this.tabs.length; i < len; i++) {
      if (this.tabs[i].active) {
        tab = i;
        break;
      }
    }
    let params: {
      tab: number,
      page: number,
      rows: number,
      companyName?: string,
      borrowApplyId?: string,
    } = {
      tab: tab,
      page: this.paginator.index,
      rows: this.paginator.size,
    };
    if (this.params.companyName !== '') {
      params.companyName = this.params.companyName;
    }
    if (this.params.borrowApplyId !== '') {
      params.borrowApplyId = this.params.borrowApplyId;
    }
    this.router.navigate([this.path, params]);
  }
}
