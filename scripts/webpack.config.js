const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const DotEnvWebpack = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const BASENAME = '/react-web';
process.env.BASENAME = BASENAME;

const { argv } = require('yargs');
const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';
const ROOT_PATH = path.resolve(__dirname, '../');

const cssReg = /\.css$/;
const cssModuleReg = /\.module\.css$/;
const sassReg = /\.scss$/;
const sassModuleReg = /\.module\.scss$/;

const envConfig = {
  dev: path.resolve(__dirname, '../env/.env.dev'),
  sit: path.resolve(__dirname, '../env/.env.sit'),
  uat: path.resolve(__dirname, '../env/.env.uat'),
  prod: path.resolve(__dirname, '../env/.env.prod'),
  local: path.resolve(__dirname, '../env/.env.local'),
};

const getStyleLoader = (isModule = false, isSass = false) => {
  const cssModuleLoader = {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: '[local]_[hash:base64:5]',
      },
    },
  };
  const loaders = [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    isModule ? cssModuleLoader : 'css-loader',
    'postcss-loader',
  ];
  if (isSass) {
    loaders.push('sass-loader');
  }
  return loaders;
};

module.exports = {
  entry: {
    main: path.resolve(ROOT_PATH, './src/index.tsx'),
  },
  output: {
    path: path.resolve(ROOT_PATH, './dist'),
    filename: 'js/[name].[chunkhash:8].bundle.js',
    publicPath: isDev ? '/' : `${BASENAME}/`,
  },
  mode: NODE_ENV || 'production',
  module: {
    rules: [
      {
        test: cssReg,
        exclude: cssModuleReg,
        use: getStyleLoader(false, false),
      },
      {
        test: cssModuleReg,
        exclude: /node_modules/,
        use: getStyleLoader(true, false),
      },
      {
        test: sassReg,
        exclude: sassModuleReg,
        use: getStyleLoader(false, true),
      },
      {
        test: sassModuleReg,
        exclude: /node_modules/,
        use: getStyleLoader(true, true),
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ico$/],
        loader: 'url-loader',
        exclude: /node_modules/,
        options: {
          esModule: false,
          limit: 1000,
          name: 'images/[name].[contenthash:8].[ext]',
        },
      },
      {
        test: /\.(woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'font/[name].[contenthash:8].[ext]',
        },
      },
    ],
  },
  resolve: {
    alias: {
      src: path.resolve(ROOT_PATH, './src'),
      '@': path.resolve(ROOT_PATH, './src'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.scss', '.css'],
  },
  plugins: [
    new DotEnvWebpack({
      path: envConfig[argv.env || 'local'],
    }),
    new DefinePlugin({
      'process.env.BASENAME': JSON.stringify(`${BASENAME}`),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(ROOT_PATH, './static'),
          to: path.resolve(ROOT_PATH, './dist/static'),
        },
      ],
    }),
    new HtmlPlugin({
      template: path.resolve(ROOT_PATH, './public/index.html'),
      favicon: path.resolve(ROOT_PATH, './public/favicon.ico'),
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true,
      },
      inject: 'head',
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? 'css/[name][hash:8].css' : 'css/[name].[chunkhash:8].css',
      chunkFilename: isDev ? 'css/[id][hash:8].css' : 'css/[id].[chunkhash:8].css',
      ignoreOrder: true,
    }),
    new ESLintPlugin(),
  ],
};
