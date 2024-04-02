<template>
  <div>
    <div class="rate-area">
      <div class="single">
        <el-row>
          <h2>等额本息贷款利率计算</h2>
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="贷款总额">
              <el-input v-model="form.money">
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="贷款期限">
              <el-input v-model="form.inputQi">
                <template slot="append">月</template>
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="贷款期限">
              <el-select v-model="form.year" placeholder="请选择活动区域">
                <el-option
                  v-for="item in yearList"
                  :key="item.label"
                  :label="item.label + '年 （' + item.label * 12 + '月）'"
                  :value="item.value"
                />
              </el-select>
            </el-form-item> -->
            <el-form-item label="贷款利率">
              <el-input v-model="form.rate">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="首次还款年月">
              <el-date-picker
                v-model="form.startDate"
                type="month"
                placeholder="选择月"
                value-format="yyyy-MM"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即计算</el-button>
              <!-- <el-button type="primary" @click="ti_qian">提前还贷</el-button> -->
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>

          <el-table :data="brief">
            <el-table-column prop="moon" label="每月还款" />
            <el-table-column prop="allRate" label="总利息" />
            <el-table-column prop="ben" label="总成本" />
            <el-table-column prop="all" label="总偿还" />
          </el-table>
          <el-button
            type="primary"
            @click="
              () => {
                moreDetail = !moreDetail
              }
            "
          >{{ moreDetail ? '隐藏' : '详情' }}</el-button>
          <el-button type="success" @click="exportTable">导出</el-button>
        </el-row>
        <el-row v-show="moreDetail" class="detail">
          <el-table
            ref="detailTable"
            :data="tableData"
            highlight-current-row
            stripe
          >
            <el-table-column type="index" width="50" />
            <el-table-column prop="month" label="月份" />
            <el-table-column prop="moon" label="每月还款" />
            <el-table-column prop="moon_xi" label="偿还利息" />
            <el-table-column prop="yi_xi" label="已还总利息" />
            <el-table-column prop="sheng_xi" label="剩余利息" />
            <el-table-column prop="moon_ben" label="偿还本金" />
            <el-table-column prop="yi_ben" label="已还总本金" />
            <el-table-column prop="new_remaining_principal" label="剩余本金" />
          </el-table>
        </el-row>
        <!-- <el-row class="detail">
          <el-table :data="ti_qian_table" highlight-current-row stripe>
            <el-table-column type="index" width="50" />
            <el-table-column prop="month" label="月份" />
            <el-table-column prop="save_interest" label="剩下利息" />
          </el-table>
        </el-row> -->
      </div>
      <div class="single">
        <el-row>
          <h2>等额本息提前还贷计算</h2>
          <el-form ref="form-tiqian" :model="formTiqian" label-width="120px">
            <el-form-item label="还贷总额">
              <el-input v-model="formTiqian.money">
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="贷款期限">
              <el-input placeholder="不变" :disabled="true" />
            </el-form-item>
            <el-form-item label="贷款利率">
              <el-input v-model="formTiqian.rate">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="计划还款年月">
              <el-date-picker
                v-model="formTiqian.startDate"
                type="month"
                placeholder="选择月"
                value-format="yyyy-MM"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="tiqianOnSubmit"
              >立即计算</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table :data="new_payment_brief">
            <el-table-column prop="moon" label="每月还款" />
            <el-table-column prop="allRate" label="总利息" />
            <el-table-column prop="ben" label="总成本" />
            <el-table-column prop="all" label="总偿还" />
            <el-table-column prop="save_interest" label="省下总利息" />
          </el-table>
          <el-button
            type="primary"
            @click="
              () => {
                newMoreDetail = !newMoreDetail
              }
            "
          >{{ newMoreDetail ? '隐藏' : '详情' }}</el-button>
        </el-row>
        <el-row v-show="newMoreDetail" class="detail">
          <el-table :data="new_payment_detail" stripe>
            <el-table-column type="index" width="50" />
            <el-table-column prop="month" label="月份" />
            <el-table-column prop="moon" label="每月还款" />
            <el-table-column prop="moon_xi" label="偿还利息" />
            <el-table-column prop="yi_xi" label="已还总利息" />
            <el-table-column prop="sheng_xi" label="剩余利息" />
            <el-table-column prop="moon_ben" label="偿还本金" />
            <el-table-column prop="yi_ben" label="已还总本金" />
            <el-table-column prop="new_remaining_principal" label="剩余本金" />
          </el-table>
        </el-row>
      </div>
      <div class="single">
        <el-row>
          <h2>等额本息提前还贷省下利息计算</h2>
          <el-form ref="form" :model="formTiqianSheng" label-width="120px">
            <el-form-item label="手上闲钱">
              <el-input v-model="formTiqianSheng.money">
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="贷款利率">
              <el-input v-model="formTiqianSheng.rate" disabled>
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="理财利率">
              <el-input v-model="formTiqianSheng.licaiRate">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="首次还款年月">
              <el-date-picker
                v-model="form.startDate"
                type="month"
                placeholder="选择月"
                value-format="yyyy-MM"
              />
            </el-form-item> -->
            <el-form-item>
              <!-- <el-button type="primary" @click="onSubmit">立即计算</el-button> -->
              <el-button type="primary" @click="ti_qian">提前还贷</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <!-- <el-row>
          <el-table :data="brief">
            <el-table-column prop="moon" label="每月还款" />
            <el-table-column prop="allRate" label="总利息" />
            <el-table-column prop="ben" label="总成本" />
            <el-table-column prop="all" label="总偿还" />
          </el-table>
          <el-button
            type="primary"
            @click="
              () => {
                moreDetail = !moreDetail
              }
            "
          >{{ moreDetail ? '隐藏' : '详情' }}</el-button>
        </el-row> -->
        <!-- <el-row v-show="moreDetail" class="detail">
          <el-table ref="detailTable" :data="tableData" highlight-current-row stripe>
            <el-table-column type="index" width="50" />
            <el-table-column prop="month" label="月份" />
            <el-table-column prop="moon" label="每月还款" />
            <el-table-column prop="moon_xi" label="偿还利息" />
            <el-table-column prop="yi_xi" label="已还总利息" />
            <el-table-column prop="sheng_xi" label="剩余利息" />
            <el-table-column prop="moon_ben" label="偿还本金" />
            <el-table-column prop="yi_ben" label="已还总本金" />
            <el-table-column prop="new_remaining_principal" label="剩余本金" />
          </el-table>
        </el-row> -->
        <el-row class="detail">
          <el-table :data="ti_qian_table" highlight-current-row stripe>
            <el-table-column type="index" width="50" />
            <el-table-column prop="month" label="月份" />
            <el-table-column prop="save_interest" label="省下利息" />
          </el-table>
        </el-row>
      </div>
    </div>
    <div class="echarts"><div id="tiqian" /></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
