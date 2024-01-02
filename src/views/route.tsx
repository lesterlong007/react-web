import React, { lazy, createElement } from 'react';
import { RouteProps } from 'react-router-dom';
import { isEmpty } from 'src/util/base';

const lazyLoad = (cm: () => Promise<any>) => createElement(lazy(cm));

const configModule = require.context('../views/', true, /page.js/);

// const featureModule = require.context('../views/', true, /feature.js/);

const pageModule = require.context('../views/', true, /index.tsx$/, 'lazy');

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

    if (isEmpty(configObj.lbu) || configObj.lbu.includes(process.env.LOCATION)) {
      routes.push({
        path: configObj.path || filePath.replace(/\.|(\/index.tsx)/g, ''),
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

// feature
// version name rule replace or parallel
// alpha beta
