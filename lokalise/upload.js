// https://developers.lokalise.com/reference/upload-a-file
const { execSync } = require('node:child_process');
const inquirer = require('inquirer');
const { Command } = require('commander');
const { LBU_LIST, mutationOptions } = require('./config');
const { getEnTransContent, hinder, fetch, getBranch, fetchRemote, isUpdated } = require('./common');
const program = new Command();

const configList = {
  type: 'rawlist',
  message: 'Please select which LBU you want to upload',
  name: 'lbu',
  choices: LBU_LIST, // All LBU config
  filter: (val) => val
};

const uploadTrans = (location, opt) => {
  const keyMsgMap = getEnTransContent(location);
  const fileBase64 = Buffer.from(JSON.stringify(keyMsgMap)).toString('base64');
  const options = mutationOptions(location, {
    ...opt,
    fileBase64
  });
  fetch(options.fetchUrl, options.params)
    .then((res) => console.log(res))
    .catch((err) => {
      hinder(`load lokalise failed: ${err}`);
    });
};

program
  .command('upload')
  .description('select LBU')
  .action(async () => {
    const branch = getBranch();
    const isDev = /^\w+-\d{4}-DEVELOP$/.test(branch) || branch === 'develop';

    fetchRemote();

    if (!isUpdated()) {
      console.log('***************************************');
      hinder('Please update your code first');
      return;
    }
    const prompt = inquirer.default.prompt;
    const { location, tags, language } = await prompt(configList).then((res) => {
      return res.lbu;
    });

    const cleanup = !isDev
      ? false
      : await prompt({
          type: 'rawlist',
          message: `You are currently on ${branch}, you do want enable cleanup mode`,
          name: 'cleanup',
          choices: [
            {
              name: 'YES (lokalise keys will be deleted if not exist in local)',
              value: true
            },
            {
              name: 'NO (only insert new local keys to lokalise)',
              value: false
            }
          ]
        }).then((r) => r.cleanup);

    uploadTrans(location, { tags, language, cleanup: false });
  });

program.parse(process.argv);
