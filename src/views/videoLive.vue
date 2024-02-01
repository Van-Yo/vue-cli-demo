<template>
  <div class="container-area">
    <div style="display:flex">
      <div style="flex:1;padding:7.5px">
        <div style="display:flex;margin-bottom:15px">
          <el-input v-model="inputUrl" @change="inputChange" />
          <el-button type="primary" style="margin-left:15px" @click="play">播放视频</el-button>
        </div>

        <!-- <el-button type="primary" @click="close">关闭视频</el-button> -->
        <!-- <el-button type="primary" :disabled="canvasShowFlag" @click="openCtx('rect')">开启画方框</el-button>
    <el-button type="primary" :disabled="!canvasShowFlag" @click="closeCtx">关闭绘画</el-button>
    <el-button type="primary" :disabled="canvasShowFlag" @click="openCtx('line')">开启画直线</el-button> -->
        <div id="main" ref="videoElement" class="video-element">
          <VideoCom ref="videoCom" :video-url="videoUrl" @3Dcontrol="rdControl" @closeVideo="closeVideo" />
          <!-- <canvas
        v-if="canvasShowFlag"
        id="myCanvas"
        ref="myCanvas"
        class="video-model"
        @mousedown="mousedown"
        @mouseup="mouseup"
        @mousemove="mousemove"
      /> -->
        </div>
      </div>
      <div style="flex:1;padding:7.5px">
        <div style="display:flex;margin-bottom:15px">
          <el-input v-model="inputUrl2" @change="inputChange2" />
          <el-button type="primary" style="margin-left:15px" @click="play2">播放视频</el-button>
        </div>

        <div id="main2" ref="videoElement2" class="video-element">
          <VideoCom ref="videoCom2" :video-url="videoUrl2" :show-tools="showTools2" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// 分包
