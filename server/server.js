import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import App from './app.jsx';

const path = require('path');
const ip = require('ip');
const fs = require('fs');
const express = require('express');
const { Writable } = require('stream');

const IP = ip.address();
const PORT = 6066;
const URL = `http://${IP}:${PORT}`;

// app.use(express.static('dist'));

// const glob = require('glob');

// const components = glob.sync(path.join(__dirname, '../src/**/page.js')).map(file => require(file));
// console.log(components);

const app = express();

app.get('/react-web/*', (req, res) => {
  console.log(req.url);
  const url = req.url;
  const htmlPath = path.resolve(__dirname, '../dist/index.html');
  if (url.includes('.')) {
    const filePath = path.join(__dirname, '../', url.replace('/react-web', 'dist'));
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
    const { pipe } = renderToPipeableStream(<App location={url} />, {
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
