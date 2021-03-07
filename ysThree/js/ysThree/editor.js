var $=ys.$
var aceEditor
function initPage(url) {
    initEditor(url)
}
function initCodeEditor() {
    if (!aceEditor) {
        aceEditor = ace.edit("editor")
        // aceEditor.setTheme("ace/theme/xcode")
        aceEditor.getSession().setMode("ace/mode/html")
        aceEditor.getSession().setUseWrapMode(true)
        aceEditor.setShowPrintMargin(false)
        aceEditor.$blockScrolling = Infinity
    }
    aceEditor.setValue($('#editor').val())
    aceEditor.clearSelection()
    aceEditor.moveCursorTo(0, 0)
}
//初始化编辑器以及预览内容
function initEditor(url) {
    loadExampleHtml(url)
    initCodeEditor()
}
//加载代码
function loadExampleHtml(url) {
    var loading3=ys.message({
        type:"loading",
        icon:"loading-3",
    })
    var html = $.ajax({
        url: url,
        async: false,
        type:'get',
        error: function (error) {
            alert("获取页面失败！")
            html = ""
        }
    }).responseText
    if (html && html != "") {
        $('#editor').val(html)
        loadPreview(html)
        setTimeout(function () {
            loading3.remove()
        },200)
    }
}
//运行代码
function run() {
    var iframeContent = $("#editor").val()
    if (editor) {
        iframeContent = aceEditor.getValue()
    }
    loadPreview(iframeContent)
}
//填充预览效果内容
function loadPreview(content) {
    var iFrame = createIFrame(),
        iframeDocument = iFrame.contentWindow.document
    iframeDocument.open()
    iframeDocument.write(content)
    iframeDocument.close()
}
//创建iframe
function createIFrame() {
    var preViewPane = $("#previewPane")
    preViewPane.empty()
    var iframe = document.createElement("iframe")
    $(iframe).attr("id", "innerPage")
    $(iframe).attr("name", "innerPage")
    preViewPane.append(iframe)
    return iframe
}
//重置编辑器
function refresh(url) {
    initEditor(url)
    run()
}
//绑定事件（查看源码/展开）
function bindEvents() {
    var expand = !!1
    $("#showCodeBtn").click(function () {
        if (expand) {
            $(this).text("展开")
            $(".left").stop().animate({
                width:"400px"
            },200)
            $(".right").stop().animate({
                left:"400px"
            },200,function () {
                aceEditor.resize()
            })
        } else {
            $(this).text("源码")
            $(".left").stop().animate({
                width:0
            },200)
            $(".right").stop().animate({
                left:0
            },200,function () {
                aceEditor.resize()
            })
        }
        expand = !expand
    })
}
$(function () {
    //拖拽伸缩区域
    $(".left-bar").mousedown(function (e) {
        $(document).addClass("user-unselect")
        var x0=e.pageX
        var w0=parseFloat($(".left").css("width"))
        $(".right-men").show(0)

        $(document).mousemove(function (e) {
            var x1=e.pageX
            var x=x1-x0
            $(".left").css("width",w0+x)
            $(".right").css("left",w0+x)
            aceEditor.resize()
        }).mouseup(function () {
            $(document).removeClass("user-unselect")
            $(document).off("mousemove")
        })
    }).mouseup(function () {
        $(".container").removeClass("user-unselect")
        $(document).off("mousemove")
        $(".right-men").hide(0)
    })
//运行
    $("#runBtn").click(function () {
        run()
    })
//重载
    $("#resetBtn").click(function () {
        refresh(url)
    })
//
    $(".right-men").click(function () {
        $(this).hide(0)
    })

//初始化
    var url="../lesson_0/0_0_index.html"
    initPage(url)
    bindEvents()
//左侧路由点击;
    ys.monitor.on('nav1',function (e) {
        if(e.post!=="javascript:;"&&url!==(e.post+'.html')){
            url = e.post + '.html'
            initPage(url)
            bindEvents()
            $('.index-left').getNiceScroll().resize()
        }
    })
})