const VideoCom = () => import(/* webpackChunkName: "VideoCom" */ '@/components/VideoCom')
// import elementResizeDetectorMaker from 'element-resize-detector'
export default {
  components: {
    VideoCom
  },
  data() {
    return {
      inputUrl: '',
      videoUrl: '',
      inputUrl2: '',
      videoUrl2: '',
      // 视频工具栏配置，如果不传默认全部展示
      showTools2: {
        showCaptureTool: true,
        showRewordTool: true,
        show3DcontrolTool: false
      }
      // canvasShowFlag: false,
      // mouseDownFlag: false,
      // startX: '',
      // startY: '',
      // ctxType: '',
      // endX: '',
      // endY: '',
      // pointRadius: 5
    }
  },
  created() {},
  mounted() {
    // this.resizeCanvas()
  },
  methods: {
    // 输入框修改链接自动开启直播
    inputChange(val) {
      this.videoUrl = val
    },
    inputChange2(val) {
      this.videoUrl2 = val
    },
    // 手动开启直播
    play() {
      this.videoUrl = this.inputUrl
      this.$refs.videoCom.flvRevert(this.videoUrl)
    },
    play2() {
      this.videoUrl2 = this.inputUrl2
      this.$refs.videoCom2.flvRevert(this.videoUrl2)
    },
    /**
     * 视频组件回调
    */
    // 3D控球
    rdControl(val) {
      console.log('父组件收到3D控球指令', val)
    },
    // 关闭视频
    closeVideo() {
      console.log('父组件收到关闭视频')
      // 停止推流
    }
    // 手动关闭直播
    // close() {
    //   this.videoUrl = ''
    //   this.$refs.videoCom.closeFlv()
    // },
    // 开启canvas
    // openCtx(flag) {
    //   this.ctxType = flag
    //   this.canvasShowFlag = true
    //   this.$nextTick(() => {
    //     this.getVideoWidthHeight('myCanvas')
    //   })
    // },
    // 关闭canvas
    // closeCtx() {
    //   this.canvasShowFlag = false
    // },
    /**
     * 鼠标落下
     */
    // mousedown(e) {
    //   // console.log('鼠标落下');
    //   this.mouseDownFlag = true
    //   this.startX = e.offsetX // 鼠标落下时的X
    //   this.startY = e.offsetY // 鼠标落下时的Y
    //   console.log(this.startX, this.startY)
    // },
    /**
     * 鼠标移动
     */
    // mousemove(e) {
    //   if (this.ctxType === 'rect') {
    //     this.drawRect(e)
    //   } else if (this.ctxType === 'line') {
    //     this.drawline(e)
    //   }
    // },
    /**
     * 鼠标抬起
     */
    // mouseup(e) {
    //   this.mouseDownFlag = false
    //   if (this.ctxType === 'rect') {
    //     if (this.startX !== e.offsetX && this.startY !== e.offsetY) {
    //       console.log('拖动了')
    //       console.log(this.startX, this.startY, e.offsetX, e.offsetY)
    //     }
    //   } else if (this.ctxType === 'line') {
    //     this.endX = this.endX || this.startX
    //     this.endY = this.endY || this.startY
    //     console.log(this.startX, this.startY, this.endX, this.endY)
    //     // 只有拖动鼠标才画点
    //     if (this.startX !== this.endX || this.startY !== this.endY) {
    //       this.drawRedPoint(this.startX, this.startY)
    //       this.drawRedPoint(this.endX, this.endY)
    //       // ...接下来操作
    //     }
    //     this.endX = this.endY = undefined
    //   }
    // },
    /**
     * canvas绘直线
     */
    // drawline(e) {
    //   if (this.mouseDownFlag) {
    //     this.endX = e.offsetX
    //     this.endY = e.offsetY
    //     const canvas = document.getElementById(
    //       'myCanvas'
    //     )
    //     var ctx = canvas.getContext('2d')
    //     ctx.clearRect(0, 0, canvas.width, canvas.height)
    //     ctx.strokeStyle = 'red'
    //     ctx.lineWidth = 2
    //     ctx.beginPath()
    //     ctx.moveTo(this.startX, this.startY)
    //     ctx.lineTo(this.endX, this.endY)
    //     ctx.stroke()
    //   }
    // },
    /**
     * canvas绘点
     */
    // drawRedPoint(x, y) {
    //   const canvas = document.getElementById(
    //     'myCanvas'
    //   )
    //   var ctx = canvas.getContext('2d')
    //   ctx.fillStyle = 'red'
    //   ctx.beginPath()
    //   ctx.arc(x, y, this.pointRadius, 0, 2 * Math.PI)
    //   ctx.fill()
    // },
    /**
     * canvas绘矩形
     */
    // drawRect(e) {
    //   if (this.mouseDownFlag) {
    //     const canvas = document.getElementById(
    //       'myCanvas'
    //     )
    //     var ctx = canvas.getContext('2d')
    //     const x = this.startX
    //     const y = this.startY
    //     ctx.clearRect(0, 0, canvas.width, canvas.height)
    //     ctx.beginPath()

    //     // 设置线条颜色，必须放在绘制之前
    //     ctx.strokeStyle = 'red'
    //     // 线宽设置，必须放在绘制之前
    //     ctx.lineWidth = 4

    //     ctx.strokeRect(x, y, e.offsetX - x, e.offsetY - y)
    //   }
    // },
    // resizeCanvas() {
    //   // 监听视频位div大小，动态调整canvas大小
    //   const domAresize = elementResizeDetectorMaker()
    //   domAresize.listenTo(this.$refs.videoElement, element => {
    //     if (this.canvasShowFlag) {
    //       this.getVideoWidthHeight('myCanvas')
    //     }
    //   })
    // },
    /**
     * 获取视频容器的宽高,并设置canvas宽高
     */
    // getVideoWidthHeight(canvasId) {
    //   const node = document.getElementById('main')
    //   const canvas = document.getElementById(canvasId)
    //   canvas.width = node.clientWidth
    //   canvas.height = node.clientHeight
    // }

  }
}
</script>

<style lang="scss" scoped>
.container-area{
  .video-element{
    // width: 50%;
    height: 628px;
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
