const path = require('path');

exports.getCurrentDirname = function getCurrentDirname() {
  return path.basename(process.cwd());
}
