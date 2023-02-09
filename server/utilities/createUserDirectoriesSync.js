const fs = require('fs');
const getDirectoryName = require('./getDirectoryName');

module.exports = function createUserDirectoriesSync(username) {
  const directories = ['download', 'upload'];

  directories.forEach((type) => {
    const dir = getDirectoryName(username, type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
