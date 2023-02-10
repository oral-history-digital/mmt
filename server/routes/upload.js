const busboy = require('busboy');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('node:path');
const mime = require('mime-types');
const { Buffer } = require('node:buffer');

const emailService = require('../email')();
const createChecksum = require('../files/createChecksum');
const getDirectoryName = require('../utilities/getDirectoryName');
const requireAuth = require('../middleware/requireAuth');
const db = require('../db');

const router = express.Router();

router.post('/api/files', bodyParser.json(), requireAuth, async (req, res) => {
  const { username } = req.user;

  const user = await db.getUser({ username });

  const { files } = req.body;

  if (!Array.isArray(files)) {
    // TODO: Error
  }

  const ids = files.map((f) => {
    const newFile = {
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
      state: 'pending',
    };

    const file = user.files.create(newFile);
    user.files.push(file);
    return file._id;
  });

  user.save((err) => {
    console.log(err);
  });

  res.json(ids);
});

router.post('/api/checksum', bodyParser.json(), requireAuth, async (req, res) => {
  const { username } = req.user;
  const { id, checksum } = req.body;

  const user = await db.getUser({ username });
  await db.setFileClientChecksum(user._id, id, checksum);
  const file = user.files.id(id);

  res.json(file);
});

router.post('/api/upload', requireAuth, async (req, res) => {
  const { username, email } = req.user;
  const user = await db.getUser({ username });

  let id;

  const bb = busboy({ headers: req.headers });

  bb.on('field', (name, val, info) => {
    if (name === 'id') {
      id = val;
    }
  });

  bb.on('file', (name, file, info) => {
    const filename = Buffer.from(info.filename, 'latin1').toString('utf8');

    db.updateFileAttribute(user._id, id, 'state', 'uploading');

    const dir = getDirectoryName(username);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const stream = fs.createWriteStream(path.join(dir, filename));

    file.pipe(stream);

    file.on('data', (data) => {
    });

    file.on('close', () => {
      // TODO: Check if file is complete.

      db.updateFileAttribute(user._id, id, 'state', 'complete');

      console.log(`File ${name} done`);

      emailService.send(email, 'File uploaded', "You're file was uploaded.\n\nThank you");

      createChecksum(path.join(dir, filename), (err, checksum) => {
        if (err) {
          console.log(err);
        } else if (checksum) {
          db.updateFileAttribute(user._id, id, 'checksum_server', checksum);
        }
      });
    });
  });

  bb.on('close', () => {
    res.writeHead(303, { Connection: 'close', Location: '/api/files' });
    res.end();
  });

  req.pipe(bb);
});

router.get('/api/files', requireAuth, async (req, res) => {
  const { email } = req.user;
  const user = await db.getUser({ email });

  const sortedFiles = user.files.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  res.json(sortedFiles);
});

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
  const filepath = path.join(downloadDir, filename);

  res.download(filepath);
});

module.exports = router;
