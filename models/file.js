const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    id: Number,
    size: Number,
    type: String,
    lastModified: Number,
    name: String,
    transferred: Number,
    state: String,
    checksum: String,
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
