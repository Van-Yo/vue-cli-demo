<template>
  <div class="hello" :class="crosshair?'crosshair':''">
    <div id="cesiumContainer" />
    <div id="toolbar">
      <label>
        <input id="visibilityCheckbox" type="checkbox" checked> 显示点云
      </label>
      <label>
        <el-button icon="el-icon-location" type="primary" :disabled="ifAddDroveFlag" @click="addFlyDrove(viewer)">开始选点</el-button>
      </label>
      <label>
        <el-button icon="el-icon-s-check" type="info" :disabled="!ifAddDroveFlag" @click="stopAddFlyDrove(viewer)">结束选点</el-button>
      </label>
      <label>
        <el-button icon="el-icon-delete-location" type="warning" @click="clearAirLine">清除航线</el-button>
      </label>
      <label>
        <el-button icon="el-icon-s-promotion" type="success" :disabled="!positionsList.length" @click="startFly">模拟航飞</el-button>
      </label>
      <label>
        <el-button icon="el-icon-s-help" type="danger" @click="flyToHome">回巢</el-button>
      </label>

    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      viewer: null,
      droneAnimator: null, // 飞行器
      tileset: null, // 点云
      handler: null, // 点击动作
      ifAddDroveFlag: false, // 是否正在选点
      crosshair: false, // 鼠标指针是否是十字
      timer: null,
      positionsList: [],
      positionIndex: 0,
      positions: [],
      labelCount: 1,
      /**
       * ***********************以下viewer.entities.add***********************
      */
      whitePoint: null, // 底部白点
      whitePoints: [], // 底部白点集合
      bluePoint: null, // 高处航点
      bluePoints: [], // 高处航点集合
      whiteLine: null, // 底部白点——高处航点——连接线
      whiteLines: [], // 底部白点——高处航点——连接线集合
      blueLines: [], // 航点间连接线集合
      distanceLabels: [], // 航点间连接线长度标识集合
      heightLabels: [], // 航点高度标识集合
      bluePointLabels: [], // 航点序号标识集合
      /**
       * ***********************以上viewer.entities.add***********************
      */
      tilesetPoints: [] // 点云所有点
    }
  },
  mounted() {
    this.gerData()
  },
  methods: {
    async gerData() {
      // defaultAccessToken => https://ion.cesium.com/tokens?page=1
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZWMwZTBiNi05MThiLTQwMjgtYWQ2OS1lOTU2YjVlZWY2NTkiLCJpZCI6MTI4MTM3LCJpYXQiOjE2Nzg0MzczMDF9.YdLkYKoMylbtikMWvjsCy9j11HyBYbVSIQuLXugNgUE'
      const viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: Cesium.createWorldTerrain(), // 快速创建世界地形
        infoBox: false
      })
      this.viewer = viewer
      // TDU_Key => https://console.tianditu.gov.cn/api/key
      var TDU_Key = 'fa9ccc712d703cfbcdda25fb0e164bc0'// 天地图申请的密钥

      // 在线天地图影像服务地址(墨卡托投影)
      var TDT_IMG_W = 'http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
            '&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
            '&style=default&format=tiles&tk=' + TDU_Key
      // 在线天地图矢量地图服务(墨卡托投影)
      // var TDT_VEC_W = 'http://{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
      //         '&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
      //         '&style=default&format=tiles&tk=' + TDU_Key
      // 在线天地图影像中文标记服务(墨卡托投影)
      var TDT_CIA_W = 'http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
            '&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
            '&style=default.jpg&tk=' + TDU_Key
      // 在线天地图矢量中文标记服务(墨卡托投影)
      // var TDT_CVA_W = 'http://{s}.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
      //         '&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
      //         '&style=default.jpg&tk=' + TDU_Key

      const Img = new Cesium.WebMapTileServiceImageryProvider({ // 调用影响中文服务
        url: TDT_IMG_W, // url地址
        layer: 'img_w',	// WMTS请求的层名称
        style: 'default', // WMTS请求的样式名称
        format: 'tiles', // MIME类型，用于从服务器检索图像
        tileMatrixSetID: 'GoogleMapsCompatible', //	用于WMTS请求的TileMatrixSet的标识符
        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'], // 天地图8个服务器
        minimumLevel: 0, // 最小层级
        maximumLevel: 18 // 最大层级
      })

      viewer.imageryLayers.addImageryProvider(Img)// 添加到cesium图层上

      const cia = new Cesium.WebMapTileServiceImageryProvider({ // 调用影响中文注记服务
        url: TDT_CIA_W,
        layer: 'cia_w',
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'GoogleMapsCompatible',
        subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'], // 天地图8个服务器
        minimumLevel: 0,
        maximumLevel: 18
      })

      viewer.imageryLayers.addImageryProvider(cia)// 添加到cesium图层上

      try {
        const tileset = new Cesium.Cesium3DTileset({
          url: 'http://218.94.141.150:38010/pointCloud/tileset.json' // 文件的路径
        })
        console.log({ tileset })
        var pointCloud = viewer.scene.primitives.add(tileset)
        this.pointCloud = pointCloud
        pointCloud.show = true
        // 设置点的大小
        tileset.style = new Cesium.Cesium3DTileStyle({
          pointSize: 5
        })
        await viewer.zoomTo(tileset)
        this.tileset = tileset
        // 监听模型加载完成事件
        tileset.readyPromise.then((tileset) => {
          this.tilesetPoints = []

          this.traverseAndCollectPoints(tileset._root)
          // 输出所有点的位置信息
          // console.log(this.tilesetPoints)
        }).catch(function(error) {
          console.log(error)
        })
        // Add event listener to toggle visibility of point cloud
        var visibilityCheckbox = document.getElementById('visibilityCheckbox')
        visibilityCheckbox.addEventListener('change', function() {
          pointCloud.show = visibilityCheckbox.checked
        })
      } catch (error) {
        console.log(error)
      }
      this.initPlaneViewer(viewer) // 初始化飞机
      // this.addFlyDrove(viewer) // 添加鼠标点击事件
    },
    // 点击选点
    addFlyDrove(viewer) {
      // 鼠标箭头👉十字箭头
      this.crosshair = true
      this.ifAddDroveFlag = true
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      this.handler.setInputAction((event) => {
        console.log(event.position)
        // 获取点击位置的屏幕坐标
        // screenPosition是二维坐标 It{x: 1085, y: 602}，表示从画布左上角开始计算的xy
        var screenPosition = event.position
        console.log('screenPosition', screenPosition)
        // 将屏幕坐标转换为地理坐标
        var ray = viewer.camera.getPickRay(screenPosition)
        var whitePointCartesian = viewer.scene.globe.pick(ray, viewer.scene)
        if (whitePointCartesian) {
          // whitePointCartesian:🌏et{x: -2610898.800091982, y: 4749216.922361274, z: 3351596.5848676395}
          console.log('whitePointCartesian', whitePointCartesian)
          this.whitePoint = viewer.entities.add({
            position: whitePointCartesian,
            point: {
              color: Cesium.Color.WHITE,
              pixelSize: 5
            }
          })
          this.whitePoints.push(this.whitePoint)
          var bluePointPosition = Cesium.Cartographic.fromCartesian(whitePointCartesian)
          // bluePointPosition Jr{longitude: 2.0734470141849206, latitude: 0.5568645155301508, height: 10.430285800919577}
          console.log('bluePointPosition', bluePointPosition)
          bluePointPosition.height += 20 // 100 meters above the white point
          var bluePointCartesian = Cesium.Cartographic.toCartesian(bluePointPosition)
          // bluePointCartesian 🌏et{x: -2610901.8784505245, y: 4749263.389039818, z: 3351624.1784977536}
          console.log('bluePointCartesian', bluePointCartesian)
          this.bluePoint = viewer.entities.add({
            position: bluePointCartesian,
            ellipse: {
              semiMinorAxis: 2, // adjust the size of the ellipse
              semiMajorAxis: 2,
              material: Cesium.Color.WHITE.withAlpha(1),
              height: bluePointPosition.height
            }
          })
          this.bluePoints.push(this.bluePoint)
          const res = this.GetWGS84FromDKR(bluePointCartesian)
          var bluePointLabel = viewer.entities.add({
            position: bluePointCartesian,
            label: {
              text: this.labelCount.toString(),
              fillColor: Cesium.Color.WHITE,
              font: '22px sans-serif',
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 2,
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
              pixelOffset: new Cesium.Cartesian2(0, -20)
            }
          })
          this.bluePointLabels.push(bluePointLabel)
          this.labelCount++
          this.bluePoint.label = bluePointLabel

          console.log('========================', res)
          const options = {
            aircraftLongitude: res.x,
            aircraftLatitude: res.y,
            aircraftAltitude: res.z,
            gimbalPitchValue: 0.77056379217234,
            gimbalYawValue: -90.52559171972544,
            isShoot: true
          }
          this.positionsList.push(options)
          this.whiteLine = viewer.entities.add({
            polyline: {
              positions: [whitePointCartesian, bluePointCartesian],
              width: 1,
              material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.WHITE
              })
            }
          })
          this.whiteLines.push(this.whiteLine)
          // Calculate midpoint between the clicked point and blue point
          var midPoint = Cesium.Cartesian3.midpoint(whitePointCartesian, bluePointCartesian, new Cesium.Cartesian3())
          var midPointCartographic = Cesium.Cartographic.fromCartesian(midPoint)
          // midPointCartographic Jr{longitude: 2.073444744485913, latitude: 0.5568672917156762, height: 35.7290928316593}
          console.log('midPointCartographic', midPointCartographic)

          // Add label at the midpoint with the height value
          const heightLabel = viewer.entities.add({
            // position: Cesium.Cartesian3.fromRadians(midPointCartographic.longitude, midPointCartographic.latitude, midPointCartographic.height),
            position: Cesium.Cartographic.toCartesian(midPointCartographic),
            label: {
              text: '20m',
              fillColor: Cesium.Color.WHITE,
              font: '14px sans-serif',
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 2,
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
              pixelOffset: new Cesium.Cartesian2(15, 0)
            }
          })
          this.heightLabels.push(heightLabel)
          if (this.bluePoints.length > 1) {
            // Create red line connecting the last two blue points
            var blueLine = viewer.entities.add({
              polyline: {
                positions: [this.bluePoints[this.bluePoints.length - 2].position.getValue(), this.bluePoint.position.getValue()],
                width: 3,
                material: Cesium.Color.BLUE
              }
            })
            this.blueLines.push(blueLine) // Add red line to the array
            // et{x: -2610857.690867494, y: 4749287.953297833, z: 3351571.181484913}
            // console.log(this.bluePoints[this.bluePoints.length - 2].position.getValue())
            var positions = [
              this.bluePoints[this.bluePoints.length - 2].position.getValue(),
              this.bluePoint.position.getValue()
            ]
            const intersections = []

            // 检测两点形成的射线会不会与点球相交❌❌❌❌❌❌❌❌❌
            // const ray = new Cesium.Ray(positions[0], Cesium.Cartesian3.subtract(positions[1], positions[0], new Cesium.Cartesian3()))
            // const ray = new Cesium.Ray(positions[0], Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(positions[1], positions[0], new Cesium.Cartesian3()), new Cesium.Cartesian3()))
            // 遍历模型中的每个点
            // for (var i = 0; i < this.tilesetPoints.length; i++) {
            //   var point = this.tilesetPoints[i]
            //   // console.log(point)
            //   // 检测点是否与射线相交
            //   const intersection = Cesium.IntersectionTests.raySphere(ray, new Cesium.BoundingSphere(point, 4)) // 使用点的包围球来近似检测
            //   // console.log({ intersection })
            //   if (intersection) {
            //     intersections.push(intersection)
            //     // 在这里可以执行其他操作，比如更新航线的颜色或者执行其他逻辑
            //     // line.polyline.material = Cesium.Color.GREEN
            //     // return
            //   }
            // }

            // 检测两点形成的线段会不会与点球相交🍃🍃🍃🍃🍃🍃🍃🍃🍃
            // 遍历模型中的每个点
            for (var i = 0; i < this.tilesetPoints.length; i++) {
              var point = this.tilesetPoints[i]
              // 检测点是否与线段相交
              var intersection = this.checkLineSegment2Sphere(positions[0], positions[1], point)
              if (intersection) {
                blueLine.polyline.material = Cesium.Color.RED
                intersections.push(intersection)
              }
            }
            if (intersections.length) {
              this.$message.error('航线不可用')
              console.log('点与射线相交。', '相交点是：', intersections)
            } else {
              console.log('点与射线没有相交。')
            }

            var distance = Cesium.Cartesian3.distance(this.bluePoints[this.bluePoints.length - 2].position.getValue(), this.bluePoint.position.getValue())
            var distanceInMeters = distance.toFixed(0) + 'm'
            var midPointB = Cesium.Cartesian3.midpoint(this.bluePoints[this.bluePoints.length - 2].position.getValue(), this.bluePoint.position.getValue(), new Cesium.Cartesian3())
            var midPointCartographicB = Cesium.Cartographic.fromCartesian(midPointB)

            // Add label at the midpoint with the distance value
            var distanceLabel = viewer.entities.add({
              position: Cesium.Cartesian3.fromRadians(midPointCartographicB.longitude, midPointCartographicB.latitude, midPointCartographicB.height),
              label: {
                text: distanceInMeters,
                fillColor: Cesium.Color.WHITE,
                font: '14px sans-serif',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -15)
              }
            })

            this.distanceLabels.push(distanceLabel)
          }
          // 将地理坐标转换为经度、纬度、高度
          var cartographic = Cesium.Cartographic.fromCartesian(whitePointCartesian)
          var longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6)
          var latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6)
          var height = cartographic.height.toFixed(2)

          console.log('点击位置的地理坐标：', longitude, latitude, height)
        } else {
          console.log('未能获取地理坐标。')
        }

        // // 返回一个笛卡尔坐标
        // const position = viewer.scene.pickPosition(event.position)
        // console.log(position)
        // // 如果有这个坐标
        // if (Cesium.defined(position)) {
        //   console.log(position)
        //   // 添加点击点
        //   // const pointEntity = viewer.entities.add({
        //   //   position: position,
        //   //   point: {
        //   //     color: Cesium.Color.BLUE,
        //   //     pixelSize: 20
        //   //   }
        //   // })
        //   // const res = this.GetWGS84FromDKR(position)
        //   // console.log('========================', res)
        //   // const options = {
        //   //   aircraftLongitude: res.x,
        //   //   aircraftLatitude: res.y,
        //   //   aircraftAltitude: res.z,
        //   //   gimbalPitchValue: 0.77056379217234,
        //   //   gimbalYawValue: -90.52559171972544,
        //   //   isShoot: true
        //   // }
        //   // this.droneAnimator.SetLookCone({
        //   //   destination: Cesium.Cartesian3.fromDegrees(options.aircraftLongitude, options.aircraftLatitude, options.aircraftAltitude),
        //   //   gimbalPitchValue: options.gimbalPitchValue,
        //   //   gimbalYawValue: options.gimbalYawValue
        //   // })
        //   // const timer = setInterval(() => {
        //   //   options.aircraftLongitude += 0.000001
        //   //   pointEntity.position = Cesium.Cartesian3.fromDegrees(options.aircraftLongitude, options.aircraftLatitude, options.aircraftAltitude)
        //   //   this.droneAnimator.SetLookCone({
        //   //     destination: Cesium.Cartesian3.fromDegrees(options.aircraftLongitude, options.aircraftLatitude, options.aircraftAltitude),
        //   //     gimbalPitchValue: options.gimbalPitchValue,
        //   //     gimbalYawValue: options.gimbalYawValue
        //   //   })
        //   // }, 100)
        //   // 飞行
        //   // this.positionsList.push(options)
        //   // console.log(this.positionsList)
        //   // this.droneAnimator.flyTo(options)
        //   // console.log(viewer.entities)
        // }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    clearAirLine() {
      this.bluePoints.forEach((point) => {
        this.viewer.entities.remove(point)
      })
      this.whitePoints.forEach((point) => {
        this.viewer.entities.remove(point)
      })
      this.whiteLines.forEach((line) => {
        this.viewer.entities.remove(line)
      })
      this.blueLines.forEach((line) => {
        this.viewer.entities.remove(line)
      })
      this.heightLabels.forEach((label) => {
        this.viewer.entities.remove(label)
      })
      this.distanceLabels.forEach((label) => {
        this.viewer.entities.remove(label)
      })
      this.bluePointLabels.forEach((label) => {
        this.viewer.entities.remove(label)
      })
      this.bluePoints = []
      this.whitePoints = []
      this.whiteLines = []
      this.blueLines = []
      this.heightLabels = []
      this.distanceLabels = []
      this.positionsList = []
      this.bluePointLabels = []
      this.labelCount = 1
      this.stopAddFlyDrove()
    },
    // 结束选点
    stopAddFlyDrove() {
      this.crosshair = false
      this.ifAddDroveFlag = false
      // 取消左键点击事件的监听
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    GetWGS84FromDKR(coor) {
      const cartographic = Cesium.Cartographic.fromCartesian(coor)
      console.log(cartographic)
      const x = Cesium.Math.toDegrees(cartographic.longitude)
      const y = Cesium.Math.toDegrees(cartographic.latitude)
      const z = cartographic.height
      const wgs84 = {
        x: x,
        y: y,
        z: z
      }
      return wgs84
    },
    initPlaneViewer(viewer) {
      // 实例化DroneFlightAnimator类
      const initPosition = Cesium.Cartesian3.fromDegrees(118.8, 31.9052, 28)
      this.droneAnimator = new DroneFlightAnimator({ viewer, initPosition }, (msg, positions) => {
        // this.draw()
        console.log('飞行一次结束，当前飞机位置为：' + msg)
        console.log('飞行位置集合：', positions)
        this.positions = positions
        this.positionIndex++
        // console.log(this.positionIndex)
        if (this.positionIndex < this.positionsList.length) {
          // console.log('继续飞行', this.positionsList[this.positionIndex])
          setTimeout(() => {
            this.droneAnimator.flyTo(this.positionsList[this.positionIndex])
          }, 1500)
        } else {
          this.positionIndex = 0
          this.positionsList = []
        }
      })
      // this.mockAirlineCommand()
    },
    checkLineIfOk() {
      var intersections = []
      console.log(this.positions)
      for (var i = 0; i < this.positions.length - 1; i++) {
        var start = this.positions[i]
        var end = this.positions[i + 1]

        // 创建射线
        // var ray = new Cesium.Ray(start, Cesium.Cartesian3.subtract(end, start, new Cesium.Cartesian3()).normalize())
        var direction = Cesium.Cartesian3.subtract(end, start, new Cesium.Cartesian3())
        var normalizedDirection = Cesium.Cartesian3.normalize(direction, new Cesium.Cartesian3())
        var ray = new Cesium.Ray(start, normalizedDirection)
        console.log({ ray })
        // 检查射线与点云模型的交点
        // var intersection = this.tileset.rayIntersect(ray)
        // if (intersection) {
        //   intersections.push(intersection)
        // }
      }

      // 如果有交点，航线与点云相交
      if (intersections.length > 0) {
        console.log('航线与点云相交，航线不可用')
      } else {
        console.log('航线未经过点云，航线可用')
      }
    },
    generateRandomBit() {
      // 生成随机小数
      var randomNum = Math.random()
      // 将随机小数转换为0或1
      if (randomNum < 0.5) {
        return 0
      } else {
        return 1
      }
    },
    // 模拟航线指令:一秒钟接收一次飞行命令，30秒后结束飞行，飞回机巢
    mockAirlineCommand() {
      let aircraftLongitude = 118.8
      let aircraftLatitude = 31.9052
      let aircraftAltitude = 28
      let gimbalPitchValue = -29.77056379217234
      let gimbalYawValue = -141.52559171972544
      this.timer = setInterval(() => {
        aircraftLongitude += (Math.random() * 0.0002 - 0.0001)
        aircraftLatitude += (Math.random() * 0.0002 - 0.0001)
        aircraftAltitude += (Math.random() * 3)
        gimbalPitchValue += (Math.random() * 100 - 50)
        gimbalYawValue += (Math.random() * 100 - 50)
        const options = {
          aircraftLongitude,
          aircraftLatitude,
          aircraftAltitude,
          gimbalPitchValue,
          gimbalYawValue,
          isShoot: this.generateRandomBit()
        }
        this.droneAnimator.flyTo(options)
      }, 5000)
      setTimeout(() => {
        clearInterval(this.timer)
        this.delayGoHome().then(() => {
          console.log('返航成功')
        })
      }, 59999)
    },
    delayGoHome() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.flyToHome()
          resolve(true)
        }, 1000)
      })
    },
    // 飞回机巢
    flyToHome() {
      const homeOptions = {
        aircraftLongitude: '118.8',
        aircraftLatitude: '31.9052',
        aircraftAltitude: '28'
      }
      this.droneAnimator.flyTo(homeOptions)
    },
    // 开始飞行
    startFly() {
      // this.blueLines.forEach((line) => {
      //   this.viewer.entities.remove(line)
      // })
      this.positionIndex = 0
      this.droneAnimator.flyTo(this.positionsList[0])
    },
    /**
     * 递归查询点云所有点，注意这里是根据点云文件数据个性化字段去获取🌏et坐标
     * tile : 点云_root
    */
    traverseAndCollectPoints(tile) {
      // console.log('+++++++++++++++++++++')
      var content = tile.boundingVolume
      // console.log(content)
      if (Cesium.defined(content) && Cesium.defined(content._boundingSphere)) {
        var values = content._boundingSphere.center
        this.tilesetPoints.push(values)
      }
      var children = tile.children
      if (Cesium.defined(children)) {
        for (var i = 0; i < children.length; ++i) {
          this.traverseAndCollectPoints(children[i])
        }
      }
    },
    /**
     * 检查线段与球体的交点
     * lp0, lp1 : 线段两端坐标
     * sp: 球体中心坐标
     * radius: 球体半径
    */
    checkLineSegment2Sphere(lp0, lp1, sp, radius = 4) {
      var intersection = Cesium.IntersectionTests.lineSegmentSphere(lp0, lp1, new Cesium.BoundingSphere(sp, radius))
      if (intersection) {
        // console.log('点与射线相交。', '相交点是：', intersection)
        return intersection
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.hello{
  position: relative;
  #toolbar{
    position: absolute;
    top: 10px;
    left: 10px;
    color: #fff;
    & label{
      margin: 0 5px;
    }
  }

}
.crosshair{
  cursor: crosshair;
}
</style>
