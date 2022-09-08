require('dotenv').config();
const fs = require('fs');
const path = require('node:path');

// Server

const serverConfig = {
    host: process.env.MMT_LISTEN_HOST || '127.0.0.1',
    port: process.env.MMT_LISTEN_PORT || 3000
}


// Database

const mongoConfig = {
    connectionString: process.env.MMT_MONGODB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/ohd-files'
}


// Mail

const mailConfig = {
    host: process.env.MMT_MAIL_HOST,
    port: process.env.MMT_MAIL_PORT,
    user: process.env.MMT_MAIL_USER,
    pass: process.env.MMT_MAIL_PASSWORD,
    from: process.env.MMT_MAIL_FROM || '"OHD" <ohd@example.com>'
}

const mailServiceConfigured = mailConfig.host &&
    mailConfig.port &&
    mailConfig.user &&
    mailConfig.pass;

if (!mailServiceConfigured) {
    console.info('Mail service not configured.')
}


// User files directory

let userFilesDir;

if (process.env.MMT_USER_FILES_DIR) {
    userFilesDir = process.env.MMT_USER_FILES_DIR;

    if (!fs.existsSync(userFilesDir)) {
        throw new Error(`${userFilesDir} does not exist`);
    }

    try {
        fs.accessSync(userFilesDir, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
        throw new Error(`${userFilesDir} must be readable and writable`);
    }
} else {
    userFilesDir = path.join(__dirname, 'user_files');

    if (!fs.existsSync(userFilesDir)) {
        fs.mkdirSync(userFilesDir);
    }

    console.info(`MMT_USER_FILES_DIR not specified, using ${userFilesDir} instead.`)
}


module.exports = {
    server: serverConfig,
    mongo: mongoConfig,
    mail: mailConfig,
    mailServiceConfigured,
    userFilesDir,
};
