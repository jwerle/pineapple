var testAndCallMethod

var ServerError  = require('./ServerError').ServerError

testAndCallMethod = function(server, method, args) {
  if (typeof server.server[method] === 'function') {
    server.server[method].apply(server.server, args);
  }
  else {
    throw new ServerError("Adapter Server " + server.type + " must have a " + method + "() method.");
  }
}

/**
  @namespace server
**/
var server = {};

server.Server = pineapple.utils.inherit(require('events').EventEmitter, function Server(name, type, adapter) {
  this.name     = name;
  this.type     = type;
  this.adapter  = adapter || false;
  this.server   = null
  this.created  = false;
  this.routes   = {};
  this.logger   = new pineapple.logger.Logger('server', pineapple.ABSOLUTE_PATH + '/log/server');

  if (! this.adapter) {
    throw new ServerError("An instance of Server needs an adapter.");
  }
});

server.Server.prototype.create = function() {
  var self = this

  this.server   = this.adapter.create.apply(this.adapter, arguments);
  this.created  = true;

  this.server.pre(function(req, res, next){
    var method, host, ua, time, version, url

    method  = req.method;
    host    = req.headers.host;
    ua      = req.headers['user-agent']
    url     = req.url;
    time    = req.time;
    version = req.version;

    self.logger.access(method +" ["+ host +"] - ("+ time +") - '"+ url + "' | "+ ua);

    return next();
  });

  return this;
};

['use', 'pre'].forEach(function(method){
  server.Server.prototype[method] = function() {
    this.server[method].apply(this.server, arguments);

    return this;
  }
});

server.Server.prototype.listen = function() {
  testAndCallMethod(this, 'listen', arguments);

  return this;
};

server.Server.prototype.close = function() {
  testAndCallMethod(this, 'close', arguments);

  return this;
};

server.Server.prototype.address = function(callback) {
  testAndCallMethod(this, 'address', arguments);

  return this;
};

server.Server.prototype.bindRoutes = function(routes) {
  var route, method, i

  if (! this.created) {
    throw new ServerError("An adapter server instance must be created before binding routes!");
  }

  for (i in routes) {
    route  = routes[i]
    route.parseVars();

    method = this.server[route.method.toLowerCase()];

    this.routes[route.route] = route;
    
    !function(server, route, method) {
      method.call(server, route.route, function(request, response, next){
        var controller  = route.bound
          , action      = route.action
          , Controller

        if (typeof controller === 'string') {
          controller = pineapple.utils.valueFromPath(controller, pineapple.controllers);
        }

        if (typeof controller === 'function') {
          Controller = pineapple.utils.inherit(pineapple.controller.Controller, controller);

          if (typeof (new Controller(false))[action] === 'function') {
            c = new Controller();

            c[action](request, response, next);
          }
          else {
            Controller(request, response, next);
          }
        }
      });
    }(this.server, route, method);
  }

  return this;
};

module.exports = server;