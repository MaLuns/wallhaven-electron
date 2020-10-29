'use strict'
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: './',
    pages: {
        index: {
            entry: 'layout/src/main.js',
            template: 'layout/public/index.html',
        }
    },
    outputDir: 'src/renderer',
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('layout/src'))
    }
}