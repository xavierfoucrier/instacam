const path = require('path');
const webpack = require('webpack');
const package = require('./package.json');

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
        return `/*!\n  ${package.name} – ${package.description}\n  ${package.author.name} ${package.author.github} ${package.year} ${package.license}\n  ${package.version}\n*/`;
      }
    })
  ]
};
