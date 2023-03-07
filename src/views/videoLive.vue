<template>
  <div class="container-area">
    <el-button type="primary" @click="play">播放视频</el-button>
    <VideoCom :video-url="videoUrl" />
  </div>
</template>

<script>
// 分包
const VideoCom = () => import(/* webpackChunkName: "VideoCom" */ '@/components/VideoCom')
export default {
  components: {
    VideoCom
  },
  data() {
    return {
      videoUrl: ''
    }
  },
  created() {},
  methods: {
    play() {
      this.videoUrl = 'https://218.94.141.148:9010/XH866437053874068/1.flv'
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area{
}
</style>
