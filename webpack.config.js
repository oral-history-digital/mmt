import { readFileSync } from 'fs';
import webpack from 'webpack';
import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const metaData = JSON.parse(readFileSync('./package.json', 'utf8'));
const { version } = metaData;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default (env, argv) => {
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
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
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
      extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'build'),
      },
      port: 4000,
      proxy: {
        '/api': 'http://127.0.0.1:3000',
      },
      historyApiFallback: true,
      https: false,
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
