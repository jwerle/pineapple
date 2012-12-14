#!/usr/bin/env node
require('../lib/pineapple');
require('colors');

var opts, cmds, cmd, args, match, bin, binCommands, binNamespace, call
  , preservedArgs, exex, pwd, i, func

var parseopts = require('../deps/parseopts/lib/parseopts')

pwd           = process
exec          = require('child_process').exec;
binNamespace  = "pineapple";
binCommands   = {};
opts          = [
  {full : 'port',     abbr: 'p'},
  {full : 'env',      abbr: 'e'},
  {full : 'version',  abbr: 'v'}
];

bin           = pineapple.loader.load(__dirname, false, ['pineapple']).bin;

// Load default bin files
for (cmd in bin) {
  if (match = cmd.match(/^pineapple-([a-z]+)/)) {
    opts.push({
      full : match[1],
      abbr : match[1]
    });

    if (bin[cmd].opts && bin[cmd].opts.length) {
      opts = opts.concat(bin[cmd].opts);
    }

    binCommands[match[1]] = bin[cmd];
  }
}

// load app bin files @TODO expose app bin files for overloading
//bin           = pineapple.loader.load(__dirname, false, ['pineapple']).bin;

args          = process.argv.slice(2);
preservedArgs = [].concat(args).slice(1)
parser        = new parseopts.Parser(opts);

parser.parse(args);

cmds = parser.cmds;
opts = parser.opts;

if (opts.version) {
  pineapple.logger.info(pineapple.VERSION);
  pineapple.die();
}

if (opts.env) {
  pineapple.config   = pineapple.utils.object.merge(pineapple.utils.appRequire('/config/environment'), pineapple.utils.appRequire('/config/' + opts.env));
}

if (! cmds.length || ! (cmds[0] in binCommands)) {
  cmds[0] = 'help';
}

cmd   = cmds.shift();
args  = cmds.length? cmds : preservedArgs;

pineapple.binNamespace = binNamespace;
pineapple.binCommands  = binCommands;

if (typeof (call = binCommands[cmd].call) === 'function') {
  if (binCommands[cmd].deps && binCommands[cmd].deps.length) {
    for (i = 0; i < binCommands[cmd].deps.length; i++) {
      if (typeof (func = binCommands[binCommands[cmd].deps[i]].call) === 'function') {
        func.apply(pineapple, args);
      }
    }
  }

  call.apply(pineapple, args);
}
else {
  pineapple.logger.error("Invalid command");
}