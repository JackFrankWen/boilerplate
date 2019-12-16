'use strict'

const path = require('path')
const fs = require('fs')
const logger = require('./logger.js')

function hasFile(filepath) {
    let stat
  
    try {
      stat = fs.statSync(filepath)
    } catch (e) {
      return false
    }
   
    return stat.isFile()
  }

function ensureAndResolveFile(filepath) {
    filepath = path.resolve(filepath)

    if (!hasFile(filepath)) {
        logger.fatal(`${filepath} does not exist or is not a file.`)
    }

    return filepath
}

function getConfigFile(filepath) {
    let config = {}
  
    const resolvedFilepath = ensureAndResolveFile(filepath)
  
    try {
      config = require(resolvedFilepath) // eslint-disable-line
    } catch (e) {
      logger.error(e)
      logger.fatal(`${resolvedFilepath} failed to load.`)
    }
  
    return config
}

module.exports = {
    getConfigFile,
    ensureAndResolveFile
}