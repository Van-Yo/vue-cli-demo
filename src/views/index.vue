<template>
  <div class="container-area">
    <div class="buttonClass" @click="goto('downloadPDF')">下载PDF</div>
    <div class="buttonClass" @click="goto('print')">打印</div>
    <div class="buttonClass" @click="goto('echarts')">echarts</div>
    <div class="buttonClass" @click="goto('three')">three</div>
    <div class="buttonClass" @click="goto('svgIconUse')">svgIconUse</div>
    <div class="buttonClass" @click="goto('rate')">还贷器</div>
    <div class="buttonClass" @click="changeTheme">主题切换</div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  created() {},
  methods: {
    goto(name) {
      this.$router.push(name)
    },
    changeTheme() {
      if (this.$store.state.user.theme === 'blove') {
        this.$store.dispatch('themeChange', 'flammulated')
      } else {
        this.$store.dispatch('themeChange', 'blove')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area {
  display: flex;
    .buttonClass {
        font-size: 15px;
        font-family: Arial;
        width: 140px;
        height: 50px;
        border-width: 1px;
        color: #ffffff;
        border-color: #337fed;
        font-weight: bold;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        box-shadow: inset 0px 1px 0px 0px #97c4fe;
        text-shadow: inset 0px 1px 0px #1570cd;
        background: linear-gradient(#3d94f6, #1e62d0);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-right: 10px;
    }

    .buttonClass:hover {
        background: linear-gradient(#1e62d0, #3d94f6);
    }
}
</style>
