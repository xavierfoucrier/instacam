const path = require('path');
const webpack = require('webpack');
const pack = require('./package.json');

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
  },
  plugins: [
    new webpack.BannerPlugin({
      raw: true,
      banner: () => {
        return `/*!\n  ${pack.name} – ${pack.description}\n  ${pack.author.name} ${pack.author.github} ${pack.year} ${pack.license}\n  ${pack.version}\n*/`;
      }
    })
  ]
};
