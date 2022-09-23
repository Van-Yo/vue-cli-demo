<template>
  <div class="container-area">
    <div id="canvas" />
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export default {
  components: {},
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      /**
       * 1.创建场景
       */
      this.scene = new THREE.Scene()

      /**
       * 2.创建相机
       */
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      // 设置相机位置
      this.camera.position.set(5, 5, 5)
      this.scene.add(this.camera)

      /**
       * 3.添加物体
       */
      // 创建几何体
      const geometry = new THREE.SphereGeometry(1, 60, 60)
      // 创建材质
      // ***************************************************************** 1.材质要满足能够对光照有反应，例如 MeshStandardMaterial *****************************************************************
      const material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide
      })
      // 根据几何体和材质创建物体
      const cube = new THREE.Mesh(geometry, material)
      // ***************************************************************** 4.设置物体投射阴影 *****************************************************************
      cube.castShadow = true
      // 将物体添加到场景中
      this.scene.add(cube)

      const planeGeometry = new THREE.PlaneGeometry(7, 7)
      const plane = new THREE.Mesh(planeGeometry, material)
      plane.position.set(0, -1, 0)
      plane.rotation.x = -Math.PI / 2
      // ***************************************************************** 5.设置物体接收阴影 *****************************************************************
      plane.receiveShadow = true
      this.scene.add(plane)

      // 环境光
      const light = new THREE.AmbientLight(0x404040) // soft white light
      this.scene.add(light)
      // 平行光
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(10, 10, 10)
      // ***************************************************************** 3.设置光照投射阴影 *****************************************************************
      directionalLight.castShadow = true
      this.scene.add(directionalLight)

      // 坐标轴辅助器
      const axesHelper = new THREE.AxesHelper(5)
      this.scene.add(axesHelper)

      // 初始化渲染器
      this.renderer = new THREE.WebGLRenderer()
      // 设置渲染的尺寸和大小
      this.renderer.setSize(window.innerWidth, window.innerHeight)

      // ***************************************************************** 2.设置渲染器开启阴影的计算 *****************************************************************
      this.renderer.shadowMap.enabled = true

      console.log(this.renderer)
      // 将webgl渲染的canvas内容添加到页面
      document.getElementById('canvas').appendChild(this.renderer.domElement)

      // 创建轨道控制器
      const controls = new OrbitControls(this.camera, this.renderer.domElement)
      controls.update()

      // 使用渲染器，通过相机将场景渲染进来
      this.render()
    },
    // 一直渲染
    render() {
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.render)
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area {
  #canvas {
    width: 100vw;
    height: 100vh;
  }
}
</style>
