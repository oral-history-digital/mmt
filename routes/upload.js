const busboy = require('busboy');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('node:path');
const mime = require('mime-types');

const credentials = require('../config').credentials;
const emailService = require('../email')(credentials);
const getDirectoryName = require('../utilities/getDirectoryName');
const requireAuth = require('../middleware/requireAuth');
const db = require('../db');

const router = express.Router();

router.post('/files', bodyParser.json(), requireAuth, async (req, res) => {
    const { username } = req.user;

    const user = await db.getUser({ username });

    const newFile = {
        name: req.body.name,
        size: req.body.size,
        type: req.body.type,
        lastModified: req.body.lastModified,
        state: 'pending',
    };

    const file = user.files.create(newFile);
    user.files.push(file);
    user.save(err => {
        console.log(err);
    });

    const _id = file._id;

    res.json({
        ...newFile,
        _id,
    });
});

router.post('/upload', requireAuth, async (req, res) => {
    const { username, email } = req.user;
    const user = await db.getUser({ username });

    let id;

    bb = busboy({ headers: req.headers });

    bb.on('field', (name, val, info) => {
        if (name === 'id') {
            id = val;
        }
    });

    bb.on('file', (name, file, info) => {
        const { filename, encoding } = info;

        db.updateFileState(user._id, id, 'uploading');

        const dir = getDirectoryName(username);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(path.join(dir, filename));

        file.pipe(stream);

        file.on('data', (data) => {
        });

        file.on('close', () => {
            db.updateFileState(user._id, id, 'complete');

            console.log(`File ${name} done`);

            emailService.send(email, 'File uploaded', "You're file was uploaded.\n\nThank you");
        });
    });

    bb.on('close', () => {
        res.writeHead(303, { Connection: 'close', Location: '/files' });
        res.end();
    })

    req.pipe(bb);
});

router.get('/files', requireAuth, async (req, res) => {
    const { email } = req.user;
    const user = await db.getUser({ email });

    res.json(user.files);
});

router.get('/downloadable-files', requireAuth, (req, res) => {
    const { username } = req.user;
    const downloadDir = getDirectoryName(username, 'download');

    let downloadFiles = [];
    if (fs.existsSync(downloadDir)) {
        downloadFiles = fs.readdirSync(downloadDir);
    }

    const filesResult = downloadFiles.map(name => {
        const filePath = path.join(downloadDir, name);

        const fd = fs.openSync(filePath, 'r');
        const info = fs.fstatSync(fd);
        const size = info.size;
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

router.get('/download', requireAuth, (req, res) => {
    const filename = decodeURIComponent(req.query.filename);

    const downloadDir = getDirectoryName(req.user.username, 'download');
    const filepath = path.join(downloadDir, filename);

    res.download(filepath);
});


module.exports = router;
