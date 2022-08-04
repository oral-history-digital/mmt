const crypto = require('crypto');

module.exports = function generateAuthToken() {
    return crypto.randomBytes(30).toString('hex');
};
