'use strict'

const path = require('path')

const util = require('./util.js')
const webpackDevServer = require('./webpackDevServer.js')


function formulaWebpackConfig(config) {
  return config;
}

function createSever(config, buildEnv, target) {
  if (config === undefined) {
    throw new Error('Parameter \'option\' is lack.')
  }
  const option = {
    serverConfig: {port: 1234, mock: true}
  }
  option.webpackConfig = formulaWebpackConfig(config, buildEnv, target)
  return new webpackDevServer(option)
}
/*
TARGET: {
    BROWSER: 'browser',
    SERVER: 'node',
    NATIVE: 'native'
  },
  ENV: {
    PRODUCTION: 'prod',
    QA: 'qa',
    QA2: 'qa2',
    QA3: 'qa3',
    PR: 'pr',
    STA: 'sta',
    DEV: 'dev',
    DEVELOPMENT: 'development',
    DLL: 'dll'
  },
  */
const target = "browser";

const buildEnv = "development"

process.env.NODE_ENV = buildEnv /* re-write process env */



const config = util.getConfigFile(path.join(process.cwd(), './webpack.config.js'))

console.log(config, 'config')
const server = createSever(config, buildEnv, target)


server.run();