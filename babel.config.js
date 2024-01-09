module.exports = function (api) {
  api.cache(true);
  const presets = [
    [
      '@babel/preset-env',
      {
        modules: false,
        forceAllTransforms: true
      }
    ],
    '@babel/preset-react'
  ];

  const plugins = ['@babel/plugin-transform-arrow-functions'];

  return {
    presets,
    plugins
  };
};
