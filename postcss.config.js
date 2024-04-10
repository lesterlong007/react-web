module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16,
      propList: ['*'],
      unitPrecision: 5,
      minPixelValue: 12,
      exclude: ['node_modules']
    },
    tailwindcss: {},
    autoprefixer: {}
  }
};
