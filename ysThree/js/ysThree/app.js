var $= ys.$
var doc=$(document)
window.jQuery = $
//载入页面以及script
$(function () {
    $(".index-right").load("editor_template.html",function () {
        var path=["../../plugins/ace/ace.js","../../plugins/ace/theme-monokai.js","../../plugins/jquery.nicescroll.js","../../js/ysThree/editor.js"]
        var _script
        for(var i=0;i<path.length;i++){
            _script = document.createElement('script')
            _script.async = false
            _script.src = path[i]
            document.getElementsByTagName("body")[0].appendChild(_script)
        }
        _script.onload=function () {
            loadRouters()
        }
        function loadRouters(){
            //写入菜单
            $.ajax({
                type: "get",
                url:"../../data/ysThree/three_cfg.json",
                data: "",
                success: function(res){    //res后台取到的数据.
                    ys.sideNav({
                        name:'#nav',
                        menus:res
                    })
                     $("#nav").append("<p class='over-line'>——&nbsp;&nbsp;我是有底线的&nbsp;&nbsp;——</p>")
                    //改变滚动条;
                    function showScroll() {
                        // 判断niceScroll插件是否存在
                        if(!$('.index-left').niceScroll) return;
                        $('.index-left').niceScroll({
                            cursorcolor:'rgba(0, 0, 0, 0.2)',
                            cursorwidth: '4',
                            cursorborderradius: '0',
                            cursorborder: '4',
                            hidecursordelay: 800,
                            background: ''
                        });
                    }
                    showScroll();
                    $(window).resize(function () {
                        $('.index-left').getNiceScroll().resize()
                    })
                }
            })
        }
        //右侧全屏
        doc.on("click",".ys-icon-full-screen",function () {
            $(this).removeClass("ys-icon-full-screen").addClass("ys-icon-exit-screen");
            $(".index-right").css("z-index",999).animate({
                top:0,
                left:0,
                bottom:0,
                "z-index":999
            },300)
        })
        doc.on("click",".ys-icon-exit-screen",function () {
            $(this).removeClass("ys-icon-exit-screen").addClass("ys-icon-full-screen");
            $(".index-right").animate({
                top:parseInt($(".index-top").css("height"))+10,
                left:parseInt($(".index-left").css("width"))+10,
                bottom:"10px",
                "z-index":11
            },300)
        })
    });
})


