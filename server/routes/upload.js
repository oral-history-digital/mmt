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
import {
  FILE_STATE_PENDING,
  FILE_STATE_UPLOADING,
  FILE_STATE_COMPLETE,
  FILE_STATE_ABORTED,
  FILE_STATE_MISSING,
} from '../constants.js';

const emailService = createEmailService();
const router = express.Router();

router.post('/api/register-file', bodyParser.json(), requireAuth, async (req, res) => {
  const { username } = req.user;
  const user = await db.getUser({ username });

  const { file } = req.body;

  const sanitizedFilename = sanitize(file.name);
  let filenameWithExtension = sanitizedFilename;

  // Test if filename already exists.
  if (user.files.some((f) => f.name === sanitizedFilename)) {
    const extension = getFilenameSuffix(new Date());
    filenameWithExtension = `${sanitizedFilename}.${extension}`;
  }

  const newFile = {
    name: filenameWithExtension,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    state: FILE_STATE_PENDING,
  };

  const savedFile = user.files.create(newFile);
  user.files.push(savedFile);
  await user.save();

  res.json(savedFile);
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
    let calculatedLength = 0;

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

    file
      .pipe(stream)
      .on('error', () => {
        console.error('failed upload', e);
        res.sendStatus(500);
      })
      .on('finish', () => {
        // TODO: Check if file is complete.
        db.updateFileAttribute(user._id, id, 'state', FILE_STATE_COMPLETE);

        emailService.sendMailToSupport(
          'File uploaded',
          `User ${user.username} (${user.email}) has uploaded the file ${filename}.`,
        );
        emailService.sendMailToUser(
          email,
          'File uploaded',
          `Your file ${filename} has been uploaded.

The file will now undergo a technical review and will subsequently be accessible within the oh.d system.

The technical review and transcoding process may take several working days, depending on the scope, complexity, and workload. You will receive an email notification as soon as the file becomes available in the oh.d system.`);

        createServerChecksum(path.join(dir, filename), (err, checksum) => {
          if (err) {
            console.log(`There was an error: ${err}`);
          } else if (checksum) {
            db.updateFileAttribute(user._id, id, 'checksum_server', checksum);
          }
        });
      });

    file.on('data', (data) => {
      calculatedLength += data.length;
      db.updateFileAttribute(user._id, id, 'transferred', calculatedLength);
    });
  });

  bb.on('error', () => {
    console.error('failed upload', e);
    res.sendStatus(500);
  });

  bb.on('finish', () => {
    res.sendStatus(200);
  });

  req.pipe(bb);
});

router.put('/api/abort-upload/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { email } = req.user;
  const user = await db.getUser({ email });

  const fileInDatabase = user.files.find((f) => {
    return f._id.toString() === id;
  });

  if (fileInDatabase.state === FILE_STATE_UPLOADING) {
    db.updateFileAttribute(user._id, id, 'state', FILE_STATE_ABORTED);
  }

  // TODO: Error handling.
  // If the file state is cannot be changed, there should be no 204 response.

  res.writeHead(204);
  res.end();
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
