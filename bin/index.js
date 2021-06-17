#!/usr/bin/env node
const { program } = require('commander')

program.option('-c, --cheese [type]', 'Add cheese with optional type')

program.parse(process.argv)

const options = program.opts()

if (options.cheese === undefined) {
  console.log('no cheese')
} else if (options.cheese === true) {
  console.log('add cheese')
} else {
  console.log(`add cheese type ${options.cheese}`)
}