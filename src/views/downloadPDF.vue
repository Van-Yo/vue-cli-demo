<template>
  <div>
    <div ref="toPdf" class="pdf-area">
      <h1>
        第一回 灵根育孕源流出 心性修持大道生
      </h1>
      <p>
        盖闻天地之数，有十二万九千六百岁为一元。将一元分为十二会，乃子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥之十二支也。每会该一万八百岁。且就一日而论：子时得阳气，而丑则鸡鸣；寅不通光，而卯则日出；辰时食后，而巳则挨排；日午天中，而未则西蹉；申时晡而日落酉，戌黄昏而人定亥。譬于大数，若到戌会之终，则天地昏鏤而万物否矣。
      </p>
      <p>
        再去五千四百岁，交亥会之初，则当黑暗，而两间人物俱无矣，故曰混沌。又五千四百岁，亥会将终，贞下起元，近子之会，而复逐渐开明。邵康节曰：“冬至子之半，天心无改移。一阳初动处，万物未生时。”到此天始有根。
      </p>
      <p>
        再五千四百岁，正当子会，轻清上腾，有日有月有星有辰。日月星辰，谓之四象。故曰天开于子。又经五千四百岁，子会将终，近丑之会，而逐渐坚实。《易》曰：“大哉乾元！至哉坤元！万物资生，乃顺承天。”至此，地始凝结。
      </p>
      <p>
        再五千四百岁，正当丑会，重浊下凝，有水有火有山有石有土。水火山石土，谓之五形。故曰地辟于丑。又经五千四百岁，丑会终而寅会之初，发生万物。历曰：“天气下降，地气上升；天地交合，群物皆生。”至此，天清地爽，阴阳交合。
      </p>
      <p>
        再五千四百岁，正当寅会，生人生兽生禽，正谓天地人，三才定位。故曰人生于寅。
      </p>
      <p>
        感盘古开辟，三皇治世，五帝定伦，世界之间，遂分为四大部洲：曰东胜神洲，曰西牛贺洲，曰南赡部洲，曰北俱芦洲。这部书单表东胜神洲。海外有一国土，名曰傲来国。国近大海，海中有一座名山，唤为花果山。此山乃十洲之祖脉，三岛之来龙，自开清浊而立，鸿蒙判后而成。真个好山！
      </p>
    </div>
    <button @click="toPdfFn">导出pdf</button>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import JSPDF from 'jspdf'
export default {
  methods: {
    toPdfFn() {
      this.htmlToPdf('文件名', '时间')
    },
    htmlToPdf(name, time) {
      const element = this.$refs.toPdf
      html2canvas(element, {
        logging: false
      }).then(function(canvas) {
        const pdf = new JSPDF('p', 'mm', 'a4') // A4纸，纵向
        const ctx = canvas.getContext('2d')
        const a4w = 190
        const a4h = 277 // A4大小，210mm x 297mm，四边各保留20mm的边距，显示区域190x277
        const imgHeight = Math.floor(a4h * canvas.width / a4w) // 按A4显示比例换算一页图像的像素高度
        let renderedHeight = 0
        while (renderedHeight < canvas.height) {
          const page = document.createElement('canvas')
          page.width = canvas.width
          page.height = Math.min(imgHeight, canvas.height - renderedHeight) // 可能内容不足一页

          // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
          page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight,
            canvas.height - renderedHeight)), 0, 0)
          pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4w, Math.min(a4h, a4w * page.height /
            page.width)) // 添加图像到页面，保留10mm边距

          // 如果后面还有内容，添加一个空页
          renderedHeight += imgHeight
          if (renderedHeight < canvas.height) {
            pdf.addPage()
          }
        }
        pdf.save(name + time)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.pdf-area{
  width: 500px;
  height: 800px;
  background: #fff;
  margin:0 auto;
  padding: 10px;
  overflow: auto;
  h1{
    margin-bottom: 10px;
  }
  p{
    text-align: left;
    text-indent: 30px;
    line-height: 26px;
  }
}
</style>
