// static site generation ( pre-rendering )
import React, { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import App from './app.jsx';

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const { basename, sourceRootPath, viewsPath, featureFileName, pageFileName, hasExtension, hasFeaturePagePermission, getVersionNo } = require('../scripts/common/base');
const { getRouteComponent, getRealRoutePath } = require('./common.js');

const getRouteListRecursive = (name, parentDir, res) => {
  const finalPath = path.join(sourceRootPath, viewsPath, parentDir, name);
  const dirList = fs.readdirSync(finalPath);
  const dirVMap = new Map();
  dirList.forEach((dir) => {
    const resB = dir.match(/beta-\d+$/);
    let realName = dir;
    let version = 0;
    if (resB) {
      const v = resB[0];
      version = +v.replace('beta-', '');
      realName = dir.replace(`-${v}`, '');
    }

    const isFeature = !hasExtension(dir) && fs.existsSync(path.join(finalPath, dir, featureFileName));
    if (isFeature) {
      if (hasFeaturePagePermission(path.join(finalPath, dir), featureFileName)) {
        if (dirVMap.has(realName)) {
          const oldVersion = getVersionNo(dirVMap.get(realName));
          if (oldVersion < version) {
            dirVMap.set(realName, dir);
          }
          // throw some error if need to restrict only one version
          // console.log(chalk.red('Could not config more than two versions for one feature, please check our configuration'));
          // throw new Error('Could not config more than two versions for one feature, please check our configuration');
        } else {
          dirVMap.set(realName, dir);
        }
      }
    } else {
      dirVMap.set(realName, dir);
    }
  });
  dirVMap.forEach((val) => {
    if (!hasExtension(val)) {
      getRouteListRecursive(val, path.join(parentDir, name), res);
    } else {
      if (val === 'index.tsx' && hasFeaturePagePermission(finalPath, pageFileName)) {
        // get route
        const routePath = `${basename}/${path.relative(path.join(sourceRootPath, viewsPath), finalPath)}`;
        res.push(routePath);
      }
    }
  });
  return res;
};

const actualRoutes = getRouteListRecursive('', '', []);
const clientRoutes = actualRoutes.map((r) => r.replace(/-beta-\d+/, ''));
// console.log(actualRoutes);
// console.log(clientRoutes);

const getRouteContent = async (url) => {
  const route = await getRouteComponent(url);
  return renderToString(<App location={url}>{createElement(route, {})}</App>);
};

const preRenderRoutes = async () => {
  const promises = Promise.all(actualRoutes.map((r) => getRouteContent(r)));
  const res = await promises;
  const routeContentMap = clientRoutes.map((r, i) => ({ path: r, content: res[i] }));
  //   console.log(routeContentMap);
  const ssgIndicator = '<!-- static site script -->';
  const scriptTemplate = fs.readFileSync(path.resolve(__dirname, './ssg.inject.js'), { encoding: 'utf8' });
  const withRouteTemplate = scriptTemplate.replace(/(const\s*viewList\s*=\s*)(\[\])/, `$1${JSON.stringify(routeContentMap)}`);
  //   console.log(withRouteTemplate);
  const htmlPath = path.join(sourceRootPath, 'dist/index.html');
  const htmlContent = fs.readFileSync(htmlPath, { encoding: 'utf8' });
  fs.writeFile(htmlPath, htmlContent.replace(ssgIndicator, `<script>\n${withRouteTemplate}\n</script>`), (err) => {
    if (err) {
      console.log(chalk.red('Generate static site script error'), err);
    } else {
      console.log('Generate static site script successfully');
    }
  });
};

preRenderRoutes();

// console.log(getRealRoutePath('/react-web/feature-two/list'));

// console.log(getRealRoutePath('/react-web/feature-one-alpha-1/home'));

// console.log(getRealRoutePath('/react-web/feature-one/home'));

// console.log(getRealRoutePath('/react-web/index'));
