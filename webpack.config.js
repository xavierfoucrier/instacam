import path from 'node:path';
import TerserPlugin from 'terser-webpack-plugin';

export default () => ({
  mode: 'production',
  entry: './src/instacam.js',
  output: {
    filename: 'instacam.umd.js',
    path: path.resolve(import.meta.dirname, 'dist'),
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
});
