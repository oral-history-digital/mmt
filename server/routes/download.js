import fs from 'fs';
import express from 'express';
import path from 'node:path';
import mime from 'mime-types';

import getDirectoryName from '../utilities/getDirectoryName.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/api/downloadable-files', requireAuth, (req, res) => {
  const { username } = req.user;
  const downloadDir = getDirectoryName(username, 'download');

  let downloadFiles = [];
  if (fs.existsSync(downloadDir)) {
    downloadFiles = fs.readdirSync(downloadDir);
  }

  const filesResult = downloadFiles.map((name) => {
    const filePath = path.join(downloadDir, name);

    const fd = fs.openSync(filePath, 'r');
    const info = fs.fstatSync(fd);
    const { size } = info;
    const type = mime.lookup(filePath);

    return {
      name,
      encoded: encodeURIComponent(name),
      size,
      type,
      lastModified: info.mtimeMs,
    };
  });

  res.json(filesResult);
});

router.get('/api/download', requireAuth, (req, res) => {
  const filename = decodeURIComponent(req.query.filename);

  const downloadDir = getDirectoryName(req.user.username, 'download');
  const filePath = path.join(downloadDir, filename);

  res.download(filePath);
});

export default router;
