<template>
  <div class="container-area">
    <el-upload
      ref="upload"
      class="upload-demo"
      action=""
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
    <!-- <el-button slot="trigger" size="small" type="primary" @click="picLook()">查看图片</el-button> -->
    <el-button slot="trigger" size="small" type="primary" @click="base64ToBlob()">base64转Blob</el-button>
    <el-button slot="trigger" size="small" type="primary" @click="base64ToArrayBuffer(base64)">base64转ArrayBuffer</el-button>
    <el-button slot="trigger" size="small" type="primary" @click="arrayBufferToBase64()">ArrayBuffer转base64</el-button>
    <p>{{ blob }}</p>
    <el-button slot="trigger" size="small" type="primary" @click="blob2File(blob,'新文件')">Blob转File</el-button>
    <el-button slot="trigger" size="small" type="primary" @click="blob2ArrayBuffer(blob,'新文件')">Blob转ArrayBuffer</el-button>
    <el-button slot="trigger" size="small" type="primary" @click="downloadBlobUrl">Blob URL 用于文件上传下载</el-button>
    <p />
    <img :src="base64" alt="">
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
      jsonInput: null,
      imgUrl: null,
      fileFile: null
    }
  },
  methods: {
    submitUpload() {
    //   this.$refs.upload.submit()
      console.log(this.file)
      this.$message.success('请在跳转页面找到upload(file)方法，将this.file传入即可')
      setTimeout(() => {
        window.location.href = 'https://van-yo.github.io/2022/06/24/imgUrl2FileUpload/'
      }, 3000)
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
    blobToBase64(file) {
      console.log(file)
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        console.log(reader.result)
        this.base64 = reader.result
      })
      reader.readAsDataURL(file)
    },
    // base64 => File
    base64ImgtoFile(baseUrl, filename = '新建文本文档') {
      const arr = baseUrl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const suffix = mime.split('/')[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      console.log(mime, suffix)
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
      this.fileFile = this.base64ImgtoFile(this.base64)
      console.log(this.fileFile)
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
    },
    // base64 => ArrayBuffer
    base64ToArrayBuffer(base64) {
      var binary_string = window.atob(base64)
      var len = binary_string.length
      var bytes = new Uint8Array(len)
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i)
      }
      console.log(bytes)
      return bytes
    },
    // ArrayBuffer => base64
    arrayBufferToBase64(data = [1, 2, 3]) {
      var str = ''
      for (var i = 0; i < data.length; i++) {
        str += String.fromCharCode(data[i])
      }
      console.log(window
        .btoa(str)
        .split(/(.{75})/)
        .join('\n')
        .replace(/\n+/g, '')
        .trim())
      return window
        .btoa(str)
        .split(/(.{75})/)
        .join('\n')
        .replace(/\n+/g, '')
        .trim()
    }
  }
}
</script>

<style lang="scss" scoped>
.container-area{

}
</style>
