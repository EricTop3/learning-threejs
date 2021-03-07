import $ from "../jquery"
import { getTimestamp ,ifPercent} from "../utils"
const messageBox = data =>{
    if(typeof data ==="string"||typeof data === "number") data={'msg':data}
    let id = getTimestamp()+parseInt(Math.random()*999999),width=data.width||"300px",close=data.closeable===false?'':`<span class="ys-icon ys-icon-close"></span>`,
        icon = data.icon?`<span class="ys-icon ys-icon-${data.icon}" style="float: left;"></span>`:'', showType=data.showType||"top-center",cnt='',method='top-to-bottom',
        arr=[{showType:"top-center", className:".ys-messageBoxes.showType-top-center", method:"top-to-bottom"},
            {showType:"bottom-center", className:".ys-messageBoxes.showType-bottom-center", method:"bottom-to-top"},
            {showType:"left-top", className:".ys-messageBoxes.showType-left-top", method:"left-to-right"},
            {showType:"left-bottom", className:".ys-messageBoxes.showType-left-bottom", method:"left-to-right"},
            {showType:"right-top", className:".ys-messageBoxes.showType-right-top", method:"right-to-left"},
            {showType:"right-bottom", className:".ys-messageBoxes.showType-right-bottom", method:"right-to-left"}]
    icon = data.image?`<img src="${data.image}" style="float: left;"/>`:icon
    for(let i=0;i<arr.length;i++){
        if(arr[i].showType===showType){
            if($(arr[i].className).length<1){
                let str=arr[i].className.split('.').join(" ")
                str=str.substring(1,str.length)
                $('body').append(`<div class="${str}"></div>`)
            }
            cnt=$(arr[i].className).eq(0)
            method=arr[i].method
            break
        }
    }
    if(showType==="top-center"||showType==="bottom-center") cnt.css({marginLeft:-parseInt(width)/2})
    cnt.css({width:width})
    ifPercent(width,undefined,cnt)
    cnt.append(`<div class="ys-messageBox ys-init-box ${method}" id="${id}">${icon}<div><div class="ys-messageBox-tit">${data.tit||''}</div><div class="ys-messageBox-con">${data.msg||''}</div></div>${close}</div>`)
    let el = $('#'+id),st = setTimeout(()=>{
        el.remove()
        clearTimeout(st)
    },data.during||3000)
    el.find(".ys-icon-close").click(function () {
        $(this).parent(".ys-messageBox").remove()
    })
    return el
}
export default messageBox