<template>
  <div class="container-area">
    <el-button type="primary" @click="viewer">查看大图</el-button>
    <json-viewer :value="jsonData" copyable theme="my-awesome-json-theme" :preview-mode="true" />
    <ImgViewer v-if="showViewer" :img-src="imgList" :current-index="currentIndex" @closeImg="closeImg" />
  </div>
</template>

<script>
import JsonViewer from 'vue-json-viewer'
// 分包
const ImgViewer = () => import(/* webpackChunkName: "ImgViewer" */ '@/components/ImgViewer')
export default {
  components: {
    ImgViewer,
    JsonViewer
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
      showViewer: false,
      currentIndex: 0,
      jsonData: {
        '准备工作': {
          imgList: [
            '/imgViewer/1.jpg',
            '/imgViewer/2.jpg',
            '/imgViewer/3.jpg',
            '/imgViewer/4.jpg',
            '/imgViewer/5.jpg'
          ]
        },
        '第一步': {
          showViewer: false,
          currentIndex: 0 // 预览大图的下标，可在viewer()方法中先改再showViewer=true
        },
        '第二步': "const ImgViewer = () => import('@/components/ImgViewer')",
        '第三步': 'components: {ImgViewer}',
        '第四步': '<ImgViewer v-if="showViewer" :img-src="imgList" :current-index="currentIndex" @closeImg="closeImg" />',
        '第五部': {
          methods: {
            viewer() {
              this.showViewer = true
            },
            closeImg() {
              this.showViewer = false
            }
          }
        }
      }
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
  .my-awesome-json-theme {
  overflow-x: hidden;
  background: #0c2b52;
  white-space: nowrap;
  color: #01fef4;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: rgb(237, 13, 13);
    background-color: rgb(241, 11, 11);
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0px 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }
  .jv-button {
    color: #49b3ff;
  }
  ::v-deep .jv-key {
    color: #01fef4 !important;
  }
  ::v-deep .jv-push {
    color: #fff;
  }
  .jv-item {
    &.jv-array {
      color: #111111;
    }
    &.jv-boolean {
      color: #fc1e70;
    }
    &.jv-function {
      color: #067bca;
    }
    &.jv-number {
      color: #fc1e70;
    }
    &.jv-number-float {
      color: #fc1e70;
    }
    &.jv-number-integer {
      color: #fc1e70;
    }
    &.jv-object {
      color: #111111;
    }
    &.jv-undefined {
      color: #e08331;
    }
    &.jv-string {
      color: #42b983;
      word-break: break-word;
      white-space: normal;
    }
  }
  .jv-code {
    ::v-deep .jv-toggle {
      color: #067bca !important;
      &:before {
        padding: 0px 2px;
        border-radius: 2px;
      }
      &:hover {
        &:before {
          background: rgb(242, 5, 5);
        }
      }
    }
  }
}
}
</style>
