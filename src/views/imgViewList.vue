<template>
  <div class="container-area">
    <el-button type="primary" @click="viewer">查看大图</el-button>
    <ImgViewer v-if="showViewer" :img-src="imgList" @closeImg="closeImg" />
  </div>
</template>

<script>
// 分包
const ImgViewer = () => import(/* webpackChunkName: "ImgViewer" */ '@/components/ImgViewer')
export default {
  components: {
    ImgViewer
  },
  data() {
    return {
      imgList: [
        '/imgViewer/1.jpg',
        '/imgViewer/2.jpg',
        '/imgViewer/3.jpg',
        '/imgViewer/4.jpg',
        '/imgViewer/5.jpg'
      ],
      showViewer: false
    }
  },
  created() {},
  methods: {
    viewer() {
      this.showViewer = true
    },
    closeImg() {
      this.showViewer = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area{
}
</style>
