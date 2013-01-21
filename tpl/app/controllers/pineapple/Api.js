module.exports = pineapple.controller.define(function Api() {
  this.index = function() {
    this.json(pineapple.server.OK, {
      method   : this.request.method,
      resource : this.request.url,
      message  : "Api.index() was called from ./app/controllers/pineapple/Api.js"
    });
  };
});
