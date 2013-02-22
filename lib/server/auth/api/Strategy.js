var api = {}

api.Strategy = pineapple.utils.inherit(pineapple.passport.Strategy, function Strategy(options, handle) {
  this.super(this);
  this.name     = 'api';
  this.options  = options;
  this.handle   = handle
});

api.Strategy.prototype.authenticate = function(req, options) {
  var apikey = req.headers['x-apikey'] || false
    , error

  if (!pineapple.isProduction) {
    apikey = (req.query && req.query.apikey? req.query.apikey : apikey)
  }

  req.apikey = apikey || false;
  this.success(apikey);
}

module.exports = api.Strategy;