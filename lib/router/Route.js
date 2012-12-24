
var router = {};

router.Route = function Route(method, route, bound){
  var action

  if (typeof bound === 'string') {
    bound   = bound.split('.');
    action  = bound.pop();
    bound   = bound.join('.');
  }

  this.method = method || 'GET';
  this.route  = route;
  this.vars   = {};
  this.bound  = bound;
  this.action = action;
};

router.Route.prototype.setVar = function(key, value) {
  this.vars[key]  = value;

  return this;
};

router.Route.prototype.parseVars = function() {
  var key, value, regex

  for (key in this.vars) {
    value = this.vars[key];
    regex = new RegExp('(:' + key + ')', 'g');

    this.route = this.route.replace(regex, value);
  }

  return this;
};

router.Route.prototype.getVar = function(key) {
  return this.vars[key];
}

module.exports = router;