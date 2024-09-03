const fs = require('fs');
const path = require('path');
const stream = require('stream');
const express = require('express');
const bodyParser = require('body-parser');
const proxy = require('express-http-proxy');

const { getSubModuleList, sourceRootPath } = require('../scripts/common/base');
const { MOCK_FLAG, MOCK_PORT, PROXY_ENV } = require('./config.js');
const { getAuthorizationHeader, setToken } = require('./token.js');

const envContent = fs.readFileSync(path.resolve(__dirname, `../env/.env.${PROXY_ENV}`), { encoding: 'utf8' });
const CORE_APIM_SUBSCRIPTION_KEY = envContent.match(/(?<=CORE_APIM_SUBSCRIPTION_KEY=)\S+/)[0];
const APIM_SUBSCRIPTION_KEY = envContent.match(/(?<=APIM_SUBSCRIPTION_KEY=)\S+/)[0];
const moduleList = getSubModuleList();

const getApiMap = () => {
  let resMap = require('./apiMap.js');

  moduleList.forEach((val) => {
    const mapPath = path.join(sourceRootPath, val, '/mock/apiMap.js');
    if (fs.existsSync(mapPath)) {
      const subMap = require(`../${val}/mock/apiMap.js`);
      resMap = {
        ...resMap,
        ...subMap
      };
    }
  });
  return resMap;
};

const apiMap = getApiMap();

const app = express();

app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * mock json file path is same as real api path with '.json' as suffix
 * for staic api like '/policy/policy/linkage/init', mock file is ./data/policy/policy/linkage/init.json
 * for daynamic api like '/policy/customer/${userId}/policy', targe file is configured in ./apiMap.json
 * and if daynamic api is not in apiMap, will look path varible as folder/file name first
 * fall back to 404
 */

const resolveRegionalFile = (filename, region) => {
  const extname = path.extname(filename);
  // const regionalFile = filename.replace(extname, `.${region.toLowerCase()}${extname}`);

  // if (fs.existsSync(path.resolve(__dirname, regionalFile))) {
  //   return regionalFile;
  // }
  return filename;
};

const getMockFile = (filename) => {
  const curPath = path.resolve(__dirname, filename);
  if (!fs.existsSync(curPath)) {
    for (let i = 0; i < moduleList.length; i++) {
      const subPath = path.join(sourceRootPath, moduleList[i], '/mock', filename);
      if (fs.existsSync(subPath)) {
        return path.join(moduleList[i], '/mock', filename);
      }
    }
  }
  return filename;
};

app.use('/pruservice-static', (req, resOut) => {
  const [, region] = /(\w{2})-external-static/.exec(req.path) || [];
  const regionConfig = region ? require(`../config/${region}-specific/dev.${region}.js`) : '';
  const externalStatic = regionConfig?.defineConstants?.APP_CONF.EXTERNAL_PDF_HOST || '';
  const newStaticUrl = externalStatic
    ? `${JSON.parse(externalStatic)}${req.path.replace(/(\w{2})-external-static/, '')}`
    : `https://pruservices-dev.prudential.com.hk/pruservice-static${req.path}`;

  fetch(newStaticUrl)
    .then((res) => {
      resOut.setHeader('last-modified', res.headers.get('last-modified'));
      resOut.setHeader('content-type', res.headers.get('content-type'));
      return res.arrayBuffer();
    })
    .then((res) => {
      const readStream = new stream.PassThrough();
      readStream.end(new Uint8Array(res));
      readStream.pipe(resOut);
    });
});

