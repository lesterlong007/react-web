import React from 'react';
import { renderToString } from 'react-dom/server';
import express from 'express';
import App from '../src/App';

const path = require('path');
const ip = require('ip');

const IP = ip.address();
const PORT = 8066;
const URL = `http://${IP}:${PORT}`;

const app = express();

// app.use(express.static('dist'));

console.log(111111111111);

const content = renderToString(<App />);
console.log(content);

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
