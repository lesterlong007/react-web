const express = require('express');
const path = require('path');
const ip = require('ip');

require('@babel/register')({
//   configFile: path.resolve(__dirname, '../babel.config.js'),
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = require('../src/App.tsx');

const IP = ip.address();
const PORT = 6066;
const URL = `http://${IP}:${PORT}`;

const app = express();

const appHtml = ReactDOMServer.renderToString(React.createElement(App));

// app.use(express.static('dist'));

console.log(appHtml);

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
