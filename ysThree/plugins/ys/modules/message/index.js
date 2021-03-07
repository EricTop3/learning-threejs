import $ from "../jquery"
import { getTimestamp } from "../utils"
const message = data =>{
    if(typeof data ==="string"||typeof data === "number") data={'msg':data}
    let type = data.type||"message",str='',showType=data.showType||"scale-to-boom",id=getTimestamp()+parseInt(Math.random()*999999)
    if(type==="message"){ //消息
         str= data.icon?`<span class="ys-icon ys-icon-${data.icon}" style="margin-right:8px"></span>`:(data.image?`<img src="${data.image}" style="margin-right:8px"/>`:str)
        $('body').append(`<div class="ys-message ${showType.indexOf('ys-shake')!==-1?showType:'ys-init-box '+showType}" id=${id}><div class="ys-bg-${data.icon||'normal'} ${data.icon||''}">${str}${data.msg}</div></div>`)
        const st=setTimeout(()=>{
            $('#'+id).remove()
            clearTimeout(st)
        },data.during||3000)

    }else if(type==="loading"){//正在加载..
        str = (data.icon?`<span class="ys-icon ys-icon-${data.icon}"></span>`:(data.image?`<img src="${data.image}" class="${data.imageLoop?'ys-rotateZ-loop':''}"/>`:str))|| `<span class="ys-icon ys-icon-loading-1"></span>`
        $('body').append(`<div class="ys-message ${showType.indexOf('ys-shake')!==-1?showType:'ys-init-box '+showType}" id=${id}>${str}<p>${data.msg||''}</p></div>`)
    }
    return $('#'+id)
}
export default message
