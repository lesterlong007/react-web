const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const { sourceRootPath } = require('./common/base');

const env = process.env.BUILD_ENV;

const getBranchName = () => {
  switch (env) {
    case 'sit':
      return 'sit';
    case 'uat':
      return 'uat';
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
