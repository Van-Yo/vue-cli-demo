<template>
  <div class="home-wrap">
    <!--左边  -->
    <div class="left-container">
      <div class="info-wrap">
        <div class="item-wrap">
          <div class="panel">
            <div class="icon" style="background-color: rgb(232, 64, 60)">
              <svg-icon icon-class="temperature" />
            </div>
            <div class="info">
              <el-progress
                :percentage="numbers.a"
                :stroke-width="10"
                :show-text="false"
                color="rgb(232, 64, 60)"
              />
              <!-- <p style="margin-top: 8px">我也不知道这里展示什么</p> -->
            </div>
            <div class="text">温度：{{ numbers.a }}℃</div>
          </div>
        </div>
        <div class="item-wrap">
          <div class="panel">
            <div class="icon" style="background-color: rgb(252, 149, 12)">
              <svg-icon icon-class="oil-temperature" />
            </div>
            <div class="info">
              <el-progress
                :percentage="numbers.b"
                :stroke-width="10"
                :show-text="false"
                color="rgb(252, 149, 12)"
              />
              <!-- <p style="margin-top: 8px">我也不知道这里展示什么</p> -->
            </div>
            <div class="text">湿度：{{ numbers.b }}℃</div>
          </div>
        </div>
        <div class="item-wrap">
          <div class="panel">
            <div class="icon" style="background-color: rgb(31, 217, 241)">
              <svg-icon icon-class="experiment-fill" />
            </div>
            <div class="info">
              <el-progress
                :percentage="numbers.c"
                :stroke-width="10"
                :show-text="false"
                color="rgb(31, 217, 241)"
              />
              <!-- <p style="margin-top: 8px">我也不知道这里展示什么</p> -->
            </div>
            <div class="text">六氟化硫：{{ numbers.c }}mg/m³</div>
          </div>
        </div>
        <div class="item-wrap">
          <div class="panel">
            <div class="icon" style="background-color: rgb(77, 168, 81)">
              <svg-icon icon-class="sound-fill" />
            </div>
            <div class="info">
              <el-progress
                :percentage="numbers.d"
                :stroke-width="10"
                :show-text="false"
                color="rgb(77, 168, 81)"
              />
              <!-- <p style="margin-top: 8px">我也不知道这里展示什么</p> -->
            </div>
            <div class="text">噪声：{{ numbers.d }}Db</div>
          </div>
        </div>
        <div class="item-wrap">
          <div class="panel">
            <div class="icon" style="background-color: rgb(74, 165, 78)">
              <svg-icon icon-class="Wind-Turbine" />
            </div>
            <div class="info">
              <el-progress
                :percentage="numbers.e"
                :stroke-width="10"
                :show-text="false"
                color="rgb(74, 165, 78)"
              />
              <!-- <p style="margin-top: 8px">我也不知道这里展示什么</p> -->
            </div>
            <div class="text">风机：{{ numbers.e }}rpm</div>
          </div>
        </div>
      </div>
      <!-- three,js -->
      <div ref="three" class="three">
        <canvas id="three" />
      </div>
    </div>
    <!-- 右边 -->
    <div class="right-container">
      <div class="right-top">
        <div class="cell c1">
          <svg-icon icon-class="home-fill" />
          <span>配电柜1</span>
        </div>
        <div class="cell c2">
          <svg-icon icon-class="home-fill" />
          <span>配电柜2</span>
        </div>
        <div class="cell c3">
          <svg-icon icon-class="home-fill" />
          <span>配电柜3</span>
        </div>
        <div class="cell c4">
          <svg-icon icon-class="home-fill" />
          <span>配电柜4</span>
        </div>
        <div class="cell c5">
          <svg-icon icon-class="home-fill" />
          <span>配电柜5</span>
        </div>
      </div>
      <div class="right-bottom">
        <div class="chart-wrap">
          <div class="chart-bg">
            <div ref="chart1" class="chart" />
            <div class="info">电压：XXXkV 电流：XXXkA</div>
          </div>
        </div>
        <div class="chart-wrap">
          <div class="chart-bg">
            <div ref="chart2" class="chart" />
            <div class="info">电压：XXXkV 电流：XXXkA</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import mqtt from 'mqtt'
