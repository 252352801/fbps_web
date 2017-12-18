/**
 * 公共返回值
 */
export class Response{
  status:number;//状态码   返回状态，200为成功；
  message:string;//响应信息 对status的中文描述，如status不等于200，此字段为错误原因
  body:any;//返回值的正文内容 所有返回值的正文内容都嵌套在此字段下。如status不等于200，此字段为空对象
}
