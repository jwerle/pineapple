var controller = {};

controller.Controller = function Controller(){
  pineapple.Base.call(this);
};

controller.Controller.prototype = new pineapple.Base();
controller.Controller.prototype.json = function(code, data) {
  return this.response.json(code, new pineapple.server.http.JSONResponse(code, data));
};

controller.Controller.prototype.notImplemented = function(next) {
 return this.json(pineapple.server.NOT_IMPLEMENTED, {
    method    : this.request.method,
    resource  : this.request.url
  });
};

module.exports = controller;