(function (w,u) {
    /*地图水波扩散特效 Start*/
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    var cancelAnimationFrame  = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;
    /**
     * sos告警圆形范围绘制(只有存在map对象时才可以使用)
     * @param radius 半径
     * @param level 层数
     * @param point BMap.Point对象，圆的中心点
     * @param color  颜色对象，包含{fillColor,fillOpacity}
     */

    function bmapWave(radius,level,point,color){
        if(!window.map || !window.BMap|| !window.BMap.Circle){
            return undefined;
        }
        this.radius = radius;
        this.level = new Number(level);
        this.point = point;
        this.color = color;

        if(Number.isNaN(this.level)){
            this.level = 1;
        }//至少1层

        if(!this.color || !this.color.fillColor){
            this.color = {
                fillColor:"blue",//默认蓝色
                fillOpacity:0.3	 //默认初始透明度0.3
            }
        }

        //计算平均每段扩展距离的透明度
        this.endOpacity = 0.1;		//终止透明度设置为0.1
        this.speedOpacity = (this.color.fillOpacity - this.endOpacity)/this.radius;	//每米的透明度

        //先加一层红色的覆盖物，加在图片上表示覆盖范围
        /*this.circle0 = new BMap.Circle(this.point,this.radius,{
            fillColor:"white",
            fillOpacity: 0.2,
            strokeWeight: 1 ,
            strokeColor:"white",
            strokeOpacity: 0.2,
            enableEditing:false
        });
        map.addOverlay(this.circle0);*/

        //按层数循环构造覆盖物，并加在图片上
        this.circles = new Array();
        for(var i=1; i< this.level; i++){
            var circle = new BMap.Circle(this.point,0,{
                fillColor:this.color.fillColor,
                fillOpacity: this.color.fillOpacity,
                strokeWeight: 1,
                strokeColor:this.color.fillColor,
                strokeOpacity: this.color.fillOpacity,
                enableEditing:false
            });
            this.circles.push(circle);
            map.addOverlay(circle);
        }

        this.clock=new Array(this.level);
    }

    /**
     * 动画启动
     * @param distance 波纹间隔时间（单位ms）
     * @param t0 扩散一次所需的时间
     */
    bmapWave.prototype.start = function (distance,t0){
        var _self = this;

        /**
         * 定义动画函数
         * @param startTime 启动的初始时间
         * @param circle 圆形覆盖物对象
         * @param index 序号
         */
        function animateStart(startTime,circle,index){
            //计算时间差
            var time = new Date().getTime()-startTime;
            if(time<0){
                circle.setRadius(0);						//半径
                circle.setFillOpacity(_self.color.fillColor);	//透明度
                circle.setStrokeOpacity(_self.color.fillOpacity);	//透明度
                //如果未达到执行实现则直接等待
                _self.clock[index] = window.requestAnimationFrame(animateStart.bind(null,startTime,circle,index));
                return;
            }
            //计算当前半径
            //匀减速运动下，每隔t时间，应该扩散的半径:
            //r=r0*(2*t*t0-t*t)/t0
            //其中，r0为最终的扩散半径，即this.radius
            var r = Math.floor(_self.radius*(2*time/t0-time*time/t0/t0));
            var opacity = 0;
            if(time >= t0){
                //达到运行时间之后
                //设置圆形覆盖物的样式
                circle.setRadius(_self.radius);				//半径
                circle.setFillOpacity(_self.endOpacity);	//透明度
                circle.setStrokeOpacity(_self.endOpacity);	//透明度

                startTime = new Date().getTime() + distance;	//起始时间设置为当前时间加上1倍的时间间隔
                _self.clock[index] = window.requestAnimationFrame(animateStart.bind(null,startTime,circle,index));
            }else{
                //计算透明度
                var opacity = _self.color.fillOpacity -
                    Number.parseFloat((_self.speedOpacity * r).toFixed(5));	//四舍五入小数点后5位

                //设置圆形覆盖物的样式
                circle.setRadius(r);				//半径
                circle.setFillOpacity(opacity);		//透明度
                circle.setStrokeOpacity(opacity);	//透明度

                _self.clock[index] = window.requestAnimationFrame(animateStart.bind(null,startTime,circle,index));
            }
        }

        //循环每一层执行动画
        for (var [index,circle] of this.circles.entries()) {
            animateStart(new Date().getTime()+index*distance, circle, index);
        }
    };
    /*停止动画*/
    bmapWave.prototype.stop = function(){
        for(var caf of this.clock){
            window.cancelAnimationFrame(caf);
        }

        //重置覆盖物样式
        for(var circle of this.circles){
            circle.setRadius(0);				//半径
            circle.setFillOpacity(this.color.fillOpacity);		//透明度
            circle.getStrokeOpacity(this.color.fillOpacity);	//透明度
        }

        this.clock=null;
    };
    /*移除覆盖物.*/
    bmapWave.prototype.remove = function(){
        //停止动画
        for(var caf of this.clock){
            window.cancelAnimationFrame(caf);
        }

        map.removeOverlay(this.circle0);
        for(var circle of this.circles){
            map.removeOverlay(circle);
        }
    };
    /*地图水波扩散特效 End*/

    /* 非适量 大小固定 div+css */
    function animateCircle(point , marker){
        this._point = point;
        this._marker = marker;
    }
    animateCircle.prototype = new BMap.Overlay();
    animateCircle.prototype.initialize = function(map){
        this._map = map;
        var div = this._div = document.createElement("div");
        div.style.position = "absolute";
        var arrow = this._arrow = document.createElement("div");

        arrow.style.position = "absolute";
        arrow.style.overflow = "hidden";
        div.appendChild(arrow);
        arrow.className="css_animation";

        if(this._marker ){
            map.addOverlay(this._marker );
        }

        map.getPanes().labelPane.appendChild(div);

        return div;
    }
    animateCircle.prototype.draw = function(){
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - 30 + "px";
        this._div.style.top  = pixel.y - 30 + "px";
    }
    animateCircle.prototype.setPosition = function(point) {
        this._point = point ;
        this.draw();
        if(this._marker)
            this._marker.setPosition(this._point);

    }
    animateCircle.prototype.getPosition = function() {
        return this._point;
    }

    w.bmapWave = bmapWave
    w.animateCircle = animateCircle
})(window,undefined)

