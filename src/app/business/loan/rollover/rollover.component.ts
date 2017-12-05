import {Component} from '@angular/core';
import {ActivatedRoute,Params,Router } from '@angular/router';
import {Rollover} from '../../../../services/entity/Rollover.entity';
import {Paginator} from '../../../../services/entity/Paginator.entity';
import {RolloverService} from './rollover.service';
import {OauthService} from '../../../../services/oauth/oauth.service';
import {DictionaryService,Dictionary} from '../../../../services/dictionary/dictionary.service';
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
  statusOptions:Dictionary[];
  params:{
    status:string,
    companyName:string
  };
  path:string='';
  constructor(
    private rolloverSvc: RolloverService,
    private dictSvc: DictionaryService,
    private actRoute:ActivatedRoute,
    public oauth:OauthService,
    private router:Router
  ) {
    this.init();
    this.subscribeRouteParams();
    this.loadRolloverStatuses();
  }

  /**
   * 初始化
   */
  init() {
    this.tableData = [];
    this.paginator = new Paginator();
    this.loading = false;
    this.params={
      status:'',
      companyName:''
    };
    {//初始化状态下拉选项
      this.statusOptions = [new Dictionary()];
      this.statusOptions[0].value ='';
      this.statusOptions[0].label ='全部';
    }
    this.path=this.router.url.split(';')[0];
  }

  subscribeRouteParams(){
    this.actRoute.params.subscribe((params:Params)=>{
      let page=params['page']?parseInt(params['page']):0;
      let rows=params['rows']?parseInt(params['rows']):this.paginator.size;
      let status=params['status']?params['status']:'';
      let companyName=params['companyName']?params['companyName']:'';
      let applyId=params['applyId']?params['applyId']:'';
      this.params.status=status;
      this.params.companyName=companyName;
      this.paginator.index=page;
      this.paginator.size=rows;
      this.query();
    });
  }

  loadRolloverStatuses(){
    this.dictSvc.load('rollover_status')
      .then((res)=>{
        if(res instanceof Array){
          this.statusOptions=this.statusOptions.concat(res)
        }
      })
  }
  /**
   * 查询
   */
  query() {
    if (this.loading) {
      return;
    }
    let query = {
      status: this.params.status,
      companyName: this.params.companyName,
      page: this.paginator.index + 1,
      row: this.paginator.size
    };
    this.loading = true;
    this.rolloverSvc.queryRollovers(query)
      .then((res)=> {
        this.loading = false;
        this.paginator.count = res.count;
        this.tableData = res.items;
      });
  }

  search() {
    this.paginator.reset();
    this.tableData = [];
    this.navigate();
    this.query();
  }

  navigate(){
    let params:{
      status?:string|number,
      companyName?:string,
      page:number,
      rows:number
    }={
      page:this.paginator.index,
      rows:this.paginator.size,
    };
    if(this.params.status){
      params.status=this.params.status;
    }
    if(this.params.companyName){
      params.companyName=this.params.companyName;
    }

    this.router.navigate([this.path,params]);
  }

}
