<template>
  <div class="container-area">
    <div id="container" />
    <el-button @click="open">播放</el-button>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      jessibuca: null
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.jessibuca = new Jessibuca({
        container: document.getElementById('container'),
        videoBuffer: 0, // 缓存时长
        isResize: false,
        text: '',
        loadingText: '加载中',
        debug: true,
        decoder: '/decoder.js',
        showBandwidth: true, // 显示网速
        operateBtns: {
          fullscreen: true,
          screenshot: true,
          play: true,
          audio: true,
          record: true
        },
        forceNoOffscreen: true,
        isNotMute: false,
        heartTimeout: 100
      })
    },
    open() {
      this.jessibuca.play(`https://218.94.141.148:9010/XH866437053805666/1.flv`)
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area{
    #container{
        width: 1000px;
        height: 800px;
    }
}
</style>
