<!--
  设置物体移动
-->
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
      renderer: null,
      cube: null,
      moveArrow: true
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
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      // 创建材质
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      // 根据几何体和材质创建物体
      this.cube = new THREE.Mesh(geometry, material)

      // ***************************************************************** 修改物体位置 *****************************************************************
      // this.cube.position.set(3, 0, 0)
      this.cube.position.x = 0

      // 将物体添加到场景中
      this.scene.add(this.cube)

      // 坐标轴辅助器
      const axesHelper = new THREE.AxesHelper(5)
      this.scene.add(axesHelper)

      // 初始化渲染器
      this.renderer = new THREE.WebGLRenderer()
      // 设置渲染的尺寸和大小
      this.renderer.setSize(window.innerWidth, window.innerHeight)

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
      // ***************************************************************** 修改物体位置 *****************************************************************
      if (this.moveArrow) {
        this.cube.position.x += 0.02
        if (this.cube.position.x > 5) {
          this.moveArrow = false
        }
      } else {
        this.cube.position.x -= 0.02
        if (this.cube.position.x < 0) {
          this.moveArrow = true
        }
      }

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
