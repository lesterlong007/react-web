const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MyCustomPlugin = require('./plugins/custom.plugin');
const CheckModulePlugin = require('./plugins/check.module.js');

const {
  basename,
  LOCATION,
  LBU,
  getCssModuleIdentName,
  getEnvVariables
} = require('./common/base.js');
process.env.BASENAME = basename;

const { NODE_ENV } = process.env;
const isDevMode = NODE_ENV === 'development';
const ROOT_PATH = path.resolve(__dirname, '../');

const publicVariables = {
  BASENAME: basename,
  LOCATION,
  LBU,
  LOCAL_BUILD: isDevMode
};

const envVariables = {
  ...publicVariables,
  ...getEnvVariables()
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
        test: /(?<!\.module)\.css$/,
        exclude: (modulePath) => {
          return /node_modules/.test(modulePath) && !/react-pdf|pdfjs-dist/.test(modulePath);
        },
        use: [
          isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.module\.css$/,
        exclude: /node_modules/,
        use: [
          isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                // localIdentName: '[local]_[hash:base64:5]'
                getLocalIdent: (context, _, localName) =>
                  getCssModuleIdentName(localName, context.resourcePath)
              }
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /(?<!\.module)\.scss$/,
        exclude: /node_modules/,
        use: [
          isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.module\.scss$/,
        exclude: /node_modules/,
        use: [
          isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                // localIdentName: '[local]_[hash:base64:5]'
                getLocalIdent: (context, _, localName) =>
                  getCssModuleIdentName(localName, context.resourcePath)
              }
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
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
        test: /\.(bmp|gif|jpe?g|png|ico|svg)$/,
        type: 'asset',
        exclude: [/node_modules/, /\.icon\.svg$/],
        generator: {
          filename: '[name].[contenthash:8].[ext]',
          outputPath: isDevMode ? '' : 'images/',
          publicPath: isDevMode ? '/' : basename + '/images/'
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
      overrideConfigFile: path.resolve(__dirname, '../.eslintrc.js'),
      extensions: ['js', 'jsx', 'ts', 'tsx']
    }),
    new DefinePlugin({
      'process.env': (() => {
        const env = {};
        for (const [key, val] of Object.entries(envVariables)) {
          env[key] = /^eval\(/.test(val) ? val : JSON.stringify(val);
        }
        return env;
      })()
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
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true
      },
      inject: 'head',
      templateParameters: {
        faviconPath: envVariables.FAVICON_PATH,
        showTestId: envVariables.ENABLE_TESTID
      }
    }),
    new MiniCssExtractPlugin({
      filename: isDevMode ? 'css/[name][hash:8].css' : 'css/[name].[chunkhash:8].css',
      chunkFilename: isDevMode ? 'css/[id][hash:8].css' : 'css/[id].[chunkhash:8].css',
      ignoreOrder: true
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        pdfview: {
          name: 'pdf-view',
          test: /(pdfjs-dist)|(react-pdf)/,
          priority: 50,
          reuseExistingChunk: true
        },
        firebase: {
          name: 'firebase',
          test: /firebase/,
          priority: 50,
          reuseExistingChunk: true
        },
        codeblock: {
          name: 'code-block',
          test: /@react-email/,
          priority: 50,
          reuseExistingChunk: true
        }
      }
    }
  }
};
