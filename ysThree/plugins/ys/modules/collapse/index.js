import $ from "../jquery"
import {isON,stopBubble} from "../utils"
import monitor from "../monitor"
const doc = $(document),ON='ys-on'
const forCol=(el,d,btns)=>{
    for(let i=0;i<d.length;i++){
        let n=d[i],uid = n.id||'',style =`${d[i].on?"style='display:block'":''}`,con
        el.append(`<div class="ys-collapse${d[i].on?' ys-on':''}" uid="${uid}">${btns}<div class="ys-collapse-tit">${d[i].tit}</div><div class="ys-collapse-con" ${style}></div></div>`)
        con=el.find('>.ys-collapse').eq(i).find('>.ys-collapse-con')
        if(n.children&&n.children.length>0) forCol(con,n.children,btns)
        else con.append(d[i].con)
    }
}
const collapse  ={
    cfg:{},
    render:d=>{
        let el=$(d.name),po=d.iconPosition==='left',cl=po?'ys-collapse-icon-left':'',btns=''
        if(d.edit){
            for(let i= 0;i<d.edit.length;i++){
                btns=btns+d.edit[i]
            }
            btns=`<div class="ys-collapse-btns">${btns}</div>`
        }
        if(d.menus&&d.menus.length>0) forCol(el,d.menus,btns)
        if(d.siblingsEffect) el.attr("ys-siblings-effect",'true')
        $(el).find('.ys-collapse-tit').each((i,e)=> $(e).addClass(cl).append(`<i class="ys-icon ys-icon-right"></i>`))
    },
    event:(q,f) => collapse.cfg[q]=[f]

}

doc.on('click', '.ys-collapse .ys-collapse-tit', function () {
    let t = $(this),p = t.parents(".ys-collapses"),  pa = t.parent(), ef = p.attr("ys-siblings-effect") === 'true',u=p.attr('ys-unique')
    if (ef) pa.siblings().each( (i,e) =>{if(isON($(e),ON)) $(e).removeClass("ys-on").find('>.ys-collapse-con').slideUp(300)})
    if (isON(pa,ON)) pa.removeClass(ON).find('>.ys-collapse-con').slideUp(300)
    else pa.addClass(ON).find('>.ys-collapse-con').slideDown(300)
    if(u) monitor.execute.call(t,{unique:u,tit:$(this).text(),on:isON(pa,ON)})
})
doc.on('click','.ys-collapses .ys-collapse .ys-btn',function (e) {
    stopBubble(e)
    let t=$(this),p =t.parents(".ys-collapses"),q=p.attr("ys-unique"),tit=t.parent().siblings('.ys-collapse-tit'),uid=tit.parent().attr("uid"),event=t.attr('ys-event'),con = tit.siblings('.ys-collapse-con').find(".ys-collapse").length>0?'该面板下还有子面板':tit.siblings('.ys-collapse-con').html()
    if(q) collapse.cfg[q][0]({unique:q,uid:uid,tit:tit.text(),con:con,event:event,collapse:tit.parent()})
})
export default collapse