require('colors');

global.IS_EXECUTED_FROM_BIN =  (!!~module.parent.filename.indexOf('bin/pineapple.js'))? true : false;

var path        = require('path')
  , mongoose    = require('mongoose')
  , Repl        = require('repl-console')
  , pkg         = require('../../package')
  , events      = require('events')

/**
  * @namespace pineapple
  *
  * @note We need this global and exported as a module.
  *       This will be the top level namespace for the application
  *       stack. Everything related to the application should be
  *       attached to this namespace.
  */
module.exports = global.pineapple = function Pineapple(){};
// inherit the EventEmitter
pineapple.prototype = new events.EventEmitter();

/**
  * Exits with a code 0 and with an optional message
  *
  * @public
  * @function pineapple#exit
  * @param {String} msg - An optional message to output before exiting
  */
pineapple.prototype.die = pineapple.prototype.exit = function(msg) {
  // log a message if provided
  if (msg) this.logger.info(msg);
  // exit
  process.exit();
};

/**
  * Exits with a code 1 and with an optional message
  *
  * @public
  * @function pineapple#fatal
  * @param {String} msg - An optional fatal message to output before exiting
  */
pineapple.prototype.fatal = function(msg) {
  // log a fatal message if provided
  if (msg) this.logger.fatal(msg);
  // exit code 1
  process.exit(1);
}

/**
  * Registers a new global namespace object. Inherits the pineapple namespace object
  *
  * @public
  * @function pineapple#register
  * @param {String} name - The name of the namespace to register
  * @param {Object} object - An optional object to bind to the namespace
  * @return - The newly registered global object 
  */
pineapple.prototype.register = function(name, object) {
  // if it already exists then throw an error
  if (pineapple[name] || global[name]) throw new Error("Namespace "+ name +" already exists");
  // attach to the global namespace and to pineapples namespace
  global[name] = pineapple[name] = pineapple.utils.object.merge(new events.EventEmitter(), object || {});
  // create a logger and attach it to the newly registered namespace
  pineapple[name].logger = new pineapple.logger.Logger(name);
  // return the newly registered namespace
  return pineapple[name];
};

pineapple.prototype.isRegistered = function(name) {
  return (typeof pineapple[name] === 'object' && typeof global[name] === 'object')? true : false;
};

/**
  * Extends the namespace with a provided object
  *
  * @public
  * @function pineapple#extend
  * @param {Object} object - An object to merge and extend the pineapple namespace
  */
pineapple.prototype.extend = function(object) {
  return pineapple.utils.object.merge(pineapple.utils.object.merge({}, pineapple), object);
}

/**
  * Binds a local and pineapple lib module if found
  *
  * @public
  * @function pineapple#bindLib
  * @param {String} lib - The name of the lib module
  * @return {Object} - Returns a reference to this
  */
pineapple.prototype.bindLib = function(lib) {
  pineapple.bindAppModule({ns: lib, localPath: '../../lib/' + lib, appPath: '/lib/' + lib});
  return this;
}

/**
  * Binds an app module
  *
  * @public
  * @function pineapple#bindAppModule
  * @param {Object} options - A map of options expecting 'ns', 'localPath', and 'appPath' properties
  * @return {Object} - Returns a reference to this
  */
pineapple.prototype.bindAppModule = function(options) {
  var property, localPath, appPath

  ns        = options.ns;
  localPath = options.localPath;
  appPath   = options.appPath;
  // if we found it in the app path, then require both and merge the app module 
  // into the local module
  if (utils.appStat(appPath) && IS_EXECUTED_FROM_BIN) this[ns] = utils.object.merge(require(localPath), utils.object.merge(this[ns], utils.appRequire(appPath)));
  // if no app module was found, then just require the local module
  else this[ns] = utils.object.merge(this[ns], require(localPath));
  return this;
}

// Create an instance of the pineapple constructor
pineapple = new pineapple();
// attach async so it is globally available
pineapple.async = require('async');
// make mongoose globably available
global.mongoose         = mongoose
// resolve and set the absolute path to the pineapple working directory
global.PINEAPPLE_PATH   = path.resolve(__dirname, '..', '..');
// set the current app path
global.APP_PATH         = process.env.PWD;
// set the default app name
global.DEFAULT_APP_NAME = "pineapple"

var utils, Loader, model, server, inherit, controllers, ns
  , models, pfile, config, envType, envConfig, appConfig
  , loader

// grab the utilities
utils           = require('../utilities');
// attach the app path
utils.APP_PATH  = APP_PATH;
// attach the pineapple path
utils.PATH      = PINEAPPLE_PATH;

// Attach global loader
pineapple.loader = loader = new utils.Loader(__dirname)

// bootstrap environment config
if (utils.appStat('/config/environment.json') || utils.appStat('/config/environment.js')) {
  config = utils.appRequire('/config/environment')
}
else {
  config = require('../../config/environment')
}

// set the environment type constant
global.EVN_TYPE = envType = config.env

// bootstrap the defined environment confi
if (utils.appStat('/config/' + envType + '.json')) {
  envConfig = utils.appRequire('/config/' + envType)
}
else {
  envConfig = require('../../config/' + envType)
}

// bootstrap the application confi
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

