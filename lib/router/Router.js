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

router.Router.prototype.use = function() {
  var children = pineapple.utils.makeArray(arguments)
    , self = this

  children.map(function(child){
    self.routes = self.routes.concat(child.routes);
  });

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
  var self = this, deferred = {}

  deferred.event = event;
  deferred.call = function(bound) {
    self.on.call(self, event, function(request, response){
      var c, handle = new Route('event', event, bound)
      
      if (handle.bound && typeof handle.bound === 'string') {
        handle.bound = pineapple.controller.get(handle.bound);

        if (handle.bound.isController === true) {
          handle.bound = c = new handle.bound.Controller();
          handle.bound = handle.bound[handle.action]
          c.request = request;
          c.response = response;
        }
      }

      if (typeof handle.bound === 'function') {
        handle.bound.call(c, request, response);
      }
    });

    return self;
  };

  return deferred;
}

router.Router.prototype.create = function(method, route, bound, returnRoute) {
  var self = this, match

  if (method === router.WILDCARD_METHOD && this.methods.length) {
    this.methods.map(function(method){
      self.create.bind(self)(method, route, bound);
    });
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
  }

  if (returnRoute === true) {
    return route;
  }

  return this;
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