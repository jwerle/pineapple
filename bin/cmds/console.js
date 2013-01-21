module.exports.alias  = 'c'
module.exports.deps   = ['server']

module.exports.call = function(){
  var args          = pineapple.utils.makeArray(arguments)

  pineapple.console.logger.info("Starting pineapple console..");
  pineapple.console = pineapple.utils.object.merge(pineapple.console, console);
  pineapple.console.assign(pineapple);
  pineapple.console.assign(pineapple.models); // Lets provide models with the global scope too

  setTimeout(function(){
    pineapple.console.start();
  }, 100);
  
  pineapple.console.logger.success("Have fun!");
};

module.exports.help = function(help){
  return help("console", "Start a console with your Pineapple app");
};