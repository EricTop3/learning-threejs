import $ from "../jquery"
import {isON,getTimestamp,stopBubble} from "../utils"
import form from '../form'
import monitor from "../monitor"
import dialog from "../dialog"
import message from "../message"
const doc =$(document),CI='ys-tree-fold-icons',FI='ys-tree-file-icons',ON='ys-on',YDS='ys-disabled',YC='ys-checkbox',IT='ys-tree-item',IM='ys-tree-item-main',IC='ys-tree-item-con',J='javascript:;',RZ='ys-rotateZ-90',EDI=` .ys-tree-selfEdit .ys-icon-`
const tree = {
    cfg:{flattenData:{}},
    render:d=>{
        let t = new tree.tree(d)
        t.init(d).bindCheck(t.cfg.u).bindEvent(t)
        if(d.draggable) $(d.name).append('<div class=ys-tree-bar></div>')
        if(d.edit) t.bindEdit(t)
        tree.drag(d,$(d.name+` .${IT}`))
    },
    getCheck:u =>{
        let o=[]
        tree.cfg[u][1].each((i,e)=> {
            let t=$(e)
            if(t.attr('checked')==='checked')
                o.push(tree.cfg.flattenData[u].filter(i => i.id === t.parent().parent().attr('uid'))[0])
        })
        return o
    },
    setCheck:(u,arr) => {
        let o={}
        tree.cfg[u][1].each((i,e)=>{
            arr.forEach(a=>{
                if($(e).parent().parent().attr('uid')===a)
                    o[$(e).attr('name')]='checked'
            })
        })
        form.val(u,o)
    },
    clearCheck:u => {
        let o={}
        tree.cfg[u][1].each((i,e)=> o[$(e).attr('name')] = undefined)
        form.val(u,o)
    },
    reload:(u,m) => {
        tree.cfg[u][0].menus = m ||tree.cfg[u][0].menus
        console.log(tree.cfg[u][0]);
        new tree.tree(tree.cfg[u][0]).init(tree.cfg[u][0])
    },
    getFlattenData:u => tree.cfg.flattenData[u],
    deleteSome:(d,id)=>{
        ade (d,id)
        return d.filter(i=>i!==undefined)
    },
    tree:function (d) {
        let T = this , _p = tree.tree.prototype
        T.cfg={}
        _p.init= d => {
            let el=$(d.name),fic=d.fileIcon?`<span class=${FI}>${d.fileIcon}</span>`:`<span class=${FI}><i class="ys-tree-file-icon"></i></span>`,ic,u=el.attr('ys-unique'),se='',ee=d.edit&&d.edit.length>1,dr=d.draggable?"draggable=true":'',
                che=`<input class="${YC}" type="checkbox"/>`
            if(!u){u = d.name;el.attr('ys-unique',u)}
            d.icon = d.icon || ["<i class='ys-icon ys-icon-add-1'></i>","<i class='ys-icon ys-icon-minus-1'></i>"]
            ic = typeof d.icon ==="string"?`<span class=${CI}>${d.icon}</span>`:`<span class=${CI}>${d.icon[0]}${d.icon[1]}</i></span>`
            if(ee){
                d.edit.forEach(e=>{se=se+`<i class="ys-icon ys-icon-${e}"></i>`})
                se = `<span class='ys-tree-selfEdit'>${se}</span>`
            }
            tree.cfg.flattenData[u]=[]
            el.addClass('ys-form').html('')
            treeIt(u,el,d,ic,fic,che,se,dr)
            el.find(`.${YDS}.${IT} .${YC}`).attr('disabled',true)
            el.find(`.${YC}`).each((i,e)=>$(e).attr('name',d.name+'-'+i))
            if(ee)
                el.append('<div class="ys-tree-newItem"><i class="ys-icon ys-icon-add-2"></i></div>')
            form.render('checkbox')
            let cb=el.find(`.${YC}`),cnm=cb.length,eA={}
            if(d.editArgs&&d.editArgs.length>0)
                for (let k of d.editArgs){eA[k]=true}
            else
                for (let k in tree.cfg.flattenData[u][0]){eA[k]=''} //需要深度拷贝，不然修改了eA，数组会变动
            tree.cfg[u]=[d,cb,{ic,fic,che,se},cnm,dr,eA] //data--checkbox--存储组件{折叠icon，文件icon，checkbox,edit}--checkbox的name后缀记录 --draggable -- editArgs
            T.cfg.el = el;T.cfg.d = d;T.cfg.u= u
            el.on('click','.ys-disabled *',()=>false)
            return T
        }
        _p.bindCheck = u =>{
            form.on(u + '(checkbox)',function (obj) {
                let it=obj.checkbox.parent().parent(),o={}
                it.find(`.${YC}`).each((i,e)=> {o[$(e).attr('name')]=isON($(e).parent().parent(),YDS)?undefined:obj.checked})
                form.val(u,o)
            })
            return T
        }
        _p.bindEvent= T =>{
            doc.on('click',T.cfg.d.name+` .${CI}`,function () {
                let t = $(this) , p= t.parent().parent(), fc=t.find("i:first-child")//item
                if(isON(p,ON)){
                    p.removeClass(ON).find(`>.${IC}`).slideUp(300)
                    if(t.find('i').length>1)
                        fc.show(0).siblings().hide(0)
                    else
                        fc.removeClass(RZ)
                }
                else{
                    if(T.cfg.d.siblingsEffect){
                        p.siblings(`.${IT}`).each((i,e)=>{
                            if(isON($(e),ON))
                                $(e).find(`>.${IM}>.${CI}`).click()
                        })
                    }
                    p.addClass(ON).find(`>.${IC}`).slideDown(300)
                    if(t.find('i').length>1)
                        fc.hide(0).siblings().show(0)
                    else
                        fc.addClass(RZ)
                }
            }).on('click',T.cfg.d.name+' .ys-tree-item-tit',function () {
                let t= $(this),u = T.cfg.u,id=t.parent().parent().attr('uid')
                if(T.cfg.d.titToggle)
                    t.siblings('.'+CI).click()
                if(u)
                    monitor.execute.call(t,tree.cfg.flattenData[u].filter(i => i.id === id)[0])
            })
            return T
        }
        _p.bindEdit= T => {
            doc.on('click',T.cfg.d.name+EDI+'add',function () {
                let t = $(this),p=t.closest(`.${IT}`),pid= p.attr('uid'),u = T.cfg.u, z=tree.cfg[u][2], uid=pid+'-'+getTimestamp()+parseInt(Math.random()*1000)
                tree.cfg[u][3]=tree.cfg[u][3]+1
                if(p.find(`>.${IC}`).length===0)
                    p.append(`<div class='${IC}'></div>`).find(`>.${IM}`).prepend(z.ic).find('>.ys-tree-file-icons').remove()
                if(z.che&&z.che!=='')
                    z.che =`<input class=${YC} type="checkbox" name="${T.cfg.d.name+'-'+tree.cfg[u][3]}"/>`
                let zs=`<div class='${IT}' uid='${uid}' ${tree.cfg[u][4]}><div class='${IM}'>${z.fic}${z.che}<a class='${IT}-tit' href='${J}' post='${J}'><span>未命名</span></a>${z.se}</div></div>`
                p.find(`>.${IC}`).append(zs)
                form.render('checkbox')
                tree.cfg[u][1]=$(`.ys-tree[ys-unique=${u}]`).find(`.${YC}`)
                let o={}
                for(let k in tree.cfg.flattenData[u][0]){o[k]=undefined}
                Object.assign(o,{id: uid,tit: '未命名',unique: u,pid: pid,href:J, post:J})
                tree.cfg.flattenData[u].push(o)
                tree.drag(T.cfg.d,p.find(`>.${IC}>.${IT}:last-child`))
            }).on('click',T.cfg.d.name+EDI+'delete',function () {
                let t = $(this),p=t.closest(`.${IT}`),pid= p.attr('uid'),u = T.cfg.u,z=tree.cfg[u][2],pp= p.parent()
                if(p.siblings(`.${IT}`).length===0){
                    pp.siblings(`.${IM}`).prepend(z.fic).find(">."+CI).remove()
                    pp.parent().removeClass(ON)
                    pp.remove()
                }
                p.remove()
                tree.cfg[u][1]=$(`.ys-tree[ys-unique=${u}]`).find(`.${YC}`)
                tree.cfg.flattenData[u]=tree.deleteSome(tree.cfg.flattenData[u],pid)
            }).on('click',T.cfg.d.name+EDI+'edit',function () {
                let t = $(this),p=t.closest(`.${IT}`),pid= p.attr('uid'),u = T.cfg.u,d=tree.cfg[u][5],dd =tree.cfg.flattenData[u].filter(i => i.id === pid)[0],inp='',fu=u+'-form-'+getTimestamp(),di
                for (let k in d){
                    d[k]=dd[k]
                    di = k === 'pid'?'disabled':''
                    if(k!=='unique'&&k!=='on')
                        inp=inp+`<div class="ys-input-item"><div class="ys-input-label">${k}</div> <div class="ys-input-block"> <input class="ys-input"  name="${k}" value="${d[k]}" autocomplete="off" ys-clearable="true" ${di}/></div></div>`
                }
                inp = `<form class="ys-form" ys-unique="${fu}" style="padding-right: 50px;">${inp}</form>`
                dialog({
                    maskLayer:true, width:"600", tit:"Edit", theme:"green", msg:inp,
                    buttons:[{name:"取消"}, {name:"确定", callback:()=>{
                            let o=form.val(fu)
                            o.pid = o.pid === "undefined"?undefined:o.pid
                            if((o.id&&o.id.replace(/\s+/g,"") === '')||(o.pid&&o.pid.replace(/\s+/g,"") === '')) return message({icon:'cry',msg:'id和pid不能为空，请重新编辑'})
                            Object.assign(d,o)
                            tree.cfg.flattenData[u].filter((e,i) => tree.cfg.flattenData[u][i] = e.id === dd.id ? d : tree.cfg.flattenData[u][i])//更新此数据
                            if(dd.id!==o.id) //如果id变化了子数据的所有pid
                                tree.cfg.flattenData[u].filter(e => {if(e.pid === dd.id) e.pid = o.id})
                            p.attr('uid',o.id).find(`>.${IM}>.${IT}-tit`).attr({'post':o.post,'href':o.href}).find('>span').html(o.tit)
                        }}]
                })
                form.render('input')
            }).on('click',T.cfg.d.name+' .ys-tree-newItem',function () {
                let t =  $(this),u = T.cfg.u, z=tree.cfg[u][2], uid=getTimestamp()+parseInt(Math.random()*1000)
                tree.cfg[u][3]=tree.cfg[u][3]+1
                if(z.che&&z.che!=='')
                    z.che =`<input class=${YC} type="checkbox" name="${T.cfg.d.name+'-'+tree.cfg[u][3]}"/>`
                let zs=`<div class='${IT}' uid='${uid}' ${tree.cfg[u][4]}><div class='${IM}'>${z.fic}${z.che}<a class='${IT}-tit' href='${J}' post='${J}'><span>未命名</span></a>${z.se}</div></div>`
                t.before(zs)
                form.render('checkbox')
                tree.cfg[u][1]=$(`.ys-tree[ys-unique=${u}]`).find(`.${YC}`)
                let o={}
                for(let k in tree.cfg.flattenData[u][0]){o[k]=undefined}
                Object.assign(o,{id: uid,tit: '未命名',unique: u,pid:undefined,href:J, post:J})
                tree.cfg.flattenData[u].push(o)
                tree.drag(T.cfg.d,t.prev())
            })
            return T
        }
    },
    drag:function (d,el) {
        if(d.draggable){
            let root,inner,bar = $(d.name).find('.ys-tree-bar'),h=$(d.name).find('.'+IM).innerHeight(),u=$(d.name).attr('ys-unique')
            el.bind('dragstart',function (e) {
                stopBubble(e)
                root=$(this)
                e.originalEvent.dataTransfer.effectAllowed = 'move'
                el.parents(d.name).addClass('isDragging')
                $(d.name+`.isDragging .${IT}`).on('dragover',function (e) { //'drogenter'
                    stopBubble(e)
                    if(inner&&inner[0]===$(this)[0])//未变
                        return false
                    if(inner&&inner[0]===$(this)[0]||root[0].contains($(this)[0])||root[0] === $(this)[0]){ //在自己内
                        inner = undefined
                        bar.hide()
                        return false
                    }else{
                        inner = $(this)
                        bar.css({'top':inner.position().top+h, 'left':inner.position().left}).show()
                    }
                })
            })
            el.bind('dragend',function (e) {
                stopBubble(e)
                if(inner){
                    inner.after(root.prop("outerHTML"))
                    let ne=inner.next()
                    tree.drag(d,ne)
                    tree.drag(d,ne.find('.'+IT))
                    if(root.siblings(`.${IT}`).length===0){
                        root.parent().siblings(`.${IM}`).prepend(tree.cfg[u][2].fic).find(">."+CI).remove()
                        root.parent().parent().removeClass(ON)
                        root.parent().remove()
                    }
                    if(d.checkbox){
                        ne.find('.ys-checkbox').attr('isRender',false).siblings('.ys-checkbox-block').remove()
                        form.render('checkbox')
                    }
                    root.remove()
                    tree.cfg.flattenData[u].filter(i => i.pid = i.id===ne.attr('uid')?inner.parent().parent().attr('uid'):i.pid) //拖拽后改变id
                    tree.cfg[u][1]=$(`.ys-tree[ys-unique=${u}]`).find(`.${YC}`)
                    inner=undefined
                }
                $(d.name+'.isDragging .'+IT).off('dragover')
                el.parents(d.name).removeClass('isDragging')
                bar.hide()
            })
        }
    }
}
const ade = (d,id )=>{
    for(let i=0;i<d.length;i++){
        if(d[i]){
            if(d[i].id===id)
                delete  d[i]
            else if(d[i].pid===id){
                let nid=d[i].id
                delete  d[i]
                ade(d,nid)
            }
        }
    }
}
const treeIt = (u,el,d,ic,fic,che,se,dr) =>{
    let c=d.children||d.menus,pl,im,fc
    for(let i =0;i<c.length;i++){
        el.append(`<div class='${IT}${c[i].disabled?' ys-disabled':''}${c[i].on?' '+ON:''}' uid='${c[i].id?c[i].id:''}' ${dr}><div class='${IM}'>${che}<a class='${IT}-tit' href='${c[i].href?c[i].href:J}' post='${c[i].post?c[i].post:J}'><span>${c[i].tit}</span></a>${se}</div></div>`)
        c[i].pid=d.id;c[i].unique = u;
        let xx = {}
        for(let k in c[i]){if(k !=='children') xx[k] = c[i][k]}// let { children,...xx } = c[i] //解构存储去掉children属性 不支持webpack
        tree.cfg.flattenData[u].push(xx)
        pl=c[i].on?"style='display:block'":''
        if(c[i].children&&c[i].children.length>0){
            im =el.find(`>.${IT}`).eq(i).find(`>.${IM}`)
            im.prepend(ic).parent().append(`<div class='${IC}' ${pl}></div>`)
            fc=im.find(`>.${CI}>i:first-child`)
            if(c[i].on){
                if(im.find(`>.${CI}>i`).length>1)
                    fc.hide(0).siblings().show(0)
                else
                    fc.addClass(RZ)
            }
            treeIt(u,el.find(`>.${IT}`).eq(i).find(`>.${IC}`),c[i],ic,fic,che,se,dr)
        }else
            el.find(`>.${IT}`).eq(i).find(`>.${IM}`).prepend(c[i].fileIcon?`<span class=${FI}>${c[i].fileIcon}</span>`:fic)
        //delete c[i].children 这样会改变原数组
    }
}
export default  tree