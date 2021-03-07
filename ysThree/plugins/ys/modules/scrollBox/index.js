import $ from "../jquery"
const doc = $(document),scrollBox = {
    render:d=>{
        let t =  new scrollBox.scrollBox(d)
        return  t.init(t)
    },
    scrollBox:function (d) {
        let t = this,_p= scrollBox.scrollBox.prototype
        t.d = d
        t.el = $(d.name)
        t.sThis = t.el.find(">.ys-scroll-body>.ys-scroll-this")
        t.sBody = t.el.find(">.ys-scroll-body")
        _p.init = t =>{
            if(t.d.direction === 'horizontal'){
                t.el.addClass('horizontal-scroll')
                t.sThis.addClass('ys-nowrap')
            }else{
                t.el.addClass('vertical-scroll')
            }
            if(t.d.type === 'scroll'){
                let s1,s2,go = (scroll,n)=>{
                    scrollBox.clearAll(s1,s2)
                    s1= setInterval(function () {
                        t.d.direction === 'horizontal'?scroll.scrollLeft(scroll.scrollLeft() + n):scroll.scrollTop( scroll.scrollTop() + n)
                        s2 = setTimeout(function () {
                            scrollBox.clearAll(s1,s2)
                        },t.d.time||300)
                    },0)
                }
                doc.on('click',t.d.name+' .ys-to-left',()=> go(t.sBody,5)).on('click',t.d.name+' .ys-to-right',()=> go(t.sBody,-5))
            }else{
                t.sThis.attr('ys-translate',0)
                let go = (isX,left) =>{
                    if(isX){
                        let x = t.sBody.innerWidth(),x0 = parseFloat(t.sThis.attr('ys-translate')),X = t.sThis.innerWidth(),n
                        n = left? ((X- Math.abs(x0)) / x > 2?(x0-x):(x0 - ( parseFloat((X- Math.abs(x0))) - x))) : (x0 + x>0?0:x0+x)
                        t.sThis.css('transform',`translateX(${n+'px'})`).attr('ys-translate',n)
                    }else{
                        let x = t.sBody.innerHeight(),x0 = parseFloat(t.sThis.attr('ys-translate')),X = t.sThis.innerHeight(),n
                        n= left?((X- Math.abs(x0)) / x > 2 ? (x0-x): (x0 - (parseFloat((X- Math.abs(x0))) - x))):(x0 + x>0?0:x0+x)
                        t.sThis.css('transform',`translateY(${n+'px'})`).attr('ys-translate',n)
                    }
                }
                doc.on('click',t.d.name+' .ys-to-left',()=> t.d.direction === 'horizontal'? go(true,true):go(false,true)).on('click',t.d.name+' .ys-to-right',()=> t.d.direction === 'horizontal'? go(true,false):go(false,false))
            }
            scrollBox.resize(t)
            $(window).resize(()=>scrollBox.resize(t))
            return t
        }
    }
    ,resize : t => scrollBox.resizeScrollBox(t,t.d.direction === 'horizontal'?(t.sThis.innerWidth()>t.sBody.innerWidth()):(t.sThis.innerHeight()>t.sBody.innerHeight()))
    ,resizeScrollBox : (t,f) =>{
        if(f){
            if(t.el.find('.ys-to-icons').length === 0) t.el.append(` <span class="ys-to-left ys-to-icons"><i class="ys-icon ys-icon-left-3"></i></span><span class="ys-to-right ys-to-icons"><i class="ys-icon ys-icon-right-3"></i></span>`).addClass('ys-have-icons')
        }else t.el.removeClass('ys-have-icons').find('.ys-to-icons').remove()
        if(t.d.type !== 'scroll')
            t.sThis.css({'transform':`translateY(0) translateX(0)`}).attr('ys-translate',0)
    },
    clearAll: (s1,s2) =>{
        clearInterval(s1)
        clearTimeout(s2)
    }
}
export default scrollBox