import { Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { PopService} from 'dolphinng';
import { ConfigService} from './config.service';
import { Rollover} from '../../../../../services/entity/Rollover.entity';
import { Loan} from '../../../../../services/entity/Loan.entity';
import { OauthService} from '../../../../../services/oauth/oauth.service';
import {RolloverService} from '../rollover.service';
import { RepayPlan} from '../../../../../services/entity/RepayPlan.entity';
import { Contract} from '../../../../../services/entity/Contract.entity';
import {fadeInAnimation} from '../../../../../animations/index';
import {BusinessService} from '../../../business.service';
import { CommonService} from '../../../../../services/common/common.service';
import { SharedService} from '../../../../shared/shared.service';
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

  //firstReviewInfo:ReviewInfo=new ReviewInfo();//一审信息
  //secondRevi/ewInfo:ReviewInfo=new ReviewInfo();//二审信息

  constructor(
    private pop:PopService,
    public commonSvc:CommonService,
    public sharedSvc:SharedService,
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
    //this.getReviewInfo();
  }


  /**
   * 获取审核信息
   */
 /* getReviewInfo(){
    let applyId=this.actRoute.snapshot.params['id'];
    let body1={//一审
      type:2,
      id:applyId,
      status2:2
    };
    this.commonSvc.querySystemLog(body1)
      .then((res)=>{
        console.log(res);
        for(let o of res.items){
          if(o.status==body1.status2){
            this.firstReviewInfo.operator=o.createBy;
            this.firstReviewInfo.reviewTime=o.createTime;
            this.firstReviewInfo.opinion=o.remarks;
            break;
          }
        }
      })
      .catch((err)=>{});
    let body2={//二审
      type:2,
      id:applyId,
      status2:3
    };
    this.commonSvc.querySystemLog(body2)
      .then((res)=>{
        console.log(res);
        for(let o of res.items){
          if(o.status==body2.status2){
            this.secondReviewInfo.operator=o.createBy;
            this.secondReviewInfo.reviewTime=o.createTime;
            this.secondReviewInfo.opinion=o.remarks;
            break;
          }
        }
      })
      .catch((err)=>{});

  }*/


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
    let id=(this.rollover&&this.rollover.rolloverApplyId)|| this.actRoute.snapshot.params['id'];
    this.contractEditor.associateId =id;//关联ID
    this.contractEditor.borrowApplyId = this.loan.borrowApplyId;
    this.contractEditor.visible = true;
  }

  /**
   * 加载合同
   */
  loadContracts(){
    this.sharedSvc.queryContracts({
      borrowApplyId:this.actRoute.snapshot.params['id'],
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
          if(res.status) {
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
