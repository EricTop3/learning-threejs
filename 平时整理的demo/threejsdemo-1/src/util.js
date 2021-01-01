var scene, camera, renderer, stats, container, controls, floor, textureLoader;
var cameraRadius;

function scr() {
    //用来加载图片材质的
    textureLoader = new THREE.TextureLoader();
    // 场景
    scene = new THREE.Scene();

    // 相机
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    //正投影OrthographicCamera、透视投影PerspectiveCamera
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 600, 1000);
    cameraRadius = Math.sqrt(camera.position.x * camera.position.x + camera.position.z * camera.position.z);
    //注意up是1 也就是相机的上面开门在沿着y轴
    camera.up.set(0, 1, 0); //默认快门是对着Y轴正方向的，也就是（0，1，0）如果把手机颠倒，up就变成了（0，-1，0），拍出来的画面也就是上下颠倒的
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    // camera.lookAt(scene.position);

    // 渲染器
    if (Detector.webgl)
        renderer = new THREE.WebGLRenderer({antialias: true}); //antialias 含义：是否开启反锯齿，设置为true开启反锯齿。
    else
        renderer = new THREE.CanvasRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('ThreeJS');
    container.appendChild(renderer.domElement);
}

function addfloor() {
    // 地板
    // 加载图片作为地板材质
    var floorTexture = textureLoader.load('images/checkerboard.jpg');
    // 沿x方向和Y方向都重复填充
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    // x方向和y方向各重复几次，不理解的话改改这个值看看效果就知道了
    floorTexture.repeat.set(2, 2);
    // 将材质包装成表面材料，设置正反两面都要铺上
    var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    // 把对象和材料包装成Mesh
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;

    scene.add(floor);
}

function others() {
    /*--------------      配件Start      -------------*/
    // 辅助三轴线
    var axes = new THREE.AxesHelper(1000);
    scene.add(axes);
    // 地面网格线
    var gridHelper = new THREE.GridHelper(1000, 40);
    gridHelper.position = new THREE.Vector3(20, 0, 20);
    this.scene.add(gridHelper);
    // 自动适应屏幕大小改变
    THREEx.WindowResize(renderer, camera);
    // 全屏快捷键
    THREEx.FullScreen.bindKey({charCode: 'm'.charCodeAt(0)});
    // 鼠标左键旋转，滚轮缩放，右键平移
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // 监视器
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);
    /*--------------      配件End      -------------*/
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    update();
}

var angle = Math.PI * 0.5;
var step = 0.001;
var rotate = true;

function update() {
    if (rotate) {
        angle -= step;
        if (angle < 0)
            angle = Math.PI * 2 + angle;
        camera.position.x = cameraRadius * Math.cos(angle);
        camera.position.z = cameraRadius * Math.sin(angle);
    }
    controls.update();
    stats.update();
}

function woodycube(w, h, d) {
    var geom = new THREE.CubeGeometry(w || 100, h || 100, d || 100);
    var crateTexture = textureLoader.load('images/crate.gif');
    var crateMaterial = new THREE.MeshBasicMaterial({map: crateTexture});
    var crate = new THREE.Mesh(geom, crateMaterial);
    return crate;
}