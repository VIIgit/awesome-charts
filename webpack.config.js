const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',  // Enable inline source maps for easier debugging
  // Other configurations
  entry: {
    //'donut-chart': './donut-chart/src/index.ts',
    'sankey-chart': './sankey-chart/src/index.ts'
  },
  output: {
    
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
        
      }
    ]
  }
};