var jog = require('jog')
var logger = {};
  
logger.LogMessage = function LogMessage(level, type, message, data) {
  this.level    = level;
  this.type     = type;
  this.message  = message;
  this.data     = data || {};
};

logger.Logger = function Logger(name, path) {
  this.name = name;
  this.path = path;
  //this.adapter = jog(new jog.FileStore(path)); broken..
};

logger.Logger.prototype.clone = function(properties) {
  return this.adapter.ns(properties);
};

logger.Logger.prototype.write = function(level, type, message, data) {
  var msg = new logger.LogMessage(level, type, message, data)

  this.adapter.write(msg.level, msg.type, {
    message : msg.message,
    data    : msg.data
  });

  return this;
};

logger.Logger.prototype.info = function(message, data) {
  return this.write('info', 'info', message, data);
};

logger.Logger.prototype.debug = function(message, data) {
  return this.write('debug', 'debug', message, data);
};

logger.Logger.prototype.warn = function(message, data) {
  return this.write('warn', 'warn', message, data);
};

logger.Logger.prototype.error = function(message, data) {
  return this.write('error', 'error', message, data);
};

module.exports = logger;