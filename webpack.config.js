const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './client/index.js'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'build')
    },
    port: 4000,
    proxy: {
      '/api': 'http://localhost:3000'
    },
    historyApiFallback: true
  },
  output: {
    clean: true,
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'client', 'index.html')
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'client', 'assets', 'ohd-logo.png'),
          to: path.join(__dirname, 'public', 'favicon.png')
        }
      ]
    })
  ]
}
