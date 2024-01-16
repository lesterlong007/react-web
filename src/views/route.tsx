import React, { lazy, createElement } from 'react';
import { RouteProps } from 'react-router-dom';
import { isEmpty } from 'src/util/base';

const lazyLoad = (cm: () => Promise<any>) => createElement(lazy(cm));

const configModule = require.context('../views/', true, /page.js$/);

const featureModule = require.context('../views/', true, /feature.js$/);

const pageModule = require.context('../views/', true, /index.tsx$/, 'lazy');

const getFeatureConfiguration = (path: string) => {
  const targetPath = featureModule.keys().find(filePath => path.split('/')[1] === filePath.split('/')[1]);
  return targetPath ? featureModule(targetPath).default || {} : {};
};

/**
 * appointment over than configuration
 * one entire page must contain index.tsx and page.js files
 * @returns routes
 */
const importAll = () => {
  const routes: RouteProps[] = [
    {
      path: '*',
      element: lazyLoad(() => import('src/views/not-found'))
    }
  ];
  pageModule.keys().forEach((filePath) => {
    const configPath = filePath.replace('index.tsx', 'page.js');
    const configObj = configModule(configPath).default;
    const featureObj = getFeatureConfiguration(filePath);
    const path = filePath.replace(/\.|(\/index.tsx)/g, '');
    const version = path.match(/beta-\d+/);
    let finalPath = path;
    if (version) {
      finalPath = path.replace(`-${version}`, '');
    }
    const i = routes.findIndex(it => it.path === finalPath);
    if (i > -1) {
      if (version) {
        routes[i].element = lazyLoad(() => pageModule(filePath));
      }
      return false;
    }

    const featurePermission = isEmpty(featureObj.lbu) || featureObj.lbu.includes(process.env.LOCATION);
    const pagePermission = isEmpty(configObj.lbu) || configObj.lbu.includes(process.env.LOCATION);
    if (featurePermission && pagePermission) {
      routes.push({
        path: configObj.path || finalPath,
        element: lazyLoad(() => pageModule(filePath))
      });
    }
  });
  return routes;
};

console.log(importAll());

export const routes: RouteProps[] = importAll();

// export const routes: RouteProps[] = [
//   {
//     path: '*',
//     element: lazyLoad(() => import('src/views/not-found'))
//   },
//   {
//     path: '/index',
//     element: lazyLoad(() => import('src/views/index'))
//   },
//   {
//     path: '/mine',
//     element: lazyLoad(() => import('src/views/mine'))
//   }
// ];
