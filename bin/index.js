#!/usr/bin/env node
const { program } = require('commander')
const fs = require('fs')
const cheerio = require('cheerio')

const manifestDemo = 
`
{
  "name": "html_demo",
  "short_name": "html_demo",
  "icons": [],
  "display": "standalone",
  "theme_color": "#ffffff",
  "background_color": "#ffffff"
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

// fs.writeFileSync(options.html, html)

const pathArray = options.html.split('/')

pathArray.pop()

const parentPath = pathArray.join('/') + '/'

fs.writeFileSync(`${parentPath}manifest.json`, manifestDemo)
fs.writeFileSync(`${parentPath}sw.js`, serviceWorkerDemo)

console.log('-----parentPath-----')
console.log(parentPath)



console.log('----HTML文件写入成功----')



