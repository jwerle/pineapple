module.exports = pineapple.loader.load(__dirname).controller;
module.exports.get = function(controller) {
  var isController = false

  if (typeof controller === 'string') {
    controller = pineapple.utils.valueFromPath(controller, pineapple.controllers);
    isController = true;
  }


  return {isController : isController, Controller : controller};
};

module.exports.define = function(Controller){
  var name = Controller.name
    , AppController, ns

  if (!name) {
    throw new Error("A controller needs a name for pineapple.controller.define()");
  }

  AppController = typeof pineapple.controllers.Application === 'function' ? 
                          pineapple.controllers.Application : function(){};
  
  if (name !== 'Application') {
    Controller.prototype = pineapple.utils.object.merge(Controller.prototype, new AppController());
  }

  Controller = pineapple.utils.inherit(pineapple.controller.Controller, Controller);

  if (this._ns) {
    ns = this._ns;
    delete this._ns;
    pineapple.utils.setValueFromPath(ns + '.' + name, Controller, pineapple.controllers);
    return Controller;
  }
  else {
    return pineapple.controllers[name] = Controller;
  }
};

module.exports.ns = function(ns) {
  this._ns = ns;

  return this;
}