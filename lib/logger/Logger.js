var jog = require('jog')
var logger = {};
  
logger.LogMessage = function LogMessage(level, type, message, data) {
  this.level    = level;
  this.type     = type;
  this.message  = message;
  this.data     = data || {};

  switch (level) {
    default :
     this.message = this.message.green
    break;

    case 'success' :
      this.message = this.message.blue.inverse;
    break;

    case 'fail' :
      this.message = this.message.red.inverse;
    break;

    case 'warn' :
      this.message = this.message.yellow;
    break;

    case 'debug' :
      this.message = this.message
    break;

    case 'error' :
      this.message = this.message.red;
    break;
  }
};

logger.Logger = function Logger(name, path) {
  this.name = name;
  this.path = path;
  //this.adapter = jog(new jog.FileStore(path)); //broken..
};

logger.Logger.prototype.clone = function(properties) {
  return this.adapter.ns(properties);
};

logger.Logger.prototype.write = function(level, type, message, data) {
  var msg = new logger.LogMessage(level, type, message, data)

  console.log("[".magenta + this.name.blue + "]".magenta + ' => '.blue + msg.message)
 // this.adapter.write(msg.level, msg.type, {
 //   message : msg.message,
 //   data    : msg.data
 // });

  return this;
};

logger.Logger.prototype.info = function(message, data) {
  return this.write('info', 'info', message, data);
};

logger.Logger.prototype.success = function(message, data) {
  return this.write('success', 'info', message, data);
};

logger.Logger.prototype.fail = function(message, data) {
  return this.write('fail', 'info', message, data);
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