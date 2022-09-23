<template>
  <div class="container-area">
    <svg-icon icon-class="dashboard-fill" style="font-size:50px" />
    <p>
      {{ useAge }}
    </p>
    <div class="box1 theme_bg" />
    <div>
      <div class="box1 box2" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      useAge: '<svg-icon icon-class="dashboard-fill" style="font-size:50px" />'
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.container-area{
  .box1{
    width: 100px;
    height: 100px;
    border: 1px solid red;
    margin: 20px;
  }
  .box2{
    border: 1px solid green;
    margin: 20px;
  }
}
</style>
