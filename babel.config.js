module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        forceAllTransforms: true,
        targets: { node: 'current' }
      }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: ['@babel/plugin-transform-arrow-functions']
};
