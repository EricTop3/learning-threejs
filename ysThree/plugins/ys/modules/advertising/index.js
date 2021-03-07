import $ from "../jquery"
import { getTimestamp } from "../utils"
const advertising = data =>{
    const menus=data.menus||[],content=data.content?data.content:`<img class="ys-advertising-img" src='${data.image}'>`
    let ms=''
    for(let i=0;i<menus.length;i++){
        ms=ms+`<li>${menus[i].name}</li>`
    }
    const id=getTimestamp()+parseInt(Math.random()*999999)
    $("body").append(`<div id=${id} class="ys-advertising ys-init-box right-to-left" style="width: ${data.width?parseInt(data.width)+'px':'200px'};height: ${data.height?parseInt(data.height)+'px':'200px'}">
    <div class="ys-advertising-btns"><span class="ys-icon ys-icon-down" style="display: ${menus.length>0?'inline-block':'none'}"></span><span class="ys-icon ys-icon-close"></span> </div>
    <ul class="ys-advertising-menu">${ms}</ul>
    <a class="ys-absolute-container ys-advertising-main" href="${data.href||'javascript:;'}" target="_blank">${content}</a>
</div>`)
    const  el = $('#'+id), removeEl= () => el.removeClass("ys-init-box").fadeOut(1000, () => el.remove())
    el.find(".ys-advertising-btns .ys-icon-down").click(()=> el.find('.ys-advertising-menu').fadeToggle(200))
    el.find(".ys-advertising-btns .ys-icon-close").click(()=> removeEl())
    el.find(".ys-advertising-menu li").each((i,e)=> $(e).click(()=> menus[i].callback(el,i)))
    $(document).one("mouseleave","#"+id,()=> setTimeout(()=> removeEl(),data.during||60000))
}
export default advertising