import { Component,OnInit} from '@angular/core';
import {Resource} from '../../../../services/entity/Resource.entity';
import {ModifyProductConfService} from './modifyConf.service';
import { ActivatedRoute} from '@angular/router';
import { ProductService} from '../product.service';
import { DictionaryService,Dictionary} from '../../../../services/dictionary/dictionary.service';
import {Product} from "../../../../services/entity/Product.entity";
import {PopService} from 'dolphinng';
import {ProductConfig} from '../../../../services/entity/ProductConfig.entity';
import {fadeInAnimation} from '../../../../animations/index';
@Component({
  selector: 'modify-product-conf',
  templateUrl: './modifyConf.component.html',
  styleUrls: ['./modifyConf.component.less'],
  providers:[ModifyProductConfService,PopService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class ModifyProductConfComponent implements OnInit{

  product:Product=new Product();
  resources: Resource[] = [];//渠道列表
  selectedResources: Resource[] = [];//添加的渠道
  activeResource: Resource;//激活的渠道

  modalSelectResource = {
    visible: false,
    data: {
      resourceId: ''
    }
  };

  modalConf = {
    visible: false,
    data: {
      productId:'',
      resourceId: '',
      interestValue:null,
      interestType:-1,
      repaymentWay:-1,
      rateCycle:'请选择'
    },
    repaymentWayOptions:[],
    interestTypeOptions:[],
    rateCycleOptions:[],
    errMsg:'',
    submitted:false
  };

  productConfigs:ProductConfig[]=[];

  repaymentWays:Dictionary[]=[];
  interestTypes:Dictionary[]=[];
  rateCycles:Dictionary[]=[];
  interestUnitOptions:{
    title:string,
    label:string,
    divisor:number
  }[];
  rolloverDepositUnit:number;
  loading:boolean=false;

  constructor(
    private mpcSvc: ModifyProductConfService,
    private prodSvc:ProductService,
    private actRoute:ActivatedRoute,
    private dictionarySvc:DictionaryService,
    private pop:PopService
  ) {

  }

  ngOnInit(){
    this.loadResources()
      .then((data)=>{
        this.loadProductConfigs();
      });
    this.loadProduct();
    this.dictionarySvc.load('payment_way')
      .then((res)=>{
        this.repaymentWays=res;
      });
    this.dictionarySvc.load('interest_type')
      .then((res)=>{
        this.interestTypes=res;
      });
    this.dictionarySvc.load('rate_cycle')
      .then((res)=>{
        this.rateCycles=res;
      });

    this.interestUnitOptions=[{
      title:'百分点',
      label:'百分',
      divisor:100
    },{
      title:'千分点',
      label:'千分',
      divisor:1000
    },{
      title:'万分点',
      label:'万分',
      divisor:10000
    }];

    this.rolloverDepositUnit=100;
  }

  loadProduct(){
    this.loading=true;
    let id=this.actRoute.snapshot.params['id'];
    this.prodSvc.getProductById(id)
      .then((res)=>{
        this.loading=false;
        this.product=res;
      })
  }

  loadResources() {
    return this.mpcSvc.loadResources({resourceType:0})
      .then((res)=> {
        this.resources = res;
        return Promise.resolve(res);
      })
  }

  loadProductConfigs(){
    let id=this.actRoute.snapshot.params['id'];
    this.prodSvc.loadProductConfigs(id)
      .then((res)=>{
        this.productConfigs=res;
        this.selectedResources=[];
        for(let o of this.productConfigs){
          let resourceId=o.appId;
          for(let r of this.resources){
            if(resourceId==r.resourceId&&resourceId!='-1'){
              this.selectResource(r);
            }
          }
        }
        if(this.selectedResources.length>0&&!this.activeResource){
          this.activateResource(this.selectedResources[0]);
        }
      });
  }

  openSelectResourceModal() {
    if (this.resources.length > 0 && this.modalSelectResource.data.resourceId === '') {
      this.modalSelectResource.data.resourceId = this.resources[0].resourceId;
    }
    this.modalSelectResource.visible = true;
  }

  closeSelectResourceModal() {
    this.modalSelectResource.visible = false;
  }

  selectResourceById(id: string) {
    let resource;
    for (let o of this.resources) {
      if (id === o.resourceId) {
        resource = o;
        break;
      }
    }
    if (resource) {
      this.selectResource(resource);
    }
  }

  activateResource(resource: Resource) {
    this.activeResource = resource;
  }

  selectResource(resource: Resource) {
    for (let o of this.selectedResources) {
      if (resource.resourceId === o.resourceId) {
        return;
      }
    }
    this.selectedResources.push(resource);
    this.activateResource(resource);
  }

  openConfModal(){
    this.modalConf.data.productId=this.product.productId;
    if(this.product.productAppScope===0){
      this.modalConf.data.resourceId='-1';
    }else if(this.product.productAppScope===1){
      this.modalConf.data.resourceId=this.activeResource.resourceId;
    }

    let orgOption=new Dictionary();
    orgOption.label='请选择';
    orgOption.value='-1';
    if(this.modalConf.interestTypeOptions.length===0){
      this.modalConf.interestTypeOptions=[orgOption].concat(this.interestTypes);
    }
    if(this.modalConf.repaymentWayOptions.length===0){
      this.modalConf.repaymentWayOptions=[orgOption].concat(this.repaymentWays);
    }
    if(this.modalConf.rateCycleOptions.length===0){
      this.modalConf.rateCycleOptions=[orgOption].concat(this.rateCycles);
    }

    this.modalConf.errMsg='';
    this.modalConf.submitted=false;
    this.modalConf.visible=true;
  }
  closeConfModal(){
    this.modalConf.visible=false;
  }
  tryCreatingConf(){
    let numRegExp=/^[0-9]+(\.[0-9]+)?/;
    let errMsg='';
    if(this.modalConf.data.rateCycle=='请选择'){
      errMsg='请选择贷款周期！';
    }else if(this.modalConf.data.repaymentWay==-1){
      errMsg='请选择还款方式！';
    }else if(this.modalConf.data.interestType==-1){
      errMsg='请选择计息方式！';
    }else if(this.modalConf.data.interestValue===null){
      errMsg='请输入利率！';
    }else if(!numRegExp.test(this.modalConf.data.interestValue+'')){
      errMsg='利率输入有误！';
    }else{
      this.modalConf.submitted=true;
      this.mpcSvc.configProduct({
        productId:this.modalConf.data.productId,
        appId:this.modalConf.data.resourceId,
        interestValue:parseFloat(this.modalConf.data.interestValue/this.rolloverDepositUnit+''),
        interestType:parseInt(this.modalConf.data.interestType+''),
        paymentWay:parseInt(this.modalConf.data.repaymentWay+''),
        rateCycle:this.modalConf.data.rateCycle
      })
        .then((res)=>{
          this.modalConf.submitted=false;
          if(res.ok){
            this.pop.info({
              text:'添加配置成功！'
            });
            this.loadProductConfigs();
          }else{
            this.pop.error({
              text:res.message||'添加配置失败！'
            });
          }
          this.modalConf.visible=false;
        })
        .catch((err)=>{
          this.pop.error({
            text:'请求失败！'
          });
          this.modalConf.submitted=false;
          this.modalConf.visible=false;

        })
    }
    this.modalConf.errMsg=errMsg;
  }

  removeProdConf(id:string){
    this.pop.confirm({
      text:'确定要删除这个配置吗?',
      closeOnConfirm:false,
      showLoaderOnConfirm:true
    })
      .onConfirm(()=>{
        this.mpcSvc.deleteProductConfig(id)
          .then((res)=>{
            if(res.ok){
              this.pop.info({text:'删除成功！'});
              this.loadProductConfigs();
            }else{
              this.pop.error({text:res.message||'删除失败！'});
            }

          })
          .catch((err)=>{
            this.pop.error({text:'请求失败！'});
          });
      })
  }

}