if (MOCK_FLAG) {
  app.all(/^(?!\/pruservice-static)/, (req, res) => {
    const apiPath = req.path;
    const pruTenant = req.headers['pru-tenant'];

    console.log('------------------------------->');
    console.log(req.path);
    console.log(req.method);
    console.log(req.headers);
    // res.status(403).send({
    //   detail: { failureUrl: 'ERR-006' }
    // });

    if (apiPath.includes('services/common/paymentoptions/app/transactions/')) {
      return res.send(fs.readFileSync(path.resolve(resolveRegionalFile('mock/data/policy/payment/pay.html', pruTenant)), 'utf-8'));
    }

    if (/\.html/.test(apiPath)) {
      return res.send(fs.readFileSync(path.resolve(resolveRegionalFile(`mock/data/${apiPath}`, pruTenant)), 'utf-8'));
    }
    if (/\.pdf/.test(apiPath)) {
      res.setHeader('content-type', 'application/pdf');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Last-Modified', 'Fri, 18 Apr 2023 09:17:52 GMT');
      return res.send(fs.readFileSync(path.resolve(resolveRegionalFile(getMockFile(`./${apiPath}`), pruTenant))));
    }

    // map restful api with varible in path to static api
    for (let [originPath, mockPath] of Object.entries(apiMap)) {
      if (new RegExp(originPath).test(apiPath)) {
        if (Object.prototype.toString.call(mockPath) === '[object Function]') {
          mockPath = mockPath(req);
        }
        return setTimeout(() => {
          const resolvedFilePath = resolveRegionalFile(getMockFile(`./data${mockPath}.json`), pruTenant);
          res.setHeader('File-Src', resolvedFilePath);
          res.status(200).send(require(resolvedFilePath));
        }, Math.random() * 1000);
      }
    }

    try {
      const resolvedFilePath = resolveRegionalFile(getMockFile(`./data${apiPath}.json`), pruTenant);
      res.setHeader('File-Src', resolvedFilePath);
      const result = require(resolvedFilePath);
      setTimeout(() => {
        res.status(200).send(result);
      }, Math.random() * 1000);
    } catch (err) {
      console.error(`${__dirname}/data${apiPath}.json doesn't exist`);
      res.status(404).send('mock file not found');
    }
  });
} else {
  const postPutApis = [];
  app.use(
    /^(?!\/pruservice-static)/,
    proxy('https://api-uat.pulse.wedopulse.com', {
      proxyReqPathResolver(req) {
        if (req.url.includes(`${PROXY_ENV}/v`)) {
          return req.url;
        } else {
          console.log(`/${PROXY_ENV}/v1${req.url}`);
          return `/${PROXY_ENV}/v1${req.url}`;
        }
      },
      async proxyReqOptDecorator(proxyReqOpts) {
        delete proxyReqOpts.headers.origin;

        const shouldUseCoreAPIMKey = !proxyReqOpts.path.includes('insurance-policy');

        const pruTenant = proxyReqOpts.headers['pru-tenant'] || 'MY';
        const { accessToken, refreshToken } = await getAuthorizationHeader(pruTenant);

        proxyReqOpts.headers = {
          ...proxyReqOpts.headers,
          // ...(await getAuthorizationHeader(pruTenant)),
          cookie: `incap_ses_1044_2418781=iAQJXbLlTQNC6j3xNgl9DsEwe2MAAAAAujOGbLBJu6kwOC8RI6tgIg==; NeoPulseRefreshToken=${refreshToken}; NeoPulseAccessToken=${accessToken};`,

          'ocp-apim-subscription-key': shouldUseCoreAPIMKey ? CORE_APIM_SUBSCRIPTION_KEY : APIM_SUBSCRIPTION_KEY
        };

        console.log(proxyReqOpts.path);

        if (proxyReqOpts.method === 'POST') {
          console.log(postPutApis.some((reg) => reg.test(proxyReqOpts.path)));
          if (postPutApis.some((reg) => reg.test(proxyReqOpts.path))) {
            proxyReqOpts.method = 'PUT';
          }
        }
        return proxyReqOpts;
      },
      async userResDecorator(proxyRes, proxyResData, userReq, userRes) {
        proxyRes.headers['set-cookie'].forEach((cookie) => {
          if (cookie.includes('NeoPulseAccessToken')) {
            try {
              const body = JSON.parse(proxyResData.toString('utf-8'));
              const token = body.body?.identityToken?.accessToken;
              setToken(token);
            } catch {
              // no-op
            }
          }
        });

        return proxyResData;
      }
    })
  );
}

app.listen(MOCK_PORT, () => {
  console.log('mock server listen on: ' + MOCK_PORT);
});
