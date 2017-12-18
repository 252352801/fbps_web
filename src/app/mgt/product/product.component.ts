import {Component,Injectable} from '@angular/core';
import {Paginator} from '../../core/entity/Paginator.entity';
import {Product} from '../../core/entity/Product.entity';
import {ProductService} from './product.service';
import {Toaster,PopService} from 'dolphinng';
import {ActivatedRoute,Params,Router} from '@angular/router';
import {fadeInAnimation} from 'app/shared/animations/index';
import {OauthService} from '../../core/services/oauth/oauth.service';
@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less'],
  animations: [fadeInAnimation],
  // 附加淡入动画到组件的最外层元素上
  host: {'[@fadeInAnimation]': ''}
})
@Injectable()
export class ProductComponent {

  productCount: number;
  tableData:Product[]= [];
  loading: boolean;
  paginator: Paginator;
  params:{
    productName:string
  };
  path:string='';
  constructor(
    private prodSvc:ProductService,
    private toaster:Toaster,
    private pop:PopService,
    private actRoute:ActivatedRoute,
    public oauth:OauthService,
    private router:Router
  ) {
    this.init();
    this.subscribeRouteParams();
    this.loadCount();
  }

  init(){
    this.productCount=0;
    this.loading=false;
    this.paginator=new Paginator();
    this.params={
      productName:''
    };
    this.path=this.router.url.split(';')[0];
  }
  subscribeRouteParams(){
    this.actRoute.params.subscribe((params:Params)=>{
      let page=params['page']?parseInt(params['page']):0;
      let rows=params['rows']?parseInt(params['rows']):this.paginator.size;
      this.paginator.index=page;
      this.paginator.size=rows;
      this.query();
    });
  }

  loadCount(){
    let query={
      page:1,
      row:1
    };
    this.prodSvc.queryProducts(query)
      .then((res)=>{
        this.productCount=res.count;
      })
  }
  query() {
    let query={
      productName:this.params.productName||null,
      page:this.paginator.index+1,
      row:this.paginator.size
    };
    this.loading=true;
    this.prodSvc.queryProducts(query)
      .then((res)=>{
        this.loading=false;
        this.tableData=res.items;
        this.paginator.count=res.count;
      });
  }
  search(){
    this.paginator.reset();
    this.navigate();
    this.query();
  }
  resetParams(){
    this.params.productName='';
  }

  toggleProductStatus(product:Product){
    let newStatus=product.status==0?-2:0;
    let newStatText=newStatus==-2?'禁用':'启用';
    this.pop.confirm({
      text:'确定'+newStatText+'该产品？'
    }).onConfirm(()=>{
      let body={
        productId:product.productId,
        status:newStatus
      };
      this.prodSvc.updateProductsStatus(body)
        .then((res)=>{
          if(res.ok){
            product.status=newStatus;
          }else{
            this.toaster.error('',newStatText+'失败！');
          }
        })
        .catch((err)=>{
          this.toaster.error('','请求失败！');
        })
    });
  }
  navigate(){
    let params:{
      page:number,
      rows:number
    }={
      page:this.paginator.index,
      rows:this.paginator.size
    };
    this.router.navigate([this.path,params]);
  }

}
