/**
 *审核信息
 */
export class ReviewInfo{
  operator:string;//操作者
  reviewTime:string;//时间
  opinion:string;//意见

  init(obj?:any):ReviewInfo{
    let instance=this;
    if(obj&&typeof obj==='object'){
      instance.operator=obj.operator;
      instance.reviewTime=obj.reviewTime;
      instance.opinion=obj.opinion;
    }
    return instance;
  }
  static create(obj?:any):ReviewInfo{
    return new ReviewInfo().init(obj);
  }
}

