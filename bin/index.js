#!/usr/bin/env node
const { program } = require('commander')
const fs = require('fs')
const cheerio = require('cheerio')

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

console.log('---html 文件内容---')
console.log(html)

