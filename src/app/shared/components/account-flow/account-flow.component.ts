import {Component, ViewChild, Input, OnInit,Output,EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {AccountFlowService} from './account-flow.service';
import {CommonService} from '../../../core/services/common/common.service';
import {fadeInAnimation} from 'app/shared/animations/index';
import {Paginator} from '../../../core/entity/Paginator.entity';
import {BankAccountFlow} from '../../../core/entity/BankAccountFlow.entity';
import {BankAccount} from '../../../core/entity/BankAccount.entity';
import {BankAccountFlowBody} from '../../../core/services/common/common.service';
import {AccountFlowData} from './shared/accountFlowData';
import {DatePipe} from 'dolphinng';

import {ModalComponent} from 'dolphinng';
@Component({
  selector: 'account-flow',
  templateUrl: './account-flow.component.html',
  styleUrls: ['./account-flow.component.less'],
  providers: [AccountFlowService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class AccountFlowComponent implements OnInit,OnChanges {

  @Input() mode: number = 0;//0 默认  弹出框
  loading: boolean = false;//是否在加载
  paginator: Paginator = new Paginator();
  data: AccountFlowData[] = [];

  duration:string='0';//0一星期  1一个月
  bankAccount: BankAccount = new BankAccount();
  @Input() memberId: string;//会员ID
  @Input() accountId: string;//三级账户ID,不传查询该会员所有
  @Input() beginDate: string;//格式：yyyy-MM-dd
  @Input() endDate: string;//格式：yyyy-MM-dd
  @Input() flowStatus: string;//交易状态：0：全部1:提交成功(未明)；2:交易成功;-2:交易失败
  @Input() tradeType: string;//交易类型0：全部 1：出账；2：入账； 3：冲正5：锁定金额；6：解锁金额9：冻结金额；10：解冻金额11：手续费； 12：代收手续费
  @Input() rows: number;//
  @Input() page: number;//
  @Input() selectedItems: BankAccountFlow[];

  @Output() outputSelections:EventEmitter<any>=new EventEmitter();

  @ViewChild('contentModal') contentModal: ModalComponent;
  tableReady:boolean=false;
  constructor(private accountFlowSvc: AccountFlowService,
              private commonSvc: CommonService,) {
  }

  ngOnInit() {
    this.init();

  }

  ngOnChanges(changes: SimpleChanges) {

  }

  init() {
    this.beginDate='';
    this.endDate='';
    this.flowStatus='0';
    this.tradeType='0';
    this.page=this.paginator.index;
    this.rows=this.paginator.size;
    this.selectedItems=[];
  }

  open(options?: {
    memberId?: string,
    accountId?: string,
    beginDate?: string,
    endDate?: string,
    flowStatus?: string,
    tradeType?: string,
    rows?: number,
    page?: number,
    selectedItems?: BankAccountFlow[],
  }) {
    this.init();
    if (options && typeof options === 'object') {
      options.memberId && (this.memberId = options.memberId);
      options.accountId && (this.accountId = options.accountId);
      options.beginDate && (this.beginDate = options.beginDate);
      options.endDate && (this.endDate = options.endDate);
      options.flowStatus && (this.flowStatus = options.flowStatus);
      options.tradeType && (this.tradeType = options.tradeType);
      options.rows && (this.rows = options.rows);
      options.page && (this.page = options.page);
      this.paginator.index = this.page;
      this.paginator.size = this.rows;
      (options.selectedItems instanceof Array) && (this.selectedItems = this.cloneBankAccountFlows(options.selectedItems));
    }
    this.contentModal.open();
    setTimeout(()=>{
      this.tableReady=true;
    },0);

    if (this.memberId && !options.accountId) {
      this.getAccountInfo()
        .then((data)=>{
          if(data.accountId){
            this.query();
          }
        });
    }
  }

  createTimeByDuration(duration:string):{startTime:string,endTime:string}{
    let res={
      startTime:'',
      endTime:''
    };
    let time=new Date();
    let datePipe=new DatePipe();
    res.endTime=datePipe.transform(time,'yyyy-MM-dd hh:mm:ss');
    if(duration=='0'){
      time.setDate(time.getDate()-7);
      res.startTime=datePipe.transform(time,'yyyy-MM-dd hh:mm:ss');
    }else if(duration=='1'){
      time.setMonth(time.getMonth()-1);
      res.startTime=datePipe.transform(time,'yyyy-MM-dd hh:mm:ss');
    }
    return res;
  }

  query() {
    this.loading = true;
    let times=this.createTimeByDuration(this.duration);
    let body: BankAccountFlowBody = {
      beginDate: times.startTime,//开始时间 格式：yyyy-MM-dd
      endDate: times.endTime,//结束时间 格式：yyyy-MM-dd
      flowStatus: this.flowStatus,//交易状态：0：全部1:提交成功(未明)；2:交易成功;-2:交易失败
      tradeType: this.tradeType,//交易类型0：全部 1：出账；2：入账； 3：冲正5：锁定金额；6：解锁金额9：冻结金额；10：解冻金额11：手续费； 12：代收手续费
      page: this.paginator.index + 1,//页码
      rows: this.paginator.size,//每页大小
      memberId: this.memberId,//会员Id
    };
    if (this.accountId) {
      body.accountId = this.accountId;
    }
    this.commonSvc.bankAccountFlow(body)
      .then((res)=> {
        this.loading = false;
        this.paginator.count = res.count;
        this.data = this.initData(res.items);

        //dev
/*        let data=[];
        for(let i=0;i<10;i++){
          let o =new BankAccountFlow();
          o.flowId='2017'+this.paginator.index+i;
          o.dealTime='2017-11-27 00:00:00';
          o.amount=1000;
          o.oppoAcctName='运金所';
          o.oppoAcctNo='0000000000000000000000000';
          o.availableBalance=20000;
          o.tradeType=i;
          data.push(o);
        }
        this.paginator.count=100;
        this.data = this.initData(data);*/
        //dev end

        this.select(this.selectedItems);
      })
      .catch((err)=> {
        this.loading = false;
      })
  }

  initData(items: BankAccountFlow[]): AccountFlowData[] {
    let data: AccountFlowData[] = [];
    for (let o of items) {
      data.push({
        selected: false,
        bankAccountFlow:o
      });
    }
    return data;
  }

  getAccountInfo():Promise<BankAccount>{
    return this.accountFlowSvc.accountInfo(this.memberId)
      .then((res)=> {
        this.bankAccount = res;

        //dev
/*        let o=new BankAccount();
        o.accountId='1111111111111';
        o.accountName='wqy';
        o.bankAccount='0000000000000000001';
        o.availableBalance=1000000;
        this.bankAccount=o;*/
        //dev end

        return Promise.resolve(this.bankAccount);
      })
      .catch((err)=> {

      });
  }

  select(items: BankAccountFlow[]) {
    for (let o of this.data) {
      loop:
        for (let item of items) {
          if (item.flowId == o.bankAccountFlow.flowId) {
            o.selected = true;
            break loop;
          }
        }
    }
  }


  tradeTypeName(type:string|number):string{
    let tradeTypeNames=[
      '',//0
      '出账',//1
      '入账',//2
      '冲正',//3
      '',//4
      '锁定金额',//5
      '解锁金额',//6
      '',//7
      '',//8
      '冻结金额',//9
      '解冻金额',//10
      '手续费',//11
      '代收手续费'//12
    ];
    return tradeTypeNames[type];
  }

  setSelectedItems(selectedOrCancel:boolean,bankAccountFlow:BankAccountFlow){
    if(selectedOrCancel) {
      let isExist = false;
      for (let o of this.selectedItems) {
        if (o.flowId == bankAccountFlow.flowId) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        bankAccountFlow.tradeTypeName=this.tradeTypeName(bankAccountFlow.tradeType);
        this.selectedItems.push(bankAccountFlow);
      }
    }else{
      for (let i=0,len=this.selectedItems.length;i<len;i++) {
        if (this.selectedItems[i].flowId==bankAccountFlow.flowId) {
          this.selectedItems.splice(i,1);
          break;
        }
      }
    }
  }

  cloneBankAccountFlows(data:BankAccountFlow[]):BankAccountFlow[]{
    let result:BankAccountFlow[]=[];
    for(let o of data){
      let baf=new BankAccountFlow().init(o);
      result.push(baf);
    }
    return result;
  }

  sure(){
    this.outputSelections.emit(this.selectedItems);
    this.contentModal.close();
  }

}
