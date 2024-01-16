import React, { createElement } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import App from './app.jsx';

const path = require('path');
const ip = require('ip');
const fs = require('fs');
const express = require('express');
const { Writable } = require('stream');

const { basename } = require('../scripts/common/base');
const { getRouteComponent, getRealRoutePath } = require('./common.js');
const IP = ip.address();
const PORT = 6066;
const URL = `http://${IP}:${PORT}`;

// app.use(express.static('dist'));

const app = express();

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
    // const signal = '<!-- server render content -->';
    // const [head, tail] = fs.readFileSync(htmlPath, { encoding: 'utf8' }).split(signal);
    // const stream = new Writable({
    //   write (chunk, _encoding, cb) {
    //     res.write(chunk, cb);
    //   },
    //   final () {
    //     res.end(tail);
    //   }
    // });

    // const route = await getRouteComponent(getRealRoutePath(url));
    // const { pipe } = renderToPipeableStream(<App location={url}>{createElement(route, {})}</App>, {
    //   onShellReady () {
    //     res.statusCode = 200;
    //     res.setHeader('Content-type', 'text/html');
    //     res.write(head);
    //     pipe(stream);
    //   },
    //   onShellError () {
    //     res.statusCode = 500;
    //     res.send('<!doctype html><p>Loading...</p>');
    //   }
    // });
    res.sendFile(htmlPath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on: ${URL}`);
});

// About SSR, Server-Side Rendering
// Advantages: improved initial loading speed, better SEO (Search Engine Optimization)
// Disadvantages:
// Increased server load: need to fetch data and build html content in service side, more deploy, login status
// Increased development complexity: more logic between service and client, manage data synchronization, hydrate and dehydrate
// state management, particularly multiple versions, lbu extension file handling, special code for server such as fetch data and external css
// Limitations on certain client-specific features: lifecycle hooks, dom, device api, i18n default language

// About SSG, Static Site Generation
// not depend service side, will generate html content in advance in compilation process
// boundedness: only suitable for static content more and without-login-status web sites
// just suitable for static web site, mean everyone would get same content, like official website (mul pages), e-commerce website
// some third party libraries or plugins such as prerender-spa-plugin, it slows down compilation
// and will throw error or can not handle these situation suspense require.context, fetch data
// solution: generate page content for every route, and save them in a file, map route path to content (html string)
// listen for route changes, popstate event, and rewrite pushState and replaceState
// when route changes, render corresponding content firstly
// not suitable for SPA, and will conflict with react-router
