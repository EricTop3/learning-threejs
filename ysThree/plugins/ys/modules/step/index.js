import $ from "../jquery"
const step = d =>{
    let el=$(d.name)
    if(d.data){
        let s = '',icon='',tit ='',tips  =''
        for(let i = 0;i<d.data.length;i++){
            icon = `<div class="ys-step-icon">${d.data[i].icon}</div>`
            tit = `<div class="ys-step-tit">${d.data[i].tit}</div>`
            tips = `<div class="ys-step-tips">${d.data[i].tips} </div>`
            s= s+ ` <div class="ys-step-box">${(d.direction === 'vertical'? icon+tit+tips:  tit+icon+tips)}</div>`
        }
        el.append(s)
    }
    let boxes = el.find(">.ys-step-box"),N =  boxes.length
    if(d.type ==='center') el.addClass("ys-steps-center")
    boxes.append('<div class="ys-step-line"><div class="ys-step-line-bar"></div></div>').eq(N-1).find('.ys-step-line').remove()
    if(d.direction === 'vertical'){
        el.addClass('ys-steps-vertical')
        boxes.addClass('clearfix')
    }else{
        el.addClass('ys-steps-normal clearfix')
        boxes.css({width:(100/N)+'%', minWidth:d.minWidth?d.minWidth:'auto', height:d.height?d.height:'auto'})
    }
    el.fadeIn(200)
}
export default step