const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const { sourceRootPath, viewsPath, featureFileName, pageFileName, routeFileName, hasExtension, hasFeaturePagePermission, getVersionNo } = require('./common/base');

const routeFilePath = path.join(sourceRootPath, viewsPath, routeFileName);

const generateRoute = (name, parentDir, res) => {
  const finalPath = path.join(sourceRootPath, viewsPath, parentDir, name);
  const curPath = path.join(parentDir, name);
  const dirList = fs.readdirSync(finalPath);
  const dirVMap = new Map();
  dirList.forEach((dir) => {
    if (!hasExtension(dir)) {
      const resB = dir.match(/beta-\d+$/);
      let realName = dir;
      let version = 0;
      if (resB) {
        const v = resB[0];
        version = +v.replace('beta-', '');
        realName = dir.replace(`-${v}`, '');
      }
      const indexPath = path.join(finalPath, dir, 'index.tsx');
      const pagePath = path.join(finalPath, dir, pageFileName);
      const featurePath = path.join(finalPath, dir, featureFileName);
      if (fs.existsSync(featurePath)) {
        if (hasFeaturePagePermission(path.join(finalPath, dir), featureFileName)) {
          if (dirVMap.has(realName)) {
            const oldFeature = dirVMap.get(realName);
            const oldVersion = getVersionNo(oldFeature);
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
        if (fs.existsSync(indexPath) && fs.existsSync(pagePath) && hasFeaturePagePermission(path.join(finalPath, dir), pageFileName)) {
          //   console.log(dir);
          res.push({
            path: '/' + path.join(curPath, dir).replace(/-beta-\d+/, ''),
            filePath: path.join(viewsPath, curPath, dir)
          });
        } else {
          dirVMap.set(realName, dir);
        }
      }
    }
  });
  dirVMap.forEach((val) => {
    generateRoute(val, curPath, res);
  });
  return res;
};

const routes = generateRoute('', '', [{ path: '*', filePath: 'src/views/not-found' }, { path: '/', filePath: 'src/views/index' }]);
// console.log(routes);

let routeContent =
  '// @ut-ignore\n// will generate routes automatically, will cover old content by auto-generation, do not need to add any route manually in current file\n' +
  "import React, { lazy, createElement } from 'react';\n" +
  "import { RouteProps } from 'react-router-dom';\n\n" +
  'const lazyLoad = (cm: () => Promise<any>) => createElement(lazy(cm));\n\n' +
  'export const routes: RouteProps[] = [\n';

for (let i = 0; i < routes.length; i++) {
  routeContent += `  {\n    path: '${routes[i].path}',\n    element: lazyLoad(() => import('${routes[i].filePath}'))\n  }`;
  if (i < routes.length - 1) {
    routeContent += ',\n';
  }
}
routeContent += '\n];\n';
fs.writeFile(routeFilePath, routeContent, (err) => {
  if (err) {
    console.log(chalk.red('Generate routes error'), err);
  } else {
    console.log('Generate routes successfully');
  }
});
