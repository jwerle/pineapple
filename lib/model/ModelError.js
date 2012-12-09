/**
  @namespace model
**/
var model = {};

model.ModelError = pineapple.utils.inherit(Error, function ModelError(message){
  this.message = message;
});

model.ModelError.prototype.name = "ModelError";

module.exports = model;