<template>
  <div class="container-area">
    <div>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="账户名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
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
  created() {},
  methods: {
    login() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('login').then(res => {
            console.log(res)
            this.$router.push('/')
          })
        } else {
          console.log('error submit!!')
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
.container-area{
    width: 100%;
    height: 100%;
    padding-right: 400px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: url('/login.png');
    background-size: cover;
}
</style>
