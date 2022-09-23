<template>
  <div class="container-area">
    <el-container style="height:100%">
      <el-aside style="position:relative;padding-top:70px">
        <div style="height:60px;width:60px;position:absolute;right:50%;margin-right:-30px;cursor: pointer;top:0" @click="$router.push('/')">
          <img src="../assets/122028.png" alt="" style="width:100%">
        </div>
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen" @close="handleClose">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location" />
              <span slot="title">导航一</span>
            </template>
            <el-menu-item-group>
              <span slot="title">分组一</span>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <span slot="title">选项4</span>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu" />
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document" />
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting" />
            <span slot="title">导航四</span>
          </el-menu-item>
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
        </el-header>
        <el-main><router-view /></el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      isCollapse: true
    }
  },
  created() {},
  methods: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area{
  height: 100%;
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
    text-align: center;
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
