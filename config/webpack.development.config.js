const webpack = require('webpack');
const PATHS = require('./paths');
require('dotenv').config();

const config = {
  devtool: 'inline-source-map',
  resolve: {
    root: __dirname,
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },
  entry: [
    `${PATHS.SRC}/index.jsx`
  ],
  output: {
    path: PATHS.DIST,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: PATHS.SRC,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin(['clientID'])
  ]
};

module.exports = config;
