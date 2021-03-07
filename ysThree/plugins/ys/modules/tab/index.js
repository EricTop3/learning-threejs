import $ from "../jquery"
import {stopBubble,isON} from "../utils"
import monitor from '../monitor'
import scrollBox from "../scrollBox"
const tab = {
    render:function (d) {
        let t = new tab.tab(d)
        return t.init(t).bindClick(t)
    },
    tab:function(d){
        let t =this ,_p = tab.tab.prototype
        t.d = d
        _p.init = t =>{
            const el = $(t.d.name),tit=el.find(".ys-tab-tit")
            t.el =el
            el.find(".ys-tab-head").addClass("ys-scroll-body").find(".ys-tab-scroll").addClass("ys-scroll-this")
            if( el.attr("isRender")=== 'true')
                return false
            else{
                if(t.d.editable&&tit.find(".ys-icon-close-2").length===0)
                    tit.append("<i class='ys-icon ys-icon-close-2'></i>")
                if(t.d.position==='left')
                    el.addClass("ys-tab-vertical clearfix")
                else if(d.position==='right')
                    el.addClass("ys-tab-vertical ys-tab-vertical-right clearfix")
                el.attr("isRender",'true')
                t.scrollInstance = scrollBox.render({name:t.d.name, direction:(t.d.position ==='left'||t.d.position ==='right')?'':'horizontal'})
            }
            return t
        }

        _p.bindClick = T =>{
            $(document).on('click',T.d.name+' .ys-tab-tit .ys-icon-close-2',function (e) {
                stopBubble(e)
                const t=$(this),p=t.parent(),i=p.index(),tab=t.parents(".ys-tab"),on=isON(p,'ys-on')
                tab.find(".ys-tab-con").eq(i).remove()
                p.remove()
                if(on) tab.find(".ys-tab-tit").eq(0).click()
                scrollBox.resize(T.scrollInstance)
            })

            return T
        }
    }
    ,add :(t,d)=>{
        const rp= t.el
        rp.find(".ys-tab-scroll").append(`<div class="ys-tab-tit">${d.tit}<i class='ys-icon ys-icon-close-2'></i></div>`)
        if(d.con)
            rp.find(".ys-tab-body").append(`<div class="ys-tab-con ys-init-box ${d.direction||'bottom-to-top'}">${d.con}</div>`)
        else if(d.content){
            rp.find(".ys-tab-body").append(`<div class="ys-tab-con ys-init-box ${d.direction||'bottom-to-top'}"></div>`)
            let i= rp.find(".ys-tab-body .ys-tab-con").length-1
            rp.find(".ys-tab-body .ys-tab-con").eq(i).load(d.content.url,()=> {
                if(d.content.callback) d.content.callback({index:i,tit:d.tit})
            })
        }
        rp.find(".ys-tab-tit:last-child").click()
        scrollBox.resize(t.scrollInstance)
    }
    ,delete : (t,d)=>{
        const rp= t.el
        if(!d)
            rp.find(".ys-tab-body").html('').siblings('.ys-tab-head').find(".ys-tab-scroll").html('')
        else if(d.index){
            rp.find(".ys-tab-tit").each((i,e)=> {
                if(i===d.index){
                    $(e).remove()
                    rp.find(".ys-tab-con").eq(i).remove()
                    return false
                }
            })
        }
        else if(d.tit){
            const c=rp.find(".ys-tab-con")
            rp.find(".ys-tab-tit").each((i,e)=> {
                if($(e).text()===d.tit){
                    c.eq(i).remove()
                    $(e).remove()
                }
            })
        }
        rp.find(".ys-tab-tit:first-child").click()
        scrollBox.resize(t.scrollInstance)
    }
    ,changeTo :(t,d)=>{
        const rp= t.el
        if(d.index){
            rp.find(".ys-tab-tit").each((i,e)=> {
                if(i===d.index) return $(e).click()
            })
        }
        else if(d.tit){
            rp.find(".ys-tab-tit").each((i,e)=> {
                if($(e).text()===d.tit) return $(e).click()
            })
        }
    }
}
$(document).on('click',".ys-tab-tit",function () {
    const t=$(this),m=t.parents(".ys-tab").attr("ys-unique")
    t.addClass("ys-on").siblings().removeClass("ys-on")
    t.parents(".ys-tab").find(".ys-tab-con").eq(t.index()).addClass("ys-on").siblings().removeClass("ys-on")
    if(m) monitor.execute.call(t,{unique:m,index:t.index(),tit:t.text()})
})
export default tab