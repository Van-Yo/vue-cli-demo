<template>
  <div v-loading="loading" class="video-area">
    <video
      :id="'videoElement'+id"
      autoplay
      muted
      width="100%"
      height="100%"
    />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    videoUrl: {
      type: String,
      default: ''
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
      loading: false
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
  methods: {
    // 手动开启直播
    flvRevert(url) {
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
            hasAudio: false,
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
    }
  }
}
</script>

<style lang="scss" scoped>
.video-area{
    width: 100%;
    height: 100%;
    video{
      background: #000;
    }
    ::v-deep .el-loading-mask {
      background-color: rgba(0, 0, 0, 0);
      .el-loading-spinner .path {
        stroke: #01e5ff;
      }
    }
}
</style>
