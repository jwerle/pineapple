var utils     = require('utilities')
  , fs        = require('fs')
  , path      = require('path')
  , stat      = require('./stat')

var loader = {};

loader.Loader = function(directory, exts, excluded){
  this.exts       = exts      || ['.js', '.json'];
  this.excluded   = excluded  || ['index'];
  this.directory  = directory || __dirname;
};

loader.Loader.load = function() {
  return this.prototype.load.apply({}, arguments);
};

loader.Loader.prototype.load = function(directory, exts, excluded){
  var files, i, excluded, ext, file, loaded, required, stats, base
    , modulePath, tmp

  directory = directory || this.directory || __dirname;
  exts      = exts      || this.exts      || ['.js'];
  excluded  = excluded  || this.excluded  || ['index'];
  files     = fs.readdirSync(directory);
  loaded    = {};

  for (i = files.length - 1; i >= 0; i--) {
    stats = stat(directory + '/' + files[i]);
    file  = files[i];
    base  = path.basename(directory);

    if (! stats) {
      continue
    }

    loaded[base] = typeof loaded[base] !== 'undefined'? loaded[base] : {};

    if (stats.isDirectory()) {
      loaded[base][file]  = this.load(directory + '/' + file)[file];

      continue;
    }

    if (!!~ exts.indexOf((ext = path.extname(file)))) {
      name       = file.replace(ext, '');
      modulePath = directory + '/' + path.join(file)

      if (name.indexOf('_') == 0) {
        continue;
      }
      else if (!!~ excluded.indexOf(name)) {
        continue;
      }

      required     = require(modulePath);

      
      if (typeof required === 'function' || typeof required[name] === 'function') {
        loaded[base][name]  = required[name] || required;
      }
      else {
        loaded[base][name] = utils.object.merge(loaded[base][name] || {}, required);
      }
    }
  }


  return loaded;
};

module.exports = loader;