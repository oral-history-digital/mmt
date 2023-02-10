const fs = require('fs');
const express = require('express');
const path = require('node:path');
const mime = require('mime-types');

const getDirectoryName = require('../utilities/getDirectoryName');
const requireAuth = require('../middleware/requireAuth');

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

module.exports = router;
