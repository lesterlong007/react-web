const fs = require('fs');
const path = require('path');

const { argv } = require('yargs');
const sourceRootPath = path.resolve(__dirname, '../../');
const ellipsisFolders = ['/components', '/store'];
const extensions = ['js', 'jsx', 'ts', 'tsx'];
const featureFileName = 'feature.js';
const pageFileName = 'page.js';
const viewsPath = 'src/views';
const componentsPath = 'src/components';
const LBU = argv.location || 'MY';

/**
 * only collect dependency from source codes
 * @param {*} path
 * @returns boolean
 */
const isOwnDependency = (path = '') => {
  return path.startsWith('../') || path.startsWith('./') || path.startsWith('src') || path.startsWith('@');
};

/**
 * judge a path whether contains extension name
 * @param {*} path
 * @returns boolean
 */
const hasExtension = (path) => /\.[\w]+$/.test(path);

/**
 * some index file path is omitted, just like '@/components'
 * @param {*} path
 * @returns boolean
 */
const isOmitFolder = (path) => {
  for (let i = 0; i < ellipsisFolders.length; i++) {
    if (path.endsWith(ellipsisFolders[i])) {
      return true;
    }
  }
  return false;
};

/**
 * read file content to analyze
 * @param {*} finalPath
 * @returns string
 */
const getFileContent = (finalPath) => {
  if (hasExtension(finalPath)) {
    return fs.readFileSync(finalPath, { encoding: 'utf8' });
  } else {
    if (isOmitFolder(finalPath)) {
      finalPath += '/index';
    }
    if (fs.existsSync(finalPath + '.tsx')) {
      return fs.readFileSync(finalPath + '.tsx', { encoding: 'utf8' });
    } else {
      return fs.readFileSync(finalPath + '.ts', { encoding: 'utf8' });
    }
  }
};

/**
 * judge current lbu whether has feature permission
 * @param {*} dirPath
 *  @param {*} fileName
 * @returns boolean
 */
const hasFeaturePagePermission = (dirPath, fileName) => {
  const content = getFileContent(path.join(dirPath, fileName));
  // console.log(content);
  const res = content.match(/lbu:\s*(\[.*\])/);
  // console.log(res);
  return !res || res[1].includes(LBU);
};

/**
 * get version number by directory name
 * @param {*} dir
 * @returns number
 */
const getVersionNo = (dir) => {
  const res = dir.match(/beta-\d+$/);
  if (res) {
    const v = res[0];
    return +v.replace('beta-', '');
  } else {
    return 0;
  }
};

module.exports = {
  sourceRootPath,
  viewsPath,
  componentsPath,
  featureFileName,
  pageFileName,
  extensions,
  ellipsisFolders,
  LBU,
  hasExtension,
  hasFeaturePagePermission,
  getVersionNo,
  isOwnDependency
};
