const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');

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
      new uglify({
        parallel: true
      })
    ]
  }
};
