module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 100,
      propList: ["*"],
      unitPrecision: 5,
      minPixelValue: 12,
      exclude: ["node_modules"],
    },
  },
};
