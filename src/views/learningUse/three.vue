<template>
  <div ref="three" class="container-area">
    <div id="canvas" />
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
      gltf: null,
      total: 0,
      selectedMeshList: [],
      newSelectedMeshList: []
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
      this.camera.position.set(5, 5, 0)
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
      // const gui = new dat.GUI()
      // gui.add(cube.position, 'x').min(0).max(5).step(0.01).name('移动x轴')

      // 导入模型
      // const loader = new GLTFLoader()
      // const lineGroup = new THREE.Group()
      // loader.load('./Final2.gltf', gltf => {
      //   console.log(gltf)
      //   this.gltf = gltf
      //   const total = gltf.scene.children.length
      //   this.total = total
      //   // gltf.scene.scale.set(0.021, 0.021, 0.021)
      //   // gltf.scene.position.set(-5, 0, 10)
      //   // gltf.scene.scale.set(0.5, 0.5, 0.5)
      //   this.scene.add(gltf.scene)
      //   gltf.scene.traverse(item => {
      //     if (item.type === 'Mesh') {
      //       // console.log('item', item)
      //       const edges = new THREE.EdgesGeometry(item.geometry)
      //       const lineMaterial = new THREE.MeshPhongMaterial({
      //         color: 0xffffff
      //       })
      //       const worldPosition = new THREE.Vector3()
      //       item.getWorldPosition(worldPosition)
      //       // console.log(item.parent.children.length);
      //       const line = new THREE.LineSegments(edges, lineMaterial)
      //       if (item.parent.children.length !== total) {
      //         line.scale.copy(item.parent.parent.scale)
      //         line.rotation.copy(item.parent.rotation)
      //         line.position.copy(worldPosition)
      //       } else {
      //         line.scale.copy(item.parent.scale)
      //         line.rotation.copy(item.rotation)
      //         line.position.copy(worldPosition)
      //       }

      //       lineGroup.add(line)
      //     }
      //   })
      //   this.scene.add(lineGroup)
      // })

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
      // window.addEventListener('dblclick', () => {
      //   // console.log('双击')
      //   const fullScreenElement = document.fullscreenElement
      //   if (fullScreenElement) {
      //     document.exitFullscreen()
      //   } else {
      //     this.renderer.domElement.requestFullscreen()
      //   }
      // })
      this.renderer.domElement.addEventListener('click', this.onMouseClick, false)
    },
    onMouseClick(event) {
      const getBoundingClientRect = this.$refs.three.getBoundingClientRect()
      // 通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
      this.mouse.x = ((event.clientX - getBoundingClientRect.left) / this.$refs.three.clientWidth) * 2 - 1
      this.mouse.y = -((event.clientY - getBoundingClientRect.top) / this.$refs.three.clientHeight) * 2 + 1

      // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
      this.raycaster.setFromCamera(this.mouse, this.camera)

      // 获取raycaster直线和所有模型相交的数组集合
      // var intersects = this.raycaster.intersectObjects(this.gltf.scene.children, true)
      var intersects = []
      // console.log(intersects)

      if (intersects.length) {
        var obj = intersects[0].object
        // console.log('-------', obj)
        this.reset()
        this.selectedMeshList = []
        this.newSelectedMeshList = []
        if (obj.parent.children.length === this.total) {
          this.selectedMeshList.push({
            uuid: obj.uuid,
            material: obj.material.clone()
          })
          obj.material = obj.material.clone()
          obj.material.color.set('#00ffff')
          obj.material.transparent = true
          obj.material.opacity = 0.1
          this.newSelectedMeshList.push(obj)
        } else {
          obj.parent.children.map(child => {
            this.selectedMeshList.push({
              uuid: child.uuid,
              material: child.material.clone()
            })
            child.material = child.material.clone()
            child.material.color.set('#00ffff')
            child.material.transparent = true
            child.material.opacity = 0.1
            this.newSelectedMeshList.push(child)
          })
        }
      }
    },
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
