#!/usr/bin/env node
require('../lib/pineapple');
require('colors');

var opts, cmds, cmd, args, match, bin, binCommands, binNamespace, call
  , preservedArgs, exex, pwd

var parseopts = require('../deps/parseopts/lib/parseopts')

pwd           = process
exec          = require('child_process').exec;
binNamespace  = "pineapple";
binCommands   = {};
opts          = [];
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

// load app bin files
//bin           = pineapple.loader.load(__dirname, false, ['pineapple']).bin;

console.log(pineapple.appname)

args          = process.argv.slice(2);
preservedArgs = [].concat(args).slice(1)
parser        = new parseopts.Parser(opts);


parser.parse(args);

cmds = parser.cmds;
opts = parser.opts;

if (! cmds.length || ! (cmds[0] in binCommands)) {
  cmds[0] = 'help';
}

cmd   = cmds.shift();
args  = preservedArgs;

pineapple.binNamespace = binNamespace;
pineapple.binCommands  = binCommands;

if (typeof (call = binCommands[cmd].call) === 'function') {
  call.apply(pineapple, args);
}
else {
  console.error({message: "Invalid command"})
}