/**
  * @namespace controller
  */
var controller = {};

/**
  * Constructs a new base Controller
  * @note inherits from pineapple.Base
  */
controller.Controller = function Controller(){ pineapple.Base.call(this); };
// set the prototype to a new pineapple.Base instance
controller.Controller.prototype = new pineapple.Base();
// reset the constructor
controller.Controller.constructor = controller.Controller;

/**
  * Emits a JSON response to the client. Accepts a code and a data object
  * which is converted into a pineapple.server.http.JSONResponse instance
  *
  * @public
  * @function Controller#json
  * @param {Number} code - A valid HTTP code
  * @param {Object} data - A valid object that can be converted to JSON
  * @param {Boolean} raw - A boolean to determine whether to emit a response with or without 
  *                        an instance of pineapple.server.http.JSONResponse
  * @return {Object} - A reference to this
  */
controller.Controller.prototype.json = function(code, data, raw) {
  // if raw is true, then just emit a object
  if (raw === true) this.response.json(code, pineapple.utils.object.merge({code: code}, data));
  // create an instance of pineapple.server.http.JSONResponse and emit
  else this.response.json(code, new pineapple.server.http.JSONResponse(code, data));
  // maintain chanining
  return this;
};

/**
  * Emits a not implemented response
  *
  * @public
  * @function Controller#notImplemented
  */
controller.Controller.prototype.notImplemented = function(next) {
 return this.json(pineapple.server.NOT_IMPLEMENTED, {
    method    : this.request.method,
    resource  : this.request.url
  });
};

// Interface methods that can be implemented
['routeNotFound', 'index', 'all', 'get', 'query', 'create', 'edit', 'remove'].map(function(method){
  controller.Controller.prototype[method] = function(next) {
    return this.notImplemented(next);
  };
});

// export namespace
module.exports = controller;