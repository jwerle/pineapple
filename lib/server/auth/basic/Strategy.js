var api = {}

api.Strategy = pineapple.utils.inherit(pineapple.passport.Strategy, function Strategy(options, handle) {
  handle  = (options instanceof Function)? options : handle;
  options = (options instanceof Object)? options : {}
  this.super(this);
  this.name     = 'basic';
  this.options  = options;
  this.handle   = (handle instanceof Function)? handle : function(){};
});

api.Strategy.prototype.authenticate = function(req, options) {
  options = (options instanceof Object)? options : {};
  options = pineapple.utils.object.merge(this.options, options)
  var key = req.headers[options.key] || false
  this.handle(key, req);
  this.success(key);
}

module.exports = api.Strategy;