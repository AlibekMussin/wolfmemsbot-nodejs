const fs = require('fs');

function checkFileExists(filepath) {
  try {
    return fs.existsSync(filepath);
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = checkFileExists;