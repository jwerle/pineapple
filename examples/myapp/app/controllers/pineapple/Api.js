module.exports.Api = function Api() {
  this.index = function(req, res, next) {
    this.json(req, res, pineapple.server.OK, {
      method   : req.method,
      resource : req.url,
      message  : "Api.index() was called."
    });
  };
};
