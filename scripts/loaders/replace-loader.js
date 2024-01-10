const fs = require('fs');
const { lbu } = require('../common/base');

module.exports = function (source) {
  // console.log(this.getOptions());
  // this.resourcePath
  const lbuFilePath = this.resourcePath.replace(/([\w-]+)(.ts|.tsx)$/, `$1.${lbu}$2`);
  if (fs.existsSync(lbuFilePath)) {
    // console.log(this.resourcePath, lbu);
    return fs.readFileSync(lbuFilePath, { encoding: 'utf8' });
  }
  return source;
};
