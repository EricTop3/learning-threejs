import $ from "../jquery"
import {isON,iterateRouter,routerClick} from "../utils"
import monitor from "../monitor"
const ON="ys-on",M='ys-dropdown-menus', isOfNav = el => el.parents(".ys-headerNav").length!==0, dropdown = data =>{
    let t=$(data.name)
    t.html('').append( `<div class="ys-dropdown-title"><a href="${data.href?data.href:'javascript:;'}">${data.tit}</a> <i class="ys-icon ys-icon-down"></i></div><dl class="ys-dropdown-menus ys-dropdown-menus-Infinite"></dl>`)
    iterateRouter(t.find(`>.${M}-Infinite`),data)
},n='.ys-dropdown.hover-event .ys-dropdown-title',m=`.ys-dropdown.hover-event .${M}`, r="ys-init-box bottom-to-top ys-show"
let st
$(document).on('mouseenter',n,function () {
    $(this).siblings(`.${M}`).addClass(r)
}).on('mouseleave',n,function () {
    st= setTimeout(()=>{
        $(this).siblings(`.${M}`).removeClass(r)
        clearTimeout(st)
    },300)
}).on('mouseenter',m,()=> clearTimeout(st)).on('mouseleave',m,function () {
    st= setTimeout(()=>{
        $(this).removeClass(r)
        clearTimeout(st)
    },300)
}).on("click",'.ys-dropdown>.ys-dropdown-title',function () {
    const el = $(this)
    if(isOfNav(el)&&el.siblings(`.${M}`).length===0)
        el.parent(".ys-dropdown").addClass(ON).siblings().removeClass(ON).find("dd").removeClass(ON)
    if(!isON(el.siblings(`.${M}`),r))
        el.find(".ys-icon-down").addClass("ys-rotateZ-180").parent().siblings(`.${M}`).addClass(r).attr("tabindex",0).focus()
    else
        el.find(".ys-icon-down").removeClass("ys-rotateZ-180").parent().siblings(`.${M}`).removeClass(r)
}).on("blur",`.${M}`,function () {
    let s=setTimeout(()=>{
        $(this).removeClass(r)
        $(this).siblings().find(".ys-icon-down").removeClass("ys-rotateZ-180")
        clearTimeout(s)
    },300)
}).on('click',`.${M} dd`,function () {
    const el=$(this),m=el.parents(".ys-dropdown").attr("ys-unique")
    if(isON(el,'ys-disabled'))
        return false
    else if(m)
        monitor.execute.call(!0,{unique:m, index:el.index(), text:el.text(), html:el.html()})
    el.addClass(ON).siblings().removeClass(ON)
    if(isOfNav(el)){
        el.parents(".ys-dropdown").addClass(ON).siblings().removeClass(ON).find("dd").removeClass(ON)
        routerClick(el,el.parents(".ys-headerNav"))
    }
}).on("click",`.ys-dropdown .${M}-Infinite .ys-nav-item-end`,function () {
    const el= $(this),rootP = el.parents(".ys-dropdown")
    rootP.addClass(ON).find(".ys-packedNav-item").removeClass(ON)
    el.addClass(ON).parents(".ys-packedNav-item").addClass(ON)
    routerClick(el,rootP)
    if(isOfNav(el)){
        rootP.siblings().removeClass(ON).find(".ys-packedNav-item").removeClass(ON)
        routerClick(el,el.parents(".ys-headerNav"))
    }
})
export default dropdown