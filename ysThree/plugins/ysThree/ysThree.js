/**
 * @author跃焱邵隼
 * @host www.wellyyss.cn
 * @qq group 169470811
 * 为了方便vue等使用 我们这里换成对象写法、
 */
// import * as THREE from "three"
function YsThree(el, options) {
    options = options || {}
    const t = this
    const width = el.offsetWidth
    const height = el.offsetHeight
    const asp = width / height

    // scene
    const scene = new THREE.Scene()

    // camera
    let camera
    if (options.camera) {
        camera = options.camera
    } else {
        camera = new THREE.PerspectiveCamera(45, asp, 1, 10000)
        window.addEventListener('resize', function() {
            camera.aspect = el.offsetWidth / el.offsetHeight
            renderer.setSize(el.offsetWidth, el.offsetHeight) // 重新获取
            camera.updateProjectionMatrix()
            renderer.render(scene, camera)
        }, false)
    }
    camera.position.set(30, 30, 30)

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    el.append(renderer.domElement)
    renderer.setClearColor(options.clearColor || '#000')

    // 辅助
    if (options.axes) scene.add(new THREE.AxesHelper(10))// 坐标轴辅助红x 绿y 蓝z
    if (options.gridHelper) scene.add(new THREE.GridHelper(100, 100))// 网格参考线

    // to the instance
    t.renderer = renderer
    t.scene = scene
    t.camera = camera
    t.el = el
}
/**
 * 地理坐标转2d平面
 * @param radius
 * @param lng
 * @param lat
 * @returns {{x: number, y: number}}
 */
YsThree.prototype.geographicToPlaneCoords = (radius, lng, lat) => {
    return { x: (lat / 180) * radius, y: (lng / 180) * radius }
}

/**
 * 判断是否是手机端
 * @returns {boolean}
 */
YsThree.prototype.isMobile = (navigator.userAgent.toLowerCase().match(/(ipod|ipad|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null)

/**
 * 计算三角形面积
 * @param v1
 * @param v2
 * @param v3
 * @returns {number}
 */
YsThree.prototype.getTriangleArea = (v1, v2, v3) => new THREE.Vector3().crossVectors(v1.clone().sub(v2), v1.clone().sub(v3)).length() / 2

/**
 * 随机颜色
 *@returns {string}
 */
YsThree.prototype.randomColor = () => `rgb(${parseInt(Math.random() * 256)},${parseInt(Math.random() * 256)},${parseInt(Math.random() * 256)})`

/**
 * 地理坐标转三维坐标
 * @param radius
 * @param lng
 * @param lat
 * @returns {*}
 */
YsThree.prototype.geographicToVector = (radius, lng, lat) => new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, (90 - lat) * (Math.PI / 180), (90 + lng) * (Math.PI / 180)))

/**
 * @param radius
 * @param lng
 * @param lat
 * @param height
 * @returns {{x: number, y: *, z: number}}
 */
YsThree.prototype.geographicToVectorPosition = function(radius, lng, lat, height) {
    const phi = (180 + lng) * (Math.PI / 180)
    const theta = (90 - lat) * (Math.PI / 180)
    return {
        x: -radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.cos(theta) + (height || 0),
        z: radius * Math.sin(theta) * Math.sin(phi)
    }
}

/**
 * 计算网格对象体积
 * @param mesh
 * @returns {number}
 */
YsThree.prototype.getMeshVolume = function(mesh) {
    let geometry = mesh.geometry.clone()
    if (geometry.isBufferGeometry) geometry = new THREE.Geometry().fromBufferGeometry(geometry)
    let V = 0
    geometry.faces.forEach(e => {
        V += geometry.vertices[e.a].clone().cross(geometry.vertices[e.b]).dot(geometry.vertices[e.c]) / 6
    })
    return V
}

