import $ from "../jquery"
const ON ={'width': '60%', 'opacity': 1, 'left':'20%', 'top':0, 'height':'100%','z-index':3},
    BEFORE ={'width': '50%', 'opacity': 1, 'left':0, 'top':'10%', 'height':'80%','z-index':2},
    AFTER ={'width': '50%', 'opacity': 1, 'left':'50%', 'top':'10%', 'height':'80%','z-index':2},
    NORMAL ={'width': '50%', 'opacity': 0, 'left':'50%', 'top':'10%', 'height':'80%','z-index':1}
const swiper ={
    render:d =>{
        let t = new swiper.swiper(d)
        t.init(t).hoverStop(t).bindEvent(t)
    },
    swiper:function (d) {
        const  t = this,_p = swiper.swiper.prototype
        t.d = d
        _p.init = t =>{
            let el = $(d.name)
            t.el = el
            t.childs = el.find(".ys-swiper-item")
            t.Len = t.childs.length
            t.can = true
            t.speed = t.d.speed||300
            t.during = t.d.during||5000
            t.onIndex = 0
            if(d.type!=='card'){
                if(d.direction==='vertical'){
                    el.addClass('ys-swiper-vertical')
                    t.childs.each((i,e)=> $(e).css('top',(i-1)*100+'%').attr('data-top',i-1))
                    t.toBottom(t)
                    if(t.d.autoplay !== false) setInterval(()=>{if(t.can) t.toTop(t)},t.during)
                }else{
                    el.addClass('ys-swiper-horizontal')
                    t.childs.each((i,e)=> $(e).css('left',(i-1)*100+'%').attr('data-left',i-1))
                    t.toRight(t)
                    if(t.d.autoplay !== false) setInterval(()=>{if(t.can) t.toLeft(t)},t.during)
                }
            }else{
                t.el.addClass('ys-swiper-card ys-swiper-horizontal')
                if (t.Len <=2)  el.html( '<h1  style="color:red;text-align: center">card模式要求轮播个数至少3个</h1>')
                t.childs.each((i,e)=> {
                    if(i === 0) $(e).css(ON)
                    else if(i === 1) $(e).css(AFTER)
                    else if(i === t.Len -1) $(e).css(BEFORE)
                })
                if(t.d.autoplay !== false) setInterval(()=>{if(t.can) t.toLeftCard(t)},t.during)
            }
            el.fadeIn(200)
            if(t.d.indicator!==false){
                let s =''
                for(let i = 0;i<t.Len;i++){s = s + `<span></span>`}
                t.el.append(`<div class="ys-swiper-indicators">${s}</div>`)
                let ind =  t.el.find('.ys-swiper-indicators')
                d.direction==='vertical'? ind.css('margin-top',-parseFloat(ind.height())/2):ind.css('margin-left',-parseFloat(ind.width())/2)
                ind.find(">span").eq(0).addClass("ys-on")
            }
            if(t.d.arrow!==false)
                t.el.append(d.direction==='vertical'? '<span class="ys-swaper-arrow ys-swaper-arrow-up"><i class="ys-icon ys-icon-up"></i></span><span class="ys-swaper-arrow ys-swaper-arrow-down"><i class="ys-icon ys-icon-down"></i></span>':'<span class="ys-swaper-arrow ys-swaper-arrow-left"><i class="ys-icon ys-icon-left"></i></span><span class="ys-swaper-arrow ys-swaper-arrow-right"><i class="ys-icon ys-icon-right"></i></span>')
            return t
        }
        _p.toLeft = t =>{
            t.childs.each((i,e)=> {
                let x = parseInt($(e).attr('data-left'))
                if(x === -1) {
                    $(e).css({left:(t.Len-2)*100+'%'}).attr('data-left',t.Len-2)
                    swiper.changeOn(t,x-1,i)
                }
                else{
                    $(e).animate({left:(x-1)*100+'%'},t.speed,() =>{
                        swiper.changeOn(t,x-1,i)
                    }).attr('data-left',x-1)
                }
            })
        }
        _p.toRight = t =>{
            t.childs.each((i,e)=> {
                let x = parseInt($(e).attr('data-left'))
                if(x === t.Len-2){
                    $(e).css({left:'-100%'}).attr('data-left',-1)
                    swiper.changeOn(t,x+1,i)
                }
                else{
                    $(e).animate({left:(x+1)*100+'%'},t.speed,() =>{
                        swiper.changeOn(t,x+1,i)
                    }).attr('data-left',x+1)
                }
            })
        }
        _p.toTop = t =>{
            t.childs.each((i,e)=> {
                let x = parseInt($(e).attr('data-top'))
                if(x === -1){
                    $(e).css({top:(t.Len-2)*100+'%'}).attr('data-top',t.Len-2)
                    swiper.changeOn(t,x-1,i)
                }
                else {
                    $(e).animate({top:(x-1)*100+'%'},t.speed,() =>{
                        swiper.changeOn(t,x-1,i)
                    }).attr('data-top',x-1)
                }
            })
        }
        _p.toBottom = t =>{
            t.childs.each((i,e)=> {
                let x = parseInt($(e).attr('data-top'))
                if(x === t.Len-2) {
                    $(e).css({top:'-100%'}).attr('data-top',-1)
                    swiper.changeOn(t,x+1,i)
                }
                else {
                    $(e).animate({top:(x+1)*100+'%'},t.speed,() =>{
                        swiper.changeOn(t,x+1,i)
                    }).attr('data-top',x+1)
                }
            })
        }
        _p.hoverStop = t =>{
            t.el.mouseenter(()=> t.can = false).mouseleave(()=>t.can = true)
            return t
        }
        _p.bindEvent = t =>{
            t.el.mouseenter(function () {$(this).find(".ys-swaper-arrow").fadeIn(300)}).mouseleave(function () {$(this).find(".ys-swaper-arrow").fadeOut(200)})
            if( t.d.type === 'card'){
                t.el.find('.ys-swaper-arrow-right').click(()=> t.toRightCard(t))
                t.el.find('.ys-swaper-arrow-left').click(()=> t.toLeftCard(t))
                t.el.find('.ys-swiper-indicators span').click(function () {
                    let  i = $(this).index()
                    if(i === t.onIndex) return
                    let n = i - t.onIndex
                    n>0? swiper.jump(t,n,t.toLeftCard):swiper.jump(t,-n,t.toRightCard)
                })

            }else{
                t.el.find('.ys-swaper-arrow-down').click( ()=>t.toTop(t))
                t.el.find('.ys-swaper-arrow-up').click(() => t.toBottom(t))
                t.el.find('.ys-swaper-arrow-right').click(()=> t.toLeft(t))
                t.el.find('.ys-swaper-arrow-left').click(()=> t.toRight(t))
                t.el.find('.ys-swiper-indicators span').click(function () {
                    let  i = $(this).index()
                    if(i === t.onIndex) return
                    let n = i - t.onIndex
                    if(t.d.direction === 'vertical') n>0? swiper.jump(t,n,t.toTop):swiper.jump(t,-n,t.toBottom)
                    else n>0? swiper.jump(t,n,t.toLeft):swiper.jump(t,-n,t.toRight)
                })
            }
            return t
        }
        _p.toLeftCard = t =>{
            let n = 1 ,m
            t.childs.each((i,e)=> {
                if(i === t.onIndex){
                    m = $(e)
                    if(i === 0) swiper.cardChange(t.childs.eq(t.Len-1),m,m.next(),m.next().next(),t) //normal on-before on  on-after
                    else if(i === t.Len -2) swiper.cardChange(m.prev(),m, m.next(),t.childs.eq(0),t)
                    else if(i === t.Len -1){
                        swiper.cardChange(m.prev(),m,t.childs.eq(0),t.childs.eq(1),t)
                        n =  - t.Len +1
                    }else swiper.cardChange(m.prev(),m, m.next(),m.next().next(),t)
                }
            })
            t.onIndex = t.onIndex + n
        }
        _p.toRightCard = t =>{
            let n = -1 ,m
            t.childs.each((i,e)=> {
                if(i === t.onIndex){
                    m = $(e)
                    if(i === 0) {
                        swiper.cardChange(m.next(),t.childs.eq(t.Len-2),t.childs.eq(t.Len-1),m,t)//normal on-before on  on-after
                        n = t.Len -1
                    }
                    else if(i === 1) swiper.cardChange(m.next(),t.childs.eq(t.Len-1), m.prev(),m,t)
                    else if(i === t.Len -1) swiper.cardChange(t.childs.eq(0),m.prev().prev(),m.prev(),m,t)
                    else swiper.cardChange(m.next(),m.prev().prev(),m.prev(),m,t)
                }
            })
            t.onIndex = t.onIndex + n
        }
    },
    changeOn:(t,x,i)=>{
        if(x === 0) {
            t.onIndex = i
            swiper.changeYsOn(t)
        }
    },
    changeYsOn:t => {
        t.el.find('.ys-swiper-indicators span').eq(t.onIndex).addClass('ys-on').siblings().removeClass("ys-on")
        if(t.d.change) t.d.change(t.onIndex)
    },
    jump:(t,n,f) =>{
        for(let i= 0;i<n;i++){f(t)}
    },
    cardChange:(a,b,c,d,t)=>{
        a.animate(NORMAL,t.speed)
        b.animate(BEFORE,t.speed)
        c.animate(ON,t.speed)
        d.animate(AFTER,t.speed,()=> swiper.changeYsOn(t))
    }
}
export default swiper