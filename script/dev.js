
const server = webpackDevServer(config, buildEnv, target)

const buildEnv = CONST.ENV.DEVELOPMENT
const config = configFS.loadConfigFile(configFilePath, packageFilePath)
process.env.NODE_ENV = buildEnv /* re-write process env */
const buildEnv = CONST.ENV.DEVELOPMENT



const server = webpackDevServer(config, buildEnv, target)
server.run();