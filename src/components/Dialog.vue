<template>
  <div class="detail-dialog">
    <el-dialog
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      :title="title+'活动'"
      destroy-on-close
      width="60vw"
    >
      <div>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item label="活动区域" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker v-model="ruleForm.date1" type="date" placeholder="选择日期" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="date2">
                <el-time-picker v-model="ruleForm.date2" placeholder="选择时间" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="即时配送" prop="delivery">
            <el-switch v-model="ruleForm.delivery" />
          </el-form-item>
          <el-form-item label="活动性质" prop="type">
            <el-checkbox-group v-model="ruleForm.type">
              <el-checkbox label="美食/餐厅线上活动" name="type" />
              <el-checkbox label="地推活动" name="type" />
              <el-checkbox label="线下主题活动" name="type" />
              <el-checkbox label="单纯品牌曝光" name="type" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="特殊资源" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="线上品牌商赞助" />
              <el-radio label="线下场地免费" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动形式" prop="desc">
            <el-input v-model="ruleForm.desc" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即{{ title }}</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Object,
      required: true,
      default() {
        return {
          visible: false,
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          id: null
        }
      }
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        id: null
      },
      rules: {
        name: [
          { required: false, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: false, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: false, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: false, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: false, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: false, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: false, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.dialog.id ? '修改' : '新增'
    }
  },
  watch: {
    'dialog.visible'(val) {
      if (!val) {
        console.log('children close')
        Object.assign(this.$data, this.$options.data())
      } else {
        console.log('children open')
        Object.assign(this.ruleForm, this.dialog)
      }
    }
  },
  created() {
    console.log('components init')
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          this.$emit('reloadtable', this.ruleForm)
          this.dialog.visible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
// el-dialog水平垂直居中
::v-deep .el-dialog{
  display: flex;
  display: -ms-flex; /* 兼容IE */
  flex-direction: column;
  -ms-flex-direction: column; /* 兼容IE */
  margin:0 !important;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  max-height:calc(100% - 30px);
  max-width:calc(100% - 30px);
  .el-dialog__body{
    max-height: 100%;
    flex: 1;
    -ms-flex: 1 1 auto; /* 兼容IE */
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
