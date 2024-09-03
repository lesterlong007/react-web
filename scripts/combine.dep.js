const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

(function () {
  const { sourceRootPath, getSubModuleList } = require('./common/base');

  const mainPath = path.resolve(sourceRootPath, 'package.json');
  const mainPackage = fs.readFileSync(mainPath, 'utf8');
  // console.log(JSON.parse(mainPackage));
  const mainPackageObj = JSON.parse(mainPackage);
  const newDepObj = {};

  const moduleList = getSubModuleList();
  // console.log(moduleList);
  moduleList.forEach((val) => {
    // console.log(val);
    const packageContent = fs.readFileSync(path.resolve(sourceRootPath, val, 'package.json'), 'utf8');
    const contentObj = JSON.parse(packageContent);
    //   console.log(packageContent);
    newDepObj.dependencies = {
      ...newDepObj.dependencies,
      ...contentObj.dependencies
    };
    newDepObj.devDependencies = {
      ...newDepObj.devDependencies,
      ...contentObj.devDependencies
    };
  });

  const combination = {
    ...mainPackageObj
  };

  combination.dependencies = {
    ...newDepObj.dependencies,
    ...mainPackageObj.dependencies
  };

  combination.devDependencies = {
    ...newDepObj.devDependencies,
    ...mainPackageObj.devDependencies
  };
  //   console.log(JSON.stringify(combination));
  fs.writeFile(mainPath, JSON.stringify(combination, null, 2), (err) => {
    if (err) {
      console.log(chalk.red('Combine package.json dependencies error'), err);
    } else {
      console.log('Combine successfully');
    }
  });
})();
