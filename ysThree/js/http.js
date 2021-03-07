(function (window) {
    function ajax(data){
        var showLoading=data.showLoading||false;//是否显示正在加载；当页面初始时候最好不需要，只操作页面时才显示；
        if(showLoading==true){
            var thisLayer= ys.message('正在请求，请稍候...');
        }
        data.success=function (res) {
            if(showLoading==true)
                thisLayer.remove();
            if(res.mesCode!=0){ //请求不成功;
                ys.message("<span style='color:red'>"+res.resCode+"</span>");
            }else{
                data.callback(res)
            }
        };
        // data.async=false;//默认为true，为异步执行；必要时需要改为同步执行
        data.error=function (e) {
            ys.message("<span style='color:red'>网络连接异常</span>");
            if(showLoading==true)
                thisLayer.remove();
            throw e
        }
        $.ajax(data);
    }
    var DOMAIN='https://www.wellyyss.cn'
    var PATH=DOMAIN+"/ClodyNoteV2/cors"
    var http={
        domain:DOMAIN,
        url:{
            updateSiteclicker:PATH+"/updateSiteclicker",
            doGetNoteByKind:PATH+"/doGetNoteByKind",
            doGetHotNote:PATH+"/doGetHotNote",
            doUpdateClickNum:PATH+"/doUpdateClickNum",
            doLogin:PATH+"/doLogin",
            getSay:'../data/goodSay.json'
        },
        method:{
            updateSiteClicker:function (data,callback) {
                ajax({
                    type: "post",
                    // showLoading:false,//默认false;
                    url: http.url.updateSiteclicker,
                    data: data,
                    callback:function (res) {
                        if(callback&&typeof callback=="function")
                            callback(res)
                    }
                });
            },
            doGetNoteByKind:function (data,callback) {
                ajax({
                    type: "post",
                    url: http.url.doGetNoteByKind,
                    data: data,
                    callback:function (res) {
                        if(callback&&typeof callback=="function")
                            callback(res)
                    }
                });
            },
            doGetHotNote:function(data,callback){
                ajax({
                    type: "post",
                    url: http.url.doGetHotNote,
                    data: data,
                    callback:function (res) {
                        if(callback&&typeof callback=="function")
                            callback(res)
                    }
                });
            },
            doUpdateClickNum:function (data,callback) {
                ajax({
                    type: "post",
                    url: http.url.doUpdateClickNum,
                    data: data,
                    callback:function (res) {
                        if(callback&&typeof callback=="function")
                            callback(res)
                    }
                });
            },
            getSay:function (data,callback) {
                ajax({
                    type: "get",
                    url: http.url.getSay,
                    data: data,
                    callback:function (res) {
                        if(callback&&typeof callback=="function")
                            callback(res)
                    }
                });
            },
            doLogin:function (data,callback) {
                ajax({
                    type: "post",
                    url: http.url.doLogin,
                    data: data,
                    callback:function (res) {
                        if(callback&&typeof callback=="function")
                            callback(res)
                    }
                })
            }
        }
    }
    window.http=http
})(window)
