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
      webpack: { Compilation, sources, NormalModule }
    } = compiler;
    const { RawSource } = sources;

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.finishModules.tap(pluginName, (modules) => {
        const moduleList = [];
        Array.from(modules).forEach((module) => {
          const resourcePath = module.resource || '';
          if (/src\/.*$/.test(resourcePath)) {
            moduleList.push(module);
          }
        });
        moduleList.forEach((module) => {
          const resourcePath = module.resource || '';
          const res = resourcePath.match(/src\/.*$/);
          if (res) {
            const lbu = LBU.toLowerCase();
            const lbuFilePath = resourcePath.replace(/([\w-]+)(.ts|.tsx|)$/, `$1.${lbu}$2`);
            const isTsFile = /.(ts|tsx)$/.test(resourcePath);
            if (isTsFile && fs.existsSync(lbuFilePath)) {
              // console.log(resourcePath, lbu);
              const targetModule = moduleList.find(m => m.resource === lbuFilePath)
              // module._source._value = targetModule._source._value;
              // console.log(targetModule)
              module = targetModule;
            }
          }
          });
          //   });
          // const resourcePath = module.resource || '';
          // const res = resourcePath.match(/src\/.*$/);
          // if (res) {
          //   console.log('111111', module.resource);
          //   if (resourcePath === '/Users/lester/projects/react-web/src/views/feature-one/detail/content.my.tsx') {
          //     // console.log(module._source);
          //     // console.log(compilation.modules);
          //     const t = Array.from(compilation.modules).find((module) => module.resource === '/Users/lester/projects/react-web/src/views/feature-one/detail/content.tsx');
          //     console.log(t.resource);
              
          //   }
          // }
      })
      // compilation.hooks.optimizeModules(pluginName, (module) => {
      //   Array.from(allModules).forEach((module) => {
      //     const resourcePath = module.resource || '';
      //     const res = resourcePath.match(/src\/.*$/);
      //     if (res) {
      //       const lbu = LBU.toLowerCase();
      //       const lbuFilePath = resourcePath.replace(/([\w-]+)(.ts|.tsx|)$/, `$1.${lbu}$2`);
      //       const isTargetSource = /.(ts|tsx)$/.test(resourcePath);
      //       if (isTargetSource && fs.existsSync(lbuFilePath)) {
      //         console.log(resourcePath, lbu);
      //         module._source._value = fs.readFileSync(lbuFilePath, { encoding: 'utf8' });
      //       }
      //     }
      //   });
      // });
    });
  }
}

module.exports = ReplacePlugin;