/**
 * 获取球体上的两点之间的制高点，用于绘制三维三次贝塞尔曲线
 * @param v0 起点
 * @param v3 终点
 * @param n1 调控角度
 * @param n2 调控角度
 * @param p0 参考点 默认原点
 * @returns {[*, *]}
 */
YsThree.prototype.getSphereHeightPoints = function(v0, v3, n1, n2, p0) {
    // 夹角
    const angle = (v0.angleTo(v3) * 180) / Math.PI / 10 // 0 ~ Math.PI
    const aLen = angle * (n1 || 10)
    const hLen = angle * angle * (n2 || 120)
    p0 = p0 || new THREE.Vector3(0, 0, 0) // 默认以 坐标原点为参考对象

    // 法线向量
    const rayLine = new THREE.Ray(p0, v0.clone().add(v3.clone()).divideScalar(2))

    // 顶点坐标
    const vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0))

    // 计算制高点
    const getLenVector = (v1, v2, len) => v1.lerp(v2, len / v1.distanceTo(v2))

    // 控制点坐标
    return [getLenVector(v0.clone(), vtop, aLen), getLenVector(v3.clone(), vtop, aLen)]
}

/**
 * 三维坐标转屏幕坐标
 * @param vectorOrObject
 * @returns {{x: number, y: number}}
 */
YsThree.prototype.vectorToScreen = function(vectorOrObject) {
    let o
    if (vectorOrObject instanceof THREE.Vector3) { o = vectorOrObject } else if (vectorOrObject instanceof THREE.Object3D) { o = new THREE.Vector3(vectorOrObject.position.x, vectorOrObject.position.y, vectorOrObject.position.z) } else { console.error('the arguments is a object of Vector3 or Object3D ') }
    const standardVector = o.project(this.camera); const // 世界坐标转标准设备坐标
        a = this.renderer.getSize(new THREE.Vector2()).width / 2
    const b = this.renderer.getSize(new THREE.Vector2()).height / 2
    const x = Math.round(standardVector.x * a + a); const // 标准设备坐标转屏幕坐标
        y = Math.round(-standardVector.y * b + b)// 标准设备坐标转屏幕坐标
    return { x, y }
}

/**
 * 旋转 也可以使用 对象的.rotateX替代
 * @param object 需要旋转的对象
 * @param axis 旋转轴，是一个向量，new THREE.Vector3(1,0,0)表示绕x轴顺时针旋转
 * @param radians 旋转的角度
 */
YsThree.prototype.rotateWorldAxis = function(object, axis, radians) {
    const rm = new THREE.Matrix4()
    rm.makeRotationAxis(axis.normalize(), radians)
    rm.multiply(object.matrix)
    object.matrix = rm
    object.rotation.setFromRotationMatrix(object.matrix)
}

/**
 * @param el
 * @param event
 * @param parent
 * @param recursive
 * @returns {*}
 */

// 获取与射线相交的对象数组
YsThree.prototype.getIntersectObject = function(el, event, parent, recursive) {
    event.preventDefault()
    const mouse = new THREE.Vector2()
    const raycaster = new THREE.Raycaster()
    let objectList = []
    try {
        mouse.x = (((event.clientX || event.touches[0].pageX) - el.getBoundingClientRect().left) / el.offsetWidth) * 2 - 1
        mouse.y = -(((event.clientY || event.touches[0].pageY) - el.getBoundingClientRect().top) / el.offsetHeight) * 2 + 1
        raycaster.setFromCamera(mouse, this.camera)
        // intersectObjects(object,recursive)object — 用来检测和射线相交的物体。recursive — 如果为true，它还检查所有后代。否则只检查该对象本身。缺省值为false。
        objectList = raycaster.intersectObjects((parent || this.scene).children, recursive)
    }
    catch (e) {
        // 鼠标越界
    }
    return {
        raycaster: raycaster,
        objectList: objectList
    }
}

/**
 *
 * @param text
 * @param options (fontSize,backgroundColor,color)
 * @returns {*}
 */
