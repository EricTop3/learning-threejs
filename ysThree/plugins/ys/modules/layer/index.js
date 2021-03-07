import $ from "../jquery"
import drag from "../drag"
import {getTimestamp,ifPercent} from "../utils"
const layer = d =>{
    const el=$(d.name),doc=$(document),w=d.width||600,h=d.height||300,main=el.find(">.ys-layer-main"),S = 'ys-icon-full-screen',S1 = 'ys-icon-exit-screen',B='ys-layer-packed-box'
        , pe = d.packable?"<span class='ys-icon ys-icon-minus'></span>":'',
        ze = d .zoomable?`<span class='ys-icon ${S}'></span>`:'',
        ce = d.closeable?"<span class='ys-icon ys-icon-close'></span>":'',
        bid = d.name.substring(1,d.name.length)+getTimestamp(),
        tit = d.packTit?d.packTit:el.find(".layer-tit").html(),
        icons = !pe&&!ze&&!ce?'':`<div class="layer-icons">${pe+ze+ce}</div>`
    main.prepend(icons)
    main.css({width:w, height:h, marginLeft:-parseInt(w)/2, marginTop:-parseInt(h)/2}).addClass(`ys-init-box ${d.showType?d.showType:'scale-to-boom'}`)
    ifPercent(w,h,main)
    el.find(".ys-layer-main .ys-icon-close").click(()=> {
        el.hide()
        if(d.removeable) el.remove()
        $(bid).fadeOut(200,()=> $(bid).remove())
    })
    doc.on("click",d.name+` .layer-icons .${S}`,function () {
        $(this).removeClass(S).addClass(S1)
        main.animate({width:"100%", height:"100%", top:0, left:0, marginLeft:0, marginTop:0},200)
    }).on("click",d.name+` .layer-icons .${S1}`,function () {
        $(this).removeClass(S1).addClass(S)
        main.animate({width:w, height:h, marginLeft:w.toString().indexOf('%')!==-1? (100 - w.replace("%",""))/2+'%':-parseInt(w)/2, marginTop:-parseInt(h)/2, top:'50%', left:w.toString().indexOf('%')!==-1? 'auto':"50%"},200)
    }).on("click",d.name+" .layer-icons .ys-icon-minus",function () {
        if($('#'+bid).length===0){
            if($('.'+B).length>0) $('.'+B).append(`<div class="ys-ellipsis ys-tooltips" id="${bid}" pid="${d.name}">${tit}</div>`)
            else $('body').append(`<div class="${B}"><div class="ys-ellipsis ys-tooltips" id="${bid}" pid="${d.name}">${tit}</div></div>`)
        }
        el.hide()
    }).on('click','#'+bid,function () {
        let t=$(this)
        t.fadeOut(200,function (){t.remove()})
        $(t.attr('pid')).show()
        $('.ys-tooltips-layer').remove()
    })
    if(d.movable){
        el.find(".layer-tit").css('cursor','move')
        drag.toThere({container:"body", name:d.name+" .layer-tit", moveOther:d.name+" .ys-layer-main"})
    }
    if(d.resizeable) drag.resize({name:d.name+' .ys-layer-main', preventDefault:true})
}
const $layer = d =>{
    let id = 'ys-layer-'+parseInt(getTimestamp()+Math.random()*10000)
    d.name='#'+id
    d.removeable=true
    $('body').append(`<div class="ys-layer" id="${id}"><div class="ys-layer-main"><div class="layer-tit"><span>${d.tit}</span></div><div class="layer-con">${d.con}</div></div></div>`)
    layer(d)
    return $(d.name).show()
}
export  { layer, $layer }