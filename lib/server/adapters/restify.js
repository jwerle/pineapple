var restify = require('restify')

/**
  @namespace adapters
**/
var adapters = {};

adapters.restify = {
  create : function() {
    var server = restify.createServer.apply(restify, arguments);

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.authorizationParser());
    server.use(restify.dateParser());
    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    server.use(restify.throttle({
      burst: 100,
      rate: 50,
      ip: true,
      overrides: {
        '192.168.1.1': {
          rate: 0,        // unlimited
          burst: 0
        }
      }
    }));

    server.use(restify.conditionalRequest());

    return server;
  }
};
  
module.exports = adapters.restify;