import $ from "../jquery"
import {getTimestamp,fixPosition} from "../utils"
const popover= data =>{
    data = data || { name:".ys-popover", event:"mouseenter"}
    let el,event=data.event||"mouseenter",doc= $(document)
        ,offset=parseInt(data.offset)||0,clicker=$(data.name),p=data.position||'top',bg=data.theme?'ys-bg-'+data.theme:''
    if(clicker.length === 0) return false
    let id="ys-tool-id"+getTimestamp()+parseInt(Math.random()*9999)+'_'+ $(".ys-popover-box").length, ht=clicker.attr("ys-pop")||data.content||''
        ,w=data.width?parseInt(data.width):'auto',tit=data.tit?`<div class="ys-tit-sm ys-popover-tit">${data.tit}</div>`:''
    $('body').append(`<div id="${id}" class="ys-popover-box ys-popover-${p} ${bg}" style="width:${w==='auto'?'auto':w+'px'}">${tit}<div class="ys-popover-content">${ht}</div></div>`)
    el=$('#'+id)
    fixPosition(p,el,clicker,offset)
    if(data.theme) el.find(".ys-popover-tit span").css("border-color",el.css("color"))
    $("div").scroll(()=> fixPosition(p,el,clicker,offset))
    doc.scroll(()=> fixPosition(p,el,clicker,offset))
    $(window).resize(()=> fixPosition(p,el,clicker,offset))
    if (event === 'click') doc.on(event,data.name,()=> el.stop().fadeToggle(200))
    else if(event === 'mouseenter') doc.on(event,data.name,()=> el.stop().fadeIn(200)).on("mouseleave",data.name,()=>el.stop().fadeOut(200))
    el.fixPosition = () => fixPosition(p,el,clicker,offset)
    return el
}
export default popover