// Expose app package information
try { pineapple['package'] = utils.appRequire('/package.json', false); }
// Expose default package information
catch (e) { pineapple['package'] = pkg }

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

// bootstrap all application objects
if (utils.appStat('/objects')) {
  pineapple.objects = utils.object.merge(pineapple.objects, utils.appRequire('/objects'));
}


// Set the is{environment} flag
// isProduction|isDevelopment|isFoo
pineapple['is' + envType.toProperCase()] = true;

// bind all native and application libs
['logger', 'model', 'server', 'router', 'database', 'controller', 'view'].map(pineapple.bindLib);

// create and attach a console
pineapple.console         = new Repl(pineapple.app.name, 'local');
// attach a logger to the console object
pineapple.console.logger  = new pineapple.logger.Logger('console', pineapple.ABSOLUTE_PATH, '/log/console');

// Attach router to pineapple.app
pineapple.bindAppModule.call(pineapple.app, {ns: 'router', localPath: '../../config/routes.js', appPath: '/config/routes.js'});

// set the Application controller first if it exists
if (utils.appStat('/app/controllers/Application.js')) {
  pineapple.controllers = {Application: utils.appRequire('/app/controllers/Application.js')};
}
// Attach app controllers
pineapple.bindAppModule({ns: 'controllers', localPath: '../../app/controllers', appPath: '/app/controllers'});

// Attach app models
pineapple.bindAppModule({ns: 'models', localPath: '../../app/models', appPath: '/app/models'});

// Attach pineapple logger
pineapple.logger = pineapple.utils.object.merge(pineapple.logger, new pineapple.logger.Logger('pineapple', pineapple.ABSOLUTE_PATH));

// Attach app logger
pineapple.app.logger  = new pineapple.logger.Logger('application', pineapple.ABSOLUTE_PATH + '/log/app');

// Attach extensions
pineapple.bindAppModule({ns: 'extensions', localPath: '../../extensions', appPath: '/extensions'});
// attach a logger to the extensions object
pineapple.extensions.logger = new pineapple.logger.Logger('extensions');

// set the extensions config array
pineapple.extensions.config = [];
// set the extensions active array
pineapple.extensions.active = [];
for (var extension in pineapple.extensions) {
  // do we have config for the extension?
  if (pineapple.config && pineapple.config.extensions && pineapple.config.extensions[extension]) {
    // Create a new Extension instance and attach to the extensions object
    pineapple.extensions[extension] = new pineapple.Extension(pineapple.extensions[extension], pineapple.config.extensions[extension]);
    // push the extension to the config array
    pineapple.extensions.config.push(pineapple.extensions[extension]);
    // push the extensions to the active extensions array
    pineapple.extensions.active.push(extension);
  }
}

// rebind and and create all extensions
pineapple.extensions = pineapple.utils.object.merge(pineapple.extensions, pineapple.Extension.create(pineapple.extensions.config, function(err, extensions){
  // if an error occured log it with the extensions logger
  if (err) return pineapple.extensions.logger.error(err);
  // remerge back to the namespace
  pineapple.extensions = pineapple.utils.object.merge(pineapple.extensions, extensions);
  if (IS_EXECUTED_FROM_BIN) {
    // let the user know what is going on
    pineapple.extensions.logger.info((''+ pineapple.extensions.active.length).yellow + " extension(s) bootstrapped.");
  }
  // iterate over each active extension and rebind
  pineapple.extensions.active.map(function(extension){
    // if already bound, let the user know of the conflict and continue
    if (pineapple[extension]) 
      return pineapple.extensions.logger.error("Extension " + extension + " namespace conflict @pineapple."+ extension);
    // attach
    pineapple[extension] = pineapple.extensions.getService(extension);
    // set up a logger
    pineapple[extension].logger = new pineapple.logger.Logger(extension);
    if (IS_EXECUTED_FROM_BIN) {
      // let the user know the extension is ready
      pineapple.extensions.logger.info("Extension " + extension.blue + " ready @pineapple."+extension);
    }
  });

  // all extensions are ready to go
  pineapple.emit('extensions:ready');
}));

// if server config exists and the adapter was provided
// create the api namespace
if (config.server && config.server.adapter) {
  // Construct API Object
  pineapple.api = new pineapple.server.Server("PineappleAPIServer", config.server.adapter, pineapple.server.adapters.get(config.server.adapter));
  // create a default client
  pineapple.client = new pineapple.server.Client('controller', pineapple.config.server.adapter, {
    type    : 'json',
    client  : {
      url       : '',
      version   : '*',
      retry     : false,
      name      : pineapple.app.name
    }
  });
}

// if database confi exists and the adapter was provided
if (config.database && config.database.adapter) {
  // Construct the Database Object
  pineapple.db = new pineapple.database.Database("PineappleDatabase", config.database.adapter, pineapple.database.adapters.get(config.database.adapter));
}

// when all the extensions are ready, we are ready
pineapple.on('extensions:ready', function() {
  // Did we find a Paplfile?
  if (pineapple.utils.stat(pfile = APP_PATH  + '/Paplfile')) {
    if (IS_EXECUTED_FROM_BIN) {
      pineapple.app.logger.info("Boostrapping Paplfile: " + pfile.green);
    }
    // require the Paplfile
    require(pfile);
  }
});

pineapple.pineapple = pineapple;