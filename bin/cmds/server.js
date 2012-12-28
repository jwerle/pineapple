module.exports.opts = [
  {full : 'port',   abbr: 'p'}
];

module.exports.alias = 's';

module.exports.call = function(){
  var args          = pineapple.utils.makeArray(arguments)
    , port          = pineapple.config.server.port
    , dbConfig      = pineapple.config.database 
    , db            = dbConfig.database
    , formats       = pineapple.server.formatters.get()
    , serverConfig  = {
      formatters : formats
    }


  serverConfig = pineapple.utils.object.merge(serverConfig, pineapple.config.server.config)

  pineapple.utils.network.isPortOpen(port, serverConfig.host, function(err, isOpen) {
    if (err) {
      pineapple.api.error(err.message);
    }
    else if (! isOpen) {
      pineapple.api.create(serverConfig).bindRoutes(pineapple.routes).listen(port, function(){
       pineapple.api.logger.info("Listening on port ".green + new String(port).cyan);
       pineapple.api.emit('connected');
      });
    }
    else {
      pineapple.api.logger.warn("Port " + port + " is currently in use. I'm not going to start the server");
    }
  });

  pineapple._db = pineapple.db.connect(dbConfig.host, db);
};

module.exports.help = function(help){
  return help("server", "<command> Execute server commands");
};