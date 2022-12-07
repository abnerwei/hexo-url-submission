const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: "index.min.js",
    library: "hexo-url-submission",
    libraryTarget: "commonjs-module",
    path: path.resolve(__dirname, 'lib'),
  },
};