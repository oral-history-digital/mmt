const crypto = require('crypto');

module.exports = function getHashedPassword(password) {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
};
