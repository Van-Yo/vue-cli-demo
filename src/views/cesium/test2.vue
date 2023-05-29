<template>
  <div class="hello">
    <div id="cesiumContainer" />
    <div id="toolbar">
      <label>
        <input id="visibilityCheckbox" type="checkbox" checked> 显示点云
      </label>
      <label>
        <el-button type="primary" @click="flyToHome">回到起点</el-button>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      droneAnimator: null,
      addList: [],
      timer: null
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

      this.initPlaneViewer(viewer)
    },
    initPlaneViewer(viewer) {
      // 实例化DroneFlightAnimator类
      const initPosition = Cesium.Cartesian3.fromDegrees(118.8, 31.9052, 28)
      this.droneAnimator = new DroneFlightAnimator({ viewer, initPosition }, (msg) => {
        // this.draw()
      })
      this.mockAirlineCommand()
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
      }, 3000)
      setTimeout(() => {
        clearInterval(this.timer)
        this.delayGoHome()
      }, 60000)
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
