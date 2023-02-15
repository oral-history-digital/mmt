const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PACKAGE = require('./package.json');

const { version } = PACKAGE;

module.exports = (env, argv) => {
  const isDevMode = !(process.env.NODE_ENV === 'production'
    || argv.mode === 'production');

  return {
    entry: path.resolve(__dirname, './client/index.js'),
    module: {
      rules: [
        {
          test: /\.jsx?$/i,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.s?css$/i,
          use: [
            isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'build'),
      },
      port: 4000,
      proxy: {
        '/api': 'http://localhost:3000',
      },
      historyApiFallback: true,
    },
    output: {
      clean: true,
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'public'),
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'client', 'index.html'),
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'client', 'assets', 'ohd-logo.png'),
            to: path.join(__dirname, 'public', 'favicon.png'),
          },
        ],
      }),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(version),
      }),
    ].concat(isDevMode ? [] : [new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    })]),
  };
};
