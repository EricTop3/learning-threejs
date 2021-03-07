import $ from "../jquery"
import  popover from "../popover"
import {fixPosition} from "../utils"
import  message from "../message"
const B = $('body')
const driver = {
    render:d=>{
        let t = new driver.driver(d)
        t.init(t)
    },
    driver:function (d) {
        let t = this ,_p =driver.driver.prototype
        t.d = d
        t.index = 0
        t.pop = undefined
        t.h = t.d.highlight
        _p.init= t =>{
            B.append(`<div class="ys-fix-container ys-driver" id = ${'ys-driver'+t.d.name}></div>`)
            t.driver = B.find("#"+'ys-driver'+t.d.name)
            if(t.h){
                B.append(`<div class='ys-driver-highlight' id = ${'ys-driver-highlight'+t.d.name}></div>`)
                t.hel = B.find("#"+'ys-driver-highlight'+t.d.name).css('background-color',t.d.highlight)
            }
            driver.fixHigh(t,()=>driver.onIt(t,t.d.steps[0]))
            $(window).resize(()=>driver.resize(t))
            $(document).scroll(()=>driver.resize(t))
            t.hel.show(0)
            return t
        }
        _p.bindEvent = t =>{
            t.close.click(function () {
                driver.removeOn(t)
                t.driver.remove()
                t.pop.remove()
                t.hel.remove()
            })
            t.pre.click(function () {
                if(t.index === 0) return  message({icon:'cry',msg:'此环节不该有上一步'})
                driver.removeOn(t)
                t.pop.remove()
                t.index = t.index -1
                driver.fixHigh(t,()=>driver.onIt(t,t.d.steps[t.index]))
            })
            t.next.click(function () {
                if(t.index === t.d.steps.length-1){
                    t.driver.remove()
                    t.pop.remove()
                    t.hel.remove()
                    return false
                }
                driver.removeOn(t)
                t.pop.remove()
                t.index = t.index +1
                driver.fixHigh(t,()=>driver.onIt(t,t.d.steps[t.index]))
            })
        }
    },
    onIt:(t,s)=>{
        let pop = popover({
            name:s.name,
            position:s.position,
            theme:s.theme,
            content:s.description,
            tit:s.tit,
            offset:s.offset||8,
            width:s.width||250,
            event:'none'
        }), BTN = "ys-btn ys-btn-sm ys-btn-primary",close = s.close?`<span class="ys-driver-close ${BTN}">${s.close}</span>`:'',
            pre= s.previous? `<span class="ys-driver-pre ${BTN}"><i class="ys-icon ys-icon-left-2"></i>${s.previous}</span>`:'',
            next = s.next? `<span class="ys-driver-next ${BTN}">${s.next} ${t.index === t.d.steps.length-1?'':'<i class="ys-icon ys-icon-right-2"></i>'}</span>`:''
        pop.css({zIndex:99992}).append(`<div class="ys-driver-btns clearfix">${close} <span class="ys-driver-btns-right">${pre}${next}</span></div>`).fadeIn(200)
        fixPosition(s.position,pop,$(s.name),s.offset)
        t.pop = pop
        t.close = pop.find('.ys-driver-close')
        t.pre = pop.find('.ys-driver-pre')
        t.next = pop.find('.ys-driver-next')
        t.bindEvent(t)
        if(t.d.change) t.d.change(t.index)
        return driver
    },
    removeOn : t =>$(t.d.steps[t.index].name).removeClass('ys-driver-on'),
    fixHigh:(t,f)=>{
        let el =$(t.d.steps[t.index].name).addClass('ys-driver-on')
        t.hel.animate(driver.resizeObj(el),300,()=> f())
        return driver
    },
    resize:(t) =>{
        let el =$(t.d.steps[t.index].name)
        t.hel.css(driver.resizeObj(el))
        return driver
    },
    resizeObj:el=>{
        return {
            top:el[0].getBoundingClientRect().top - 3, left:el[0].getBoundingClientRect().left - 3, width:el.innerWidth() + 6, height:el.innerHeight() + 6
        }
    }
}
export default driver