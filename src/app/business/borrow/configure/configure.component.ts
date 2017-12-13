import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PopService} from 'dolphinng';
import {BorrowConfigureService} from './configure.service';
import {BorrowService} from '../borrow.service';
import {Loan} from '../../../../services/entity/Loan.entity';
import {Resource} from '../../../../services/entity/Resource.entity';
import {Contract} from "../../../../services/entity/Contract.entity";
import {Paginator} from "../../../../services/entity/Paginator.entity";
import {fadeInAnimation} from '../../../../animations/index';
import {OauthService} from '../../../../services/oauth/oauth.service';
import {ProveData} from "../../../../services/entity/ProveData.entity";
import {ReviewInfo} from "../../../../services/entity/ReviewInfo.entity";
import {CommonService} from "../../../../services/common/common.service";
import {SharedService} from "../../../shared/shared.service";
import {BusinessService} from "../../business.service";
@Component({
  selector: 'borrow-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.less'],
  providers: [PopService, BorrowConfigureService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class BorrowConfigureComponent implements OnInit,OnDestroy {
  isPassed: boolean;
  loan: Loan = new Loan();//贷款详情
  auditOneBy: string = this.oauthSvc.user.employeeName || this.oauthSvc.user.mobile;
  opinion: string = '';
  defaultOpinion: string = '审批无误，予以通过';
  resources: Resource[] = [];
  contracts: Contract[] = [];
  contractsPaginator: Paginator = new Paginator();
  path: string = '';//当前路径
  modalContract = {
    visible: false,
    data: null,
    submitted: false
  };
  contractEditor = {
    borrowApplyId: '',
    visible: false
  };

  proveData: ProveData[] = [];

  firstReviewInfo:ReviewInfo=new ReviewInfo();//一审信息
  secondReviewInfo:ReviewInfo=new ReviewInfo();//二审信息
  constructor(private oauthSvc: OauthService,
              private commonSvc: CommonService,
              private sharedSvc: SharedService,
              private businessSvc: BusinessService,
              private router: Router,
              private pop: PopService,
              private borrowSvc: BorrowService,
              private BCSvc: BorrowConfigureService,
              private actRoute: ActivatedRoute) {
    this.getLoanById();
    this.getReviewInfo();
    this.loadResources();
    this.loadContracts();
    this.subscribeRouteParams();
    this.path = this.router.url.split(';')[0];
  }

  ngOnInit() {
    this.businessSvc.getLoanProveData(this.actRoute.snapshot.params['id'])
      .then((res)=> {
        this.proveData = res;
      })
      .catch((err)=> {
      });
  }

  ngOnDestroy() {

  }

  subscribeRouteParams() {
    this.actRoute.params.subscribe((params: Params)=> {

    });
  }

  navigate(path?: string) {
    let params: {
    } = {};
    if (path) {
      this.router.navigate([path]);
    } else {
      this.router.navigate([this.path, params]);
    }
  }

  navigateDetails(contract: any) {
    let jsonStr = JSON.stringify(contract);
    this.navigate('/business/borrow/review/contractDetails/' + jsonStr);
  }

  getLoanById(): Promise<any> {
    return this.businessSvc.getLoanById(this.actRoute.snapshot.params['id'])
      .then((data: Loan)=> {
        this.loan = data;
        return Promise.resolve(this.loan);
      })
      .catch((err)=> {

      });
  }

  /**
   * 获取审核信息
   */
  getReviewInfo(){
    let borrowApplyId=this.actRoute.snapshot.params['id'];
    let body1={//一审
      type:0,
      id:borrowApplyId,
      status2:2
    };
    this.commonSvc.querySystemLog(body1)
      .then((res)=>{
        for(let o of res.items){
          if(o.status==body1.status2){
            this.firstReviewInfo.operator=o.createBy;
            this.firstReviewInfo.reviewTime=o.createTime;
            this.firstReviewInfo.opinion=o.remarks;
            break;
          }
        }
      });
    let body2={//二审
      type:0,
      id:borrowApplyId,
      status2:3
    };
    this.commonSvc.querySystemLog(body2)
      .then((res)=>{
        for(let o of res.items){
          if(o.status==body2.status2){
            this.secondReviewInfo.operator=o.createBy;
            this.secondReviewInfo.reviewTime=o.createTime;
            this.secondReviewInfo.opinion=o.remarks;
            break;
          }
        }
      });

  }

  loadResources() {
    this.BCSvc.loadResources(1)
      .then((data)=> {
        this.resources = data;
      })
      .catch((err)=> {

      });
  }

  matchResourceName(resourceId: string): string {
    let resourceName = '';
    for (let i in this.resources) {
      if (this.resources[i].resourceId === resourceId) {
        resourceName = this.resources[i].resourceName;
        break;
      }
    }
    return resourceName;
  }

  /**
   * 是否有配合同
   */
  hasConfigContract() {
    return this.contracts.length > 0;
  }

  testData() {
    if (!this.hasConfigContract()) {
      this.pop.confirm({
        text: '请先配置合同！'
      });
    } else {
      this.pop.confirm({
        text: '确认完成合同配置？',
        closeOnConfirm: false,
        showLoaderOnConfirm: true
      }).onConfirm(()=> {
        this.submit();
      });
    }
  }

  private successNavigate() {
    history.back();
  }

  submit() {
    let body = {
      borrowApplyId: this.loan.borrowApplyId,
      auditOneBy: this.auditOneBy
    };
    this.BCSvc.finishContract(body)
      .then((res)=> {
        if (res.ok) {
          this.pop.info({
            text: '已完成合同配置！' || res.message
          }).onClose(()=> {
            this.successNavigate();
          }).onConfirm(()=> {
            this.successNavigate();
          });
        } else {
          this.pop.error({
            text: res.message
          });
        }
      })
      .catch(()=> {
        this.pop.error({
          text: '请求失败，请重试！'
        })
      });
  }

  openContractEditor() {
    this.contractEditor.borrowApplyId = this.loan.borrowApplyId;
    this.contractEditor.visible = true;
  }


  removeContract(id: string) {
    this.pop.confirm({
      text: '确定要删除这个合同？',
      showLoaderOnConfirm: true,
      closeOnConfirm: false
    }).onConfirm(()=> {
      this.BCSvc.removeContract(id)
        .then((res)=> {
          if (res.ok) {
            this.pop.info({text: '删除成功！'});
            this.loadContracts();
          } else {
            this.pop.error({text: res.message || '删除失败！'});
          }
        })
        .catch((err)=> {
          this.pop.error({text: '请求失败！'});
        });
    })
  }


  /**
   * 加载贷款单合同
   */
  loadContracts() {
    this.sharedSvc.queryContracts({
      borrowApplyId: this.actRoute.snapshot.params['id'],
      page: this.contractsPaginator.index + 1,
      rows: this.contractsPaginator.size
    }).then((res)=> {
      this.contracts = res.items;
      this.contractsPaginator.count = res.count;
    })

  }
}
