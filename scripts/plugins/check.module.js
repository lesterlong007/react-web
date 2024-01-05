const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { sourceRootPath, viewsPath, featureFileName, pageFileName, hasExtension, hasFeaturePagePermission, getVersionNo } = require('../common/base');

const getUnwantedFileRecursive = (name, parentDir, res) => {
  if (!res) {
    res = {
      features: [],
      pages: []
    };
  }
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
          const oldFeature = dirVMap.get(realName);
          const oldVersion = getVersionNo(oldFeature);
          if (oldVersion < version) {
            dirVMap.set(realName, dir);
            res.features.push(oldFeature);
          } else {
            res.features.push(dir);
          }
          // throw some error if need to restrict only one version
          console.log(chalk.red('Could not config more than two versions for one feature, please check our configuration'));
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
      getUnwantedFileRecursive(val, path.join(parentDir, name), res);
    } else {
      if (val === 'index.tsx' && !hasFeaturePagePermission(finalPath, pageFileName)) {
        res.pages.push(path.join(finalPath.match('src.*$')[0], val));
      }
    }
  });
  return res;
};

class CheckModule {
  options = {
    dirPath: 'src/views'
  };

  backupList = [];

  constructor (options = {}) {
    this.options = { ...this.options, ...options };
  }

  readDirRecursive (name, parentPath) {
    const finalPath = path.join(sourceRootPath, this.options.dirPath, parentPath, name);
    console.log('finalPath ', finalPath);
    const dirList = fs.readdirSync(finalPath);
    dirList.forEach((dir) => {
      const resA = dir.match(/alpha-\d+$/);
      const resB = dir.match(/beta-\d+$/);
      if (resA) {
        const v = resA[0];
        console.log(v, dir.replace(`-${v}`, ''));
      } else if (resB) {
        const v = resB[0];
        const t = dir.replace(`-${v}`, '');
        const from = path.join(finalPath, dir);
        const to = path.join(finalPath, t);
        const backup = path.join(sourceRootPath, `./backup/${t}`);
        // node version needs to be larger than v16.7.0 for cpSync
        // fs.cpSync(from, to, { recursive: true });
        fs.copySync(to, backup, { overwrite: true });
        // fs.emptyDirSync(to);
        fs.copySync(from, to, { overwrite: true });
        fs.emptyDirSync(from);
        this.backupList.push({
          to,
          from,
          backup
        });
      } else {
        console.log(dir);
      }
      // const curPath = path.join(finalPath, dir);
      // const stats = fs.statSync(curPath);
      // stats.isDirectory()
      if (!hasExtension(dir)) {
        this.readDirRecursive(dir, path.join(parentPath, name));
      }
    });
  }

  apply (compiler) {
    const pluginName = CheckModule.name;

    compiler.hooks.beforeCompile.tap(pluginName, (params) => {
      // this.backupList = [];
      console.log('\n checking...');
      // console.log(params);
      // this.readDirRecursive('', '');
      // throw new Error('Checking failed');
    });

    compiler.hooks.done.tap(pluginName, () => {
      console.log('\n done...');
      // this.backupList.forEach((item) => {
      //   fs.moveSync(item.to, item.from, { overwrite: true });
      //   fs.moveSync(item.backup, item.to, { overwrite: true });
      // });
      // this.backupList = [];
    });

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.afterOptimizeChunkAssets.tap(pluginName, (chunks) => {
        const chunkList = Array.from(chunks).map((chunk) => {
          const sourceModules = [];
          chunk.getModules().forEach(module => {
            const res = (module.userRequest || module.resource || module._identifier || '').match(/src\/views.*$/);
            if (res) {
              sourceModules.push(res[0]);
            }
          });
          return {
            id: chunk.id,
            name: chunk.name,
            sourceModules
          };
        });
        const { features, pages } = getUnwantedFileRecursive('', '');
        console.log(chunkList);
        console.log(Object.keys(compilation.assets));
        chunkList.forEach(chunk => {
          if (!chunk.name) {
            //
          }
        });
        Object.keys(compilation.assets).forEach(asset => {
          //
        });
        // delete compilation.assets['js/src_views_feature-two_list_index_tsx.fd128e06.bundle.js'];
      });
    });
  }
}

module.exports = CheckModule;
