require('dotenv').config();
const fs = require('fs');

const userFilesDir = process.env.USER_FILES_DIR;

if (typeof userFilesDir === 'undefined') {
    throw new ReferenceError('USER_FILES_DIR env variable must be set');
}

if (!fs.existsSync(userFilesDir)) {
    throw new Error(`${userFilesDir} does not exist`);
}

try {
    fs.accessSync(userFilesDir, fs.constants.R_OK | fs.constants.W_OK);
} catch (err) {
    throw new Error(`${userFilesDir} must be readable and writable`);
}
