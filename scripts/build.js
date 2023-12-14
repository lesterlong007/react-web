'use strict';

process.env.NODE_ENV = 'production';

const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // css compress
const TerserWebpackPlugin = require('terser-webpack-plugin'); // js compress
const CompressionPlugin = require('compression-webpack-plugin'); // gzip compress
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // bundle analysis

const webpackConfig = require('./webpack.config');

const buildConfig = {
  devtool: 'eval',
  plugins: [
    new CleanWebpackPlugin(),
    new SimpleProgressWebpackPlugin(),
    new CompressionPlugin(),
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // initial | async | all
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 5,
      name: 'name',
      automaticNameDelimiter: '-',
      cacheGroups: {
        baseChunks: {
          name: 'base.chunks',
          test: (module) => /react|react-dom|react-router-dom/.test(module.context),
          priority: 20,
        },
        default: {
          name: 'common.chunks',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
            ascii_only: true,
          },
          compress: {
            drop_console: true,
            drop_debugger: true,
            comparisons: false,
          },
          safari10: true,
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
};

module.exports = merge(webpackConfig, buildConfig);
