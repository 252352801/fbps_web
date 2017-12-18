class Modal{
  size:string='md';
  visible:boolean=false;
  title:string='';
  isShowHeader:boolean=true;
  isShowFooter:boolean=true;
  handler:any=null;
  constructor(){

  }
  open(){
    this.visible=true;
  }
  close(){
    this.visible=false;
  }
}
