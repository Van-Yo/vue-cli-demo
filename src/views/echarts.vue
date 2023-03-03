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
    return {}
  },
  created() {},
  mounted() {
    // this.initChart()
    this.initMap()
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      // 绘制图表
      myChart.setOption({
        xAxis: {
          type: 'category',
          data: ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie']
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            name: '2015',
            data: [89.3, 92.1, 94.4, 85.4]
          },
          {
            type: 'bar',
            name: '2016',
            data: [95.8, 89.4, 91.2, 76.9]
          },
          {
            type: 'bar',
            name: '2017',
            data: [97.7, 83.1, 92.5, 78.1]
          }
        ]
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
