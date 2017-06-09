// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'

// if not defined from command line npm script, set it to production for default value.
env.BUILD_ENV = (typeof process.env.BUILD_ENV === 'undefined') ? 'prod' : process.env.BUILD_ENV

// Enabled to define from command line script
env.COUNTRY_ENV = (typeof process.env.COUNTRY_ENV === 'undefined') ? false : process.env.COUNTRY_ENV

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

var spinner = ora(`Building with production webpack with ${process.env.BUILD_ENV} ITV configuration`)
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/', assetsPath)

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
