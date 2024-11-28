const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const { sourceRootPath } = require('./common/base');

const env = process.env.BUILD_ENV;

const getBranchName = () => {
  console.log('fetch submodule------', env);
  switch (env) {
    case 'sit':
      return 'sit';
    case 'uat':
      return 'release';
    case 'prod':
      return 'master';
    case 'dev':
    default:
      return 'develop';
  }
};

const run = () => {
  const branch = getBranchName();
  const gitModulesPath = path.resolve(sourceRootPath, '.gitmodules');
  const modulesStr = fs.readFileSync(gitModulesPath, { encoding: 'utf8' });

  const moduleList = modulesStr.match(/(?<=path\s*=\s*)\S+/g);
  const urlList = modulesStr.match(/(?<=url\s*=\s*)\S+/g);

  moduleList.forEach((val, index) => {
    if (!fs.existsSync(path.resolve(sourceRootPath, val))) {
      execSync(`git submodule add ${urlList[index]}`);
    }
  });

  fs.writeFile(gitModulesPath, modulesStr.replace(/(?<=branch\s*=\s*)\S+/g, branch), (err) => {
    if (err) {
      console.log(chalk.red('Overwrite .git modules error'), err);
    } else {
      console.log('Overwrite .git modules  successfully');
    }
    execSync('git submodule update --init --remote');
    console.log('Pull sub modules successfully');
  });
};

run();
