const path = require('path');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PostcssInputRangePlugin = require('postcss-input-range');

module.exports = {
  mode: 'production',
  entry: [
    './javascript/src/index.js',
    './style/src/build.scss',
  ],
  output: {
    filename: 'app.min.js',
    path: path.resolve(__dirname, 'javascript'),
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default', {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        },
      }),
    ],
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: {
            url: false,
            modules: 'icss',
          },
        }, {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                PostcssInputRangePlugin,
                'autoprefixer',
              ],
            },
          },
        }, {
          loader: 'sass-loader',
        },
      ],
    }, {
      test: /\.js$/,
      use: 'babel-loader',
      exclude: /node_modules/,
    }],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../style/default.min.css',
    }),
    new PurgeCSSPlugin({
      paths: [
        'index.html',
      ],
    }),
  ],
};
