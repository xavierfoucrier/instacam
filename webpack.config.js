'use strict';

const path = require('path');
const webpack = require('webpack');
const pack = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/instacam.js',
  output: {
    filename: 'instacam.umd.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Instacam',
    libraryExport: 'Instacam',
    libraryTarget: 'umd',
    umdNamedDefine: true
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
