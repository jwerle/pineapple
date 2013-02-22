#!/usr/bin/env node
require('colors');

var opts, cmds, cmd, args, match, bin, binCommands, binNamespace, call
  , preservedArgs, exex, pwd, i, func, binOpts

var parseopts = require('../deps/parseopts')

pwd           = process
exec          = require('child_process').exec;
binNamespace  = "pineapple";
binCommands   = {};
opts          = [
  {full : 'port',         abbr: 'p'},
  {full : 'env',          abbr: 'e'},
  {full : 'version',      abbr: 'v'},
  {full : 'extensions',   abbr: 'exts'},
  {full : 'fast-boot',    abbr: 'fb', args:false},
];

global.ARGS   = args = process.argv.slice(2);
preservedArgs = [].concat(args).slice(1)

require('../lib/pineapple');

bin = pineapple.loader.load(__dirname + '/cmds', false, ['pineapple']).cmds;

if (pineapple.utils.appStat('/bin/cmds')) {
  bin = pineapple.utils.object.merge(bin, pineapple.loader.load(pineapple.APP_PATH + '/bin/cmds', false).cmds);
}

// Load default bin files
for (cmd in bin) {
  if (bin[cmd].needs && bin[cmd].needs !== pineapple.TYPE) {
    continue;
  }

  binOpts = {
    full : cmd,
    abbr : cmd
  };

  if (typeof bin[cmd].opts === 'object' && bin[cmd].opts.length) {
    for (i = 0; i < bin[cmd].opts.length; i++) {
      if (typeof bin[cmd].opts[i] === 'object') {
        binOpts = pineapple.utils.object.merge(binOpts, bin[cmd].opts[i]);
      }
    }
  }

  opts.push(binOpts);

  if (bin[cmd].opts && bin[cmd].opts.length) {
    opts = opts.concat(bin[cmd].opts);
  }

  binCommands[cmd] = bin[cmd];
}

global.parser = new parseopts.Parser(opts); // for pineapple bootstrap
try {
  parser.parse(args);
  pineapple.parser = parser;
}
catch (e) {
  pineapple.logger.error(e.message);
  pineapple.die();
}
cmds = parser.cmds;
opts = parser.opts;

if (opts.version) {
  pineapple.logger.info(pineapple.VERSION);
  pineapple.die();
}

if (opts.env) {
  global.ENV_TYPE = opts.env;
  pineapple['is' + ENV_TYPE.toProperCase()] = true;
  pineapple.logger.info("Environment set as => " + ENV_TYPE.blue);
  pineapple.logger.info("Check environment type with pineapple.is"+ ENV_TYPE.toProperCase());

  pineapple.config   = pineapple.utils.object.merge(pineapple.utils.appRequire('/config/environment'), pineapple.utils.appRequire('/config/' + opts.env));
}

if (opts.extensions) {
  opts.extensions = opts.extensions.split(',')
  pineapple.on('extensions:ready', function(){
    opts.extensions.map(function(extension){
      if (pineapple[extension] instanceof Object && pineapple[extension].init instanceof Function) {
        pineapple.extensions.logger.info("Initializing extension "+ extension.cyan)
        pineapple[extension].init();
      }
    });
  });
}

// Find any aliases
for (cmd in binCommands) {
  if (typeof binCommands[cmd].alias !== 'undefined') {
    switch (typeof binCommands[cmd].alias) {
      case 'string' :
        if (binCommands[cmd].alias === cmds[0]) {
          cmds[0] = cmd;
        }
      break;

      case 'object' :
        if (binCommands[cmd].alias.length) {
          for (i = 0; i < binCommands[cmd].alias.length; i++) {
            if (binCommands[cmd].alias[i] === cmds[0]) {
              cmds[0] = cmd;
              break;
            }
          }
        }
      break;
    }
  }
}

if (! cmds.length || ! (cmds[0] in binCommands)) {
  cmds[0] = 'usage';
}


cmd   = cmds.shift();
args  = cmds.length? cmds : preservedArgs;
bin   = pineapple.bin = binCommands;
pineapple.namespace   = binNamespace;


if (typeof bin[cmd] === 'object' && typeof (call = bin[cmd].call) === 'function') {
  if (bin[cmd].deps && bin[cmd].deps.length) {
    for (i = 0; i < bin[cmd].deps.length; i++) {
      if (typeof bin[bin[cmd].deps[i]] === 'object' &&
          typeof (func = bin[bin[cmd].deps[i]].call) === 'function') {
        func.apply(pineapple, args);
      }
    }
  }

  call.apply(pineapple, args);
}
else {
  pineapple.logger.error("Invalid command");
}