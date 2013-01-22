require('colors');

var path        = require('path')
  , mongoose    = require('mongoose')
  , Repl        = require('repl-console')
  , pkg         = require('../../package')
  , events      = require('events')

/**
  @namespace pineapple

  We need this global and exported as a module.
  This will be the top level namespace for the application
  stack. Everything related to the application should be
  attached to this namespace.
**/
module.exports = global.pineapple = function pineapple(){};
pineapple.prototype = new events.EventEmitter();

pineapple.prototype.die = pineapple.prototype.exit = function(msg) {
  if (msg) {
    this.logger.info(msg);
  }

  process.exit();
};

pineapple.prototype.fatal = function(msg) {
  if (msg) {
    this.logger.fatal(msg);
  }

  process.exit(1);
}

pineapple.prototype.register = function(name, object) {
  pineapple.logger.info('Registering new application namespace ' + name);
  global[name] = pineapple[name] = object;
  pineapple[name].logger = new pineapple.logger.Logger(name);
  pineapple[name].logger.success('I was just registered!');

  return pineapple[name];
}

pineapple.prototype.extend = function(object) {
  return pineapple.utils.object.merge(pineapple.utils.object.merge({}, pineapple), object);
}

pineapple.prototype.bindLib = function(lib) {
  pineapple.bindAppModule({ns: lib, localPath: '../../lib/' + lib, appPath: '/lib/' + lib});

  return this;
}

pineapple.prototype.bindAppModule = function(args) {
  var property, localPath, appPath

  ns        = args.ns;
  localPath = args.localPath;
  appPath   = args.appPath;

  if (utils.appStat(appPath)) {
    this[ns] = utils.object.merge(require(localPath), utils.object.merge(this[ns], utils.appRequire(appPath)));
  }
  else {
    this[ns] = require(localPath);
  }

  return this;
}

pineapple.prototype.use = function() {

}

pineapple = new pineapple();

global.mongoose         = mongoose
global.PINEAPPLE_PATH   = path.resolve(__dirname, '..', '..');
global.APP_PATH         = process.env.PWD;
global.DEFAULT_APP_NAME = "pineapple"

var utils, Loader, model, server, inherit, controllers, ns
  , models, pfile, config, envType, envConfig, appConfig
  , loader

utils                 = require('../utilities')
global.APP_PATH       = utils.APP_PATH  = APP_PATH;
global.PINEAPPLE_PATH = utils.PATH      = PINEAPPLE_PATH;

// Attach global loader
pineapple.loader = loader = new utils.Loader(__dirname)

if (utils.appStat('/config/environment.json') || utils.appStat('/config/environment.js')) {
  config = utils.appRequire('/config/environment')
}
else {
  config = require('../../config/environment')
}

global.EVN_TYPE = envType = config.env

if (utils.appStat('/config/' + envType + '.json')) {
  envConfig = utils.appRequire('/config/' + envType)
}
else {
  envConfig = require('../../config/' + envType)
}

if (utils.appStat('/config/application.json') || utils.appStat('/config/application.js')) {
  appConfig = utils.appRequire('/config/application')
}
else {
  appConfig = require('../../config/application')
}

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

// attach version
pineapple.VERSION = pkg.version

// Bind utilities
pineapple.utils = utils;

// Merge in config
pineapple.config      = utils.object.merge({}, utils.object.merge(config, envConfig));
pineapple.config.app  = appConfig;
pineapple.TYPE        = pineapple.config.app.type || "server";

// Set default appname
pineapple._defaultAppName = DEFAULT_APP_NAME;

// Set App name
pineapple.app      = {};
pineapple.app.name = pineapple.config.app.name || pineapple._defaultAppName;
process.title      = pineapple.app.name;

pineapple = utils.object.merge(pineapple, loader.load(__dirname).pineapple);

pineapple.models = {};
pineapple.controllers = {};

// Attach default objects
pineapple.objects = require('../../objects');

if (utils.appStat('/objects')) {
  pineapple.objects = utils.object.merge(pineapple.objects, utils.appRequire('/objects'));
}

// Libs
[
  'logger', 'model', 'server', 'router', 'database', 'controller', 'view'
].map(pineapple.bindLib);

pineapple.console         = new Repl(pineapple.app.name, 'local');
pineapple.console.logger  = new pineapple.logger.Logger('console', pineapple.ABSOLUTE_PATH, '/log/console');

// Attach router to pineapple.app
pineapple.bindAppModule.call(pineapple.app, {ns: 'router', localPath: '../../config/routes.js', appPath: '/config/routes.js'});

// Attach app controllers
pineapple.bindAppModule({ns: 'controllers', localPath: '../../app/controllers', appPath: '/app/controllers'});

// Attach app models
pineapple.bindAppModule({ns: 'models', localPath: '../../app/models', appPath: '/app/models'});

// Attach pineapple logger
pineapple.logger = pineapple.utils.object.merge(pineapple.logger, new pineapple.logger.Logger('pineapple', pineapple.ABSOLUTE_PATH));

// Attach app logger
pineapple.app.logger  = new pineapple.logger.Logger('app', pineapple.ABSOLUTE_PATH + '/log/app');

// Attach extensions
pineapple.bindAppModule({ns: 'extensions', localPath: '../../extensions', appPath: '/extensions'});

// Set the is{environment} flag
// isProduction|isDevelopment|isFoo
pineapple['is' + envType.toProperCase()] = true;

pineapple.extensions.config = [];
pineapple.extensions.active = [];
for (var extension in pineapple.extensions) {
  if (pineapple.config && pineapple.config.extensions && pineapple.config.extensions[extension]) {
    pineapple.extensions[extension] = new pineapple.Extension(pineapple.extensions[extension], pineapple.config.extensions[extension]);
    pineapple.extensions.config.push(pineapple.extensions[extension]);
    pineapple.extensions.active.push(extension);
  }
}

pineapple.extensions.logger = new pineapple.logger.Logger('extensions');
pineapple.extensions = pineapple.utils.object.merge(pineapple.extensions, pineapple.Extension.create(pineapple.extensions.config, function(err, extensions){
  if (err) {
    return pineapple.extensions.error(err);
  }

  pineapple.extensions = pineapple.utils.object.merge(pineapple.extensions, extensions);
  pineapple.extensions.logger.info((''+ pineapple.extensions.active.length).yellow + " extension(s) bootstrapped.");
  pineapple.extensions.active.map(function(extension){
    if (!pineapple[extension]) {
      pineapple[extension] = pineapple.extensions.getService(extension);
      pineapple[extension].logger = new pineapple.logger.Logger(extension);
      pineapple.extensions.logger.info("Extension " + extension.blue + " ready @pineapple."+extension);
    }
    else {
      pineapple.extensions.logger.error("Extension " + extension + " namespace conflict @pineapple."+ extension);
    }
  });

  pineapple.emit('extensions:ready');
}));

if (config.server && config.server.adapter) {
  // Construct API Object
  pineapple.api         = new pineapple.server.Server("PineappleAPIServer", config.server.adapter, pineapple.server.adapters.get(config.server.adapter));
}

if (config.database && config.database.adapter) {
  // Construct the Database Object
  pineapple.db          = new pineapple.database.Database("PineappleDatabase", config.database.adapter, pineapple.database.adapters.get(config.database.adapter));
}

pineapple.on('extensions:ready', function() {
  // Find .pineapple file
  if (pineapple.utils.stat(pfile = APP_PATH  + '/Paplfile')) {
    pineapple.app.logger.info("Found the Paplfile file. => " + pfile);
    require(pfile);
  }
});

pineapple.pineapple = pineapple;