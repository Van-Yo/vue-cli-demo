<template>
  <div class="container-area">
    <el-upload
      ref="upload"
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      :auto-upload="false"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-button slot="trigger" size="small" type="primary" @click="blobToBase64(file)">File转base64</el-button>
    <el-input v-model="base64" />

    <el-button slot="trigger" size="small" type="primary" @click="base64ToFile()">base64转File</el-button>
    <p />
    <el-button slot="trigger" size="small" type="primary" @click="base64ToBlob()">base64转Blob</el-button>
    <p>{{ blob }}</p>
    <el-button slot="trigger" size="small" type="primary" @click="blob2File(blob,'新文件')">Blob转File</el-button>
    <el-button slot="trigger" size="small" type="primary" @click="blob2ArrayBuffer(blob,'新文件')">Blob转ArrayBuffer</el-button>
    <el-button slot="trigger" size="small" type="primary" @click="downloadBlobUrl">Blob URL 用于文件上传下载</el-button>

    <el-input v-model="jsonInput" />
    <el-button slot="trigger" size="small" type="primary" @click="filterData()">筛选</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      // base64: 'data:audio/mpeg;base64,',
      base64: 'data:image/jpeg;base64,',
      file: null,
      blob: '',
      jsonInput: null
    }
  },
  methods: {
    filterData() {
      const res = []
      JSON.parse(this.jsonInput).map(item => {
        const result = res.some(jtem => {
          return jtem.fullStationId === item.fullStationId
        })
        if (!result) {
          res.push({
            fullStationId: item.fullStationId,
            stationName: item.stationName,
            fastChargeNum: item.fastChargeNum,
            fastChargeIdleNum: item.fastChargeIdleNum,
            slowChargeNum: item.slowChargeNum,
            slowChargeIdleNum: item.slowChargeIdleNum,
            elecMarketPrice: item.elecMarketPrice,
            elecSalePrice: item.elecSalePrice,
            servMarketPrice: item.servMarketPrice,
            servSalePrice: item.servSalePrice,
            totalMarketPrice: item.totalMarketPrice,
            totalSalePrice: item.totalSalePrice,
            sortNum: item.sortNum,
            bdLat: item.bdLat,
            bdLng: item.bdLng,
            address: item.address
          })
        }
      })
      console.log(res)
    },
    submitUpload() {
    //   this.$refs.upload.submit()
      console.log(this.fileList)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleChange(file, fileList) {
      this.file = file.raw
      console.log(this.file)
    },
    // blob => base64,File是特殊的blob
    blobToBase64(blob) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        console.log(reader.result)
        this.base64 = reader.result
      })
      reader.readAsDataURL(blob)
    },
    // base64 => File
    base64ImgtoFile(baseUrl, filename = '新建文本文档') {
      const arr = baseUrl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const suffix = mime.split('/')[0]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      })
    },
    // base64 => Blob
    dataURItoBlob(dataURI) {
      var byteString = atob(dataURI.split(',')[1])
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      var ab = new ArrayBuffer(byteString.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], { type: mimeString })
    },
    base64ToFile() {
      const file = this.base64ImgtoFile(this.base64)
      console.log(file)
    },
    base64ToBlob() {
      const blob = this.dataURItoBlob(this.base64)
      this.blob = blob
      console.log(blob)
    },
    /**
     *  @param { blob } blob
     *  @param { string } fileName
     */
    // Blob => File
    blob2File(blob, fileName) {
      blob.lastModifiedDate = new Date()
      blob.name = fileName
      console.log(blob)
      return blob
    },
    // Blob => ArrayBuffer
    blob2ArrayBuffer() {
      const reader = new FileReader()
      reader.onload = function() {
        const content = reader.result
        console.log(content)
      }
      reader.readAsArrayBuffer(this.blob)
    },
    printRes(res) {
      console.log(res)
    },
    // Blob URL 用于文件上传下载
    downloadBlobUrl() {
      var url = window.URL.createObjectURL(this.blob)
      console.log(url)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', 'test.jpg')
      document.body.appendChild(link)
      link.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area{
}
</style>
