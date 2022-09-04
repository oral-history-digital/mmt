const path = require('path');

module.exports = {
    entry: './client/src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
