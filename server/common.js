import { isEmpty } from '../src/util/base';

const path = require('path');
const ip = require('ip');
const fs = require('fs');
const express = require('express');
const { Writable } = require('stream');
const sass = require('node-sass');
const cssModulesRequireHook = require('css-modules-require-hook');

const { basename, LBU, sourceRootPath, featureFileName, viewsPath, getVersionNo, hasFeaturePagePermission, getCssModuleIdentName } = require('../scripts/common/base');

cssModulesRequireHook({
  extensions: ['.scss'],
  // generateScopedName: '[local]_[hash:base64:5]'
  generateScopedName: (local, filename) => getCssModuleIdentName(local, filename)
  // preprocessCss: (css, filepath) => {
  //   console.log('css ', css);
  //   const result = sass.renderSync({ file: filepath });
  //   console.log(result.css.toString());
  //   return result.css.toString();
  // },
});

const getCssRes = (location) => {
  const filePath = path.join(sourceRootPath, `src/views${location.replace(basename, '')}/style.module.scss`);
  if (fs.existsSync(filePath)) {
    const res = sass.renderSync({ file: filePath });
    return res.css.toString();
  } else {
    return '';
  }
};

/**
 * get real dir path according with route path
 * @param {*} location string
 * @returns { string }
 */
const getRealRoutePath = (location) => {
  const pathArr = location.split('/');
  let filePath = viewsPath + '/';
  for (let i = 2; i < pathArr.length - 1; i++) {
    const parentPath = filePath;
    const curDir = pathArr[i];
    filePath += curDir + '/';
    if (fs.existsSync(path.join(sourceRootPath, filePath, featureFileName))) {
      const dirList = fs.readdirSync(path.join(sourceRootPath, parentPath));
      const curFeatures = dirList.filter((dir) => dir.includes(curDir));
      if (curFeatures.length > 1 && curFeatures.some((dir) => /beta/.test(dir))) {
        let maxDir = '';
        let maxVersion = -1;
        curFeatures.forEach((dir) => {
          const featurePermission = hasFeaturePagePermission(path.join(sourceRootPath, filePath.replace(curDir, dir)), featureFileName);
          const v = getVersionNo(dir);
          if (featurePermission && v > maxVersion) {
            maxVersion = v;
            maxDir = dir;
          }
        });
        // console.log(maxDir);
        if (maxDir) {
          return location.replace(curDir, maxDir);
        } else {
          return location;
        }
      } else {
        return location;
      }
    }
  }
  return location;
};

/**
 * judge a route whether has feature permission
 * @param {*} location string
 * @returns boolean
 */
const getFeaturePermission = (location) => {
  const pathArr = location.split('/');
  let filePath = viewsPath + '/';
  for (let i = 2; i < pathArr.length - 1; i++) {
    filePath += pathArr[i] + '/';
    if (fs.existsSync(path.join(sourceRootPath, filePath, featureFileName))) {
      // console.log(filePath);
      return hasFeaturePagePermission(path.join(sourceRootPath, filePath), featureFileName);
    }
  }
  return true;
};

/**
 * get route component content according to route path
 * @param {*} location string
 * @returns Promise<string>
 */
const getRouteComponent = async (location) => {
  const fileUrl = `../src/views${location.replace(basename, '')}/`;
  // const css = getCssRes(location);
  // console.log(css);
  const pageConfig = await import(`${fileUrl}page.js`);
  const pageLBU = pageConfig.default.lbu;
  const pagePermission = isEmpty(pageLBU) || pageLBU.includes(LBU);
  const featurePermission = getFeaturePermission(location);
  const finalRouteUrl = featurePermission && pagePermission ? `${fileUrl}index.tsx` : '../src/views/not-found/index.tsx';
  const res = await import(finalRouteUrl);
  // console.log(res);
  return res.default;
};

module.exports = {
  getRouteComponent,
  getRealRoutePath
};
