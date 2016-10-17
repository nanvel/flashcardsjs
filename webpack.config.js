const webpack = require('webpack');


module.exports = {
  entry: './source/app.js',
  output: {
    path: './build',
    filename: 'app.bundle.js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      excludes: /node_modules/,
      loader: 'babel',
      query: {
        presets: [
          'es2015',
          'stage-0',
          'react'
        ],
        plugins: [
          'transform-object-rest-spread'
        ]
      }
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }
  ]},
  devtool: 'source-map'
}
