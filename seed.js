const File = require('./models/file');
const User = require('./models/user');

function seed() {
    File.find((err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        if (files.length > 0) {
            console.log(files.length);
            return;
        }

        new File({
            id: 0,
            size: 32838722,
            type: 'audio/mpeg',
            lastModified: 1639519391407,
            name: 'police-story.mp4',
            transferred: 0,
            state: 'complete',
        }).save();
    });


    User.find((err, users) => {
        if (err) {
            console.error(err);
            return;
        }
        if (users.length > 0) {
            console.log(users.length);
            return;
        }

        new User({
            username: 'alice',
            email: 'alice@example.com',
            // This is the SHA256 hash for value of `password`
            password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=',
            language: 'en',
        }).save();
    });
}

module.exports = seed;
