var Route = require('./Route').Route
  , EventEmitter = require('events').EventEmitter
/**
  @namespace router
**/
var router = {};

router.WILDCARD_METHOD = "*";
router.BOUND_REGEX     = /[a-z]+.[a-z]+.?([a-z]+)?/i;
router.RESOURCES_URI   = '/resources'

router.Router = function Router(routes, methods){
  EventEmitter.call(this);

  var route, i

  this.routes           = [];
  this.domain           = false;
  this.methods          = [].concat(methods || []);
  this._prefix          = false;
  this._defaultAction   = false;

  if (typeof routes === 'object' && routes.length) {
    for (i = 0; i < routes.length; i++) {
      route = routes[i];

      this.routes.push(this.create(route.method, route.route, route.bound));
    }
  }
};

router.Router.prototype = Object.create(EventEmitter.prototype);

router.Router.prototype.child = function(prefix) {
  var rt = new router.Router();

  rt.prefix(prefix);

  if (this._defaultAction) {
    rt.setDefaultAction(this._defaultAction);
  }

  if (this._prefix) {
    rt.prefix(this._prefix);
  }

  rt.methods = rt.methods.concat(this.methods);

  return rt;
}

router.Router.prototype.use = function(child) {
  this.routes = this.routes.concat(child.routes);

  return this;
}

router.Router.prototype.extend = function(method, handle) {
  if (typeof method === 'string' && typeof handle === 'function') {
    this[method] = (handle instanceof Function && handle.bind(this)) || function() {
      return this.proxy(method, arguments);
    };
  }

  return this;
};

router.Router.prototype.when = function(event) {
  var self = this, bound = {}

  bound.event = event;
  bound.call = function(bound) {
    var handle = new Route('event', event, bound)
  
    self.on.call(self, handle.route, function(){
      (handle.bound && typeof handle.bound === 'string') &&
      (handle.bound = pineapple.controller.get(handle.bound)) &&
      (handle.bound.isController && (handle.bound = new handle.bound.Controller())) && 
      (handle.bound = handle.bound[handle.action].bind(handle.bound));

      handle.bound.apply(this, arguments);
    });

    return self;
  };

  return bound;
}

router.Router.prototype.create = function(method, route, bound) {
  var self = this, match

  if (method === router.WILDCARD_METHOD && this.methods.length) {
    this.methods.map(function(method){
      self.create.bind(self)(method, route, bound);
    });

    return this.routes;
  }
  else if (bound instanceof Function) {
    this.routes.push(new Route(method, route, bound));
  }
  else {
    route = this._prefix? this._prefix + route : route;
    
    if (this._defaultAction &&
        this._defaultAction.length &&
        typeof bound === 'string' &&
        (match = bound.match(router.BOUND_REGEX)) && !match[1]) {
      // We want to default a method for each controller
      // e.g. Controller.index
      bound += "." + this._defaultAction;
    }
    
    this.routes.push(new Route(method, route, bound));

    return route;
  }
};

router.Router.prototype.prefix = function(prefix) {
  if (typeof prefix === 'string') {
    this._prefix = '/' + prefix;
  }

  return this;
};

router.Router.prototype.getPrefix = function() {
  return this._prefix || "";
};

router.Router.prototype.useMethods = function(methods) {
  this.methods = this.methods.concat(methods);

  return this;
};

router.Router.prototype.defaultRoute = function(default_route, callback) {
  callback = (typeof callback === 'function'? callback : this.exposeRoutes);

  callback.call(this, default_route);

  return this;
};

router.Router.prototype.exposeRoutes = function(route_path) {
  var self = this

  route_path = route_path || router.RESOURCES_URI;

  return this.all(route_path, function(req, res, next) {
    var message, route, routes = []

    route_path = self.getPrefix() + (route_path || router.RESOURCES_URI);

    if (! req) {
      if (typeof next === 'function') {
        next();
      }

      return;
    }

    for (route in self.routes) {
      route = self.routes[route]

      if ((self.getPrefix() + route.route) !== route_path) {
        routes.push({
          method : route.method.toUpperCase(),
          route  : route.route
        });
      }
    }

    message = new pineapple.server.http.JSONResponse(pineapple.server.OK, {
        routes : routes
      });

    res.json(message.code, message)
  });
}

router.Router.prototype.proxy = function(method, args){
  return this.create.apply(this, [method].concat(pineapple.utils.makeArray(args)))
}

router.Router.prototype.get = function(){
  return this.proxy('get', arguments);
}

router.Router.prototype.post = function(){
  return this.proxy('post', arguments);
}

router.Router.prototype.del = function(){
  return this.proxy('del', arguments);
}

router.Router.prototype.put = function(){
  return this.proxy('put', arguments);
}

router.Router.prototype.all = function(){
  return this.proxy('*', arguments);
}

router.Router.prototype.setDefaultAction = function(action) {
  this._defaultAction = action;

  return this;
};



module.exports = router;