<template>
  <div class="container-area">
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column type="index" align="center" label="序号" />
      <el-table-column label="抓拍时间(小时)" align="center" prop="hour">
        <!--
            template中包含两个div，用v-if和v-else控制显示
            v-else中是当前单元格数据-hour
            v-if是可修改的临时数据-temphour+保存+取消
            逻辑就是用户点击单元格，会将hour——>temphour，然后用户修改temphour，修改完之后再将将temphour——>hour
        -->
        <template slot-scope="scope">
          <div v-if="scope.row.showhour" class="insert-wrap">
            <el-input-number
              v-model="scope.row.temphour"
              controls-position="right"
              :min="0"
              :max="23"
              size="mini"
            />
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-check"
              @click="saveTableEdit(scope.row, 'hour')"
            />
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-close"
              @click="cancelTableEdit(scope.row, 'hour')"
            />
          </div>
          <div
            v-else
            class="insert-label"
            @click="startInsert(scope.row, 'hour', scope)"
          >
            {{ scope.row.hour }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="抓拍时间(分钟)"
        align="center"
        prop="minute"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.showminute" class="insert-wrap">
            <el-input-number
              v-model="scope.row.tempminute"
              controls-position="right"
              :min="0"
              :max="59"
              size="mini"
            />
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-check"
              @click="saveTableEdit(scope.row, 'minute')"
            />
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-close"
              @click="cancelTableEdit(scope.row, 'minute')"
            />
          </div>

          <div
            v-else
            class="insert-label"
            @click="startInsert(scope.row, 'minute', scope)"
          >
            {{ scope.row.minute }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="预置位" align="center" prop="presettingNo">
        <template slot-scope="scope">
          <div v-if="scope.row.showpresettingNo" class="insert-wrap">
            <el-select
              v-model="scope.row.temppresettingNo"
              size="mini"
              style="width: 90px"
            >
              <el-option
                v-for="item in allPresetList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-check"
              @click="saveTableEdit(scope.row, 'presettingNo')"
            />
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-close"
              @click="cancelTableEdit(scope.row, 'presettingNo')"
            />
          </div>

          <div
            v-else
            class="insert-label"
            @click="startInsert(scope.row, 'presettingNo', scope)"
          >
            {{ scope.row.presettingName }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      originData: 'BwABBx4BCAABCB4BCQABCR4BCgABCh4BCwABCx4BDAABDB4BDQABDR4BDgABDh4BDwABDx4BEAABEB4BEQABER4BEgAB',
      tableData: [],
      selectRows: []
    }
  },
  computed: {
    allPresetList() {
      const list = []
      for (let i = 1; i < 256; i++) {
        list.push({ value: i, label: i })
      }
      return list
    }
  },
  created() {
    this.originData2TableData()
  },
  methods: {
    originData2TableData() {
      const data = this.base64ToArrayBuffer(this.originData)
      //   console.log('1111111111111111', data)
      const needSortList = []
      for (let i = 1; i < data.length / 3 + 1; i++) {
        needSortList.push([data[i * 3 - 3], data[i * 3 - 2], data[i * 3 - 1]])
      }
      // console.log(needSortList)
      const sortedList = needSortList.sort(function(a, b) {
        return a[0] * 60 + a[1] - (b[0] * 60 + b[1])
      })
      //   console.log(sortedList)
      let lastArr = []
      sortedList.forEach((item) => {
        lastArr = lastArr.concat(item)
      })
      const list = this.changeHandledListToTableData(lastArr)
      this.tableData = list
    },
    // 将字符串转换成类型化数组
    base64ToArrayBuffer(base64) {
      var binary_string = window.atob(base64)
      var len = binary_string.length
      var bytes = new Uint8Array(len)
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i)
      }
      return bytes
    },
    // 将处理好的数组转成表格完整需要的数据
    changeHandledListToTableData(list) {
      // console.log(list)
      const tableList = []
      for (let i = 1; i < list.length / 3 + 1; i++) {
        tableList.push({
          hour: list[i * 3 - 3],
          minute: list[i * 3 - 2],
          presettingName: list[i * 3 - 1] || 1,
          presettingNo: list[i * 3 - 1] || 1,
          showhour: false,
          showminute: false,
          showpresettingNo: false,
          temphour: list[i * 3 - 3], // 表格的临时数据
          tempminute: list[i * 3 - 2], // 表格的临时数据
          temppresettingNo: list[i * 3 - 1] || 1, // 表格的临时数据
          uid: new Date().getTime() + i
        })
      }
      return tableList
    },
    // table多选选中事件
    handleSelectionChange(rows) {
      this.selectRows = rows
      // console.log(this.selectRows)
    },
    saveTableEdit(row, key) {
      row[key] = row['temp' + key] // 再将修改的临时数据保存为最新的表格数据
      if (key === 'presettingNo') {
        const select = this.allPresetList.filter((item) => {
          return item.value === row.presettingNo
        })
        // console.log(select)
        row.presettingName = select[0].label
        row.temppresettingNo = select[0].label
      }
      row['show' + key] = false
    },
    cancelTableEdit(row, key) {
      row['show' + key] = false
    },
    // 点击开始编辑
    startInsert(row, key, scope) {
      // console.log(row, key)
      this.closeOtherInsert()
      row['temp' + key] = row[key] // 将表格原始数据拷贝一份临时数据出来进行修改，修改过程不影响表格原始数据
      row['show' + key] = true
      // console.log(row)
      // console.log(scope);
    },
    closeOtherInsert() {
      this.tableData.map((item) => {
        item.showhour = false
        item.showminute = false
        item.showpresettingNo = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area{
}
</style>
