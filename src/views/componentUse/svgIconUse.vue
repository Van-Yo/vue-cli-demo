<template>
  <div class="container-area">
    <svg-icon icon-class="dashboard-fill" style="font-size:50px" />
    <p class="title">
      {{ useAge }}
    </p>
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
@import '../../assets/styles/mixin.scss';
@include themify($themes) {
  .title{
      color: themed('them-title-color');
  }
}
</style>
