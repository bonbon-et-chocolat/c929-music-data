# c929-music-data

## 灵感来自

[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

[jsososo/QQMusicApi](https://github.com/jsososo/QQMusicApi)

[itisbean/php-qq-music-api](https://github.com/itisbean/php-qq-music-api)


## 环境要求

需要 NodeJS 8.12+ 环境

## 可以在Node.js调用
支持Node.js调用,导入的方法为`module`内的文件名,返回内容包含`updatedAt`和`data`,`updatedAt`为时间戳，单位毫秒；`body`为请求返回内容,单数文件名返回类型为Object，复数文件名返回array。
```js
const { kugou_charts, kugou_singer } = require('c929-music-data')
async function main() {
  try {
    const charts = await kugou_charts()
    console.log(charts) // charts.data is an array
    const singer = await kugou_singer()
    console.log(singer) // singer.data is an object
      
  } catch (error) {
    console.log(error)
  }
}
main()
```

## License

[Apache 2.0](https://github.com/Binaryify/NeteaseCloudMusicApi/blob/master/LICENSE)
