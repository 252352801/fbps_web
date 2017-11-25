import { Component} from '@angular/core';
import {Uploader} from 'dolphinng'
@Component({
    selector: 'system-log',
    templateUrl: './systemLog.component.html',
    styleUrls: ['./systemLog.component.less'],
})
export class SystemLogComponent {

  galleryImages=[
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502945336494&di=e76c1de82f2fae334335f389e66618f3&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2012%2F1029%2Fzyz%2F03%2F14583115_1350966109847.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502945336494&di=e76c1de82f2fae334335f389e66618f3&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2012%2F1029%2Fzyz%2F03%2F14583115_1350966109847.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502945336494&di=e76c1de82f2fae334335f389e66618f3&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2012%2F1029%2Fzyz%2F03%2F14583115_1350966109847.jpg',
  ];
  galleryImages1=[
    {a:{b:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502945336494&di=e76c1de82f2fae334335f389e66618f3&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2012%2F1029%2Fzyz%2F03%2F14583115_1350966109847.jpg'}},
    {a:{b:'http://img2.imgtn.bdimg.com/it/u=2139391670,4174270048&fm=26&gp=0.jpg'}},
    {a:{b:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502945336494&di=e76c1de82f2fae334335f389e66618f3&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2012%2F1029%2Fzyz%2F03%2F14583115_1350966109847.jpg'}},
    {a:{b:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502945336494&di=e76c1de82f2fae334335f389e66618f3&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2012%2F1029%2Fzyz%2F03%2F14583115_1350966109847.jpg'}},
    {a:{b:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502945336494&di=e76c1de82f2fae334335f389e66618f3&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2012%2F1029%2Fzyz%2F03%2F14583115_1350966109847.jpg'}},
    {a:{b:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502945336494&di=e76c1de82f2fae334335f389e66618f3&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2012%2F1029%2Fzyz%2F03%2F14583115_1350966109847.jpg'}},
    {a:{b:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502945336494&di=e76c1de82f2fae334335f389e66618f3&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2012%2F1029%2Fzyz%2F03%2F14583115_1350966109847.jpg'}},
    {a:{b:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502945336494&di=e76c1de82f2fae334335f389e66618f3&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2012%2F1029%2Fzyz%2F03%2F14583115_1350966109847.jpg'}},
    {a:{b:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502945336494&di=e76c1de82f2fae334335f389e66618f3&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2012%2F1029%2Fzyz%2F03%2F14583115_1350966109847.jpg'}},
    {a:{b:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502945336494&di=e76c1de82f2fae334335f389e66618f3&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2012%2F1029%2Fzyz%2F03%2F14583115_1350966109847.jpg'}},
    {a:{b:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1502945336494&di=e76c1de82f2fae334335f389e66618f3&imgtype=0&src=http%3A%2F%2Ftupian.enterdesk.com%2F2012%2F1029%2Fzyz%2F03%2F14583115_1350966109847.jpg'}},
  ];

  uploader:Uploader=new Uploader();
  constructor(){

    this.uploader.url='http://121.46.18.25:9090/fileserver/file/upload';
    this.uploader.isCompress=true;
    this.uploader.onSelect((files)=>{//文件选择完毕
    });
    this.uploader.onQueue((uploadFile)=>{//文件加入队列
      //uploadFile.addSubmitData('fileId','文件ID');  //发送此字段删除该指定ID的文件
      uploadFile.addSubmitData('businessType','0101');
      uploadFile.addSubmitData('fileName',uploadFile.fileName);
      uploadFile.addSubmitData('fileType',uploadFile.fileExtension);
      uploadFile.addSubmitData('fileSize',uploadFile.fileSize);
      uploadFile.addSubmitData('fileContent',uploadFile.getFile());
    });
    this.uploader.onQueueAll((uploadFiles)=>{//文件全部加入队列
    });
    this.uploader.onUpload((uploader)=>{//上传之前
    });
    this.uploader.onProgress((progress,uploadFile,uploader,index)=>{//上传中

    });
    this.uploader.onSuccess((uploadFile,uploader,index)=>{//上传请求成功

    });
    this.uploader.onComplete((uploader)=>{//完成上传
    });
  }
}
