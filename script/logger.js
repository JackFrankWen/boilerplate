'use strict'

let chalk = require('chalk')

let format = require('util').format

let prefix = '  wsn'

let sep = chalk.gray('·')

exports.normal = function normal() {
  let msg = format.apply(format, arguments)

  console.log(msg) // eslint-disable-line
}

exports.warn = function warn() {
  let msg = format.apply(format, arguments)
  
  console.log(chalk.yellow(prefix), sep, msg) // eslint-disable-line
}

exports.log = function log() {
  let msg = format.apply(format, arguments)

  console.log(chalk.white(prefix), sep, msg) // eslint-disable-line
}

exports.fatal = function fatal(message) {
  if (message instanceof Error) { message = message.message.trim() }
  let msg = format.apply(format, arguments)
 
  console.error(chalk.red(prefix), sep, msg) // eslint-disable-line

  process.exit(1)
}

exports.success = function success() {
  let msg = format.apply(format, arguments)

  console.log(chalk.white(prefix), sep, msg) // eslint-disable-line
}

exports.error = function error(message) {
  if (message instanceof Error) { message = message.message.trim() }
  let msg = format.apply(format, arguments)

  console.error(chalk.red(prefix), sep, msg) // eslint-disable-line
}
