<template>
  <div ref="three" class="container-area">
    <div id="canvas" />
    <el-select v-model="value" placeholder="请选择" style="position:absolute;left:10px;top:10px" @change="loadModel">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
export default {
  components: {},
  data() {
    return {
      options: [{
        value: '1',
        label: '电房1'
      }, {
        value: '2',
        label: '电房2'
      }],
      value: '1',
      scene: null,
      camera: null,
      renderer: null,
      group1: null,
      positionList: [],
      gltfM: null,
      selectedMeshList: [],
      newSelectedMeshList: [],
      objectsToRemove: [],
      controls: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * 清除添加的模型（墙，地面，gitf模型）
    */
    clearModel() {
      for (var i = 0; i < this.objectsToRemove.length; i++) {
        var object = this.objectsToRemove[i]
        this.scene.remove(object) // 从场景中移除模型
      }
      this.objectsToRemove = []
      // 设置相机位置
      this.camera.position.set(0, 10, 10)
      this.camera.lookAt(0, 0, 0)
    },
    /**
     * 加载墙面和地面
    */
    loadWall() {
      // 创建墙和地面：group1
      this.group1 = new THREE.Group()
      const geometry1 = new THREE.BoxGeometry(9.6, 17.2, 0.05)
      // 创建材质
      const material1 = new THREE.MeshStandardMaterial({ color: 0xffffff, opacity: 0.3, transparent: true })
      // 根据几何体和材质创建物体
      const cube1 = new THREE.Mesh(geometry1, material1)
      cube1.name = 'box1'
      cube1.rotation.set(Math.PI / 2, 0, 0)
      // console.log(cube1.clone())
      this.group1.add(cube1)

      const geometry2 = new THREE.BoxGeometry(9.6, 2.8, 0.1)
      // 创建材质
      const material2 = new THREE.MeshStandardMaterial({ color: 0xffffff, opacity: 0.3, transparent: true })
      // 根据几何体和材质创建物体
      const cube2 = new THREE.Mesh(geometry2, material2)
      cube2.name = 'box2'
      cube2.position.y = 0.725 * 2 - 0.1
      cube2.position.z = 8.55
      this.group1.add(cube2)

      const geometry3 = new THREE.BoxGeometry(9.6, 2.8, 0.1)
      // 创建材质
      const material3 = new THREE.MeshStandardMaterial({ color: 0xffffff, opacity: 0.3, transparent: true })
      // 根据几何体和材质创建物体
      const cube3 = new THREE.Mesh(geometry3, material3)
      cube3.name = 'box3'
      cube3.position.y = 0.725 * 2 - 0.1
      cube3.position.z = -8.55
      this.group1.add(cube3)

      const geometry4 = new THREE.BoxGeometry(17.2, 2.8, 0.1)
      // 创建材质
      const material4 = new THREE.MeshStandardMaterial({ color: 0xffffff, opacity: 0.3, transparent: true })
      // 根据几何体和材质创建物体
      const cube4 = new THREE.Mesh(geometry4, material4)
      cube4.name = 'box4'
      cube4.position.x = 4.8
      cube4.position.y = 0.725 * 2 - 0.1
      cube4.rotation.set(0, Math.PI / 2, 0)
      this.group1.add(cube4)

      const geometry5 = new THREE.BoxGeometry(17.2, 2.8, 0.1)
      // 创建材质
      const material5 = new THREE.MeshStandardMaterial({ color: 0xffffff, opacity: 0.3, transparent: true })
      // 根据几何体和材质创建物体
      const cube5 = new THREE.Mesh(geometry5, material5)
      cube5.name = 'box5cube5'
      cube5.position.x = -4.8
      cube5.position.y = 0.725 * 2 - 0.1
      cube5.rotation.set(0, Math.PI / 2, 0)
      this.group1.add(cube5)
      // this.group1.scale.set(2, 2, 2)
      // 将物体添加到场景中
      this.objectsToRemove.push(this.group1)
      this.scene.add(this.group1)
      console.log(this.group1.position, '000000000000000000000000')
    },
    /**
     * 加载gltf模型
    */
    loadGltf(val) {
      const groupGlb = new THREE.Group()
      if (val === '1') {
        this.positionList = [
          { x: 2.95, y: 0, z: -2, name: '电柜1', rotation: Math.PI / 2 },
          { x: 3.6, y: 0, z: -2, name: '电柜2', rotation: Math.PI / 2 },
          { x: 4.25, y: 0, z: -2, name: '电柜3', rotation: Math.PI / 2 },
          { x: 4.9, y: 0, z: -2, name: '电柜4', rotation: Math.PI / 2 },
          { x: 5.55, y: 0, z: -2, name: '电柜5', rotation: Math.PI / 2 },
          { x: 6.2, y: 0, z: -2, name: '电柜6', rotation: Math.PI / 2 },
          { x: 6.85, y: 0, z: -2, name: '电柜7', rotation: Math.PI / 2 },
          { x: 7.5, y: 0, z: -2, name: '电柜8', rotation: Math.PI / 2 },

          { x: 1, y: 0, z: -0.5, name: '电柜6', rotation: -Math.PI / 2 },
          { x: 1.65, y: 0, z: -0.5, name: '电柜7', rotation: -Math.PI / 2 },
          { x: 2.3, y: 0, z: -0.5, name: '电柜8', rotation: -Math.PI / 2 },
          { x: 2.95, y: 0, z: -0.5, name: '电柜1', rotation: -Math.PI / 2 },
          { x: 3.6, y: 0, z: -0.5, name: '电柜2', rotation: -Math.PI / 2 },
          { x: 4.25, y: 0, z: -0.5, name: '电柜3', rotation: -Math.PI / 2 },
          { x: 4.9, y: 0, z: -0.5, name: '电柜4', rotation: -Math.PI / 2 },
          { x: 5.55, y: 0, z: -0.5, name: '电柜5', rotation: -Math.PI / 2 },
          { x: 6.2, y: 0, z: -0.5, name: '电柜6', rotation: -Math.PI / 2 },
          { x: 6.85, y: 0, z: -0.5, name: '电柜7', rotation: -Math.PI / 2 },
          { x: 7.5, y: 0, z: -0.5, name: '电柜8', rotation: -Math.PI / 2 },

          { x: 1, y: 0, z: 1, name: '电柜6', rotation: Math.PI / 2 },
          { x: 1.65, y: 0, z: 1, name: '电柜7', rotation: Math.PI / 2 },
          { x: 2.3, y: 0, z: 1, name: '电柜8', rotation: Math.PI / 2 },
          { x: 5.55, y: 0, z: 1, name: '电柜5', rotation: Math.PI / 2 },
          { x: 6.2, y: 0, z: 1, name: '电柜6', rotation: Math.PI / 2 },
          { x: 6.85, y: 0, z: 1, name: '电柜7', rotation: Math.PI / 2 },
          { x: 7.5, y: 0, z: 1, name: '电柜8', rotation: Math.PI / 2 },

          { x: 3.6, y: 0, z: 2.5, name: '电柜2', rotation: -Math.PI / 2 },
          { x: 4.25, y: 0, z: 2.5, name: '电柜3', rotation: -Math.PI / 2 },
          { x: 4.9, y: 0, z: 2.5, name: '电柜4', rotation: -Math.PI / 2 },
          { x: 5.55, y: 0, z: 2.5, name: '电柜5', rotation: -Math.PI / 2 },
          { x: 6.2, y: 0, z: 2.5, name: '电柜6', rotation: -Math.PI / 2 },
          { x: 6.85, y: 0, z: 2.5, name: '电柜7', rotation: -Math.PI / 2 },
          { x: 7.5, y: 0, z: 2.5, name: '电柜8', rotation: -Math.PI / 2 },

          { x: 1, y: 0, z: 4, name: '电柜6', rotation: Math.PI / 2 },
          { x: 1.65, y: 0, z: 4, name: '电柜7', rotation: Math.PI / 2 },
          { x: 2.3, y: 0, z: 4, name: '电柜8', rotation: Math.PI / 2 },
          { x: 2.95, y: 0, z: 4, name: '电柜1', rotation: Math.PI / 2 },
          { x: 3.6, y: 0, z: 4, name: '电柜2', rotation: Math.PI / 2 },
          { x: 4.25, y: 0, z: 4, name: '电柜3', rotation: Math.PI / 2 },
          { x: 4.9, y: 0, z: 4, name: '电柜4', rotation: Math.PI / 2 },
          { x: 5.55, y: 0, z: 4, name: '电柜5', rotation: Math.PI / 2 },
          { x: 6.2, y: 0, z: 4, name: '电柜6', rotation: Math.PI / 2 },
          { x: 6.85, y: 0, z: 4, name: '电柜7', rotation: Math.PI / 2 },

          { x: 1, y: 0, z: 5.5, name: '电柜6', rotation: -Math.PI / 2 },
          { x: 1.65, y: 0, z: 5.5, name: '电柜7', rotation: -Math.PI / 2 },
          { x: 2.3, y: 0, z: 5.5, name: '电柜8', rotation: -Math.PI / 2 },
          { x: 2.95, y: 0, z: 5.5, name: '电柜1', rotation: -Math.PI / 2 },
          { x: 3.6, y: 0, z: 5.5, name: '电柜2', rotation: -Math.PI / 2 },
          { x: 4.25, y: 0, z: 5.5, name: '电柜3', rotation: -Math.PI / 2 },
          { x: 4.9, y: 0, z: 5.5, name: '电柜4', rotation: -Math.PI / 2 },
          { x: 5.55, y: 0, z: 5.5, name: '电柜5', rotation: -Math.PI / 2 },
          { x: 6.2, y: 0, z: 5.5, name: '电柜6', rotation: -Math.PI / 2 },
          { x: 6.85, y: 0, z: 5.5, name: '电柜7', rotation: -Math.PI / 2 },
          { x: 7.5, y: 0, z: 5.5, name: '电柜8', rotation: -Math.PI / 2 },

          { x: 1, y: 0, z: 8, name: '电柜6', rotation: Math.PI / 2 },
          { x: 1.65, y: 0, z: 8, name: '电柜7', rotation: Math.PI / 2 },
          { x: 2.3, y: 0, z: 8, name: '电柜8', rotation: Math.PI / 2 },
          { x: 2.95, y: 0, z: 8, name: '电柜1', rotation: Math.PI / 2 },
          { x: 3.6, y: 0, z: 8, name: '电柜2', rotation: Math.PI / 2 },
          { x: 4.25, y: 0, z: 8, name: '电柜3', rotation: Math.PI / 2 },
          { x: 4.9, y: 0, z: 8, name: '电柜4', rotation: Math.PI / 2 },
          { x: 5.55, y: 0, z: 8, name: '电柜5', rotation: Math.PI / 2 },
          { x: 6.2, y: 0, z: 8, name: '电柜6', rotation: Math.PI / 2 },
          { x: 6.85, y: 0, z: 8, name: '电柜7', rotation: Math.PI / 2 },
          { x: 7.5, y: 0, z: 8, name: '电柜8', rotation: Math.PI / 2 }
        ]
      } else {
        this.positionList = [
          { x: 4.9, y: 0, z: -2, name: '综合配线屏', rotation: Math.PI / 2 },
          { x: 5.55, y: 0, z: -2, name: '光纤配线配1', rotation: Math.PI / 2 },
          { x: 6.2, y: 0, z: -2, name: '通信设备屏3', rotation: Math.PI / 2 },
          { x: 6.85, y: 0, z: -2, name: '通信设备屏2', rotation: Math.PI / 2 },
          { x: 7.5, y: 0, z: -2, name: '通信设备屏1', rotation: Math.PI / 2 },

          { x: 2.3, y: 0, z: -0.5, name: 'I段交流馈线屏2', rotation: -Math.PI / 2 },
          { x: 2.95, y: 0, z: -0.5, name: 'I段交流馈线屏1', rotation: -Math.PI / 2 },
          { x: 3.6, y: 0, z: -0.5, name: 'I段交流馈线屏1', rotation: -Math.PI / 2 },
          { x: 4.25, y: 0, z: -0.5, name: 'II段交流进线屏', rotation: -Math.PI / 2 },
          { x: 4.9, y: 0, z: -0.5, name: 'II段交流馈线屏1', rotation: -Math.PI / 2 },
          { x: 5.55, y: 0, z: -0.5, name: 'II段交流馈线屏2', rotation: -Math.PI / 2 },
          { x: 6.2, y: 0, z: -0.5, name: 'UPS电源屏1', rotation: -Math.PI / 2 },
          { x: 6.85, y: 0, z: -0.5, name: 'UPS电源屏2', rotation: -Math.PI / 2 },
          { x: 7.5, y: 0, z: -0.5, name: '事故照明屏', rotation: -Math.PI / 2 },

          { x: 2.3, y: 0, z: 1, name: 'II段通信电源屏', rotation: Math.PI / 2 },
          { x: 2.95, y: 0, z: 1, name: 'I段通信电源屏', rotation: Math.PI / 2 },
          { x: 3.6, y: 0, z: 1, name: 'II段直流馈线屏2', rotation: Math.PI / 2 },
          { x: 4.25, y: 0, z: 1, name: 'II段直流馈线屏1', rotation: Math.PI / 2 },
          { x: 4.9, y: 0, z: 1, name: 'II段直流充电屏', rotation: Math.PI / 2 },
          { x: 5.55, y: 0, z: 1, name: 'I/II段直流联络屏', rotation: Math.PI / 2 },
          { x: 6.2, y: 0, z: 1, name: 'I段直流充电屏', rotation: Math.PI / 2 },
          { x: 6.85, y: 0, z: 1, name: 'I段直流馈线屏1', rotation: Math.PI / 2 },
          { x: 7.5, y: 0, z: 1, name: 'I段直流馈线屏2', rotation: Math.PI / 2 },

          { x: 1, y: 0, z: 2.5, name: '过电压智能感知在线监测屏', rotation: -Math.PI / 2 },
          { x: 1.65, y: 0, z: 2.5, name: '220kV线路电能表屏1', rotation: -Math.PI / 2 },
          { x: 2.3, y: 0, z: 2.5, name: '主变电能表屏', rotation: -Math.PI / 2 },
          { x: 2.95, y: 0, z: 2.5, name: '110kV线路电能表屏', rotation: -Math.PI / 2 },
          { x: 3.6, y: 0, z: 2.5, name: '10kV母差保护屏', rotation: -Math.PI / 2 },
          { x: 4.25, y: 0, z: 2.5, name: '110kV过程层中心交换机屏', rotation: -Math.PI / 2 },
          { x: 4.9, y: 0, z: 2.5, name: '110kV故障录波器屏', rotation: -Math.PI / 2 },
          { x: 5.55, y: 0, z: 2.5, name: '主变故障录波器', rotation: -Math.PI / 2 },
          { x: 6.2, y: 0, z: 2.5, name: '10kV低频低压减载屏', rotation: -Math.PI / 2 },
          { x: 6.85, y: 0, z: 2.5, name: '消弧线圈控制屏', rotation: -Math.PI / 2 },
          { x: 7.5, y: 0, z: 2.5, name: '公用测控屏', rotation: -Math.PI / 2 },

          { x: 1, y: 0, z: 4, name: '保护专网光配屏', rotation: Math.PI / 2 },
          { x: 4.9, y: 0, z: 4, name: '#1主变测控屏', rotation: Math.PI / 2 },
          { x: 5.55, y: 0, z: 4, name: '#1主变保护B屏', rotation: Math.PI / 2 },
          { x: 6.2, y: 0, z: 4, name: '#1主变保护A屏', rotation: Math.PI / 2 },
          { x: 6.85, y: 0, z: 4, name: '智能辅助控制系统屏2', rotation: Math.PI / 2 },
          { x: 7.5, y: 0, z: 4, name: '智能辅助控制系统屏1', rotation: Math.PI / 2 },

          { x: 1, y: 0, z: 5.5, name: '监控主机屏', rotation: -Math.PI / 2 },
          { x: 1.65, y: 0, z: 5.5, name: '综合应用服务器屏', rotation: -Math.PI / 2 },
          { x: 2.3, y: 0, z: 5.5, name: '调度数据网设备屏1', rotation: -Math.PI / 2 },
          { x: 2.95, y: 0, z: 5.5, name: '调度数据网设备屏2', rotation: -Math.PI / 2 },
          { x: 3.6, y: 0, z: 5.5, name: 'I/II区数据通信网关机屏1', rotation: -Math.PI / 2 },
          { x: 4.25, y: 0, z: 5.5, name: 'I/II区数据通信网关机屏2', rotation: -Math.PI / 2 },
          { x: 4.9, y: 0, z: 5.5, name: '110kV站控层设备屏1', rotation: -Math.PI / 2 },
          { x: 5.55, y: 0, z: 5.5, name: '110kV站控层设备屏2', rotation: -Math.PI / 2 },
          { x: 6.2, y: 0, z: 5.5, name: '网络报文记录分析系统屏1', rotation: -Math.PI / 2 },
          { x: 6.85, y: 0, z: 5.5, name: '网络报文记录分析系统屏2', rotation: -Math.PI / 2 },
          { x: 7.5, y: 0, z: 5.5, name: '变电站时间同步系统主机屏', rotation: -Math.PI / 2 }
        ]
      }
      this.positionList.map(item => {
        const obj = this.gltfM.clone()
        obj.position.x = item.x - 4.5
        obj.position.y = item.y + 0.02
        obj.position.z = item.z - 3.5
        obj.rotation.y = item.rotation
        obj.scale.set(0.8, 0.8, 0.8)
        // 克隆模型B的材质
        obj.traverse(function(child) {
          if (child.isMesh) {
            child.material = child.material.clone()
            child.name = child.name + '-----------' + item.x
          }
        })
        groupGlb.add(obj)
        // this.scene.add(textSprite)
        // 创建文本B
        // 创建文本A
        const textA = this.createText(item.name, 0xff0000)
        obj.add(textA)
        textA.position.set(-0.31, 2.225, 0.01)
        textA.rotation.y = -Math.PI / 2
        textA.scale.set(0.055, 0.055, 0.055)
      })
      this.objectsToRemove.push(groupGlb)
      this.scene.add(groupGlb)
    },
    /**
     * 加载/切换模型总入口
    */
    loadModel(val) {
      // console.log(val)
      this.clearModel()
      this.loadWall()
      this.loadGltf(val)
      console.log('-----------------------------', this.scene)
    },
    /**
     * threejs初始化
    */
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
        window.innerWidth / window.innerHeight,
        0.1, +22.58 +
        1000
      )
      // 设置相机位置
      this.camera.position.set(0, 10, 10)
      this.scene.add(this.camera)
      this.camera.lookAt(0, 0, 0)

      /**
       * 3.光
       */
      // 环境光
      const light = new THREE.AmbientLight(0x404040) // soft white light
      this.scene.add(light)
      // 平行光
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(0, 0, -100)
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight1.position.set(0, 0, 100)
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight2.position.set(100, 0, 0)
      const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight3.position.set(-100, 0, 0)
      const directionalLight4 = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight4.position.set(0, 40, 0)
      const directionalLight5 = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight5.position.set(0, -40, 0)
      this.scene.add(directionalLight)
      this.scene.add(directionalLight1)
      this.scene.add(directionalLight2)
      this.scene.add(directionalLight3)
      this.scene.add(directionalLight4)
      this.scene.add(directionalLight5)

      // 坐标轴辅助器
      // const axesHelper = new THREE.AxesHelper(5)
      // this.scene.add(axesHelper)

      // 加载gltf模型，保存为变量
      const loader = new GLTFLoader()
      loader.load('home9.glb', (gltf) => {
        console.log('000000000000000000000000', gltf)
        this.gltfM = gltf.scene
        this.loadModel('1')
      }, err => {
        console.log(err)
      })

      // 初始化渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
      })
      // 设置渲染的尺寸和大小
      this.renderer.setSize(this.$refs.three.clientWidth,
        this.$refs.three.clientHeight)

      // 将webgl渲染的canvas内容添加到页面
      document.getElementById('canvas').appendChild(this.renderer.domElement)

      // 创建轨道控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)

      // 使用渲染器，通过相机将场景渲染进来
      this.render()
      this.renderResize()
      this.mouseClick()
    },
    /**
     * 自适应浏览器大小
    */
    renderResize() {
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
    },
    /**
     * 鼠标点击模型后的一系列需求
    */
    mouseClick() {
      var raycaster = new THREE.Raycaster()
      var mouse = new THREE.Vector2()
      this.renderer.domElement.addEventListener('click', event => {
        // console.log('点击了', gltfName);
        const getBoundingClientRect = this.$refs.three.getBoundingClientRect()
        // console.log(getBoundingClientRect)
        mouse.x =
              ((event.clientX - getBoundingClientRect.left) /
                this.$refs.three.clientWidth) *
                2 -
              1
        mouse.y =
              -(
                (event.clientY - getBoundingClientRect.top) /
                this.$refs.three.clientHeight
              ) *
                2 +
              1
        raycaster.setFromCamera(mouse, this.camera)
        var intersects = raycaster.intersectObjects(
          this.scene.children,
          true
        )
        if (intersects.length > 0) {
          var obj = intersects[0].object
          console.log(obj)

          if (obj.name.includes('开关柜')) {
            this.reset()
            this.selectedMeshList = []
            this.newSelectedMeshList = []
            // console.log(obj.parent.parent.parent)
            // 先进行还原
            // this.restore();
            // console.log(obj.parent)
            obj.parent.children.map(mesh => {
              this.selectedMeshList.push({
                uuid: mesh.uuid,
                material: mesh.material.clone()
              })
              mesh.material.color.set(0xffee00)
              this.newSelectedMeshList.push(mesh)
            })
            // console.log(this.selectedMeshList)
          }
        }
      })
    },
    /**
     * 还原所有被点击过的模型颜色
    */
    reset() {
      if (this.newSelectedMeshList.length > 0) {
        // this.newSelectedMeshList = JSON.parse(JSON.stringify(this.selectedMeshList))
        for (let i = 0; i < this.newSelectedMeshList.length; i++) {
          for (let j = 0; j < this.selectedMeshList.length; j++) {
            if (this.newSelectedMeshList[i].uuid === this.selectedMeshList[j].uuid) {
              // console.log('发现匹配并替换')
              this.newSelectedMeshList[i].material = this.selectedMeshList[j].material
              break
            }
          }
        }
      }
    },
    /**
     * 一直渲染
    */
    render() {
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.render)
      this.controls.update()
    },
    /**
     * 创建文本canvas，并作为纹理贴到PlaneGeometry上，返回mesh
    */
    createText(text, color) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const fontSize = 40
      context.font = `${fontSize}px Arial`
      const textWidth = context.measureText(text).width
      canvas.width = textWidth + 10
      canvas.height = fontSize + 10
      context.font = `${fontSize}px Arial`
      context.fillStyle = `#${color.toString(16)}`
      context.fillText(text, 5, fontSize + 5)

      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true

      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
      const geometry = new THREE.PlaneGeometry(textWidth / fontSize, 1)
      const mesh = new THREE.Mesh(geometry, material)
      mesh.name = '设备柜名称：' + text

      return mesh
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area {
  position: relative;
  #canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
