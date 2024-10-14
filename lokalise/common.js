const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('node:child_process');

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args)).then((res) => res.json());

const hinder = (msg) => console.log(chalk.red(msg));

const getBranch = () => execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s/gm, '');

const fetchRemote = () => execSync('git fetch');

const isUpdated = () => {
  const res = execSync('git checkout').toString();
  return /Your branch is up to date/m.test(res);
};

const getEnTransContent = (location) => {
  const lbuDirPath = path.resolve(__dirname, '../', location.toUpperCase());
  const fileList = fs.readdirSync(lbuDirPath);
  const keyMsg = {};

  const getPrefixName = (filename) => {
    const nameArr = filename.split('.');
    if (nameArr.length !== 3) {
      throw new Error('Please rename your filename to conform to rules');
    }
    return nameArr[0];
  };

  const joinKey = (filename, data) => {
    const prefix = getPrefixName(filename);
    Object.entries(data).forEach(([key, val]) => {
      keyMsg[`${prefix}.${key}`] = val;
    });
  };

  fileList.forEach((filename) => {
    try {
      const data = require(path.join(lbuDirPath, filename));
      joinKey(filename, data);
    } catch (e) {
      console.log(e);
    }
  });

  return keyMsg;
};

module.exports = {
  getEnTransContent,
  fetch,
  hinder,
  fetchRemote,
  getBranch,
  isUpdated
};
