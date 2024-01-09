const fs = require('fs');
const { LBU } = require('../common/base');

const isDev = process.env.NODE_ENV === 'development';

module.exports = function (source) {
  // console.log(this.getOptions());
  // this.resourcePath
  const lbu = LBU.toLowerCase();
  const lbuFilePath = this.resourcePath.replace(/([\w-]+)(.ts|.tsx)$/, `$1.${lbu}$2`);
  const lbuReg = new RegExp(`\\.(${lbu})\\.(ts|tsx)`);
  if (isDev && lbuReg.test(this.resourcePath)) {
    lbuReg.lastIndex = 0;
    const targetFilePath =  this.resourcePath.replace(new RegExp(`\\.(${lbu})\\.(ts|tsx)`), '.$2');
    const now = new Date();
    fs.utimes(targetFilePath, now, now, (err) => {
      if (err) {
        console.error('File save error: ', err);
      } else {
        console.log('\n File save synchronous successfully', targetFilePath);
      }
    });
  }
  if (fs.existsSync(lbuFilePath)) {
    console.log(this.resourcePath, lbu);
    return fs.readFileSync(lbuFilePath, { encoding: 'utf8' });
  }
  return source;
};
