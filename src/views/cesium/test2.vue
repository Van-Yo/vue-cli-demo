<template>
  <div class="hello">
    <div id="cesiumContainer" />
    <div id="toolbar">
      <label>
        <input id="visibilityCheckbox" type="checkbox" checked> 显示点云
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
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
        // console.log(tileset)
        var pointCloud = viewer.scene.primitives.add(tileset)
        pointCloud.show = true
        // 设置点的大小
        tileset.style = new Cesium.Cesium3DTileStyle({
          pointSize: 3
        })
        await viewer.zoomTo(tileset)
        // Add event listener to toggle visibility of point cloud
        var visibilityCheckbox = document.getElementById('visibilityCheckbox')
        visibilityCheckbox.addEventListener('change', function() {
          pointCloud.show = visibilityCheckbox.checked
        })
      } catch (error) {
        console.log(error)
      }

      var droneEntity = viewer.entities.add({
        name: 'Aircraft',
        position: Cesium.Cartesian3.fromDegrees(118.8, 31.9052, 40),
        // orientation: Cesium.Transforms.headingPitchRollQuaternion(
        //   Cesium.Cartesian3.fromDegrees(118.8, 31.9052, 40),
        //   new Cesium.HeadingPitchRoll(1, 0, 0)
        // ),
        model: {
          uri: 'cartoon_turtle/scene.gltf',
          minimumPixelSize: 64
        }
      })

      // 创建线路实体
      var lineEntity = viewer.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty(function() {
            return [droneEntity.position.getValue(viewer.clock.currentTime)]
          }, false),
          width: 2,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.3,
            color: Cesium.Color.RED
          })
        }
      })

      // 定义飞行动画
      function flyToDestination(startPosition, endPosition, duration) {
        var startTime = Cesium.JulianDate.now()
        var endTime = Cesium.JulianDate.addSeconds(startTime, duration, new Cesium.JulianDate())

        // 更新无人机位置
        droneEntity.position = new Cesium.CallbackProperty(function(time) {
          if (Cesium.JulianDate.compare(time, startTime) < 0) {
            return startPosition
          } else if (Cesium.JulianDate.compare(time, endTime) >= 0) {
            return endPosition
          } else {
            var elapsedSeconds = Cesium.JulianDate.secondsDifference(time, startTime)
            var progress = elapsedSeconds / duration
            return Cesium.Cartesian3.lerp(startPosition, endPosition, progress, new Cesium.Cartesian3())
          }
        }, false)
      }

      // 3秒后更新无人机位置并开始飞行
      setTimeout(function() {
        flyToDestination(
          Cesium.Cartesian3.fromDegrees(118.8, 31.9052, 40), // 当前位置作为起始点
          Cesium.Cartesian3.fromDegrees(118.8005, 31.906, 120), // 下一个坐标B
          10 // 飞行时间（秒）
        )
      }, 3000)
      // 每帧更新渲染
      viewer.scene.preRender.addEventListener(function() {
        viewer.scene.requestRender()
      })
      // var startCartographic = Cesium.Cartographic.fromDegrees(
      //   118.8, 31.9052, 40
      // )
      // var endCartographic = Cesium.Cartographic.fromDegrees(
      //   118.8005, 31.906, 120
      // )
      // // 将Cartographic坐标转换为笛卡尔坐标
      // var startCartesian = Cesium.Ellipsoid.WGS84.cartographicToCartesian(
      //   startCartographic
      // )
      // var endCartesian = Cesium.Ellipsoid.WGS84.cartographicToCartesian(
      //   endCartographic
      // )

      // // 创建线段实体
      // var lineEntity = viewer.entities.add({
      //   name: 'Line',
      //   polyline: {
      //     positions: [startCartesian, endCartesian],
      //     width: 2,
      //     material: Cesium.Color.RED
      //   }
      // })
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
  }
}
</style>
