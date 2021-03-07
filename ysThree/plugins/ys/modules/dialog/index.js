import $ from "../jquery"
import {getTimestamp,ifPercent} from "../utils"
const dialog = data =>{
    const theme=data.theme?`${' ys-bg-'+data.theme}`:'',close = data.closeable !== false?`<span class="ys-icon ys-icon-close dialog-close-icon"></span>`:'',tit=data.tit?`<div class="ys-dialog-tit${theme}">${data.tit}${close}</div>`:close,buttons=data.buttons||[]
    let btns='',id=getTimestamp()+parseInt(Math.random()*999999),el
    for(let i=0;i<buttons.length;i++){
        btns=btns+`<span class='ys-btn ys-btn-sm${i!==buttons.length-1?' ys-btn-primary':''}${i===buttons.length-1?theme:''}'>${buttons[i].name}</span>`
    }
    if(data.maskLayer){
        $('body').append(`<div id="${id}" class="ys-dialog-layer"><div class="ys-dialog-layer-main ys-init-box top-to-bottom">${tit}<div class="ys-dialog-con"> ${data.msg}</div><div class="ys-dialog-btns"> ${btns}</div></div></div>`)
        $("#"+id+" .ys-dialog-layer-main").css({width:data.width||300, height:data.height||'auto'})
    }else{
        $('body').append(`<div id="${id}" class="ys-dialog ys-init-box top-to-bottom">${tit}<div class="ys-dialog-con">${data.msg}</div><div class="ys-dialog-btns">${btns}</div></div>`)
        const w=data.width||300,h=data.height||200,el=$("#"+id)
        el.css({width:w, height:h, marginLeft:-parseInt(w)/2, marginTop:-parseInt(h)/2})
        ifPercent(w,h,el)
    }
    el=$("#"+id)
    $(".ys-icon.dialog-close-icon").click(() => el.remove())
    el.find(".ys-dialog-btns .ys-btn").each((i,e)=>{
        $(e).click(()=>{
            if(buttons[i].callback)
                buttons[i].callback(el,i)
            el.remove()})
    })
    return el
}
export default dialog