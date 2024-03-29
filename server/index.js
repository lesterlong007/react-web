// require('ignore-styles');
require('@babel/core').transform('code', {
  plugins: ['transform-require-context']
});
require('@babel/register')({
  ignore: [/(node_modules)/],
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  plugins: [
    'transform-require-context',
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
          src: './src'
        }
      }
    ]
  ],
  extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
});

const { argv } = require('yargs');
const renderType = argv.type || 'ssr';

if (renderType === 'ssr') {
  require('./server.js');
} else {
  require('./ssg.js');
}
