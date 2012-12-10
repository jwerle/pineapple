var fs = require('fs')

module.exports = function stat(){
  try {
    return fs.statSync.apply(fs, arguments);
  }
  catch(e) {
    return false;
  }
}