'use strict';
var webpack = require('webpack');

module.exports = function(_path) {
  return {
    context: _path,
    debug: true,
    devtool: 'source-map',
    output: {
      publicPath: 'http://0.0.0.0:8080/'
    },
    devServer: {
      contentBase: './dist',
      info: true,
      hot: true,
      inline: true,
      host:"0.0.0.0"
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};
