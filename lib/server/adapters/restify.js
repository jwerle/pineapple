var restify = require('restify')

/**
  @namespace adapters
**/
var adapters = {};

adapters.restify = {
  create : function() {
    return restify.createServer.apply(restify, arguments);
  }
};
  
module.exports = adapters.restify;