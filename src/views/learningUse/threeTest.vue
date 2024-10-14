<template>
  <div ref="three" class="container-area">
    <div id="canvas" />
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import * as dat from 'dat.gui'
export default {
  components: {},
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      raycaster: null,
      mouse: null,
      selectedObject: null
    }
  },
  created() {
    // 声明raycaster和mouse变量
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
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
      this.scene.background = new THREE.Color(0x293846)
      /**
       * 2.创建相机
       */
      this.camera = new THREE.PerspectiveCamera(
        75,
        this.$refs.three.clientWidth / this.$refs.three.clientHeight,
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
      const material = new THREE.MeshNormalMaterial()
      // 根据几何体和材质创建物体
      const cube = new THREE.Mesh(geometry, material)
      // 将物体添加到场景中
      this.scene.add(cube)

      // 创建几何体2
      const geometry2 = new THREE.BoxGeometry(1, 1, 1)

      // 创建材质
      const material2 = new THREE.MeshNormalMaterial()
      // 根据几何体和材质创建物体
      const cube2 = new THREE.Mesh(geometry2, material2)
      cube2.position.set(2, 0, 0)
      // 将物体添加到场景中
      this.scene.add(cube2)

      // 环境光
      const light = new THREE.AmbientLight(0xffffff, 0.5) // soft white light
      this.scene.add(light)
      // 平行光
      const directionalLight = new THREE.DirectionalLight(0xffffff)
      directionalLight.position.set(5, 5, 0)
      this.scene.add(directionalLight)

      /**
       * 底部平面
       */
      const gridHelper = new THREE.GridHelper(10, 10)
      gridHelper.material.opacity = 0.3
      gridHelper.material.transparent = true
      this.scene.add(gridHelper)

      // 坐标轴辅助器
      const axesHelper = new THREE.AxesHelper(6)
      this.scene.add(axesHelper)

      // 初始化渲染器
      this.renderer = new THREE.WebGLRenderer()
      // 设置渲染的尺寸和大小
      this.renderer.setSize(this.$refs.three.clientWidth, this.$refs.three.clientHeight)

      // 将webgl渲染的canvas内容添加到页面
      document.getElementById('canvas').appendChild(this.renderer.domElement)

      // 创建轨道控制器
      const controls = new OrbitControls(this.camera, this.renderer.domElement)
      controls.update()

      // 使用渲染器，通过相机将场景渲染进来
      this.render()
      // 自适应浏览器大小
      window.addEventListener('resize', () => {
        // console.log('画面变化了')
        // 更新摄像头
        this.camera.aspect = this.$refs.three.clientWidth / this.$refs.three.clientHeight
        // 更新摄像机的摄影矩阵
        this.camera.updateProjectionMatrix()
        // 更新渲染器
        this.renderer.setSize(this.$refs.three.clientWidth, this.$refs.three.clientHeight)
        // 设置渲染器的像素比
        this.renderer.setPixelRatio(window.devicePixelRatio)
      })
      // ***************************************************************** 双击进入全屏或退出全屏 *****************************************************************
      window.addEventListener('dblclick', () => {
        // console.log('双击')
        const fullScreenElement = document.fullscreenElement
        if (fullScreenElement) {
          document.exitFullscreen()
        } else {
          this.renderer.domElement.requestFullscreen()
        }
      })
      const objects = []
      objects.push(cube)
      objects.push(cube2)
      const dragControls = new DragControls(objects, this.camera, this.renderer.domElement)
      dragControls.addEventListener('hoveron', (event) => {
        controls.enableRotate = false
      })
      dragControls.addEventListener('hoveroff', (event) => {
        controls.enableRotate = true
      })
      // this.renderer.domElement.addEventListener('mousedown', this.onMouseDown, false)
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
  width: 100%;
  height: 100%;
  overflow: hidden;
  #canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
