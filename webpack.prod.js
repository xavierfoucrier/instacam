const path = require('path');
const terser = require('terser-webpack-plugin');

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
      new terser({
        parallel: true,
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
