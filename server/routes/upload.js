import busboy from 'busboy';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'node:path';
import sanitize from 'sanitize-filename';

import createEmailService from '../email.js';
import createServerChecksum from '../files/createServerChecksum.js';
import getDirectoryName from '../utilities/getDirectoryName.js';
import getFilenameSuffix from '../utilities/getFilenameSuffix.js';
import requireAuth from '../middleware/requireAuth.js';
import db from '../db.js';

const emailService = createEmailService();
const router = express.Router();

const FILE_STATE_UPLOADING = 'uploading';
const FILE_STATE_COMPLETE = 'complete';
const FILE_STATE_MISSING = 'missing';

router.post('/api/files', bodyParser.json(), requireAuth, async (req, res) => {
  const { username } = req.user;

  const user = await db.getUser({ username });

  const { files } = req.body;

  if (!Array.isArray(files)) {
    // TODO: Error
  }

  const ids = files.map((f) => {
    const sanitizedFilename = sanitize(f.name);
    let filenameWithExtension = sanitizedFilename;

    // Test if filename already exists.
    if (user.files.some((file) => file.name === sanitizedFilename)) {
      const extension = getFilenameSuffix(new Date());
      filenameWithExtension = `${sanitizedFilename}.${extension}`;
    }

    const newFile = {
      name: filenameWithExtension,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
      state: 'pending',
    };

    const file = user.files.create(newFile);
    user.files.push(file);

    return {
      id: file._id,
      filename: file.name,
    };
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
    const fileInDatabase = user.files.find((f) => {
      return f._id.toString() === id;
    });

    const filename = fileInDatabase.name;

    db.updateFileAttribute(user._id, id, 'state', FILE_STATE_UPLOADING);

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

      db.updateFileAttribute(user._id, id, 'state', FILE_STATE_COMPLETE);

      console.log(`File ${filename} done`);

      emailService.sendMailToSupport(
        'File uploaded',
        `User ${user.username} has uploaded the file ${filename}.`,
      );
      emailService.sendMailToUser(
        email,
        'File uploaded',
        `You're file ${filename} has been uploaded.`,
      );

      createServerChecksum(path.join(dir, filename), (err, checksum) => {
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

router.delete('/api/files/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.user;
  const user = await db.getUser({ email });
  const { files } = user;
  const downloadDir = getDirectoryName(username, 'upload');

  const file = files.id(id);
  const filePath = path.join(downloadDir, file.name);
  // TODO: This should be asynchronous.
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath);
  }

  db.deleteFile(user._id, id);

  // TODO: Error handling...

  res.writeHead(204);
  res.end();
});

async function findMissingFiles(req) {
  /*
   * Maybe this should be done periodically for all users, independently
   * from their activity.
   * Maybe files that are once marked missing should not be changed back
   * once the files appears again.
   * And move this out of this file.
   */
  const { email } = req.user;
  const user = await db.getUser({ email });

  const { files } = user;

  const downloadDir = getDirectoryName(req.user.username, 'upload');

  files.forEach((file) => {
    if (file.state === FILE_STATE_COMPLETE || file.state === FILE_STATE_MISSING) {
      const filePath = path.join(downloadDir, file.name);
      fs.exists(filePath, (exists) => {
        if (exists) {
          // TODO: Adapt for files that are not complete.
          db.updateFileAttribute(user._id, file._id, 'state', FILE_STATE_COMPLETE);
        } else {
          db.updateFileAttribute(user._id, file._id, 'state', FILE_STATE_MISSING);
        }
      });
    }
  });
}

router.get('/api/files', requireAuth, async (req, res) => {
  const { email } = req.user;
  const user = await db.getUser({ email });
  const sortedFiles = user.files.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  findMissingFiles(req);

  res.json(sortedFiles);
});

export default router;
