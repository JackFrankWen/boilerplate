'use strict'

let debug = require('debug')('formula')

let path = require('path')

let express = require('express')

let webpack = require('webpack')

let WebpackDevMiddleware = require('webpack-dev-middleware')

let WebpackHotMiddleware = require('webpack-hot-middleware')

let proxyMiddleware = require('http-proxy-middleware')

let historyAPIFallback = require('connect-history-api-fallback')

// const mockConfig = require('@yqn/mock-config')

let os = require('os')

const opn = require('react-dev-utils/openBrowser')

const CLIENT_PATH = path.join(path.dirname(require.resolve('webpack-hot-middleware')), 'client?overlay=false&reload=true')
const compression = require('compression')

// let config = require('../config')

let log = require('./log.js')

const configServer =  {
  cwd: process.cwd(),
  src: './src',
  entryName: 'entry.js',
  clientPath: path.join(require.resolve('webpack-hot-middleware'), 'client'),
  assetsPath: 'assets/',
  publicPath: '/',
  port: 1388,
  host: 'qa.local.yunquna.com',
  templateTitle: '',
}

class WebpackDevServer {
  constructor(option) {
    this.serverConfig = option.serverConfig || {}
    if (!option.serverConfig.port) {
      // 补充入口
      this.webpackConfig = this.patchHMR(option.webpackConfig)
    } else {
      this.webpackConfig = option.webpackConfig
    }

    debug('webpack init.')
    this.webpackConfig.devtool = this.webpackConfig.devtool || 'eval'

    // ignore loader-utils.praseQuery's deprecation warning
    // remove this when webpack-html-plugin upgraded
    process.noDeprecation = true

    this.buildReady = false // a flag for webpack init build's state of ready
    this.compiler = webpack(this.webpackConfig)

    this.app = express()
    this.app.use(compression())
    this.installMiddleware()
  }
  patchHMR(webpackConfig) {
    if (typeof webpackConfig.entry === 'string') {
      // make string entry to array
      webpackConfig.entry = [webpackConfig.entry]
    }

    if (Array.isArray(webpackConfig.entry)) {
      // deal with array
      webpackConfig.entry.unshift(CLIENT_PATH)
    } else if (typeof webpackConfig.entry === 'object') {
      // deal with object
      Object.keys(webpackConfig.entry).forEach(key => {
        webpackConfig.entry[key] = [CLIENT_PATH].concat(webpackConfig.entry[key])
      })
    }

    webpackConfig.plugins = webpackConfig.plugins || []

    webpackConfig.plugins = webpackConfig.plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])

    return webpackConfig
  }
  installMiddleware() {
    this.app.use(historyAPIFallback())

    // proxy middleware
    let proxies = this.serverConfig.proxies

    // let mock = this.serverConfig.mock
    
    if (proxies) {
      Object.keys(proxies).forEach(context => {
        let options = proxies[context]

        if (typeof options === 'string') {
          options = { target: options }
        }
        this.app.use(proxyMiddleware(context, options))
      })
    }
    // mockConfig(this.app, proxyMiddleware, mock)

    // dev middleware
    let devMiddleware = WebpackDevMiddleware(this.compiler, {
      logLevel: 'error',
      stats: {
        modules: false,
        colors: true,
        chunks: false,
        entrypoints: false
      }
    })

    devMiddleware.waitUntilValid(() => {
      const port = this.serverConfig.port || configServer.port
      const host = this.serverConfig.host || configServer.host

      this.buildReady = true
      log.success('yqn-dev-server: Open your editor and start coding!')
      log.success('yqn-dev-server: Please set 127.0.0.1 qa.local.yunquna.com in host files')
      opn(`http://${host}:${port}`)
    })

    this.app.use(devMiddleware)

    // hot middleware
    let hotMiddleware = WebpackHotMiddleware(this.compiler)

    this.app.use(hotMiddleware)

    this.compiler.plugin('compilation', function compilationHook(compilation) {
      compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync('compilation', function emitCallback(data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
      })
    })

  }

  run() {
    const port = this.serverConfig.port || configServer.port
    const host = this.serverConfig.host || configServer.host

    this.app.listen(port, '0.0.0.0', err => {
      if (err) {
        log(err)
        return
      }

      let interfaces = os.networkInterfaces()

      let ip = Object.keys(interfaces).map(k => interfaces[k].filter(i => i.family === 'IPv4' && i.internal === false))
        .reduce((address, i) => address.concat(i), [])

      debug('dev server started.')
      log.success(`yqn-dev-server: dev server is ready.`)
      log.success(`Local:\t\t>>> http://${host}:${port}`)
      if (ip.length) {
        log.success(`External:\t>>> http://${ip[0].address}:${port}`)
      }
      if (!this.buildReady) {
        log('formula-dev-server: wait until webpack build finished.')
      }
    })
  }
}

module.exports = WebpackDevServer
