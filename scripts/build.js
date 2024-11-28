'use strict';

process.env.NODE_ENV = 'production';

const { argv } = require('yargs');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // css compress
const TerserWebpackPlugin = require('terser-webpack-plugin'); // js compress
const CompressionPlugin = require('compression-webpack-plugin'); // gzip compress
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // bundle analysis

const webpackConfig = require('./webpack.config');

const isAnalyze = argv.ANALYZE || process.env.ANALYZE;
const needAnalyzer =
  (process.env.NODE_ENV === 'production' &&
    (process.env.BUILD_ENV === 'dev' || process.env.BUILD_ENV === 'sit')) ||
  isAnalyze;

const buildConfig = {
  devtool: 'eval',
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionPlugin(),
    needAnalyzer && new BundleAnalyzerPlugin({ analyzerMode: 'static' })
  ].filter(Boolean),
  performance: {
    hints: false
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
          test: /[\\/]node_modules[\\/]/,
          priority: 20
        },
        default: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
            ascii_only: true
          },
          compress: {
            drop_console: true,
            drop_debugger: true,
            comparisons: false
          },
          safari10: true
        }
      }),
      new CssMinimizerPlugin()
    ]
  }
};

module.exports = merge(webpackConfig, buildConfig);
