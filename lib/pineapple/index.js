var path = require('path')
  , mongoose    = require('mongoose')

global.mongoose   = mongoose
global.APP_PATH   = path.resolve(__dirname, '..', '..');

var  utils        = require('../utilities')
  , config        = require('../../config/environment')
  , envType       = config.env
  , envConfig     = require('../../config/' + envType)

var utils, Loader, model, server, inherit, controllers, ns
  , models

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

// Expose package information
pineapple['package'] = require('../../package');

// Bind utilities
pineapple.utils    = utils;

// Attach global loader
pineapple.loader   = new utils.Loader(__dirname);

// Merge in config
pineapple.config   = utils.object.merge(config, envConfig);

// Attach objects
pineapple.objects = require('../../objects')

// Attach libs
pineapple.model      = require('../model');
pineapple.server     = require('../server');
pineapple.router     = require('../router');
pineapple.database   = require('../database');
pineapple.controller = require('../controller');

// Attach routes
pineapple.routes     = require('../../config/routes');

// Attach controllers
pineapple.controllers  = require('../../app/controllers');

// Attach models
pineapple.models       = require('../../app/models');

// Construct API Object
pineapple.api = new pineapple.server.Server("MoovAtomAPIServer", config.server.adapter, pineapple.server.adapters.get(config.server.adapter));

// Construct the Database Object
pineapple.db = new pineapple.database.Database("MoovAtomDatabase", config.database.adapter, pineapple.database.adapters.get(config.database.adapter));