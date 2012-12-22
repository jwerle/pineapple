var path  = require('path')
  , fs    = require('fs')
  , exec  = require('child_process').exec

module.exports.call = function() {
  var args    = this.utils.makeArray(arguments)
  , daemon    = null
  , port      = pineapple.config.server.port
  , dbConfig  = pineapple.config.database 
  , db        = dbConfig.database
  , pid

  daemon = new pineapple.daemon.Daemon(pineapple.app.name, '/bin/pineapple-daemon', args);

  if (!!~ args.indexOf('stop')) {
    daemon.stop();
  }

  if (!!~ args.indexOf('purge')) {
    daemon.purge();
  }

  if (!!~ args.indexOf('server')) {
    daemon.use(function(){
      pineapple.daemon.logger.info("Creating server..".green);
      pineapple.daemon.logger.info([
        'name     : ' + pineapple.config.server.config.name.cyan,
        'version  : ' + pineapple.config.server.config.version.cyan,
        'port     : ' + (''+ port).magenta,
        'adapter  : ' + pineapple.config.server.adapter.green,
        '- - - - - - - - - - -'
      ].join("\n"));

      pineapple.api.create(pineapple.config.server.config).bindRoutes(pineapple.routes).listen(port, function(){
        pineapple.api.logger.info("Pineapple API Server started. Listening on port ".green + new String(port).cyan);
      });
    });
  }

  if (!!~ args.indexOf('db')) {
    daemon.use(function(){
      pineapple.daemon.logger.info("Creating database connection..".green)
      pineapple.daemon.logger.info([
        'adapter   : ' + dbConfig.adapter.green, 
        'host      : ' + dbConfig.host.cyan,
        'database  : ' + db.cyan,
        '- - - - - - - - - - -'
      ].join("\n"));

      pineapple._db = pineapple.db.connect(dbConfig.host, db);
    });
  }

  if (!!~ args.indexOf('no-fork')) {
    daemon.start();
  }
  else {
    daemon.fork();
  }
};

module.exports.help = function(help) {
  return help('daemon', "Creates a daemon process for a Pineapple application.");
};