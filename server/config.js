import dotenv from 'dotenv';
import fs from 'fs';
import path from 'node:path';

dotenv.config();

// Server

const serverConfig = {
  host: process.env.MMT_LISTEN_HOST || '127.0.0.1',
  port: process.env.MMT_LISTEN_PORT || 3000,
  sessionSecret: process.env.MMT_SESSION_SECRET || 'MMT Keyboard Cat',
};

// Database

const mongoConfig = {
  connectionString: process.env.MMT_MONGODB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/mmt',
  sessionConnectionString: process.env.MMT_MONGODB_SESSION_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/session',
};

// Admin

const adminConfig = {
  email: process.env.MMT_ADMIN_EMAIL || 'admin@example.com',
  password: process.env.MMT_ADMIN_PASSWORD || 'password',
};

// Mail

const mailConfig = {
  host: process.env.MMT_MAIL_HOST,
  port: Number(process.env.MMT_MAIL_PORT) || 25,
  user: process.env.MMT_MAIL_USER,
  pass: process.env.MMT_MAIL_PASSWORD,
  from: process.env.MMT_MAIL_FROM || '"OHD" <info@oral-history.digital>',
  supportAddress: process.env.MMT_MAIL_SUPPORT_ADDRESS,
};

const mailServiceConfigured = mailConfig.host;

if (!mailServiceConfigured) {
  console.info('Mail service not configured. Please specify at least a host.');
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
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  userFilesDir = path.join(__dirname, '..', 'user_files');

  if (!fs.existsSync(userFilesDir)) {
    fs.mkdirSync(userFilesDir);
  }

  console.info(`MMT_USER_FILES_DIR not specified, using ${userFilesDir} instead.`);
}

export default {
  server: serverConfig,
  mongo: mongoConfig,
  admin: adminConfig,
  mail: mailConfig,
  mailServiceConfigured,
  userFilesDir,
};
