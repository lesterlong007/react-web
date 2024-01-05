const fs = require('fs');
const path = require('path');

const { argv } = require('yargs');
const sourceRootPath = path.resolve(__dirname, '../');
const ellipsisFolders = ['/components', '/store'];
const extensions = ['js', 'jsx', 'ts', 'tsx'];
const featureFileName = 'feature.js';
const viewsPath = 'src/views';
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
 * judge a path whether contains extension name
 * @param {*} path
 * @returns boolean
 */
const hasExtension = (path) => /\.[\w]+$/.test(path);

/**
 * just collect and analyze js jsx ts tsx files
 * @param {*} path
 * @returns boolean
 */
const isShouldRead = (path) => {
  for (let i = 0; i < extensions.length; i++) {
    if (path.endsWith(extensions[i])) {
      return true;
    }
  }
  return !hasExtension(path);
};

/**
 * judge a path whether is absolute path
 */
const isAbsolutePath = (filePath) => /^(@|src)/.test(filePath);

/**
 * get completed and absolute path
 * @param {*} filePath
 * @param {*} parentDir
 * @returns string
 */
const getCompletedPath = (filePath, parentDir) => {
  const isAbsolute = isAbsolutePath(filePath);
  if (isAbsolute) {
    filePath = filePath.replace('@', 'src');
  }
  const paths = [sourceRootPath, filePath];
  if (!isAbsolute) {
    paths.splice(1, 0, parentDir);
  }

  return path.join(...paths);
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
 * @returns boolean
 */
const hasFeaturePermission = (dirPath) => {
  const content = getFileContent(path.join(dirPath, featureFileName));
  // console.log(content);
  const res = content.match(/lbu:\s*(\[.*\])/);
  // console.log(res);
  return !res || res[1].includes(LBU);
};

/**
 * read folders and files recursive
 * @param {*} name
 * @param {*} parentDir
 * @param {*} res
 * @param {*} level
 * @param {*} paths
 */
function readFileRecursive (name, parentDir, res, level, paths) {
  const finalPath = path.join(sourceRootPath, viewsPath, parentDir, name);
  const dirList = fs.readdirSync(finalPath);
  const dirVMap = new Map();
  dirList.forEach((dir) => {
    const resB = dir.match(/beta-\d+$/);
    let realName = dir;
    let version = 0;
    if (resB) {
      const v = resB[0];
      version = +v.replace('beta-', '');
      realName = dir.replace(`-${v}`, '');
    }

    const isFeature = !hasExtension(dir) && fs.existsSync(path.join(finalPath, dir, featureFileName));
    if (isFeature) {
      if (hasFeaturePermission(path.join(finalPath, dir))) {
        if (dirVMap.has(realName)) {
          const oldVersion = dirVMap.get(realName)?.version ?? -1;
          if (oldVersion < version) {
            dirVMap.set(realName, dir);
          }
          // throw some error if need to restrict only one version
          console.error('Could not config more than two versions for one feature, please check our configuration');
          // throw new Error('Could not config more than two versions for one feature, please check our configuration');
        } else {
          dirVMap.set(realName, dir);
        }
      }
    } else {
      dirVMap.set(realName, dir);
    }
  });
  dirVMap.forEach((val, key) => {
    if (!hasExtension(val)) {
      readFileRecursive(val, path.join(parentDir, name), res, level, paths);
    } else {
      if (val === 'index.tsx') {
        traverseDependencies(path.join(finalPath.match('src.*$')[0], val), '', res, level, paths);
      }
    }
  });
};

/**
 * recursion traverse file dependencies
 * @param {*} filePath
 * @param {*} parentDir
 * @param {*} res
 * @param {*} level
 * @param {*} paths
 * @returns dependencies tree
 */
function traverseDependencies (filePath, parentDir, res, level, paths) {
  let curPath = filePath.replace(/\/[^/]+$/g, '/');
  if (!isAbsolutePath(filePath)) {
    curPath = path.join(parentDir, curPath);
  }
  const finalPath = getCompletedPath(filePath, parentDir);
  const srcFilePath = finalPath.match(/src.*$/)[0];
  const cur = {
    level,
    paths,
    path: srcFilePath,
    children: [],
    isLeaf: false
  };
  let isLeaf = true;
  if (isShouldRead(filePath)) {
    const curPaths = [...cur.paths, srcFilePath];
    if (filePath.includes('/route')) {
      isLeaf = false;
      readFileRecursive('', '', cur.children, level + 1, curPaths);
    }
    const content = getFileContent(finalPath);
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content))) {
      const nextPath = match[1];
      const nextSrcFilePath = getCompletedPath(nextPath, curPath).match(/src.*$/)[0];
      if (isOwnDependency(nextPath) && !curPaths.includes(nextSrcFilePath)) {
        isLeaf = false;
        traverseDependencies(nextPath, curPath, cur.children, level + 1, curPaths);
      }
    }
  }
  cur.isLeaf = isLeaf;
  res.push(cur);
  return res;
};

const result = traverseDependencies('src/index.tsx', '', [], 1, []);
console.dir(JSON.stringify(result));