YsThree.prototype.createSpriteText = function(text, options) {
    if (!options) options = {}
    options.fontSize = options.fontSize || 12
    const average = this.el.offsetWidth > this.el.offsetHeight ? this.el.offsetHeight / 180 : this.el.offsetWidth / 360
    const canvas = document.createElement('canvas')
    canvas.width = text.length * (options.fontSize || 18) * average
    canvas.height = options.fontSize * average
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = options.backgroundColor || 'transparent'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = canvas.height + "px '微软雅黑'"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = options.color
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 * 1.15)
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }))
    sprite.scale.set(options.fontSize / average * text.length, options.fontSize / average, 1)
    return sprite
}

/**
 * @param TWEEN
 * @param controls
 * @param option
 * @returns {string|*}
 */
YsThree.prototype.flyTo = function(TWEEN, controls, option) {
    option.position = option.position || [] // 相机新的位置
    option.controls = option.controls || [] // 控制器新的中心点位置(围绕词典旋转等)
    option.duration = option.duration || 1000 // 飞行时间
    option.easing = option.easing || TWEEN.Easing.Linear.None
    TWEEN.removeAll()
    const curPosition = this.camera.position
    const controlsTar = controls.target
    const tween = new TWEEN.Tween({
        x1: curPosition.x, // 相机当前位置x
        y1: curPosition.y, // 相机当前位置y
        z1: curPosition.z, // 相机当前位置z
        x2: controlsTar.x, // 控制当前的中心点x
        y2: controlsTar.y, // 控制当前的中心点y
        z2: controlsTar.z // 控制当前的中心点z
    }).to({
        x1: option.position[0], // 新的相机位置x
        y1: option.position[1], // 新的相机位置y
        z1: option.position[2], // 新的相机位置z
        x2: option.controls[0], // 新的控制中心点位置x
        y2: option.controls[1], // 新的控制中心点位置x
        z2: option.controls[2] // 新的控制中心点位置x
    }, option.duration).easing(TWEEN.Easing.Linear.None) // TWEEN.Easing.Cubic.InOut //匀速
    tween.onUpdate(() => {
        controls.enabled = false
        this.camera.position.set(tween._object.x1, tween._object.y1, tween._object.z1)
        controls.target.set(tween._object.x2, tween._object.y2, tween._object.z2)
        controls.update()
        if (option.update instanceof Function) { option.update(tween) }
    })
    tween.onStart(() => {
        controls.enabled = false
        if (option.start instanceof Function) { option.start() }
    })
    tween.onComplete(() => {
        controls.enabled = true
        if (option.done instanceof Function) { option.done() }
    })
    tween.onStop(() => option.stop instanceof Function ? option.stop() : '')
    tween.start()
    TWEEN.add(tween)
    return tween
}

/**
 * 计算网格对象的面积
 * @param mesh
 * @returns {number}
 */
YsThree.prototype.getMeshArea = function(mesh) {
    let area = 0
    let geometry = mesh.geometry.clone()
    if (geometry.isBufferGeometry) geometry = new THREE.Geometry().fromBufferGeometry(geometry)
    geometry.faces.forEach(e => {
        area += this.getTriangleArea(
            geometry.vertices[e.a],
            geometry.vertices[e.b],
            geometry.vertices[e.c])
    })
    return area
}

/**
 * 初始化Status
 * @returns {{REVISION: number, domElement: HTMLDivElement, setMode: setMode, update: update, end: (function(): number), begin: begin}}
 */
YsThree.prototype.initStatus = function(Stat) {
    const stats = Stat ? new Stat() : new Stats()
    stats.setMode(0) // 0: fps, 1: ms
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0px'
    stats.domElement.style.top = '0px'
    document.body.appendChild(stats.domElement)

    this.staus = stats
    return stats
}

/**
 * 初始化OrbitControls控制器
 * @param OrbitControls
 * @returns {THREE.OrbitControls}
 */
