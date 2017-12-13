import {Component} from '@angular/core';
import {Contract} from '../../../services/entity/Contract.entity';
import {Paginator} from '../../../services/entity/Paginator.entity';
import {ContractService} from './contract.service';
import {ActivatedRoute,Params,Router} from '@angular/router';
import {fadeInAnimation} from '../../../animations/index';
import {SharedService} from '../../shared/shared.service';
import {QueryContractBody} from '../../shared/shared.interfaces';
import {Resource} from '../../../services/entity/Resource.entity';
import {DatePipe} from 'dolphinng';
import {Dictionary,DictionaryService} from '../../../services/dictionary/dictionary.service';
@Component({
  selector: 'contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.less'],
  providers: [ContractService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class ContractComponent {
  tableData: Contract[];
  loading: boolean = false;
  params:QueryContractBody;
  paginator: Paginator = new Paginator;
  path:string='';
  capitals:Resource[]=[];
  statusOptions:Dictionary[];

  currentTime:string|Date=new Date();
  constructor(
    private contractSvc:ContractService,
    private actRoute:ActivatedRoute,
    private dictionarySvc:DictionaryService,
    private sharedSvc:SharedService,
    private router:Router
  ) {
    this.path=this.router.url.split(';')[0];
    this.init();
    this.subscribeRouteParams();
  }

  init(){
    {
      this.statusOptions=[new Dictionary()];
      this.statusOptions[0].label='全部';
      this.statusOptions[0].value='';
      this.dictionarySvc.load('contract_status')
        .then((res)=>{
          if(res instanceof Array){
            this.statusOptions=this.statusOptions.concat(res);
          }
        })
        .catch((err)=>{});
    }
    this.params={
      companyName:'',
      borrowApplyId:'',
      beginTime:'',
      endTime:'',
      eSignatureStatus:''//合同状态（空或者-1表示全部）
    };

    this.sharedSvc.getCapitals()
      .then((res)=>{
        this.capitals=res;
      });


    let datePipe=new DatePipe();
    this.currentTime=datePipe.transform(new Date().toString(),'yyyy-MM-dd hh:mm:ss');
  }


  subscribeRouteParams() {
    this.actRoute.params.subscribe((params: Params)=> {
      let eSignatureStatus=params['eSignatureStatus']?params['eSignatureStatus']:this.statusOptions[0].value;
      let page = params['page'] ? parseInt(params['page']) : 0;
      let rows = params['rows'] ? parseInt(params['rows']) : this.paginator.size;
      let companyName = params['companyName'] ? params['companyName'] : '';
      let borrowApplyId = params['borrowApplyId'] ? params['borrowApplyId'] : '';
      let beginTime=params['beginTime']?params['beginTime']:'';
      let endTime=params['endTime']?params['endTime']:'';
      this.params.companyName = companyName;
      this.params.borrowApplyId = borrowApplyId;
      this.params.beginTime=beginTime;
      this.params.endTime=endTime;
      this.params.eSignatureStatus=status;
      this.paginator.index = page;
      this.paginator.size = rows;
      //this.query();
      if(!!(params['page']||params['rows']||params['companyName']||params['borrowApplyId']
        ||params['beginTime']||params['endTime']||params['eSignatureStatus'])){
        //是否有路由搜索参数
        this.query();
      }
    });
  }

  matchCapitalName(capitalId:string):string{

    if(this.capitals instanceof Array){
      for(let o of this.capitals){
        if(capitalId===o.resourceId){
          return o.resourceName;
        }
      }
    }
    return '';
  }

  resetParams(){
    this.params.companyName='';
    this.params.borrowApplyId='';
    this.params.beginTime='';
    this.params.endTime='';
    this.params.eSignatureStatus='';
  }
  query() {
    if(this.loading){
      return;
    }
    let body :QueryContractBody= {
      page: this.paginator.index + 1,
      rows: this.paginator.size
    };
    if(this.params.companyName){
      body.companyName=this.params.companyName;
    }
    if(this.params.borrowApplyId){
      body.borrowApplyId=this.params.borrowApplyId;
    }
    if(this.params.beginTime){
      body.beginTime=this.params.beginTime;
    }
    if(this.params.endTime){
      body.endTime=this.params.endTime;
    }
    if(this.params.eSignatureStatus){
      body.eSignatureStatus=this.params.eSignatureStatus;
    }
    this.loading=true;
    this.sharedSvc.queryContracts(body)
      .then((data)=>{
        this.tableData=data.items;
        this.paginator.count=data.count;
        this.loading=false;
      })
      .catch((err)=>{
        this.loading=false;
      })

  }
  search() {
    this.paginator.reset();
    this.tableData=[];
    this.query();
  }
  navigate(){
    let params:QueryContractBody={
      page:this.paginator.index,
      rows:this.paginator.size,
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
    if(this.params.eSignatureStatus!==''){
      params.eSignatureStatus=this.params.eSignatureStatus;
    }
    this.router.navigate([this.path,params]);

  }

  createDatetime(datetimeStr:string):number{
    return new Date(datetimeStr).getTime();
  }
}
