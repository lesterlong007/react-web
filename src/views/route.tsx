// @ut-ignore
// will generate routes automatically, will cover old content by auto-generation, do not need to add any route manually in current file
import React, { lazy, createElement } from 'react';
import { RouteProps } from 'react-router-dom';

const lazyLoad = (cm: () => Promise<any>) => createElement(lazy(cm));

export const routes: RouteProps[] = [
  {
    path: '*',
    element: lazyLoad(() => import('src/views/not-found'))
  },
  {
    path: '/',
    element: lazyLoad(() => import('src/views/index'))
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
