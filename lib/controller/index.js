module.exports = pineapple.loader.load(__dirname).controller;
module.exports.get = function(controller) {
  var AppController
    , Controller
    , isController

  AppController = typeof pineapple.controllers.Application === 'function' ? 
                          pineapple.controllers.Application : function(){};

  if (typeof controller === 'string') {
    controller = pineapple.utils.valueFromPath(controller, pineapple.controllers);
    isController = true;
  }

  if (typeof controller === 'function') {
    Controller = pineapple.utils.inherit(pineapple.controller.Controller, controller);

    if (Controller.name !== 'Application') {
      Controller.prototype = pineapple.utils.object.merge(Controller.prototype, new AppController);
    }
  }

  return {isController : isController, Controller : Controller};
};