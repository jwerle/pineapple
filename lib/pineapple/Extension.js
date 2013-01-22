var architect = require('architect')
  , path      = require('path')
  , events    = require('events')

var Extension = pineapple.utils.inherit(events.EventEmitter, function Extension(extension, data) {
  this.super();
  pineapple.utils.object.merge(this, extension.package);
  pineapple.utils.object.merge(this, extension.package.plugin);

  if (pineapple.utils.appStat('/extensions/'+ this.name)) {
    this.type = 'app';
    this.path = pineapple.APP_PATH + '/extensions/' + this.name;
  }
  else {
    this.type = 'native';
    this.path = pineapple.PINEAPPLE_PATH + '/extensions/' + this.name;
  }

  this.packagePath = this.path;
  this.consumes = extension.package.plugin.consumes || [];
  this.provides = extension.package.plugin.provides || [];
  this.configPath = this.path + '/config';
  this.config = architect.loadConfig(this.configPath);
  this.package = require(this.path + '/package');
  this.main = this.path + '/' + this.package.main;
  this.setup = require(this.main).setup || require(this.main);
  this.data = data || {};

  //console.log(this)
});

Extension.create = function() {
  var app =  architect.createApp.apply(architect, arguments);

  return app;
}
module.exports = Extension