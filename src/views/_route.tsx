import React, { lazy, createElement } from 'react';
import { RouteProps } from 'react-router-dom';

const lazyLoad = (cm: () => Promise<any>) => createElement(lazy(cm));

// please do not do any changes for this file, including annotations
// appointment over than configuration
// one entire page must contain index.tsx and page.js files
// will generate routes automatically, do not need to configure manually

// route list
export const routes: RouteProps[] = [
  {
    path: '*',
    element: lazyLoad(() => import('src/views/not-found'))
  },
  {
    path: '/index',
    element: lazyLoad(() => import('src/views/index'))
  },
  {
    path: '/mine',
    element: lazyLoad(() => import('src/views/mine'))
  },
  {
    path: '/not-found',
    element: lazyLoad(() => import('src/views/not-found'))
  },
  {
    path: '/feature-one/detail',
    element: lazyLoad(() => import('src/views/feature-one/detail'))
  },
  {
    path: '/feature-one/home',
    element: lazyLoad(() => import('src/views/feature-one/home'))
  },
  {
    path: '/feature-one-alpha-1/home',
    element: lazyLoad(() => import('src/views/feature-one-alpha-1/home'))
  },
  {
    path: '/feature-two/list',
    element: lazyLoad(() => import('src/views/feature-two-beta-1/list'))
  },
  {
    path: '/feature-two/submission',
    element: lazyLoad(() => import('src/views/feature-two-beta-1/submission'))
  }
];
