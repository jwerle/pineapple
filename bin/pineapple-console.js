module.exports.opts = [
  {full : 'file', abbr: 'f'}
];

module.exports.deps = ['server']

module.exports.call = function(){
  var args          = pineapple.utils.makeArray(arguments)

  pineapple.console.logger.info("Starting pineapple console..");
  pineapple.console = pineapple.utils.object.merge(pineapple.console, console);
  pineapple.console.assign(pineapple);

  setTimeout(function(){
    pineapple.console.start();
  }, 0);
  
  pineapple.console.logger.success("Have fun!");
};

module.exports.help = function(help){
  return help("console", "[-f] Start a console with your Pineapple application");
};