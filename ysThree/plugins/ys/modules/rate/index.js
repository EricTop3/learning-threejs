import $ from "../jquery"
import {isON} from "../utils"
const  rate  ={
    render:d=>{
        let  t = new rate.rate(d)
        t.init(t).val(t,t.value)
        if(!t.d.readonly) t.binEvent(t)
    },
    rate : function (d) {
        let t =this,_p = rate.rate.prototype
        t.d = d
        _p.init = t =>{
            t.value = t.d.value || 0
            t.el = $(t.d.name)
            t.half = t.d.half?0.5:1
            t.number = t.d.data ? t.d.data.length : (t.d.number || 5)
            rate.hide(t.el)
            t.el.html('')
            for(let i = 0;i<t.number;i++ ){
                t.el.append(`<div class="ys-rate-box${t.d.data&&t.d.data[i].disabled?' ys-disabled':''}"> <i class="ys-icon ys-icon-star"></i> <i class="ys-icon ys-icon-star-full"></i></div>`)
            }
            t.el.append(`<div class="ys-rate-label"></div>`)
            t.star = t.el.find('.ys-rate-box')
            t.label = t.el.find(".ys-rate-label")
            t.d.theme? t.star.css('color',t.d.theme):''
            return t
        }
        _p.val = (t,v) =>{
            let color =  (t.d.data&&v>0)? t.d.data [Math.ceil(v-1)].color:undefined,label = (t.d.data&&v>0)? t.d.data [Math.ceil(v-1)].label:undefined
            for(let i = 0;i<v;i++ ){
                rate.show(t.star.eq(i)).css('width','100%')
                if((i < v)&&(i + 1 > v)) t.star.eq(i).find(".ys-icon-star-full:last-child").css('width', (v - i)*100 + '%')
            }
            if(color){
                t.star.find('.ys-icon').css('color',color)
                t.label.css('color',color)
            }
            t.label.html(label||'')
            return t
        }
        _p.binEvent = t =>{
            let $t
            t.star.mousemove(function (e) {
                $t = $(this)
                /* if(isON($t,'ys-disabled')) return false //if u need */
                rate.hide(t.star)
                t.val(t,rate.getV(t,$t,e,$t.index()+1))
            }).click(function (e) {
                $t = $(this)
                if(isON($t,'ys-disabled')) return false
                t.val(t,t.value = rate.getV(t,$t,e,$t.index()+1))
                t.d.change?t.d.change(t.value):''
            })
            t.el.mouseleave(() => {
                rate.hide(t.star)
                t.val(t,t.value)
            })
            return t
        }
        return t
    },
    show : e => e.find(".ys-icon-star-full").show(0),
    hide : e => e.find(".ys-icon-star-full").hide(0),
    getV : (t,el,e,i) => t.d.half?((el[0].getBoundingClientRect().left + el.width()/2)>e.clientX?i-0.5: i):i
}
export default  rate