const fs = require('fs');
const path = require('path');

const { sourceRootPath, commonRepo } = require('./common/base');

const demoPath = path.join(sourceRootPath, commonRepo, 'src/views');

const pageList = fs.readdirSync(demoPath).filter((val) => val !== 'demo');
const entryList = pageList.map((val) => ({
  name: val,
  path: `/common/${val}`
}));

fs.writeFile(path.join(demoPath, 'demo/data.json'), JSON.stringify(entryList, null, 2), (err) => {
  if (err) {
    console.warn(`Write demo file error:  ${err}`);
  } else {
    console.log('Write demo file successfully!');
  }
});

// const demoFlePath = path.join(demoPath, 'demo/index.tsx');
// const demoOriginalContent = fs.readFileSync(demoFlePath, { encoding: 'utf-8' });

// let demoPageStr = '';

// pageList.forEach((val, index) => {
//   demoPageStr += `\n  {\n    name: '${val}',\n    path: '/common/${val}'\n  }`;
//   if (index === pageList.length - 1) {
//     demoPageStr += '\n';
//   } else {
//     demoPageStr += ',';
//   }
// });
// console.log(demoPageStr);

// fs.writeFile(
//   demoFlePath,
//   demoOriginalContent.replace(
//     /(const\s+componentList:\s+ComponentItem\[\]\s+=\s+\[)([\s\S]*)(\])/,
//     `$1${demoPageStr}$3`
//   ),
//   (err) => {
//     if (err) {
//       console.warn(`Write demo json file error:  ${err}`);
//     } else {
//       console.log('Write demo json file successfully!');
//     }
//   }
// );
