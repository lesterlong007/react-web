const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { merge } = require('webpack-merge');

process.env.NODE_ENV = 'production';
const webpackConfig = require('../scripts/webpack.config');

const config = {
  target: 'node',
  entry: path.resolve(__dirname, './index.js'),
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, '../build')
  }
};

module.exports = merge(webpackConfig, config);
