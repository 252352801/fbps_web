import {Component,ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Loan} from '../../../services/entity/Loan.entity';
import {OauthService} from '../../../services/oauth/oauth.service';
import {Paginator} from '../../../services/entity/Paginator.entity';
import {BorrowService} from './borrow.service';
import {fadeInAnimation} from '../../../animations/index';
import {PopService,ModalComponent} from 'dolphinng';
@Component({
  selector: 'borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.less'],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class BorrowComponent {
  status: number;//状态
  loading: boolean;//是否正在加载
  tableData: Loan[];//表格数据
  paginator: Paginator;
  tabs: {//
    tabName: string,
    status: number|number[],
    active: boolean
  }[];
  params: {//搜索参数
    companyName: string,
    borrowApplyId: string
  };

  modalCancel:{
    visible:boolean,
    submitted:boolean,
    borrowApplyId:string,
    operator:string,
    remarks:string
  };

  path: string = '';

  @ViewChild('cancelModal') cancelModal:ModalComponent;
  constructor(private borrowSvc: BorrowService,
              private router: Router,
              public oauth: OauthService,
              private pop: PopService,
              private actRoute: ActivatedRoute) {
    this.init();
    this.subscribeRouteParams();
  }

  /**
   * 初始化
   */
  init() {
    this.status = 201;
    this.tableData = [];
    this.paginator = new Paginator();
    this.loading = false;
    this.tabs = [{
      tabName: '新申请',
      status: 201,
      active: false
    }, {
      tabName: '受理中',
      status: [203,204],
      active: false
    }, {
      tabName: '待放款',
      status: 205,
      active: false
    }];
    this.params = {
      companyName: '',
      borrowApplyId: ''
    };
    this.path = this.router.url.split(';')[0];
    this.modalCancel={
      visible:false,
      submitted:false,
      borrowApplyId:'',
      operator:'',
      remarks:'',
    };
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


  getStatus(): string {
    for (let o of this.tabs) {
      if (o.active) {
        return o.status.toString();
      }
    }
  }

  /**
   * 重置参数
   */
  resetParams() {
    this.params.borrowApplyId = '';
    this.params.companyName = '';
  }

  /**
   * tab/状态切换
   * @param status
   */
  changeTab(tabIndex: number) {
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
    let query = {
      status: this.getStatus(),
      companyName: this.params.companyName || null,
      borrowApplyId: this.params.borrowApplyId || null,
      page: this.paginator.index + 1,
      rows: this.paginator.size
    };
    this.loading = true;
    this.borrowSvc.queryLoans(query)
      .then((res)=> {
        this.loading = false;
        this.paginator.count = res.count;
        this.tableData = res.items;
      })
      .catch((err)=> {
      });
  }

  search() {
    this.paginator.reset();
    this.tableData = [];
    this.query();
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

  openCancelModal(loan:Loan){
    this.modalCancel.borrowApplyId=loan.borrowApplyId;
    this.modalCancel.operator=this.oauth.user.employeeName||this.oauth.user.mobile;
    this.modalCancel.remarks='';
    this.modalCancel.submitted=false;
    this.modalCancel.visible=true;
  }

  cancel(){
    let body={
      borrowApplyId:this.modalCancel.borrowApplyId,
      operator:this.modalCancel.operator,//操作者
      remarks:this.modalCancel.remarks//备注
    };
    this.modalCancel.submitted=true;
    this.borrowSvc.cancelLoan(body)
      .then((res)=>{
        this.modalCancel.submitted=false;
        this.modalCancel.visible=false;
        if(res.status){
          this.pop.info({
            text:'取消成功！'
          });
          this.query();
        }else{
          this.pop.error({
            text:res.message||'取消失败！'
          });
        }
      })
      .catch((err)=>{
        this.modalCancel.submitted=false;
        this.modalCancel.visible=false;
        this.pop.error({
          text:'请求失败！'
        });
      })
  }
}
