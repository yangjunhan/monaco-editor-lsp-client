const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = webpackConfig => {
  webpackConfig.plugins.push(
    new MonacoWebpackPlugin({
      languages: []
    })
  );

  webpackConfig.resolve.fallback = {
    path: require.resolve('path-browserify'),
  };

  return webpackConfig;
};
