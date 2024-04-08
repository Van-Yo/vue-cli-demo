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
      <label>
        <el-button
          icon="el-icon-s-flag"
          @click="showLine1"
        >航线1</el-button>
      </label>
      <label>
        <el-button icon="el-icon-location" type="primary" @click="pointChangeTest(viewer)">拖动测试</el-button>
      </label>
      <label>
        <el-button icon="el-icon-location" type="primary" @click="click3DTile(viewer)">点云选点</el-button>
      </label>
      <label>
        <el-upload
          ref="upload"
          class="upload-demo"
          action=""
          :on-change="handleChange"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      fileList: [],
      file: null,
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

      airLinePoints: [
        {
          id: 1,
          longitude: '118.79847335890334',
          latitude: '31.906234172584504',
          altitude: '35.173572298490505'
        },
        {
          id: 2,
          longitude: '118.79862984870327',
          latitude: '31.905920322554895',
          altitude: '22.85652170014094'
        },
        {
          id: 3,
          longitude: '118.79882328940535',
          latitude: '31.905917874367255',
          altitude: '34.06554035058578'
        },
        {
          id: 4,
          longitude: '118.7990230015162',
          latitude: '31.906040088379424',
          altitude: '33.184153203647675'
        },
        {
          id: 5,
          longitude: '118.79901862974226',
          latitude: '31.905701030775294',
          altitude: '33.380702873519624'
        },
        {
          id: 6,
          longitude: '118.79908151177149',
          latitude: '31.90556304627632',
          altitude: '33.194034895724926'
        },
        {
          id: 7,
          longitude: '118.79927766998584',
          latitude: '31.905211828549106',
          altitude: '33.05613654942687'
        },
        {
          id: 8,
          longitude: '118.79875231160784',
          latitude: '31.905188952206974',
          altitude: '34.48000785431169'
        },
        {
          id: 9,
          longitude: '118.79849167407063',
          latitude: '31.905470917640642',
          altitude: '35.41060895689843'
        },
        {
          id: 10,
          longitude: '118.79840653086771',
          latitude: '31.90595033374985',
          altitude: '35.71446849499091'
        }
      ],
      startMousePosition: {
        x: null,
        y: null
      },
      testDrove: []
    }
  },
  mounted() {
    this.gerData()
  },
  methods: {
    handleChange(file, fileList) {
      this.file = file.raw
      console.log(this.file)
      var kmlData = this.viewer.dataSources.add(Cesium.KmlDataSource.load(
        this.file,
        {
          camera: this.viewer.scene.camera,
          canvas: this.viewer.scene.canvas
        })
      )
      kmlData.then(this.viewer.zoomTo(kmlData))
    },
    async gerData() {
      // defaultAccessToken => https://ion.cesium.com/tokens?page=1
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZWMwZTBiNi05MThiLTQwMjgtYWQ2OS1lOTU2YjVlZWY2NTkiLCJpZCI6MTI4MTM3LCJpYXQiOjE2Nzg0MzczMDF9.YdLkYKoMylbtikMWvjsCy9j11HyBYbVSIQuLXugNgUE'
      const viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: Cesium.createWorldTerrain(), // 快速创建世界地形
        infoBox: false
      })
      this.viewer = viewer
      // 拖动鼠标左键旋转viewer
      // viewer.scene.screenSpaceCameraController.enableRotate = false
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
      // var TDT_CIA_W = 'http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0' +
      //       '&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
      //       '&style=default.jpg&tk=' + TDU_Key
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

      // const cia = new Cesium.WebMapTileServiceImageryProvider({ // 调用影响中文注记服务
      //   url: TDT_CIA_W,
      //   layer: 'cia_w',
      //   style: 'default',
      //   format: 'tiles',
      //   tileMatrixSetID: 'GoogleMapsCompatible',
      //   subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'], // 天地图8个服务器
      //   minimumLevel: 0,
      //   maximumLevel: 18
      // })

      // viewer.imageryLayers.addImageryProvider(cia)// 添加到cesium图层上

      // 加载3DTileset
      try {
        const tileset = new Cesium.Cesium3DTileset({
          // url: '/cesiumTileset/tileset.json' // 文件的路径
          url: 'http://218.94.141.150:38010/pointCloud/tileset.json' // 点云
          // url: 'http://openlayers.vip/cesium/3dtile/xianggang_detail/tileset.json' // 倾斜摄影
        })
        // console.log({ tileset })
        var pointCloud = viewer.scene.primitives.add(tileset)
        this.pointCloud = pointCloud
        pointCloud.show = true
        // 设置点的大小（点云点设置）
        // tileset.style = new Cesium.Cesium3DTileStyle({
        //   pointSize: 5
        // })
        await viewer.zoomTo(tileset)
        this.tileset = tileset
        // 监听模型加载完成事件
        tileset.readyPromise.then((tileset) => {
          // 获取点云所有点的坐标
          // this.tilesetPoints = []
          // this.traverseAndCollectPoints(tileset._root)
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
    },
    showIntersection(result, destPoint, viewPoint) {
      // 如果是场景模型的交互点，排除交互点是地球表面
      if (Cesium.defined(result) && Cesium.defined(result.object)) {
        console.log(result, destPoint, viewPoint)
        // // 可视区域
        // this.drawWhiteLine(result.position, viewPoint, 3, Cesium.Color.RED, false)
        // 不可视区域
        this.drawWhiteLine(viewPoint, destPoint, 3, Cesium.Color.RED, false)
      } else {
        this.drawWhiteLine(viewPoint, destPoint, 3, Cesium.Color.GREEN, false)
      }
    },
    pointChangeTest(viewer) {
      this.$notify.info({
        title: '操作',
        message: '请先点击开始选点，选完点后点击结束选点，然后拖动航点',
        duration: 0
      })
      this.leftDownFlag = false // 鼠标左键是否按下
      this.pickedEntity = null // 被选中的Entity
      viewer.screenSpaceEventHandler.setInputAction((e) => {
        this.leftDownAction(e, viewer)
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

      viewer.screenSpaceEventHandler.setInputAction((e) => {
        this.mouseMoveAction(e, viewer)
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      viewer.screenSpaceEventHandler.setInputAction((e) => {
        this.leftUpAction(e, viewer)
      }, Cesium.ScreenSpaceEventType.LEFT_UP)
    },
    // 拖拽模型-左键按下
    leftDownAction(e, viewer) {
      this.leftDownFlag = true
      const picked = viewer.scene.pick(e.position)
      if (picked) {
        // console.log(picked)
        document.body.style.cursor = 'move'
        this.pickedEntity = Cesium.defaultValue(picked.id, picked.primitive.id)
        // console.log(this.pickedEntity, '0000000000000000')
        // console.log(this.bluePoints[0].position.getValue())
        this.startMousePosition.x = e.position.x
        this.startMousePosition.y = e.position.y
        // if (this.pickedEntity instanceof Cesium.Entity && this.pickedEntity.model) {
        //   console.log(111111111111)
        //   // 锁定相机
        //   viewer.scene.screenSpaceCameraController.enableRotate = false
        // }
        viewer.scene.screenSpaceCameraController.enableRotate = false
      }
    },
    // 拖拽模型-鼠标移动
    mouseMoveAction(e, viewer) {
      if (this.leftDownFlag && this.pickedEntity) {
        var scene = viewer.scene
        // 鼠标移动在二维上的偏差
        var deltaX = e.endPosition.x - this.startMousePosition.x
        var deltaY = e.endPosition.y - this.startMousePosition.y
        // 第一个点（底部白点）在二维上的坐标
        var canvasPosition = new Cesium.Cartesian2()
        var canvasCoordinates = scene.cartesianToCanvasCoordinates(this.whitePoints[0].position.getValue(), canvasPosition)
        // 给第一个点（底部白点）的二维坐标加上鼠标移动的偏差
        const whitePointNewX = canvasCoordinates.x + deltaX
        const whitePointNewY = canvasCoordinates.y + deltaY
        // 通过相机射更新后的第一个点（底部白点）的二维坐标，生成更新的三维坐标（地面）
        const ray = viewer.camera.getPickRay({ x: whitePointNewX, y: whitePointNewY })
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
        this.whitePoints[0].position = cartesian
        // 更新鼠标位置
        this.startMousePosition.x = e.endPosition.x
        this.startMousePosition.y = e.endPosition.y
        // 更新其他entity位置
        const res = this.GetWGS84FromDKR(this.bluePoints[0].position.getValue())
        // console.log({ res })
        var bluePointPosition = Cesium.Cartographic.fromCartesian(cartesian)
        bluePointPosition.height = res.z
        var bluePointCartesian = Cesium.Cartographic.toCartesian(bluePointPosition)
        // console.log(this.bluePoints[0].position.getValue())
        // var bluePointCartesian = {
        //   x: cartesian.x,
        //   y: cartesian.y,
        //   z: this.bluePoints[0].position.getValue().z
        // }
        // 第一个点（空中蓝点）
        this.bluePoints[0].position = bluePointCartesian
        // 蓝点文字
        this.bluePointLabels[0].position = bluePointCartesian
        // 垂直线
        this.whiteLines[0].polyline.positions = new Cesium.CallbackProperty(function(time, result) {
          return [cartesian, bluePointCartesian]
        }, false)
        // 高度标识
        var midPoint = this.computeMidPointCartesian(cartesian, bluePointCartesian)
        this.heightLabels[0].position = midPoint
        // 第一条航线
        const nextPointCartesian = this.bluePoints[1].position.getValue()
        this.blueLines[0].polyline.positions = new Cesium.CallbackProperty(function(time, result) {
          return [bluePointCartesian, nextPointCartesian]
        }, false)
        // 第一条航线距离标识
        var distance = Cesium.Cartesian3.distance(bluePointCartesian, nextPointCartesian)
        var distanceInMeters = distance.toFixed(0) + 'm'
        // 计算两个笛卡尔坐标的中心坐标
        var midPointB = this.computeMidPointCartesian(bluePointCartesian, nextPointCartesian)
        // 标注距离标识
        this.distanceLabels[0].position = midPointB
        this.distanceLabels[0].label.text = distanceInMeters
      }
    },
    // 拖拽模型-左键抬起
    leftUpAction(e, viewer) {
      document.body.style.cursor = 'default'
      this.leftDownFlag = false
      this.pickedEntity = null
      // 解除相机锁定
      viewer.scene.screenSpaceCameraController.enableRotate = true
      // 鼠标抬起操作
      // ...
    },
    // 点击选点
    addFlyDrove(viewer) {
      // 鼠标箭头👉十字箭头
      this.crosshair = true
      this.ifAddDroveFlag = true
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      this.handler.setInputAction((event) => {
        // console.log(event.position)
        // 获取点击位置的屏幕坐标
        // screenPosition是二维坐标 It{x: 1085, y: 602}，表示从画布左上角开始计算的xy
        var screenPosition = event.position
        // console.log('screenPosition', screenPosition)
        // 将屏幕坐标转换为地理坐标
        var ray = viewer.camera.getPickRay(screenPosition)
        var whitePointCartesian = viewer.scene.globe.pick(ray, viewer.scene)
        if (whitePointCartesian) {
          // whitePointCartesian:🌏et{x: -2610898.800091982, y: 4749216.922361274, z: 3351596.5848676395}
          // console.log('whitePointCartesian', whitePointCartesian)
          this.whitePoint = this.drawWhitePoint(whitePointCartesian)
          this.whitePoints.push(this.whitePoint)

          var bluePointPosition = Cesium.Cartographic.fromCartesian(whitePointCartesian)
          // bluePointPosition Jr{longitude: 2.0734470141849206, latitude: 0.5568645155301508, height: 10.430285800919577}
          // console.log('bluePointPosition', bluePointPosition)
          bluePointPosition.height += 20 // 100 meters above the white point
          var bluePointCartesian = Cesium.Cartographic.toCartesian(bluePointPosition)
          // bluePointCartesian 🌏et{x: -2610901.8784505245, y: 4749263.389039818, z: 3351624.1784977536}
          // console.log('bluePointCartesian', bluePointCartesian)
          this.bluePoint = this.drawBluePoint(bluePointCartesian, bluePointPosition.height)
          this.bluePoints.push(this.bluePoint)

          var bluePointLabel = this.drawBluePointLabel(bluePointCartesian, this.labelCount.toString())
          this.bluePointLabels.push(bluePointLabel)
          this.labelCount++
          this.bluePoint.label = bluePointLabel

          const res = this.GetWGS84FromDKR(bluePointCartesian)
          // console.log('========================', res)
          const options = {
            aircraftLongitude: res.x,
            aircraftLatitude: res.y,
            aircraftAltitude: res.z,
            gimbalPitchValue: 0.77056379217234,
            gimbalYawValue: -90.52559171972544,
            isShoot: true
          }
          this.positionsList.push(options)

          this.whiteLine = this.drawWhiteLine(whitePointCartesian, bluePointCartesian)
          this.whiteLines.push(this.whiteLine)

          // Calculate midpoint between the clicked point and blue point
          var midPoint = this.computeMidPointCartesian(whitePointCartesian, bluePointCartesian)
          const heightLabel = this.drawBluePointLabel(midPoint, '20m', null, 14, new Cesium.Cartesian2(15, 0))
          this.heightLabels.push(heightLabel)
          if (this.bluePoints.length > 1) {
            const positions = [
              this.bluePoints[this.bluePoints.length - 2].position.getValue(),
              this.bluePoint.position.getValue()
            ]
            var blueLine = this.drawWhiteLine(positions[0], positions[1], 3, Cesium.Color.BLUE, false)
            this.blueLines.push(blueLine) // Add red line to the array
            // et{x: -2610857.690867494, y: 4749287.953297833, z: 3351571.181484913}
            // console.log(this.bluePoints[this.bluePoints.length - 2].position.getValue())
            // const intersections = []

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
            // for (var i = 0; i < this.tilesetPoints.length; i++) {
            //   var point = this.tilesetPoints[i]
            //   // 检测点是否与线段相交
            //   var intersection = this.checkLineSegment2Sphere(positions[0], positions[1], point)
            //   if (intersection) {
            //     blueLine.polyline.material = Cesium.Color.RED
            //     intersections.push(intersection)
            //   }
            // }
            // if (intersections.length) {
            //   this.$message.error('航线不可用')
            //   console.log('点与射线相交。', '相交点是：', intersections)
            // } else {
            //   console.log('点与射线没有相交。')
            // }

            var distance = Cesium.Cartesian3.distance(positions[0], positions[1])
            var distanceInMeters = distance.toFixed(0) + 'm'
            var midPointB = this.computeMidPointCartesian(positions[0], positions[1])
            // Add label at the midpoint with the distance value
            var distanceLabel = this.drawBluePointLabel(midPointB, distanceInMeters, null, 14, new Cesium.Cartesian2(0, -15))
            this.distanceLabels.push(distanceLabel)
          }
        } else {
          console.log('未能获取地理坐标。')
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    // 鼠标点击点云选点
    click3DTile(viewer) {
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handler.setInputAction((click) => {
        var pickedPosition = viewer.scene.pickPosition(click.position)
        if (Cesium.defined(pickedPosition)) {
          // 在这里你可以处理拾取到的点的位置
          console.log('Picked point:', pickedPosition)
          viewer.entities.add({
            position: pickedPosition,
            point: {
              color: Cesium.Color.BLUE,
              pixelSize: 8
            }
          })
          this.testDrove.push(pickedPosition)
          if (this.testDrove.length === 2) {
            var direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(this.testDrove[1], this.testDrove[0], new Cesium.Cartesian3()), new Cesium.Cartesian3())
            // 建立射线
            var ray = new Cesium.Ray(this.testDrove[0], direction)
            var result = viewer.scene.pickFromRay(ray, this.testDrove) // 计算交互点，返回第一个
            this.showIntersection(result, this.testDrove[1], this.testDrove[0])
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    // 展示航线1
    showLine1() {
      this.airLinePoints.map((point, index) => {
        // 经纬度坐标转笛卡尔坐标
        const bluePointCartesian = Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)

        // ******画扁平化航点******
        this.bluePoint = this.drawBluePoint(bluePointCartesian, point.altitude)
        this.bluePoints.push(this.bluePoint)

        // ******画航点的序号标识******
        var bluePointLabel = this.drawBluePointLabel(bluePointCartesian, point.id)
        this.bluePointLabels.push(bluePointLabel)

        // ******画地平面白点******
        // 从笛卡尔位置创建一个新的制图实例后高度减20，再转笛卡尔坐标
        var whitePointPosition = Cesium.Cartographic.fromCartesian(bluePointCartesian)
        // console.log({ whitePointPosition })
        // whitePointPosition还不是真正的经纬度坐标，只有高度是ok的 => Jr{longitude: 2.0734269812284305, latitude: 0.5568589346231817, height: 34.97105690332365}
        whitePointPosition.height -= 20 // 100 meters above the white point
        var whitePointCartesian = Cesium.Cartographic.toCartesian(whitePointPosition)
        // 画地平面白点
        this.whitePoint = this.drawWhitePoint(whitePointCartesian)
        this.whitePoints.push(this.whitePoint)

        // ******画扁平化航点到地平面白点之间的虚线******
        this.whiteLine = this.drawWhiteLine(whitePointCartesian, bluePointCartesian)
        this.whiteLines.push(this.whiteLine)

        // ******标注高度标识******
        // 计算两个笛卡尔坐标的中心坐标
        var midPoint = this.computeMidPointCartesian(whitePointCartesian, bluePointCartesian)
        // 标注高度标识
        const heightLabel = this.drawBluePointLabel(midPoint, '20m', null, 14, new Cesium.Cartesian2(15, 0))
        this.heightLabels.push(heightLabel)

        // 排除最后一个点
        if (index < this.airLinePoints.length - 1) {
          // 连续的两个点形成数组
          const positions = [
            Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
            Cesium.Cartesian3.fromDegrees(this.airLinePoints[index + 1].longitude, this.airLinePoints[index + 1].latitude, this.airLinePoints[index + 1].altitude)
          ]

          // ******画两个航点之间的连线******
          var blueLine = this.drawWhiteLine(positions[0], positions[1], 3, Cesium.Color.BLUE, false)
          this.blueLines.push(blueLine)

          // ******标注距离标识******
          // 计算两点之间的距离
          var distance = Cesium.Cartesian3.distance(positions[0], positions[1])
          var distanceInMeters = distance.toFixed(0) + 'm'
          // 计算两个笛卡尔坐标的中心坐标
          var midPointB = this.computeMidPointCartesian(positions[0], positions[1])
          // 标注距离标识
          var distanceLabel = this.drawBluePointLabel(midPointB, distanceInMeters, null, 14, new Cesium.Cartesian2(0, -15))
          this.distanceLabels.push(distanceLabel)
        }
      })
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
      this.handler && this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
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
     * 计算两个笛卡尔坐标的中心坐标
     * start : 开始点🌏et{x: -2610901.8784505245, y: 4749263.389039818, z: 3351624.1784977536}
     * end : 结束点🌏et{x: -2610901.8784505245, y: 4749263.389039818, z: 3351624.1784977536}
     * 返回 midPoint : 中心点🌏et{x: -2610901.8784505245, y: 4749263.389039818, z: 3351624.1784977536}
    */
    computeMidPointCartesian(start, end) {
      const midPoint = Cesium.Cartesian3.midpoint(start, end, new Cesium.Cartesian3())
      return midPoint
    },
    /**
     * 画线
     * start : 开始点🌏et{x: -2610901.8784505245, y: 4749263.389039818, z: 3351624.1784977536}
     * end : 结束点🌏et{x: -2610901.8784505245, y: 4749263.389039818, z: 3351624.1784977536}
     * width : 宽度
     * color : 颜色
     * dash : 虚线
    */
    drawWhiteLine(start, end, width = 1, color = Cesium.Color.WHITE, dash = true) {
      const whiteLine = this.viewer.entities.add({
        polyline: {
          positions: [start, end],
          width,
          material: dash ? new Cesium.PolylineDashMaterialProperty({ color: color }) : color
        }
      })
      return whiteLine
    },
    /**
     * 画地平面白点
     * whitePointCartesian : 🌏et{x: -2610901.8784505245, y: 4749263.389039818, z: 3351624.1784977536}
    */
    drawWhitePoint(whitePointCartesian) {
      const whitePoint = this.viewer.entities.add({
        position: whitePointCartesian,
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 5
        }
      })
      return whitePoint
    },
    /**
     * 画文字标识
     * cartesian : 🌏et{x: -2610901.8784505245, y: 4749263.389039818, z: 3351624.1784977536}
     * text : 文字标识
     * color : 文字颜色
     * fontSize : 文字大小
     * offeset : 文字位置偏移
    */
    drawBluePointLabel(cartesian, text, color = Cesium.Color.WHITE, fontSize = 22, offeset = new Cesium.Cartesian2(0, -20)) {
      var bluePointLabel = this.viewer.entities.add({
        position: cartesian,
        label: {
          text: text.toString(),
          fillColor: color,
          font: fontSize + 'px sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          pixelOffset: offeset
        }
      })
      return bluePointLabel
    },
    /**
     * 画扁平化航点
     * bluePointCartesian : 🌏et{x: -2610901.8784505245, y: 4749263.389039818, z: 3351624.1784977536}
     * altitude : 高度(航点经纬度高度)
    */
    drawBluePoint(bluePointCartesian, altitude) {
      // console.log({ altitude })
      const bluePoint = this.viewer.entities.add({
        position: bluePointCartesian,
        // ellipse: {
        //   semiMinorAxis: 2, // adjust the size of the ellipse
        //   semiMajorAxis: 2,
        //   material: Cesium.Color.WHITE.withAlpha(1),
        //   height: altitude
        // }
        point: {
          color: Cesium.Color.BLUE,
          pixelSize: 15
        }
      })
      return bluePoint
    },
    /**
     * 递归查询点云所有点，注意这里是根据点云文件数据个性化字段去获取🌏et坐标
     * tile : 点云_root
    */
    // traverseAndCollectPoints(tile) {
    //   // console.log('+++++++++++++++++++++', tile)
    //   var content = tile.boundingVolume
    //   // console.log(content)
    //   if (Cesium.defined(content) && Cesium.defined(content._boundingSphere)) {
    //     var values = content._boundingSphere.center
    //     this.tilesetPoints.push(values)
    //   }
    //   var children = tile.children
    //   if (Cesium.defined(children)) {
    //     for (var i = 0; i < children.length; ++i) {
    //       this.traverseAndCollectPoints(children[i])
    //     }
    //   }
    // },
    /**
     * 检查线段与球体的交点
     * lp0, lp1 : 线段两端坐标
     * sp: 球体中心坐标
     * radius: 球体半径
     * 注：所有坐标都是笛卡尔坐标🌏et{x: -2610901.8784505245, y: 4749263.389039818, z: 3351624.1784977536}
    */
    checkLineSegment2Sphere(lp0, lp1, sp, radius = 4) {
      // console.log({ lp0, lp1, sp })
      var intersection = Cesium.IntersectionTests.lineSegmentSphere(lp0, lp1, new Cesium.BoundingSphere(sp, radius))
      if (intersection) {
        // console.log('点与射线相交。', '相交点是：', intersection)
        return intersection
      }
    },
    /**
     * 笛卡尔坐标 => 经纬度坐标
     * coor : 🌏et{x: -2610901.8784505245, y: 4749263.389039818, z: 3351624.1784977536}
    */
    GetWGS84FromDKR(coor) {
      const cartographic = Cesium.Cartographic.fromCartesian(coor)
      // console.log(cartographic)
      // cartographic还不是真正的经纬度坐标，只有高度是ok的 => Jr{longitude: 2.0734269812284305, latitude: 0.5568589346231817, height: 34.97105690332365}
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
    // 鼠标在电脑屏幕上的点击位置,返回了鼠标点击位置的xy像素点分量 => It {x: 1337, y: 569}
    getMousePosition(e) {
      return new Cesium.Cartesian2(
        e.position.x,
        e.position.y
      )
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
