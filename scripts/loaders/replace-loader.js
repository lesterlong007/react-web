const fs = require('fs');
const { location, lbu } = require('../common/base');

module.exports = function (source) {
  // console.log(this.getOptions());
  if (lbu) {
    const lbuFilePath = this.resourcePath.replace(/([\w-]+)(\.ts|\.tsx|\.json)$/, `$1.${location}.${lbu}$2`);
    if (fs.existsSync(lbuFilePath)) {
      return fs.readFileSync(lbuFilePath, { encoding: 'utf8' });
    }
  }
  const locationFilePath = this.resourcePath.replace(/([\w-]+)(\.ts|\.tsx|\.json)$/, `$1.${location}$2`);
  if (fs.existsSync(locationFilePath)) {
    return fs.readFileSync(locationFilePath, { encoding: 'utf8' });
  }
  return source;
};
