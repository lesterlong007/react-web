import React, { createElement } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import App from './app.jsx';
import { isEmpty } from '../src/util/base';

const path = require('path');
const ip = require('ip');
const fs = require('fs');
const express = require('express');
const { Writable } = require('stream');

const { basename, LBU } = require('../scripts/common/base');
const IP = ip.address();
const PORT = 6066;
const URL = `http://${IP}:${PORT}`;

// app.use(express.static('dist'));

// const glob = require('glob');

// const components = glob.sync(path.join(__dirname, '../src/**/page.js')).map(file => require(file));
// console.log(components);

const app = express();

const getRouteComponent = async (location) => {
  const fileUrl = `../src/views${location.replace(basename, '')}/`;
  const pageConfig = await import(`${fileUrl}page.js`);
  const pageLBU = pageConfig.default.lbu;
  const pagePermission = isEmpty(pageLBU) || pageLBU.includes(LBU);
  const finalRouteUrl = pagePermission ? `${fileUrl}index.tsx` : '../src/views/not-found/index.tsx';
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
    const { pipe } = renderToPipeableStream(<App location={url} >{createElement(route, {})}</App>, {
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
    // const stream = renderToPipeableStream(<App />);
    // res.setHeader('Content-Type', 'text/html');
    // res.write(fs.readFileSync(path.resolve(__dirname, '../public/index.html')));
    // stream.pipe(res);
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
