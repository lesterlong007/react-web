const pluginName = 'MyCustomPlugin';

class MyCustomPlugin {
  apply (compiler) {
    compiler.hooks.run.tapAsync(pluginName, (compilation, next) => {
      console.log('\n my custom plugin is run');
      next();
    });
    compiler.hooks.emit.tapAsync(pluginName, (compilation, next) => {
      console.log('\n my custom plugin is emit');
      next();
    });
  }
}

module.exports = MyCustomPlugin;
