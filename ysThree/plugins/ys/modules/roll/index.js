import $ from "../jquery"
const roll = data =>{
    let sc=$(data.name)
    if(data.type&&data.type==='scroll'){
        let i=0
        if(data.direction==='horizontal'){
            sc.addClass('ys-nowrap')
            let sl=function(){
                sc.scrollLeft(i)
                if(i>sc.scrollLeft()+3){//+3是为了防止谷歌浏览器丢失精度
                    sc.scrollLeft(0)
                    i=0
                }
                i++
            }
            let st=setInterval(sl,data.speed)
            sc.mouseenter(()=> clearInterval(st)).mouseleave(()=> st=setInterval(sl,data.speed))
            return st
        }
        else{
            let sl=function(){
                sc.scrollTop(i)
                if(i>sc.scrollTop()+3){
                    sc.scrollTop(0)
                    i=0
                }
                i++
            }
            let st=setInterval(sl,data.speed)
            sc.mouseenter(()=> clearInterval(st)).mouseleave(()=> st=setInterval(sl,data.speed))
            return st
        }
    }else{
        let d=sc.find(">div")
        d.css({position:'absolute', top:0, left:0})
        let ani1,ani2,L,T
        if(data.direction==='horizontal'){
            sc.addClass('ys-nowrap')
            L=-d.innerWidth()+sc.innerWidth()+data.offset
            ani1= {left:L}
            ani2= {left:0}
        }else{
            T=-d.innerHeight()+sc.innerHeight()+data.offset
            ani1= {top:T}
            ani2= {top:0}
        }
        function f(t){
            d.animate(ani1,t,'linear',()=> {
                d.css(ani2)
                f(data.time)
            })
        }
        f(data.time)
        sc.mouseenter(()=> d.stop()).mouseleave(()=> f(data.direction==='horizontal'?((data.time/L)*(L-parseFloat(d.css("left")))):((data.time/T)*(T-parseFloat(d.css("top"))))))
    }
}
export default  roll