<template>
  <div class="container-area">
    <!-- <svg-icon icon-class="dashboard-fill" style="font-size:50px" />
    <p class="title">
      {{ useAge }}
    </p> -->
    <div class="yuyue-container">
      <div v-for="(item,index) in userList" :key="index" class="single">
        <el-form ref="form" :model="item" label-width="100px">
          <el-form-item label="姓名">
            <el-input v-model="item.name" />
            <el-button type="success" @click="copyMessage(item.name)">复制</el-button>
          </el-form-item>
          <el-form-item label="身份证号码">
            <el-input v-model="item.id" />
            <el-button type="success" @click="copyMessage(item.id)">复制</el-button>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="item.phone" />
            <el-button type="success" @click="copyMessage(item.phone)">复制</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      useAge: '<svg-icon icon-class="dashboard-fill" style="font-size:50px" />',
      userList: [
        { name: '万荣', id: '320481199301165438', phone: '18014323202' },
        { name: '', id: '', phone: '' },
        { name: '', id: '', phone: '' },
        { name: '', id: '', phone: '' },
        { name: '', id: '', phone: '' }
      ]
    }
  },
  created() {},
  methods: {
    copyMessage(msg) {
      this.$copyText(msg).then(e => {
        this.$message.success('复制成功')
      }, (e) => {
        this.$message.success('复制失败')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/mixin.scss';
@include themify($themes) {
  .title{
      color: themed('them-title-color');
  }
}
.yuyue-container{
  width: 400px;
  // margin-top: 100px;
  border: 2px solid #D2D8EA;
  padding: 0px 10px;
  background: #fff;
  .single{
    // border: 1px solid #fff;
    margin: 10px 0;
    background: #E9EEF3;
    padding: 28px 10px 10px;
  }
  ::v-deep .el-form-item__content{
    display: flex;
  }
  ::v-deep button{
    margin-left: 10px;
  }
}
</style>
