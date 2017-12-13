import { Component,OnInit} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { ProductService} from '../product.service';
import { PublishProductService} from './publish.service';
import { ProductBody} from '../product.service';
import { DictionaryService,Dictionary} from '../../../../services/dictionary/dictionary.service';
import {Product} from "../../../../services/entity/Product.entity";
import {PopService} from 'dolphinng';
import {fadeInAnimation} from '../../../../animations/index';
@Component({
  selector: 'publish-product',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.less'],
  providers:[PublishProductService,PopService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class PublishProductComponent implements OnInit{

  formData:{
    minCycle:number,
    maxCycle:number,
    minAmount:number,
    maxAmount:number
  };
  cycleUnit:string;
  amountUnit:string;
  product:Product;
  productTypeOptions:Dictionary[];
  interestTypeOptions:Dictionary[];
  cycleUnitOptions:{value:string}[];
  expiryDateOptions:{label:string,value:number}[];
  rolloverInterestValueUnit:number;
  overdueInterestUnit:number;

  interestUnitOptions:{
    title:string,
    label:string,
    divisor:number
  }[];

  loading:boolean=false;
  submitted:boolean=false;

  proveDataOptions:{
    item:Dictionary,
    selected:boolean
  }[];
  fileType:string;
  constructor(
    private prodSvc:ProductService,
    private pubProdSvc:PublishProductService,
    private actRoute:ActivatedRoute,
    private dictionarySvc:DictionaryService,
    private pop:PopService
  ){
  }
  ngOnInit(){
    this.formData={
      minCycle:null,
      maxCycle:null,
      minAmount:null,
      maxAmount:null
    };
    this.cycleUnit='月';
    this.amountUnit='万';
    this.product=new Product();
    this.product.productAppScope=0;
    this.product.productAreaScope=0;
    let id=this.actRoute.snapshot.params['id'];
    this.productTypeOptions=[];
    this.interestTypeOptions=[];

    this.proveDataOptions=[];
    this.dictionarySvc.load('prove_data')
      .then((data)=>{
        if(data instanceof Array){
          for(let item of data){
            let o={
              item:item,
              selected:false
            };
            this.proveDataOptions.push(o);
          }
        }
      });
    {
      let productTypeOption=new Dictionary();
      productTypeOption.label='请选择';
      productTypeOption.value='';
      this.productTypeOptions=[productTypeOption];
    }
    this.dictionarySvc.load('product_type')
      .then((res)=>{
        this.productTypeOptions=this.productTypeOptions.concat(res);
        this.product.productType ='';
      });
    this.dictionarySvc.load('interest_type')
      .then((res)=>{
        this.interestTypeOptions=res;
        if(this.interestTypeOptions.length>0) {
          this.product.interestType = parseInt(this.interestTypeOptions[0].value);
          if(this.product.interestType==0){
            this.rolloverInterestValueUnit=100;
          }else{
            this.rolloverInterestValueUnit=100;
          }
        }
      });
    this.cycleUnitOptions=[{value:'天'},{value:'月'},{value:'年'}];
    this.expiryDateOptions=[{
      label:'长期有效',
      value:0
    },{
      label:'1年',
      value:1
    },{
      label:'2年',
      value:2
    }];
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

    this.rolloverInterestValueUnit=100;
    this.overdueInterestUnit=100;

    this.product.expiryDate=this.expiryDateOptions[0].value;
  }

  submit(){
    this.product.valueLimit=this.formData.minAmount+'-'+this.formData.maxAmount+this.amountUnit;
    this.product.borrowHowlong=this.formData.minCycle+'-'+this.formData.maxCycle+this.cycleUnit;
    let body:ProductBody={
      productName:this.product.productName,
      productRemark:this.product.productRemark||'',
      productCompany:'运金所',
      expiryDate:this.product.expiryDate,
      productRequirement:this.product.productRequirement||'',
      productAppScope:this.product.productAppScope,
      productAreaScope:this.product.productAreaScope,
      productType:this.product.productType,
      valueLimit:this.product.valueLimit,
      //interestType:this.product.interestType,
      borrowHowlong:this.product.borrowHowlong,
      rolloverHowlong:this.product.rolloverHowlong,
      rolloverInterestValue:this.product.rolloverInterestValue/this.rolloverInterestValueUnit,
      rolloverDeposit:this.product.rolloverDeposit/100,
      overdueInterestValue:this.product.overdueInterestValue/this.overdueInterestUnit,
      penaltyRate:this.product.penaltyRate/100,
      status:0
    };
    if(this.fileType){
      body.fileType=this.fileType;
    }
    this.submitted=true;
    this.pubProdSvc.createProduct(body)
      .then((res)=>{
        this.submitted=false;
        if(res.ok){
          this.pop.info({
            text:'发布成功！'
          }).onConfirm(()=>{
            history.back();
          }).onClose(()=>{
            history.back();
          });
        }else{
          this.pop.info({
            text:res.message||'发布失败！'
          });
        }
      })
      .catch((err)=>{
        this.submitted=false;
        this.pop.info({
          text:'请求失败，请重试！'
        });
      })
  }

  /**
   * 设置fileType的值
   * @param value
   */
  setFileType(value?:string){
    if(value!==undefined){
      this.fileType=value;
    }else{
      let selections=[];
      for(let o of this.proveDataOptions){
        if(o.selected){
          selections.push(o.item.value);
        }
      }
      if(selections.length){
        this.fileType=selections.join(',');
      }
    }
  }

  scopeValid(min:number|string,max:number|string){
    return parseFloat(min+'')<parseFloat(max+'');
  }
}
