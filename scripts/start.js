'use strict';

process.env.NODE_ENV = 'development';

process.on('unhandledRejection', (err) => {
  throw err;
});

const fs = require('fs');
const path = require('path');
const ip = require('ip').address();
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const { MOCK_PORT } = require('../mock/config');
const { LBU } = require('./common/base');

const PORT = parseInt(process.env.PORT, 10) || 8000;
const HOST = process.env.HOST || ip;
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const lbu = LBU.toLowerCase();
const lbuReg = new RegExp(`\\.(${lbu})\\.(ts|tsx)`);

const startConfig = {
  devtool: 'inline-source-map',
  target: 'web',
  watch: true,
  watchOptions: {
    ignored: [`src/**/**/*${lbu}.ts`, `src/**/**/*.tsx`, 'node_modules']
  },
};

const compiler = webpack(merge(webpackConfig, startConfig));

const devServerOptions = {
  host: HOST,
  port: PORT,
  open: `${process.env.BASENAME}/index`,
  hot: true,
  https: process.env.HTTPS === 'true',
  historyApiFallback: true,
  watchFiles: {
    paths: ['src/**/*.ts', 'src/**/*.tsx'],
    options: {
      ignored: [`src/**/**/*.${lbu}.ts`, `src/**/**/*.${lbu}.tsx`,],
      usePolling: false,
    },
  },
  client: {
    overlay: {
      errors: true,
      warnings: true
    },
    progress: true
  },
  proxy: [
    {
      context: ['/api', '/insurance-policy'],
      target: `http://${ip}:${MOCK_PORT}`,
      secure: false,
      changeOrigin: true
    }
  ]
};

const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log(`Starting sever on ${protocol}://${HOST}:${PORT}`);
  try {
    await server.start();
  } catch (err) {
    console.log(err);
  }
};

runServer();

const srcDir = path.resolve(__dirname, '../src');

// chokidar
fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
  console.log(eventType, filename, path.join(srcDir, filename));
  const completedPath = path.join(srcDir, filename);
  const lbuReg = new RegExp(`\\.(${lbu})\\.(ts|tsx)`);
  if (lbuReg.test(completedPath)) {
    const targetFilePath = completedPath.replace(new RegExp(`\\.(${lbu})\\.(ts|tsx)`), '.$2');
    const now = new Date();
    // fs.utimes(targetFilePath, now, now, (err) => {
    //   if (err) {
    //     console.error('File save error: ', err);
    //   } else {
    //     console.log('\n File save synchronous successfully', targetFilePath);
    //   }
    // });
  }
});
