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
      burst     : 100,
      rate      : 50,
      ip        : true,
      overrides : {
        '0.0.0.0' : {
          rate  : 0,
          burst : 0
        }
      }
    }));

    server.use(restify.conditionalRequest());

    return server;
  },

  ServerError : pineapple.utils.inherit(restify.RestError, function ServerError(code, message) {
    this.super(this, code, 'ServerError', message, this.ServerError)
    this.name = 'ServerError';
  }),

  client : {
    create : function(options) {
      if (! options || typeof options !== 'object') {
        throw new adapters.return.ServerError(1, "A client needs options to be constructed.");
      }

      var client

      switch (options.type) {
        default : case 'json' :
          client = restify.createJsonClient(options.client || {});
        break;


        case 'https' : case 'http' :
          client = restify.createClient(options.client || {});
        break;

        case 'string' :
          client = restify.createStringClient(options.client || {});
        break;

        case 'socket' :
          // to do
        break;

        case 'binary' :
          // to do
        break;
      }
      
      return client;
    }
  }
};
  
module.exports = adapters.restify;