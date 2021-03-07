/**
 * 3d仓库
 * @author跃焱邵隼
 * @host www.wellyyss.cn
 * @qq group 169470811
 */
function YsWarehouse(app) {
    const T = this
    T.rack = {
        width: 40,
        height: 32,
        depth: 32
    }
    T.box = {
        width: 32,
        height: 24,
        depth: 24
    }
    T.col = 10
    T.row = 8
    T.operationArea = {
        name: ''
    }
    T.app = app

    //创建地面
    T.createFloor = function (option) {
        const floor = new THREE.Mesh(new THREE.BoxBufferGeometry(option.width, option.height, 1), option.material)
        floor.rotation.x = -Math.PI / 2
        floor.name =  option.name || "地面"
        return floor
    }
    //创建普通立方体实体，用于构建墙 门 窗户
    T.createCube = function (option) {
        const cubeGeometry = new THREE.BoxGeometry(option.width, option.height, option.depth)
        const cube = new THREE.Mesh(cubeGeometry, option.material)
        cube.position.x = option.position[0]
        cube.position.y = option.position[1]
        cube.position.z = option.position[2]
        cube.rotation.y += option.angle * Math.PI //-逆时针旋转,+顺时针
        cube.name = option.name
        return cube
    }
    // 在某一个墙上挖门和窗户，并返回该墙对象
    T.createBsp = function (wall, door_window, material) {
        let BSP = new ThreeBSP(wall)
        door_window.forEach(e => {
            let less_bsp = new ThreeBSP(e)
            BSP = BSP.subtract(less_bsp)
        })
        let result = BSP.toMesh(material)
        result.name = wall.name
        result.material.flatshading = THREE.FlatShading
        result.geometry.computeFaceNormals()//重新计算几何体侧面法向量
        result.geometry.computeVertexNormals()
        result.material.needsUpdate = true //更新纹理
        result.geometry.buffersNeedUpdate = true
        result.geometry.uvsNeedUpdate = true

        return result
    }
    
    //初始化货架及货物
    T.initRackGroup = function (option) {
        T.rackMaterial = option.rackMaterial
        T.boxMaterial = option.boxMaterial
        T.rack = option.rack
        T.box = option.box
        const rackGroupAll = new THREE.Group()
        const rackGroupList = []
        option.data.forEach(area => {
            T.planeBottomColor = area.backgroundColor
            T.currentArea = area
            area.rackGroups.forEach(rackGroup => {
                const group = T.createOneRackGroup(rackGroup)
                rackGroupAll.add(group)
                rackGroupList.push(group)
            })
        })
        T.app.scene.add(rackGroupAll)
        return {
            rackGroupAll,
            rackGroupList
        }
    }
    //为货架添加标签
    T.addRackGroupLabel = function (group,position) {
        const label = T.app.createSpriteText(T.currentArea.name + '-' + group.name, {
            color: '#000',
            fontSize: 50
        })
        label.name = 'rackGroupText'
        label.userData.groupName = group.name
        label.position.set(position[0], position[1], position[2])
        return label
    }
    //添加一个货架
    T.createOneRackGroup = function (option) {
        option = option || {}
        T.col = option.rackGroup.length
        T.row = option.rackGroup[0] ? option.rackGroup[0].length : 0
        const W = T.rack.width * T.col
        const H = T.rack.height * T.row
        const operationArea = T.operationArea
        const point = [0, 0, T.rack.depth / 2]
        const rackGeo = new THREE.BoxBufferGeometry(T.rack.width, T.rack.height, T.rack.depth)
        // 单个货架信息
        const group = new THREE.Group()
        group.name = option.name || operationArea.name + '-rackGroup' + new Date().getTime() + '-' + parseInt(Math.random() * 99999)
        group.userData.isRackGroup = true
        // 添加一组空货架组
        const rack = new THREE.Mesh(rackGeo, T.rackMaterial)
        let n = 0
        for (let i = 0; i < T.col; i++) {
            for (let j = 0; j < T.row; j++) {
                n++
                const r = rack.clone()

                r.name = option.rackGroup[i][j].name || group.name + '-rack' + new Date().getTime() + '-' + n
                r.userData.rackGroupName = group.name
                r.userData.isRack = true
                r.userData.isEmpty = true
                r.position.set(i * T.rack.width, 0, point[2] + j * (T.rack.depth * 1.001))
                group.add(r)
                if (option.rackGroup[i][j].box) {

                    r.userData.isEmpty = false
                    T.addBox(r, {
                        name: option.rackGroup[i][j].box.name,
                        displayName: option.rackGroup[i][j].box.displayName,
                        picList: option.rackGroup[i][j].box.picList
                    })
                }
            }
        }

        // 添加货架标签
        group.add(T.addRackGroupLabel(group, [W / 2 - 20, 0, H + 20]))

        // 添加货架底座
        const planeBottom = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(W + 20, T.rack.depth * 4),
            new THREE.MeshBasicMaterial({ color: T.planeBottomColor, side: THREE.DoubleSide })
        )
        planeBottom.position.set((W - T.rack.width) / 2, 0, -4.1)
        planeBottom.name = 'rackGroupBottom'
        group.add(planeBottom)

        group.position.set(option.position[0],option.position[1],option.position[2])
        group.rotateX(- Math.PI / 2)
        return group
    }

    //添加一个box
    T.addBox = function (rack,option) {
        const box = new THREE.Mesh(new THREE.BoxBufferGeometry(T.box.width, T.box.height, T.box.depth), T.boxMaterial)
        box.name = option.name
        box.userData.rackGroupName = rack.userData.rackGroupName,
        box.userData.rackName = rack.name
        box.userData.displayName = option.displayName
        box.userData.picList = option.picList
        box.userData.isBox = true
        rack.add(box)
    }
}

 // export default YsWarehouse