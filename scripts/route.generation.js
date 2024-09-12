const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const { sourceRootPath, viewsPath, featureFileName, pageFileName, routeFileName, hasExtension, hasFeaturePagePermission, getSubModuleList } = require('./common/base');

const routeFilePath = path.join(sourceRootPath, 'src', routeFileName);

const routeList = [];

const generateRoute = (name, parentDir, res, submodule) => {
  const finalPath = path.join(sourceRootPath, submodule, viewsPath, parentDir, name);
  const curPath = path.join(parentDir, name);
  if (fs.existsSync(finalPath)) {
    const dirList = fs.readdirSync(finalPath);
    dirList.forEach((dir) => {
      if (!hasExtension(dir)) {
        const indexPath = path.join(finalPath, dir, 'index.tsx');
        const pagePath = path.join(finalPath, dir, pageFileName);
        const featurePath = path.join(finalPath, dir, featureFileName);
        if (fs.existsSync(featurePath)) {
          if (hasFeaturePagePermission(path.join(finalPath, dir), featureFileName)) {
            generateRoute(dir, curPath, res, submodule);
          }
        } else {
          if (fs.existsSync(indexPath) && fs.existsSync(pagePath)) {
            if (hasFeaturePagePermission(path.join(finalPath, dir), pageFileName)) {
              //   console.log(dir);
              const subRes = submodule.match(/(?<=-)[a-zA-z0-9]+$/);
              const routePath = `${subRes ? '/' + subRes[0] : ''}/${path.join(curPath, dir)}`;
              if (routeList.includes(routePath)) {
                console.warn('Please check your feature name, can not exist duplicate feature during all sub modules');
              } else {
                routeList.push(routePath);
                res.push({
                  path: routePath,
                  filePath: path.join('../', submodule, viewsPath, curPath, dir)
                });
              }
            }
          } else {
            generateRoute(dir, curPath, res, submodule);
          }
        }
      }
    });
  }

  return res;
};

const run = () => {
  const repoName = process.env.REPO_NAME;
  const isLocalOrDev = ['dev', 'local'].includes(process.env.BUILD_ENV);
  const subModuleList = getSubModuleList();
  // console.log(modulesStr);'
  // console.log(subModuleList);
  const defaultRoutes = [
    { path: '*', filePath: 'src/views/not-found' },
    { path: '/', filePath: 'src/views/index' }
  ];
  const moduleList = subModuleList.filter((sub) => {
    if (isLocalOrDev) {
      return !repoName || repoName === sub || sub.includes('common');
    } else {
      return !sub.includes('common');
    }
  });
  moduleList.unshift('');
  const routes = moduleList.reduce((res, cur) => res.concat(generateRoute('', '', [], cur)), defaultRoutes);
  let routeContent =
    '/* eslint-disable prettier/prettier */\n' +
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
};

try {
  run();
} catch (err) {
  console.warn(err);
}
