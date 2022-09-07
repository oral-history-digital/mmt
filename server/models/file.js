const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    id: Number,
    size: Number,
    type: String,
    lastModified: Number,
    name: String,
    transferred: Number,
    state: String,
    checksum_server: String,
    checksum_client: String,
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

module.exports = File;
