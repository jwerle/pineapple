module.exports.Api = function Api() {
  this.index = function(req, res, next) {
    res.json(pineapple.server.OK, new pineapple.server.http.JSONResponse(pineapple.server.OK, {
      method   : req.method,
      resource : req.url,
      message  : "pineapple.controllers.pineapple.Api.index() was called."
    }));

  };
};
