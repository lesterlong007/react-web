const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

const content = fs.readFileSync(path.resolve(__dirname, '../src/index.tsx'), { encoding: 'utf8' });
console.log(content);

const result = content.match(/import\s+/);
console.log(result);
