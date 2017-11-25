import {Component, Injectable,OnDestroy,OnInit} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {Rollover} from '../../../services/entity/Rollover.entity';
import {Loan} from '../../../services/entity/Loan.entity';
import {RepaymentNotify} from '../../../services/entity/RepaymentNotify.entity';
import {Paginator} from '../../../services/entity/Paginator.entity';
import {PendingService} from './pending.service';
import { fadeInAnimation } from '../../../animations/index';
import {ParameterService} from 'services/parameter/parameter.service'
import {OauthService} from '../../../services/oauth/oauth.service'
@Component({
  selector: 'pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.less'],
  providers: [PendingService],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': 'pending' }

})
@Injectable()
export class PendingComponent implements OnInit,OnDestroy{
  test:number=10000;
  replace(val:any):any{
    return (val+'').replace(/,/g,'');
  }
  tabIndex: number = 0;//tab  0-贷款申请 1-还款通知  2-展期申请
  private path:string;
  notifyData = {
    overdue: {
      text: '逾期未还',
      count: 0,
      link: ''
    },
    willExpire: {
      text: '即将到期',
      count: 0,
      link: ''
    },
    loanConfirmResponse: {
      text: '待放款',
      count: 0,
      link: ''
    },
    rolloverReviewResponse: {
      text: '展期二审回复',
      count: 0,
      link: ''
    }
  };
  tableData: [//tabe数据
    {//贷款申请
      records: Loan[],
      paginator: Paginator,
      loading: boolean
    },
    {//还款通知
      records: RepaymentNotify[],
      paginator: Paginator,
      loading: boolean
    },
    {//展期申请
      records: Rollover[],
      paginator: Paginator,
      loading: boolean
    }
  ];

  constructor(
    private pendingSvc: PendingService,
    public oauth: OauthService,
    private router: Router,
    private actRoute:ActivatedRoute,
    private paramSvc:ParameterService
  ) {
  }
  ngOnInit(){
    this.init();
    this.changeTab(0);
    this.queryNotifyData();
    this.subscribeRouteParams();
  }
  ngOnDestroy(){
    //this.actRoute.params['status']=1;
  }

  init() {
    this.tableData = [
      {
        records: [],
        paginator: new Paginator(),
        loading: false
      },
     {
        records: [],
        paginator: new Paginator(),
        loading: false
      },
      {
        records: [],
        paginator: new Paginator(),
        loading: false
      }
    ];
    this.path=this.router.url.split(';')[0];

    this.queryLoans();
    this.queryRepaymentNotifies();
    this.queryRollovers();
  }

  subscribeRouteParams(){
    this.actRoute.params.subscribe((params:Params)=>{
      let tabIndex=params['tab']?parseInt(params['tab']):0;
      let page=params['page']?parseInt(params['page']):0;
      let rows=params['rows']?parseInt(params['rows']):this.tableData[tabIndex].paginator.size;
      this. initPage(tabIndex,page,rows);
    });
  }
  initPage(tabIndex:number,page:number,rows:number){
    this.tabIndex=tabIndex;
    switch (this.tabIndex) {
      case 0:
        this.tableData[0].paginator.index=page;
        this.tableData[0].paginator.size=rows;
        this.queryLoans();
        break;
      case 1:
        this.tableData[1].paginator.index=page;
        this.tableData[1].paginator.size=rows;
        this.queryRepaymentNotifies();
        break;
      case 2:
        this.tableData[2].paginator.index=page;
        this.tableData[2].paginator.size=rows;
        this.queryRollovers();
        break;
    }
  }

  /**
   * tab切换
   * @param index
   */
  changeTab(index: number) {
    (index !== this.tabIndex) && (this.tabIndex = index);
    //this.tableData[this.tabIndex].paginator.reset();
  }

  queryNotifyData() {
    this.pendingSvc.queryLoans({//查询逾期通知
      rows: 1,
      page: 1,
      status: 401
    }) .then((data)=> {
      this.notifyData.overdue.count = data.count;
    });
    this.pendingSvc.queryLoans({//查询即将到期通知
      rows: 1,
      page: 1,
      status: 207,
      limitDay: 7,
    }) .then((data)=> {
      this.notifyData.willExpire.count = data.count;
    });
    this.pendingSvc.queryLoans({//查询已确认合同通知
      rows: 1,
      page: 1,
      status: 205
    }) .then((data)=> {
      this.notifyData.loanConfirmResponse.count = data.count;
    });
    this.pendingSvc.queryRollovers({
      status: 205,
      page: 1,
      rows: 1
    })
      .then((data)=> {
        this.notifyData.rolloverReviewResponse.count = data.count;
      });
  }


  /**
   * 查询贷款申请列表
   */
  queryLoans() {
    this.tableData[0].loading = true;
    this.pendingSvc.queryLoans({
      status: 201,
      page: this.tableData[0].paginator.index + 1,
      rows: this.tableData[0].paginator.size
    })
      .then((data)=> {
        this.tableData[0].loading = false;
        this.tableData[0].records = data.items;
        this.tableData[0].paginator.count = data.count;
      });
  }

  /**
   * 查询还款列表
   */
  queryRepaymentNotifies() {
    this.tableData[1].loading = true;
    this.pendingSvc.queryRepaymentNotifies({
      status:0,
      page: this.tableData[1].paginator.index + 1,
      rows: this.tableData[1].paginator.size
    }).then((data)=> {
      this.tableData[1].loading = false;
      this.tableData[1].records = data.items;
      this.tableData[1].paginator.count = data.count;
    });
  }

  /**
   * 查询展期申请列表
   */
  queryRollovers() {
    this.tableData[2].loading = false;
    this.pendingSvc.queryRollovers({
      status: 201,
      page: this.tableData[2].paginator.index + 1,
      rows: this.tableData[2].paginator.size
    })
      .then((data)=> {
        this.tableData[2].loading = false;
        this.tableData[2].records = data.items;
        this.tableData[2].paginator.count = data.count;
      });
  }
  navigate() {
    let i=this.tabIndex;
    this.router.navigate([this.path,{tab:this.tabIndex,page:this.tableData[i].paginator.index,rows:this.tableData[i].paginator.size}]);
  }

  go(path:string,params:any){
    this.router.navigate([path,params]);
  }

  navigateWithData(path:string,data:any,commands:any[]){
    this.paramSvc.set(path,data);
    this.router.navigate(commands);
  }

}
