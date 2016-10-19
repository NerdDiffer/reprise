const webpack = require('webpack');
const path = require('path');
require('dotenv').config();

const SRC_DIR = path.join(__dirname, 'client', 'src');
const DIST_DIR = path.join(__dirname, 'client', 'public', 'dist');

const config = {
  devtool: 'inline-sourcemap',
  resolve: {
    root: __dirname,
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },
  entry: [path.join(SRC_DIR, 'index.jsx')],
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: SRC_DIR,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin(['clientID'])
  ]
};

module.exports = config;
