var init = require('init')

var daemon = {}

if (pineapple.APP_PATH && pineapple.APP_PATH !== pineapple.PATH) {
  daemon.RUN_PATH = pineapple.APP_PATH + '/run';
  daemon.LOG_PATH = pineapple.APP_PATH + '/log';
}
else {
  daemon.RUN_PATH = pineapple.PATH + '/run';
  daemon.LOG_PATH = pineapple.PATH + '/log';
}

daemon.Daemon = pineapple.utils.inherit(pineapple.Base, function Daemon(title, cmd, cmds) {
  this.super(this);

  this.cmd      = cmd;
  this.cmds     = cmds || [];
  this.title    = title;
});


daemon.Daemon.prototype.fork = function() {
  var self = this

  init.simple({
    pidfile : daemon.RUN_PATH + '/' + this.title + '.pid',
    logfile : daemon.LOG_PATH + '/daemon.log',
    command : 'start',
    run     : function() {
      console.log('ready')
      //self.emit('ready');
    }
  })
};

daemon.Daemon.prototype.ready = function(callback) {
  this.once('ready', callback);
};

module.exports = daemon;