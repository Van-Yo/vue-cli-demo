# Vue-cli Demo

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Node version
v10.15.1

### 打包no-logo
1. 所有代码都现在主线main上开发
2. 开发完，先提交到origin/main
3. 切换到new_production分支
4. 将main分支合并到new_production分支
5. 也同样提交到origin/new_production
6. 最后打包


### 花样console.log
```js
this.$log('This is an success message.')
this.$log.info('This is an info message.')
this.$log.error('This is an error message.')
this.$log.warning('This is an warning message.')
this.$log.success('This is an success message.')
this.$log.picture('https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2024%2F0514%2Fd0ea93ebj00sdgx56001xd200u000gtg00hz00a2.jpg&thumbnail=660x2147483647&quality=80&type=jpg')
const data = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 }
]
this.$log.table(data)
```