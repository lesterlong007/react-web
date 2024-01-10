'use strict';

process.env.NODE_ENV = 'development';

process.on('unhandledRejection', (err) => {
  throw err;
});

const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const ip = require('ip').address();
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const { MOCK_PORT } = require('../mock/config');
const { LBU, sourceRootPath } = require('./common/base');

const PORT = parseInt(process.env.PORT, 10) || 8000;
const HOST = process.env.HOST || ip;
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const lbu = LBU.toLowerCase();
const lbuRule = `**/src/**/*.${lbu}.{ts,tsx}`;

const startConfig = {
  devtool: 'inline-source-map',
  target: 'web',
  watchOptions: {
    ignored: [lbuRule, '**/node_modules', '**/scripts']
  }
};

const compiler = webpack(merge(webpackConfig, startConfig));

const devServerOptions = {
  host: HOST,
  port: PORT,
  open: `${process.env.BASENAME}/index`,
  hot: true,
  https: process.env.HTTPS === 'true',
  historyApiFallback: true,
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

const saveSourceFile = (filename) => {
  const completedPath = path.join(sourceRootPath, filename);
  const lbuReg = new RegExp(`\\.(${lbu})\\.(ts|tsx)`);
  if (lbuReg.test(completedPath)) {
    const targetFilePath = completedPath.replace(new RegExp(`\\.(${lbu})\\.(ts|tsx)`), '.$2');
    const now = new Date();
    fs.utimes(targetFilePath, now, now, (err) => {
      if (err) {
        console.error('\n File save error: ', err);
      } else {
        console.log('\n File save synchronous successfully', targetFilePath);
      }
    });
  }
};

const chokidarWatcher = chokidar.watch(lbuRule, {
  cmd: path.join(sourceRootPath, 'src'),
  ignored: /node_modules/,
  persistent: true
});

chokidarWatcher
  .on('add', (path) => {
    console.log(`File added: ${path}`);
    saveSourceFile(path);
  })
  .on('change', (path) => {
    console.log(`File changed: ${path}`);
    saveSourceFile(path);
  })
  .on('unlink', (path) => {
    console.log(`File removed: ${path}`);
    saveSourceFile(path);
  });

process.on('SIGINT', () => {
  chokidarWatcher.close();
});
