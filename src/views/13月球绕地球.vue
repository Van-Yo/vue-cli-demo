<template>
  <div class="container-area">
    <div id="canvas" />
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
  CSS2DRenderer,
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer'
export default {
  components: {},
  data() {
    return {
      labelRenderer: null,
      scene: null,
      camera: null,
      renderer: null,
      EARTH_RADIUS: 2.5,
      MOON_RADIUS: 0.27,
      moon: null,
      earth: null,
      clock: new THREE.Clock(),
      oldTime: 0
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

      // 创建聚光灯
      const dirLight = new THREE.SpotLight(0xffffff)
      dirLight.position.set(0, 0, 10)
      dirLight.intensity = 2 // 光照强度
      dirLight.castShadow = true // 阴影
      this.scene.add(dirLight)

      // 创建环境光
      const aLight = new THREE.AmbientLight(0xffffff)
      aLight.intensity = 0.3 // 光照强度
      this.scene.add(aLight)

      // 纹理加载器
      const textureLoader = new THREE.TextureLoader()

      // 月球
      const moonGeometry = new THREE.SphereGeometry(this.MOON_RADIUS, 16, 16)
      const moonMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('moon.jpg')
      })
      this.moon = new THREE.Mesh(moonGeometry, moonMaterial)
      this.moon.receiveShadow = true // 接收阴影，这里是地球给月球阴影
      this.moon.castShadow = true // 计算阴影
      this.scene.add(this.moon)

      // 月球描述本文
      const moonDiv = document.createElement('div')
      moonDiv.className = 'label'
      moonDiv.textContent = 'Moon'
      const moonLabel = new CSS2DObject(moonDiv)
      moonLabel.position.set(0, this.MOON_RADIUS + 0.3, 0)
      this.moon.add(moonLabel)

      // 地球
      const earthGeometry = new THREE.SphereGeometry(this.EARTH_RADIUS, 32, 32)
      const earthMaterial = new THREE.MeshPhongMaterial({
        shininess: 5,
        map: textureLoader.load('earth.jpg'),
        normalMap: textureLoader.load('4096_normal.jpg') // 法线贴图
      })
      this.earth = new THREE.Mesh(earthGeometry, earthMaterial)
      this.earth.receiveShadow = true
      this.earth.castShadow = true
      this.scene.add(this.earth)
      // 地球描述本文
      const earthDiv = document.createElement('div')
      earthDiv.className = 'label' // 接收阴影，这里是月球给地球阴影
      earthDiv.textContent = 'Earth' // 计算阴影
      const earthLabel = new CSS2DObject(earthDiv)
      earthLabel.position.set(0, this.EARTH_RADIUS + 0.3, 0)
      this.earth.add(earthLabel)

      // 坐标轴辅助器
      // const axesHelper = new THREE.AxesHelper(5)
      // this.scene.add(axesHelper)

      // 初始化渲染器
      this.renderer = new THREE.WebGLRenderer({ alpha: true })
      this.renderer.shadowMap.enabled = true
      this.renderer.domElement.style.position = 'absolute'
      this.renderer.domElement.style.top = 0
      this.renderer.domElement.style.zIndex = 999
      // 设置渲染的尺寸和大小
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      // 将webgl渲染的canvas内容添加到页面
      document.getElementById('canvas').appendChild(this.renderer.domElement)

      // 标签渲染器
      this.labelRenderer = new CSS2DRenderer()
      this.labelRenderer.setSize(window.innerWidth, window.innerHeight)
      this.labelRenderer.domElement.style.position = 'absolute'
      this.labelRenderer.domElement.style.top = 0
      document
        .getElementById('canvas')
        .appendChild(this.labelRenderer.domElement)

      // 创建轨道控制器
      const controls = new OrbitControls(this.camera, this.renderer.domElement)
      controls.update()

      // 使用渲染器，通过相机将场景渲染进来
      this.render()
    },
    // 一直渲染
    render() {
      const elapsed = this.clock.getElapsedTime()
      // 月球旋转
      this.moon.position.set(Math.sin(elapsed) * 4, 0, Math.cos(elapsed) * 4)

      // 地球自转
      const axis = new THREE.Vector3(0, 1, 0)
      this.earth.rotateOnAxis(axis, ((elapsed - this.oldTime) * Math.PI) / 20)
      // 两个渲染器渲染
      this.renderer.render(this.scene, this.camera)
      this.labelRenderer.render(this.scene, this.camera)

      this.oldTime = elapsed
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
    background: url('../assets/bg.webp');
    color: #fff;
  }
}
</style>
