var user = {};

user.User = function User() {
  var User    = pineapple.models.user.User().create()

  this.index = function(req, res, next) {
    var message = new pineapple.server.http.JSONResponse(pineapple.server.NOT_IMPLEMENTED, {
        method    : req.method,
        resource  : req.url
      });

    res.json(message.code, message)
  }

  this.get = function(req, res, next) {
    var uuid = req.params.uuid

    User.findOne({uuid : uuid}, User.getExposed().join(' '), function(err, user) {
      var code
        , message

      if (err || user === null) {
        message = new pineapple.server.http.JSONResponse(pineapple.server.NOT_FOUND, {
          resource : 'User'
        });

        code    = message.code;
      }
      else {
        code    = pineapple.server.OK;
        message = new pineapple.server.http.JSONResponse(code, user.toJSON())
      }

      res.json(code, message);
    });
  }
};

module.exports = user;