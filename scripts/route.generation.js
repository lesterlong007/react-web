const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const util = require('util');

const { sourceRootPath, viewsPath, featureFileName, pageFileName, routeFileName, hasExtension, hasFeaturePagePermission, getVersionNo } = require('./common/base');

const backupRouteFilePath = path.join(sourceRootPath, viewsPath, '_route.tsx');
// const routeFilePath = path.join(sourceRootPath, viewsPath, routeFileName);

const generateRoute = (name, parentDir, res) => {
  const finalPath = path.join(sourceRootPath, viewsPath, parentDir, name);
  const curPath = path.join(parentDir, name);
  const dirList = fs.readdirSync(finalPath);
  const dirVMap = new Map();
  dirList.forEach((dir) => {
    if (!hasExtension(dir)) {
      const resB = dir.match(/beta-\d+$/);
      let realName = dir;
      let version = 0;
      if (resB) {
        const v = resB[0];
        version = +v.replace('beta-', '');
        realName = dir.replace(`-${v}`, '');
      }
      const indexPath = path.join(finalPath, dir, 'index.tsx');
      const pagePath = path.join(finalPath, dir, pageFileName);
      const featurePath = path.join(finalPath, dir, featureFileName);
      if (fs.existsSync(featurePath)) {
        if (hasFeaturePagePermission(path.join(finalPath, dir), featureFileName)) {
          if (dirVMap.has(realName)) {
            const oldFeature = dirVMap.get(realName);
            const oldVersion = getVersionNo(oldFeature);
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
        if (fs.existsSync(indexPath) && fs.existsSync(pagePath) && hasFeaturePagePermission(path.join(finalPath, dir), pageFileName)) {
          //   console.log(dir);
          res.push({
            path: '/' + path.join(curPath, dir).replace(/-beta-\d+/, ''),
            element: `lazyLoad(() => import('${path.join(viewsPath, curPath, dir)}'))`
          });
        } else {
          dirVMap.set(realName, dir);
        }
      }
    }
  });
  dirVMap.forEach((val) => {
    generateRoute(val, curPath, res);
  });
  return res;
};

const routes = generateRoute('', '', [{ path: '*', element: "lazyLoad(() => import('src/views/not-found'))" }]);
// console.log(routes);
const routeContent = util.inspect(routes);
// console.log(routeContent);
const originalContent = fs.readFileSync(backupRouteFilePath, { encoding: 'utf8' });
const targetContent = originalContent.replace(/(export\s+const\s+routes:\s+\w+\[\]\s+=\s+)(\[[\s\S]*\])/, `$1${routeContent.replace(/"/g, '')}`);

fs.writeFile(backupRouteFilePath, targetContent, (err) => {
  if (err) {
    console.log(chalk.red('Generate routes error'), err);
  } else {
    console.log('Generate routes successfully');
  }
});
