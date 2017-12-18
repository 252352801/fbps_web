import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Paginator} from '../../../core/entity/Paginator.entity';
import {SystemLog} from '../../../core/entity/SystemLog.entity';
import {SystemLogsService, SystemLogSearchParams} from './system-logs.service';
import {DictionaryService,Dictionary} from '../../../core/services/dictionary/dictionary.service';
@Component({
  selector: 'system-logs',
  templateUrl: './system-logs.component.html',
  styleUrls: ['./system-logs.component.less'],
  providers: [SystemLogsService]
})
export class SystemLogsComponent implements OnInit {

  data: SystemLog[] = [];
  paginator: Paginator = new Paginator();
  loading: boolean = false;
  @Input() mode: number = 0;//显示模式  0:普通页面 1:modal
  @Input() isShowSearchBox:boolean=false;//是否显示搜索框
  @Input() title:string='系统日志';
  @Input() isShowType:boolean=true;//是否显示类型
  @Input() isShowId:boolean=true;//是否显示ID
  modalVisible: boolean = false;
  params = {
    type: '',
    id: ''
  };

  typeOptions:Dictionary[]=[];

  constructor(
    private sysLogSvc: SystemLogsService,
    private dictionarySvc: DictionaryService
  ) {
    this.dictionarySvc.load('log_type')
    .then((res)=>{
      let dic=new Dictionary();
      dic.label='全部';
      dic.value='';
      this.typeOptions=[dic].concat(res);
    });
  }

  ngOnInit() {
    if(this.mode===0){
      this.search();
    }
  }

  resetParams() {
    this.params.type = '';
    this.params.id = '';
  }

  open(...args) {
    if (this.mode === 1) {
      if (args.length > 0) {
        for (let i in args) {
          if (typeof args[i] === 'string') {
            this.params.id = args[i];
          } else if (typeof args[i] === 'number') {
            this.params.type = args[i];
          }
        }
      }
      let body: SystemLogSearchParams = {
        page: this.paginator.index + 1,
        rows: this.paginator.size,
      };
      body.id =this.params.id;
      body.type=this.params.type;
      this.query(body);
      this.modalVisible = true;
    }
  }
  close(){
    this.modalVisible=false;
  }

  createBody():SystemLogSearchParams{
    let body:SystemLogSearchParams={
      page:this.paginator.index+1,
      rows:this.paginator.size
    };
    if(this.params.type!==''){
      body.type=this.params.type;
    }
    if(this.params.id!==''){
      body.id=this.params.id;
    }
    return body;
  }

  search(){
    this.paginator.reset();
    this.query();
  }
  query(body?: SystemLogSearchParams) {
    this.loading = true;
    let searchBody=body||this.createBody();
    this.sysLogSvc.query(searchBody)
      .then((res)=>{
        this.loading = false;
        this.paginator.count=res.count;
        this.data=res.items;
      }).catch((err)=>{
    })
  }
}
