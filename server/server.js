import React, { createElement } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import App from './app.jsx';
import { isEmpty } from '../src/util/base';

const path = require('path');
const ip = require('ip');
const fs = require('fs');
const express = require('express');
const { Writable } = require('stream');
const sass = require('node-sass');
const cssModulesRequireHook = require('css-modules-require-hook');

const { basename, LBU, sourceRootPath, featureFileName, viewsPath, hasFeaturePagePermission, getCssModuleIdentName } = require('../scripts/common/base');
const IP = ip.address();
const PORT = 6066;
const URL = `http://${IP}:${PORT}`;

// app.use(express.static('dist'));

// const glob = require('glob');

// const components = glob.sync(path.join(__dirname, '../src/**/page.js')).map(file => require(file));
// console.log(components);

const app = express();

cssModulesRequireHook({
  extensions: ['.scss'],
  // generateScopedName: '[local]_[hash:base64:5]'
  generateScopedName: (local, filename) => getCssModuleIdentName(local, filename)
  // preprocessCss: (css, filepath) => {
  //   console.log('css ', css);
  //   const result = sass.renderSync({ file: filepath });
  //   console.log(result.css.toString());
  //   return result.css.toString();
  // },
});

const getCssRes = (location) => {
  const filePath = path.join(sourceRootPath, `src/views${location.replace(basename, '')}/style.module.scss`);
  if (fs.existsSync(filePath)) {
    const res = sass.renderSync({ file: filePath });
    return res.css.toString();
  } else {
    return '';
  }
};

const getFeaturePermission = (location) => {
  const pathArr = location.split('/');
  let filePath = viewsPath + '/';
  for (let i = 2; i < pathArr.length - 1; i++) {
    filePath += pathArr[i] + '/';
    if (fs.existsSync(path.join(sourceRootPath, filePath, featureFileName))) {
      console.log(filePath);
      return hasFeaturePagePermission(path.join(sourceRootPath, filePath), featureFileName);
    }
  }
  return true;
};

const getRouteComponent = async (location) => {
  const fileUrl = `../src/views${location.replace(basename, '')}/`;
  // const css = getCssRes(location);
  // console.log(css);
  const pageConfig = await import(`${fileUrl}page.js`);
  const pageLBU = pageConfig.default.lbu;
  const pagePermission = isEmpty(pageLBU) || pageLBU.includes(LBU);
  const featurePermission = getFeaturePermission(location);
  const finalRouteUrl = featurePermission && pagePermission ? `${fileUrl}index.tsx` : '../src/views/not-found/index.tsx';
  const res = await import(finalRouteUrl);
  // console.log(res);
  return res.default;
};

app.get(`${basename}/*`, async (req, res) => {
  console.log(req.url);
  const url = req.url;
  const htmlPath = path.resolve(__dirname, '../dist/index.html');
  if (url.includes('.')) {
    const filePath = path.join(__dirname, '../', url.replace(basename, 'dist'));
    res.sendFile(filePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  } else {
    const signal = '<!-- server render content -->';
    const [head, tail] = fs.readFileSync(htmlPath, { encoding: 'utf8' }).split(signal);
    const stream = new Writable({
      write (chunk, _encoding, cb) {
        res.write(chunk, cb);
      },
      final () {
        res.end(tail);
      }
    });

    const route = await getRouteComponent(url);
    const { pipe } = renderToPipeableStream(<App location={url}>{createElement(route, {})}</App>, {
      onShellReady () {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(head);
        pipe(stream);
      },
      onShellError () {
        res.statusCode = 500;
        res.send('<!doctype html><p>Loading...</p>');
      }
    });
    // res.sendFile(htmlPath, (err) => {
    //   if (err) {
    //     console.log(err);
    //   }
    // });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on: ${URL}`);
});

// About SSR, Server-Side Rendering
// Advantages: improved initial loading speed, better SEO (Search Engine Optimization)
// Disadvantages:
// Increased server load: need to fetch data and build html content in service side, more deploy, login status
// Increased development complexity: more logic between service and client, manage data synchronization,
// state management, particularly multiple versions, lbu extension file handling, special code for server such as fetch data and external css,
// Limitations on certain client-specific features: lifecycle hooks, dom, device api

// About SSG, Static Site Generation
// not depend service side, will generate html content in advance in compilation process
// boundedness: only suitable for static content more and without-login-status web sites
