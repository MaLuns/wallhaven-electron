'use strict'
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: './',
    pages: {
        index: {
            entry: 'layout/main.js',
            template: 'layout/index.html',
        },
    },
    outputDir: 'src/renderer',
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('layout'))
    }
}