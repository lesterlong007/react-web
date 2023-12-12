import React, { lazy, Suspense, createElement } from 'react';
import { RouteProps } from 'react-router-dom';

const lazyLoad = (cm: () => Promise<any>) => createElement(lazy(cm));

export const routes: RouteProps[] = [
  {
    path: '*',
    element: lazyLoad(() => import('src/pages/Index/Index')),
  },
  {
    path: '/index',
    element: lazyLoad(() => import('src/pages/Index/Index')),
  },
  {
    path: '/mine',
    element: lazyLoad(() => import('src/pages/Mine/Mine')),
  },
];

export const cacheRoutes: RouteProps[] = [];
