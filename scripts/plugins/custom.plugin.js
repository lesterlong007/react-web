const fs = require('fs');
const path = require('path');

class MyCustomPlugin {
  options = {
    outputFile: 'assets.md'
  };

  constructor(options = {}) {
    this.options = { ...this.options, ...options };
  }

  apply (compiler) {
    const pluginName = MyCustomPlugin.name;
    const {
      webpack: { Compilation, sources }
    } = compiler;
    const { RawSource } = sources;

    // compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
    //   compilation.hooks.processAssets.tap(
    //     {
    //       name: pluginName,
    //       stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
    //     },
    //     (assets) => {
    //       const content =
    //         '# In this build:\n\n' +
    //         Object.keys(assets)
    //           .map((filename) => `- ${filename}`)
    //           .join('\n');
    //       compilation.emitAsset(this.options.outputFile, new RawSource(content));
    //     }
    //   );
    // });

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.afterOptimizeModules.tap(pluginName, (modules) => {
        // const sourceModules = [];
        // modules.forEach((module) => {
        //   if (filterPath(module.resource)) {
        //     sourceModules.push(module);
        //     // console.log(module.resource);
        //     // if (module.resource.includes('/feature-one-alpha-1')) {
        //     //   modules.delete(module);
        //     // }
        //   }
        // });
        // sourceModules.forEach((module, index) => {
        //   // console.log(module.resource);
        //   if (index === 0) {
        //     const originalSource = module.originalSource().source();
        //     // module._source._value
        //     // console.log(originalSource);
        //     // console.log(module);
        //   }
        // });
      });

      compilation.hooks.optimizeAssets.tap(pluginName, (assets) => {
        const sourceMap = compilation.sourceMaps;
        const modules = compilation.modules;
        // console.log(compilation.assets);
        modules.forEach((module) => {
          if (module.resource && !module.resource.includes('node_modules')) {
            const sourcePath = module.resource;
            // console.log(`> ${sourcePath}`);
          }
        });

        Object.keys(assets).forEach((asset) => {
          // console.log(`- ${asset}`);
        });
      });
    });

    compiler.hooks.emit.tap(pluginName, (compilation) => {
      // console.log(Object.keys(compilation));
      // delete compilation.assets['favicon.ico'];
    });
  }
}

module.exports = MyCustomPlugin;
