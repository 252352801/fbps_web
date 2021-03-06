import {Component} from '@angular/core';
import {Loan} from '../../core/entity/Loan.entity';
import {Paginator} from '../../core/entity/Paginator.entity';
import {BusinessService} from '../business.service';
import {HistoryService} from './history.service';
import {ActivatedRoute,Params,Router} from '@angular/router';
import {QueryLoansBody} from '../shared/QueryLoansBody';
@Component({
  selector: 'loan-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.less'],
  providers: [HistoryService]
})
export class HistoryComponent {
  loading: boolean;//是否正在加载
  tableData: Loan[];//表格数据
  paginator: Paginator;
  statusOptions:{
    name:string,
    value:string
  }[];
  params:QueryLoansBody;// 搜索参数
  path:string='';
  constructor(
    private businessSvc: BusinessService,
    private historySvc: HistoryService,
    private actRoute:ActivatedRoute,
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
    this.statusOptions=[{
      name: '全部',
      value:'-2,-3,-6,-7,10'
    }, {
      name: '审批不通过',
      value: '-2,-3'
    }, {
      name: '放弃确认合同',
      value: '-6'
    }, {
      name: '取消',
      value: '-7'
    },{
      name: '已结清',
      value: '10'
    }];
    this.params = {
      companyName: '',
      borrowApplyId: '',
      beginTime: '',
      endTime: '',
      status:this.statusOptions[0].value,
    };
    this.path=this.router.url.split(';')[0];
  }

  subscribeRouteParams(){
    this.actRoute.params.subscribe((params:Params)=>{
      let status=params['status']?params['status']:this.statusOptions[0].value;
      let page=params['page']?parseInt(params['page']):0;
      let rows=params['rows']?parseInt(params['rows']):this.paginator.size;
      let companyName=params['companyName']?params['companyName']:'';
      let borrowApplyId=params['borrowApplyId']?params['borrowApplyId']:'';
      let beginTime=params['beginTime']?params['beginTime']:'';
      let endTime=params['endTime']?params['endTime']:'';
      this.params.companyName=companyName;
      this.params.borrowApplyId=borrowApplyId;
      this.params.beginTime=beginTime;
      this.params.endTime=endTime;
      this.params.status=status;
      this.paginator.index=page;
      this.paginator.size=rows;
      if(!!(params['page']||params['rows']||params['companyName']||params['borrowApplyId']
          ||params['beginTime']||params['endTime']||params['status'])){
        this.query();
      }
    });
  }
  /**
   * 重置参数
   */
  resetParams() {
    this.params.borrowApplyId = '';
    this.params.companyName = '';
    this.params.beginTime = '';
    this.params.endTime = '';
    this.params.status = this.statusOptions[0].value;
  }



  /**
   * 查询
   */
  query() {
    if (this.loading) {
      return;
    }
    let query:QueryLoansBody = {
      status: this.params.status,
      page: this.paginator.index + 1,
      rows: this.paginator.size
    };
    if(this.params.companyName){
      query.companyName=this.params.companyName;
    }
    if(this.params.borrowApplyId){
      query.borrowApplyId=this.params.borrowApplyId;
    }
    if(this.params.beginTime){
      query.beginTime=this.params.beginTime;
    }
    if(this.params.endTime){
      query.endTime=this.params.endTime;
    }
    this.loading = true;
    this.businessSvc.queryLoans(query)
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
    let params:QueryLoansBody={
      page:this.paginator.index,
      rows:this.paginator.size,
      status:this.params.status
    };
    if(this.params.companyName!==''){
      params.companyName=this.params.companyName;
    }
    if(this.params.borrowApplyId!==''){
      params.borrowApplyId=this.params.borrowApplyId;
    }
    if(this.params.beginTime!==''){
      params.beginTime=this.params.beginTime;
    }
    if(this.params.endTime!==''){
      params.endTime=this.params.endTime;
    }
    this.router.navigate([this.path,params]);
  }
}
