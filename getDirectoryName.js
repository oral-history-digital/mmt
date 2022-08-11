const path = require('node:path');

const config = require('./config');

module.exports = function getDirectoryName(user, type = 'upload') {
    switch (type) {
    case 'download':
        return path.join(config.USER_FILES_DIRECTORY,
            user.username.toLowerCase(), 'downloads');
    case 'upload':
    default:
        return path.join(config.USER_FILES_DIRECTORY,
            user.username.toLowerCase(), 'uploads');
    }
};
