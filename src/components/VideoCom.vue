<template>
  <div ref="videoArea" v-loading="loading" class="video-area">
    <video
      :id="'videoElement'+id"
      autoplay
      width="100%"
      height="100%"
      controls
    />
    <canvas
      v-if="canvasShowFlag"
      id="myCanvas"
      ref="myCanvas"
      class="video-model"
      @mousedown="mousedown"
      @mouseup="mouseup"
      @mousemove="mousemove"
    />
    <div ref="tools" class="tools">
      <div v-if="showTools.showCaptureTool" class="tool" @click="capture">
        <el-tooltip class="item" effect="dark" content="截图" placement="right">
          <i
            class="el-icon-camera-solid"
          />
        </el-tooltip>
      </div>
      <div v-if="showTools.showRewordTool" class="tool" @click="record">
        <el-tooltip class="item" effect="dark" :content="isRecording?'结束录制':'短视频录制'" placement="right">
          <i
            class="el-icon-video-camera-solid"
            :style="{color:(isRecording?'red':'#fff')}"
          />
        </el-tooltip>
      </div>
      <div v-if="showTools.show3DcontrolTool" class="tool" @click="areaControl">
        <el-tooltip class="item" effect="dark" :content="canvasShowFlag?'关闭3D控球':'3D控球'" placement="right">
          <i
            class="el-icon-s-help"
            :style="{color:(canvasShowFlag?'red':'#fff')}"
          />
        </el-tooltip>
      </div>
      <div class="tool" @click="stopVideo">
        <el-tooltip class="item" effect="dark" content="关闭视频" placement="right">
          <i
            class="el-icon-switch-button"
          />
        </el-tooltip>
      </div>
    </div>
    <div v-if="isRecording" class="isRecording">
      <div class="round" />
      <p style="color:#fff;background:rgba(0,0,0,0.2);padding:3px 7px;border-radius:5px">录制中</p>
    </div>
    <div v-if="canvasShowFlag" class="isRecording">
      <div class="round" />
      <p style="color:#fff;background:rgba(0,0,0,0.2);padding:3px 7px;border-radius:5px">3D控球中</p>
    </div>
  </div>
</template>

