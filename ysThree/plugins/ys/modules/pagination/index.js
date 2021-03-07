import $ from "../jquery"
import {isON} from "../utils"
const  paging ={
    cfg:{},
    render:d=> {
        if(d.total<1) return false
        d.sizes = d.sizes? d.sizes:['10','20','30','40'];d.size = d.size? d.size:10;d.layout = d.layout? d.layout:['pager','next']
        let p = new paging.page(d),el = $(d.name),ht=''
        d.layout.forEach(i=>{ if(p.layoutHtml[i])ht=ht+p.layoutHtml[i]} )
        el.append(ht)
        p.bindEvent(el)
    },
    reload :d =>{ $(d.name).html('');paging.render(d) },
    page:function (d) {
        let t= this,doc= $(document)
        t.current= d.current?d.current:1;t.total=d.total;t.sizes=d.sizes; t.size=d.size;t.pageNum=Math.ceil(t.total/t.size)||1;t.layout=d.layout
        t.layoutHtml= {total:paging.element.total(t.pageNum), sizes:paging.element.sizes(t.sizes), pager:`<div class="page-pager">${paging.element.pager(t)}</div>`, jumper:paging.element.jumper(t.current)}
        t.bindEvent=function (el) {
            doc.on('click',d.name+' .page-pager span',function () {
                let $t = $(this), n = $t.attr('page')
                if (!n||isON($t,'ys-disabled')||(parseInt(n)===t.current)&&n!=='+1') return false
                if(n==='-1') t.current=t.current-1
                else if(n==='+1') t.current=t.current+1
                else t.current=parseInt(n)
                el.find('.page-pager').html(paging.element.pager(t))
                if(d.jump) d.jump(t)
            })
            doc.on('change',d.name+' .page-sizes select',function () {
                t.size=$(this).val();t.pageNum=Math.ceil(t.total/t.size)||1;t.current=1
                el.find('.page-pager').html(paging.element.pager(t)).siblings('.page-total').html('共'+t.pageNum+'页')
                if(d.sizeChange)
                    d.sizeChange(t)
            })
            doc.on('click',d.name+' .page-jump .jump-btn',function () {
                let i= parseInt($(this).siblings('input').val())||1
                if(i===t.current) return false
                i=i<1?1:i;t.current=t.pageNum<i?t.pageNum:i
                el.find('.page-pager').html(paging.element.pager(t))
                if(d.jump) d.jump(t)
            })
        }
    },
    element: {
        one: (c,i,to) =>`<span class="${c===i?'ys-on':''}" page=${to}>${to}</span>`,
        total: t => `<div class="page-total">共${t}页</div>`,
        sizes: ss =>{
            let op=''
            for(let i =0;i<ss.length;i++){op=op+` <option value="${ss[i]}">${ss[i]}页/条</option>`}
            return `<div class="page-sizes"><select>${op}</select></div>`
        },
        pager: t =>{
            let to = t.pageNum,c=t.current,nxt= t.layout.filter(i => i === 'next').length>0,last=nxt?`<span class="${c===1?'ys-disabled':''}" page="-1">上一页</span>`:'',next=nxt?`<span class="${c===to?'ys-disabled':''}" page="+1">下一页</span>`:'',min=c-3>=1?c-3:1, max=min+7>to?to:min+7, pa=''
            min=((max<=6?1:min)+6>=to?to-6:(max<=6?1:min))<1?1:((max<=6?1:min)+6>=to?to-6:(max<=6?1:min))
            for(let i= min;i<=max;i++){
                if(to<=6) pa = pa+paging.element.one(c,i,i)
                else if(i===min&&i!==1) pa=pa+ paging.element.one(c,i,1)+`<span>...</span>`
                else if(i===max) pa=pa+paging.element.one(c,i,to)
                else if(i===max-1) pa=pa+(to-c>3?'<span>...</span>':paging.element.one(c,i,i))
                else pa = pa+paging.element.one(c,i,i)
            }
            return last+pa+next
        },
        jumper: current => `<div class="page-jump"> <span class="">到第</span> <input class="" value="${current}" /><span>页</span><span class="jump-btn">确定</span> </div>`
    }
}
export  default  paging