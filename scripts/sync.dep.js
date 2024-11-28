const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

(function () {
  const { sourceRootPath, getSubModuleList } = require('./common/base');
  const ignoreAttrs = ['name', 'description', 'scripts', 'workspaces'];

  const mainPath = path.resolve(sourceRootPath, 'package.json');
  const mainPackage = fs.readFileSync(mainPath, 'utf8');
  // console.log(JSON.parse(mainPackage));
  const mainPackageObj = JSON.parse(mainPackage);
  const newDepObj = {};

  const moduleList = getSubModuleList();
  // console.log(moduleList);
  moduleList.forEach((val) => {
    // console.log(val);
    const packagePath = path.resolve(sourceRootPath, val, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageContent = fs.readFileSync(packagePath, 'utf8');
      const contentObj = JSON.parse(packageContent);
      //   console.log(packageContent);
      newDepObj.dependencies = {
        ...newDepObj.dependencies,
        ...contentObj.dependencies
      };
      Object.entries(mainPackageObj).forEach(([key, val]) => {
        if (!ignoreAttrs.includes(key)) {
          contentObj[key] = val;
        }
      });

      fs.writeFile(packagePath, JSON.stringify(contentObj, null, 2), (err) => {
        if (err) {
          console.log(chalk.red(`Sync up ${packagePath} error`), err);
        } else {
          console.log(`Sync up ${packagePath} successfully`);
        }
      });
    }
  });
})();
