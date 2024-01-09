const fs = require('fs');
const path = require('path');

const { LBU, sourceRootPath } = require('../common/base');

class ReplacePlugin {
  options = {
    outputFile: 'assets.md'
  };

  constructor(options = {}) {
    this.options = { ...this.options, ...options };
  }

  apply(compiler) {
    const pluginName = ReplacePlugin.name;
    const {
      webpack: { Compilation, sources }
    } = compiler;
    const { RawSource } = sources;

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
    //   compilation.addModule(pluginName, (module) => {
    //     const resourcePath = module.resource || '';
    //     const res = resourcePath.match(/src\/.*$/);
    //     if (res) {
    //       console.log(resourcePath);
    //     }
        // Array.from(allModules).forEach((module) => {
        //   const resourcePath = module.resource || '';
        //   const res = resourcePath.match(/src\/.*$/);
        //   if (res) {
        //     const lbu = LBU.toLowerCase();
        //     const lbuFilePath = resourcePath.replace(/([\w-]+)(.ts|.tsx|)$/, `$1.${lbu}$2`);
        //     const isTargetSource = /.(ts|tsx)$/.test(resourcePath);
        //     if (isTargetSource && fs.existsSync(lbuFilePath)) {
        //       console.log(resourcePath, lbu);
        //       module._source._value = fs.readFileSync(lbuFilePath, { encoding: 'utf8' });
        //     }
        //   }
        // });
    //   });
    });
  }
}

module.exports = ReplacePlugin;
