var exec = require('child_process').exec
  , fs   = require('fs')

var daemon = {}

daemon.PATH = pineapple.APP_PATH && pineapple.APP_PATH !== pineapple.PATH?
              pineapple.APP_PATH : pineapple.PATH

daemon.RUN_PATH = daemon.PATH + '/run';
daemon.LOG_PATH = daemon.PATH + '/log';

daemon.Daemon = pineapple.utils.inherit(pineapple.Base, function Daemon(title, cmd, cmds) {
  this.super(this);

  this.cmd      = cmd;
  this.cmds     = cmds || [];
  this.title    = title;
  this.pidpath  = daemon.RUN_PATH + '/' + this.title + '.pid';
});

daemon.Daemon.prototype.writePid = function(pid) {
  var pidpath = this.pidpath
    , buffer, self = this

  if (pineapple.utils.stat(pidpath)) {
    fs.unlinkSync(pidpath)
  }
  
  fd = fs.openSync(pidpath , 'w+')
  fs.writeSync(fd, pid);
  
  return pid;
};

daemon.Daemon.prototype.getLastPid = function() {
  if (pineapple.utils.stat(this.pidpath)) {
    var buffer

    buffer = fs.openSync(this.pidpath, 'rs+')
    buffer = fs.readSync(buffer, buffer);

    return +buffer[0];
  }
  else {
    return false;
  }
};

daemon.Daemon.prototype.fork = function() {
  var self = this, child, cmd

  cmd = 'cd ' + daemon.PATH + ' && pineapple daemon ' + this.cmds.join(' ') + ' no-fork >> ./log/api.log &';
  
  process.chdir(daemon.PATH);
  console.log("Forking with " + cmd)
  child = exec(cmd);

  process.exit();

  return this;
};

daemon.Daemon.prototype.start = function() {

  if (this.getLastPid()) {
    console.error("Daemon already running!".red);
  }
  else {
    console.log("Staring daemon..");
    this.writePid(process.pid);
    this.callHooks();
  }

  return this;
}

daemon.Daemon.prototype.ready = function(callback) {
  this.once('ready', callback);
};

daemon.Daemon.prototype.stop = function() {
  console.log("Stopping daemon..");

  try {
    process.kill(this.getLastPid());
  }
  finally {
    try {
      fs.unlinkSync(this.pidpath);
    }
    finally {
      process.exit();
    }
  }
};

daemon.Daemon.prototype.purge = function() {
  try {
    this.stop();
    fs.unlinkSync(this.pidpath)
  }
  finally {}
};

module.exports = daemon;