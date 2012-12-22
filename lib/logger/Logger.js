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
      this.message = "SUCCESS".blue.inverse + " " + this.message.cyan;
    break;

    case 'fail' :
      this.message = "FAIL".red.inverse + " " + this.message.red;
    break;

    case 'access' :
      this.message = "ACCESS".cyan.inverse + " " + this.message;
    break;

    case 'warn' :
      this.message = "WARN".yellow.inverse + " " + this.message;
    break;

    case 'debug' :
      this.message = this.message
    break;

    case 'error' :
      this.message = "ERROR".yellow.inverse + " " + this.message.red;
    break;

    case 'fatal' :
      this.message = "FATAL".red.inverse + " " + this.message.red;
    break;
  }
};

logger.Logger = function Logger(name, path) {
  this.name = name;
  this.path = path;
};

logger.Logger.prototype.clone = function(properties) {
  return this.adapter.ns(properties);
};

logger.Logger.prototype.write = function(level, type, message, data) {
  var msg = new logger.LogMessage(level, type, message, data)

  msg = new logger.Message(this.name, msg.message);

  msg.out();
 // this.adapter.write(msg.level, msg.type, {
 //   message : msg.message,
 //   data    : msg.data
 // });

  return this;
};

logger.Message = function Message(name , message){
  this.name       = name;
  this.message    = message;
  this.compiled   = null;
};

logger.Message.prototype.out = function() {
  console.log(this.compile());

  return this;
};

logger.Message.prototype.compile = function(colors) {
  this.prompt     = "[".magenta + this.name.blue + "]".magenta + ' => '.blue
  this.compiled   =  this.prompt + this.message;

  if (colors === false) {
    this.compiled  = this.compiled.stripColors;
    this.message    = this.message.stripColors;
    this.prompt     = this.prompt.stripColors;
  }

  return this.compiled;
}

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

logger.Logger.prototype.access = function(message, data) {
  return this.write('access', 'info', message, data);
};

logger.Logger.prototype.fatal = function(message, data) {
  return this.write('fatal', 'error', message, data);
};

logger.Logger.prototype.question = function(question, callback) {
  var msg = new logger.Message(this.name, question)
    , cli = new pineapple.utils.CliInterface(process.stdin, process.stdout);

  msg.compile(false);

  cli.question(msg.message + " ", function(response){
    typeof callback === 'function' && callback(response);
  });

  this.cli = cli;

  return this;
};

module.exports = logger;