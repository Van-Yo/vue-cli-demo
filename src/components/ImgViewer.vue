/** <ImgViewer v-if="showViewer" :img-src="imgList" @closeImg="closeImg" />*/
<template>
  <div class="container-area">
    <div class="container">
      <img
        id="image"
        class="img-style"
        :src="imgSrc[showCurrentIndex]"
        alt=""
      >
    </div>
    <div class="prebtn" @click="preImg">
      <div class="left" />
    </div>
    <div class="nextbtn" @click="nextImg">
      <div class="right" />
    </div>

    <div class="close" @click="close">
      <i class="el-icon-close" />
    </div>
    <div class="bottom">
      <div class="single-button" @click="add(1.1)">
        <i class="el-icon-zoom-in" />
      </div>
      <div class="single-button" @click="add(0.9)">
        <i class="el-icon-zoom-out" />
      </div>
      <div class="single-button" @click="reset">
        <i class="el-icon-full-screen" />
      </div>
      <div class="single-button" @click="changeRotate('left')">
        <i class="el-icon-refresh-left" />
      </div>
      <div class="single-button" @click="changeRotate('right')">
        <i class="el-icon-refresh-right" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    imgSrc: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      rotate: 0,
      result: {},
      x: 0,
      y: 0,
      scale: 1,
      isPointerdown: false, // 按下标识
      point: { x: 0, y: 0 }, // 第一个点坐标
      diff: { x: 0, y: 0 }, // 相对于上一次pointermove移动差值
      lastPointermove: { x: 0, y: 0 }, // 用于计算diff
      showCurrentIndex: this.currentIndex
    }
  },
  mounted() {
    this.init()
    // 拖拽查看
    this.drag()
    // 滚轮缩放
    this.wheelZoom()
  },
  methods: {
    changeRotate(flag) {
      if (flag === 'left') {
        this.rotate -= 90
      } else {
        this.rotate += 90
      }

      this.image.style.transform =
        'translate3d(' +
        this.x +
        'px, ' +
        this.y +
        'px, 0) scale(' +
        this.scale +
        ') rotate(' +
        this.rotate +
        'deg)'
    },
    close() {
      this.resetImg()
      this.showCurrentIndex = 0
      this.$emit('closeImg')
    },
    add(ratio) {
      this.scale *= ratio
      this.image.style.transform =
        'translate3d(' +
        this.x +
        'px, ' +
        this.y +
        'px, 0) scale(' +
        this.scale +
        ')'
    },
    reset() {
      this.resetImg()
    },
    preImg() {
      if (this.showCurrentIndex > 0) {
        this.showCurrentIndex--
      } else {
        return false
      }
    },
    nextImg() {
      if (this.showCurrentIndex < this.imgSrc.length - 1) {
        this.showCurrentIndex += 1
      } else {
        return false
      }
    },
    resetImg() {
      this.scale = 1
      this.rotate = 0
      this.result = this.getImgSize(
        this.image.naturalWidth,
        this.image.naturalHeight,
        window.innerWidth,
        window.innerHeight
      )
      this.image.style.width = this.result.width + 'px'
      this.image.style.height = this.result.height + 'px'
      this.x = (window.innerWidth - this.result.width) * 0.5
      this.y = (window.innerHeight - this.result.height) * 0.5
      this.image.style.transform =
        'translate3d(' + this.x + 'px, ' + this.y + 'px, 0) scale(1)'
    },
    init() {
      this.container = document.querySelector('.container')
      this.image = document.getElementById('image')
      // 图片加载完成后再绑定事件
      this.image.addEventListener('load', () => {
        // console.log('换图片了')
        this.resetImg()
      })
    },
    getImgSize(naturalWidth, naturalHeight, maxWidth, maxHeight) {
      // console.log(naturalWidth, naturalHeight, maxWidth, maxHeight)
      const imgRatio = naturalWidth / naturalHeight
      const maxRatio = maxWidth / maxHeight
      let width, height
      // 如果图片实际宽高比例 >= 显示宽高比例
      if (imgRatio >= maxRatio) {
        if (naturalWidth > maxWidth) {
          width = maxWidth
          height = (maxWidth / naturalWidth) * naturalHeight
        } else {
          width = naturalWidth
          height = naturalHeight
        }
      } else {
        if (naturalHeight > maxHeight) {
          width = (maxHeight / naturalHeight) * naturalWidth
          height = maxHeight
        } else {
          width = naturalWidth
          height = naturalHeight
        }
      }
      // console.log({ width: width, height: height })
      return { width: width, height: height }
    },
    // 拖拽查看
    drag() {
      // 绑定 pointerdown
      this.image.addEventListener('pointerdown', e => {
        this.isPointerdown = true
        this.image.setPointerCapture(e.pointerId)
        this.point = { x: e.clientX, y: e.clientY }
        this.lastPointermove = { x: e.clientX, y: e.clientY }
      })
      // 绑定 pointermove
      this.image.addEventListener('pointermove', e => {
        if (this.isPointerdown) {
          const current1 = { x: e.clientX, y: e.clientY }
          this.diff.x = current1.x - this.lastPointermove.x
          this.diff.y = current1.y - this.lastPointermove.y
          this.lastPointermove = { x: current1.x, y: current1.y }
          this.x += this.diff.x
          this.y += this.diff.y
          this.image.style.transform =
            'translate3d(' +
            this.x +
            'px, ' +
            this.y +
            'px, 0) scale(' +
            this.scale +
            ') rotate(' +
            this.rotate +
            'deg)'
        }
        e.preventDefault()
      })
      // 绑定 pointerup
      this.image.addEventListener('pointerup', e => {
        if (this.isPointerdown) {
          this.isPointerdown = false
        }
      })
      // 绑定 pointercancel
      this.image.addEventListener('pointercancel', e => {
        if (this.isPointerdown) {
          this.isPointerdown = false
        }
      })
    },
    // 滚轮缩放
    wheelZoom() {
      this.container.addEventListener('wheel', e => {
        // console.log(e.deltaY)
        let ratio = 1.1
        // 缩小
        if (e.deltaY > 0) {
          ratio = 0.9
        }
        // 目标元素是img说明鼠标在img上，以鼠标位置为缩放中心，否则默认以图片中心点为缩放中心
        if (e.target.tagName === 'IMG') {
          const origin = {
            x: (ratio - 1) * this.result.width * 0.5,
            y: (ratio - 1) * this.result.height * 0.5
          }
          // 计算偏移量
          this.x -= (ratio - 1) * (e.clientX - this.x) - origin.x
          this.y -= (ratio - 1) * (e.clientY - this.y) - origin.y
        }
        this.scale *= ratio
        this.image.style.transform =
          'translate3d(' +
          this.x +
          'px, ' +
          this.y +
          'px, 0) scale(' +
          this.scale +
          ') rotate(' +
          this.rotate +
          'deg)'
        e.preventDefault()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area {
  position: fixed !important;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  .img-style {
    transition: transform 0.4s ease;
  }
  .log {
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
  }
  .prebtn{
    padding: 23px;
    border-radius: 50%;
    background: rgba(150, 150, 150, 0.5);
    position: fixed;
    top: 50%;
    left: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-top: -33px;
  }
  .nextbtn{
    padding: 23px;
    border-radius: 50%;
    background: rgba(150, 150, 150, 0.5);
    position: fixed;
    top: 50%;
    right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-top: -33px;
  }
  .left {

    transform: translateY(-50%);

    color: #fff;
    width: 20px;
    height: 20px;
    border-top: 3px solid #fff;
    border-right: 3px solid #fff;
    transform: rotate(-135deg) translate(-3px,3px);
  }
  .right {
    transform: translateY(-50%);

    color: #fff;
    width: 20px;
    height: 20px;
    border-top: 3px solid #fff;
    border-right: 3px solid #fff;
    transform: rotate(45deg) translate(-3px,3px);
    cursor: pointer;
  }
  .close {
    position: fixed;
    right: 20px;
    top: 20px;
    cursor: pointer;
    i {
      font-size: 24px;
      color: #fff;
    }
    padding: 10px;
    background: rgba(150, 150, 150, 0.5);
    border-radius: 50%;
  }
  .bottom {
    display: flex;
    padding: 20px;
    border-radius: 35px;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    background: rgba(150, 150, 150, 0.5);
    margin-bottom: 20px;
    i {
      font-size: 30px;
    }
    .single-button {
      margin: 0 20px;
      cursor: pointer;
    }
  }
}
</style>
