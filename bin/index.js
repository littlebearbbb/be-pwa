#!/usr/bin/env node
const { program } = require('commander')
const fs = require('fs')
const cheerio = require('cheerio')

const manifestDemo = 
`
{
  "name": "auto-pwa",
  "short_name": "auto-pwa",
  "theme_color":"#242726",
  "icons": [{
    "src": "./img/icons/pwaIcon-144x144.png",
    "type": "image/png",
    "sizes": "144x144"
  }],
  "start_url":".",
  "display": "fullscreen",
  "background_color":"#000000"
}
`

const serviceWorkerDemo =
`
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js')
if (workbox) {
  workbox.core.setCacheNameDetails({
    prefix: 'html-demo',
    suffix: 'v0.0.1'
  })
  workbox.core.skipWaiting()
  workbox.core.clientsClaim()

  workbox.precaching.precacheAndRoute(self.__precacheManifest || [])

  workbox.routing.registerRoute(
    /.*\.css/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'css-cache'
    })
  )

  workbox.routing.registerRoute(
    /.*\.js/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'js-cache'
    })
  )

  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 设置缓存有效期为30天
        })
      ]
    })
  )
}
`

program.option('-h, --html [htmlUrl]', 'add manifest & sw', './index.html')

program.parse()

const options = program.opts()

const data = fs.readFileSync(options.html)

//加载HTML字符串
const $ = cheerio.load(data.toString())

$('title').before('<link rel="manifest" href="./manifest.json" />')
$('body').append(`
 <script>
   if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      for (let reg of regs) {
        reg.unregister()
      }
      navigator.serviceWorker.register('./sw.js')
    })
   }
 </script>
`)

//HTML文本内容
const html = $.html()

fs.writeFileSync(options.html, html)

const pathArray = options.html.split('/')

pathArray.pop()

const parentPath = pathArray.join('/')

fs.writeFileSync(`${parentPath}/manifest.json`, manifestDemo)
fs.writeFileSync(`${parentPath}/sw.js`, serviceWorkerDemo)

const copyFromPathArr = ['img', 'icons']

copyFromPathArr.reduce((acc, v) => {
  acc += `/${v}`
  
  if (!fs.existsSync(`${parentPath}${acc}`)) {
    fs.mkdirSync(`${parentPath}${acc}`)
  }
  return acc
}, '')

const copyFromPath = `${parentPath}/${copyFromPathArr.join('/')}/pwaIcon-144x144.png`

const readStream = fs.createReadStream(`${__dirname}/pwaIcon-144x144.png`)
const writeStream = fs.createWriteStream(copyFromPath)
readStream.pipe(writeStream)
console.log('----转换成功----')




