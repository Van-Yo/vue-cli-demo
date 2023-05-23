<template>
  <div class="container-area">
    async
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  created() {
    this.init()
  },
  methods: {
    // init() {
    //   this.getRecordStuId().then(res => {
    //     console.log(res)
    //   })
    // },
    async init() {
      const res = await this.getRecordStuId()
      for (let i = 0; i < res.length; i++) {
        const rs = await this.getDelayStuInfo(res[i])
        console.log(rs)
      }
    },
    // get students' id list
    getRecordStuId() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(['1101', '1103', '1104', '1108'])
        }, 1000)
      })
    },
    // 延迟2秒去请求学生信息接口
    getDelayStuInfo(id) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.getStuInfo(id).then(res => {
            resolve(res)
          })
        }, 2000)
      })
    },
    getStuInfo(id) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ id, name: id + '华子' })
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area{
}
</style>
