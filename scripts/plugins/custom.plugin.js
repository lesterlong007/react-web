const fs = require('fs');
const path = require('path');

const filterPath = (path) => {
  return path && !path.includes('node_modules');
};

class MyCustomPlugin {
  options = {
    outputFile: 'assets.md'
  };

  constructor (options = {}) {
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
        // console.log(modules);
        const sourceModules = [];
        modules.forEach((module) => {
          if (filterPath(module.resource)) {
            sourceModules.push(module);
          }
        });
        sourceModules.forEach((module, index) => {
          console.log(module.resource);
          if (index === 0) {
            const originalSource = module.originalSource().source();
            // module._source._value
            console.log(originalSource);
          }
        });
      });
    });

    // compiler.hooks.make.tapAsync(pluginName, (compilation, next) => {
    //   console.log('\n my custom plugin is run');
    //   console.log(Object.keys(compilation.assets));
    //   next();
    // });

    // compiler.hooks.emit.tapAsync(pluginName, (compilation, next) => {
    //   console.log('\n my custom plugin is emit');
    //   next();
    // });

    compiler.hooks.done.tapAsync(pluginName, (stats, next) => {
      const bundles = stats.toJson();
      bundles.chunks.forEach((ck) => {
        const files = ck.modules.filter((m) => m.nameForCondition && m.name && !m.name.includes('node_modules')).map((m) => m.nameForCondition);
        // console.log(files);
      });
      next();
    });
  }
}

module.exports = MyCustomPlugin;
