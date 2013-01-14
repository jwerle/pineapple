var controller = {};

controller.Controller = function Controller(){
  pineapple.Base.call(this);
};

controller.Controller.prototype = new pineapple.Base();
controller.Controller.prototype.json = function(res, req, code, data) {
   var message = new pineapple.server.http.JSONResponse(code, data);

  res.json(message.code, message);
};

controller.Controller.prototype.notImplemented = function(req, res, next) {
 this.json(res, req, pineapple.server.NOT_IMPLEMENTED, {
      method    : req.method,
      resource  : req.url
    });
};

module.exports = controller;