const path = require('path');
const { merge } = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const devConfig = require("./webpack.dev.config");

module.exports = merge(devConfig, {

  mode: 'production',
  devtool: false,
  output: {
    path: path.resolve(__dirname, "dist/bundled"),
    filename: "[name].bundle.min.js", // Minimized bundle output
    library: {
      name: "SankeyChartLibrary",
      type: "umd"
    }
  },
  optimization: {
    minimize: true, // Enable minification
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false // Remove comments in the minimized version
          }
        },
        extractComments: false // Prevent generating separate comment files
      })
    ]
  }
});
