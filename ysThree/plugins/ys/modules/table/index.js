import $ from "../jquery"
import {getScrollBarWidth, getTimestamp, ajax, isON, treeToList, listToTree, stopDefault} from "../utils"
import  paging from "../pagination"
import  form from "../form"
const $body =$('body'),$win =$(window),U= undefined,loading =`<div class="ys-table-loading-box"><div><i class="ys-icon ys-icon-loading-2"></i></div></div>`,
    YH ='ys-table-hover',HG = 'have-getter',SOT ='sort-type',ON ='ys-on'
const table = {
    cfg:{barWidth:getScrollBarWidth(),checkedData:{}},
    render: d => {// 顺序: 1:渲染thead和table-body盒子加载动画 => 2:ajax获取数据 => 3:渲染tbody =>4：渲染checkbox和paging =：5：实例绑定事件
        let el = $(d.name).addClass('ys-form ys-data-table').html('<div class="ys-data-table-main"></div>'), t = new table.table(el.find('.ys-data-table-main'),d)
        if(t.d.pagination === true) t.d.pagination ={}
        const go =()=>{
            if(t.d.isTreeTable) t.d.data = treeToList(listToTree(t.d.data)) //这样转是为了排序
            table.renderOver(t,t.loadHeader(t)).onForm(t)
            if(t.d.done) t.d.done(t)
        }
        if(t.d.ajaxData){
            table.initAjaPageArg(t.d)
            t.d.ajaxData.callback = res => {
                t.d.data = res[t.d.ajaxData.dataArg||'data']
                if(t.d.pagination&&res.total) t.d.pagination.total = res.total
                go()
            }
            ajax(t.d.ajaxData)
        }else go()
        return t
    },
    initAjaPageArg:d =>{
        if (d.pagination&&d.ajaxData&&d.ajaxData.data&&d.pagination.type===2){
            d.ajaxData.data.size = d.pagination.size||10
            d.ajaxData.data.current  = d.pagination.current||1
        }
    },
    reload : d =>{ //顺序：1:给出加载动画，2:请求数据；3:再渲染 thead 4:渲染 tbody =>渲染其他 =>绑定事件
        let el = $(d.name),t
        el.find('.ys-table-body').append(loading)
        if(d.pagination === true) d.pagination ={}
        const go =()=>{
            el.html('<div class="ys-data-table-main"></div>')
            t = new table.table(el.find('.ys-data-table-main'),d)
            table.renderOver(t,t.loadHeader(t))
            table.onForm(t)
            if(t.d.done) t.d.done(t)
            return t
        }
        if(d.ajaxData) {
            table.initAjaPageArg(d)
            d.ajaxData.async = false // reload 强制同步加载 否则无法return t
            d.ajaxData.callback = res => {
                d.data = res[d.ajaxData.dataArg||'data']
                if(d.pagination&&res.total) d.pagination.total = res.total
                t = go()
            }
            ajax(d.ajaxData)
        }else t = go()
        return t
    },
    renderOver: (t,hd) =>{
        if (!t.d.data) throw  "表格主数据字段不存在! (no 'data' or data 'arg')"
        t.loadBody(t,hd)
        if(t.checkbox){
            form.render('checkbox')
            t.d.isTreeTable?t.bindTreeCheck(t):t.bindCheck(t)
        }
        if(t.showPaging) table.paging(t,t.elP)
        t.bindEvent(t).dragResize(t).sort(t)
        if(t.d.isTreeTable) t.treeEvent(t)
        table.resetCD(t).fixAll(t).doSort(t,t.d.pagination.size,t.d.pagination.current,[...t.d.data])
        t.fixedBodyBox.css('top',t.headThead.height())
        if(t.summation) { //添加合计
            t.el.after(`<div class="ys-table-sum"><div class="ys-table-sum-box additional-table-box"><table class="ys-table${t.d.tableClass}"></table></div></div>`);
            t.sumTableBox = t.elP.find('.ys-table-sum-box');
            table.summation(t)
            t.colgroup = t.elP.find('colgroup')//重新存储
            table.fixAll(t)
        }
        $win.resize(() => table.fixAll(t))
        return table
    },
    table: function (el, d) {
        const t = this,_p = table.table.prototype ,u = el.parent().attr('ys-unique')
        t.d = d;t.el = el;t.elP = el.parent();t.checkedList = [];t.currentData = []
        if(u) t.unique = u
        else{
            t.unique = d.name
            t.elP.attr('ys-unique',t.unique)
        }
        _p.loadHeader = t =>{
            let heightStyle=t.d.height?`style="height:${parseFloat(t.d.height)+'px'}"`:'', headerData = t.d.complexCols?table.initComplexHeader(t):table.initHeader(t),tableClass= t.d.style==='border'?' ys-table-border':(t.d.style==='stripe'?' ys-table-stripe':'')
            t.d.tableClass =tableClass
            t.el.append(`<div class="ys-table-header"><table class="ys-table${tableClass}"><colgroup class="ys-colgroup">${headerData.col}</colgroup> <thead>${headerData.thStr}</thead> </table> </div> <div class="ys-table-body" ${heightStyle}> <div class="ys-table-loading-box"><div><i class="ys-icon ys-icon-loading-2"></i></div></div> </div>`)
            return headerData
        }
        _p.loadBody= (t,headerData) =>{
            let showPaging = false
            if(t.d.pagination){
                t.d.pagination.sizes = t.d.pagination.sizes|| ['10','20','30','40']
                t.d.pagination.size = t.d.pagination.size||10
                t.d.pagination.current = t.d.pagination.current||1
                showPaging = true
            }
            else {
                t.d.pagination = {}
                t.d.pagination.size = t.d.data.length
                t.d.pagination.current = 1
            }
            let tbodyData = table.initBody(t,headerData.col,t.d,t.d.pagination.size,t.d.pagination.current),fixInner =`<div class="ys-table-header-fixed"><table class="ys-table${t.d.tableClass}"><colgroup class="ys-colgroup">${headerData.col}</colgroup><thead>${headerData.thStr}</thead></table></div><div class="ys-table-body-fixed">${tbodyData.tableBody}</div>`
            t.el.find('.ys-table-body').html(tbodyData.tableBody)
            if(headerData.fixL&&t.d.data.length>0) t.el.append(`<div class="ys-table-fixed ys-table-fixed-left additional-table-box" style="width: ${headerData.fixWidth_left}px">${fixInner}</div>`)
            if(headerData.fixR&&t.d.data.length>0) t.el.append(`<div class="ys-table-fixed ys-table-fixed-right additional-table-box" style="width: ${headerData.fixWidth_right}px">${fixInner}</div>`)
            t.el.find('.ys-table-fixed').css('bottom',table.cfg.barWidth)
            //存储一般数据
            t.rootColStr = headerData.col
            t.countWidth = headerData.countWidth
            t.fixWidthLeft = headerData.fixWidth_left
            t.fixWidthRight = headerData.fixWidth_right
            t.headerData = headerData
            t.showPaging = showPaging
            //存储dom
            table.saveDom(t,t.el)
            return t
        }
        //绑定基础事件
        _p.bindEvent= t =>{
            t.tableBodyBox.scroll(function () {
                let $t=$(this)
                t.headTableBox.scrollLeft($t.scrollLeft())
                if(t.fixedBodyBox) t.fixedBodyBox.scrollTop($t.scrollTop())
                if(t.sumTableBox) t.sumTableBox.scrollLeft($t.scrollLeft())
            })
            t.el.on('click','td .ys-btn',function () {
                let $t = $(this),p =table.getCountPageInf(t),obj = {unique:t.unique,event:$t.attr('ys-event')}
                    ,arr = t.d.data.filter((i,e) => e === (p.c - 1) * p.s + $t.closest('tr').index())
                if(obj.unique&&obj.event) table.execute.call($t,Object.assign(obj,arr[0]))
            })
            t.el.on('click','tbody tr',function () {
                if(table.cfg[t.unique+'(tr)']){
                    let $t = $(this),p = table.getCountPageInf(t),arr =t.d.data.filter((i,e) => e === (p.c - 1) * p.s + $t.index())
                    arr[0].unique = t.unique+'(tr)'
                    table.execute.call($t,arr[0],$t)
                }
            })
            t.el.on('click','tbody td',function () {
                if(table.cfg[t.unique+'(td)']){
                    let $t = $(this),p = table.getCountPageInf(t),arr =t.d.data.filter((i,e) => e === (p.c - 1) * p.s + $t.closest('tr').index())
                    arr[0].unique = t.unique+'(td)'
                    table.execute.call($t,arr[0],{key:$t.attr('data-arg'),value:arr[0][$t.attr('data-arg')]},$t)
                }
            })
            //hover
            t.el.on('mouseenter','tbody tr',function () {t.tbodyAll.find(`tr:eq(${$(this).index()})`).addClass(YH)}).on('mouseleave','tbody tr',function () {t.tbodyAll.find(`tr:eq(${$(this).index()})`).removeClass(YH)})
            return t
        }
        //单元格resize
        _p.dragResize= t =>{
            let c1,c2,c3,w0,w2,th,unResize,gw,x0,x2,col,htw,index,tip,fbl,fbr,io1,io2,at
            if(t.d.style !== 'border') return t
            t.headTh.on("mousemove", function(e) {
                let  $t = $(this)
                unResize = $t.attr('unResize') ==='true'
                $body.css("cursor", c1 = (($t.width() -  e.clientX + $t.offset().left <= 15) &&!unResize) ? "col-resize": "")
            }).on("mouseleave", () => $body.css("cursor","")
            ).on("mousedown", function(e) {
                if(c1){
                    c2 = true
                    th = $(this)
                    gw = t.isGutter? table.cfg.barWidth:0
                    index = th.index()
                    htw = t.headTable.width()
                    w0 = parseFloat(t.headTable.find('colgroup col').eq(index).attr('width'))
                    x0 = e.pageX
                    col = t.elP.find(`.ys-table-col-${index}`)
                    tip = t.elP.find(`.ys-tooltips${index}`)
                    fbl = t.fixWidthLeft
                    fbr = t.fixWidthRight
                    io1 = isON(th,'ys-fix-left-th')
                    io2 = isON(th,'ys-fix-right-th')
                    at = t.elP.find('.additional-table-box table')
                }
            })
            $win.on('mousemove',(e)=> {
                if(c2){
                    stopDefault(e)
                    c3 = true
                    x2 = e.pageX - x0
                    w2 = w0 + x2
                    if(w2 < 50) return false
                    t.headTable.css('width',htw+x2)
                    t.bodyTable.css('width',htw+x2-gw)
                    at.css('width',htw+x2-gw)
                    col.attr('width',w2)
                    tip.css('width', w2)
                    t.fixedBodyBox.css('top',t.headThead.height())
                    if(io1){t.fixWidthLeft =  fbl + x2;t.leftBox.css('width',t.fixWidthLeft)}
                    else if(io2){t.fixWidthRight = fbr + x2;t.rightBox.css('width',t.fixWidthRight)}
                }
            }).on('mouseup',() => {
                if (c2&&c3) {
                    if((htw+x2 <= t.bodyTable.parent().width())) t.fixBox.hide(0)
                    else t.fixBox.show(0)
                    t.d.cols[index].width = w2
                    t.countWidth = t.countWidth + x2
                    table.fixColStr(t)
                }
                c1 = false;c2 = false;c3 = false
            })
            return t
        }
        //排序
        _p.sort = t =>{
            let arr= [...t.d.data]
            t.sortEl.click(function () {
                let $t =$(this),arg = $t.attr('sort-args'),type = $t.attr(SOT),p=table.getCountPageInf(t)
                if(type===''){t.el.find('i').removeClass(ON).parent().attr(SOT,'');$t.attr(SOT,type='up').find('.ys-sort-up').addClass(ON)}
                else if(type==='up'){t.el.find('i').removeClass(ON).parent().attr(SOT,'');$t.attr(SOT,type='down').find('.ys-sort-down').addClass(ON)}
                else if(type==='down') $t.attr(SOT,type='').find('i').removeClass(ON)
                t.d.sortArgs = [arg,type]
                table.doSort(t,p.s,p.c,arr)
                table.onForm(t)
            })
            return t
        }
        //绑定普通checkbox事件;
        _p.bindCheck = t =>{
            table.cfg.checkedData[t.unique] = [[],0,false]
            form.on(t.unique+'(checkbox)',function (obj) { //监听checkbox点击
                let $td = obj.checkbox.parents('td'),$th = obj.checkbox.parents('th'),o={},x, c = t.d.pagination.current ,s =t.d.pagination.size
                if($th.length>0){ //点击的是th
                    o[t.d.name+'-td'] = obj.checked
                    form.val(t.unique,o)
                }else{ //点击的是td
                    x = $td.parent().index()
                    t.checkedList[x] = obj.checked? t.currentData[x] : U
                    t.el.find('tbody').each((i,e)=> form.setChecked($(e).find('tr').eq(x).find(`.ys-checkbox[name=${t.d.name+'-td'}]`),obj.checked))
                }
                let ch =t.checkedList.filter(e=>e),len = ch.length,f= (len === (c*s > t.d.data.length? (s - c*s + t.d.data.length):s))||false
                //判定全选时候和失去全选
                form.setChecked(t.el.find(`.ys-checkbox[name=${t.d.name+'-th'}]`),f)
                table.cfg.checkedData[t.unique] = [ch,len,f]
            })
            return t
        }
        //绑定树checkbox事件;
        _p.bindTreeCheck = t =>{
            const findAllChild = (uid,trsAll,on)=>
                trsAll.each((i,e)=>{
                    if($(e).attr('data-pid') === uid){
                        form.setChecked($(e).find('.ys-checkbox'),on)
                        let x = $(e).index()
                        t.checkedList[x] = on? t.currentData[x] : U
                        t.el.find('tbody').each((i,e)=> form.setChecked($(e).find('tr').eq(x).find(`.ys-checkbox[name=${t.d.name+'-td'}]`),on))
                        findAllChild($(e).attr('data-id'),trsAll,on)
                    }
                })
            table.cfg.checkedData[t.unique] = [[],0,false]
            form.on(t.unique+'(checkbox)',function (obj) { //监听checkbox点击
                let $td = obj.checkbox.parents('td'),$th = obj.checkbox.parents('th'),o={},x, c = t.d.pagination.current ,s =t.d.pagination.size
                if($th.length>0){ //点击的是th
                    o[t.d.name+'-td'] = obj.checked
                    form.val(t.unique,o)
                }else{ //点击的是td
                    x = $td.parent().index()
                    t.checkedList[x] = obj.checked? t.currentData[x] : U
                    t.el.find('tbody').each((i,e)=> form.setChecked($(e).find('tr').eq(x).find(`.ys-checkbox[name=${t.d.name+'-td'}]`),obj.checked))
                    findAllChild($td.parent().attr('data-id'),t.tbodyAll.find(`tr`),obj.checked)
                }
                let ch =t.checkedList.filter(e=>e),len = ch.length,f= (len === (c*s > t.d.data.length? (s - c*s + t.d.data.length):s))||false
                //判定全选时候和失去全选
                form.setChecked(el.find(`.ys-checkbox[name=${t.d.name+'-th'}]`),f)
                table.cfg.checkedData[t.unique] = [ch,len,f]
            })
            return t
        }
        //绑定treeTable事件
        _p.treeEvent = t =>{
            const findAllChild = (uid,trsAll )=> trsAll.each((i,e)=>{if($(e).attr('data-pid') === uid){$(e).addClass('ys-hide').removeClass(ON);findAllChild($(e).attr('data-id'),trsAll)}})
            t.el.on('click','.ys-td-foldIcon',function () {
                let $t = $(this),tr = $t.parents('tr') ,i = tr.index(),trs = t.tbodyAll.find(`tr:eq(${i})`),uid = tr.attr('data-id'),trsAll= t.tbodyAll.find(`tr`)
                if(tr.attr('data-no-get') === 'true') table.lazyLoad(t,uid,tr,trs)
                else if(isON(trs,ON)){
                    trs.removeClass(ON)
                    findAllChild(uid,trsAll)
                }else{
                    trs.addClass(ON)
                    trsAll.each((i,e) => {if($(e).attr('data-pid') === uid) $(e).removeClass('ys-hide')})
                }
            })
        }
        //重载
        t.reload = d =>{
            const go = ()=>{
                table.renderBody(t,table.initBody(t,t.rootColStr,t.d,t.d.pagination.size,t.d.pagination.current=1)).resetCD(t)
                paging.reload(t.d.pagination)
                table.onForm(t)
                if(t.d.done) t.d.done(t)
            }
            if(d&&d.ajaxData){
                t.d.ajaxData = d.ajaxData
                t.d.ajaxData.callback = res => {
                    t.d.data = res[t.d.ajaxData.dataArg||'data']
                    if(t.d.pagination&&res.total) t.d.pagination.total = res.total
                    go()
                }
                ajax(t.d.ajaxData)
            }else go(t.d.data = d.data)

            return t
        }
    },
    on : (u,f) => table.cfg[u]=[f],
    execute : (obj,a,b,c) =>{ if(table.cfg[obj.unique])  table.cfg[obj.unique][0](obj,a,b,c) },
    getChecked: u => table.cfg.checkedData[u],
    initHeader: t =>{
        let colData = t.d.cols, oneWidth = 0, countWidth = 0, toolTipStyle = '', thStr = '', col = '', fixL = false, fixR = false, fixWidth_left = 0, fixWidth_right = 0
        for (let i = 0; i < colData.length; i++) {
            oneWidth = table.getOneWidth(colData[i])
            if(colData[i].type === 'checkbox') { t.d.cols[i].width = 50;oneWidth = 50 ; t.checkbox = true; colData[i].unResize = true}
            if(colData[i].type === 'number') t.number = true
            countWidth = countWidth + oneWidth //累计宽度
            toolTipStyle = colData[i].toolTips ? `style="width:${oneWidth}px"`: ''
            thStr = thStr + table.getTh(t,colData[i],toolTipStyle,i)
            col = col + `<col width="${oneWidth}" class="ys-table-col-${i}">`
            if(colData[i].fixed==='left'){ fixWidth_left = fixWidth_left + oneWidth;fixL=true }
            if(colData[i].fixed==='right'){ fixWidth_right = fixWidth_right + oneWidth;fixR=true }
            if(colData[i].summation) t.summation = true
        }
        thStr =`<tr>${thStr}</tr>`
        return { col,thStr,countWidth,fixL,fixR,fixWidth_left,fixWidth_right }
    },
    initComplexHeader: t =>{ //复杂表头
        t.d.cols = table.complexColsToCols(t.d.complexCols)
        let colData = table.parseComplexCols(t.d.complexCols), oneWidth = 0, countWidth = 0, toolTipStyle = '',thStr = '',thStrAll ='', col = '', fixL = false, fixR = false, fixWidth_left = 0, fixWidth_right = 0,hasChild = false
        for(let i = 0;i<t.d.cols.length;i++){
            hasChild = t.d.cols[i].colSpan && t.d.cols[i].colSpan!==1
            oneWidth = hasChild?0:table.getOneWidth(t.d.cols[i])
            if(t.d.cols[i].type === 'checkbox') { t.d.cols[i].width = 50;oneWidth = 50;}
            if(t.d.cols[i].summation) t.summation = true
            col = col + (hasChild?'':`<col width="${oneWidth}" class="ys-table-col-${i}">`)
        }
        for (let i = 0; i < colData.length; i++) {
            for(let j = 0 ;j <colData[i].length;j++){
                hasChild = colData[i][j].colSpan && colData[i][j].colSpan!==1
                oneWidth = hasChild?0:table.getOneWidth(colData[i][j])
                if(colData[i][j].type === 'checkbox') { oneWidth = 50; t.checkbox = true;}
                if(colData[i][j].type === 'number') t.number = true
                countWidth = countWidth + oneWidth //累计宽度
                toolTipStyle = colData[i][j].toolTips ? `style="width:${oneWidth}px"` : ''
                thStr = thStr + table.getComplexTh(t,colData[i][j],toolTipStyle,i)
                if(colData[i][j].fixed==='left'){ fixWidth_left = fixWidth_left + oneWidth;fixL=true }
                if(colData[i][j].fixed==='right'){ fixWidth_right = fixWidth_right + oneWidth;fixR=true }
            }
            thStr = `<tr>${thStr}</tr>`
            thStrAll = thStrAll + thStr
            thStr = ''
        }
        return { col,thStr:thStrAll,countWidth,fixL,fixR,fixWidth_left,fixWidth_right }
    },
    initBody: (t,col,d,size,current) =>{
            let colData = d.cols, oneWidth = 0, toolTipStyle = '', td = '', tdStr = '', tdStrAll = '',rowStyle = '',sumList= []
            for (let j = (current-1)*size; j < (current*size>d.data.length?d.data.length:current*size); j++) {
                td = ''; tdStr = ''
                for (let i = 0; i < colData.length; i++) {
                    oneWidth = table.getOneWidth(colData[i])
                    toolTipStyle = colData[i].toolTips ? `style="width:${oneWidth}px"` : ''
                    td =  table.getTd(t,colData[i],d.data[j],toolTipStyle,i,j)
                    tdStr= tdStr+ td
                    if(colData[i].rowStyle) rowStyle = `style='${colData[i].rowStyle(d.data[j],d.data[j][colData[i].args])}'`
                    if(colData[i].summation === true) sumList[i] =  parseFloat(sumList[i]||0)+ parseFloat(d.data[j][colData[i].args])
                    else if(typeof colData[i].summation === "string") sumList[i] =  colData[i].summation
                }
                tdStrAll = tdStrAll + (t.d.isTreeTable?`<tr ${rowStyle} class="${d.data[j].pid?'ys-hide':''}" data-pid="${d.data[j].pid||''}" data-id="${d.data[j].id||''}"  data-no-get ="${d.data[j].hasChild&&t.d.ajaxData.data&&t.d.ajaxData.data.lazy?'true':''}">${tdStr}</tr>`:`<tr ${rowStyle}>${tdStr}</tr>`)
            }
            if(t.summation) t.sumList = sumList
            return {tdStrAll, tableBody : d.data&&d.data.length>0?`<table class="ys-table${t.d.tableClass}"><colgroup class="ys-colgroup">${col}</colgroup> <tbody>${tdStrAll}</tbody> </table>`:'<div class="ys-no-data">NO DATA</div>'}
    },
    renderBody : (t,b) =>{
        t.tableBodyBox.html(b.tableBody)
        t.fixedBodyBox_left.html(b.tableBody)
        t.fixedBodyBox_right.html(b.tableBody)
        let  o = {} ; o[t.d.name+'-th'] = false
        form.val(t.unique,o)
        table.saveDom(t,t.el).fixAll(t)
        return table
    },
    scrollY : t => t.tableBodyBox.height() < t.bodyTable.height(),
    scrollX : (t,w) => {
        let b = t.tableBodyBox.width() < w
        if(b) t.fixBox.show(0)
        else t.fixBox.hide(0)
        return b
    },
    fixAll : t =>{
        let W = parseFloat(t.el.width()),w=t.countWidth,headTableWidth, bodyTableWidth, isGutter, bw = table.cfg.barWidth
        if(table.scrollX (t,w)){
            if(table.scrollY (t)){
                headTableWidth = w + bw
                bodyTableWidth = w
                isGutter=true
            }else{
                bodyTableWidth = w
                headTableWidth = w
                isGutter=false
            }
            table.fixCol(t.colgroup,t.rootColStr,isGutter,bw,t)
            t.isScrollX = true
        }else{
            if(table.scrollY (t)){
                headTableWidth = W
                bodyTableWidth = W-bw
                isGutter=true
            }else{
                bodyTableWidth = W
                headTableWidth = W
                isGutter=false
            }
            table.fixCol(t.colgroup,table.getColStr(t.d,isGutter,W,bw),isGutter,bw,t)
            t.isScrollX = false
        }
        table.gutter(isGutter,w,bw,t)
        t.isGutter =isGutter
        t.headTable.css('width',headTableWidth)
        t.bodyTable.css('width',bodyTableWidth)
        t.fixTable.css('width',bodyTableWidth)
        t.bodyTableWidth = bodyTableWidth
        t.fixedBodyBox.css('top',t.tableBodyBox.find('thead').height())
        if(t.sumTableBox) table.fixSumTable(t)
        return  table
    },
    fixColStr : t =>{
        let col = ''
        t.d.cols.forEach((e,i) => col = col + `<col width="${table.getOneWidth(t.d.cols[i])}" class="ys-table-col-${i}">`)
        t.rootColStr = col
        return table
    },
    fixCol : (c,cs,g,bw,t) => {
        let r= 0
        if(g)c.html(cs).eq(0).html(cs + `<col width="${r = bw}" class="ys-table-gutter">`)
        else c.html(cs)
        t.rightBox.css('right',r)
    },
    fixSumTable:t =>t.sumTableBox.css('margin-right',t.isScrollX?table.cfg.barWidth:0).find('table').css('width',t.bodyTableWidth),
    getOneWidth:e =>e.width ? parseFloat(e.width) : (e.minWidth ? parseFloat(e.minWidth) : 120),
    getTh : (t,cd,toolTipStyle,i) => {
        let main = `<span>${cd.label||cd.args}</span> ${cd.sort?table.getSortStr(cd.args):''}`
        if(cd.type === 'checkbox') main = table.getCheckbox(t,'-th')
        else if(cd.type === 'number') main = `<span>${cd.label||cd.args||'序号'}</span>`
        return `<th class="${cd.fixed==='left'?'ys-visible ys-fix-left-th':''}${cd.fixed==='right'?'ys-visible ys-fix-right-th':''}" unResize="${cd.unResize?true:false}"><div class="ys-table-cell${cd.toolTips ? ' ys-ellipsis show-toolTips ys-tooltips' + i : ''}" ${toolTipStyle}> ${ main }  </div></th>`
    },
    getComplexTh : (t,cd,toolTipStyle) => {
        let main = `<span>${cd.label||cd.args}</span> ${cd.sort?table.getSortStr(cd.args):''}`,rowCol = `rowspan=${cd.rowSpan||1} colspan=${cd.colSpan||1}`
        if(cd.type === 'checkbox') main = table.getCheckbox(t,'-th')
        else if(cd.type === 'number') main = `<span>${cd.label||cd.args||'序号'}</span>`
        return `<th class="${cd.fixed==='left'?'ys-visible ys-fix-left-th':''}${cd.fixed==='right'?'ys-visible ys-fix-right-th':''}" unResize="true" ${rowCol}><div class="ys-table-cell${cd.toolTips ? ' ys-ellipsis show-toolTips' : ''}" ${toolTipStyle}> ${ main }</div></th>`
    },
    getTd : (t,cd,dd,toolTipStyle,i,j) =>{
        let btns = '',main = dd[cd.args]||'',indent = ''
        if(cd.btns&&cd.btns.length >0){  cd.btns.forEach(x => btns = btns + x) ; main = btns}
        if(cd.type === 'checkbox') main =table.getCheckbox(t,'-td')
        else if(cd.type === 'number') main = `<span>${t.d.pagination.type === 2?((t.d.pagination.current-1)*t.d.pagination.size+j)+1:j+1}</span>`
        if(cd.template) main = cd.template(dd,dd[cd.args])
        for(let i = 0;i<dd.leave;i++){
            indent = indent +  `<span class="ys-table-child-indent"></span>`
        }
        return `<td class="${cd.fixed?'ys-visible':''}" data-arg="${cd.args}"><div class="ys-table-cell${cd.toolTips?' ys-ellipsis ys-tooltips ys-tooltips'+i:''}" ${toolTipStyle}>${cd.foldIcon?indent:''}${cd.foldIcon?(dd.hasChild?'<i class="ys-td-foldIcon ys-icon ys-icon-right"></i>':'<i class="ys-icon ys-icon-none"></i>'):''}${main}</div></td>`
    },
    getCheckbox : (t,i) =>`<input class="ys-checkbox" type="checkbox" name="${t.d.name+i}"/>`,
    getColStr : (d,g,W,bw) =>{
        let c= d.cols,gw = 0 ,mw = 0,count=0,countW=0,p,arr=[],cs=''
        for(let i=0;i<c.length;i++){
            if (c[i].width){
                gw = c[i].width?parseFloat(c[i].width):0
                count = c[i].width?count+1:count
                countW=countW+gw
                arr.push([gw,false])
            }else{
                mw = c[i].minWidth?parseFloat(c[i].minWidth):120
                countW=countW+mw
                arr.push([mw,true])
            }
        }
        p = d.cols.length===count?(W-countW-(g?bw:0))/count:(W-countW-(g?bw:0))/(d.cols.length-count)
        for(let i=0;i<arr.length;i++){
            if(mw===0) cs = cs+`<col width="${arr[i][0]+p}" class="ys-table-col-${i}">`
            else cs = cs+`<col width="${arr[i][1]?arr[i][0]+p:arr[i][0]}" class="ys-table-col-${i}">`
        }
        return cs
    },
    getSortStr : a => `<span class="ys-sort" sort-type="" sort-args="${a}"><i class="ys-sort-up"></i><i class="ys-sort-down"></i></span>`,
    gutter : (g,w,bw,t) =>{
        let tb=t.headTable
        if(g&&!tb.attr(HG)) tb.attr(HG,true).find('thead tr').append(`<th class="ys-table-gutter" style="width: ${bw}px"><div></div></th>`)
        else if(!g&&tb.attr(HG)) tb.removeAttr(HG).find('.ys-table-gutter').remove()
    },
    getCountPageInf:t =>{
        let c =t.d.pagination.current ,s= t.d.pagination.size
        if(t.d.pagination.type === 2){ s = t.d.data.length;c =1 }
        return {c ,s}
    },
    complexColsToCols: cols =>{ //解析复杂表头成 cols数组
        let arr = []
        const forIt = (cols) =>{
            for(let i =0;i<cols.length;i++){
                if(cols[i].children) forIt(cols[i].children)
                else arr.push(cols[i])
            }
        }
        forIt(cols)
        return arr
    },
    parseComplexCols : cols =>{ //解析复杂表头成 多tr数组
        let arr=[],temp = []
        const forIt = (cols,x) =>{
            arr[x]=[];temp = []
            for(let i =0;i<cols.length;i++){
                if(cols[i].children) temp.push(...cols[i].children)
                arr[x].push(cols[i])
                if((i === cols.length-1)&&temp.length>0){
                    x++
                    arr[x] = []
                    arr[x].push(...temp)
                    forIt(temp,x++)
                }
            }
        }
        forIt(cols,0)
        return arr
    },
    sortData : (d,arg,type) =>{
        if(type==='') return false
        else if(type==='up') d.sort(table.compare(arg,1))
        else if(type==='down') d.sort(table.compare(arg,2))
        return true
    },
    doSort: (t,s,c,arr) =>{
        if(!t.d.sortArgs) return false
        if(!table.sortData(t.d.data,t.d.sortArgs[0],t.d.sortArgs[1])) t.d.data = [...arr]
        table.renderBody(t,table.initBody(t,t.rootColStr,t.d,s,c)).summation(t).resetCD(t)
    },
    resetCD: t =>{ //currentData , checkedList , render checkbox ,fixSumTable ...
        let c = t.d.pagination.current,s = t.d.pagination.size
        t.currentData = t.d.data.filter((e,i) => i >= (c - 1) * s && i < (c * s > t.d.data.length ? t.d.data.length : c * s))
        t.checkedList = []
        t.currentData.forEach(()=>{ t.checkedList.push(U) })
        table.cfg.checkedData[t.unique] = [[],0,false]
        if(t.checkbox){
            form.render('checkbox')
            t.el.find(`.ys-checkbox[name=${t.d.name+'-th'}]`).removeAttr('checked').val('').siblings('.ys-checkbox-block').removeClass(ON)
        }
        t.fixedBodyBox.css('top',t.headTable.find('thead').height())
        if(t.sumTableBox) table.fixSumTable(t)
        return table
    },
    saveDom: (t,el) =>{
        t.colgroup = el.find('colgroup')
        t.sortEl = el.find('.ys-sort')
        t.headTableBox = el.find('.ys-table-header')
        t.headThead = t.headTableBox.find('thead')
        t.headTable = el.find('.ys-table-header table')
        t.headTh = el.find('th')
        t.tableBodyBox = el.find('.ys-table-body')
        t.bodyTable = el.find('.ys-table-body table')
        t.fixTable = el.find('.ys-table-fixed table')
        t.tbody= el.find('.ys-table-body tbody')
        t.tbodyAll = el.find('tbody')
        t.fixBox = el.find('.ys-table-fixed')
        t.fixedBodyBox = el.find('.ys-table-body-fixed')
        t.fixedBodyBox_left = el.find('.ys-table-fixed-left .ys-table-body-fixed')
        t.fixedBodyBox_right = el.find('.ys-table-fixed-right .ys-table-body-fixed')
        t.leftBox = el.find('.ys-table-fixed-left')
        t.rightBox = el.find('.ys-table-fixed-right')
        return table
    },
    compare : (arg,type) => (a,b)=> type===1?a[arg] - b[arg]:b[arg] - a[arg],
    paging : (t,el) =>{
        let id = t.d.name.substring(1,t.d.name.length) +'-page-'+ getTimestamp()+parseInt(Math.random()*1000)
        t.d.pagination.name = '#'+id
        el.append(`<div class="ys-data-table-pagination"><div class="ys-pagination" id="${id}"></div></div>`)
        if(t.d.pagination.type===2){
            const doIt = () => {
                let s = t.d.data.length,c = 1
                t.d.ajaxData.callback = res => {
                    t.d.data = res[t.d.ajaxData.dataArg||'data'];t.d.pagination.total = res.total
                    table.renderBody(t,table.initBody(t,t.rootColStr,t.d,s,c)).summation(t).resetCD(t) //传入 当前数据长度及1作为size和current
                    if(t.d.sortArgs) table.doSort(t,s,c,[...t.d.data])
                    table.onForm(t)
                }
                t.tableBodyBox.append(loading)
                ajax(t.d.ajaxData)
            }
            if(!t.d.pagination.total)
                throw  "分页总数不存在或缺少分页总数'total'字段"
            t.d.pagination.jump = o => doIt(t.d.ajaxData.data.current = t.d.pagination.current = o.current)
            t.d.pagination.sizeChange = o => doIt(t.d.ajaxData.data.size = t.d.pagination.size = o.size,t.d.ajaxData.data.current = t.d.pagination.current = 1)

        }else{
            t.d.pagination.total = t.d.data.length
            t.d.pagination.jump = o => table.renderBody(t,table.initBody(t,t.rootColStr,t.d,t.d.pagination.size,t.d.pagination.current = o.current)).summation(t).onForm(t).resetCD(t)
            t.d.pagination.sizeChange = o => table.renderBody(t,table.initBody(t,t.rootColStr,t.d,t.d.pagination.size = o.size,t.d.pagination.current=1)).summation(t).onForm(t).resetCD(t)
        }
        paging.render(t.d.pagination)
    },
    summation: t =>{
        if(!t.sumTableBox) return table
        t.sumTableBox.find('table').html(`<colgroup>${t.rootColStr}</colgroup><tbody>${t.tbody.find('tr:last-child').html()}</tbody>`)
        table.resetSumNum(t)
        return table
    },
    resetSumNum :t=>{for(let i =0;i<t.d.cols.length;i++){t.sumTableBox.find('tr:last-child td').eq(i).find('.ys-table-cell').html( (t.d.cols[i].sumFormat?t.d.cols[i].sumFormat(t.sumList[i]):t.sumList[i])||'')}},
    onForm: t =>{
        if(t.d.editForm){
            form.render()
            form.on(t.unique,function (o) { //监听所有变化
                let el = o.el ,index = el.closest('tr').index(), p =  table.getCountPageInf(t), arr = t.d.data.filter((i,e) => e === (p.c - 1) * p.s + index)
                arr[0][o.name] = o.value||o.valueList||'请输入'
                arr[0].unique = o.formUnique+'(form)'
                table.execute.call(t,arr[0],o)
            })
        }
        return table
    },
    lazyLoad: (t,id,tr,trs) =>{
        trs.find('.ys-td-foldIcon').removeClass('ys-icon-right').addClass('ys-icon-loading-2')
        t.d.ajaxData.lazyId = id
        t.d.ajaxData.url =  t.d.ajaxData.lazyUrl?t.d.ajaxData.lazyUrl:t.d.ajaxData.url
        t.d.ajaxData.callback = res => {
            let arr =  res[t.d.ajaxData.dataArg || 'data']
            t.d.data.push(...arr)
            let  bd = table.getLazyTr(t,t.d.cols,arr)
            trs.after(bd.tdStrAll).removeAttr('data-no-get').find('.ys-td-foldIcon').removeClass('ys-icon-loading-2').addClass('ys-icon-right')
            trs.addClass(ON)
            t.d.pagination.size = t.d.pagination.size + arr.length
            form.setChecked(t.el.find('.ys-checkbox'),false)
            table.resetCD(t)
        }
        ajax(t.d.ajaxData)
    },
    getLazyTr:(t,colData,childData)=>{
        let  oneWidth = 0, toolTipStyle = '', td = '', tdStr = '', tdStrAll = '',rowStyle = '',sumList= []
        for (let j = 0; j < childData.length; j++) {
            td = ''; tdStr = ''
            for (let i = 0; i < colData.length; i++) {
                oneWidth = table.getOneWidth(colData[i])
                toolTipStyle = colData[i].toolTips ? `style="width:${oneWidth}px"` : ''
                td =  table.getTd(t,colData[i],childData[j],toolTipStyle,i,j)
                tdStr = tdStr+ td
                if(colData[i].rowStyle) rowStyle = `style='${colData[i].rowStyle(childData[j],childData[j][colData[i].args])}'`
                if(colData[i].summation === true) sumList[i] =  parseFloat(sumList[i]||0)+ parseFloat(childData[j][colData[i].args])
                else if(typeof colData[i].summation === "string") sumList[i] =  colData[i].summation
            }
            tdStrAll = tdStrAll + `<tr ${rowStyle} data-pid="${childData[j].pid||''}" data-id="${childData[j].id||''}"  data-no-get ="${childData[j].hasChild?'true':''}">${tdStr}</tr>`
        }
        if(t.summation) {
            t.sumList.filter((e,i)=>{if(sumList[i]&&t.sumList[i]&&(typeof t.sumList[i]!=="string")) t.sumList[i] = parseFloat(t.sumList[i]) + parseFloat(sumList[i])})
            table.resetSumNum(t)
        }
        return {tdStrAll}
    }
}
export default  table