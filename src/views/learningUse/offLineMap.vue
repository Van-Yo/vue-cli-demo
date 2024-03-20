<template>
  <div class="container-area">
    <div id="mapdiv" class="map" />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      markerList: [
        { name: '配电房', lng: 119.275401, lat: 26.087788 },
        { name: '配电房1', lng: 119.45401, lat: 26.087788 }
      ]
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      this.map = new BMap.Map('mapdiv')
      // 允许滚轮缩放
      // this.map.enableScrollWheelZoom();
      // 不允许滚轮缩放
      this.map.disableScrollWheelZoom()
      // 不允许双击缩放
      this.map.disableDoubleClickZoom()
      // 初始化地图,设置中心点坐标和地图级别
      this.map.centerAndZoom(new BMap.Point(119.28, 26.08), 11)

      this.map.disableInertialDragging() // 禁用惯性拖拽
      this.map.enableContinuousZoom()

      this.boundary = new BMap.Boundary()
      this.boundary.get('福州市', (rs) => {
        // this.map.clearOverlays()
        // 高亮江苏省边界
        var hole = new BMap.Polygon(rs.boundaries, {
          fillColor: 'blue',
          fillOpacity: 0.05,
          strokeColor: 'blue',
          strokeWeight: 2
        })
        this.map.addOverlay(hole)
      })
      this.markerList.map(item => {
        const marker = new BMap.Marker(new BMap.Point(item.lng, item.lat))
        const label = new BMap.Label(item.name, {
          position: new BMap.Point(item.lng, item.lat), // 设置文本标注的位置
          offset: new BMap.Size(-28, -50) // 设置文本标注偏移量
        })
        label.setStyle({
          color: 'red',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '4px',
          padding: '5px 10px'
        })
        marker.addEventListener('click', e => {
          console.log(e)
        })
        // 将文本标注添加到地图上
        this.map.addOverlay(label)
        // 在地图上添加点标记
        this.map.addOverlay(marker)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area{
  height: 100%;
    #mapdiv{
        width: 100%;
        height: 100%;
    }
}
</style>
