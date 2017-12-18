class Pattern{
  value:string;//值
  description:string;//描述

  constructor(value?:any,description?:string){
    value&&(this.value=value);
    description&&(this.description=description);
  }
  toRegExp(flags?:string):RegExp{
    return new RegExp(this.value,flags);
  }
}
/**
 * 验证规则模版
 */

export const  patterns={//正则验证规则
  amount:new Pattern(//数额
    `^((\\d{1,3}(,\\d{3}){0,3})|(\\d(,\\d{3}){0,4})|(\\d{1,13}))(\\.\\d{1,2})?$`,
    '最长15位数字，其中小数位最多两位'
  ),
  int:new Pattern(//整数
    '^\\d+$'
  ),
  float:new Pattern(//浮点数
    '^\\d+(\\.\\d)?$'
  ),
  email:new Pattern(//邮箱
    '\\^[^@\\S]+@[^@\\S]+(\\.[^@\\S])+$'
  ),
  ip:new Pattern(//IP地址
    '^http[s]?:\\/\\/\\S+$'
  )
};
