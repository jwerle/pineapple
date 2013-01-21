var Application = module.exports = pineapple.controller.define(function Application() {
  this.routeNotFound = function(next) {
    return routeNotFound.call(this, next);
  }

  this.index = function(next) {
    this.notImplemented(next);
  }

  this.get = function(next) {
    this.notImplemented(next);
  }

  this.query = function(next) {
    this.notImplemented(next);
  }

  this.create = function(next) {
    this.notImplemented(next);
  }

  this.edit = function(next) {
    this.notImplemented(next);
  }

  this.remove = function(next) {
    this.notImplemented(next);
  }
});

Application.prototype.routeNotFound = function(next) {
  return routeNotFound.call(this, next);
};

function routeNotFound(next) {
  this.notImplemented(next);
}