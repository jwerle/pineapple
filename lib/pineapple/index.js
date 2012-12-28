require('colors');

var path        = require('path')
  , mongoose    = require('mongoose')
  , Repl        = require('repl-console')
  , pkg         = require('../../package')

/**
  @namespace pineapple
**/
global.pineapple = {};

pineapple.die = function(msg) {
  if (msg) {
    this.logger.info(msg);
  }

  process.exit();
};

pineapple.fatal = function(msg) {
  if (msg) {
    this.logger.fatal(msg);
  }

  process.exit(1);
}

pineapple.register = function(name, object) {
  pineapple.logger.info('Registering new application namespace ' + name);
  global[name] = pineapple[name] = object;

  pineapple[name].logger = new pineapple.logger.Logger(name);

  pineapple[name].logger.success('I was just registered!');

  return pineapple[name];
}

pineapple.extend = function(object) {
  return pineapple.utils.object.merge(pineapple, object);
}

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

// Attach global loader
pineapple.loader = loader = new utils.Loader(__dirname)

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
pineapple = module.exports = utils.object.merge(pineapple, loader.load(__dirname).pineapple)

// Set the is{environment} flag
// isProduction|isDevelopment|isFoo
pineapple['is' + envType.toProperCase()] = true;

// Set some constants
pineapple.APP_PATH      = APP_PATH;
pineapple.PATH          = PINEAPPLE_PATH;
pineapple.ABSOLUTE_PATH = (APP_PATH && APP_PATH !== PINEAPPLE_PATH? APP_PATH : PINEAPPLE_PATH);

try {
  // Expose app package information
  pineapple['package'] = utils.appRequire('/package.json', false);
}
catch (e) {
  // Expose default package information
  pineapple['package'] = pkg
}

// Attach passport
pineapple.passport = require('passport');

pineapple.VERSION = pkg.version

// Bind utilities
pineapple.utils    = utils;

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

pineapple.bindLib = function(lib) {
  pineapple.bindAppModule({ns: lib, localPath: '../../lib/' + lib, appPath: '/lib/' + lib});

  return this;
}

pineapple.bindAppModule = function(args) {
  var property, localPath, appPath

  ns  = args.ns;
  localPath = args.localPath;
  appPath   = args.appPath;

  if (utils.appStat(appPath)) {
    this[ns] = utils.object.merge(this[ns], utils.appRequire(appPath));
  }
  else {
    this[ns] = require(localPath);
  }

  return this;
}

if (utils.appStat('/objects')) {
  pineapple.objects = utils.object.merge(pineapple.objects, utils.appRequire('/objects'));
}

// Libs
[
  'logger', 'model', 'server', 'router', 'database', 'controller', 'view'
].map(pineapple.bindLib);

pineapple.console         = new Repl(pineapple.app.name, 'local');
pineapple.console.logger  = new pineapple.logger.Logger('console', pineapple.ABSOLUTE_PATH, '/log/console');

// Attach routes
pineapple.bindAppModule({ns: 'routes', localPath: '../../config/routes.js', appPath: '/config/routes.js'});

// Attach app controllers
pineapple.bindAppModule({ns: 'controllers', localPath: '../../app/controllers', appPath: '/app/controllers'});

// Attach app models
pineapple.bindAppModule({ns: 'models', localPath: '../../app/models', appPath: '/app/models'});
pineapple.models.get = function(name, prevent_creation) {
  var Model, model

  Model = pineapple.utils.valueFromPath(name, pineapple.models);
  
  if (! Model) {
    return false;
  }

  Model = pineapple.utils.inherit(pineapple.model.Model, Model)

  model = new Model(pineapple.models);

  return prevent_creation? model : model.create();
}

pineapple.models.getSchema = function(name) {
  return this.get(name).schema;
}

// Attach pineapple logger
pineapple.logger = pineapple.utils.object.merge(pineapple.logger, new pineapple.logger.Logger('pineapple', pineapple.ABSOLUTE_PATH, '/log/sys'));

// Attach app logger
pineapple.app.logger  = new pineapple.logger.Logger('app', pineapple.ABSOLUTE_PATH + '/log/app');

if (config.server && config.server.adapter) {
  // Construct API Object
  pineapple.api         = new pineapple.server.Server("PineappleAPIServer", config.server.adapter, pineapple.server.adapters.get(config.server.adapter));
}

if (config.database && config.database.adapter) {
  // Construct the Database Object
  pineapple.db          = new pineapple.database.Database("PineappleDatabase", config.database.adapter, pineapple.database.adapters.get(config.database.adapter));
}

// Find .pineapple file
if (pineapple.utils.stat(pfile = APP_PATH  + '/Paplfile')) {
  pineapple.app.logger.info("Found the Paplfile file. => " + pfile);
  require(pfile);
}

pineapple.pineapple = pineapple;

module.exports = pineapple;