export default {
  name: 'Home',
  data() {
    return {
      numbers: {
        a: 50,
        b: 50,
        c: 50,
        d: 50,
        e: 50
      },
      scene: null, // 场景
      camera: null, // 相机
      renderer: null, // 渲染器
      controls: null, // 控制
      total: 0,
      selectObj: null,
      orgAll: [], // uuid+material
      selectArr: [], // uuid+material
      composer: null,
      outlinePass: null,
      renderPass: null,
      // 基础描边效果
      line: {
        composer: null,
        outlinePass: null,
        renderPass: null
      },
      connection: {
        host: '10.10.1.129',
        port: 8083,
        endpoint: '/mqtt',
        clean: true, // 保留会话
        connectTimeout: 10000, // 超时时间
        reconnectPeriod: 10000, // 重连时间间隔
        // 认证信息
        clientId: new Date().getTime() + 'test',
        username: '',
        password: ''
      },
      subscription: {
        topic: 'test',
        qos: 0
      },
      publish: {
        topic: 'test',
        qos: 0,
        payload: 'res:{}'
      },
      receiveData: [],
      connected: false,
      subscribeSuccess: false
    }
  },
  created() {},
  mounted() {
    this.initThree()
    this.animate()
    this.initChart()
    this.initeMqtt()
    this.$nextTick(() => {
      this.mockPushMq()
    })
  },
  methods: {
    initThree() {
      /* 创建场景 */
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0x293846)
      /* 创建摄像机 */
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.$refs.three.clientWidth / this.$refs.three.clientHeight,
        1,
        3000
      )
      this.camera.position.set(0, 120, 100)
      this.camera.lookAt(this.scene.position)
      /* 创建光源 */
      // 环境光会均匀的照亮场景中的所有物体。环境光不能用来投射阴影，因为它没有方向。
      const light = new THREE.AmbientLight(0xffffff, 1) // soft white light
      this.scene.add(light)
      /* 创建渲染器 */
      const canvas = document.querySelector('#three')
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(
        this.$refs.three.clientWidth,
        this.$refs.three.clientHeight
      )
      this.renderer.shadowMap.enabled = true // 渲染器开启阴影渲染
      this.renderer.render(this.scene, this.camera)

      /* control */
      this.controls = new OrbitControls(this.camera, canvas)
      this.controls.target.set(0, 25, 0)
      // this.controls.autoRotate = true
      this.controls.autoRotateSpeed = 3
      this.controls.update()

      /* 创建地面和网格 */
      // 地面
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(153, 87),
        new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: false })
      )
      ground.rotation.x = -Math.PI / 2
      ground.receiveShadow = true
      // this.scene.add(ground)
      // 网格
      const grid = new THREE.GridHelper(170, 20, 0x293846, 0x293846)
      grid.material.opacity = 0.2
      grid.material.transparent = true
      // this.scene.add(grid)

      // 导入模型
      const loader = new GLTFLoader()
      const lineGroup = new THREE.Group()
      loader.load(
        './机房东6.gltf',
        (gltf) => {
          // console.log(gltf.scene)
          const total = gltf.scene.children.length
          this.total = total
          gltf.scene.scale.set(10, 10, 10)
          gltf.scene.traverse((item) => {
            // 每个child全部拷贝到orgall

            // 绘制描边
            if (item.isMesh === true && item.children.length === 0) {
              this.orgAll.push({
                uuid: item.uuid,
                material: item.material.clone()
              })
              item.material.opacity = 0.2
              item.material.transparent = true
              const edges = new THREE.EdgesGeometry(item.geometry)
              // const lineMaterial = new THREE.LineBasicMaterial({
              //   color: 0xffffff,
              //   linewidth: 5
              // })
              const lineMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff
              })
              const worldPosition = new THREE.Vector3()
              item.getWorldPosition(worldPosition)
              const line = new THREE.LineSegments(edges, lineMaterial)
              line.name = 'line'
              if (item.parent.children.length !== total) {
                line.scale.copy(item.parent.parent.scale)
                line.rotation.copy(item.parent.rotation)
                line.position.copy(worldPosition)
              } else {
                line.scale.copy(item.parent.scale)
                line.rotation.copy(item.rotation)
                line.position.copy(worldPosition)
              }
              item.add(line)

              lineGroup.add(line)
            }
          })
          this.scene.add(gltf.scene)
          this.scene.add(lineGroup)

          var raycaster = new THREE.Raycaster()
          var mouse = new THREE.Vector2()
          this.renderer.domElement.addEventListener('click', (event) => {
            const getBoundingClientRect =
              this.$refs.three.getBoundingClientRect()
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
              gltf.scene.children,
              true
            )
            if (intersects.length > 0) {
              // 先进行还原
              this.restore()
              var obj = intersects[0].object
              console.log('-------', obj)
              // console.log('*******', this.selectObj)
              if (obj.parent.children.length === total) {
                obj.material = obj.material.clone()
                obj.material.color.set('#00ffff')
                obj.material.transparent = true
                obj.material.opacity = 0.1
                obj.material.needsUpdate = true
                this.selectArr.push(obj)
                // this.outlineObj(this.selectArr)
              } else {
                obj.parent.children.map((child) => {
                  child.material = child.material.clone()
                  child.material.color.set('#00ffff')
                  child.material.transparent = true
                  child.material.opacity = 0.1
                  obj.material.transparent = true
                  obj.material.opacity = 0.1
                  obj.material.needsUpdate = true
                  this.selectArr.push(child)
                })
                // this.outlineObj(this.selectArr)
              }
            }
          })
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% 已载入')
        },
        (err) => {
          console.log('载入出错', err.target.status)
        }
      )

      window.addEventListener('resize', () => {
        this.camera.aspect =
          this.$refs.three.clientWidth / this.$refs.three.clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(
          this.$refs.three.clientWidth,
          this.$refs.three.clientHeight
        )
      })
    },
    animate() {
      // 做一些操作
      this.renderer.render(this.scene, this.camera)
      this.controls.update()
      if (this.composer) {
        this.composer.render()
      }
      requestAnimationFrame(this.animate)
    },
    // 还原
    restore() {
      // 有选中ids
      // console.log('全部备份：', this.orgAll)
      // console.log('之前选中：', this.selectArr)
      if (this.selectArr.length > 0) {
        for (let i = 0; i < this.selectArr.length; i++) {
          for (let j = 0; j < this.orgAll.length; j++) {
            if (this.selectArr[i].uuid === this.orgAll[j].uuid) {
              // console.log('发现匹配并替换')
              this.selectArr[i].material = this.orgAll[j].material
              break
            }
          }
        }
        this.selectArr = []
      }
    },
    // 高亮显示模型（呼吸灯）
    outlineObj(selectedObjects) {
      // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
      this.composer = new EffectComposer(this.renderer)
      // 新建一个场景通道  为了覆盖到原理来的场景上
      this.renderPass = new RenderPass(this.scene, this.camera)
      this.composer.addPass(this.renderPass)
      // 物体边缘发光通道
      this.outlinePass = new OutlinePass(
        // new THREE.Vector2(window.innerWidth, window.innerHeight),
        new THREE.Vector2(
          this.$refs.three.clientWidth,
          this.$refs.three.clientHeight
        ),
        this.scene,
        this.camera,
        selectedObjects
      )
      this.outlinePass.selectedObjects = selectedObjects
      this.outlinePass.edgeStrength = 10.0 // 边框的亮度
      this.outlinePass.edgeGlow = 1 // 光晕[0,1]
      this.outlinePass.usePatternTexture = false // 是否使用父级的材质
      this.outlinePass.edgeThickness = 1.0 // 边框宽度
      this.outlinePass.downSampleRatio = 1 // 边框弯曲度
      this.outlinePass.pulsePeriod = 1 // 呼吸闪烁的速度
      this.outlinePass.visibleEdgeColor.set(parseInt(0x00ffff)) // 呼吸显示的颜色
      this.outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0) // 呼吸消失的颜色
      this.outlinePass.clear = true
      this.composer.addPass(this.outlinePass)
      // 自定义的着色器通道 作为参数
      var effectFXAA = new ShaderPass(FXAAShader)
      // effectFXAA.uniforms.resolution.value.set(
      //   1 / window.innerWidth,
      //   1 / window.innerHeight
      // )
      effectFXAA.uniforms.resolution.value.set(
        1 / this.$refs.three.clientWidth,
        1 / this.$refs.three.clientHeight
      )

      effectFXAA.renderToScreen = true
      this.composer.addPass(effectFXAA)
    },
    initChart() {
      var myChart1 = this.$echarts.init(this.$refs.chart1)
      var myChart2 = this.$echarts.init(this.$refs.chart2)
      // 配置图表
      var option1 = {
        title: {
          text: '回路1-10KV XXX线路',
          textStyle: {
            color: '#ffffff',
            width: '100%'
          },
          left: 'center',
          top: '12px'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {},
        // legend: {
        //   data: ['销量']
        // },
        xAxis: {
          data: ['11.12', '11.13', '11.14', '11.15', '11.16']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'line',
            data: [1, 5, 2, 5, 0]
          }
        ]
      }
      myChart1.setOption(option1)
      var option2 = {
        title: {
          text: '回路1-10KV XXX线路',
          textStyle: {
            color: '#ffffff',
            width: '100%'
          },
          left: 'center',
          top: '12px'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {},
        // legend: {
        //   data: ['销量']
        // },
        xAxis: {
          data: ['温度', '湿度', '六氟化硫', '噪声', '风机']
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: [5, 20, 36, 10, 10]
          }
        ]
      }
      myChart2.setOption(option2)
      window.addEventListener('resize', () => {
        myChart1.resize()
        myChart2.resize()
      })
    },
    initeMqtt() {
      // 创建连接部分
      const { host, port, endpoint, ...options } = this.connection
      const connectUrl = `mqtt://${host}:${port}${endpoint}`
      try {
        this.client = mqtt.connect(connectUrl, options)
      } catch (error) {
        console.log('mqtt.connect error', error)
      }
      this.client.on('connect', () => {
        console.log('MQ连接成功 Connection succeeded!')
      })
      this.client.on('error', (error) => {
        console.log('MQ连接失败 Connection failed', error)
      })
      this.client.on('message', (topic, message) => {
        console.log(`Received message ${message} from topic ${topic}`)
        this.numbers = JSON.parse(message)
      })
      // 订阅部分
      const { topic, qos } = this.subscription
      this.client.subscribe(topic, qos, (error, res) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        this.subscribeSuccess = true
        console.log('Subscribe to topics res', res)
      })
    },
    // 模拟发送消息
    mockPushMq() {
      setInterval(() => {
        const payload = {
          a: Math.floor(Math.random() * 100 + 1),
          b: Math.floor(Math.random() * 100 + 1),
          c: Math.floor(Math.random() * 100 + 1),
          d: Math.floor(Math.random() * 100 + 1),
          e: Math.floor(Math.random() * 100 + 1)
        }
        const { topic, qos } = this.publish
        this.client.publish(topic, JSON.stringify(payload), qos, (error) => {
          if (error) {
            console.log('Publish error', error)
          }
        })
      }, 10000)
    }
  }
}
</script>
<style lang="scss" scoped>
.home-wrap {
  background-color: rgb(41, 56, 70);
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  color: #ffffff;
  padding: 15px;
  display: flex;
  .left-container {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-right: 25px;
    .info-wrap {
      height: 160px;
      display: flex;
      .item-wrap {
        flex: 1;
        padding-top: 30px;
        padding-left: 10px;
        padding-right: 10px;
        .panel {
          height: 100%;
          width: 100%;
          background-color: rgb(225, 226, 227);
          border-radius: 8px;
          box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.4);
          position: relative;
          padding: 0px 20px 8px 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          .icon {
            position: absolute;
            width: 85px;
            height: 85px;
            left: 20px;
            top: -20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 6px rgba(0, 0, 0, 0.1);
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 50px;
          }
          .info {
            color: #9b9797;
            width: 100%;
            border-top: 2px solid #9b9797;
            padding-top: 12px;
            font-size: 14px;
            padding-bottom: 10px;
          }
          .text {
            position: absolute;
            top: 20px;
            left: 120px;
            color: #9b9797;
            font-size: 20px;
            font-weight: 600;
          }
        }
      }
    }
    .three {
      flex: 1;
      margin: 20px 10px 0 10px;
      position: relative;
      canvas {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
      }
    }
  }
  .right-container {
    width: 20%;
    height: 100%;
    min-width: 300px;
    background-color: rgb(155, 162, 169);
    border-radius: 7px;
    padding: 20px 25px;
    display: flex;
    flex-direction: column;
    .right-top {
      .cell {
        padding: 15px 10px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
        border-radius: 5px;
        display: flex;
        align-items: center;
        color: #ffffff;
        margin-bottom: 20px;
        font-size: 25px;
        span {
          margin-left: 15px;
          font-size: 20px;
          // font-weight: 600;
        }
        &.c1 {
          background-color: rgb(175, 44, 197);
        }
        &.c2 {
          background-color: rgb(245, 90, 78);
        }
        &.c3 {
          background-color: rgb(92, 184, 96);
        }
        &.c4 {
          background-color: rgb(0, 211, 238);
        }
        &.c5 {
          background-color: rgb(255, 162, 26);
        }
      }
    }
    .right-bottom {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 500px;
      .chart-wrap {
        flex: 1;
        padding-top: 40px;
        .chart-bg {
          background-color: rgb(238, 238, 238);
          height: 100%;
          width: 100%;
          border-radius: 7px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4);
          position: relative;
          .chart {
            width: 85%;
            height: 80%;
            position: absolute;
            left: 20px;
            top: -20px;
            background-color: rgb(252, 144, 6);
            border-radius: 7px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 6px rgba(0, 0, 0, 0.1);
          }
          .info {
            position: absolute;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 20px;
            font-weight: 600;
            padding-bottom: 22px;
            color: #9b9797;
          }
        }
        &:last-child {
          padding-top: 60px;
        }
      }
    }
  }
}
</style>
