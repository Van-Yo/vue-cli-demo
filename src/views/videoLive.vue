<template>
  <div class="container-area">
    <el-button type="primary" @click="play">播放视频</el-button>
    <el-button type="primary" :disabled="canvasShowFlag" @click="openCtx">开启绘画</el-button>
    <el-button type="primary" :disabled="!canvasShowFlag" @click="closeCtx">关闭绘画</el-button>
    <div id="main" ref="videoElement" class="video-element">
      <VideoCom :video-url="videoUrl" />
      <canvas
        v-if="canvasShowFlag"
        id="myCanvas"
        ref="myCanvas"
        class="video-model"
        @mousedown="mousedown"
        @mouseup="mouseup"
        @mousemove="mousemove"
      />
    </div>
  </div>
</template>

<script>
// 分包
const VideoCom = () => import(/* webpackChunkName: "VideoCom" */ '@/components/VideoCom')
import elementResizeDetectorMaker from 'element-resize-detector'
export default {
  components: {
    VideoCom
  },
  data() {
    return {
      videoUrl: '',
      canvasShowFlag: false,
      mouseDownFlag: false,
      x: '',
      y: ''
    }
  },
  created() {},
  mounted() {
    this.resizeCanvas()
  },
  methods: {
    play() {
      this.videoUrl = 'https://218.94.141.148:9010/XH866437053791742/1.flv'
    },
    /**
     * 3D控球：鼠标落下
     */
    mousedown(e) {
      // console.log('鼠标落下');
      this.mouseDownFlag = true
      this.x = e.offsetX // 鼠标落下时的X
      this.y = e.offsetY // 鼠标落下时的Y
      // console.log(this.x, this.y);
    },
    /**
     * 3D控球：鼠标抬起
     */
    mouseup(e) {
      // console.log('鼠标抬起');
      // console.log(e.offsetX, e.offsetY);
      this.mouseDownFlag = false
      // const canvas = document.getElementById(
      //   'myCanvas'
      // )
      // var ctx = canvas.getContext('2d')

      // ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (this.x !== e.offsetX && this.y !== e.offsetY) {
        console.log('拖动了')
        console.log(this.x, this.y, e.offsetX, e.offsetY)
        // const device = this.flvPlayersList[this.avtiveVideoIndex]
        // if (device) {
        //   const obj = {
        //     deviceId: device.deviceId,
        //     channelNo: device.channelNo,
        //     startX: (this.x * 255) / canvas.width,
        //     startY: 255 - (e.offsetY * 255) / canvas.height,
        //     endX: (e.offsetX * 255) / canvas.width,
        //     endY: 255 - (this.y * 255) / canvas.height
        //   }
        //   // console.log(obj);
        //   camera3DControl(obj).then(res => {
        //     // console.log(res);
        //   })
        // } else {
        //   this.$message.error('请先选择设备')
        // }
      }
    },
    /**
     * 3D控球：鼠标移动
     */
    mousemove(e) {
      this.drawRect(e)
    },
    /**
     * 3D控球：canvas绘矩形
     */
    drawRect(e) {
      if (this.mouseDownFlag) {
        const canvas = document.getElementById(
          'myCanvas'
        )
        var ctx = canvas.getContext('2d')
        const x = this.x
        const y = this.y

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()

        // 设置线条颜色，必须放在绘制之前
        ctx.strokeStyle = 'red'
        // 线宽设置，必须放在绘制之前
        ctx.lineWidth = 4

        ctx.strokeRect(x, y, e.offsetX - x, e.offsetY - y)
      }
    },
    resizeCanvas() {
      // 监听视频位div大小，动态调整canvas大小
      const domAresize = elementResizeDetectorMaker()
      domAresize.listenTo(this.$refs.videoElement, element => {
        if (this.canvasShowFlag) {
          this.getVideoWidthHeight('myCanvas')
        }
      })
    },
    /**
     * 获取视频容器的宽高,并设置canvas宽高
     */
    getVideoWidthHeight(canvasId) {
      const node = document.getElementById('main')
      const canvas = document.getElementById(canvasId)
      canvas.width = node.clientWidth
      canvas.height = node.clientHeight
    },
    // 开启canvas
    openCtx() {
      this.canvasShowFlag = true
      this.$nextTick(() => {
        this.getVideoWidthHeight('myCanvas')
      })
    },
    // 关闭canvas
    closeCtx() {
      this.canvasShowFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area{
  .video-element{
    width: 50%;
    height: auto;
    position: relative;
    .video-model {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 2001;
      background: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
