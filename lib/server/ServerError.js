/**
  @namespace server
**/
var server = {};

server.ServerError = pineapple.utils.inherit(Error, function ServerError(message){
  this.message = message;
});

server.ServerError.prototype.name = "ServerError";

module.exports = server;