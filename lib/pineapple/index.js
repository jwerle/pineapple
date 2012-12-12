require('colors');

var path        = require('path')
  , mongoose    = require('mongoose')

/**
  @namespace pineapple
**/
global.pineapple = {};

global.mongoose         = mongoose
global.PINEAPPLE_PATH   = path.resolve(__dirname, '..', '..');
global.APP_PATH         = process.env.PWD;
global.DEFAULT_APP_NAME = "pineapple"

var utils, Loader, model, server, inherit, controllers, ns
  , models, pfile, config, envType, envConfig, appConfig
  , loader

utils           = require('../utilities')
utils.APP_PATH  = APP_PATH;
utils.PATH      = PINEAPPLE_PATH;

loader = new utils.Loader(__dirname)

if (utils.appStat('/config/environment.json')) {
  config = utils.appRequire('/config/environment')
}
else {
  config = require('../../config/environment')
}

envType = config.env

if (utils.appStat('/config/' + envType + '.json')) {
  envConfig = utils.appRequire('/config/' + envType)
}
else {
  envConfig = require('../../config/' + envType)
}

if (utils.appStat('/config/application.json')) {
  appConfig = utils.appRequire('/config/application')
}
else {
  appConfig = require('../../config/application')
}

/**
  We need this global and exported as a module.
  This will be the top level namespace for the application
  stack. Everything related to the application should be
  attached to this namespace.
**/

// Attach pineapple globally
global.pineapple = module.exports = utils.object.merge(pineapple, loader.load(__dirname).pineapple)

// Set some constants
pineapple.APP_PATH      = APP_PATH;
pineapple.PATH          = PINEAPPLE_PATH;
pineapple.ABSOLUTE_PATH = (APP_PATH && APP_PATH !== PINEAPPLE_PATH? APP_PATH : PATH);

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
pineapple.loader   = loader;

// Merge in config
pineapple.config      = utils.object.merge(config, envConfig);
pineapple.config.app  = appConfig;

// Set default appname
pineapple._defaultAppName = DEFAULT_APP_NAME;

// Set App name
pineapple.app      = {};
pineapple.app.name = pineapple.config.app.name || pineapple._defaultAppName;
process.title      = pineapple.app.name;

// Attach default objects
pineapple.objects = require('../../objects');

pineapple.bindAppModule = function(args) {
  var property, localPath, appPath

  property  = args.property;
  localPath = args.localPath;
  appPath   = args.appPath;

  if (utils.appStat(appPath)) {
    this[property] = utils.object.merge(this[property], utils.appRequire(appPath));
  }
  else {
    this[property] = require(localPath);
  }

  return this;
}

if (utils.appStat('/objects')) {
  pineapple.objects = utils.object.merge(pineapple.objects, utils.appRequire('/objects'));
}

// Libs
[
  'logger', 'model', 'server', 'router', 'database', 'controller', 'daemon', 'view'
].map(function(lib){
  pineapple.bindAppModule({property: lib, localPath: '../../lib/' + lib, appPath: '/lib/' + lib});
});

// Attach routes
pineapple.bindAppModule({property: 'routes', localPath: '../../config/routes.js', appPath: '/config/routes.js'});

// Attach app controllers
pineapple.bindAppModule({property: 'controllers', localPath: '../../app/controllers', appPath: '/app/controllers'});

// Attach app models
pineapple.bindAppModule({property: 'models', localPath: '../../app/models', appPath: '/app/models'});

// Attach pineapple logger
pineapple.logger = pineapple.utils.object.merge(pineapple.logger, new pineapple.logger.Logger('[pineapple]', pineapple.ABSOLUTE_PATH, '/log/sys'));

// Attach app logger
pineapple.app.logger  = new pineapple.logger.Logger('[app-log]', pineapple.ABSOLUTE_PATH + '/log/app');

// Construct API Object
pineapple.api         = new pineapple.server.Server("PineappleAPIServer", config.server.adapter, pineapple.server.adapters.get(config.server.adapter));
pineapple.api.logger  = new pineapple.logger.Logger('[api-log]', pineapple.ABSOLUTE_PATH + '/log/api');

// Construct the Database Object
pineapple.db          = new pineapple.database.Database("PineappleDatabase", config.database.adapter, pineapple.database.adapters.get(config.database.adapter));
pineapple.db.logger   = new pineapple.logger.Logger('[db-log]', pineapple.ABSOLUTE_PATH + '/log/db');

// Find .pineapple file
if (pineapple.utils.stat(pfile = APP_PATH  + '/.pineapple')) {
  pineapple.app.logger.info("Found the .pineapple file. => " + pfile);
  require(pfile);
}

pineapple.pineapple = pineapple;

module.exports = pineapple;