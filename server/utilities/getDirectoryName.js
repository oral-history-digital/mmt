const path = require('node:path');

const config = require('../config');

module.exports = function getDirectoryName(username, type = 'upload') {
    switch (type) {
    case 'download':
        return path.join(config.userFilesDir,
            username.toLowerCase(), 'downloads');
    case 'upload':
    default:
        return path.join(config.userFilesDir,
            username.toLowerCase(), 'uploads');
    }
};
