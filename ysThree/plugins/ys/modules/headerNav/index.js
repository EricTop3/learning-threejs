import $ from "../jquery"
import {iterateRouter,routerClick} from "../utils"
const headerNav = (d)=>{
    let t = $(d.name) ;t.html('')
    for(let i=0;i<d.menus.length;i++){
        let m = d.menus[i],j='javascript:;'
        if(m.children&&m.children.length>0){
            t.append(`<div class="ys-dropdown${d.event?' '+d.event:''}${m.on?' ys-on':''}"><div class="ys-dropdown-title"><a href="${m.href||j}" post="${m.post||j}">${m.tit}</a><i class="ys-icon ys-icon-down"></i></div><dl class="ys-dropdown-menus ys-dropdown-menus-Infinite"></dl></div>`)
            iterateRouter(t.find(".ys-dropdown").eq(i).find(">.ys-dropdown-menus-Infinite"),m)
        }else
            t.append(`<div class="ys-dropdown${d.event?' '+d.event:''}${m.on?' ys-on':''}"><div class="ys-dropdown-title"><a href="${m.href||j}" post="${m.post||j}">${m.tit}</a></div>`)
    }
}
// headerNav其实就是 ys-dropdown  所以对应事件定义在了ys-dropdown中，下面是按钮组导航
$(document).on('click','.ys-headerNav-icons>a',function () {
    $(this).addClass("ys-on").siblings().removeClass("ys-on")
    routerClick($(this),$(this).parents(".ys-headerNav-icons"))
})
export default  headerNav