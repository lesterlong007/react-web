const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { argv } = require('yargs');
const sourceRootPath = path.resolve(__dirname, '../../');
const ellipsisFolders = ['/components', '/store'];
const extensions = ['js', 'jsx', 'ts', 'tsx'];
const featureFileName = 'feature.js';
const pageFileName = 'page.js';
const routeFileName = 'route.tsx';
const viewsPath = 'src/views';
const componentsPath = 'src/components';
const LBU = argv.location || 'MY';
const basename = '/react-web';

/**
 * only collect dependency from source codes
 * @param {*} path string
 * @returns { boolean }
 */
const isOwnDependency = (path = '') => /^(\.?\.\/|src|@)/.test(path);

/**
 * judge a path whether contains extension name
 * @param {*} path string
 * @returns { boolean }
 */
const hasExtension = (path) => /\.[\w]+$/.test(path);

/**
 * some index file path is omitted, just like '@/components'
 * @param {*} path string
 * @returns { boolean }
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
 * @param {*} finalPath string
 * @returns { string }
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
 * @param {*} dirPath string
 *  @param {*} fileName string
 * @returns { boolean }
 */
const hasFeaturePagePermission = (dirPath, fileName) => {
  const finalPath = path.join(dirPath, fileName);
  if (fs.existsSync(finalPath)) {
    const content = getFileContent(finalPath);
    // console.log(content);
    const res = content.match(/lbu:\s*(\[.*\])/);
    // console.log(res);
    return !res || res[1].includes(LBU);
  } else {
    return true;
  }
};

/**
 * get version number by directory name
 * @param {*} dir string
 * @returns { number }
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

/**
 * generate css module hash name
 * @param {*} localName string
 * @param {*} filename string
 * @returns { string }
 */
const getCssModuleIdentName = (localName, filename) => {
  if (filename.includes('/node_modules/')) {
    return localName;
  }
  const filePath = path.relative(process.cwd(), filename);
  const hash = crypto.createHash('md5').update(filePath).digest('base64');
  return `${localName}_${hash.slice(0, 6)}`;
};

module.exports = {
  sourceRootPath,
  viewsPath,
  componentsPath,
  featureFileName,
  pageFileName,
  routeFileName,
  extensions,
  ellipsisFolders,
  LBU,
  lbu: LBU.toLowerCase(),
  basename,
  hasExtension,
  hasFeaturePagePermission,
  getVersionNo,
  isOwnDependency,
  getCssModuleIdentName
};
