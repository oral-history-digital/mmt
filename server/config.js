const path = require('node:path');

const env = process.env.NODE_ENV || 'development';
const credentials = require(path.join(__dirname, `.credentials.${env}`));
module.exports = { credentials };
