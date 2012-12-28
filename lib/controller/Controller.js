var controller = {};

controller.Controller = function Controller(){
  pineapple.Base.call(this);

  this.index    = pineapple.noop;
  this.create   = pineapple.noop;
  this.get      = pineapple.noop;
  this.edit     = pineapple.noop;
  this.remove   = pineapple.noop;


  this.notImplemented = function(req, res, next) {
    var message = new pineapple.server.http.JSONResponse(pineapple.server.NOT_IMPLEMENTED, {
        method    : req.method,
        resource  : req.url
      });

    res.json(message.code, message)
  }
};

module.exports = controller;