const express = require('express');

const app = express();
const port = 3000;
const host = 'localhost';

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, host, () => {
    console.log(`App listening on http://${host}:${port}`);
});
