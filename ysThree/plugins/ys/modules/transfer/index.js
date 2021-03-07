import $ from '../jquery'
import form from '../form'
import {isON} from "../utils"
const NODATA = `<div class="ys-no-data">NO DATA</div> `,TB= 'ys-checked-transfer-box',YTS = `ys-transfer-box-source`,YB='ys-transfer-body',HC=".ys-transfer-header .ys-checkbox"
const transfer = {
    cfg :{},
    render:d =>{
        d.sourceTit = d.sourceTit || 'Source'
        d.targetTit = d.targetTit || 'Target'
        d.source = d.source || []
        d.target = d.target || []
        let t  = new transfer.transfer(d)
        return  t.init(t).bindCheck(t).bindTransfer(t).bindSearch(t)
    },
    transfer:function (d) {
        let t = this ,el = $(d.name),_p = transfer.transfer.prototype,u=el.attr('ys-unique')
        if(u) t.unique = u
        else{
            t.unique = d.name
            el.attr('ys-unique',t.unique)
        }
        t.d = d
        t.el = el
        t.sChecked = []
        t.tChecked = []
        t.sdis = t.d.source.filter(e=>e.disabled).length
        t.rdis = t.d.target.filter(e=>e.disabled).length
        t.el.addClass('ys-form')
        _p.init = t =>{
            let  b = transfer.initBody(t)
            t.el.html(`${transfer.initOneBox(transfer.getTit(t.d.sourceTit),transfer.getInp(t),b.a,YTS)}  ${transfer.getBtns()} ${transfer.initOneBox(transfer.getTit(t.d.targetTit),transfer.getInp(t),b.b,'ys-transfer-box-target')}`)
            t.titDom = t.el.find('.ys-transfer-tit')
            if(t.d.showCount){
                t.titDom.eq(0).append(transfer.showCount(true,0,t.d.source.length))
                t.titDom.eq(1).append(transfer.showCount(true,0,t.d.target.length))
            }
            t.boxLeft = t.el.find(`.${YTS}`)
            t.boxRight = t.el.find('.ys-transfer-box-target')
            t.countDomLeft = t.boxLeft.find('.transfer-count span')
            t.countDomRight = t.boxRight.find('.transfer-count span')
            form.render('checkbox')
            t.el.fadeIn(200)
            return t
        }
        _p.bindCheck = t =>{
            form.on(t.unique+'(checkbox)',function (obj) {
                if(obj.checkbox.parents(`.${YTS}`).length>0)
                    transfer.changeBox(t,obj,t.d.source,t.boxLeft,t.sChecked,t.countDomLeft,t.el.find('.ys-transfer-btn').eq(0),'s')
                else
                    transfer.changeBox(t,obj,t.d.target,t.boxRight,t.tChecked,t.countDomRight,t.el.find('.ys-transfer-btn').eq(1),'t')
            })
            return t
        }
        _p.bindTransfer = t =>{
            t.el.find('.ys-transfer-btn').click(function () {
                if(isON($(this),'ys-btn-disabled')) return false
                if($(this).index()===0){
                    t.boxRight.find('.ys-no-data').remove()
                    t.boxRight.find(`.${YB}`).append(transfer.initOnesStr(t.sChecked))
                    t.boxLeft.find(`.${TB}`).remove()
                    t.d.source = t.d.source.filter(a=> t.sChecked.indexOf(a)===-1)
                    t.d.target.push(...t.sChecked)
                    t.sChecked = []
                }else{
                    t.boxLeft.find('.ys-no-data').remove()
                    t.boxLeft.find(`.${YB}`).append(transfer.initOnesStr(t.tChecked))
                    t.boxRight.find(`.${TB}`).remove()
                    t.d.target = t.d.target.filter(a=> t.tChecked.indexOf(a)===-1)
                    t.d.source.push(...t.tChecked)
                    t.tChecked = []
                }
                form.render('checkbox')
                form.setChecked(t.el.find(`${HC}`),false)
                $(this).addClass('ys-btn-disabled').removeClass("ys-transfer-btn-ok")
                t.countDomLeft.eq(0).html(0)
                t.countDomRight.eq(0).html(0)
                t.countDomLeft.eq(1).html(t.d.source.length)
                t.countDomRight.eq(1).html(t.d.target.length)
                if(t.d.source.length===0) t.boxLeft.find(`.${YB}`).html(NODATA)
                if(t.d.target.length===0) t.boxRight.find(`.${YB}`).html(NODATA)
                if(t.d.change&&typeof t.d.change === "function") t.d.change(t.d.target)
            })
            return t
        }
        _p.bindSearch = t =>{
            t.el.find(".ys-transfer-input-box .ys-input").on('input propertychange',function () {
                let v = $(this).val()
                if($(this).parents(`.${YTS}`).length>0){
                    let newSource= t.d.source.filter(e=>e.tit.indexOf(v)!==-1)
                    t.boxLeft.find(`.${YB}`).html(transfer.initOnesStr(newSource)||NODATA)
                    form.render('checkbox')
                }else{
                    let newTarget= t.d.target.filter(e=>e.tit.indexOf(v)!==-1)
                    t.boxRight.find(`.${YB}`).html(transfer.initOnesStr(newTarget)||NODATA)
                    form.render('checkbox')
                }
            })
            return t
        }
    },
     showCount:(f,a,b) => `<div class="transfer-count"><span>${a}</span>/<span>${b}</span></div>`
     ,getTit:tit => `<div class="ys-transfer-tit"> <input class="ys-checkbox" type="checkbox" name=""  title="${tit}"/></div>`
    ,getInp:t => t.d.search?` <div class="ys-transfer-input-box clearfix"><i class="ys-icon ys-icon-search"></i><input placeholder="请输入搜索关键字" class="ys-input"/></div>`:''
    ,initBody:t => { return {a:transfer.getBody(t,transfer.initOnesStr(t.d.source)),b:transfer.getBody(t,transfer.initOnesStr(t.d.target))}}
    ,initOnesStr:d => {
        let a = ''
        for(let i= 0;i<d.length;i++){
            a = a + transfer.getOne(d[i])
        }
        return a
    }
    ,initOneBox:(tit,inp,a,name) => `<div class="ys-transfer-box ${name}"><div class="ys-transfer-header">${tit}${inp}</div>${a}</div>`
    ,getBtns:() => ` <div class="ys-transfer-btns"> <div class="ys-transfer-btn ys-btn-disabled"><i class="ys-icon ys-icon-right-3"></i></div> <div class="ys-transfer-btn ys-btn-disabled"><i class="ys-icon ys-icon-left-3"></i></div></div>`
    ,getOne:e => `<div data-tit ="${e.tit}" data-value ="${e.value}" class="${e.disabled?'ys-disabled':''}"> <input class="ys-checkbox${e.disabled?'':' ys-can-checked'}" type="checkbox" name=""  title="${e.tit}" ${e.disabled?'disabled':''}/></div>`
    ,getBody :(t,a) => `<div class="${YB}" style="height:${parseInt(t.d.height)+'px'||'auto'};width:${parseInt(t.d.width)+'px'||'200px'}"> ${a!==''?a:NODATA}</div>`
    ,changeBox : (t,obj,data,box_es,checkedData,countDom,btn,f) => {
        let p = obj.checkbox.parent(),isIt= (e,p)=> (e.tit === p.attr('data-tit'))&&e.value ===p.attr('data-value'),L =data.length -(f === 's'?t.sdis:t.rdis)
        if(L === 0){
            form.setChecked(obj.checkbox.siblings('.ys-checkbox'),false)
            return false
        }
        let boxes = box_es.find(`.${YB}>div`)
        if(obj.checkbox.parents('.ys-transfer-header').length>0){
            form.setChecked(box_es.find('.ys-checkbox.ys-can-checked'),obj.checked)
            if(obj.checked){
                checkedData =  data.filter(e => !e.disabled)
                boxes.each(function (i,e) {
                    if(!isON($(e),'ys-disabled')) $(e).addClass(TB)
                })
            }else{
                checkedData = []
                boxes.removeClass(TB)
            }
        }else{
            if(obj.checked){
                checkedData.push(...data.filter(e => isIt(e,p)))
                p.addClass(TB)
            }else{
                checkedData = checkedData.filter(e => isIt(e,p))
                p.removeClass(TB)
            }
            if(checkedData.length === L) form.setChecked(box_es.find(`${HC}`),true)
            else form.setChecked(box_es.find(`${HC}`),false)
        }
        countDom.eq(0).html(checkedData.length)
        if(checkedData.length>0) btn.addClass('ys-transfer-btn-ok').removeClass("ys-btn-disabled")
        else btn.addClass('ys-btn-disabled').removeClass("ys-transfer-btn-ok")
        f === 's'? t.sChecked = checkedData:t.tChecked = checkedData
    }

}
export default transfer