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
const lokaliseRepo = 'new-pruservice-lokalise';
const commonRepo = 'new-pruservice-common';

const getLocation = () => {
  const initial = argv.LOCATION || process.env.LOCATION || 'my';
  switch (initial) {
    case 'prubsn':
      return 'my';
    default:
      return initial;
  }
};

const getLbu = () => {
  const initialLocation = argv.LOCATION || process.env.LOCATION || 'my';
  const initialLbu = argv.LBU || process.env.LBU || '';
  switch (initialLocation) {
    case 'prubsn':
      return 'pbtb';
    default:
      return initialLbu;
  }
};

const location = getLocation();
const LOCATION = location.toUpperCase();

const lbu = getLbu();
const LBU = lbu.toUpperCase();

const getPublicPath = () => {
  const publicPath = '/pruservice-pages';
  const env = process.env.BUILD_ENV || 'dev';
  if (location === 'mo') {
    return publicPath;
  } else if (location === 'kh' || location === 'th') {
    return env === 'prod' ? publicPath : `/${env}${publicPath}`;
  } else if (env === 'prod') {
    return `/${location}${publicPath}`;
  } else {
    return `/${env}/${location}${publicPath}`;
  }
};

const basename = getPublicPath();

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
 * judge current location whether has feature permission
 * @param {*} dirPath string
 *  @param {*} fileName string
 * @returns { boolean }
 */
const hasFeaturePagePermission = (dirPath, fileName) => {
  const finalPath = path.join(dirPath, fileName);
  if (fs.existsSync(finalPath)) {
    const env = process.env.BUILD_ENV || 'local';
    const content = getFileContent(finalPath);
    // console.log(content);
    const locationRes = content.match(/location:\s*(\[.*\])/);
    const envRes = content.match(/env:\s*(\[.*\])/);
    // console.log(res);
    const locationFlag =
      !!locationRes && (locationRes[1].includes(LOCATION) || locationRes[1].includes('ALL'));
    const envFlag = !envRes || envRes[1].includes(env);
    return locationFlag && envFlag;
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

/**
 * Get submodule name list
 * @returns { string []  }
 */
const getSubModuleList = (needLokalise = false) => {
  const gitModulesPath = path.resolve(sourceRootPath, '.gitmodules');
  const modulesStr = fs.readFileSync(gitModulesPath, { encoding: 'utf8' });
  return modulesStr
    .match(/(?<=path\s*=\s*)\S+/g)
    .filter((val) => needLokalise || val !== lokaliseRepo);
};

/**
 * get environment variables, combine customization to public
 * @param {*} env string
 * @param {*} finalLocation string | undefined
 * @param {*} finalLbu string | undefined
 * @returns {}
 */
const getEnvVariables = (env, finalLocation = location, finalLbu = lbu) => {
  const finalEnv = env || argv.env || process.env.BUILD_ENV || 'local';
  const lbuPath = finalLbu ? `${finalLocation}_${finalLbu}` : finalLocation;
  const envPtah = path.join(sourceRootPath, `env/${finalEnv}.js`);
  const locationEnvPath = path.join(sourceRootPath, `env/${finalLocation}/${finalEnv}.js`);
  const lbuEnvPath = path.join(sourceRootPath, `env/${lbuPath}/${finalEnv}.js`);

  const envVariables = require(envPtah);
  if (fs.existsSync(lbuEnvPath)) {
    return { ...envVariables, ...require(lbuEnvPath) };
  } else if (fs.existsSync(locationEnvPath)) {
    return { ...envVariables, ...require(locationEnvPath) };
  } else {
    return envVariables;
  }
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
  LOCATION,
  location,
  lbu,
  LBU,
  lokaliseRepo,
  commonRepo,
  basename,
  hasExtension,
  hasFeaturePagePermission,
  getVersionNo,
  isOwnDependency,
  getCssModuleIdentName,
  getSubModuleList,
  getEnvVariables
};
