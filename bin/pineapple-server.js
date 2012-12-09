module.exports.opts = [
  {full : 'port', abbr: 'p'}
];

module.exports.call = function(){
  var args      = pineapple.utils.makeArray(arguments)
    , port      = pineapple.config.server.port
    , dbConfig  = pineapple.config.database 
    , db        = dbConfig.database

  pineapple.api.create(pineapple.config.server.config).bindRoutes(pineapple.routes).listen(port, function(){
    console.log("MoovAtom API Server started. Listening on port ".green + new String(port).cyan);
  });

  pineapple._db = pineapple.db.connect(dbConfig.host, db);
};

module.exports.help = function(help){
  return help("server", "<command> Execute server commands");
};