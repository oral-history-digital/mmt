const busboy = require('busboy');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('node:path');
const mime = require('mime-types');

const getDirectoryName = require('../utilities/getDirectoryName');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

let nextId = 1;

function createId() {
    return nextId++;
}

const filesDB = [
    {
        id: 0,
        size: 32838722,
        type: 'audio/mpeg',
        lastModified: 1639519391407,
        name: 'police-story.mp4',
        transferred: 0,
        state: 'complete',
    },
];


router.post('/files', bodyParser.json(), (req, res) => {
    const id = createId();
    const newFile = {
        id,
        name: req.body.name,
        size: req.body.size,
        type: req.body.type,
        lastModified: req.body.lastModified,
        state: 'pending',
    };

    filesDB.push(newFile);
    console.log(filesDB);

    res.json(newFile);
});

router.post('/upload', (req, res) => {
    let id;

    bb = busboy({ headers: req.headers });

    bb.on('field', (name, val, info) => {
        if (name === 'id') {
            id = Number.parseInt(val);
        }
    });

    bb.on('file', (name, file, info) => {
        const { filename, encoding } = info;

        const fileInDB = filesDB.find(f => f.id === id);
        if (fileInDB) {
            fileInDB.state = 'uploading';
        }

        const dir = getDirectoryName('alice');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(path.join(dir, filename));

        file.pipe(stream);

        file.on('data', (data) => {
        });

        file.on('close', () => {
            const file = filesDB.find(f => f.id === id);
            if (file) {
                file.state = 'complete';
            }
            console.log(`File ${name} done`);
        });
    });

    bb.on('close', () => {
        console.log('Done parsing form!');
        res.writeHead(303, { Connection: 'close', Location: '/files' });
        res.end();
    })

    req.pipe(bb);
});

router.get('/files', (req, res) => {
    console.log(filesDB);
    res.json(filesDB);


    const uploadDir = getDirectoryName(req.user.username, 'upload');
    let uploadFiles = [];
    if (fs.existsSync(uploadDir)) {
        uploadFiles = fs.readdirSync(uploadDir);
    }

    const downloadDir = getDirectoryName(req.user.username, 'download');
    let downloadFiles = [];
    if (fs.existsSync(downloadDir)) {
        downloadFiles = fs.readdirSync(downloadDir);
    }

    res.render('files', {
        uploadFiles,
        downloadFiles: downloadFiles.map(filename => ({
            name: filename,
            encoded: encodeURIComponent(filename),
        })),
    });
});

router.get('/downloadable-files', (req, res) => {
    const downloadDir = getDirectoryName('alice', 'download');

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

        console.log(info);

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
