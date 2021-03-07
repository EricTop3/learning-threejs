import $ from "../jquery"
import monitor from "../monitor"
import {stopDefault, each, isON, getTimestamp} from "../utils"
import message from "../message"
const DIS="disabled",YDIS="ys-disabled",YCL="ys-clearable",CLIC=`<i class="ys-icon ys-icon-close-2 ys-input-clear"></i>`,ON='ys-on',IR= 'isRender',YSB='ys-select-block',YCB='ys-checkbox-block',YRB='ys-radio-block',YSO='ys-select-options'
const form = {
    cfg:{
        rules:{
            required: [/[\S]+/, "必填项不能为空"],
            phone: [/^1\d{10}$/, "请输入正确的手机号"],
            email: [/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, "邮箱格式不正确"],
            url: [/(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/, "链接格式不正确"],
            date: [/^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/, "日期格式不正确"],
            id: [/(^\d{15}$)|(^\d{17}(x|X|\d)$)/, "请输入正确的身份证号"]
        },
        newRules:{},
        initValues:{}
    },
    inVal:{
        'text':(e,n,v)=> e.val(v),
        'select-one':(e,n,v)=> e.find(`+.${YSB}`).find(`dd[ys-value=${v}]`).mousedown(),
        'select-multiple':(e,n,v)=>{
            let vl=v.split(",")
            e.find(`+.${YSB}`).find(`dd`).each((i,e)=> {
                let a = $(e)
                if(isON(a,ON)) a.mousedown()
            })
            for(let i=0;i<vl.length;i++){
                e.find(`+.${YSB}`).find(`dd[ys-value=${vl[i]}]`).mousedown()
            }
        },
        'checkbox':(e,n,v)=> {
            let i = e.find(`+.${YCB}`)
            i.each((j,e)=> {
                if (v && !isON($(e),ON))
                    $(e).click()
                else if(!v && isON($(e),ON))
                    $(e).click()
            })
        },
        'radio':(e,n,v,t,o)=> {
            o.find(`[name=${n}]`).find(`+.${YRB}`).each((i,e)=>{
                if($(e).siblings(".ys-radio").attr('value') === v){
                    $(e).click()
                    return false
                }
            })
        }
    },
    render:s => {
        if(!s){
            [$(".ys-input"),$(".ys-textarea"),$(".ys-select"),$(".ys-checkbox"),$(".ys-radio")].forEach((o,i)=> {
                if(i===0||i===1) initOne(o,'input')
                if(i===2) initOne(o,'select')
                if(i===3) initOne(o,'checkbox')
                if(i===4) initOne(o,'radio')
            })
        }else{
            for(let v of s.split(",")){
                initOne($(`.ys-${v}`),v)
                if(v==='input') initOne($(`.ys-textarea`),'input')
            }
        }

        $(".ys-form").each(function (i,e) {
            let u = $(e).attr("ys-unique")
            if(!u) {
                u = "form-unique_"+getTimestamp()+parseInt(Math.random()*9999)+"_"+i
                $(e).attr("ys-unique",u)
            }
            if(!form.cfg.initValues[u]) form.cfg.initValues[u] = form.val(u)
        })
    },
    val:(m,j)=> {
        const obj=$(".ys-form["+'ys-unique='+m+"]")
        return obj.each(function() {
            let o=$(this)
            each(j,function(n, v) {
                let e = o.find('[name="' + n + '"]')
                if(e[0]&&e[0].type){
                    const t = form.inVal[e[0].type]?e[0].type:'text'
                    form.inVal[t](e,n,v,t,o)
                }
            })
        }),form.getVal(m)
    },
    getVal:(e,i)=> {
        i = i || $(".ys-form["+'ys-unique='+e+"]").eq(0)
        let a = {}, n = {}, l = i.find("input,select,textarea")
        return each(l,function(e, t) {
            if (t.name = (t.name || "").replace(/^\s*|\s*&/, ""), t.name) {
                if (/^.*\[\]$/.test(t.name)) {
                    var i = t.name.match(/^(.*)\[\]$/g)[0];
                    a[i] = 0 | a[i],
                        t.name = t.name.replace(/^(.*)\[\]$/, "$1[" + a[i]+++"]")
                }
                /^checkbox|radio$/.test(t.type) && !t.checked || (n[t.name] = t.value)
            }
        }),n
    },
    createElement:(e,str)=> {
        let obj = new form.element[str](e)
        for(let key in obj){
            if(key!=='cfg') obj[key]()
        }
    },
    verify:obj=> form.cfg.newRules=Object.assign(form.cfg.newRules,obj),
    extVer:(t,e)=>{
        if(t.cfg['ys-verify']){
            let arr=t.cfg['ys-verify'].split(",");let r=form.cfg.rules,es=e.siblings(".ys-input-error")
            for(let v of arr){
                if(r[v]){
                    if(testR(!r[v][0].test(e.val()),e,es,r[v][1])) return false
                }
                else message(`并未定义${v}这个规则`)
            }
        }
        if(form.cfg.newRules[t.cfg.name]){
            let r = form.cfg.newRules[t.cfg.name],es=e.parent().find(".ys-input-error")
            if( typeof r === "function") testR(r(e.val()),e,es,r(e.val()))
            else testR(!r[0].test(e.val()),e,es,r[1])
        }
    },
    on:(m,f)=> form.cfg[m]=[f],
    execute:obj=> form.cfg[obj.uniqueElement]?form.cfg[obj.uniqueElement][0](obj):false,
    executeOn:obj => form.cfg[obj.formUnique]?form.cfg[obj.formUnique][0](obj):false,
    reset:u => {
        const obj = form.val(u),oldObj = form.cfg.initValues[u]
        each(obj,i =>{ obj[i]= oldObj[i] ? oldObj[i]:''})
        form.val(u,Object.assign(obj, oldObj))
    },
    element:{
        input:function (el) {
            const t=this,e=$(el)
            t.cfg={}
            t.initParameters=()=> {
                t.cfg = Object.assign({},getPara(e))
                if(t.cfg.disabled) e.addClass(YDIS)
                if(t.cfg[YCL]&&e.find("+.ys-input-clear").length===0) e.after(CLIC)
            }
            t.bindEvent=c => {
                e.find("+.ys-input-clear").click(()=> {
                    if(isON(e,YDIS)) return false
                    e.val('')
                    if(c&&typeof c==="function") c($(this))
                })
                e.blur(()=> { //验证
                    form.extVer(t,e)
                    if(e.attr('name')){ let st= setTimeout(()=>{form.executeOn.call(t,{el:e,name:e.attr('name'),value:e.val(),formUnique:e.parents('.ys-form').attr('ys-unique')});clearTimeout(st)},200)} //延迟0.2秒是为了可能存在事件控件等点击事件
                })
            }
        },
        select:function (el) {
            const t=this,e=$(el)
            t.cfg={}
            t.initParameters=()=> {
                t.cfg = Object.assign({},getPara(e))
                t.cfg.clearableHtml = t.cfg[YCL]? CLIC:''
                t.cfg.valueList=[]
                t.cfg.textList=[]
            }
            t.initOptions=()=> {
                let opl=[],text='',opH=''
                e.find("option").each(function (i,o) {
                    let x=$(o)
                    opl.push({d:x.attr("disabled"),v:x.attr("value"),t:x.text(),s:x.attr("selected")})
                    if(t.cfg.multiple&&opl[i].s){
                        t.cfg.textList.push(opl[i].t)
                        t.cfg.valueList.push(opl[i].v)
                    }else{
                        t.cfg.value = opl[i].s?opl[i].v:t.cfg.value
                        t.cfg.text = opl[i].s?opl[i].t:t.cfg.text
                    }
                    opH=opH+`<dd ys-value="${opl[i].v}" class="${opl[i].d===DIS?YDIS:''}${opl[i].s==='selected'?' '+ON:''}">${opl[i].t}</dd>`
                })
                t.cfg.optionsHtml=`<div class=${YSB}><div class="ys-select-tit"><input class="ys-input${t.cfg.disabled?' '+YDIS:''}" placeholder="${opl[0].t}" readonly />${t.cfg.clearableHtml}<i class="ys-triangle-down"></i></div><dl class="${YSO} ys-init-box bottom-to-top">${opH}</dl></div>`
            }
            t.setRootSelect= () => e.html(t.cfg.multiple?`<option selected value="${t.cfg.valueList}">${t.cfg.textList}</option>`:`<option selected value="${t.cfg.value}">${t.cfg.text}</option>`)

            t.creatSelect= () => {
                if(e.find(`+.${YSB}`).length===0){
                    e.after(t.cfg.optionsHtml)
                    t.cfg.selectOptions = e.find(`+.${YSB} .${YSO}`)
                    t.cfg.input = e.find(`+.${YSB} .ys-input`)
                    t.cfg.input.val(t.cfg.multiple?t.cfg.textList:t.cfg.text)
                    t.cfg.dd = e.find(`+.${YSB} .${YSO} dd`)
                    if(t.cfg.disabled) t.cfg.input.attr("disabled",true)
                }
            }
            t.bindEvent=()=> {
                t.cfg.input.focus(()=> {
                    let y =t.cfg.selectOptions.siblings('.ys-select-tit')[0].getBoundingClientRect().top,H =$(window).height(),top = t.cfg.selectOptions.siblings('.ys-select-tit').height() + 8
                    top = y>H/2 ? -(t.cfg.selectOptions.height()+top-15):top
                    t.cfg.selectOptions.css('top',top).show(0).addClass("ys-init-box")
                    t.cfg.input.siblings(".ys-triangle-down").addClass("ys-rotateZ-180")
                })
                t.cfg.input.blur(()=> {
                    t.cfg.selectOptions.hide(0).removeClass("ys-init-box")
                    t.cfg.input.siblings(".ys-triangle-down").removeClass("ys-rotateZ-180")
                })
                t.cfg.dd.mousedown(function (el) {
                    const th=$(this)
                    if(isON(th,YDIS))
                        return false
                    else{
                        if(t.cfg.multiple){ //多选
                            stopDefault(el)
                            if(isON(th,ON)){
                                th.removeClass(ON)
                                t.cfg.valueList.splice(t.cfg.valueList.findIndex(item => item === th.attr("ys-value")), 1)
                                t.cfg.textList.splice(t.cfg.textList.findIndex(item => item === th.text()), 1)
                            }else{
                                th.addClass(ON)
                                t.cfg.valueList.push(th.attr("ys-value"))
                                t.cfg.textList.push(th.text())
                            }
                            e.html(`<option selected value="${t.cfg.valueList}">${t.cfg.textList}</option>`)
                            t.cfg.input.val(t.cfg.textList)
                        }else{ //单选
                            t.cfg.text=th.text()
                            t.cfg.value=th.attr("ys-value")
                            th.addClass(ON).siblings().removeClass(ON)
                            e.html(`<option selected value="${t.cfg.value}">${t.cfg.text}</option>`)
                            t.cfg.input.val(t.cfg.text)
                        }
                        if(t.cfg.unique) monitor.execute.call(t,t.cfg)
                        if(e.attr('name')) form.executeOn.call(t,{el:e,name:e.attr('name'),value:t.cfg.text,valueList:t.cfg.textList,formUnique:e.parents('.ys-form').attr('ys-unique')})
                        form.extVer(t,e)
                    }
                })
                let inp= new form.element['input'](t.cfg.input)
                inp.bindEvent(()=> {
                    t.cfg.text=''
                    t.cfg.value=''
                    t.cfg.textList=[]
                    t.cfg.valueList=[]
                    t.cfg.dd.removeClass(ON)
                    e.html(`<option  value=""></option>`)
                    t.cfg.input.val('')
                })
                t.cfg.input.attr(IR,'true')
            }
        },
        checkbox:function (el) {
            const t=this,e=$(el)
            t.cfg={}
            t.initParameters=()=> {
                t.cfg = Object.assign({},getPara(e))
                t.cfg['ys-tit'] = e.attr("ys-tit")?e.attr("ys-tit").split("|"):undefined
                t.cfg.value = e.val()
            }
            t.creatCheckbox=()=>{
                let ts=t.cfg.title?`<span>${t.cfg.title}</span>`:''
                if(t.cfg['ys-type'] === 'switch'){
                    e.after(`<div class="${YCB} ys-checkbox-switch${t.cfg.checked?' '+ON:''}${t.cfg.disabled?' '+YDIS:''}" title="${t.cfg.title?t.cfg.title:''}"><i></i><span>${t.cfg.checked?t.cfg['ys-tit'][0]:t.cfg['ys-tit'][1]}</span></div>`)
                }
                else
                    e.after(`<div class="${YCB}${t.cfg.checked?' '+ON:''}${t.cfg.disabled?' '+YDIS:''}"><i class="ys-icon ys-icon-ok-2"></i>${ts}</div>`)
                t.cfg.checkbox=e.find(`+.${YCB}`)
            }
            t.bindEvent=()=> {
                let c =t.cfg.checkbox,pN = [".ys-tree",".ys-data-table",".ys-transfer"]
                c.click(()=> {
                    if(t.cfg.disabled) return false
                    if(!isON(c,ON)){
                        c.addClass(ON)
                        e.prop("checked",true).attr("checked","checked").val("on")
                        if(t.cfg['ys-type']==='switch')
                            c.find("span").html(t.cfg['ys-tit'][0])
                        t.cfg.checked=true
                    }else{
                        c.removeClass(ON)
                        e.prop("checked",false).attr("checked",false).val(undefined)
                        if(t.cfg['ys-type']==='switch')
                            c.find("span").html(t.cfg['ys-tit'][1])
                        t.cfg.checked=false
                    }
                    t.cfg.value=e.val()
                    //监听单个
                    if(t.cfg.unique)
                        monitor.execute.call(t,t.cfg)
                    //监听注册的class(".ys-tree",".ys-data-table",".ys-transfer"等)
                    for(let i = 0;i<pN.length;i++){
                        let p =e.parents(pN[i])
                        if(p.length>0){
                            t.cfg.uniqueElement = p.attr("ys-unique")+'(checkbox)'
                            form.execute.call(el,t.cfg)
                        }
                    }
                    //监听form所有
                    if(e.attr('name'))
                        form.executeOn.call(t,{el:e,name:e.attr('name'),value:t.cfg.checked,formUnique:e.parents('.ys-form').attr('ys-unique')})
                })
            }
        },
        radio:function (el) {
            const t=this,e=$(el)
            t.cfg={}
            t.initParameters=()=> {
                t.cfg= Object.assign({},getPara(e))
                t.cfg.value = e.val()
            }
            t.creatRadio=()=> {
                e.after(`<div class="${YRB}${t.cfg.checked?' '+ON:''}${t.cfg.disabled?' '+YDIS:''}"><i class="scale-to-boom"></i> <span>${t.cfg.title}</span></div>`)
                t.cfg.radio=e.find(`+.${YRB}`)
            }
            t.bindEvent=()=> {
                let r=t.cfg.radio
                r.click(()=> {
                    if(t.cfg.disabled) return false
                       if(!isON(r,ON)){
                            r.addClass(ON).siblings().removeClass(ON).find("i").removeClass("ys-init-box")
                            r.find("i").addClass("ys-init-box")
                            e.prop("checked",true).attr("checked","checked")
                            e.siblings().prop("checked",false).attr("checked",false)
                            t.cfg.checked=true
                            if(t.cfg.unique)
                                monitor.execute.call(t,t.cfg)
                            if(e.attr('name'))
                                form.executeOn.call(t,{el:e,name:e.attr('name'),value:t.cfg.checked,formUnique:e.parents('.ys-form').attr('ys-unique')})
                        }
                })
            }
        }
    },
    setChecked:(e,c)=> c? e.attr('checked','checked').val('on').siblings('.ys-checkbox-block').addClass(ON):e.removeAttr('checked').val('').siblings('.ys-checkbox-block').removeClass(ON)
}
$(document).on('click',".ys-form .ys-btn[type=submit]",function (d) {
    stopDefault(d);const t=$(this),p=t.parents('.ys-form'),m=p.attr("ys-unique"),i = $(".ys-form["+'ys-unique='+m+"]").eq(0),l = i.find("input,select,textarea"),dm=$(this).attr("ys-unique")
    l.each(function (i,e) {
        let  t = $(e)[0];t.name = (t.name || "").replace(/^\s*|\s*&/, "")
        if (t.name!=='') {
            let v=$(t).attr("ys-verify"),val=$(t).val(),ru=form.cfg.rules,r = form.cfg.newRules[t.name]
            if(v){
                let ar = v.split(',')
                for(let x of ar){
                    if(!ru[x][0].test(val)){
                        message({msg:ru[x][1],icon:"cry", showType:"ys-shake-rotate"})
                        insertErr($(e),$(e).siblings(".ys-input-error"),ru[x][1])
                        return false
                    }
                }
            }
            if(r && typeof r ==="function"){
                if(r(val)){
                    message({msg:r(val),icon:"cry", showType:"ys-shake-rotate"})
                    insertErr($(e),$(e).siblings(".ys-input-error"),r(val))
                    return  false
                }
            }else if(r &&!r[0].test(val)){
                message({ msg:r[1],icon:"cry", showType:"ys-shake-rotate"})
                insertErr($(e),$(e).siblings(".ys-input-error"),r[1])
                return false
            }
        }
        if(i===l.length-1&&dm){
            if(monitor.execute.call(t,{unique: dm, obj:form.getVal(m)})!==false)
                p.submit()
        }
    })
}).on('click',".ys-form .ys-btn[type=reset]",function (e) {
    stopDefault(e)
    form.reset($(this).parents('.ys-form').attr('ys-unique'))
})
function insertErr(e,es,h) {
    if(e.siblings(".ys-input-error").length>0) es.html(h)
    else e.parent().append(`<span class='ys-input-error ys-init-box bottom-to-top'>${h}</span>`)
}
function testR(r,e,es,h) {
    if(r) return insertErr(e,es,h)
    else es.remove()
}
function getPara(e) {
    let arr=['name','readonly','ys-unique',DIS,'multiple','size',YCL,'ys-tit','ys-type','title','checked','ys-verify'],obj={}
    for(let v of arr){
        obj[v]=$(e).attr(v)
    }
    obj.unique=obj['ys-unique']
    return obj
}
function initOne(o,tar) {
    o.each((i,e)=> {
        if($(e).attr(IR)!=='true'){
            $(e).attr(IR,'true')
            form.createElement(e,tar)
        }
    })
}
export default form