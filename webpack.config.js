const path = require('path');
const { name, description, author, license, version } = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

// package preamble
const preamble = `/*!\n  ${name} - ${description}\n  ${author.name} ${author.github} ${new Date().getFullYear()} ${license}\n  ${version}\n*/`;

module.exports = {
  mode: 'production',
  entry: './src/instacam.js',
  output: {
    filename: 'instacam.umd.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Instacam',
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
            preamble: preamble,
          },
          mangle: {
            properties: {
              regex: /^_/,
            },
          },
        },
      }),
    ],
  },
};
