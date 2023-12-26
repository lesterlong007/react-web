const fs = require('fs');
const path = require('path');

const sourceRootPath = path.resolve(__dirname, '../');
const ellipsisFolders = ['/components', '/store'];
const extensions = ['js', 'jsx', 'ts', 'tsx'];

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
 * get completed and absolute path
 * @param {*} filePath
 * @param {*} parentPath
 * @returns string
 */
const getCompletedPath = (filePath, parentPath) => {
  let isAbsolute = false;
  if (/^(@|src)/.test(filePath)) {
    isAbsolute = true;
    filePath = filePath.replace('@', 'src');
  }
  const paths = [sourceRootPath, filePath];
  if (!isAbsolute) {
    paths.splice(1, 0, parentPath);
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
 * recursion traverse file dependencies
 * @param {*} filePath
 * @param {*} parentPath
 * @param {*} res
 * @param {*} level
 * @returns dependencies tree
 */
const traverseDependencies = (filePath, parentPath, res, level) => {
  const curPath = path.join(parentPath, filePath.replace(/\/[^/]+$/g, '/'));
  const finalPath = getCompletedPath(filePath, parentPath);
  const cur = {
    level,
    path: finalPath.match(/src.*$/)[0],
    children: [],
    isLeaf: false
  };
  let isLeaf = true;
  if (isShouldRead(filePath)) {
    const content = getFileContent(finalPath);
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content))) {
      const nextPath = match[1];
      if (isOwnDependency(nextPath)) {
        isLeaf = false;
        traverseDependencies(nextPath, curPath, cur.children, level + 1);
      }
    }
  }
  cur.isLeaf = isLeaf;
  res.push(cur);
  return res;
};

const result = traverseDependencies('src/index.tsx', '', [], 1);
console.dir(JSON.stringify(result));

// dynamic routes and circular references
