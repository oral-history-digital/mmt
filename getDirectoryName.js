const path = require('node:path');

module.exports = function getDirectoryName(user) {
    return path.join(__dirname, 'uploads', user.username.toLowerCase());
};
