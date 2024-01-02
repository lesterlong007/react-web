const fs = require('fs-extra');
const path = require('path');

const rootPath = path.resolve(__dirname, '../../');

class CheckModule {
  options = {
    dirPath: 'src/views'
  };

  backupList = [];

  constructor (options = {}) {
    this.options = { ...this.options, ...options };
  }

  hasExtension (path) {
    return /\.[\w]+$/.test(path);
  }

  readDirRecursive(name, parentPath) {
    const finalPath = path.join(rootPath, this.options.dirPath, parentPath, name);
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
        const backup = path.join(rootPath, `./backup/${t}`);
        // node version needs to be larger than v16.7.0 for cpSync
        // fs.cpSync(from, to, { recursive: true });
        fs.copySync(to, backup, { overwrite: true });
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
      if (!this.hasExtension(dir)) {
        this.readDirRecursive(dir, name);
      }
    });
  }

  apply (compiler) {
    const pluginName = CheckModule.name;

    compiler.hooks.beforeCompile.tap(pluginName, (params) => {
      // this.backupList = [];
      console.log('\n checking...');
      console.log(params);
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
  }
}

module.exports = CheckModule;
