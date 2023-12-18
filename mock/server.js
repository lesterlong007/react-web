const express = require('express');
const bodyParser = require('body-parser');
const proxy = require('express-http-proxy');

const { MOCK_FLAG, MOCK_PORT, PROXY_ENV } = require('./config');
const apiMap = require('./apiMap');

const app = express();

app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

// let flag = false;

const countMap = {};

if (MOCK_FLAG) {
  app.all('*', (req, res) => {
    const apiPath = req.path;
    console.log('------------------------------->');
    console.log(`${req.method} apiPath ${apiPath}`);

    // map api with varible in path to static api
    // for (let [originPath, mockPath] of Object.entries(apiMap)) {
    //   if (new RegExp(originPath).test(apiPath)) {
    //     if (typeof mockPath === 'function') {
    //       mockPath = mockPath(apiPath, req.method, req.body);
    //     }
    //     return setTimeout(() => {
    //       res.status(200).send(require(`./data${mockPath}.json`));
    //     }, Math.random() * 500);
    //   }
    // }

    try {
      const result = require(`./data${apiPath}.json`);
      setTimeout(() => {
        // res.status(200).send(result);
        // res.status(401).send('mock file not found');
        if (apiPath !== '/api/token') {
          if (apiPath === '/api/more-info') {
            return res.status(200).send(result);
          }
          if ((countMap[apiPath] || 0) % 2 === 0) {
            res.status(401).send('mock file not found');
          } else {
            res.status(200).send(result);
          }
          countMap[apiPath] = (countMap[apiPath] || 0) + 1;
        } else {
          res.status(200).send(result);
        }
        // if (apiPath === '/api/user-info') {
        //   if (flag) {
        //     res.status(200).send(result);
        //   } else {
        //     res.status(401).send('mock file not found');
        //   }
        //   flag = !flag;
        // } else {
        //   res.status(200).send(result);
        // }
      }, 500);
    } catch (err) {
      console.error(`${__dirname}${apiPath}.json doesn't exist`);
      res.status(404).send('mock file not found');
    }
  });
} else {
  // real env api
  app.use(
    proxy('https://api-uat.pulse.wedopulse.com', {
      proxyReqPathResolver(req) {
        if (req.url.includes(`${PROXY_ENV}/v`)) {
          return req.url;
        } else {
          return `/${PROXY_ENV}/v1${req.url}`;
        }
      }
    })
  );
}

app.listen(MOCK_PORT, () => {
  console.log('mock server listen on: ' + MOCK_PORT);
});
