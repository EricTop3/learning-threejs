import $ from "../jquery"
import  message from "../message"
import monitor from "../monitor"
const td0 = str =>str.toString().length<=1?'0'+str.toString():str.toString()
const tz = str =>{
    let date=str?new Date(str):new Date()
        ,y=date.getFullYear()
        ,mon=td0((date.getMonth() + 1))
        ,d=td0(date.getDate())
        ,h=td0(date.getHours())
        ,min=td0(date.getMinutes())
        ,s=td0(date.getSeconds())
        ,nd='星期'+"日一二三四五六".charAt(date.getDay())
    return {
        tamp:y+mon+d+h+min+s,//时间戳
        time:y+'-'+mon+'-'+d+' '+h+':'+min+':'+s,
        week:nd
    }
}
const getTimestamp = (str) => {
    return tz(str).tamp
}
const getTime = (str) => {
    return tz(str).time
}
const getWeek = (str) => {
    return tz(str).week
}
const browser = () =>{
    let a = navigator.appName === "Microsoft Internet Explorer",b =navigator.appVersion.split(";")[1].replace(/[ ]/g,"")
    return a && b ==="MSIE8.0"?"IE8":(a && b ==="MSIE9.0"?"IE9":'OK')
}
const device = ()=>{
    const agent = navigator.userAgent.toLowerCase()
        ,getVersion = label => ((agent.match(new RegExp(label + '/([^\\s\\_\\-]+)')) || [])[1]) || false  //获取版本号
        ,r = {
        os :/windows/.test(agent)?'windows':(/linux/.test(agent)?'linux':((/iphone|ipod|ipad|ios/.test(agent))?/iphone|ipod|ipad|ios/.test(agent):'其他')),
        ie : (!!window.ActiveXObject || "ActiveXObject" in window) ? (
            (agent.match(/msie\s(\d+)/) || [])[1] || '11' //ie11并没有msie的标识
        ) : false,
        weixin : getVersion('micromessenger')
    };
    r.android = /android/.test(agent)
    r.ios = r.os === 'ios'
    return r
}
const mouseWheel = (c1,c2,i) => {
    let flog=true
    if(browser()==="IE8"){
        document.attachEvent('onmousewheel', function(e) {
            f(-e.wheelDelta)
        }, false)
    }else{
        document.addEventListener('DOMMouseScroll', function(e) {
            f(e.detail)
        }, false)
        document.onmousewheel=function(e){
            f(e.deltaY||-e.wheelDelta)
        }
    }
    function f(yy) {
        if(flog===true){
            flog=false
            if(yy>0)
                c1()
            else
                c2()
            let st=setTimeout(function () {
                flog=true
                clearTimeout(st)
            },i||20)
        }
    }
}
const stopBubble = e => e && e.stopPropagation? e.stopPropagation():(window.event.cancelBubble = true)
const stopDefault = e => e && e.preventDefault? e.preventDefault():(window.event.returnValue = false)
const rightClick = (data,c) =>{
    $(document).delegate(data,'contextmenu', function (e) {
        stopDefault(e)
    }).delegate(data,'mousedown', function (e) {
        if (e.which === 3 && c &&typeof c === 'function') {
            stopDefault(e)
            c($(this),e.clientX,e.clientY)
        }
    })
}
const getUrlParam = (name) =>{ //获取单个
    let r = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"))
    return r?decodeURI(r[2]):null
}
const getUrlParams = () =>{ //获取所有
    let url = location.search,ps = new Object()
    if (url.indexOf("?") !== -1) {
        let str = url.substr(1), strs = str.split("&")
        for(let i = 0; i < strs.length; i ++) {
            ps[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1])
        }
    }
    return ps
}
const getCurrentFileName = () =>{
    return window.location.href.substring(window.location.href.lastIndexOf("/") + 1).split("?")[0]
}
const getCurrentJsPath =() =>{
    let jsPath = document.currentScript ? document.currentScript.src : function(){
        let js = document.scripts
            ,last = js.length - 1
            ,src
        for(let i = last; i > 0; i--){
            if(js[i].readyState === 'interactive'){
                src = js[i].src
                break;
            }
        }
        return src || js[last].src
    }()
    return jsPath.substring(0, jsPath.lastIndexOf('/') + 1)
}
const getHtmlEscape =(str) =>{ //只转了 & < >
    return  str.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;").replace(new RegExp(">", "g"), "&gt;")
}
const getReplaceAllStr =(s1,s2,s3)=> {
    if (!s2)
        s2 = ' '
    if(!s3)
        s3 = ''
    return s1.replace(new RegExp(s2,"g"),s3)
}
const getOperatingSystem =() =>{
    let userAgent = window.navigator.userAgent.toLowerCase()
    let v = ''
    if(userAgent.indexOf("win") > -1) {
        if(userAgent.indexOf("windows nt 5.0") > -1 || userAgent.indexOf("Windows 2000") > -1)
            v = "windows 2000"
        else if(userAgent.indexOf("windows nt 5.1") > -1 || userAgent.indexOf("Windows XP") > -1)
            v = "windows xp"
        else if(userAgent.indexOf("windows nt 5.2") > -1 || userAgent.indexOf("Windows 2003") > -1)
            v = "windows 2003"
        else if(userAgent.indexOf("windows nt 6.0") > -1 || userAgent.indexOf("Windows Vista") > -1)
            v = "windows vista"
        else if(userAgent.indexOf("windows nt 6.1") > -1 || userAgent.indexOf("windows 7") > -1)
            v = "windows 7"
        else if(userAgent.indexOf("windows nt 6.2") > -1 || userAgent.indexOf("windows 8") > -1)
            v = "windows 8"
        else if(userAgent.indexOf("windows nt 6.3") > -1)
            v = "Windows 8.1"
        else if(userAgent.indexOf("windows nt 6.4") > -1 || userAgent.indexOf("windows nt 10") > -1)
            v = "windows 10"
        else
            v = "unknown"
    }
    else if(userAgent.indexOf("iphone") > -1)
        v = "iphone"
    else if(userAgent.indexOf("mac") > -1)
        v = "mac"
    else if(userAgent.indexOf("x11") > -1 || userAgent.indexOf("unix") > -1 || userAgent.indexOf("sunname") > -1 || userAgent.indexOf("bsd") > -1)
        v = "unix"
    else if(userAgent.indexOf("linux") > -1) {
        if(userAgent.indexOf("android") > -1)
            v = "android"
        else
            v = "linux"
    }
    else { v = "unknown" }

    return v
}
const each = function(obj, fn) {
    let t = this,key
    if (typeof fn !== 'function') return t
    obj = obj || []
    if (obj.constructor === Object) {
        for (key in obj) {
            if (fn.call(obj[key], key, obj[key])) break
        }
    } else {
        for (key = 0; key < obj.length; key++) {
            if (fn.call(obj[key], key, obj[key])) break
        }
    }
    return t
}
const isON = (i,n) => i.attr("class")?i.attr("class").split(' ').indexOf(n)!==-1:false
const fixPosition = (p,el,clicker,offset) =>{
    let rh=parseFloat(el.innerHeight()),rw=parseFloat(el.innerWidth()),ch=parseFloat(clicker.innerHeight()),cw=parseFloat(clicker.innerWidth()),rp={}
    let ct=parseFloat(clicker[0].getBoundingClientRect().top) ,cl=parseFloat(clicker[0].getBoundingClientRect().left)//获取元素距离视窗的距离
    if(p==='top')
        rp={left:cl-(rw-cw)/2,top:ct-rh-13+offset}
    else if(p==='right')
        rp={left:cl+cw+13+offset,top:ct-(rh-ch)/2}
    else if(p==='bottom')
        rp={left:cl-(rw-cw)/2,top:ct+ch+13+offset}
    else if(p==='left')
        rp={left:cl-rw-13+offset,top:ct-(rh-ch)/2}
    el.css(rp)
}
const ajax = (data) =>{
    if(data.code){
        let l = message({type:"loading", icon:"loading-3"})
        data.success=function (res) {
            l.remove()
            if(!data.code)  return data.callback(res)
            if(res[data.code.errCode[0]]===data.code.errCode[1])
                message({ msg: data.code.errMsg[1]?data.code.errMsg[1]:res[data.code.errMsg[0]], during:3000, icon:"cry",direction:"ys-shake-rotate"})
            else
                data.callback(res)
        }
        data.error=function (e) {
            l.remove()
            message({ msg:'请求失败：'+e.status, during:3000, icon:"cry",direction:"ys-shake-rotate"})
        }
    }
    $.ajax(data)
}
const iterateRouter=(container,data) =>{
    let chi=data.children||data.menus
    for(let i=0;i<chi.length;i++){
        container.append(`<div class="ys-packedNav-item${chi[i].on===true?' ys-on':''}"><a class="ys-packedNav-tit" href="${chi[i].href||'javascript:;'}"  post="${chi[i].post||''}"><span class="ys-tit-word">${chi[i].tit}</span></a></div>`)
        if(chi[i].children&&chi[i].children.length>0){
            container.find(">.ys-packedNav-item").eq(i).append(`<i class="ys-icon ys-icon-right"></i><div class="ys-packedNav-con"></div>`)
            iterateRouter(container.find(">.ys-packedNav-item").eq(i).find(".ys-packedNav-con").eq(0),chi[i])
        }else
            container.find(">.ys-packedNav-item").eq(i).addClass("ys-nav-item-end")
    }
}
const routerClick = (el,rootP) =>{
    let obj={el: el, index:el.index(), post: el.attr("post")||el.find("a").attr("post"), text: el.text(), html:el.html(), unique: rootP.attr("ys-unique")},f= rootP.attr("ys-iframe")
    if(rootP.attr("ys-unique"))
        monitor.execute.call(el,obj)
    if(f&&obj.post!== '')
        $(f).attr("src",obj.post)
}
const listToTree = list =>{
    let map = {}, node, tree= [], i
    for (i = 0; i < list.length; i ++) {
        map[list[i].id] = list[i]
        list[i].children = []
    }
    for (i = 0; i < list.length; i += 1) {
        node = list[i]
        if (node.pid) map[node.pid].children.push(node)
        else tree.push(node)
    }
    return tree
}
const treeToList = tree =>{
    let o=[]
    const forIt = (c,id,leave) =>{
        for(let i =0;i<c.length;i++){
            c[i].pid=id;o.push(c[i]);c[i].leave = leave + 1;c[i].hasChild = c[i].hasChild||c[i].children&&c[i].children.length>0
            if(c[i].hasChild) forIt(c[i].children,c[i].id,c[i].leave)
            delete c[i].children
        }
    }
    forIt(tree,undefined,-1,false)
    return o
}
const ifPercent = (w,h,el) =>{
    if(w&&w.toString().indexOf('%')!==-1)
        el.css({marginLeft:(100 - w.replace("%",""))/2+'%',left:'auto'})
    if(h&&h.toString().indexOf('%')!==-1)
        el.css({marginTop:(100 - h.replace("%",""))/2+'%',top:'auto'})
}
const getScrollBarWidth=()=>{
    let scrollBarWidth
    const ot = document.createElement('div')
    ot.className = 'el-scrollbar__wrap'
    ot.style.visibility = 'hidden'
    ot.style.width = '100px'
    ot.style.position = 'absolute'
    ot.style.top = '-9999px'
    document.body.appendChild(ot)
    const widthNoScroll = ot.offsetWidth
    ot.style.overflow = 'scroll'
    const inner = document.createElement('div')
    inner.style.width = '100%'
    ot.appendChild(inner)
    const widthWithScroll = inner.offsetWidth
    ot.parentNode.removeChild(ot)
    scrollBarWidth = widthNoScroll - widthWithScroll
    return scrollBarWidth
}
function getCirclePoints(r, ox, oy, count){ //求圆周上等分点的坐标 : ox,oy为圆心坐标 r为半径 count为等分个
    let point = [],radians = (Math.PI / 180) * Math.round(360 / count)
    for(let i = 0; i < count; i++){
        point.unshift({x: ox + r * Math.sin(radians * i),y:oy + r * Math.cos(radians * i)}); //为保持数据顺时针
    }
    return point
}
function getDirectionInClient(el) {
    const x = el[0].getBoundingClientRect().left,y =el[0].getBoundingClientRect().top,w = el.innerWidth(),h=el.innerHeight(),W = $(window).innerWidth()/2,H =$(window).innerHeight()/2

    return [w/2+x>W?'right':'left',h/2+y>H?'bottom':'top']
}
export {
    getTimestamp,
    getTime,
    getWeek,
    mouseWheel,
    browser,
    stopBubble,
    stopDefault,
    rightClick,
    getUrlParam,
    getUrlParams,
    getCurrentFileName,
    getCurrentJsPath,
    getHtmlEscape,
    getReplaceAllStr,
    getOperatingSystem,
    each,
    isON,
    fixPosition,
    ajax,
    iterateRouter,
    routerClick,
    listToTree,
    treeToList,
    ifPercent,
    getScrollBarWidth,
    device,
    getCirclePoints,
    getDirectionInClient
}
