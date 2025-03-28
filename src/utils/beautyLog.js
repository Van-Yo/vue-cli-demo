// 美化打印实现方法
const prettyLog = () => {
  // console.log(process.env.NODE_ENV)
  const isProduction = process.env.NODE_ENV !== 'development'

  const isEmpty = (value) => {
    return value == null || value === undefined || value === ''
  }
  const prettyPrint = (title, text, color) => {
    if (isProduction) return
    console.log(
      `%c ${title} %c ${text} %c`,
      `background:${color};border:1px solid ${color}; padding:1px; border-radius:2px 0 0 2px; color:#fff;`,
      `border:1px solid ${color}; padding:1px; border-radius:0 2px 2px 0; color:${color};`,
      'background:transparent'
    )
  }
  const info = (textOrTitle, content = '') => {
    const title = isEmpty(content) ? 'Info' : textOrTitle
    const text = isEmpty(content) ? textOrTitle : content
    prettyPrint(title, text, '#909399')
  }
  const error = (textOrTitle, content = '') => {
    const title = isEmpty(content) ? 'Error' : textOrTitle
    const text = isEmpty(content) ? textOrTitle : content
    prettyPrint(title, text, '#F56C6C')
  }
  const warning = (textOrTitle, content = '') => {
    const title = isEmpty(content) ? 'Warning' : textOrTitle
    const text = isEmpty(content) ? textOrTitle : content
    prettyPrint(title, text, '#E6A23C')
  }
  const success = (textOrTitle, content = '') => {
    const title = isEmpty(content) ? 'Success ' : textOrTitle
    const text = isEmpty(content) ? textOrTitle : content
    prettyPrint(title, text, '#67C23A')
  }
  const table = () => {
    const data = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 }
    ]
    console.log(
      '%c id%c name%c age',
      'color:white; background-color:black; padding:2px 10px;',
      'color:white; background-color:black; padding:2px 10px;',
      'color:white; background-color:black; padding:2px 10px;'
    )

    data.forEach((row) => {
      console.log(
        `%c ${row.id} %c ${row.name} %c ${row.age} `,
        'color:black; background-color:lightgray; padding:2px 10px;',
        'color:black; background-color:lightgray; padding:2px 10px;',
        'color:black; background-color:lightgray; padding:2px 10px;'
      )
    })
  }
  const picture = (url, scale = 1) => {
    if (isProduction) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const c = document.createElement('canvas')
      const ctx = c.getContext('2d')
      if (ctx) {
        c.width = img.width
        c.height = img.height
        ctx.fillStyle = 'red'
        ctx.fillRect(0, 0, c.width, c.height)
        ctx.drawImage(img, 0, 0)
        const dataUri = c.toDataURL('image/png')

        console.log(
          `%c sup?`,
          `font-size:1px;
                      padding:${Math.floor((img.height * scale) / 2)}px ${Math.floor((img.width * scale) / 2)}px;
                      background-image:url(${dataUri});
                      background-repeat:no-repeat;
                      background-size:${img.width * scale}px ${img.height * scale}px;
                      color:transparent;
                      `
        )
      }
    }
    img.src = url
  }

  const log = (text) => {
    success(text) // 默认调用 success 方法
  }

  // 创建一个对象，使用代理模式来处理函数调用
  const logger = Object.assign(
    (text) => log(text), // 代理调用
    { info, error, warning, success, picture, table } // 保留其他方法
  )
  // console.log(logger)

  return logger
}
const logger = prettyLog()
export default logger

