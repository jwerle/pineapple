module.exports.alias = ['help', 'h', 'usage', '?']

module.exports.help = function(help) {
  return help('help', "Display this message");
};

module.exports.call = function(arg) {
  var cmd, help, ns, bin
  
  bin   = this.bin
  ns    = this.namespace
  arg   = arg || "";
  help  = [
    "",
    "Usage".blue,
    ""
  ];


  if (typeof arg === 'string') {
    if (! (arg in bin)) {
      for (cmd in bin) {
        if (typeof bin[cmd].help === 'function') {
          help.push(bin[cmd].help(helpDialog));
        }
      }
    }
    else {
      if (typeof bin[arg].help === 'function') {
        help.push(bin[arg].help(helpDialog));
      }
    }

    console.log(help.join('\n'));
  }

  pineapple.die();
};

function helpDialog(name, usage) {
  return [
    [pineapple.namespace.cyan, name.green, "-", usage].join(' ')
  ].join('\n');
}