export default {
  components: {},
  data() {
    return {
      form: {
        money: 49.500598,
        year: 30,
        rate: '3.95',
        startDate: '2024-04',
        inputQi: 161
      },
      formTiqian: {
        money: 20,
        year: 30,
        rate: '5.88',
        startDate:
          new Date().getFullYear() +
          '-' +
          ((new Date().getMonth() + 1).toString().length === 1
            ? '0' + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1)
      },
      formTiqianSheng: {
        money: 20,
        licaiRate: '3',
        rate: '5.88'
      },
      moon: 0, // 每月还款额
      yi_ben: 0, // 以还本金
      z_xi: 0,
      tableData: [],
      yihuanQi: 0,
      brief: [],
      allRate: 0,
      moreDetail: true, // 显示or隐藏表格
      ti_qian_table: [],

      // 提前还贷后
      new_remaining_principal: 0, // 提前还贷后欠的总本金
      new_month_payment: 0, // 提前还贷后月还
      new_month_number: 0, // 提前还贷后剩下还款期数
      new_total_interest: 0, // 提前还贷后需要偿还的总利息
      new_payment_detail: [], // 提前还贷后还款详情
      new_payment_brief: [], // 提前还贷后还款概略
      newMoreDetail: true, // 提前还贷显示or隐藏表格
      save_interest: 0 // 提前还贷剩下的总利息
    }
  },
  computed: {
    yearList() {
      const list = []
      for (let i = 1; i < 31; i++) {
        list.push({ label: i, value: i })
      }
      return list
    },
    ben() {
      return this.form.money * 10000
    },
    lv() {
      return this.form.rate / 100 / 12
    },
    qi() {
      return 161
    },
    tiqianHuanBen() {
      return this.formTiqian.money * 10000
    },
    shoushangXianqian() {
      return this.formTiqianSheng.money * 10000
    }
  },
  created() {},
  methods: {
    exportTable() {
      const worksheet = XLSX.utils.json_to_sheet(this.tableData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.ms-excel' })
      FileSaver.saveAs(blob, 'table') // 下载文件 文件名
    },
    painEcharts() {
      const month = this.ti_qian_table.map((item) => item.month)
      const save_interest = this.ti_qian_table.map(
        (item) => +item.save_interest
      )
      const li_cai_recerve = this.ti_qian_table.map(
        (item) => +item.li_cai_recerve
      )
      const cha_zhi = this.ti_qian_table.map((item) => +item.cha_zhi)
      console.log(month)
      var chartDom = document.getElementById('tiqian')
      var myChart = echarts.init(chartDom)
      var option

      option = {
        title: {
          text: '提前还贷期望'
        },
        tooltip: {
          trigger: 'axis'
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: month
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '提前还贷省下利息',
            type: 'line',
            data: save_interest
          },
          {
            name: '理财收益',
            type: 'line',
            data: li_cai_recerve
          },
          {
            name: '理财期望',
            type: 'line',
            data: cha_zhi
          }
        ]
      }

      option && myChart.setOption(option)
    },
    ti_qian() {
      // this.moreDetail = false
      // new_remaining_principal,new_month_number，
      // 2019-01:360-1 2019-02:360-2
      const list = []
      for (let i = 0; i < this.qi - 1; i++) {
        if (
          this.tableData[i + 1].new_remaining_principal >=
          this.shoushangXianqian
        ) {
          // 已还期数
          const yi_huan_qi = i + 2
          // 已还本金
          const new_remaining_principal =
            this.tableData[i + 1].new_remaining_principal -
            this.shoushangXianqian
          const new_month_payment = this.moonPayCompute(
            new_remaining_principal,
            this.lv,
            this.qi - yi_huan_qi
          )

          const new_total_interest = this.allRateCompute(
            new_month_payment,
            this.qi - yi_huan_qi,
            new_remaining_principal
          )
          const save_interest = (
            +this.tableData[i + 1].sheng_xi - +new_total_interest
          ).toFixed(2)
          const li_cai_recerve =
            ((this.shoushangXianqian * +this.formTiqianSheng.licaiRate) /
              100 /
              12) *
            (this.qi - yi_huan_qi)
          list.push({
            save_interest,
            month: this.tableData[i + 1].month,
            li_cai_recerve,
            cha_zhi: +li_cai_recerve - +save_interest
          })
        }
      }
      console.log(1111, list)
      this.ti_qian_table = list
      this.painEcharts()
    },
    // 计算下个月月份
    computeNextMonth(month) {
      const startDateList = month.split('-')
      return startDateList[1] < 12
        ? startDateList[0] + '-' + (+startDateList[1] + 1)
        : +(startDateList[0] + 1) + '-' + startDateList[1]
    },
    tiqianOnSubmit() {
      // 已还期数
      const startDateList = this.form.startDate.split('-')
      const tiqianStartDateList = this.formTiqian.startDate.split('-')
      const s =
        +tiqianStartDateList[0] * 12 +
        +tiqianStartDateList[1] -
        (+startDateList[0] * 12 + +startDateList[1]) +
        1
      this.yihuanQi = s
      console.log(this.tableData[this.yihuanQi - 1])
      this.$refs.detailTable.setCurrentRow(this.tableData[this.yihuanQi - 1])

      // 剩下期数
      this.new_month_number = this.qi - this.yihuanQi
      console.log(this.yihuanQi, this.new_month_number)
      // 已还本金，加上提前还款总额
      this.new_remaining_principal =
        this.tableData[s - 1].new_remaining_principal - this.tiqianHuanBen

      // 新每月还款
      this.new_month_payment = this.moonPayCompute(
        this.new_remaining_principal,
        this.lv,
        this.new_month_number
      )
      console.log(this.new_month_payment)

      this.new_total_interest = this.allRateCompute(
        this.new_month_payment,
        this.new_month_number,
        this.new_remaining_principal
      )
      this.save_interest = (
        +this.tableData[this.yihuanQi - 1].sheng_xi - +this.new_total_interest
      ).toFixed(2)
      this.new_payment_brief = [
        {
          moon: this.new_month_payment.toFixed(2),
          allRate: this.new_total_interest.toFixed(2),
          ben: this.new_remaining_principal.toFixed(2),
          all: (this.new_total_interest + this.new_remaining_principal).toFixed(
            2
          ),
          save_interest: this.save_interest
        }
      ]
      this.new_payment_detail = this.moonPayDetail(
        this.new_remaining_principal,
        0,
        0,
        this.lv,
        this.new_month_number,
        this.new_month_payment,
        this.formTiqian.startDate,
        true
      )
    },
    onSubmit() {
      console.log('=================', this.form.inputQi)
      this.moon = this.moonPayCompute(this.ben, this.lv, this.form.inputQi)
      this.allRate = this.allRateCompute(this.moon, this.form.inputQi, this.ben)
      this.brief = [
        {
          moon: this.moon.toFixed(2),
          allRate: this.allRate.toFixed(2),
          ben: this.ben.toFixed(2),
          all: (this.allRate + this.ben).toFixed(2)
        }
      ]
      this.tableData = this.moonPayDetail(
        this.ben,
        0,
        0,
        this.lv,
        this.form.inputQi,
        this.moon,
        this.form.startDate
      )
    },
    // 总利息
    allRateCompute(moon, qi, ben) {
      return moon * qi - ben
    },
    // 每月还贷计算
    moonPayCompute(ben, lv, qi) {
      return (ben * lv * Math.pow(1 + lv, qi)) / (Math.pow(1 + lv, qi) - 1)
    },
    // 每月还贷明细
    // 贷款总额，已还贷款总本金，已还贷款总利息，贷款利率（月），贷款期数（月），每月还贷，开始还贷时间（年-月）
    moonPayDetail(
      ben,
      yi_ben,
      yi_xi,
      lv,
      qi,
      moon,
      startDate,
      newFlag = false
    ) {
      const payDetail = []
      let list = startDate.split('-')
      if (newFlag) {
        const next_month = this.computeNextMonth(startDate)
        list = next_month.split('-')
        payDetail.push({
          month: startDate,
          moon: +this.moon.toFixed(2) + +this.tiqianHuanBen,
          sheng_xi: this.new_total_interest.toFixed(2),
          new_remaining_principal: this.new_remaining_principal.toFixed(2)
        })
      }
      const xi = this.allRateCompute(moon, qi, ben)

      for (let i = 1; i < qi + 1; i++) {
        // 本月还的利息
        const moon_xi = (ben - yi_ben) * lv
        yi_xi += moon_xi
        const sheng_xi = xi - yi_xi
        // 本月还的本金
        const moon_ben = moon - moon_xi
        yi_ben += moon_ben
        const new_remaining_principal = ben - yi_ben
        payDetail.push({
          yi_ben: yi_ben.toFixed(2),
          yi_xi: yi_xi.toFixed(2),
          moon_xi: moon_xi.toFixed(2),
          moon_ben: moon_ben.toFixed(2),
          moon: moon.toFixed(2),
          new_remaining_principal: new_remaining_principal.toFixed(2),
          sheng_xi: sheng_xi.toFixed(2),
          month:
            +list[0] +
            Math.floor((i + +list[1] - 2) / 12) +
            '-' +
            ((i + +list[1] - 1) % 12 === 0 ? '12' : (i + +list[1] - 1) % 12) + '-18'
        })
      }
      return payDetail
    }
  }
}
</script>

<style lang="scss" scoped>
.rate-area {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
  .single {
    width: 32%;
    border: 1px solid #f0f0f0;
    padding: 5px;
    border-radius: 10px;
  }
  h2 {
    font-size: 22px;
    font-weight: 600;
    margin: 20px;
    margin-left: 10px;
  }
  .detail {
    ::v-deep .el-table__body-wrapper {
      max-height: 800px;
      overflow: auto;
    }
  }
  ::v-deep .el-form-item__content,::v-deep .el-row{
    text-align: left !important;
  }
}
.echarts {
  height: auto;
  #tiqian {
    width: 100%;
    height: 800px;
  }
}

</style>
