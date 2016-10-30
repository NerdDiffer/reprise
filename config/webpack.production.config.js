const webpack = require('webpack');
const PATHS = require('./paths');

const config = {
  devtool: 'cheap-module-source-map',
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
    new webpack.EnvironmentPlugin(['clientID']),
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: true
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    })
  ]
};

module.exports = config;
