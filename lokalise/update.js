// https://developers.lokalise.com/reference/download-files
const fs = require('fs');
const path = require('path');
const { execSync } = require('node:child_process');
const compressing = require('compressing');
const urllib = require('urllib');
const inquirer = require('inquirer');
const { Command } = require('commander');
const chalk = require('chalk');
const program = new Command();
const { LBU_LIST, requestOptions } = require('./config');
const { getEnTransContent, hinder, fetch, getBranch, fetchRemote, isUpdated } = require('./common');

const tips = (msg) => console.log(chalk.green(msg));

const configList = {
  type: 'rawlist',
  message: 'Please select which LBU you want to update',
  name: 'lbu',
  choices: LBU_LIST, // All LBU config
  filter: (val) => val
};

const prOrNot = {
  type: 'rawlist',
  message: 'Do you want to create a new lokalise branch',
  name: 'flag',
  choices: [
    {
      name: 'YES',
      value: 'Y'
    },
    {
      name: 'NO',
      value: 'N'
    }
  ],
  filter: (val) => val
};

const updateTrans = (location, cb) => {
  const options = requestOptions(location);
  const LOCATION = location.toUpperCase();
  tips(`loading ${location} translation json`);
  fetch(options.fetchUrl, options.params)
    .then((response) => {
      urllib
        .request(response.bundle_url, {
          streaming: true,
          followRedirect: true
        })
        .then(async (result) => {
          const tempPath = 'temp';
          await compressing.zip.uncompress(result.res, tempPath);
          const newResourse = `${tempPath}/${LOCATION}`;
          const files = fs.readdirSync(newResourse);
          files.forEach((file) => {
            const msgs = require(path.resolve(__dirname, '../', `${newResourse}/${file}`));
            // console.log(msgs);
            const fileMap = new Map();
            Object.entries(msgs).forEach(([key, val]) => {
              const sepPrefix = key.match(/^[\w]+(?=\.)/)[0];
              const sepKey = key.match(/(?<=[\w]+\.).*/)[0];
              if (fileMap.has(sepPrefix)) {
                fileMap.get(sepPrefix)[sepKey] = val;
              } else {
                fileMap.set(sepPrefix, { [sepKey]: val });
              }
            });
            fileMap.forEach((val, key) => {
              fs.writeFileSync(
                path.resolve(__dirname, '../', '', LOCATION, `${key}.${file}`),
                JSON.stringify(val, null, 2)
              );
            });
            // console.log(fileMap);
          });
          fs.rm(tempPath, { recursive: true }, (err) => err && console.warn(err));
        })
        .then(() => {
          tips(`update success! the filepath is ${LOCATION}`);
          cb();
        })
        .catch((err) => {
          hinder(`load lokalise failed: ${err}`);
        });
    })
    .catch((err) => {
      hinder(err);
    });
};

const createBranchName = () => {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dateIndex = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `lokalise-${date.getFullYear()}-${month}-${dateIndex}_${hour}-${minute}-${second}`;
};

const createNewBranch = (branchName) => {
  execSync('git add .');
  execSync('git stash');
  execSync(`git branch ${branchName}`);
  execSync(`git checkout ${branchName}`);
};

const pushNewBranch = (branchName, location, originalBranchName) => {
  if (execSync('git diff').toString()) {
    execSync('git add .');
    execSync(`git commit -m"Translations update for ${location.toUpperCase()}"`);
    execSync(`git push -u origin ${branchName}`);
    execSync(`git checkout ${originalBranchName}`);
    if (execSync('git stash list').toString()) {
      execSync('git stash pop');
    }
  } else {
    execSync(`git checkout ${originalBranchName}`);
    execSync(`git branch -d ${branchName}`);
    if (execSync('git stash list').toString()) {
      execSync('git stash pop');
    }
  }
};

program
  .command('update')
  .description('select LBU')
  .action(async () => {
    const prompt = inquirer.default.prompt;
    const prFlag = await prompt(prOrNot).then((res) => res.flag);
    const currentBranch = getBranch();
    let newBranchName = '';

    if (prFlag === 'Y') {
      if (!/^\w+-\d{4}-DEVELOP$/.test(currentBranch)) {
        console.log('***************************************');
        return hinder('Please switch your branch to latest DEVELOP branch');
      }

      fetchRemote();

      if (!isUpdated()) {
        console.log('***************************************');
        return hinder('Please update your code first');
      }

      newBranchName = createBranchName();
      createNewBranch(newBranchName);
    }

    const { location } = await prompt(configList).then((res) => res.lbu);
    updateTrans(location, () => {
      if (prFlag === 'Y') {
        pushNewBranch(newBranchName, location, currentBranch);
      }
    });
  });

program.parse(process.argv);
