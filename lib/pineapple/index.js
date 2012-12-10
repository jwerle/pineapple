var path        = require('path')
  , mongoose    = require('mongoose')

global.mongoose         = mongoose
global.PINEAPPLE_PATH   = path.resolve(__dirname, '..', '..');
global.APP_PATH         = process.env.PWD;
global.DEFAULT_APP_NAME = "pineapple"

var utils, Loader, model, server, inherit, controllers, ns
  , models, pfile, config, envType, envConfig, appConfig

utils           = require('../utilities')
utils.APP_PATH  = APP_PATH;
utils.PATH      = PINEAPPLE_PATH;

if (utils.appStat('/config/environment')) {
  config          = utils.appRequire('/config/environment')
}
else {
  config = require('../../config/environment')
}

envType         = config.env

if (utils.appStat('/config/' + envType)) {
  envConfig       = utils.appRequire('/config/' + envType)
}
else {
  envConfig = require('../../config/' + envType)
}

if (utils.appStat('/config/application')) {
  appConfig       = utils.appRequire('/config/application')
}
else {
  appConfig = require('../../config/application')
}

/**
  @namespace pineapple
**/
var pineapple;

/**
  We need this global and exported as a module.
  This will be the top level namespace for the application
  stack. Everything related to the application should be
  attached to this namespace.
**/

// Attach pineapple globally
global.pineapple = module.exports = pineapple = {};

pineapple.APP_PATH = APP_PATH;
pineapple.PATH     = PINEAPPLE_PATH;

try {
  // Expose app package information
  pineapple['package'] = utils.appRequire('/package.json');
}
catch (e) {
  // Expose default package information
  pineapple['package'] = require('../../package');
}

// Bind utilities
pineapple.utils    = utils;

// Attach global loader
pineapple.loader   = new utils.Loader(__dirname);

// Merge in config
pineapple.config      = utils.object.merge(config, envConfig);
pineapple.config.app  = appConfig;

// Set default appname
pineapple._defaultAppName = DEFAULT_APP_NAME;

// Set App name
pineapple.appname  = pineapple.config.app.name || pineapple._defaultAppName;
process.title      = pineapple.appname;

// Attach default objects
pineapple.objects = require('../../objects');

if (utils.appStat('/objects')) {
  pineapple.objects = utils.object.merge(pineapple.objects, utils.appRequire('/objects'));
}

// Attach default model lib
pineapple.model = require('../model');

// Attach app model lib
if (utils.appStat('/lib/model')) {
  pineapple.model = utils.object.merge(pineapple.model, utils.appRequire('/lib/model'));
}

// Attach default server lib
pineapple.server = require('../server');

// Attach app server lib
if (utils.appStat('/lib/server')) {
  pineapple.server = utils.object.merge(pineapple.server, utils.appRequire('/lib/server'));
}

// Attach default router lib
pineapple.router     = require('../router');

// Attach app router lib
if (utils.appStat('/lib/router')) {
  pineapple.router = utils.object.merge(pineapple.router, utils.appRequire('/lib/router'));
}

// Attach default database lib
pineapple.database   = require('../database');

// Attach app database lib
if (utils.appStat('/lib/database')) {
  pineapple.database = utils.object.merge(pineapple.database, utils.appRequire('/lib/database'));
}

// Attach default controller lib
pineapple.controller = require('../controller');

// Attach app controller lib
if (utils.appStat('/lib/controller')) {
  pineapple.controller = utils.object.merge(pineapple.controller, utils.appRequire('/lib/controller'));
}

// Attach default routes
pineapple.routes = require('../../config/routes');

// Attach app routes
if (utils.appStat('/config/routes.js')) {
  pineapple.routes = utils.object.merge(pineapple.routes, utils.appRequire('/config/routes'));
}

// Attach default app controllers
pineapple.controllers = require('../../app/controllers');

// Attach app controllers
if (utils.appStat('/app/controllers')) {
  // Attach controllers
  pineapple.controllers   = utils.object.merge(pineapple.controllers, utils.appRequire('/app/controllers'));
}

// Attach default app controllers
pineapple.controllers = require('../../app/controllers');

// Attach app models
if (utils.appStat('/app/models')) {
  // Attach models
  pineapple.models   = utils.object.merge(pineapple.models, utils.appRequire('/app/models'));
}

// Construct API Object
pineapple.api = new pineapple.server.Server("PineappleAPIServer", config.server.adapter, pineapple.server.adapters.get(config.server.adapter));

// Construct the Database Object
pineapple.db = new pineapple.database.Database("PineappleDatabase", config.database.adapter, pineapple.database.adapters.get(config.database.adapter));

// Find .pineapple file
if (pineapple.utils.stat(pfile = APP_PATH + '/.pineapple')) {
  require(pfile);
}

module.exports = pineapple;