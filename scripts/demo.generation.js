const fs = require('fs');
const path = require('path');

const { sourceRootPath, commonRepo, hasExtension } = require('./common/base');

const componentsPath = path.join(sourceRootPath, commonRepo, 'src/components');
const bizComponentsPath = path.join(sourceRootPath, commonRepo, 'src/biz-components');
const demoPath = path.join(sourceRootPath, commonRepo, 'src/views');

const componentList = fs.readdirSync(componentsPath);
// console.log(componentList);
const bizComponents = fs.readdirSync(bizComponentsPath);

const generateDemoPages = (type) => {
  const comList = type === 'components' ? componentList : bizComponents;
  comList.forEach((dir) => {
    const targetPath = path.join(demoPath, dir);
    if (!fs.existsSync(targetPath) && !hasExtension(dir)) {
      console.log('Not exist: ' + dir);
      fs.mkdirSync(targetPath, { recursive: true });
      const componentName = dir
        .replace(/^[a-z]/, (letter) => letter.toUpperCase())
        .replace(/(?<=[a-zA-Z0-9])-(\w)/g, (_, letter) => letter.toUpperCase());
      const indexPath = path.join(targetPath, 'index.tsx');
      const indexContent = `import React from 'react';
import { CodeBlock, dracula } from '@react-email/code-block';
import { ${componentName} } from '@common/${type}';

const demoCode = '';

const ${componentName}Page: React.FC = () => {
  return (
    <div className="w-full">
      <h3>${componentName}</h3>
      <div className="w-full overflow-x-auto">
        <CodeBlock code={demoCode} lineNumbers theme={dracula} language="tsx" />
      </div>
      <${componentName} />
    </div>
  );
};

export default ${componentName}Page;\n`;
      const pagePath = path.join(targetPath, 'page.js');
      const pageContent =
        "export default {\n  title: 'Alert demo page',\n  location: ['ALL']\n};\n";
      fs.writeFile(indexPath, indexContent, (err) => {
        if (err) {
          console.warn('Write file error: ' + err);
        } else {
          console.log('Write file successfully: ' + indexPath);
        }
      });
      fs.writeFile(pagePath, pageContent, (err) => {
        if (err) {
          console.warn('Write file error: ' + err);
        } else {
          console.log('Write file successfully: ' + pagePath);
        }
      });
    }
  });
};

generateDemoPages('components');
generateDemoPages('biz-components');

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