YsThree.prototype.initOrbitControls = function(OrbitControls, dom) {
    const controls = OrbitControls ? new OrbitControls(this.camera, dom || this.renderer.domElement) : new THREE.OrbitControls(this.camera, dom || this.renderer.domElement)
    // 如果使用animate方法时，将此函数删除
    // controls.addEventListener( 'change', render );
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    controls.enableDamping = true
    // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
    // controls.dampingFactor = 0.25;
    // 是否可以缩放
    controls.enableZoom = true
    // 是否自动旋转
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.3
    // 设置相机距离原点的最远距离
    controls.minDistance = 1
    // 设置相机距离原点的最远距离
    // controls.maxDistance = 1000;
    // 是否开启右键拖拽
    controls.enablePan = true
    this.controls = controls

    return controls
}
/**
 * @param sceneA
 * @param sceneB
 * @param transitionParams
 * @constructor
 */
YsThree.prototype.SceneTransition = function(sceneA, sceneB, transitionParams) {
    const T = this

    //
    T.scene = new THREE.Scene()
    T.camera = new THREE.OrthographicCamera(el.offsetWidth / -2, el.offsetWidth / 2, el.offsetHeight / 2, el.offsetHeight / -2, -10, 10)

    //
    T.quadmaterial = new THREE.ShaderMaterial({
        uniforms: {
            tDiffuse1: {
                value: null
            },
            tDiffuse2: {
                value: null
            },
            mixRatio: {
                value: 0.0
            },
            threshold: {
                value: 0.1
            },
            useTexture: {
                value: true
            },
            tMixTexture: {
                value: transitionParams.texture
            }
        },
        vertexShader: [

            'varying vec2 vUv;',

            'void main() {',

            'vUv = vec2( uv.x, uv.y );',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

            '}'

        ].join('\n'),
        fragmentShader: [

            'uniform float mixRatio;',

            'uniform sampler2D tDiffuse1;',
            'uniform sampler2D tDiffuse2;',
            'uniform sampler2D tMixTexture;',

            'uniform bool useTexture;',
            'uniform float threshold;',

            'varying vec2 vUv;',

            'void main() {',

            '	vec4 texel1 = texture2D( tDiffuse1, vUv );',
            '	vec4 texel2 = texture2D( tDiffuse2, vUv );',

            '	if (useTexture==true) {',

            '		vec4 transitionTexel = texture2D( tMixTexture, vUv );',
            '		float r = mixRatio * (1.0 + threshold * 2.0) - threshold;',
            '		float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);',

            '		gl_FragColor = mix( texel1, texel2, mixf );',

            '	} else {',

            '		gl_FragColor = mix( texel2, texel1, mixRatio );',

            '	}',

            '}'

        ].join('\n')
    })
    const quadgeometry = new THREE.PlaneBufferGeometry(el.offsetWidth, el.offsetHeight)

    // 类似一种蒙层提供过度效果
    T.quad = new THREE.Mesh(quadgeometry, T.quadmaterial)
    T.scene.add(T.quad)

    T.update = function(sceneA, sceneB, animate) {
        T.sceneA = sceneA
        T.sceneB = sceneB
        T.quadmaterial.uniforms.tDiffuse1.value = T.sceneB.fbo.texture
        T.quadmaterial.uniforms.tDiffuse2.value = T.sceneA.fbo.texture
        T.quadmaterial.uniforms.mixRatio.value = 0.0
        T.quadmaterial.uniforms.threshold.value = 0.1
        T.quadmaterial.uniforms.useTexture.value = transitionParams.useTexture
        T.quadmaterial.uniforms.tMixTexture.value = transitionParams.texture

        transitionParams.animate = animate
        transitionParams.transition = 0
    }
    T.update(sceneA, sceneB, transitionParams.animate)
    T.needChange = false

    T.render = function(delta) {
        if (transitionParams.transition === 0) {
            T.sceneA.render(delta, false)
        } else if (transitionParams.transition >= 1) {
            T.sceneB.render(delta, false)
            transitionParams.animate = false // 停止
        } else {
            T.sceneA.render(delta, true)
            T.sceneB.render(delta, true)
            renderer.setRenderTarget(null)
            renderer.clear()
            renderer.render(this.scene, this.camera)
        }

        if (transitionParams.animate && transitionParams.transition <= 1) {
            transitionParams.transition = transitionParams.transition + transitionParams.transitionSpeed
            T.needChange = true
            T.quadmaterial.uniforms.mixRatio.value = transitionParams.transition
        }
    }
}
/**
 * 创建 动态的线 包括 球面--meshLine，  球面--管道线， 曲线--meshLine， 曲线--管道线
 * @param option
 * @returns {THREE.Mesh}
 */
