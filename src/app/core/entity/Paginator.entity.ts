/**
 * 分页
 */
export class Paginator{
  index:number;//当前页码   0开始
  size:number;//每页大小
  count:number;//记录条数
  sizeOptions:number[];//每页大小选项
  constructor(){
    this.init();
  }
  private init() {
    this.index=0;
    this.size=10;
    this.count=0;
    this.sizeOptions=[5,10,20,30,40,50,75,100,200,300,500,1000,2000,3000];
  }
  reset(){
    this.index=0;
    this.count=0;
  }
}
