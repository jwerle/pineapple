module.exports.call = function(arg) {
  var cmd, help, ns
  
  ns    = this.binNamespace
  help  = [
    "Usage".blue,
    ""
  ];

  if (! (arg in this.binCommands)) {
    for (cmd in this.binCommands) {
      if (typeof this.binCommands[cmd].help === 'function') {
        help.push(this.binCommands[cmd].help(helpDialog));
      }
    }
  }
  else {
    if (typeof this.binCommands[arg].help === 'function') {
      help.push(this.binCommands[arg].help(helpDialog));
    }
  }

  console.log(help.join('\n'));
};

module.exports.help = function(help) {
  return help('help', "Display this message");
};

function helpDialog(name, usage) {
  return [
    [pineapple.binNamespace.cyan, name.green, "-", usage].join(' ')
  ].join('\n');
}