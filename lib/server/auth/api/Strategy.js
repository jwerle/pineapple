var api = {}

api.Strategy = pineapple.utils.inherit(pineapple.passport.Strategy, function Strategy(options, handle) {
  this.super(this)
  this.name     = 'api';
  this.options  = options;
  this.handle   = handle
});

api.Strategy.prototype.authenticate = function(req, options) {
  var apikey = req.headers['x-apikey'] || (req.query && req.query.apikey? req.query.apikey : false)
    , error

  if (apikey) {
    req.apikey = apikey;
    this.success(apikey);
  }
  else {
    error = new pineapple.server.http.JSONResponse(pineapple.server.UNAUTHORIZED, {
      type      : 'pineapple.Base.Error',
      resource  : req.path,
      reason    : "Missing API key"
    });

    return this.fail(error.message, error.code)
  }
}

module.exports = api.Strategy;