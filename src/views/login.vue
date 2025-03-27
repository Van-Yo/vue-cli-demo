<template>
  <div class="login-container">
    <ul class="bg-bubbles">
      <li v-for="n in 10" :key="n" />
    </ul>

    <div class="login-box animate__animated animate__fadeIn">
      <div class="login-title">
        <h2 class="animate__animated animate__slideInDown">系统登录</h2>
        <p class="animate__animated animate__slideInUp">欢迎使用后台管理系统</p>
      </div>

      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        class="login-form"
      >
        <el-form-item prop="name" class="animate__animated animate__fadeInLeft">
          <el-input
            v-model="form.name"
            prefix-icon="el-icon-user"
            placeholder="请输入账户名"
          />
        </el-form-item>

        <el-form-item prop="password" class="animate__animated animate__fadeInRight">
          <el-input
            v-model="form.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码"
            @keyup.enter.native="login"
          />
        </el-form-item>

        <el-form-item class="animate__animated animate__fadeInUp">
          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            @click="login"
          >
            登录
          </el-button>
          <el-button
            class="reset-btn"
            @click="reset"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer animate__animated animate__fadeIn">
        <p>推荐使用Chrome浏览器访问</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      form: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$log('这是登录界面')
    this.$log.info('这是登录界面')
    this.$log.success('这是登录界面')
    this.$log.warning('这是登录界面')
    this.$log.error('这是登录界面')
    this.$log.picture('/logo.jpeg')
    this.$log.table()
  },
  methods: {
    login() {
      this.loading = true
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('login').then(() => {
            this.$router.push('/')
          }).finally(() => {
            this.loading = false
          })
        } else {
          this.loading = false
          return false
        }
      })
    },
    reset() {
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #1a2980 0%, #26d0ce 100%);
  position: relative;
  overflow: hidden;

  .bg-bubbles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;

    li {
      position: absolute;
      list-style: none;
      display: block;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.15);
      bottom: -160px;
      animation: bubble 25s infinite;
      transition-timing-function: ease-in-out;

      &:nth-child(1) {
        left: 10%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }

      &:nth-child(2) {
        left: 20%;
        width: 90px;
        height: 90px;
        animation-delay: 2s;
        animation-duration: 17s;
      }

      &:nth-child(3) {
        left: 25%;
        width: 40px;
        height: 40px;
        animation-delay: 4s;
      }

      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-duration: 22s;
        background-color: rgba(255, 255, 255, 0.25);
      }

      &:nth-child(5) {
        left: 70%;
        width: 120px;
        height: 120px;
        background-color: rgba(255, 255, 255, 0.1);
      }

      &:nth-child(6) {
        left: 80%;
        width: 90px;
        height: 90px;
        animation-delay: 3s;
        background-color: rgba(255, 255, 255, 0.2);
      }

      &:nth-child(7) {
        left: 32%;
        width: 60px;
        height: 60px;
        animation-delay: 7s;
      }

      &:nth-child(8) {
        left: 55%;
        width: 20px;
        height: 20px;
        animation-delay: 15s;
        animation-duration: 40s;
        background-color: rgba(255, 255, 255, 0.3);
      }

      &:nth-child(9) {
        left: 25%;
        width: 10px;
        height: 10px;
        animation-delay: 2s;
        animation-duration: 40s;
        background-color: rgba(255, 255, 255, 0.35);
      }

      &:nth-child(10) {
        left: 90%;
        width: 160px;
        height: 160px;
        animation-delay: 11s;
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .login-box {
    width: 420px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    box-shadow: 0 15px 25px rgba(0,0,0,0.2);
    position: relative;
    z-index: 1;
    animation-duration: 1s;

    .login-title {
      text-align: center;
      margin-bottom: 40px;

      h2 {
        font-size: 32px;
        color: #fff;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        animation-duration: 1s;
        animation-delay: 0.3s;
      }

      p {
        color: rgba(255,255,255,0.8);
        font-size: 16px;
        animation-duration: 1s;
        animation-delay: 0.5s;
      }
    }

    .login-form {
      position: relative;
      z-index: 2;

      .el-form-item {
        margin-bottom: 25px;
        animation-duration: 1s;
        animation-delay: 0.7s;
      }

      :deep(.el-input) {
        .el-input__inner {
          height: 50px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          font-size: 16px;
          transition: all 0.3s ease;

          &:focus {
            background: rgba(255,255,255,0.25);
            box-shadow: 0 0 15px rgba(255,255,255,0.2);
          }

          &::placeholder {
            color: rgba(255,255,255,0.6);
          }
        }

        .el-input__prefix {
          color: rgba(255,255,255,0.8);
        }
      }

      .login-btn {
        width: 100%;
        height: 50px;
        background: linear-gradient(45deg, #00c6fb 0%, #005bea 100%);
        border: none;
        font-size: 16px;
        margin-bottom: 15px;
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
      }

      .reset-btn {
        width: 100%;
        height: 50px;
        background: rgba(255,255,255,0.15);
        border: 1px solid rgba(255,255,255,0.3);
        color: #fff;
        font-size: 16px;
        transition: all 0.3s ease;
        cursor: pointer;
        margin-left: 0;
        &:hover {
          background: rgba(255,255,255,0.25);
          transform: translateY(-2px);
        }
      }
    }

    .login-footer {
      text-align: center;
      margin-top: 20px;
      animation-delay: 1s;

      p {
        color: rgba(255,255,255,0.6);
        font-size: 14px;
      }
    }
  }
}

@keyframes bubble {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
    border-radius: 50%;
  }
  50% {
    transform: translateY(-500px) scale(1.1) translateX(20px);
    opacity: 0.8;
    border-radius: 50%;
  }
  75% {
    transform: translateY(-750px) scale(1.2) translateX(-15px);
    opacity: 0.4;
    border-radius: 50%;
  }
  100% {
    transform: translateY(-1000px) scale(0.8);
    opacity: 0;
    border-radius: 50%;
  }
}
</style>
