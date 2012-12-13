module.exports.opts = [
  {full : 'port', abbr: 'p'}
];

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

  pineapple.api.create(serverConfig).bindRoutes(pineapple.routes).listen(port, function(){
   pineapple.api.logger.info("Listening on port ".green + new String(port).cyan);
  });

  pineapple._db = pineapple.db.connect(dbConfig.host, db);
};

module.exports.help = function(help){
  return help("server", "<command> Execute server commands");
};