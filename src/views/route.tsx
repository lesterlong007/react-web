import React, { lazy, createElement } from 'react';
import { RouteProps } from 'react-router-dom';
import { isEmpty } from 'src/util/base';

const lazyLoad = (cm: () => Promise<any>) => createElement(lazy(cm));

const configFn = require.context('../views/', true, /page.js/);

const pageFn = require.context('../views/', true, /index.tsx$/, 'lazy');

const importAll = () => {
  const routes: RouteProps[] = [{
    path: '*',
    element: lazyLoad(() => import('src/views/not-found'))
  }];
  pageFn.keys().forEach(filePath => {
    const configPath = filePath.replace('index.tsx', 'page.js');
    const lbu = configFn(configPath).default.lbu;
    if (isEmpty(lbu) || lbu.includes(process.env.LOCATION)) {
      routes.push({
        path: filePath.replace(/\.|(\/index.tsx)/g, ''),
        element: lazyLoad(() => pageFn(filePath))
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
