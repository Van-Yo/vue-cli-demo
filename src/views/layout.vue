<template>
  <div ref="appRef" class="container-area">
    <el-container style="height:100%">
      <el-aside style="position:relative;padding-top:70px;background:#fff">
        <div style="height:60px;width:60px;position:absolute;right:50%;margin-right:-30px;cursor: pointer;top:0" @click="$router.push('/')">
          <img src="../assets/122028.png" alt="" style="width:100%">
        </div>
        <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen" @close="handleClose">
          <el-submenu v-for="(item,index) in routeList" :key="index" :index="index+''">
            <template slot="title">
              <i :class="item.meta.icon" />
              <span slot="title">{{ item.meta.title }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="(jtem,jdex) in item.children" :key="jdex" :index="item.path+'/'+jtem.path" @click="goTo(item.path+'/'+jtem.path)">{{ jtem.meta.title }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
        <i style="position:absolute;right:50%;bottom:5px;margin-right:-13px;font-size:26px;cursor: pointer;" :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" @click="isCollapse=!isCollapse" />
      </el-aside>
      <el-container>
        <el-header class="theme_bg">

          <div style="margin-right:10px">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          </div>
          <div>
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link" style="color:#fff">
                Hi, I1_VAL_TIMETABLE1<i class="el-icon-caret-bottom el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="personCenter">个人中心</el-dropdown-item>
                <el-dropdown-item divided style="color:red" command="loginOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div style="margin-left:15px;color:#fff;font-size:20px;cursor: pointer;" @click="changeTheme">
            <i v-show="!isLightTheme" class="el-icon-sunny" />
            <i v-show="isLightTheme" class="el-icon-moon" />
          </div>
        </el-header>
        <el-main><router-view /></el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
// import drawMixin from '../utils/drawMixin'
export default {
  components: {},
  // mixins: [drawMixin],
  data() {
    return {
      isCollapse: true
    }
  },
  computed: {
    isLightTheme() {
      return this.$store.state.user.theme === 'blove'
    },
    routeList() {
      return this.$store.state.user.routeList
    }
  },
  created() {},
  methods: {
    goTo(url) {
      this.$router.push(url)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    loginOut() {
      console.log(1111111111)
      this.$store.dispatch('loginOut').then(() => {
        this.$router.push('login')
      })
    },
    handleCommand(command) {
      if (command === 'loginOut') this.loginOut()
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
.container-area{
  height: 100%;
  // color: #d3d6dd;
  // width: 1920px;
  // height: 1080px;
  // position: absolute;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);
  // transform-origin: left top;
  // overflow: hidden;
  .el-header, .el-footer {
    // background-color: #6777ef;
    color: #333;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .el-aside {
    // background-color: #D3DCE6;
    color: #333;
    text-align: center;

  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    // text-align: center;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  ::v-deep .el-aside{
    width: auto !important;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
</style>
