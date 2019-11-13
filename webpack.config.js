'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: [
    './javascript/src/index.js',
    './style/src/build.less'
  ],
  output: {
    filename: 'app.min.js',
    path: path.resolve(__dirname, 'javascript')
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  module: {
    rules: [{
      test: /\.(less|css)$/,
      use: [
        MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: {
            url: false
          }
        }, {
          loader: 'less-loader',
          options: {
            relativeUrls: false
          }
        }
      ]
    }, {
      test: /\.(scss)$/,
      use: [
        {
          loader: 'sass-loader'
        }
      ]
    }]
  },
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', {
          discardComments: {
            removeAll: true
          }
        }],
      }
    }),
    new MiniCssExtractPlugin({
      filename: '../style/default.min.css'
    }),
    new PurgecssPlugin({
      paths: [
        'index.html'
      ]
    })
  ]
};