YsThree.prototype.createAnimateLine = function(option) {
    let curve
    if (option.kind === 'sphere') { // 由两点之间连线成贝塞尔曲线
        const sphereHeightPointsArgs = option.sphereHeightPointsArgs
        const pointList = this.getSphereHeightPoints(...sphereHeightPointsArgs) // v0,v3,n1,n2,p0
        curve = new THREE.CubicBezierCurve3(sphereHeightPointsArgs[0], pointList[0], pointList[1], sphereHeightPointsArgs[1])
    } else { // 由多个点数组构成的曲线 通常用于道路
        const l = []
        option.pointList.forEach(e => l.push(new THREE.Vector3(e[0], e[1], e[2])))
        curve = new THREE.CatmullRomCurve3(l) // 曲线路径
    }
    if (option.type === 'pipe') { // 使用管道线
        // 管道体
        const tubeGeometry = new THREE.TubeGeometry(curve, option.number || 50, option.radius || 1, option.radialSegments)
        return new THREE.Mesh(tubeGeometry, option.material)
    } else { // 使用 meshLine
        if (!MeshLine || !MeshLineMaterial) console.error('you need import MeshLine & MeshLineMaterial!')
        else {
            const geo = new THREE.Geometry()
            geo.vertices = curve.getPoints(option.number || 50)
            const meshLine = new MeshLine()
            meshLine.setGeometry(geo)
            return new THREE.Mesh(meshLine.geometry, option.material)
        }
    }
}

/**
 * 添加 css2d / css3d renderer
 * @param app
 * @param cssRender
 */
YsThree.prototype.addCssRender = function (app, cssRender) {
    const T = this
    T.config = {}
    T.app = app
    T.el = app.el
    T.init = function () {
        const cssRenderer = new cssRender()
        cssRenderer.setSize( T.el.offsetWidth, T.el.offsetHeight )
        cssRenderer.domElement.style.position = 'absolute'
        cssRenderer.domElement.style.top = 0
        cssRenderer.domElement.style.pointerEvents = "none"
        el.appendChild(cssRenderer.domElement)
        T.cssRenderer = cssRenderer
        T.cssRendererDomElement = cssRenderer.domElement
    }
    T.add = function (option) {
        let list  = []
        if( Array.isArray(option))
            list = option
        else
            list.push(option)
        list.forEach(e => {
            document.body.insertAdjacentHTML('beforeend', e.element)
            const label = new e.cssObject( document.body.lastChild )
            label.position.set(e.position[0], e.position[1], e.position[2])
            label.name = e.name
            if(e.scale) label.scale.set(e.scale[0], e.scale[1], e.scale[2])
            e.parent ? e.parent.add(label) : T.app.scene.add(label)
            T.config[e.name] = label
        })
    }
    T.update = function (name, innerHtml) {
        T.config[name].element.innerHTML = innerHtml
    }
    T.remove = function (name, parent) {
        parent = parent || T.app.scene
        parent.remove(parent.getObjectByName(name))
        // T.config[name].element.remove()
        if(T.config[name]) delete T.config[name]

    }
    T.search = function (name) {
        return  T.config[name]
    }

    T.init()
}

