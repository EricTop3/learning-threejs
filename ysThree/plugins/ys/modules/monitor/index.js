import message from "../message"
const monitor ={
    config:{},
    on:function (unique,callback) {
        if(monitor.config[unique])
            message({icon:'notice',msg:"ys-unique需唯一，且监听一次，如多次监听，只响应最后一次监听回调"})
        monitor.config[unique]=[callback]
    },
    execute:function (obj) {
        if(monitor.config[obj.unique])
           return monitor.config[obj.unique][0](obj)
    }
}
export default monitor