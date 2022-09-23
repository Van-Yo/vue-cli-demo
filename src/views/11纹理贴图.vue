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
      const geometry = new THREE.PlaneGeometry(5, 5, 200, 200)

      // 纹理加载进度
      const event = this.processloader()
      const loadingManager = new THREE.LoadingManager(
        event.onLoad,
        event.onProgress,
        event.onError
      )

      // 纹理加载器
      const textureLoader = new THREE.TextureLoader(loadingManager)
      const doorColorTexture = textureLoader.load(
        'GroundForest003_COL_VAR1_3K.jpg'
      )

      // AO
      const aoTexture = textureLoader.load('GroundForest003_AO_3K.jpg') // ao:举例给门添加门缝
      geometry.setAttribute(
        'uv2',
        new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
      )

      // 导入置换贴图
      const dispTexture = textureLoader.load('GroundForest003_DISP_3K.jpg') // 举例给门添加视觉高度，凹凸不平

      // 导入法线贴图
      const nrmTextrue = textureLoader.load('GroundForest003_NRM_3K.jpg')

      // 创建材质
      const material = new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        side: THREE.DoubleSide,
        aoMap: aoTexture,
        displacementMap: dispTexture,
        displacementScale: 0.1,
        roughness: 0.5, // 粗糙度，可看到反射灯光
        normalMap: nrmTextrue
      })
      // 根据几何体和材质创建物体
      const plane = new THREE.Mesh(geometry, material)
      plane.rotation.set(Math.PI / 2, 0, 0)
      // 将物体添加到场景中
      this.scene.add(plane)

      // 环境光
      const light = new THREE.AmbientLight(0x404040) // soft white light
      this.scene.add(light)
      // 平行光
      const directionalLight = new THREE.DirectionalLight(0xffffff)
      directionalLight.position.set(10, 10, 10)
      this.scene.add(directionalLight)
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
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.render)
    },
    processloader() {
      const event = {}
      event.onLoad = () => {
        console.log('图片加载完成')
      }
      event.onProgress = (url, num, total) => {
        console.log('图片加载地址：', url)
        console.log('图片加载当前：', num)
        console.log('图片加载总数：', total)
        console.log(
          '加载进度的百分比：',
          ((num / total) * 100).toFixed(2) + '%'
        )
      }
      event.onError = (e) => {
        console.log('图片加载出现错误')
        console.log(e)
      }
      return event
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
