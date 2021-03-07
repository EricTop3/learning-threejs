import $ from "../jquery"
import {stopDefault} from "../utils"
const $win = $(window)
const slide = {
    render:d =>{
        let t =new slide.slide(d)
        t.init(t).bindInput(t).bindClick(t).bindHover(t).bindDrag(t)
        return t
    },
    slide:function (d) {
        let t= this,_p = slide.slide.prototype // prototype 针对函数 (F.prototype) ===  t.__proto__ 针对对象 （this.__proto__）
        t.el = $(d.name)
        t.d = d
        t.max = d.max || 100
        t.min = d.min || 0
        t.Y = t.d.type === 'vertical'
        t.value = t.d.range?(t.d.value || [t.min,t.min]):([t.d.value||t.min])
        if(!t.d.formatTips) t.d.formatTips = res => res
        _p.init = t =>{
            if(t.Y) t.el.addClass('ys-slide-vertical')
            if(t.d.disabled) t.el.addClass('ys-disabled')
            t.el.append(`
                    <div class="ys-slide-control" control="0"></div> ${t.d.range?'<div class="ys-slide-control" control="1"></div>':''}
                    <div class="ys-slide-bar-box"><div class="ys-slide-bar"></div></div>
                     <div class="ys-slide-tips"></div>${t.d.range?'<div class="ys-slide-tips"></div>':''}
                   `)
            if(t.d.step){
                let s =''
                for(let i =1 ;i<t.d.step;i++){
                    s =s +`<span style="${t.Y?'bottom':'left'}:${100/(t.d.step)*i +'%'}"></span>`
                }
                t.el.prepend(`<div class="ys-slide-steps"> ${s}</div>`)
            }
            if(t.d.input){
                t.el.append(`<div class="ys-slide-input-box"> <input class="ys-input ys-slide-input" placeholder="" value="${t.value[0]}" type="number"/> <div class="ys-slide-input-btns"> <span class="ys-icon ys-icon-up"></span> <span class="ys-icon ys-icon-down"></span> </div> </div>`)
            }
            if(t.d.marks){
                let s ='',m = t.d.marks,s1 ='',style =''
                for(let i = 0;i<m.length;i++){
                    s =s +`<span style="${t.Y?'bottom':'left'}:${parseInt(((m[i].value/(t.max-t.min))+t.min)*100) +'%'}"></span>`
                    style =''
                    for(let k in m[i].style){style = style+k+":"+m[i].style[k]+";"}
                    s1 = s1 + `<span  style="${t.Y?'bottom':'left'}:${parseInt(((m[i].value/(t.max-t.min))+t.min)*100) +'%'};${style}">${m[i].label}</span>`
                }
                t.el.append(`<div class="ys-slide-marks"> ${s}</div><div class="ys-slide-markLabel"> ${s1}</div>`)
            }
            //存储dom
            t.control = t.el.find('.ys-slide-control')
            t.pop = t.el.find('.ys-slide-tips')
            t.bar = t.el.find('.ys-slide-bar')
            t.input =  t.el.find('.ys-slide-input')
            t.btns = t.el.find(".ys-slide-input-btns span")
            t.el.fadeIn(200)
            if(t.d.theme) {
                t.bar.css('background-color',t.d.theme)
                t.control.css('border-color',t.d.theme)
            }
            slide.initVal(t)
            return t
        }
        _p.bindDrag = t =>{
            if(t.d.disabled) return false
            let can = false,y0,left,rL,W ,pre,$t,v
            t.control.mousedown(function (e) {
                $t = $(this)
                can = true
                y0  = t.Y?e.pageY:e.pageX //1
                left = parseFloat($t.css(t.Y?'bottom':'left'))
                W = t.Y? $t.parent().height():$t.parent().width()
            })
            $win.mousemove(function (e) {
                if(can){
                    stopDefault(e)
                    rL = t.Y?(left + y0 -e.pageY):(left + e.pageX -y0)
                    if(rL<0){
                        pre = 0
                    }else if(0<=rL && rL<= W){
                        pre = parseInt(rL/W * 100)
                    }else if(W<rL){
                        pre = 100
                    }
                    pre = t.d.step?slide.transStep(t,pre):pre
                    v  =  parseInt(pre/100*(t.max-t.min)+t.min)
                    t.Y ? $t.css('bottom',pre + '%'):$t.css('left',pre + '%')
                    t.value[parseInt($t.attr('control'))] = v
                    slide.changeBar(t,pre).valInput(t,v).valPop(t)
                    if(t.d.changing) t.d.changing(t.value)
                }
            }).mouseup(()=>{
                if(can&&t.d.change) t.d.change(t.value)
                can = false
            })
            return t
        }
        _p.bindInput = t =>{
            if(t.d.disabled) return false
            let v
            t.input.on('input propertychange',function () {
                slide.inputIt(t,v)
                if(t.d.changing) t.d.changing(t.value)
            })
            t.btns.click(function () {
                v = parseInt(t.input.val()) + (($(this).index() === 0) ?  1 : -1)
                v = (v>t.max?t.max:(v<t.min?t.min:v))||t.min
                t.input.val(v)
                slide.inputIt(t,v)
                if(t.d.changing) t.d.changing(t.value)
            })
            return t
        }
        _p.bindClick = t =>{
            if(t.d.disabled) return false
            t.el.find('.ys-slide-bar-box').click(function (e) {
                let i,str = t.Y?'bottom':'left',str2 = t.Y?'height':'width',
                pre = t.Y?((t.el.innerHeight() - e.clientY + t.el[0].getBoundingClientRect().top)/t.el.innerHeight()):((e.clientX - t.el[0].getBoundingClientRect().left)/t.el.innerWidth())
                pre = t.d.step?(slide.transStep(t,pre*100)/100):pre
                i = t.d.range?((Math.abs(pre*100 - slide.getControlPre(t,0,str,str2))>  Math.abs(pre*100 - slide.getControlPre(t,1,str,str2)))?1:0):0
                slide.setControlPre(t,i,str,pre)
                t.value[i] = parseInt((t.max - t.min)* pre) + t.min
                slide.changeBar(t,pre*100).valInput(t, t.value[0]).valPop(t)
            })
            return t
        }
        _p.bindHover = t =>{
            t.control.mouseenter(() => t.pop.stop().fadeIn(200)).mouseleave( () => t.pop.stop().fadeOut(200))
            return t
        }
    },
    valInput: (t,v) =>{
        t.input.val(v)
        return slide
    },
    valPop: t =>{
        t.pop.each((i,e)=> $(e).html(t.d.formatTips(t.value[i])).css(t.Y?'bottom':'left',t.control.eq(i).css(t.Y?'bottom':'left')).css('margin-left',- parseInt($(e).innerWidth()/2)))
        return slide
    },
    changeBar: (t,pre) =>{
        let r,c
        if(t.Y){
            r = t.d.range ? slide.getMinPre(t,'bottom','height') :''
            c = t.d.range ? {'bottom':r[0],'height':r[1]} : {'height':pre + '%'}
        }else{
            r = t.d.range ? slide.getMinPre(t,'left','width') :''
            c = t.d.range ? {'left':r[0],'width':r[1]} : {'width':pre + '%'}
        }
        t.bar.css(c)
        return slide
    },
    initVal: t =>{
        const pre = v =>parseInt((v-t.min)/(t.max-t.min)*100)
        t.Y? t.control.each((i,e)=> $(e).css('bottom',pre(t.value[i])+'%')):t.control.each((i,e)=> $(e).css('left',pre(t.value[i])+'%'))
        return  slide.changeBar(t,pre(t.value[0])).valPop(t)
    },
    inputIt: t =>{
        let v = t.input.val()
        v = (v>t.max?t.max:(v<t.min?t.min:v))||t.min
        t.value[0] = v
        return  slide.initVal(t)
    },
    getMinPre: (t,str,str2) =>{
        const a = parseFloat(t.control.eq(0).css(str)) ,b =  parseFloat(t.control.eq(1).css(str)), c = (Math.abs((a - b)))/(parseFloat(t.control.parent().css(str2)))*100+ '%'
        return [a<b?a:b,c]
    },
    getControlPre: (t,i,str,str2) => parseFloat(t.control.eq(i).css(str))/(parseFloat(t.control.parent().css(str2)))*100,
    setControlPre: (t,i,str,pre) => t.control.eq(i).css(str,pre*100 +'%'),
    transStep:(t,pre) =>{
        const s0 = Math.round(pre*t.d.step/100)*100/t.d.step
        return (pre - s0>50/t.d.step)?s0+100/t.d.step:s0
    }
}
export default slide