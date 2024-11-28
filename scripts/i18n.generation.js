const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const fa = require('fs-extra');

const { LOCATION, LBU, sourceRootPath, lokaliseRepo } = require('./common/base');

const getDirName = () => {
  if (!LBU) {
    if (LOCATION === 'MY') {
      return LOCATION + '_PAMB';
    } else {
      return LOCATION;
    }
  } else {
    return LOCATION + '_' + LBU;
  }
};

const lbuDirPath = path.resolve(sourceRootPath, lokaliseRepo, getDirName());
if (!fs.existsSync(lbuDirPath)) {
  fs.mkdirSync(lbuDirPath);
}

const fileList = fs.readdirSync(lbuDirPath);
const destructureFilename = (filename) => {
  const nameArr = filename.split('.');
  if (nameArr.length !== 3) {
    throw new Error('Please rename your filename to conform to rules');
  }
  const combinedName = nameArr[1].replace(/_[a-zA-Z]+$/, '') + '.json';
  const prefix = nameArr[0];
  return {
    combinedName,
    prefix
  };
};

const langMap = new Map();
fileList.forEach((filename) => {
  const { combinedName } = destructureFilename(filename);
  if (!langMap.has(combinedName)) {
    langMap.set(combinedName, {});
  }
});

const joinKey = (filename, data) => {
  const { combinedName, prefix } = destructureFilename(filename);
  Object.entries(data).forEach(([key, val]) => {
    // console.log(`${prefix}.${key}`, val);
    langMap.get(combinedName)[`${prefix}.${key}`] = val;
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

console.log('LOCATION:', LOCATION);
console.log('LBU:', LBU);

const dirPath = path.join(sourceRootPath, 'src/i18n/');
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}
fa.emptyDirSync(dirPath);

langMap.forEach((val, key) => {
  const targetFile = path.join(dirPath, key);
  fs.writeFile(targetFile, JSON.stringify(val, null, 2), (err) => {
    if (err) {
      console.log(chalk.red(`Generate combined translation file ${targetFile} error`), err);
    } else {
      console.log(`Generate combined ${key} successfully from ${getDirName()}`);
    }
  });
});

const targetIndexFile = path.join(dirPath, 'index.js');
let indexContent = '';

for (const filename of langMap.keys()) {
  indexContent += `import ${filename.replace('.json', '')} from './${filename}';\n`;
}

indexContent += '\nconst resources = {';

for (const filename of langMap.keys()) {
  const lang = filename.replace('.json', '');
  indexContent += `\n  '${lang.replace(/_/g, '-')}': {\n    translation: ${lang}\n  },`;
}

indexContent += '\n};\n\nexport default resources;\n';

fs.writeFile(targetIndexFile, indexContent, (err) => {
  if (err) {
    console.log(chalk.red('Generate translation index.js file error'), err);
  } else {
    console.log('Generate translation index.js file successfully');
  }
});
