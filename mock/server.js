const express = require('express');
const bodyParser = require('body-parser');

const { MOCK_FLAG, MOCK_PORT, PROXY_ENV } = require('./config');

const app = express();

app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

if (MOCK_FLAG) {
  app.all('*', (req, res) => {
    const apiPath = req.path;
    console.log('------------------------------->');
    console.log(`${req.method} apiPath`);
    console.log();

    try {
      const result = require(`./data${apiPath}.json`);
      setTimeout(() => {
        res.status(200).send(result);
      }, Math.random() * 500);
    } catch (err) {
      console.error(`${__dirname}${apiPath}.json doesn't exist`);
      res.status(404).send('mock file not found');
    }
  });
} else {
  // real env api
}

app.listen(MOCK_PORT, () => {
  console.log('mock server listen on: ' + MOCK_PORT);
});
