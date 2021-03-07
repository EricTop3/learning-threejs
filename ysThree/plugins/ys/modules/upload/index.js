import $ from "../jquery"
import {each, getReplaceAllStr, getTimestamp, stopDefault} from "../utils"
import messageBox from "../messageBox"
const upload ={
    render:d =>{
        const t = new upload.instance(d)
        t.init(t).onchange(t)
        if(d.drag) t.drag(t)
        return t
    },
    instance: function (d) {
        const t= this,_p =upload.instance.prototype
        t.d = d
        _p.init = t =>{
            t.el = $(d.name)
            t.chooseFiles = {}
            t.multiple = t.d.multiple
            t.size = t.d.size|| false
            t.limit = t.d.limit|| false
            t.SIZE = 0
            t.field = t.d.field || 'file'
            t.auto = t.d.auto === false ? false:true
            t.el.after(`<input type='file' ${t.multiple?'multiple':''}  name = '${t.field}'  accept='${t.d.accept||''}' hidden/>`)
            t.input = t.el.next()
            t.el.click(()=> t.input.click())
            t.err = err =>messageBox({icon:'cry',tit:'提示',msg:err})
            $(t.d.bindAction).click(()=> t.upload(t))
            return t
        }
        _p.upload = (t,files)=>{
            if(t.d.beforeUpload&&Object.keys(files||t.chooseFiles).length>0){
                if(t.d.beforeUpload(files || t.chooseFiles) === false) return upload.clear(t)
            }
            let N = Object.keys(files||t.chooseFiles).length
            each(files||t.chooseFiles,(key,m)=>{
                const data = new FormData()
                each(t.d.data,(j,n)=> data.append(j,n))
                data.append(t.field,m)
                $.ajax({
                    url: t.d.url,
                    type: "post",
                    data: data,
                    contentType: !1,
                    processData: !1,
                    dataType: "json",
                    headers: t.headers || {},
                    success: function(res) {
                        N --
                        if(t.d.autoClear) {
                            delete t.chooseFiles[key]
                            t.input.val('')
                        }
                        if(t.d.done) t.d.done(res,key)
                        if(t.d.multiple&&!t.auto&&t.d.allDone&&N===0){
                            t.d.allDone(res)
                        }
                    },
                    error: function(err) {
                        N --
                        t.err('接口异常')
                        if(t.d.error) t.d.error(err,key)
                    },
                    xhr: function() {
                        const x = new XMLHttpRequest
                        return x.upload.addEventListener("progress", function(e) {
                            if (e.lengthComputable) {
                                    "function" === typeof t.d.progress && t.d.progress(Math.floor(e.loaded / e.total * 100),key, e)
                                }
                            }),x
                    }
                })
            })
            return t
        }
        _p.onchange = t =>{
            t.input.change(function (e) {
                if(!upload.isFile($(this)[0])) return t.err(`非文件上传`)
                const files = e.target.files || e.dataTransfer.files
                if(files)
                   t.doFiles(t,files)
            })
            return t
        }

        _p.doFiles = (t,files) =>{
            const key =  getReplaceAllStr(t.d.name,'#')+'_'+getTimestamp()+parseInt(Math.random()*9999)
            each(files,function (i,file) {
                if( t.limit && Object.keys(t.chooseFiles).length > t.limit -1) {
                    t.input.val('')
                    return t.err(`同时只能上传${t.limit}个文件`)
                }
                if (t.d.exts && !RegExp("\\w\\.(" + t.d.exts + ")$", "i").test(escape(file.name))){
                    t.input.val('')
                    return t.err(`文件扩展名不符合要求`)
                }
                if( t.size && (file.size/ 1024 / 1024 > t.size)){
                    t.input.val('')
                    return t.err(`单个文件不能超过${t.size}M`)
                }
                if( t.d.sizes && (t.SIZE + file.size/ 1024 / 1024)> t.d.sizes) {
                    t.input.val('')
                    return t.err(`多个文件总大小不能超过${t.d.sizes}M`)
                }
                t.chooseFiles = (!t.multiple)?{}:t.chooseFiles
                t.chooseFiles[key+i] = file
                t.SIZE =  t.SIZE + file.size/ 1024 / 1024
                const r = new FileReader()
                r.onload = function () {
                    if(t.d.change) t.d.change(t.chooseFiles,file,this.result,key+i)
                }
                r.readAsDataURL(file)
                if(t.auto&&i===files.length-1) t.upload(t)
            })
        }
        _p.drag = t =>{
            $(document).on('dragover',function (e) {
                stopDefault(e)
            }).on('dragleave',function (e) {
                stopDefault(e)
            }).on('drop',function (e) {
                stopDefault(e)
            }).on('dragenter',function (e) {
                stopDefault(e)
            })
            t.el.on('drop',function (e) {
                stopDefault(e)
                t.doFiles(t,e.originalEvent.dataTransfer.files)
            })
        }
    }
    ,clear:t => {
        t.chooseFiles = {}
        t.input.val('')
        return t
    }
    , delete:(t,key) => each(t.chooseFiles,i => i === key ? delete t.chooseFiles[key]:'')
    , upload:(t,key)=>{
        const obj ={}
        each(t.chooseFiles,(i,file)=>{if(i === key) obj[i] = file})
        t.upload(t,obj)
    }
    , isFile : input =>{
        if (input) return "input" === input.tagName.toLocaleLowerCase() && "file" === input.type
    }
}

export default  upload