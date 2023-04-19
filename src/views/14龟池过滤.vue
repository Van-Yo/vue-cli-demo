<template>
  <div class="container-area">
    <div id="canvas" />
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
      scene: null,
      camera: null,
      renderer: null,
      raycaster: null,
      mouse: null,
      group1: null,
      group2: null,
      timer: null
    }
  },
  created() {
    // 声明raycaster和mouse变量
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
  },
  mounted() {
    this.init()
    window.addEventListener('click', this.onMouseClick, false)
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
        0.1, +22.58 +
        1000
      )
      // 设置相机位置
      this.camera.position.set(5, 5, 5)
      this.scene.add(this.camera)

      /**
       * 3.添加物体
       */
      // 创建几何体

      this.group1 = new THREE.Group()
      const geometry1 = new THREE.BoxGeometry(4.15, 3.1, 0.05)
      // 创建材质
      const material1 = new THREE.MeshStandardMaterial({ color: 0xffffff })
      // 根据几何体和材质创建物体
      const cube1 = new THREE.Mesh(geometry1, material1)
      cube1.name = 'box1'
      cube1.rotation.set(Math.PI / 2, 0, 0)
      console.log(cube1.clone())
      this.group1.add(cube1)

      const geometry2 = new THREE.BoxGeometry(4.15, 1.45, 0.05)
      // 创建材质
      const material2 = new THREE.MeshStandardMaterial({ color: 0xffffff })
      // 根据几何体和材质创建物体
      const cube2 = new THREE.Mesh(geometry2, material2)
      cube2.name = 'box2'
      cube2.position.y = 0.725
      cube2.position.z = 1.55
      this.group1.add(cube2)

      const geometry3 = new THREE.BoxGeometry(4.15, 1.45, 0.05)
      // 创建材质
      const material3 = new THREE.MeshStandardMaterial({ color: 0xffffff })
      // 根据几何体和材质创建物体
      const cube3 = new THREE.Mesh(geometry3, material3)
      cube3.name = 'box3'
      cube3.position.y = 0.725
      cube3.position.z = -1.55
      this.group1.add(cube3)

      const geometry4 = new THREE.BoxGeometry(3.1, 1.45, 0.05)
      // 创建材质
      const material4 = new THREE.MeshStandardMaterial({ color: 0xffffff })
      // 根据几何体和材质创建物体
      const cube4 = new THREE.Mesh(geometry4, material4)
      cube4.name = 'box4'
      cube4.position.x = 2.075
      cube4.position.y = 0.725
      cube4.rotation.set(0, Math.PI / 2, 0)
      this.group1.add(cube4)

      const geometry5 = new THREE.BoxGeometry(3.1, 1.45, 0.05)
      // 创建材质
      const material5 = new THREE.MeshStandardMaterial({ color: 0xffffff })
      // 根据几何体和材质创建物体
      const cube5 = new THREE.Mesh(geometry5, material5)
      cube5.name = 'box5cube5'
      cube5.position.x = -2.075
      cube5.position.y = 0.725
      cube5.rotation.set(0, Math.PI / 2, 0)
      this.group1.add(cube5)
      this.group1.scale.set(2, 2, 2)
      // 将物体添加到场景中
      this.scene.add(this.group1)

      // 水
      const waterGeometry = new THREE.BoxGeometry(4.05, 3, 0.6)
      // 创建材质
      const waterMaterial = new THREE.MeshStandardMaterial({ color: 0x7cfc00, transparent: true, opacity: 0.2 })
      // 根据几何体和材质创建物体
      const waterCube = new THREE.Mesh(waterGeometry, waterMaterial)
      waterCube.name = 'water'
      waterCube.rotation.set(Math.PI / 2, 0, 0)
      waterCube.scale.set(2, 2, 2)
      waterCube.position.y = 0.7
      this.scene.add(waterCube)

      const loader = new GLTFLoader()
      console.log('loader', loader)

      // loader.load('scene.gltf', (gltf) => {
      //   console.log('222222222222', gltf.scene)
      //   gltf.scene.scale.set(0.13, 0.13, 0.13)
      //   // gltf.scene.position.y = 2.3
      //   // gltf.scene.position.x = -2.075
      //   // gltf.scene.position.y = 2.3
      //   gltf.scene.position.set(-3.25, 2.1, -2.1)
      //   this.scene.add(gltf.scene)
      // }, err => {
      //   console.log(err)
      // })

      loader.load('stone_altar/scene.gltf', (gltf) => {
        console.log('3333333333', gltf.scene)
        gltf.scene.scale.set(0.01, 0.01, 0.01)
        // gltf.scene.position.y = 2.3
        // gltf.scene.position.x = -2.075
        // gltf.scene.position.y = 2.3
        // gltf.scene.position.set(-3.2, 2.1, -1.85)
        this.scene.add(gltf.scene)
      }, err => {
        console.log(err)
      })

      loader.load('cartoon_turtle/scene.gltf', (gltf) => {
        console.log('4444444444444', gltf.scene)
        // gltf.scene.scale.set(0.01, 0.01, 0.01)
        gltf.scene.position.y = 0.98
        gltf.scene.position.x = 1.575
        // gltf.scene.position.y = 2.3
        // gltf.scene.position.set(-3.2, 2.1, -1.85)
        gltf.scene.rotateZ(-Math.PI / 4)
        this.scene.add(gltf.scene)
      }, err => {
        console.log(err)
      })
      // 过滤
      this.group2 = new THREE.Group()
      const machine = new THREE.BoxGeometry(0.6, 0.6, 0.8)
      // 创建材质
      const machineMaterial1 = new THREE.MeshStandardMaterial({ color: 0xffffff })
      // 根据几何体和材质创建物体
      const machineCube = new THREE.Mesh(machine, machineMaterial1)
      machineCube.name = 'machine'
      machineCube.rotation.set(Math.PI / 2, 0, 0)
      machineCube.position.y = 0.5
      machineCube.position.x = 3.75
      machineCube.position.z = 2.65
      // console.log(cube1.clone())
      this.group2.add(machineCube)

      const filterBox1 = new THREE.BoxGeometry(1.4, 0.6, 2)
      // 创建材质
      const filterBoxMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff })
      // 根据几何体和材质创建物体
      const filterBoxCube1 = new THREE.Mesh(filterBox1, filterBoxMaterial)
      filterBoxCube1.name = 'filterBox1'
      filterBoxCube1.position.set(-3.4, 1.2, -2.1)
      const filterBoxCube2 = filterBoxCube1.clone()
      filterBoxCube2.position.set(-3.4, 1.82, -2.1)
      this.group2.add(filterBoxCube1, filterBoxCube2)

      /**
       * 创建一个设置重复纹理的管道
       */
      // var curve = new THREE.CatmullRomCurve3([
      //   new THREE.Vector3(3.75, 1, 2.65),
      //   new THREE.Vector3(3.75, 4, 2.65),
      //   new THREE.Vector3(-3.4, 4, -2.1),
      //   new THREE.Vector3(-3.4, 2, -2.1)
      // ])
      // var tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.05, 50, false)
      // var textureLoader = new THREE.TextureLoader()
      // var texture = textureLoader.load('water.jpg')
      // // 设置阵列模式为 RepeatWrapping
      // texture.wrapS = THREE.RepeatWrapping
      // texture.wrapT = THREE.RepeatWrapping
      // // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
      // // 等价texture.repeat= new THREE.Vector2(20,1)
      // texture.repeat.x = 60
      // var tubeMaterial = new THREE.MeshPhongMaterial({
      //   map: texture,
      //   transparent: true,
      //   opacity: 0.8
      // })
      // this.timer = setInterval(() => {
      //   texture.offset.x -= 0.1
      // }, 100)
      // const tubeCube = new THREE.Mesh(tubeGeometry, tubeMaterial)
      // this.group2.add(tubeCube)

      this.scene.add(this.group2)

      // 环境光
      const light = new THREE.AmbientLight(0x404040) // soft white light
      this.scene.add(light)
      // 平行光
      const directionalLight = new THREE.DirectionalLight(0xffffff)
      directionalLight.position.set(0, 5, -10)
      this.scene.add(directionalLight)

      /**
       * 底部平面
       */
      // const gridHelper = new THREE.GridHelper(10, 10)
      // gridHelper.material.opacity = 0.3
      // gridHelper.material.transparent = true
      // this.scene.add(gridHelper)

      // 坐标轴辅助器
      // const axesHelper = new THREE.AxesHelper(5)
      // this.scene.add(axesHelper)

      // 初始化渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
      })
      // 设置渲染的尺寸和大小
      this.renderer.setSize(window.innerWidth, window.innerHeight)

      // this.renderer.domElement.addEventListener('click', (e) => {
      //   console.log(e)
      //   // console.log(this.group1.children[0].material.color)
      //   this.group1.children[0].material = new THREE.MeshStandardMaterial({ color: 0x0000ff })
      //   this.group1.children[1].material = new THREE.MeshStandardMaterial({ color: 0xaa00ee })
      // })
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
    },
    onMouseClick(event) {
      // 通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
      this.raycaster.setFromCamera(this.mouse, this.camera)

      // 获取raycaster直线和所有模型相交的数组集合
      var intersects = this.raycaster.intersectObjects(this.scene.children)
      console.log(intersects)

      if (intersects.length) {
        // 将所有的相交的模型的颜色设置为红色，如果只需要将第一个触发事件，那就数组的第一个模型改变颜色即可
        // this.group1.children[1].material = new THREE.MeshStandardMaterial({ color: 0xaa00ee })
        for (var i = 0; i < this.group1.children.length; i++) {
          this.group1.children[ i ].material.color.set(0xffffff)
        }
        if (intersects[0].object.name.includes('box')) {
          intersects[0].object.material.color.set(0xffee00)
        }
      }
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
