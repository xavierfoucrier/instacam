'use strict';

const path = require('path');
const pack = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

// package preamble
const preamble = `/*!\n  ${pack.name} – ${pack.description}\n  ${pack.author.name} ${pack.author.github} ${pack.year} ${pack.license}\n  ${pack.version}\n*/`;

module.exports = {
  mode: 'production',
  entry: './src/instacam.js',
  output: {
    filename: 'instacam.umd.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Instacam',
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          output: {
            comments: false,
            preamble: preamble,
          },
          mangle: {
            properties: {
              regex: /^_/
            }
          }
        },
      }),
    ]
  }
};
