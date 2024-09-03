const fs = require('fs');
const path = require('path');

(function () {
  const { sourceRootPath, getSubModuleList } = require('./common/base');
  const configFileList = ['.eslintrc.js', 'babel.config.js', 'jest.config.js', 'prettier.config.js'];
  const moduleList = getSubModuleList();

  configFileList.forEach((file) => {
    const sourceFile = path.resolve(sourceRootPath, file);
    moduleList.forEach((sub) => {
      const subFile = path.resolve(sourceRootPath, sub, file);
      fs.copyFile(sourceFile, subFile, (err) => {
        if (err) {
          console.error(`Copy config file ${subFile} `, err);
        } else {
          console.log(`Copy config file ${subFile} successfully!`);
        }
      });
    });
  });
})();
