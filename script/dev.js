'use strict'

const path = require('path')

const util = require('./util.js')
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
// const server = webpackDevServer(config, buildEnv, target)


// server.run();