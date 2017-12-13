import { Component,OnInit} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { ProductService} from '../product.service';
import { ProductBody} from '../product.service';
import { ModifyProductDetailsService} from './modifyDetails.service';
import { DictionaryService,Dictionary} from '../../../../services/dictionary/dictionary.service';
import {Product} from "../../../../services/entity/Product.entity";
import {PopService} from 'dolphinng';
import {fadeInAnimation} from '../../../../animations/index';

@Component({
    selector: 'modify-prod-details',
    templateUrl: './modifyDetails.component.html',
    styleUrls: ['./modifyDetails.component.less'],
  providers:[ModifyProductDetailsService,PopService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}

})
export class ModifyProductDetailsComponent implements OnInit{

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
  interestUnitOptions:{
    title:string,
    label:string,
    divisor:number
  }[];

  rolloverInterestValueUnit:number;
  overdueInterestUnit:number;

  loading:boolean=false;
  submitted:boolean=false;

  proveDataOptions:{
    item:Dictionary,
    selected:boolean
  }[];
  fileType:string;
  constructor(
    private prodSvc:ProductService,
    private modProdDtSvc:ModifyProductDetailsService,
    private actRoute:ActivatedRoute,
    private dictionarySvc:DictionaryService,
    private pop:PopService
  ){
  }
  ngOnInit(){
    this.formData={
      minCycle:0,
      maxCycle:0,
      minAmount:0,
      maxAmount:0
    };
    this.cycleUnit='月';
    this.amountUnit='万';
    this.product=new Product();
    let id=this.actRoute.snapshot.params['id'];
    this.loading=true;
    this.prodSvc.getProductById(id)
      .then((res)=>{
        this.loading=false;
        this.product=res;
        let amount=this.product.valueLimit.replace(/[^0-9\-]/g,'').split('-');
        let amountUnit=this.product.valueLimit.replace(/[0-9\-\.]/g,'');
        if(amountUnit.length>0){
          this.amountUnit=amountUnit;
        }
        this.formData.minAmount=parseFloat(amount[0]);
        this.formData.maxAmount=parseFloat(amount[1]);

        let cycle=this.product.borrowHowlong.replace(/[^0-9\-]/g,'').split('-');
        let cycleUnit=this.product.borrowHowlong.replace(/[0-9\-\.]/g,'');
        if(cycleUnit.length>0){
          this.cycleUnit=cycleUnit;
        }
        this.formData.minCycle=parseFloat(cycle[0]);
        this.formData.maxCycle=parseFloat(cycle[1]);

        if(this.product.interestType==0){
          this.rolloverInterestValueUnit=100;//改过了...
        }else{
          this.rolloverInterestValueUnit=100;
        }
        this.product.rolloverDeposit=this.product.rolloverDeposit*100||null;
        this.product.rolloverInterestValue=this.product.rolloverInterestValue*this.rolloverInterestValueUnit||null;
        this.product.overdueInterestValue=this.product.overdueInterestValue*this.overdueInterestUnit||null;
        this.product.penaltyRate=this.product.penaltyRate*100||null;
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
      });
    this.dictionarySvc.load('interest_type')
      .then((res)=>{
        this.interestTypeOptions=res;
        this.product.interestType=parseInt(this.interestTypeOptions[0].value);
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

    //融资证明选项
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
        return this.prodSvc.getProveData(id);
      })
      .then((data)=>{
        if(data instanceof Array){
          for(let o of this.proveDataOptions){
            loop:
            for(let pd of data){
              if(pd.fileType==o.item.value){
                o.selected=true;
                break loop;
              }
            }
          }
          this.setFileType();
        }
      });


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

  submit(){
    this.product.valueLimit=this.formData.minAmount+'-'+this.formData.maxAmount+this.amountUnit;
    this.product.borrowHowlong=this.formData.minCycle+'-'+this.formData.maxCycle+this.cycleUnit;
    let body:ProductBody={
      productId:this.product.productId,
      productName:this.product.productName,
      productRemark:this.product.productRemark,
      productCompany:this.product.productCompany,
      expiryDate:parseInt(this.product.expiryDate+''),
      productRequirement:this.product.productRequirement,
      productAppScope:this.product.productAppScope,
      productAreaScope:this.product.productAreaScope,
      productType:this.product.productType,
      valueLimit:this.product.valueLimit,
      //interestType:this.product.interestType,
      borrowHowlong:this.product.borrowHowlong,
      rolloverHowlong:this.product.rolloverHowlong,
      rolloverInterestValue:this.product.rolloverInterestValue/this.rolloverInterestValueUnit,
      rolloverDeposit:this.product.rolloverDeposit/100,
      status:this.product.status,
      overdueInterestValue:this.product.overdueInterestValue/this.overdueInterestUnit,
      penaltyRate:this.product.penaltyRate/100
    };
    if(this.fileType){
      body.fileType=this.fileType;
    }
    this.submitted=true;
    this.modProdDtSvc.updateProduct(body)
      .then((res)=>{
        this.submitted=false;
          if(res.ok){
            this.pop.info({
              text:'修改成功！'
            }).onConfirm(()=>{
              history.back();
            }).onClose(()=>{
              history.back();
            });
          }else{
            this.pop.info({
              text:res.message||'修改失败！'
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

  scopeValid(min:number|string,max:number|string){
    return parseFloat(min+'')<parseFloat(max+'');
  }
}