<script>
import RecordRTC from 'recordrtc'
import { getSeekableBlob } from '@/utils/ebml.util.js'
import elementResizeDetectorMaker from 'element-resize-detector'
export default {
  components: {},
  props: {
    videoUrl: {
      type: String,
      default: ''
    },
    showTools: {
      type: Object,
      default: () => {
        return {
          showCaptureTool: true,
          showRewordTool: true,
          show3DcontrolTool: true
        }
      }
    }
  },
  data() {
    return {
      id: Math.random().toString(36).substr(2, 10),
      flvPlayer: null,
      listenFlvFramesTimer: null,
      lastDecodedFrame: 0,
      timer: null,
      reFlvRevertFlag: '',
      loading: false,
      mediaRecorder: null,
      recordedChunks: [],
      isRecording: false,
      recorder: null,
      canvasShowFlag: false,
      mouseDownFlag: false,
      startX: '',
      startY: ''
    }
  },
  watch: {
    // 监听直播链接自动开启直播
    videoUrl(newVal, oldVal) {
      if (newVal) {
        this.flvRevert(newVal)
      }
    }
  },
  created() {},
  destroyed() {
    this.closeFlv()
  },
  mounted() {
    this.listenFullscreen()
    this.resizeCanvas()
  },
  methods: {
    // 手动开启直播
    flvRevert(url) {
      this.closeFlv()
      this.loading = true
      if (this.listenFlvFramesTimer) {
        clearInterval(this.listenFlvFramesTimer)
      }
      if (this.timer) {
        clearInterval(this.timer)
      }
      if (this.$flvjs.isSupported()) {
        const videoElement = document.getElementById(
          'videoElement' + this.id
        )
        const flvPlayer = this.$flvjs.createPlayer(
          {
            type: 'flv',
            isLive: true,
            // hasAudio: false,
            cors: true,
            url
          },
          {
            enableWorker: false, // 不启用分离线程
            enableStashBuffer: false, // 关闭IO隐藏缓冲区
            reuseRedirectedURL: true, // 重用301/302重定向url，用于随后的请求，如查找、重新连接等。
            autoCleanupSourceBuffer: true // 自动清除缓存
          }
        )
        this.flvPlayer = flvPlayer
        this.flvPlayer.attachMediaElement(videoElement)

        // event-断线重连
        this.flvPlayer.on(
          this.$flvjs.Events.ERROR,
          (errorType, errorDetail, errorInfo) => {
            console.log('errorType:', errorType)
            console.log('errorDetail:', errorDetail)
            console.log('errorInfo:', errorInfo)
            // this.loadStatus=true
            // this.statusMsg="正在重连。。。"
            // 视频出错后销毁重新创建
            if (this.flvPlayer) {
              this.flvPlayer.pause()
              this.flvPlayer.unload()
              this.flvPlayer.detachMediaElement()
              this.flvPlayer.destroy()
              this.flvPlayer = null
              this.flvRevert(url)
            }
          }
        )
        // event-检测推流信息
        // 初始化lastDecodedFrame等于0，然后让流中的decodedFrames一直赋给lastDecodedFrame，然后判断两次监听到的decodedFrames是否相等，如果相等表示卡了
        this.flvPlayer.on('statistics_info', res => {
          // console.log('statistics_info', res)
          // eslint-disable-next-line eqeqeq
          if (this.lastDecodedFrame == 0) {
            this.lastDecodedFrame = res.decodedFrames
            return
          }
          // eslint-disable-next-line eqeqeq
          if (this.lastDecodedFrame !== res.decodedFrames) {
            this.lastDecodedFrame = res.decodedFrames
          } else {
            console.log('视频卡了')
            this.lastDecodedFrame = 0
          }
        })
        this.flvPlayer.on('loading_complete', res => {
          // console.log('视频播放结束，正在重新拉流')
          if (this.flvPlayer) {
            this.flvPlayer.pause()
            this.flvPlayer.unload()
            this.flvPlayer.detachMediaElement()
            this.flvPlayer.destroy()
            this.flvPlayer = null
            this.flvRevert(url)
          }
        })
        // load
        this.flvPlayer.load()
        // play
        const playPromise = this.flvPlayer.play()
        /**
         * 注意，这里的playPromise是一个对象，回调结果有三种情形
         * 1. then:成功播放，无异常
         * 2. catch:404报错等，可打开上面的短线重连解决bug
         * 3. pending:视频不播放，但是流却在正常推送（重新点击设备却能正常播放，考虑是流开头转码有问题，解决方案就是监听lastDecodedFrame是否一直等于0）
         */
        // console.log(playPromise);
        if (playPromise !== undefined) {
          this.lastDecodedFrame = 0
          // 只要发现lastDecodedFrame是0，并且处于非播放成功状态，就
          // 1.怀疑是pending状态，有流却不播放，那么5秒后重新推下流尝试
          // 2.推流正常等待时间是20s，不想再等，反正发心跳去唤醒设备了，那就每五秒，重新推流，并切断上一个推流，知道拿到流为止
          const listenFlvFramesTimer = setInterval(() => {
            // console.log(
            //   this.lastDecodedFrame,
            //   this.reFlvRevertFlag
            // );
            if (
              this.lastDecodedFrame === 0 &&
              this.reFlvRevertFlag !== 'fulfilled'
            ) {
              // this.loading = false
              // 发心跳
              // pushVideo({
              //   deviceId: this.deviceId,
              //   channelNo: this.channelNo,
              //   videoIndex: num
              // }).then(() => {});
              this.flvPlayer.pause()
              this.flvPlayer.unload()
              this.flvPlayer.detachMediaElement()
              this.flvPlayer.destroy()
              this.flvPlayer = null
              this.flvRevert(url)
            }
          }, 5000)
          this.listenFlvFramesTimer = listenFlvFramesTimer
          this.reFlvRevertFlag = 'pending'
          // console.log('播放结果');
          playPromise
            .then(() => {
              this.reFlvRevertFlag = 'fulfilled'
              this.listenFlvFramesTimer && clearInterval(this.listenFlvFramesTimer)
              // console.log('success');
              this.$nextTick(() => {
                this.loading = false
              })
              // 追帧定时器
              const timer = setInterval(() => {
                if (!videoElement.buffered.length) {
                  return
                }
                const end = videoElement.buffered.end(0)
                const diff = end - videoElement.currentTime
                if (diff >= 1.5) {
                  videoElement.currentTime = end - 0.45
                }
              }, 3000)
              this.timer = timer
              // console.log('播放成功');
            })
            .catch(() => {
              // console.log('error' + error);
              // this.$message.error('设备未响应，请稍后重试');
              this.reFlvRevertFlag = 'rejected'
              this.listenFlvFramesTimer && clearInterval(this.listenFlvFramesTimer)
              // this.loading = false
            })
        }
      }
    },
    // 手动关闭直播
    closeFlv() {
      if (this.flvPlayer) {
        this.loading = false
        this.flvPlayer.pause()
        this.flvPlayer.unload()
        this.flvPlayer.detachMediaElement()
        this.flvPlayer.destroy()
        this.flvPlayer = null
        this.timer && clearInterval(this.timer)
        this.listenFlvFramesTimer && clearInterval(this.listenFlvFramesTimer)
      }
    },
    listenFullscreen() {
      const div = this.$refs['videoArea']
      div.addEventListener('dblclick', function() {
        console.log('111111111111111')
        if (!document.fullscreenElement) {
          if (div.requestFullscreen) {
            div.requestFullscreen()
          } else if (div.webkitRequestFullscreen) { /* Safari */
            div.webkitRequestFullscreen()
          } else if (div.msRequestFullscreen) { /* IE11 */
            div.msRequestFullscreen()
          }

          div.classList.add('fullscreen')
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen()
          } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen()
          }

          div.classList.remove('fullscreen')
        }
      })
    },
    // 视频截图
    capture() {
      // console.log('截图')
      const videoPlayer = document.getElementById(
        'videoElement' + this.id
      )
      // 获取视频当前时间
      const currentTime = videoPlayer.currentTime

      // 创建一个 Canvas 元素
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // 将 Canvas 尺寸设置为视频的实际宽高
      canvas.width = videoPlayer.videoWidth
      canvas.height = videoPlayer.videoHeight

      // 在 Canvas 上绘制视频当前帧
      ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height)

      // 将 Canvas 转换为图像数据
      const dataURL = canvas.toDataURL('image/png')

      // 创建一个下载链接并将图像保存为文件
      const link = document.createElement('a')
      link.href = dataURL
      link.download = `screenshot_${currentTime}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      this.$message.success('截图成功')
    },
    // 开始和结束录制短视频
    record() {
      if (this.recorder && this.isRecording) {
        // this.mediaRecorder.stop()
        // this.isRecording = false
        // 停止录制
        this.recorder.stopRecording(() => {
          this.download()
        })
        this.isRecording = false
        this.$message.success('录制成功')
      } else {
        const videoPlayer = document.getElementById(
          'videoElement' + this.id
        )
        // this.recordedChunks = []
        this.isRecording = true

        // const stream = videoPlayer.captureStream()

        // this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })

        // this.mediaRecorder.ondataavailable = event => {
        //   if (event.data.size > 0) {
        //     this.recordedChunks.push(event.data)
        //   }
        // }

        // this.mediaRecorder.onstop = () => {
        //   const videoBlob = new Blob(this.recordedChunks, { type: 'video/webm' })

        //   // 创建一个临时链接并模拟点击下载视频
        //   const link = document.createElement('a')
        //   link.href = URL.createObjectURL(videoBlob)
        //   link.download = 'recorded_video.mp4'
        //   document.body.appendChild(link)
        //   link.click()
        //   document.body.removeChild(link)
        // }

        // this.mediaRecorder.start()
        // 获取视频流
        const stream = videoPlayer.captureStream()

        // 将视频流注入到recordRTC
        this.recorder = RecordRTC(stream, {
          type: 'video'
        })

        // 开始录制
        this.recorder.startRecording()
        this.$message.success('开始录制')
      }
    },
    // 结束后自动保存本地
    download() {
      getSeekableBlob(
        this.recorder.getBlob(),
        this.mediaType,
        function(seekableBlob) {
          const url = window.URL.createObjectURL(seekableBlob)
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          // 拼接文件类型
          const fileName = Date.now() + '.mp4'
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      )
    },
    // 关闭视频
    stopVideo() {
      this.closeFlv()
      this.$message.success('已关闭视频')
      this.$emit('closeVideo')
    },
    /**
     * 鼠标落下
     */
    mousedown(e) {
      this.$refs.tools.style.zIndex = 2000
      // console.log('鼠标落下');
      this.mouseDownFlag = true
      this.startX = e.offsetX // 鼠标落下时的X
      this.startY = e.offsetY // 鼠标落下时的Y
      // console.log(this.startX, this.startY)
    },
    /**
     * 鼠标移动
     */
    mousemove(e) {
      if (this.mouseDownFlag) {
        this.drawRect(e)
      }
    },
    /**
     * 鼠标抬起
     */
    mouseup(e) {
      const canvas = this.$refs.myCanvas
      var ctx = canvas.getContext('2d')
      this.mouseDownFlag = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.$refs.tools.style.zIndex = 2200
      if (this.startX !== e.offsetX && this.startY !== e.offsetY) {
        // console.log('拖动了')
        // console.log(this.startX, this.startY, e.offsetX, e.offsetY)
        this.$emit('3Dcontrol', { startX: this.startX, startY: this.startY, offsetX: e.offsetX, offsetY: e.offsetY })
      }
    },
    /**
     * canvas绘矩形
     */
    drawRect(e) {
      if (this.mouseDownFlag) {
        const canvas = this.$refs.myCanvas
        var ctx = canvas.getContext('2d')
        const x = this.startX
        const y = this.startY
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()

        // 设置线条颜色，必须放在绘制之前
        ctx.strokeStyle = 'red'
        // 线宽设置，必须放在绘制之前
        ctx.lineWidth = 4

        ctx.strokeRect(x, y, e.offsetX - x, e.offsetY - y)
      }
    },
    // 开启3D控球
    areaControl() {
      if (!this.canvasShowFlag) {
        this.canvasShowFlag = true
        this.$nextTick(() => {
          this.getVideoWidthHeight('myCanvas')
        })
        this.$message.success('已开启3D控球，请在视频中画框')
      } else {
        this.canvasShowFlag = false
      }
    },
    resizeCanvas() {
      // 监听视频位div大小，动态调整canvas大小
      const domAresize = elementResizeDetectorMaker()
      domAresize.listenTo(this.$refs.videoArea, element => {
        if (this.canvasShowFlag) {
          this.getVideoWidthHeight('myCanvas')
        }
      })
    },
    /**
     * 获取视频容器的宽高,并设置canvas宽高
     */
    getVideoWidthHeight(canvasId) {
      const node = this.$refs.videoArea
      const canvas = this.$refs[canvasId]
      canvas.width = node.clientWidth
      canvas.height = node.clientHeight
    }
  }
}
</script>

<style lang="scss" scoped>
/* 定义闪烁的动画效果 */
@keyframes blink-animation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.video-area{
    width: 100%;
    height: 100%;
    position: relative;
    video{
      background: #000;
    }
    ::v-deep .el-loading-mask {
      background-color: rgba(0, 0, 0, 0);
      .el-loading-spinner .path {
        stroke: #01e5ff;
      }
    }
    .video-model {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 2001;
      background: rgba(0, 0, 0, 0.1);
    }
    .tools{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: absolute;
      width: 10%;
      height: 50%;
      right: 0;
      top: 25%;
      background: rgba(0,0,0,0.2);
      border-radius:20px;
      opacity: 0;
      transition: all 0.3s ease-in-out; /* 过渡效果 */
      color: #fff;
      font-size: 40px;
      z-index: 2200;
      .tool{
        cursor: pointer;
        margin: 10px 0;
      }
    }
    &:hover .tools{
      right: 3%;
      opacity: 1;
    }
    .isRecording{
      position: absolute;
      right: 3%;
      top: 3%;
      display: flex;
      align-items: center;
      .round{
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: red;
        margin-right: 5px;
        animation: blink-animation 1s infinite;
      }
    }
}
</style>
