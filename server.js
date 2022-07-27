const express = require('express');
const passport = require('passport');

const app = express();
const port = 3000;
const host = 'localhost';

app.get('/', (req, res) => {
    passport.authenticate('local');

    console.log('authenticated');

    res.send('hello world');
});

app.listen(port, host, () => {
    console.log(`App listening on http://${host}:${port}`);
});
