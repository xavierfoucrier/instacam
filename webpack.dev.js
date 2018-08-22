const path = require('path');

module.exports = {
  mode: 'development',
  watch: true,
  entry: './src/instacam.js',
  output: {
    filename: 'instacam.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Instacam',
    libraryTarget: 'umd',
    umdNamedDefine: true
  }
};
