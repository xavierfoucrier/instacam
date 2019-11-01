const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  extends: path.resolve(__dirname, 'webpack.dev.js'),
  mode: 'production',
  watch: false,
  output: {
    filename: 'instacam.min.js',
    libraryExport: 'Instacam'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          mangle: {
            properties: {
              regex: /^_/
            }
          }
        }
      })
    ]
  }
};