/**
 * 绘制点线面等
 * @param app
 * @constructor
 */
YsThree.prototype.Draw = function(app) {
    const T = this
    //配置项
    T.config = {
        enabled: true,
        drawPoint: false,
        drawLine: false,
        drawLineStraight: false,
        drawType: undefined, // point , line, lineStraight
        isDrawing: false,
        lineMaterial:  new THREE.LineBasicMaterial( { color:'red'}),
        lineStraightMaterial:  new THREE.LineBasicMaterial( { color:'red'}),
        fixPointPosition: {
            x : undefined,
            y : undefined,
            z : undefined,
        },
        fixLinePosition: {
            x : undefined,
            y : undefined,
            z : undefined,
        },
        fixLineStraightPosition: {
            x : undefined,
            y : undefined,
            z : undefined,
        },
        fixPolygonPosition: {
            x : undefined,
            y : undefined,
            z : undefined,
        },
        start: undefined,
        moving: undefined,
        stop: undefined

    }
    T.app = app

    // points
    T.pointsGeometry = new THREE.BufferGeometry()
    T.pointsVertices = []
    T.points = new THREE.Points(T.pointsGeometry, new THREE.PointsMaterial({
        color: 'red',
        size: 1
    }))
    app.scene.add( T.points )

    // line
    T.lines = new THREE.Group()
    T.newLine  = null
    T.linePoints = []

    app.scene.add(T.lines)

    // drawLineStraight
    T.lineStraightsGroup = new THREE.Group()
    T.newLineStraight  = null
    T.lineStraightPoints = []

    scene.add(T.lineStraightsGroup)

    //Polygon
    T.polygonPoints = []
    T.polygonGroup = new THREE.Group()
    scene.add(T.polygonGroup)


    // event.button 0: LEFT,1:MIDDLE ,2: RIGHT

    document.oncontextmenu = function () {
        return false
    }
    //开始
    document.addEventListener('mousedown',function (e) {
        e.preventDefault()
        if(!T.config.enabled) return
        if(e.button === 2 && T.config.drawType === 'lineStraight') {
            // 取消绘制线得单次绘制
            T.lineStraightPoints =  []
            return
        }
        if(e.button === 2 && T.config.drawType === 'polygon') {
            const geometry = new THREE.Geometry()
            /*
            * 分析： 加入 5个点 [0,1,2,3,4]
            * 0,1,2
            * 0,2,3
            * 0,3,4
            * */
            geometry.vertices.push(...T.polygonPoints)
            T.polygonPoints.forEach((e, i) => {
                if(i >=  T.polygonPoints.length - 2 ) return
                geometry.faces.push(new THREE.Face3( 0, i+1, i+2 ))
            })
            geometry.computeFaceNormals()

            const material = new THREE.MeshBasicMaterial( {color: 'red',side: THREE.DoubleSide} );
            const mesh = new THREE.Mesh( geometry, material );
            T.polygonGroup.add( mesh )
            T.polygonPoints = []
            return
        }


        if(e.button !==0) return
        app.controls.enabled = false

        const objList =  app.getIntersectObject(app.el, e, scene,  true).objectList
        if(objList &&　objList.length > 0) {
            const point = objList[0].point

            switch ( T.config.drawType ) {
                case 'point': {
                    T.pointsVertices.push(T.config.fixPointPosition.x ||  point.x, T.config.fixPointPosition.y || point.y,  T.config.fixPointPosition.z || point.z)
                    T.pointsGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( T.pointsVertices, 3 ))
                    break
                }
                case 'line': {
                    T.config.isDrawing = true
                    const geometry = new THREE.BufferGeometry()//创建一个几何
                    T.newLine =  new THREE.Line( geometry, T.config.lineMaterial)
                    T.lines.add(T.newLine)
                    break
                }
                case 'lineStraight': {
                    T.config.isDrawing = true
                    const geometry = new THREE.BufferGeometry();//创建一个几何
                    T.newLineStraight =  new THREE.Line( geometry, T.config.lineStraightMaterial)
                    T.lineStraightPoints.push(new THREE.Vector3(T.config.fixLineStraightPosition.x ||  point.x, T.config.fixLineStraightPosition.y || point.y,  T.config.fixLineStraightPosition.z || point.z))
                    T.lineStraightsGroup.add(T.newLineStraight)
                    break
                }

                case 'polygon': {
                    //画点
                    T.pointsVertices.push(T.config.fixPolygonPosition.x ||  point.x, T.config.fixPolygonPosition.y || point.y,  T.config.fixPolygonPosition.z || point.z)
                    T.pointsGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( T.pointsVertices, 3 ))

                    //取点画面
                    T.polygonPoints.push(new THREE.Vector3(T.config.fixPolygonPosition.x ||  point.x, T.config.fixPolygonPosition.y || point.y,  T.config.fixPolygonPosition.z || point.z))
                }
            }

            if(T.config.start) T.config.start(point)
        }

    }, false)

    //移动中
    document.addEventListener('mousemove',function (e) {
        e.preventDefault()
        if(!T.config.enabled) return
        if(e.button!== 0 ) return  //指定左击 生效
        app.controls.enabled = false
        const objList =  app.getIntersectObject(app.el, e, scene,  true).objectList
        if(objList &&　objList.length > 0) {
            const point = objList[0].point
            switch ( T.config.drawType ) {
                case 'line': {
                    if( T.config.isDrawing ) {
                        T.linePoints.push(new THREE.Vector3(T.config.fixLinePosition.x ||  point.x, T.config.fixLinePosition.y || point.y,  T.config.fixLinePosition.z || point.z))
                        T.newLine.geometry.setFromPoints( T.linePoints)
                    }
                    break
                }
                case 'lineStraight': {
                    if(T.config.isDrawing ) {
                        T.lineStraightPoints[1] = new THREE.Vector3(T.config.fixLineStraightPosition.x ||  point.x, T.config.fixLineStraightPosition.y || point.y,  T.config.fixLineStraightPosition.z || point.z)
                        T.newLineStraight.geometry.setFromPoints( T.lineStraightPoints)
                    }
                    break
                }
            }

            if(T.config.moving && T.config.isDrawing ) T.config.moving(point)
        }
    }, false)

    //结束
    document.addEventListener('mouseup',function (e) {
        if(!T.config.enabled) return
        if(e.button !== 0 ) return  //指定左击 生效
        app.controls.enabled = true
        T.config.isDrawing = false
        switch ( T.config.drawType ) {
            case 'line': {
                T.linePoints = []
                break
            }
            case 'lineStraight': {
                const objList =  app.getIntersectObject(app.el, e, scene,  true).objectList
                if(objList &&　objList.length > 0) {
                    const point = objList[0].point
                    T.lineStraightPoints[1] = new THREE.Vector3(T.config.fixLineStraightPosition.x ||  point.x, T.config.fixLineStraightPosition.y || point.y,  T.config.fixLineStraightPosition.z || point.z)
                    T.newLineStraight.geometry.setFromPoints( T.lineStraightPoints)
                }

                if(T.lineStraightPoints[1]) T.lineStraightPoints = [T.lineStraightPoints[1]]
                else T.lineStraightPoints =  []
                break
            }
        }

        if(T.config.stop) T.config.stop()
    }, false)
}

/**
 * 销毁
 * @param frameId
 */
YsThree.prototype.destroy = function(frameId) {
    if(frameId) cancelAnimationFrame(frameId) //销毁requestAnimationFrame
    this.renderer.forceContextLoss() //销毁context
    this.renderer = null
    this.scene = null
    this.camera = null
}

window.YsThree = YsThree
// export default YsThree
