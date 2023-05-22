const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
   mode: "development",
   devtool: "cheap-module-source-map",
   output: {
      path: path.resolve(__dirname, "../../", "./build"),
      filename: "[name].bundle.js"
   },
   module: {
      rules: [
         {
            test: /\.(css|scss|sass)$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
         }
      ]
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: path.resolve(__dirname, "../../", "./src/index.html")
      })
   ]
});