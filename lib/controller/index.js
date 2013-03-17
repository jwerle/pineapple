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
    , AppController, ns

  if (!name) 
    throw new Error("A controller needs a name for pineapple.controller.define()");

  // ensure some sort of constructor
  AppController = typeof pineapple.controllers.Application === 'function' ? pineapple.controllers.Application : function(){};
  // inherit base controller
  AppController.prototype = Object.create(pineapple.controller.Controller.prototype);
  // reasign constructor
  AppController.prototype.constructor = AppController;
  // if the current controller we're working with is not the Application controller
  if (name !== 'Application') {
    // inherit app controler
    Controller.prototype = Object.create(AppController.prototype)
    // reasign constructor
    Controller.prototype.constructor = Controller;
  }
  
  return Controller;
};

module.exports.ns = function(ns) {
  this._ns = ns;

  return this;
}