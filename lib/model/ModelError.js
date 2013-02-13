/**
  * @namespace model
  */
var model = {};

/**
  * Constructs a new ModelError object
  *
  * @constructor ModelError
  * @param {String} message - A message to be yielded with the ModelError instance
  */
model.ModelError = pineapple.utils.inherit(Error, function ModelError(message){
  Error.call(this);
  this.message = message;
  // capture the stack trace
  Error.captureStackTrace(this);
});
// reset the constructor
model.ModelError.prototype.constructor = model.ModelError;
// reset the name
model.ModelError.prototype.name = "ModelError";
// exports namespace
module.exports = model;