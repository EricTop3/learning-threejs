$(function () {
    var sc
    http.method.updateSiteClicker({"name":"Home"},function (res) {
        sc=res.siteclicker;
        var obj = []
        var names = []
        for(var i = 0;i<sc.length;i++){
            obj.push(sc[i].number)
            names.push(sc[i].name)
        }
        var myChart1 = echarts.init(document.getElementById('chart-1'))
        var barWidth=20
        var option1={
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top:'30',
                left: '60',
                right: '60',
                bottom: '50',
            },
            xAxis : [
                {
                    type : 'category',
                    data : names,
                    axisTick: {
                        show: false, //是否显示坐标轴刻度
                        length:2
                    },
                    axisLine:{
                        lineStyle:{
                            color:'rgba(255,255,255,0.5)'
                        }
                    },
                    splitLine:{
                        show:false
                    },
                    axisLabel:{
                        rotate:10
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLine:{
                        lineStyle:{
                            color:'rgba(255,255,255,0.5)'
                        }
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            series : [
                {
                    type:'bar',
                    barWidth: barWidth,
                    data:obj,
                }
            ]
        }
        myChart1.setOption(option1)
        $(window).resize(function () {
            $(myChart1).resize()
        })
    })
    var list= [
        {
            tit:'ys ui',
            label:'一套全面的前端组件库，一键代码构成，前后端工程师的好助手',
            href:"ysUi/app.html"
        },
        {
            tit:'ys chart',
            label:'工作中echarts等的图表的收集',
            href:"ysChart/app.html"
        },
        {
            tit:'ys note',
            label:'一路走来，从小白开始的知识积累',
            href:"ysNote/app.html"
        },
        {
            tit:'ys map',
            label:'百度地图的功能介绍及应用',
            href:"ysMap/app.html"
        },
        {
            tit:'ys cesium',
            label:'浅析cesium，示例常用操作',
            href:"ysCesium/main/app.html"
        },
        {
            tit:'ys vue',
            label:'一套简易的vue组件库',
            href:"//www.wellyyss.cn/vue/dist"
        },
        {
            tit:'ys three',
            label:'博观而约取，厚积而薄发，终于还是沉下心来，写了three的基础教学和简单示例...',
            href:"ysThree/main/app.html"
        },
        {
            tit:'ys display',
            label:'一路来，写过一些经典案例的展示...',
            href:"ysDisplay/app.html"
        }
    ]
    for(var i =0;i<list.length;i++){
        $(".bottom").append("<div class='ys-col-lg4 ys-col-md6 ys-col-xs12'>" +
            "            <a class='box ys-hover-shadow-translateY' href='"+list[i].href+"'>" +
            "                <div class='box-tit ys-tit-sm'><span>"+list[i].tit+"</span></div>" +
            "                <div class='box-label'>"+list[i].label+"</div>" +
            "            </a>" +
            "        </div>")
    }
    // ys.monitor.on("drop-1",function (obj) {
    //     http.method.updateSiteClicker({"name":"download"},function (res) {})
    // })
    $(".down-icon").click(function () {
        $(".ys-absolute-container").scrollTop(1000)
    })

    ys.drag.direction({
        name:document,
        toTop:function () {
            $(".total").animate({
                top:-300
            })
        },
        toBottom:function () {
            $(".total").animate({
                top:0
            })
        }
    })
})
