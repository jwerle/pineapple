var path  = require('path')
  , fs    = require('fs')
  , exec  = require('child_process').exec

module.exports.call = function() {
  var args    = this.utils.makeArray(arguments)
  , daemon    = null
  , port      = pineapple.config.server.port
  , dbConfig  = pineapple.config.database 
  , db        = dbConfig.database

  daemon = new pineapple.daemon.Daemon(pineapple.appname, '/bin/pineapple-daemon', args);

  if (!!~ args.indexOf('server')) {
    daemon.use(function(){
      pineapple.api.create(pineapple.config.server.config).bindRoutes(pineapple.routes).listen(port, function(){
        console.log("Pineapple API Server started. Listening on port ".green + new String(port).cyan);
      });
    });
  }

  if (!!~ args.indexOf('db')) {
    daemon.use(function(){
      pineapple._db = pineapple.db.connect(dbConfig.host, db);
    });
  }

  if (daemon.cmds[0] === 'no-fork') {
    daemon.start();
  }
  else {
    daemon.fork();
  }
};

module.exports.help = function(help) {
  return help('daemon', "Creates a daemon process for a Pineapple application.");
};