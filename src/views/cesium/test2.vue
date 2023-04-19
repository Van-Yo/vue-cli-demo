<template>
  <div class="hello">
    <div id="cesiumContainer" />
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
        terrainProvider: new Cesium.CesiumTerrainProvider({
          url: Cesium.IonResource.fromAssetId(1)
        })
      })
      try {
        const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(1638728)
        viewer.scene.primitives.add(tileset)
        // 设置点的大小
        tileset.style = new Cesium.Cesium3DTileStyle({
          pointSize: 5
        })
        await viewer.zoomTo(tileset)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
