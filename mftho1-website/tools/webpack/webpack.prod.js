const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
   mode: "production",
   output: {
      path: path.resolve(__dirname, "../../", "./build"),
      filename: "[name].[fullhash].bundle.js"
   },
   optimization: {
      minimizer: [
         `...`,
         new CssMinimizerPlugin(),
         new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../../", "./src/index.html"),
            minify: {
              removeAttributeQuotes: true,
              collapseWhitespace: true,
              removeComments: true
            }
          })
      ],
   },
   module: {
      rules: [
         {
            test: /\.(css|scss|sass)$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
         }
      ]
   },
   plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({ filename: '[name].[fullhash].css'}),
   ]
});