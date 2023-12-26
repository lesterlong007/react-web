const fs = require('fs');
const path = require('path');

class CheckModule {
  options = {
    dirPath: 'src/views'
  };

  constructor (options = {}) {
    this.options = { ...this.options, ...options };
  }

  apply (compiler) {
    const pluginName = CheckModule.name;
  }
}

module.exports = CheckModule;
