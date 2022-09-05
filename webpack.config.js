const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, './client/src/index.js'),
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
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
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'client', 'src', 'index.html'),
        }),
        new FaviconsWebpackPlugin({
            logo: path.join(__dirname, 'client', 'src', 'ohd-logo.png'),
            mode: 'light',
        }),
    ],
};
