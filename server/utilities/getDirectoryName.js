const path = require('node:path');

module.exports = function getDirectoryName(username, type = 'upload') {
    switch (type) {
    case 'download':
        return path.join(process.env.MMT_USER_FILES_DIR,
            username.toLowerCase(), 'downloads');
    case 'upload':
    default:
        return path.join(process.env.MMT_USER_FILES_DIR,
            username.toLowerCase(), 'uploads');
    }
};
