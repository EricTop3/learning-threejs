import $ from "../jquery"
import {stopDefault} from "../utils"
const getX= (m,e) =>parseFloat(m==='touchstart'||m==='touchmove'?e.originalEvent.targetTouches[0].pageX:e.pageX)
const getY= (m,e) =>parseFloat(m==='touchstart'||m==='touchmove'?e.originalEvent.targetTouches[0].pageY:e.pageY)
const doc = $(document)
const drag = {
    toThere:(d)=>{
        let t,flog,x0, y0, left0, top0, x1,y1,xminus,yminus,left1,top1
        function f(m1,m2,m3) {
            $(d.name).css({'touch-action':'none'})
            doc.on(m1,d.name,function (e) {
                stopDefault(e)
                flog = true
                t=$(this)
                if(d.moveOther&&d.moveOther!=='')
                    t=$(d.moveOther)
                x0=getX(m1,e), y0=getY(m1,e), left0=parseFloat(t.css("left")), top0=parseFloat(t.css("top")), x1,y1, xminus,yminus, left1,top1;
                if(d.onStart) d.onStart(t)
            }).on(m2,d.container,function (e) {
                stopDefault(e)
                if(flog){
                    x1=getX(m1,e);y1=getY(m1,e);xminus=x1-x0;yminus=y1-y0;left1=left0+xminus;top1=top0+yminus;t.css({left:left1, top:top1,})
                    if(d.onMove) d.onMove(t)
                }
            }).on(m3,function (e) {
                stopDefault(e)
                if(flog && d.onEnd) d.onEnd(t)
                flog = false
            })
        }
        f('mousedown',"mousemove",'mouseup')
        f('touchstart','touchmove','touchend')
    },
    //滑动判断方向 支持手机端
    direction: d => {
        function f(m1,m3){
            $(d.name).css({'touch-action':'none'})
            let X0,Y0,X1,Y1,flog,t
            doc.on(m1,d.name,function (e) {
                stopDefault(e)
                t = $(this)
                X0=getX(m1,e)
                Y0=getY(m1,e)
                flog = true
            }).on(m3,function (e) {
                stopDefault(e)
                if(t&&flog){
                    X1=getX(m1,e)
                    Y1=getY(m1,e)
                    if(Math.abs(X0-X1)>5||Math.abs(Y0-Y1)>5){ //5px为手抖值
                        if(X0>X1&&(X0-X1>=Math.abs(Y0-Y1))&&d.toLeft) d.toLeft(t)
                        else if(X0<X1&&(Math.abs(X0-X1)>=Math.abs(Y0-Y1))&&d.toRight) d.toRight(t)
                        else if(Y0>Y1&&(Math.abs(X0-X1)<Math.abs(Y0-Y1))&&d.toTop) d.toTop(t)
                        else if(Y0<Y1&&(Math.abs(X0-X1)<Math.abs(Y0-Y1))&&d.toBottom) d.toBottom(t)
                    }
                }
                flog = false
            })
        }
        f('mousedown','mouseup');f('touchstart','touchmove')
        /*用touchmove事件获取终点坐标，而不是用touchend事件，是因为当你只是点击屏幕的时候，就会触发touchEnd事件，
        但是不会触发touchMove事件。这样会造成touchEnd中取得的endX，从而造成endY值不准确。比如先滑动再点击，可能同样会触发滑动事件。且touchend的e没有originalEvent.targetTouches[0]
        */
    },
    //拖拽resize
    resize: d =>{
        let t = $(d.name)
        t.append('<div class="ys-dragBar-bottom"></div><div class="ys-dragBar-right"></div><div class="ys-dragBar-br"></div>')
        function f(m1,m2,m3){
            t.css({'touch-action':'none'})
            {
                let x0, w0,flog
                doc.on(m1,d.name+' .ys-dragBar-right',function (e) {
                    stopDefault(e)
                    x0=getX(m1,e)
                    w0=parseFloat(t.css('width'))
                    flog = true
                }).on(m2,d.container,function (e) {
                    stopDefault(e)
                    if(flog) t.css({width:w0+getX(m1,e)-x0})
                }).on(m3,function (e) {
                    stopDefault(e)
                    if(flog&&d.callback) d.callback(t)
                    flog = false
                })
            }
            {
                let y0,h0,flog
                doc.on(m1,d.name+' .ys-dragBar-bottom',function (e) {
                    y0=getY(m1,e)
                    h0=parseFloat(t.css('height'))
                    flog = true
                }).on(m2,d.container,function (e) {
                    if(flog) t.css({height:h0+getY(m1,e)-y0})
                }).on(m3,function (e) {
                    stopDefault(e)
                    if(flog&&d.callback) d.callback(t)
                    flog = false
                })
            }
            {
                let x0, y0,w0,h0,flog
                doc.on(m1,d.name+' .ys-dragBar-br',function (e) {
                    stopDefault(e)
                    x0=getX(m1,e)
                    y0=getY(m1,e)
                    w0=parseFloat(t.css('width'))
                    h0=parseFloat(t.css('height'))
                    flog = true
                }).on(m2,d.container,function (e) {
                    stopDefault(e)
                    if(flog) t.css({width:w0+getX(m1,e)-x0,height:h0+getY(m1,e)-y0})
                }).on(m3,function (e) {
                    stopDefault(e)
                    if(flog&&d.callback) d.callback(t)
                    flog = false
                })
            }
        }
        f('mousedown',"mousemove",'mouseup')
        f('touchstart','touchmove','touchend')
    },
    //native drag
    native:d =>{
        const el =$(d.name).attr('draggable',true)
            ,container = $(d.container||d.name)
            ,other = $(d.other||d.name)
        el.on("dragstart",function (e) {
            d.start?d.start($(this)):''
        }).on('dragenter',function (e) {
            d.enter?d.enter($(this)):''
        }).on('dragleave',function (e) {
            d.leave?d.leave($(this)):''
        }).on("dragend",function (e) {
            d.end?d.end($(this)):''
        })
        container.on('dragover',function (e) {
            stopDefault(e)
            d.over?d.over($(this)):''
        })
        other.on('drop',function (e) {
            stopDefault(e)
            d.drop?d.drop($(this)):''
        })
    }

}
export default drag