const fs = require('fs');
const path = require('path');

const { sourceRootPath, commonRepo, hasExtension } = require('./common/base');

const componentsPath = path.join(sourceRootPath, commonRepo, 'src/components');
const bizComponentsPath = path.join(sourceRootPath, commonRepo, 'src/biz-components');
const demoPath = path.join(sourceRootPath, commonRepo, 'src/views');
const ignoreComponents = ['code-block'];
const ignoreBizComps = [];

const componentList = fs.readdirSync(componentsPath).filter((cm) => !ignoreComponents.includes(cm));
// console.log(componentList);
const bizComponents = fs
  .readdirSync(bizComponentsPath)
  .filter((cm) => !ignoreBizComps.includes(cm));

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
import { ${componentName} } from '@common/${type}';
import CodeBlock from '@common/components/code-block';

const demoCode = '';

const ${componentName}Page: React.FC = () => {
  return (
    <div className="w-full">
      <h3>${componentName}</h3>
      <CodeBlock code={demoCode} />
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
