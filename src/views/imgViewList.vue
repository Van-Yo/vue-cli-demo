<template>
  <div class="container-area">
    <el-button type="primary" @click="viewer">查看大图</el-button>
    <ImgViewer :show.sync="showViewer" :img-src="imgList" />
  </div>
</template>

<script>
import ImgViewer from '@/components/ImgViewer'
export default {
  components: {
    ImgViewer
  },
  data() {
    return {
      imgList: [
        '1.jpg',
        '2.jpg',
        '3.jpg',
        '4.jpg',
        '5.jpg'
      ],
      showViewer: false
    }
  },
  created() {},
  methods: {
    viewer() {
      this.showViewer = true
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area{
}
</style>
