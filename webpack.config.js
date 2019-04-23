const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  watch: true,
  entry: './javascript/src/index.js',
  output: {
    filename: 'app.min.js',
    path: path.resolve(__dirname, 'javascript')
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
};
