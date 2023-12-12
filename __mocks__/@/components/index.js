import React, { forwardRef, useEffect } from 'react';

const validProps = [
  'className',
  'style',
  'children',
  'onClick',
  'onScroll',
  'onTouchStart',
  'onTouchCancel',
  'onTouchMove',
  'onTouchEnd',
];

const getValidProps = props => {
  const newProps = {};
  Object.keys(props).forEach(val => {
    if (validProps.includes(val)) {
      newProps[val] = props[val];
    }
  });
  return newProps;
};

export const Loading = ({ children, ...rest }) => (
  <div {...getValidProps(rest)}>Loading</div>
);

