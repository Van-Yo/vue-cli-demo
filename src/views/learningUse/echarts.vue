<template>
  <div class="container-area">
    <div id="main" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  components: {},
  data() {
    return {
      result: [
        { createDt: '2022-04-02', max: 48.7, min: 21.12 },
        { createDt: '2022-04-03', max: 48.1, min: 23.12 },
        { createDt: '2022-04-04', max: 48.2, min: 20.12 },
        { createDt: '2022-04-05', max: 48.3, min: 22.12 },
        { createDt: '2022-04-06', max: 48.4, min: 25 },
        { createDt: '2022-04-07', max: 48.5, min: 19.12 },
        { createDt: '2022-04-08', max: 48.9, min: 27.12 },
        { createDt: '2022-04-09', max: 48.7, min: 22.12 }
      ]
    }
  },
  created() {},
  mounted() {
    this.initChart()
    // this.initMap()
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      // 定义折线图的数据
      // 定义数据
      // 定义折线图的数据
      const dataObj = this.result
      const dataTimes = []
      dataObj.map(v => {
        dataTimes.push(v.createDt)
        const keymap = { max: 'value' }
        Object.keys(v).map(k => {
          const newKey = keymap[k]
          if (newKey) {
            v[newKey] = v[k]
            delete v[k]
          }
        })
      })
      // 绘制图表
      myChart.setOption({
        tooltip: { formatter: e => {
          console.log(e)
          var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#1197b8"></span>'
          return `
	              日期: ${e.data.createDt}<br/>
	              ${e.marker} 最大值: ${e.data.value}<br/>
	              ${dotHtml} 最小值: ${e.data.min}
	            `
        }
        },
        xAxis: { data: dataTimes },
        yAxis: {
          type: 'value'
        },
        series: [{ data: dataObj, type: 'line' }]
      })
      // 响应容器大小的变化
      window.onresize = function() {
        myChart.resize()
      }
    },
    initMap() {
      var myChart = echarts.init(document.getElementById('main'))
      axios.get('11223.json').then(res => {
        console.log(res)
        echarts.registerMap('地图', res.data)
        const option = {
          series: [
            {
              name: '地图',
              type: 'map',
              map: '地图',
              itemStyle: {
                areaColor: '#11225c',
                borderColor: '#00A5FE',
                borderWidth: 1
              },
              label: {
                show: true,
                color: '#fff'
              }
            }
          ]
        }
        myChart.setOption(option)
      })
      myChart.on('click', params => {
        console.log(params)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area{
    #main{
        width: 100vw;
        height: 100vh;
    }
}
</style>
