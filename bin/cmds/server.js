module.exports.opts = [
  {full : 'port',   abbr: 'p'},
  {full : 'environment'},
  {full : 'no-server'}
];
module.exports.needs  = 'server';
module.exports.alias = 's';
module.exports.help = function(help){
  return help("server [s]", "<command> Execute server commands");
};

module.exports.call = function(){
  var args          = pineapple.utils.makeArray(arguments)
    , port          = pineapple.config.server.port
    , dbConfig      = pineapple.config.database 
    , db            = dbConfig.database
    , serverConfig  = {}


  serverConfig = pineapple.utils.object.merge(serverConfig, pineapple.config.server.config)
  if (! pineapple.parser.opts['no-server']) {
    pineapple.utils.network.isPortOpen(port, serverConfig.host, function(err, isOpen) {
      if (err) {
        pineapple.api.error(err.message);
      }
      else if (! isOpen) {
        pineapple.api.bindRoutes(pineapple.app.router.routes).listen(port, function(){
         pineapple.api.logger.info("Listening on port ".green + new String(port).cyan);
         pineapple.api.emit('connected');
        });
      }
      else {
        pineapple.api.logger.warn("Port " + port + " is currently in use. I'm not going to start the server");
      }
    });
  }

  pineapple._db = pineapple.db.connect(dbConfig.host, db);
};