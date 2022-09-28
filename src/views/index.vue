<template>
  <div class="container-area">
    <div class="buttonClass them-btn-primary" @click="goto('downloadPDF')">下载PDF</div>
    <div class="buttonClass them-btn-primary" @click="goto('print')">打印</div>
    <div class="buttonClass them-btn-primary" @click="goto('echarts')">echarts</div>
    <div class="buttonClass them-btn-primary" @click="goto('three')">three</div>
    <div class="buttonClass them-btn-primary" @click="goto('svgIconUse')">svg和主题色</div>
    <div class="buttonClass them-btn-primary" @click="goto('rate')">还贷器</div>
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
        // box-shadow: inset 0px 1px 0px 0px #97c4fe;
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
