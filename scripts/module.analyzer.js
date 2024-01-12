const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const {
  sourceRootPath,
  viewsPath,
  extensions,
  ellipsisFolders,
  pageFileName,
  featureFileName,
  componentsPath,
  lbu,
  hasExtension,
  hasFeaturePagePermission,
  getVersionNo
} = require('./common/base');
const graphFilePath = path.resolve(__dirname, `../module-dependency/module-graph.${lbu}.wsd`);

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
 * get same file path which has lbu extension if exist
 * @param {*} filePath
 * @returns string
 */
const getLBUFilePath = (filePath) => {
  const lbuFilePath = filePath.replace(/([\w-]+)(.ts|.tsx)$/, `$1.${lbu}$2`);
  if (/\.(tsx|ts)$/.test(lbuFilePath) && fs.existsSync(lbuFilePath)) {
    return lbuFilePath;
  } else {
    return filePath;
  }
};

/**
 * supplement file extension for ts or tsx
 * @param {*} filePath
 * @returns string
 */
const supplementFileExtension = (filePath) => {
  if (hasExtension(filePath)) {
    return filePath;
  } else {
    if (isOmitFolder(filePath)) {
      filePath += '/index';
    }
    if (fs.existsSync(filePath + '.tsx')) {
      return filePath + '.tsx';
    } else {
      return filePath + '.ts';
    }
  }
};

/**
 * get actual file path if exist lbu extension file
 * @param {*} filePath
 * @returns string
 */
const getActualFilePath = (filePath) => {
  const finalPath = supplementFileExtension(filePath);
  return getLBUFilePath(finalPath);
};

/**
 * get file content
 * @param {*} filePath
 * @returns string
 */
const getFileContent = (filePath) => fs.readFileSync(filePath, { encoding: 'utf8' });

/**
 * get referenced component list
 * @param {*} codeStr
 * @param {*} res
 * @param {*} level
 * @param {*} paths
 * @returns dependencies
 */
const readDependentComponents = (codeStr, res, level, paths) => {
  const matchRes = codeStr.match(/\{(.*)\s*\}/);
  const cur = {
    level,
    paths,
    path: componentsPath,
    children: [],
    isLeaf: false
  };
  if (matchRes) {
    const nextLevel = level + 1;
    const nextPaths = [...paths, componentsPath];
    const components = matchRes[1].split(',').map((cm) => cm.trim());
    const finalPath = getCompletedPath(componentsPath, '');
    const completedPath = getActualFilePath(finalPath);
    const content = getFileContent(completedPath);

    components.forEach((cm) => {
      const cmReg = new RegExp(`${cm}.*?['"]([^'"]+)['"]`);
      const matchRes = content.match(cmReg);
      if (matchRes) {
        const cmPath = path.join(componentsPath, matchRes[1]);
        if (cur.children.every((it) => it.path !== cmPath)) {
          cur.children.push({
            level: nextLevel,
            paths: nextPaths,
            path: cmPath,
            children: [],
            isLeaf: true
          });
        }
      }
    });

    res.push(cur);
    return res;
  }
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
      if (hasFeaturePagePermission(path.join(finalPath, dir), featureFileName)) {
        if (dirVMap.has(realName)) {
          const oldVersion = getVersionNo(dirVMap.get(realName));
          if (oldVersion < version) {
            dirVMap.set(realName, dir);
          }
          // throw some error if need to restrict only one version
          // console.log(chalk.red('Could not config more than two versions for one feature, please check our configuration'));
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
      if (val === 'index.tsx' && hasFeaturePagePermission(finalPath, pageFileName)) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        traverseDependencies(path.join(finalPath.match('src.*$')[0], val), '', res, level, paths);
      }
    }
  });
}

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
  const completedPath = getActualFilePath(finalPath);
  const srcFilePath = completedPath.match(/src.*$/)[0];
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
    const content = getFileContent(completedPath);
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content))) {
      const nextPath = match[1];
      const nextSrcFilePath = getCompletedPath(nextPath, curPath).match(/src.*$/)[0];
      // avoid recursive circularly
      if (isOwnDependency(nextPath) && !curPaths.includes(nextSrcFilePath)) {
        isLeaf = false;
        if (/^(@|src)\/components$/.test(nextPath)) {
          readDependentComponents(match[0], cur.children, level + 1, curPaths);
        } else {
          traverseDependencies(nextPath, curPath, cur.children, level + 1, curPaths);
        }
      }
    }
  }
  cur.isLeaf = isLeaf;
  res.push(cur);
  return res;
}

/**
 * generate star string
 * @param {*} count
 * @returns string
 */
const getStars = (count = 1) => new Array(count).fill('*').join('');

/**
 * generate module graph wsd file
 * @param {*} modules
 * @returns wsd content
 */
const generateModuleGraph = (modules) => {
  let res = '';
  modules.forEach((m) => {
    res += `\n${getStars(m.level)} ${m.path}`;
    if (m.children?.length > 0) {
      res += generateModuleGraph(m.children);
    }
  });
  return res;
};

const result = traverseDependencies('src/index.tsx', '', [], 1, []);
const graphContent = `@startmindmap Module Graph${generateModuleGraph(result)}\n@endmindmap`;
console.dir(JSON.stringify(result));
// console.dir(graphContent);

fs.writeFile(graphFilePath, graphContent, (err) => {
  if (err) {
    console.log(chalk.red('Generate module graph error'), err);
  } else {
    console.log('Generate module graph successfully');
  }
});
