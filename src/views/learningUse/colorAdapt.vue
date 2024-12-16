<template>
  <div class="color-adapt-area">
    <h1 class="title">网页颜色自适应——解决文本可阅读性特别差（不太明显，想看清楚会很累）的问题</h1>
    <h3 class="sub-title">案例：</h3>
    <div><el-button v-for="(item,index) in bgColorList" :key="index" style="border: 0;" :style="{color:calcLightColor(item),background:calcMiddleColor(calcLightColor(item))}">{{ item }}</el-button></div>
    <h3 class="sub-title">试试：</h3>
    <div style="width: 250px; display: flex;position: relative;">
      <p style="position: absolute;left: 10px;z-index: 999;top: 8px;font-size: 13px;">#</p>
      <el-input v-model="inputColor" placeholder="输入十六进制颜色码" @change="editColor" @input="editColor" />
      <el-button :style="{background:bgColor,color:textColor}" style="border: 0;margin-left: 10px;">颜色展示</el-button>
    </div>
  </div>
</template>

<script>
import Color from 'color'
export default {
  components: {},
  data() {
    return {
      bgColorList: [
        '#FfFfFf', '#fef08a', '#042f2e', '#22D3EE', '#500724', '#DCFCE7', '#111827', '#A78BFA', '#451A03'
      ],
      inputColor: '', // 输入背景色
      textColor: '#fff',
      bgColor: '#000'
    }
  },
  methods: {
    editColor() {
      this.textColor = this.calcLightColor('#' + this.inputColor)
      this.bgColor = this.calcMiddleColor(this.textColor)
    },
    getTextColor(bg) {
      return this.judgeIsDark(bg) ? this.calcDarkColor(bg) : this.calcLightColor(bg)
    },
    judgeIsDark(bg) {
      return Color(bg).isDark()
    },
    // 白色主题下，选色跟白色对比，得到对比度>3.5的颜色作为本文颜色
    calcLightColor(frontColor, backColor = '#fff') {
      const white = Color(backColor)
      let c = Color(frontColor)
      // 对比度 < 3.5，循环迭代使颜色越来越暗
      while (c.contrast(white) < 3.5) {
        // lightness() 可以读取/赋值颜色的 HSL 中的亮度值
        // 如果是计算白色模式下的安全前景色，这里应该是 - 1，即让颜色越来越暗
        c = c.lightness(c.lightness() - 1)
      }
      return c.hex()
    },
    // 白色主题下，选色跟白色对比，得到对比度<1.2的颜色作为按钮背景颜色
    calcMiddleColor(frontColor, backColor = '#fff') {
      const white = Color(backColor)
      let c = Color(frontColor)
      // 对比度 > 1.2，循环迭代使颜色越来越亮白
      while (c.contrast(white) > 1.2) {
        // lightness() 可以读取/赋值颜色的 HSL 中的亮度值
        // 如果是计算白色模式下的安全前景色，这里应该是 + 1，即让颜色越来越亮白
        c = c.lightness(c.lightness() + 1)
      }
      return c.hex()
    }
  }
}
</script>

<style lang="scss" scoped>
.color-adapt-area{
    background: #fff;
    height: 100%;
    margin: -20px;
    padding: 20px;

    .title{
        color: #000;
        font-weight: 600;
        font-size: 24px;
        margin-bottom: 20px;
    }
    .sub-title{
        color: #000;
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 10px;
        margin-top: 10px;
    }
.text-style{
    border: 0;
    // color: #000;
    color: #A69201;
    background: #fef08a;
    // color: #949494;
}
::v-deep .el-input--small .el-input__inner{
    padding-left: 25px;
}
}
</style>
