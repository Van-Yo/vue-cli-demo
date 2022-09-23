<template>
  <section class="error-page-area">
    <div class="container">
      <img src="../assets/err_404.jpg" alt="">
    </div>
  </section>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.error-page-area{
    height: 100%;
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 垂直居中 */
    .container{
        display: flex;
        justify-content: center; /* 水平居中 */
        align-items: center;     /* 垂直居中 */
    }
}
</style>
