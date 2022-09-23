<template>
  <div id="app" :class="themeClass">
    <router-view />
  </div>
</template>
<script>
export default {
  // 主题色类名获取
  computed: {
    themeClass() {
      return `theme-${this.$store.state.user.theme}`
    }
  },
  watch: {
    // 主题变化存储在本地
    themeClass() {
      localStorage.theme = this.$store.state.user.theme
    }
  },
  created() {
    console.log(this.$store.state.user.theme, 11111)
    // window.document.documentElement.setAttribute(
    //   'data-theme',
    //   defaultSettings.theme
    // )
    if (localStorage.theme) {
      this.$store.dispatch('themeChange', localStorage.theme)
    } else {
      localStorage.theme = this.$store.state.user.theme
    }
  }
}
</script>

<style lang="scss"></style>
