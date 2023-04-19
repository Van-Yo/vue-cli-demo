<template>
  <div class="hello">
    <div id="cesiumContainer" />
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  mounted() {
    // defaultAccessToken => https://ion.cesium.com/tokens?page=1
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZWMwZTBiNi05MThiLTQwMjgtYWQ2OS1lOTU2YjVlZWY2NTkiLCJpZCI6MTI4MTM3LCJpYXQiOjE2Nzg0MzczMDF9.YdLkYKoMylbtikMWvjsCy9j11HyBYbVSIQuLXugNgUE'
    const viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain(), // 快速创建世界地形
      infoBox: false
    })
    // Load Cesium World Terrain
    // viewer.terrainProvider = Cesium.createWorldTerrain({
    //   requestWaterMask: true, // required for water effects
    //   requestVertexNormals: true // required for terrain lighting
    // })
    // viewer.scene.globe.depthTestAgainstTerrain = true
    var entity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-103.0, 40.0),
      ellipse: {
        semiMinorAxis: 250000.0,
        semiMajorAxis: 400000.0,
        material: Cesium.Color.BLUE.withAlpha(0.5)
      }
    })
    viewer.zoomTo(viewer.entities)

    var ellipse = entity.ellipse // For upcoming examples
    ellipse.material = new Cesium.CheckerboardMaterialProperty({
      evenColor: Cesium.Color.WHITE,
      oddColor: Cesium.Color.BLACK,
      repeat: new Cesium.Cartesian2(4, 4)
    })
  }
}
</script>
