<template>
  <div class="container-area">
    <div class="buttonClass them-btn-primary" @click="opendAddDialog">新增弹框</div>
    <div class="buttonClass them-btn-primary" @click="opendEditDialog">修改弹框</div>
    <Dialog :dialog="dialog" @reloadtable="handleQuery" />
  </div>
</template>

<script>
import Dialog from '@/components/Dialog.vue'
export default {
  components: { Dialog },
  data() {
    return {
      dialog: {
        visible: false,
        name: '11111',
        region: '22',
        date1: '2023-06-08',
        date2: '11:51:01',
        delivery: true,
        type: ['美食/餐厅线上活动'],
        resource: '线上品牌商赞助',
        desc: 'desc',
        id: ''
      }
    }
  },
  watch: {
    'dialog.visible'(val) {
      if (!val) {
        console.log('parent close')
      }
    }
  },
  created() {},
  methods: {
    opendAddDialog() {
      this.dialog = {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: true,
        type: [],
        resource: '',
        desc: '',
        id: null,
        visible: true
      }
    },
    opendEditDialog() {
      this.dialog = {
        name: '11111',
        region: '22',
        date1: new Date(2023, 9, 10, 18, 40),
        date2: new Date(2016, 9, 10, 18, 40),
        delivery: true,
        type: ['美食/餐厅线上活动'],
        resource: '线上品牌商赞助',
        desc: 'desc',
        id: 11223872,
        visible: true
      }
    },
    handleQuery(data) {
      console.log('parent', data)
      if (data.id) {
        console.log('parent:edit')
      } else {
        console.log('parent:add')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area {
  display: flex;
  flex-wrap: wrap;
  align-content:flex-start;
    .buttonClass {
        font-size: 15px;
        font-family: Arial;
        width: 140px;
        height: 50px;
        border-width: 1px;
        color: #ffffff;
        border-color: #337fed;
        font-weight: bold;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        // box-shadow: inset 0px 1px 0px 0px #97c4fe;
        text-shadow: inset 0px 1px 0px #1570cd;
        background: linear-gradient(#3d94f6, #1e62d0);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-right: 10px;
        transition: all 3s ease;
        margin-bottom: 15px;
    }

    .buttonClass:hover {
        background: linear-gradient(#1e62d0, #3d94f6);
    }
}
</style>
