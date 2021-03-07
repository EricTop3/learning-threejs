import $ from "../jquery"
import message from "../message"
import {isON,routerClick} from "../utils"
const doc=$(document)
const sideNav = data =>{
    if(data&&typeof data === "object"){
        let t =$(data.name),w =data.packedWidth
        if(w){
            const changeForIt = ()=>{
                if($(window).innerWidth()>=parseInt(w)&&isON(t,'ys-packedNav')){
                    t.removeClass("ys-packedNav").html('')
                    forIt(t,data)
                }else if($(window).innerWidth()<parseInt(w)&&!isON(t,'ys-packedNav')){
                    t.addClass("ys-packedNav").html('')
                    forIt2(t,data)
                }
            }
            $(window).resize(function () {
                changeForIt()
            })
            changeForIt();t.addClass('ys-packedNav');$(window).resize()
        }else
            forIt(t,data)
        return [(t,data)=>{t.removeClass("ys-packedNav").html('');forIt(t,data)},(t,data)=>{t.addClass("ys-packedNav").html('');forIt2(t,data)}]
    }else
        message({msg:"sideNav需要一个object对象才能生成构成导航栏"})
}
const forIt =(container,data) => {
    let icon='',chi=data.children||data.menus
    for(let i=0;i<chi.length;i++){
        if(chi[i].image){
            let im2=chi[i].image[1]?`<img src="${chi[i].image[1]}" />`:''
            icon = `<span class="ys-nav-tit-icon"><img src="${chi[i].image[0]}" />${im2}</span>`
        }else if(chi[i].icon)
            icon = `<span class="ys-nav-tit-icon"><i class="${chi[i].icon}"></i></span>`
        container.append(` <div class="ys-nav-item${chi[i].on===true?' ys-on':''}"> <a class="ys-nav-item-tit" href="${chi[i].href||'javascript:;'}"  post="${chi[i].post||''}">${icon}<span>${chi[i].tit}</span></a> </div>`)
        if(chi[i].children&&chi[i].children.length>0){
            container.find(">.ys-nav-item").eq(i).append(`<i class="ys-icon ys-icon-down"></i><div class="ys-nav-item-con"></div>`)
            forIt(container.find(">.ys-nav-item").eq(i).find(".ys-nav-item-con").eq(0),chi[i])
        }else
            container.find(">.ys-nav-item").eq(i).addClass("ys-nav-item-end")
    }
}
const forIt2=(container,data) =>{
    let icon='',chi=data.children||data.menus
    for(let i=0;i<chi.length;i++){
        if(chi[i].image){
            let im2=chi[i].image[1]?`<img src="${chi[i].image[1]}" />`:''
            icon = `<span class="ys-nav-tit-icon"><img src="${chi[i].image[0]}" />${im2}</span>`
        }else if(chi[i].icon)
            icon = `<span class="ys-nav-tit-icon"><i class="${chi[i].icon}"></i></span>`
        container.append(` <div class="ys-packedNav-item${chi[i].on===true?' ys-on':''}"><a class="ys-packedNav-tit" href="${chi[i].href||'javascript:;'}"  post="${chi[i].post||''}">${icon}<span class="ys-tit-word">${chi[i].tit}</span></a></div>`)
        if(chi[i].children&&chi[i].children.length>0){
            container.find(">.ys-packedNav-item").eq(i).append(`<i class="ys-icon ys-icon-right"></i><div class="ys-packedNav-con"></div>`)
            forIt2(container.find(">.ys-packedNav-item").eq(i).find(".ys-packedNav-con").eq(0),chi[i])
        }else
            container.find(">.ys-packedNav-item").eq(i).addClass("ys-nav-item-end")
    }
}
//展开  注意这里监听的是 ys-nav-item-tit
doc.on("click",'.ys-slideNav .ys-nav-item .ys-nav-item-tit',function () {
    const el= $(this),rootP = el.parents(".ys-slideNav"),se= rootP.attr("ys-siblings-effect")||'true',p=el.parent()
    if(p.find(".ys-nav-item-con").length>0){
        if(p.attr("class").indexOf("ys-on")!== -1)
            p.removeClass("ys-on")
        else{
            if(se!== 'true') {
                if(p.attr("class").indexOf("ys-nav-item-end")!== -1)
                    rootP.find(".ys-nav-item-end").removeClass("ys-on")
            }else
                rootP.find(".ys-nav-item").removeClass("ys-on")
            el.parents(".ys-slideNav .ys-nav-item").addClass("ys-on")
        }
    }else{
        if(se!== 'true') {
            if(p.attr("class").indexOf("ys-nav-item-end")!== -1)
                rootP.find(".ys-nav-item-end").removeClass("ys-on")
        }else
            rootP.find(".ys-nav-item").removeClass("ys-on")
        el.parents(".ys-slideNav .ys-nav-item").addClass("ys-on")
        routerClick(el.parent(".ys-nav-item"),rootP)//只给最后添加监听
    }
})
//收缩
doc.on("click",'.ys-slideNav.ys-packedNav .ys-nav-item-end',function () {
    const el= $(this),rootP = el.parents(".ys-slideNav")
    rootP.find(".ys-packedNav-item").removeClass("ys-on")
    el.addClass("ys-on").parents(".ys-packedNav-item").addClass("ys-on")
    routerClick(el,rootP)
})
export default sideNav



