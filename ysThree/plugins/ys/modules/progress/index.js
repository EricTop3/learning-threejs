import $ from "../jquery"
const  progress = {
    render : d =>{
        const t  = new progress.pro(d)
        return  t.init(t)
    },
    pro : function (d) {
        const t = this,_p = progress.pro.prototype
        t.el = $(d.name)
        t.d = d
        t.c = d.type === 'circle'|| d.type === 'dashboard'
        t.progressBackGround = '#efefef'
        t.barColor = t.d.barColor || '#14AE68'
        _p.init = t =>{
            if(t.c){
                t.el.addClass("ys-progress-circle")
                const type = t.d.type
                    ,width = t.el.innerWidth()
                    ,strokeWidth = t.d.barWidth
                    ,relativeStrokeWidth = (strokeWidth / width * 100).toFixed(1)
                    ,radius = parseInt(50 - parseFloat(relativeStrokeWidth) / 2, 10)
                    ,rate  = type === 'dashboard' ? 0.75 : 1
                    ,perimeter = 2 * Math.PI * radius
                    ,strokeDashoffset =`${-1 * perimeter * (1 - rate) / 2}px`
                t.perimeter= perimeter
                t.strokeDashoffset = strokeDashoffset
                t.rate = rate
                const trailPathStyle = `stroke-dasharray: ${(perimeter * rate)}px, ${perimeter}px;stroke-dashoffset: ${strokeDashoffset}`
                    ,circlePathStyle = progress.getCS(t,t.d.percent)
                    ,isDashboard = type === 'dashboard'
                    ,trackPath = `  
          M 50 50
          m 0 ${isDashboard ? '' : '-'}${radius}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '-' : ''}${radius * 2}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '' : '-'}${radius * 2}
          `,path = `<svg viewBox="0 0 100 100">
                       <path d=" ${trackPath} " stroke="${t.progressBackGround}" stroke-width="${relativeStrokeWidth}" fill="none" style="${trailPathStyle}"></path>
                       <path d=" ${trackPath} " stroke="${t.barColor}" stroke-linecap= 'round' stroke-width="${relativeStrokeWidth}" fill="none"  style="${circlePathStyle}"></path>
                     </svg>`
                t.el.html(path).append(t.d.tips?`<div class='ys-progress-circle-tips'>${t.d.tips}</div>`:'')
            }
            else{
                t.el.addClass("ys-progress").append("<div class='ys-progress-bar'></div>")
                progress.doNormal(t,t.d)
            }
            return t
        }
    },
    set : (t,d) => t.c?progress.setCircle(t,d):progress.doNormal(t,d)
    ,doNormal : (t,d) =>{
        const p = d.percent,
            s = d.tips ?`<span>${d.tips}</span>`:'',
            c = d.barColor||'#14AE68',
            bar = t.el.find(".ys-progress-bar")
        bar.html(s).css({ backgroundColor:c, width:p})
        t.el.attr("ys-percent",p).attr("ys-bar-color",c).find(".ys-progress-bar>span").css('top',-bar.height())
        if(d.tips) t.el.attr("ys-tips",d.tips)
    },
    setCircle:(t,d)=>{
        t.el.find('svg path').eq(1).attr('style',progress.getCS(t,d.percent)).attr("stroke",d.barColor || t.barColor)
        t.el.find(".ys-progress-circle-tips").html(d.tips)
    }
    ,getCS : (t,p) => `stroke-dasharray: ${t.perimeter * t.rate * ( parseFloat(p)/100) }px, ${t.perimeter}px; stroke-dashoffset: ${t.strokeDashoffset};transition: stroke-dasharray 0.6s ease 0s, stroke 0.6s ease `


}
export default progress