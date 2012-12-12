var Repl = require('repl-console')

module.exports.opts = [
  {full : 'file', abbr: 'f'}
];

module.exports.deps = ['server']

module.exports.call = function(){
  var args          = pineapple.utils.makeArray(arguments)

  pineapple.repl = new Repl(pineapple.app.name, 'local');
  pineapple.repl.assign(pineapple);

  pineapple.repl.start();
};

module.exports.help = function(help){
  return help("console", "[-f] Start a console with your Pineapple application");
};