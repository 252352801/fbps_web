import { Component,OnInit} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { ProductDetailsService} from './details.service';
import { Product} from '../../../../services/entity/Product.entity';
import {ProductConfig} from '../../../../services/entity/ProductConfig.entity';
import {Resource} from '../../../../services/entity/Resource.entity';
import { ProductService} from '../product.service';
import {ProveData} from '../../../../services/entity/ProveData.entity';
import {fadeInAnimation} from '../../../../animations/index';
@Component({
    selector: 'product-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.less'],
    providers: [ProductDetailsService],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
export class ProductDetailsComponent implements OnInit{
  product:Product=new Product();
  productConfigs:ProductConfig[]=[];
  resources: Resource[] = [];//渠道列表
  selectedResources: Resource[] = [];//添加的渠道
  activeResource: Resource;//激活的渠道
  proveData:ProveData[]=[];
  constructor(
    private prodDtSvc:ProductDetailsService,
    private actRoute:ActivatedRoute,
    private prodSvc:ProductService
  ){
  }

  ngOnInit(){
    this.loadProductDetails();
    this.loadResources()
      .then((data)=>{
        this.loadProductConfigs();
      });
    this.prodSvc.getProveData(this.actRoute.snapshot.params['id'])
      .then((res)=>{
        this.proveData=res;
      })
      .catch((err)=>{

      });
  }
  loadProductDetails(){
    let id=this.actRoute.snapshot.params['id'];
    this.prodDtSvc.getProductById(id)
      .then((res)=>{
        this.product=res;
      })
  }

  activateResource(resource: Resource) {
    this.activeResource = resource;
  }

  loadResources() {
    return this.prodDtSvc.loadResources({resourceType:0})
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

  selectResource(resource: Resource) {
    for (let o of this.selectedResources) {
      if (resource.resourceId === o.resourceId) {
        return;
      }
    }
    this.selectedResources.push(resource);
    this.activateResource(resource);
  }
}
