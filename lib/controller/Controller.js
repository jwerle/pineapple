var controller = {};

controller.Controller = function Controller(){
  pineapple.Base.call(this);
};

controller.Controller.prototype      = new pineapple.Base();
controller.Controller.prototype.json = function(code, data) {
  return this.response.json(code, new pineapple.server.http.JSONResponse(code, data));
};

controller.Controller.prototype.notImplemented = function(next) {
 return this.json(pineapple.server.NOT_IMPLEMENTED, {
    method    : this.request.method,
    resource  : this.request.url
  });
};

controller.Controller.prototype.routeNotFound = function(next) {
  return this.notImplemented(next);
};

controller.Controller.prototype.index = function(next) {
  return this.notImplemented(next);
}

controller.Controller.prototype.all = function(next) {
  return this.notImplemented(next);
}

controller.Controller.prototype.get = function(next) {
  return this.notImplemented(next);
}

controller.Controller.prototype.query = function(next) {
  return this.notImplemented(next);
}

controller.Controller.prototype.create = function(next) {
  return this.notImplemented(next);
}

controller.Controller.prototype.edit = function(next) {
  return this.notImplemented(next);
}

controller.Controller.prototype.remove = function(next) {
  return this.notImplemented(next);
}

module.exports = controller;