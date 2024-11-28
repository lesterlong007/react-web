const fs = require('fs');
const inquirer = require('inquirer');

const ignoreMockPath = [
  'react',
  'qs',
  'react-i18next',
  'i18next',
  'classnames',
  'dayjs',
  '@common/constants',
  '@common/components',
  '@/common/network/request'
];

const mockUtilDevice = (mod) => {
  const mockBody = [];
  switch (mod) {
    case 'useScreenType':
      mockBody.push('  useScreenType: jest.fn().mockReturnValue({');
      mockBody.push('    isMobile: true,');
      mockBody.push('    isTablet: false,');
      mockBody.push('    isDesktop: false,');
      mockBody.push('  }),');
      break;
    default:
      mockBody.push(`  ${mod}: jest.fn(),`);
  }
  return mockBody;
};

const mockUtilGlobal = (mod) => {
  const mockBody = [];
  switch (mod) {
    case 'pruStore':
      mockBody.push('  pruStore: {');
      mockBody.push("    getItem: jest.fn().mockReturnValue(''),");
      mockBody.push('    setItem: jest.fn(),');
      mockBody.push('  },');
      break;
    default:
      mockBody.push(`  ${mod}: jest.fn(),`);
  }
  return mockBody;
};

const mockUtilFormatter = (mod) => {
  const mockBody = [];
  switch (mod) {
    default:
      mockBody.push(`  ${mod}: jest.fn(k => k),`);
  }
  return mockBody;
};

const customizeMock = (mockPath, mod) => {
  switch (mockPath) {
    case '@common/util/device':
      return mockUtilDevice(mod);
    case '@common/util/global':
      return mockUtilGlobal(mod);
    case '@common/util/util/formatter':
      return mockUtilFormatter(mod);
    default:
      return [`  ${mod}: jest.fn(),`];
  }
};

exports.generateUT = (filePath) => {
  const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const utImportPart = ["import React, { act } from 'react';", "import '@testing-library/jest-dom';", "import { render, screen, fireEvent } from '@testing-library/react';"];
  const utMockPart = [];
  const multipleLineImport = [];
  const exportNames = { default: '', named: [] };

  content.split('\n').forEach((line) => {
    const defaultImport = /\s*import\s+(\w+)\s+from\s+['"](.+)['"]/.exec(line);
    if (defaultImport) {
      const [, module, modulePath] = defaultImport;
      if (!ignoreMockPath.includes(modulePath)) {
        const mockPath = modulePath.replace(/(?:^\.\/)|(^\.\.\/)/, '../$1');

        utImportPart.push(`import ${module} from '${mockPath}';`);
        utMockPart.push(`jest.mock('${mockPath}', () => {`);
        if (/^[A-Z]/.test(module)) {
          utMockPart.push(`  return () => <div>${module}</div>`);
        } else {
          utMockPart.push(`  return jest.fn();`);
        }
        utMockPart.push('});');
        utMockPart.push('');
      }
      return;
    }

    const isNamedImport = /\s*import\s+(?:(\w+)\s*,\s+)?\{/.test(line);
    const isImportFinished = /\sfrom\s/.test(line);

    if (isNamedImport || multipleLineImport.length > 0) {
      multipleLineImport.push(line);
      if (!isImportFinished) {
        return;
      }
      const fullImport = multipleLineImport.join('');
      const namedImport = /\s*import\s+(?:(\w+)\s*,\s+)?\{([^}]+)\}\s+from\s+['"](.+)['"]/.exec(fullImport);
      const [, defaultModule, module, modulePath] = namedImport;
      const mockPath = modulePath.replace(/(?:^\.\/)|(^\.\.\/)/, '../$1');

      if (ignoreMockPath.includes(modulePath)) {
        multipleLineImport.length = 0;
        return;
      }

      utImportPart.push(`import ${defaultModule ? defaultModule + ', ' : ''}{${module}} from '${mockPath}';`);
      utMockPart.push(`jest.mock('${mockPath}', () => ({`);
      if (defaultModule) {
        utMockPart.push('  __esModule: true,');
        utMockPart.push(`  default: jest.fn(() => <div>${defaultModule}</div>),`);
      }
      for (const mod of module.replace(/\s+/g, '').split(',')) {
        if (mod) {
          utMockPart.push(...customizeMock(mockPath, mod));
        }
      }
      utMockPart.push('}));');
      utMockPart.push('');
      multipleLineImport.length = 0;
    }

    const defaultExport = /export default\s+(?:\w+\()?(\w+)\)?/.exec(line);
    if (defaultExport) {
      exportNames.default = ' ' + defaultExport[1];
    }
    const namedExport = /export\s+(?:const|let)\s+(\w+)\s*=/.exec(line);
    if (namedExport) {
      exportNames.named.push(namedExport[1]);
    }
  });

  const exportedItems = exportNames.named.length ? `{ ${exportNames.named.join(', ')} }` : '';
  const importSeparator = exportNames.default && exportedItems ? ', ' : '';
  const fileName = filePath.replace(/.+\/([\w-]+)\..+/, '$1');
  utImportPart.push(`import${exportNames.default}${importSeparator}${exportedItems} from '../${fileName}';`);
  utImportPart.push('');

  const testBody = [`describe('test ${fileName}', () => {`, "  it('{case desc}', () => {", '  })', '});', ''];

  return utImportPart.concat(utMockPart).concat(testBody).join('\n');
};

// run by command line
if (process.argv[2] === 'CMD') {
  const filePath = process.argv[3];
  if (!filePath || !fs.existsSync(filePath)) {
    console.log('\x1b[31m');
    console.error('Please input an existed source file!');
    console.log('\x1b[0m');
    return;
  }

  const utPath = filePath.replace(/(.*\/)([\w-.]+)\.\w+$/, '$1__tests__/$2.test.js');
  if (!fs.existsSync(utPath)) {
    try {
      fs.mkdirSync(utPath.replace(/\/[\w-.]+\.test.js$/, ''));
    } catch {}
    fs.writeFileSync(utPath, this.generateUT(filePath));
  } else {
    const prompt = inquirer.createPromptModule();
    prompt({
      type: 'list',
      message: 'Do you want overwrite old UT file',
      name: 'mode',
      choices: [
        {
          name: 'Yes',
          value: 'Y'
        },
        {
          name: 'No',
          value: 'N'
        }
      ]
    }).then((res) => {
      if (res.mode === 'Y') {
        fs.writeFileSync(utPath, this.generateUT(filePath));
      } else {
        console.log(this.generateUT(filePath));
      }
    });
  }
}
