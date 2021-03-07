import $ from "../jquery"
import {getCirclePoints, getDirectionInClient, isON} from "../utils"
import drag from "../drag"
import popover from "../popover"
const  robot = {
    render:d =>{
        const  t = new robot.robot(d)
        t.initBody(t).initMenus(t).bindMenus(t).bindMove(t)
        if(t.d.done) t.d.done(t.el)
        return t
    },
    robot:function (d) {
        const  t =this,_p = robot.robot.prototype
        t.d = d
        _p.initBody = t =>{
            t.trigger = t.d.trigger || 'click'
            t.el = $(t.d.name).addClass('ys-init-box left-to-right')
            t.el.css({width:t.d.size[0]||150,height:t.d.size[1]||150,top:t.d.position[1]||100,left:t.d.position[0]||100,})
            t.el.append(`<div class="ys-robot-main"></div>`)
            t.body = t.el.find(".ys-robot-main").addClass("ys-absolute-container")
            t.body.append(t.d.body)
            return t
        }
        _p.initMenus = t=>{
            if(t.d.menus) t.el.append("<div class='ys-robot-menus'></div>")
            t.menus = t.el.find(".ys-robot-menus")
            for(let i = 0;i<t.d.menus.length;i++){
                t.menus.append(`<div class="ys-robot-menu-item ys-hover-shadow">${t.d.menus[i]}</div>`)
            }
            t.menuItem = t.menus.find(".ys-robot-menu-item").css({width:t.d.menuSize[0]||100,height:t.d.menuSize[1]||100})
            robot.hideMenus(t)
            t.menuItem.click(function () {
               if(t.d.menuClick) t.d.menuClick(t,$(this).index())
            })
            return t
        }
        _p.bindMenus =function () {
            if(t.trigger === 'mouseenter'){
                t.body.mouseenter(()=> robot.showMenus(t)).mouseleave(()=> robot.hideMenus(t))
            }else {
                t.body.on(t.trigger,function () {
                    const  $t =$(this)
                    if(isON($t,'ys-on')){
                        robot.hideMenus(t)
                        $t.removeClass('ys-on')
                    }else{
                        robot.showMenus(t)
                        $t.addClass('ys-on')
                    }
                })
            }
            return t
        }
        _p.bindMove= t =>{
            if(t.d.movable)
                drag.toThere({container:window,name:t.d.name,
                    onStart:()=> $("body").append("<div class='ys-drag-layer-temp ys-fix-container'></div>"),
                    onMove:()=>  t.pop?t.pop.fixPosition():'',
                    onEnd:()=> $(".ys-drag-layer-temp").remove()
                })
            return t
        }
    },
    showMenus:t => {
        const list = getCirclePoints(t.d.menusR,0, 0, t.d.menus.length)
        t.menuItem.each((i,e)=> $(e).css({opacity:1, transform:'scale(1)', left:list[i].x-(t.d.menuSize[0]||100)/2, top:list[i].y-(t.d.menuSize[1]||100)/2,}))
    },
    hideMenus:t => t.menuItem.each((i,e)=> $(e).css({transform:'scale(0)', opacity:0, left:-(t.d.menuSize[0]||100)/2, top:-(t.d.menuSize[1]||100)/2,})),
    message:(t,msg) => {
        if(msg){
            t.pop = popover({
                name:t.d.name,
                position:getDirectionInClient(t.body)[0] === 'right'?'left':'right',
                theme:"blue",
                event:'none',
                content:msg,
                tit:"<span>标题</span>"
            }).fadeIn(200)
        }else{
            if(t.pop) t.pop.fadeOut(200).remove()
        }
    }
}
export default robot