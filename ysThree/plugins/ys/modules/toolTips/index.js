import $ from "../jquery"
const toolTips= data =>{
    data=data||{name:".ys-tooltips"}
    $(document).on("mouseenter",data.name,function(e) {
        let t = $(this),ht=data.content||t.html(),$W = $(window)
        if(t.innerWidth() === t[0].scrollWidth && t.attr('ys-still-show')!=='true') return false
        ht=t.attr("ys-tips")|| ht
        let w=data.width?parseInt(data.width)+"px":"300px",W=parseInt($W.width()),H=parseInt($W.height()),x =e.clientX,y =e.clientY //pageX是相对文档 clientX相对窗口
        const tit=data.tit?`<div class="ys-tit-sm">${data.tit}</div>`:''
        $("body").append(`<div class='ys-tooltips-layer' style="width:${w}">${tit}</div>`)
        const tipEl= $(".ys-tooltips-layer")
        tipEl.append(ht)
        let position={left:x+15, top:y+15}
        if(x<W/2&&y>H/2)
            position={left:x+15, top:y-15-parseInt(tipEl.innerHeight())}
        else if(x>W/2&&y<H/2)
            position={left:x-15-parseInt(w), top:y+15}
        else if(x>W/2&&y>H/2)
            position={left:x-15-parseInt(w), top:y-15-parseInt(tipEl.innerHeight())}
        tipEl.css(position).show(0)
        t.one("mouseleave",()=> tipEl.remove())
    })
}
export  default toolTips