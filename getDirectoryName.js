const path = require('node:path');

module.exports = function getDirectoryName(user, type = 'upload') {
    switch (type) {
    case 'download':
        return path.join(__dirname, 'user_files', user.username.toLowerCase(), 'downloads');
    case 'upload':
    default:
        return path.join(__dirname, 'user_files', user.username.toLowerCase(), 'uploads');
    }
};
