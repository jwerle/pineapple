function Application() {
  this.routeNotFound = function(next) {
    return routeNotFound.call(this, next);
  }
};

Application.prototype.routeNotFound = function(next) {
  return routeNotFound.call(this, next);
};

function routeNotFound(next) {
  this.notImplemented(next);
}

module.exports = Application;