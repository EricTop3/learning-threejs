import $ from "../jquery"
const  parallax = d =>{
    let el = $(d.name),box = el.find('.parallax-wrap'),L = box.length,F = true,LD = 'left-data'
    box.each((i,e)=> $(e).css('width',100*L+'%').attr(LD,0))
    setInterval(() => {
        if(F) go()
    },3000)
    const  go = ()=>{
        box.each((i,e)=>{
            let l = (parseInt($(e).attr(LD))+ 100/L*(i+1))
            if(i===0 && l > (100/L)*(L-1)){
                box.animate({left: 0},1000).attr(LD,0)
                return false
            }else 
                $(e).animate({left: -l +'%'},1000).attr(LD,l)
        })
    }
    const reverse = ()=>{
        box.each((i,e)=> {
            let l = (parseInt($(e).attr(LD))- 100/L*(i+1))
            if(i===0 && parseInt($(e).attr(LD)) === 0){
                box.each((i,e)=> $(e).animate({left: - (100/L)*(i+1)*(L-1)+'%'},1000).attr(LD,(100/L)*(i+1)*(L-1)))
                return false
            }else
                $(e).animate({left: -l +'%'},1000).attr(LD,l)
        })
    }
    if(d.mouseStop) el.mouseenter(()=> {F = false}).mouseleave(()=>{F = true})
    if(d.arrow) el.append(` <span class="parallax-arrow parallax-arrow-left ys-hover"><i class="ys-icon ys-icon-left"></i></span><span class="parallax-arrow parallax-arrow-right ys-hover"><i class="ys-icon ys-icon-right"></i></span>`)
    el.find('.parallax-arrow-left').click(() => go()).siblings('.parallax-arrow-right').click( () => reverse())
    el.fadeIn(200)
}
export default  parallax