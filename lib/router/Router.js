var Route = require('./Route').Route

/**
  @namespace router
**/
var router = {};

router.WILDCARD_METHOD = "*";

router.BOUND_REGEX     = /[a-z]+.[a-z]+.?([a-z]+)?/i;

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
    
    if (this._defaultAction && this._defaultAction.length && (match = bound.match(router.BOUND_REGEX)) && !match[1]) {
      bound += "." + this._defaultAction;
    }
    
    this.routes.push(new Route(method, route, bound));
  }

  return route;
};

router.Router.prototype.prefix = function(prefix) {
  this._prefix = '/' + prefix;

  return this;
};

router.Router.prototype.useMethods = function(methods) {
  this.methods = this.methods.concat(methods);

  return this;
};

router.Router.prototype._proxyRoute = function(method,args){
  return this.create.apply(this, [method].concat(pineapple.utils.makeArray(args)))
}

router.Router.prototype.get = function(){
  return this._proxyRoute('get', arguments);
}

router.Router.prototype.post = function(){
  return this._proxyRoute('post', arguments);
}

router.Router.prototype.del = function(){
  return this._proxyRoute('del', arguments);
}

router.Router.prototype.put = function(){
  return this._proxyRoute('put', arguments);
}

router.Router.prototype.all = function(){
  return this._proxyRoute('*', arguments);
}

router.Router.prototype.setDefaultAction = function(action) {
  this._defaultAction = action;

  return this;
};



module.exports = router;