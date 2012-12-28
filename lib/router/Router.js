var Route = require('./Route').Route

/**
  @namespace router
**/
var router = {};

router.WILDCARD_METHOD = "*";
router.BOUND_REGEX     = /[a-z]+.[a-z]+.?([a-z]+)?/i;
router.RESOURCES_URI   = '/resources'

router.Router = function Router(routes, methods){
  var route, i

  this.routes           = [];
  this.methods          = [].concat(methods);
  this._prefix          = false;
  this._defaultAction   = false;

  if (typeof routes === 'object' && routes.length) {
    for (i = 0; i < routes.length; i++) {
      route = routes[i];

      this.routes.push(this.create(route.method, route.route, route.bound));
    }
  }
};

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

router.Router.prototype.create = function(method, route, bound) {
  var self = this, match

  if (method === router.WILDCARD_METHOD && this.methods.length) {
    this.methods.map(function(method){
      self.create(method, route, bound);
    });

    return this.routes;
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
  return this._prefix;
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

router.Router.prototype.exposeRoutes = function(resource_route) {
  var self = this

  resource_route = resource_route || router.RESOURCES_URI;

  return this.all(resource_route, function(req, res, next) {
    var message, route, routes = []

    resource_route = self.getPrefix() + (resource_route || router.RESOURCES_URI);

    if (! req) {
      if (typeof next === 'function') {
        next();
      }

      return;
    }

    for (route in self.routes) {
      route = self.routes[route]

      if (route.route !== resource_route && route.route !== self.getPrefix() + router.RESOURCES_URI) { // We don't want to include the /resources route for redundancy
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