import { Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { PopService} from 'dolphinng';
import { ConfigService} from './config.service';
import { Rollover} from '../../../../core/entity/Rollover.entity';
import { Loan} from '../../../../core/entity/Loan.entity';
import { OauthService} from '../../../../core/services/oauth/oauth.service';
import {RolloverService} from '../rollover.service';
import { RepayPlan} from '../../../../core/entity/RepayPlan.entity';
import { Contract} from '../../../../core/entity/Contract.entity';
import {fadeInAnimation} from 'app/shared/animations/index';
import {BusinessService} from '../../../business.service';
import { CommonService} from '../../../../core/services/common/common.service';
@Component({
  selector: 'rollover-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.less'],
  providers:[PopService,ConfigService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class ConfigComponent implements OnInit{
  rollover:Rollover=new Rollover();//展期详情
  loan:Loan=new Loan();//贷款详情
  repayPlans:RepayPlan[]=[];//还款计划
  contracts:Contract[]=[];//合同
  modalConfirm={
    visible:false,
    data:null,
    submitted:false
  };
  auditOneBy:string=this.oauth.user.employeeName||this.oauth.user.mobile;
  opinion:string='';
  submitted:boolean=false;

  contractEditor = {
    borrowApplyId: '',
    associateId: '',
    visible: false
  };
  constructor(
    private pop:PopService,
    public commonSvc:CommonService,
    public businessSvc:BusinessService,
    public rolloverSvc:RolloverService,
    private configSvc:ConfigService,
    private actRoute:ActivatedRoute,
    private oauth:OauthService
  ){
  }

  ngOnInit(){
    let id=this.actRoute.snapshot.params['id'];
    this.rolloverSvc.getRolloverById(id)
      .then((res)=>{
        this.rollover=res;
        return this.businessSvc.getLoanById(res.borrowApplyId);
      })
      .then((res)=>{
        this.loan=res;
        return this.businessSvc.getRepayPlans(this.loan.borrowApplyId);
      })
      .then((res)=>{
        this.repayPlans=res;
      })
      .catch((err)=>{
      });
    this.loadContracts();
  }

  openConfirmModal(){
    this.modalConfirm.submitted=false;
    this.modalConfirm.visible=true;
  }
  closeConfirmModal(){
    this.modalConfirm.visible=false;
  }
  testData(){
    let valid=false;
    //校验
    if(this.opinion===''){
      this.pop.error({
        text:'请输入审批意见！'
      });
    }else{
      valid=true;
    }
    return valid;
  }
  successNavigate(){
    history.back();
  }
  submit(){
    if(this.contracts.length===0){
      this.pop.info({
        text:'请配置展期合同！'
      });
    }else{
      this.modalConfirm.submitted=true;
      let body={
        rolloverApplyId:this.rollover.rolloverApplyId,
        operator:this.auditOneBy,
      };
      this.configSvc.finishContract(body)
        .then((res)=>{
          if(res.ok){
            this.pop.info({
              text:'已成功配置合同！'
            }).onClose(()=>{
              this.successNavigate();
            }).onConfirm(()=>{
              this.successNavigate();
            });
          }else{
            this.pop.error({
              text:res.message
            });
          }
        })
        .catch(()=>{
          this.closeConfirmModal();
          this.pop.error({
            text:'请求失败，请重试！'
          })
        });
    }
  }

  openContractEditor() {
    this.contractEditor.associateId =(this.rollover&&this.rollover.rolloverApplyId)|| this.actRoute.snapshot.params['id'];//关联ID
    this.contractEditor.borrowApplyId = this.loan.borrowApplyId;
    this.contractEditor.visible = true;
  }

  /**
   * 加载合同
   */
  loadContracts(){
    this.commonSvc.queryContracts({
      rolloverApplyId:this.actRoute.snapshot.params['id'],
      page:1,
      rows:100000
    }).then((res)=>{
      this.contracts=res.items;
      //this.contractsPaginator.count=res.count;
    })
  }

  removeContract(id: string) {
    this.pop.confirm({
      text:'确定要删除这个合同？',
      showLoaderOnConfirm:true,
      closeOnConfirm:false
    }).onConfirm(()=>{
      this.configSvc.removeContract(id)
        .then((res)=>{
          if(res.ok) {
            this.pop.info({text: '删除成功！'});
            this.loadContracts();
          }else{
            this.pop.error({text: res.message||'删除失败！'});
          }
        })
        .catch((err)=>{
          this.pop.error({text: '请求失败！'});
        });
    })
  }

}
