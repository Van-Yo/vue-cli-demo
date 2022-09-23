<template>
  <div class="container-area">
    <div id="canvas" />
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
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
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      // 创建材质
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
      // 根据几何体和材质创建物体
      const cube = new THREE.Mesh(geometry, material)
      // 将物体添加到场景中
      this.scene.add(cube)
      // ***************************************************************** 修改物体位置 *****************************************************************
      const gui = new dat.GUI()
      gui.add(cube.position, 'x').min(0).max(5).step(0.01).name('移动x轴')

      // 环境光
      const light = new THREE.AmbientLight(0x404040) // soft white light
      this.scene.add(light)
      // 平行光
      const directionalLight = new THREE.DirectionalLight(0xffffff)
      directionalLight.position.set(10, 10, 10)
      this.scene.add(directionalLight)

      /**
       * 底部平面
       */
      const gridHelper = new THREE.GridHelper(10, 10)
      gridHelper.material.opacity = 0.3
      gridHelper.material.transparent = true
      this.scene.add(gridHelper)

      // 坐标轴辅助器
      const axesHelper = new THREE.AxesHelper(5)
      this.scene.add(axesHelper)

      // 初始化渲染器
      this.renderer = new THREE.WebGLRenderer()
      // 设置渲染的尺寸和大小
      this.renderer.setSize(window.innerWidth, window.innerHeight)

      // 将webgl渲染的canvas内容添加到页面
      document.getElementById('canvas').appendChild(this.renderer.domElement)

      // 创建轨道控制器
      const controls = new OrbitControls(this.camera, this.renderer.domElement)
      controls.update()

      // 使用渲染器，通过相机将场景渲染进来
      this.render()
      // 自适应浏览器大小
      window.addEventListener('resize', () => {
        console.log('画面变化了')
        // 更新摄像头
        this.camera.aspect = window.innerWidth / window.innerHeight
        // 更新摄像机的摄影矩阵
        this.camera.updateProjectionMatrix()
        // 更新渲染器
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        // 设置渲染器的像素比
        this.renderer.setPixelRatio(window.devicePixelRatio)
      })
      // ***************************************************************** 双击进入全屏或退出全屏 *****************************************************************
      window.addEventListener('dblclick', () => {
        console.log('双击')
        const fullScreenElement = document.fullscreenElement
        if (fullScreenElement) {
          document.exitFullscreen()
        } else {
          this.renderer.domElement.requestFullscreen()
        }
      })
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
