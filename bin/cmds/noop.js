module.exports.alias = ['n', 'noop', 'nop', 'null', 'void']

module.exports.help = function(help) {
  return help("noop" , "A no operation command. This command doesn't exit, catch or throw exceptions, or log any output.");
}

module.exports.call = function() {
  pineapple.logger.info("No-operation.");
}