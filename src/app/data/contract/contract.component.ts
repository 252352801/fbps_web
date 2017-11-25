import {Component} from '@angular/core';
import {Contract} from '../../../services/entity/Contract.entity';
import {Paginator} from '../../../services/entity/Paginator.entity';
import {ContractService,QueryContractBody} from './contract.service';
import {ActivatedRoute,Params,Router} from '@angular/router';
import {fadeInAnimation} from '../../../animations/index';
import {api_file} from '../../../services/config/app.config';
import {SharedService} from '../../shared/shared.service';
import {Resource} from '../../../services/entity/Resource.entity';
import {DatePipe} from 'dolphinng';
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
  downloadFileAddr:string=api_file.download;
  paginator: Paginator = new Paginator;
  path:string='';

  capitals:Resource[]=[];
  statusOptions:{
    name:string,
    value:string
  }[];

  currentTime:string|Date=new Date();
  constructor(
    private contractSvc:ContractService,
    private actRoute:ActivatedRoute,
    private sharedSvc:SharedService,
    private router:Router
  ) {
    this.path=this.router.url.split(';')[0];
    this.init();
    this.subscribeRouteParams();
  }

  init(){
    this.statusOptions=[{
      name: '全部',
      value:''
    }, {
      name: '未签署',
      value: '0'
    },{
      name: '签署完成',
      value: '1'
    }, {
      name: '无需签署',
      value: '2'
    }, {
      name: '签署中止',
      value: '3'
    }];
    this.params={
      docNum:'',
      companyName: '',
      borrowApplyId: '',
      beginTime: '',
      endTime: '',
      status: '',
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
      let status=params['status']?params['status']:this.statusOptions[0].value;
      let page = params['page'] ? parseInt(params['page']) : 0;
      let rows = params['rows'] ? parseInt(params['rows']) : this.paginator.size;
      let docNum = params['docNum'] ? params['docNum'] : '';
      let companyName = params['companyName'] ? params['companyName'] : '';
      let borrowApplyId = params['borrowApplyId'] ? params['borrowApplyId'] : '';
      let beginTime=params['beginTime']?params['beginTime']:'';
      let endTime=params['endTime']?params['endTime']:'';
      this.params.docNum = docNum;
      this.params.companyName = companyName;
      this.params.borrowApplyId = borrowApplyId;
      this.params.beginTime=beginTime;
      this.params.endTime=endTime;
      this.params.status=status;
      this.paginator.index = page;
      this.paginator.size = rows;
      //this.query();
      if(!!(params['page']||params['rows']||params['companyName']||params['borrowApplyId']
        ||params['beginTime']||params['endTime']||params['status']||params['docNum'])){
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
    this.params.docNum='';
    this.params.companyName='';
    this.params.borrowApplyId='';
    this.params.beginTime='';
    this.params.endTime='';
    this.params.status='';
  }
  query() {
    let body :QueryContractBody= {
      page: this.paginator.index + 1,
      rows: this.paginator.size
    };
    if(this.params.docNum){
      body.docNum=this.params.docNum;
    }
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
    if(this.params.status){
      body.status=this.params.status;
    }
    this.loading=true;
    this.contractSvc.query(body)
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
    if(this.params.docNum!==''){
      params.docNum=this.params.docNum;
    }
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
    if(this.params.status!==''){
      params.status=this.params.status;
    }
    this.router.navigate([this.path,params]);

  }

  createDatetime(datetimeStr:string):number{
    return new Date(datetimeStr).getTime();
  }
}
