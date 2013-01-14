function Application() {
  this.routeNotFound = function(req, res, next) {
    return routeNotFound.call(this, req, res, next);
  }
};

Application.prototype.routeNotFound = function(req, res, next) {
  return routeNotFound.call(this, req, res, next);
};

function routeNotFound(req, res, next) {
  this.notImplemented(req, res, next);
}

module.exports = Application;