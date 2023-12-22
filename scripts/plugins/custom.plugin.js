const fs = require('fs');
const path = require('path');

const filterPath = (path) => {
  return path && !path.includes('modules');
};

class MyCustomPlugin {
  options = {
    outputFile: 'assets.md'
  };

  constructor(options = {}) {
    this.options = { ...this.options, ...options };
  }

  apply(compiler) {
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

    compiler.hooks.normalModuleFactory.tap(pluginName, (nmf) => {
      nmf.hooks.beforeResolve.tapAsync(pluginName, (result, next) => {
        const { context, contextInfo, request } = result;
        const { issuer } = contextInfo;
        if (!context.includes('node_modules')) {
          // console.log(context);
        }
        if (filterPath(issuer)) {
          // console.log(contextInfo);
        }
        next();
      });

      nmf.hooks.afterResolve.tapAsync(pluginName, (result, next) => {
        if (filterPath(result.contextInfo?.issuer)) {
          // console.log(result.contextInfo?.issuer);
        }
        if (filterPath(result.createData?.resourceResolveData?.relativePath)) {
          // console.log(result.createData?.resourceResolveData?.relativePath);
        }

        // const { resourceResolveData } = result;
        // const {
        //   context: { issuer },
        //   path
        // } = resourceResolveData;
        // tree.addDependency(issuer, path);
        next();
      });
    });

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.finishModules.tapAsync(pluginName, (modules, next) => {
        // console.log(modules);
        next();
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
  }
}

module.exports = MyCustomPlugin;
