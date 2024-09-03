const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const DotEnvWebpack = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MyCustomPlugin = require('./plugins/custom.plugin');
const CheckModulePlugin = require('./plugins/check.module.js');

const { basename, LOCATION, LBU, getCssModuleIdentName } = require('./common/base.js');
process.env.BASENAME = basename;

const { argv } = require('yargs');
const { NODE_ENV } = process.env;
const isDevMode = NODE_ENV === 'development';
const ROOT_PATH = path.resolve(__dirname, '../');
const env = argv.env || process.env.BUILD_ENV || 'local';

const cssReg = /\.css$/;
const cssModuleReg = /\.module\.css$/;
const sassReg = /\.scss$/;
const sassModuleReg = /\.module\.scss$/;

const envConfig = {
  dev: path.resolve(__dirname, '../env/.env.dev'),
  sit: path.resolve(__dirname, '../env/.env.sit'),
  uat: path.resolve(__dirname, '../env/.env.uat'),
  prod: path.resolve(__dirname, '../env/.env.prod'),
  local: path.resolve(__dirname, '../env/.env.local')
};

const getStyleLoader = (isModule = false, isSass = false) => {
  const cssModuleLoader = {
    loader: 'css-loader',
    options: {
      modules: {
        // localIdentName: '[local]_[hash:base64:5]'
        getLocalIdent: (context, _, localName) => getCssModuleIdentName(localName, context.resourcePath)
      }
    }
  };
  const loaders = [isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader, isModule ? cssModuleLoader : 'css-loader', 'postcss-loader'];
  if (isSass) {
    loaders.push('sass-loader');
  }
  return loaders;
};

module.exports = {
  entry: {
    main: path.resolve(ROOT_PATH, './src/index.tsx')
  },
  output: {
    path: path.resolve(ROOT_PATH, './dist'),
    filename: 'js/[name].[chunkhash:8].bundle.js',
    publicPath: isDevMode ? '/' : `${basename}/`
  },
  mode: NODE_ENV || 'production',
  resolveLoader: {
    modules: ['scripts/loaders', 'node_modules']
  },
  module: {
    rules: [
      {
        test: cssReg,
        exclude: cssModuleReg,
        use: getStyleLoader(false, false)
      },
      {
        test: cssModuleReg,
        exclude: /node_modules/,
        use: getStyleLoader(true, false)
      },
      {
        test: sassReg,
        exclude: sassModuleReg,
        use: getStyleLoader(false, true)
      },
      {
        test: sassModuleReg,
        exclude: /node_modules/,
        use: getStyleLoader(true, true)
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-typescript']
            }
          }
        ]
      },
      {
        test: /\.(ts|tsx|json)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'replace-loader',
            options: {
              name: 'test'
            }
          }
        ]
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ico$/],
        loader: 'url-loader',
        exclude: /node_modules/,
        options: {
          esModule: false,
          limit: 1000,
          name: 'images/[name].[contenthash:8].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset',
        generator: {
          filename: '[name].[contenthash:8][ext]',
          outputPath: isDevMode ? '' : 'fonts/',
          publicPath: isDevMode ? '/' : 'fonts/'
        }
      },
      {
        test: /\.icon\.svg$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'icon-loader']
      }
    ]
  },
  resolve: {
    alias: {
      src: path.resolve(ROOT_PATH, './src'),
      '@': path.resolve(ROOT_PATH, './src'),
      '@common': path.resolve(ROOT_PATH, './new-pruservice-common/src')
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.scss', '.css']
  },
  plugins: [
    new CheckModulePlugin(),
    new MyCustomPlugin(),
    new ProgressBarPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx']
    }),
    new DotEnvWebpack({
      path: envConfig[env]
    }),
    new DefinePlugin({
      'process.env.BASENAME': JSON.stringify(`${basename}`),
      'process.env.LOCATION': JSON.stringify(LOCATION),
      'process.env.LBU': JSON.stringify(LBU),
      'process.env.LOCAL_BUILD': JSON.stringify(isDevMode)
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(ROOT_PATH, './static'),
          to: path.resolve(ROOT_PATH, './dist/static')
        }
      ]
    }),
    new HtmlPlugin({
      template: path.resolve(ROOT_PATH, './public/index.html'),
      favicon: path.resolve(ROOT_PATH, './public/favicon.ico'),
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true
      },
      inject: 'head'
    }),
    new MiniCssExtractPlugin({
      filename: isDevMode ? 'css/[name][hash:8].css' : 'css/[name].[chunkhash:8].css',
      chunkFilename: isDevMode ? 'css/[id][hash:8].css' : 'css/[id].[chunkhash:8].css',
      ignoreOrder: true
    })
  ]
};
