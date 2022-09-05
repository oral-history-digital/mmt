const busboy = require('busboy');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('node:path');
const mime = require('mime-types');
const { exec } = require('node:child_process');

const credentials = require('../config').credentials;
const emailService = require('../email')(credentials);
const getDirectoryName = require('../utilities/getDirectoryName');
const requireAuth = require('../middleware/requireAuth');
const db = require('../db');

const router = express.Router();

router.post('/api/files', bodyParser.json(), requireAuth, async (req, res) => {
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

// At the moment, just update client checksum.
router.put('/api/files:fileId', bodyParser.json(), requireAuth, async (req, res) => {
    const { username } = req.user;
    const { fileId } = req.params;
    const { checksum_client } = req.body;

    const user = await db.getUser({ username });
    await db.updateFileAttribute(user._id, fileId, 'checksum_client', checksum_client);
    const file = user.files.id(fileId);

    res.json(file);
});

router.post('/api/upload', requireAuth, async (req, res) => {
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
            db.updateFileAttribute(user._id, id, 'state', 'complete');

            console.log(`File ${name} done`);

            emailService.send(email, 'File uploaded', "You're file was uploaded.\n\nThank you");

            exec(`sha256sum ${path.join(dir, filename)}`, (err, stdout, stderr) => {
                if (err) {
                    //some err occurred
                    console.error(err);
                } else {
                    const regex = /^\w+/;
                    const match = stdout.match(regex);

                    if (match) {
                        checksum = match[0];
                        console.log(checksum);

                        db.updateFileAttribute(user._id, id, 'checksum_server', checksum);
                    }

                    // the *entire* stdout and stderr (buffered)
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                }
            });
        });
    });

    bb.on('close', () => {
        res.writeHead(303, { Connection: 'close', Location: '/files' });
        res.end();
    })

    req.pipe(bb);
});

router.get('/api/files', requireAuth, async (req, res) => {
    const { email } = req.user;
    const user = await db.getUser({ email });

    res.json(user.files);
});

router.get('/api/downloadable-files', requireAuth, (req, res) => {
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

router.get('/api/download', requireAuth, (req, res) => {
    const filename = decodeURIComponent(req.query.filename);

    const downloadDir = getDirectoryName(req.user.username, 'download');
    const filepath = path.join(downloadDir, filename);

    res.download(filepath);
});


module.exports = router;
