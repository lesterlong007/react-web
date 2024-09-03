'use strict';

process.env.NODE_ENV = 'development';

process.on('unhandledRejection', (err) => {
  throw err;
});

const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, './env.js');

if (!fs.existsSync(envPath)) {
  const envContent =
    '// only for local code debug, not pipeline\n' +
    'module.exports = {\n' +
    "  BUILD_ENV: 'local', // local dev sit uat prod\n" +
    "  LOCATION: 'my', // my mo ph id\n" +
    "  LBU: 'pamb', // empty for most loaction, for my: pamb, pbtb\n" +
    '  HTTPS: false,\n' +
    "  REPO_NAME: '' // empty default, or your sub repo which you only want to run, such as new-pruservice-common\n" +
    '};\n';
  fs.writeFileSync(envPath, envContent);
}

const envVariables = require('./env.js');

Object.entries(envVariables).forEach(([key, val]) => {
  process.env[key] = val;
});

const { execSync } = require('child_process');
const chokidar = require('chokidar');

const { argv } = require('yargs');
const ip = require('ip').address();
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const { MOCK_PORT } = require('../mock/config');
const { location, lbu, sourceRootPath, basename } = require('./common/base');

const PORT = parseInt(process.env.PORT, 10) || 8000;
const HOST = process.env.HOST || ip;
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';

const lbuWildcards = [`**/src/**/*.${location}.{ts,tsx}`];
if (lbu) {
  lbuWildcards.push(`**/src/**/*.${location}.${lbu}.{ts,tsx}`);
}

const startConfig = {
  devtool: 'inline-source-map',
  target: 'web',
  watchOptions: {
    ignored: [...lbuWildcards, '**/node_modules', '**/scripts']
  }
};

const devServerOptions = {
  host: HOST,
  port: PORT,
  open: `${basename}/index`,
  hot: true,
  https: process.env.HTTPS === 'true',
  historyApiFallback: true,
  client: {
    overlay: {
      errors: true,
      warnings: false
    },
    progress: true
  },
  proxy: [
    {
      context: ['/api', '/insurance-policy', '/mock'],
      target: `http://${ip}:${MOCK_PORT}`,
      pathRewrite: { '^/mock': '' },
      secure: false,
      changeOrigin: true
    }
  ]
};

execSync('yarn generate-routes', { stdio: 'inherit' });
execSync('yarn combine-translation', { stdio: 'inherit' });

const compiler = webpack(merge(webpackConfig, startConfig));
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

let isRebuild = false;

const saveSourceFile = (targetFilePath) => {
  const now = new Date();
  fs.utimes(targetFilePath, now, now, (err) => {
    if (err) {
      console.error('\n File save error: ', err);
    } else {
      console.log('\n File save synchronous successfully', targetFilePath);
    }
  });
};

const triggerFile = (filename) => {
  const completedPath = path.join(sourceRootPath, filename);
  if (lbu) {
    const lbuReg = new RegExp(`\\.(${location}\\.${lbu})\\.(ts|tsx)`);
    // console.log(lbu, lbuReg);
    if (lbuReg.test(completedPath)) {
      const targetFilePath = completedPath.replace(lbuReg, '.$2');
      saveSourceFile(targetFilePath);
    }
  }
  const locationReg = new RegExp(`\\.(${location})\\.(ts|tsx)`);
  if (locationReg.test(completedPath)) {
    const targetFilePath = completedPath.replace(locationReg, '.$2');
    saveSourceFile(targetFilePath);
  }
};

const chokidarWatcher = chokidar.watch(lbuWildcards, {
  cmd: path.join(sourceRootPath, 'src'),
  ignored: /node_modules/,
  persistent: true
});

chokidarWatcher
  .on('add', (path) => {
    if (isRebuild) {
      console.log(`File added: ${path}`);
      triggerFile(path);
    }
    isRebuild = true;
  })
  .on('change', (path) => {
    isRebuild = true;
    console.log(`File changed: ${path}`);
    triggerFile(path);
  })
  .on('unlink', (path) => {
    isRebuild = true;
    console.log(`File removed: ${path}`);
    triggerFile(path);
  });

process.on('SIGINT', () => {
  chokidarWatcher.close();
});
