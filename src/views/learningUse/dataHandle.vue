<template>
  <div class="container-area">
    <!-- <div>
      数组对象去重
      <el-input v-model="jsonInput" />
      <el-button slot="trigger" size="small" type="primary" @click="filterData()">筛选</el-button>
    </div> -->
    <div>
      xml-＞json

      <el-upload class="upload-demo" :auto-upload="false" :on-change="openFile" action="">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xml(wpml,kml)文件，且不超过500kb</div>
      </el-upload>
      <el-button slot="trigger" size="small" type="primary" @click="change()">转换</el-button>
    </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
export default {
  components: {},
  data() {
    return {
      jsonInput: null,
      xml: ''
    }
  },
  created() {},
  methods: {
    openFile(file) {
      var reader = new FileReader()
      reader.onload = () => {
        if (reader.result) {
          // 打印文件内容
          console.log(reader.result)
          this.xml = reader.result
        }
      }
      reader.readAsText(file.raw)
    },
    change() {
      const TowerPointList = []
      const res = this.$x2js.xml2js(this.xml)
      const json = JSON.parse(JSON.stringify(res))
      const placeMark = json.kml.Document.Folder.Placemark
      // console.log(placeMark)
      placeMark.map((item, index) => {
        if (item.actionGroup) {
          // console.log(item.actionGroup.action)
          for (let i = 0; i < parseInt(item.actionGroup.action.length / 5) * 5; i += 5) {
            // console.log(item.actionGroup.action[i + 1].actionActuatorFuncParam.gimbalPitchRotateAngle, '==================')

            TowerPointList.push({
              'aircraftLongitude': +item.Point.coordinates.split(',')[0],
              'aircraftLatitude': +item.Point.coordinates.split(',')[1],
              'aircraftAltitude': +item.executeHeight.__text,
              'airCraftYawValue': +item.actionGroup.action[i].actionActuatorFuncParam.aircraftHeading.__text,
              'gimbalPitchValue': +item.actionGroup.action[i + 1].actionActuatorFuncParam.gimbalPitchRotateAngle.__text,
              'gimbalRollValue': +item.actionGroup.action[i + 1].actionActuatorFuncParam.gimbalRollRotateAngle.__text,
              'gimbalYawValue': +item.actionGroup.action[i + 1].actionActuatorFuncParam.gimbalYawRotateAngle.__text,
              'opticalZoomFocalLength': +item.actionGroup.action[i + 2].actionActuatorFuncParam.focalLength.__text,
              'isShoot': true,
              'shootPointName': '拍摄点名称',
              'aircraftGroudAltitude': 0,
              'positionType': 3,
              'shootPointType': '杆塔',
              'rtkFusionHeading': 0,
              'createTime': '2022-09-06 17:23:00',
              'isSharePic': false,
              'airCraftPitchValue': 0,
              'pointForLineName': 'left1',
              'airCraftRollValue': 0
            })
          }
        } else {
          TowerPointList.push(
            {
              'aircraftLongitude': +item.Point.coordinates.split(',')[0],
              'aircraftLatitude': +item.Point.coordinates.split(',')[1],
              'aircraftAltitude': +item.executeHeight.__text,
              'airCraftYawValue': 0,
              'gimbalPitchValue': 0,
              'gimbalRollValue': 0,
              'gimbalYawValue': 0,
              'opticalZoomFocalLength': 0,
              'isShoot': false,
              'shootPointName': '安全点',
              'aircraftGroudAltitude': 0,
              'positionType': 3,
              'shootPointType': '杆塔',
              'rtkFusionHeading': 0,
              'createTime': '2022-09-06 17:23:00',
              'isSharePic': false,
              'airCraftPitchValue': 0,
              'pointForLineName': 'left1',
              'airCraftRollValue': 0
            })
        }
      })
      // console.log(TowerPointList)
      const template = {
        'Version': '2.0',
        'mRecordPointList':
        {
          'SafePointlist':
            {
              'SafeLeftLatitude': 0,
              'SafeLeftLongitude': 0,
              'SafeTopAltitude': 0,
              'SafeTopLongitude': 0,
              'SafeTopLatitude': 0,
              'SafeRightLatitude': 0,
              'SafeRightLongitude': 0
            },
          'droneType': 'M30T',
          'Obj_id': '',
          'mVersion': 'PointCloud',
          'lineName':
            {
              'left1':
                {
                  'Oper_id': '',
                  'name': '220kV尧阳2567线',
                  'TowerNO': '004号塔'
                }
            }
        }
      }
      const output = JSON.parse(JSON.stringify(template))
      output.mRecordPointList.TowerPointList = TowerPointList
      // console.log(output)
      // 将json转换成字符串
      const data = JSON.stringify(output)
      const blob = new Blob([data], { type: '' })
      // const textStr = 'aaaaa,bbbbbbb,cccccc'
      FileSaver.saveAs(blob, 'lineData.json')
    }

    // filterData() {
    //   const res = []
    //   JSON.parse(this.jsonInput).map(item => {
    //     const result = res.some(jtem => {
    //       return jtem.fullStationId === item.fullStationId
    //     })
    //     if (!result) {
    //       res.push({
    //         fullStationId: item.fullStationId,
    //         stationName: item.stationName,
    //         fastChargeNum: item.fastChargeNum,
    //         fastChargeIdleNum: item.fastChargeIdleNum,
    //         slowChargeNum: item.slowChargeNum,
    //         slowChargeIdleNum: item.slowChargeIdleNum,
    //         elecMarketPrice: item.elecMarketPrice,
    //         elecSalePrice: item.elecSalePrice,
    //         servMarketPrice: item.servMarketPrice,
    //         servSalePrice: item.servSalePrice,
    //         totalMarketPrice: item.totalMarketPrice,
    //         totalSalePrice: item.totalSalePrice,
    //         sortNum: item.sortNum,
    //         bdLat: item.bdLat,
    //         bdLng: item.bdLng,
    //         address: item.address
    //       })
    //     }
    //   })
    //   console.log(res)
    // }
  }
}
</script>

<style lang="scss" scoped>
.container-area{
}
</style>
