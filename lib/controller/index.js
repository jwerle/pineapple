module.exports = pineapple.loader.load(__dirname).controller;
module.exports.get = function(controller) {
  var isController = false

  if (typeof controller === 'string') {
    controller = pineapple.utils.valueFromPath(controller, pineapple.controllers);
    isController = true;
  }

  return {isController : isController, isCallback: !isController, Controller : controller};
};

module.exports.define = function(Controller){
  var name = Controller.name
    , Application, ns

  if (!name) 
    throw new Error("A controller needs a name for pineapple.controller.define()");
  
  // if the current controller we're working with is not the Application controller
  if (name !== 'Application') {
    // ensure some sort of constructor
    Application = typeof pineapple.controllers.Application === 'function' ? pineapple.controllers.Application : function(){};
    // inherit app controler
    Controller.prototype = Object.create(Application.prototype)
    // reasign constructor
    Controller.prototype.constructor = Controller;
  }
  
  return Controller;
};

module.exports.ns = function(ns) {
  this._ns = ns;

  return this;
}