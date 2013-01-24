module.exports.alias = ['n', 'noop', 'nop', 'void']

module.exports.help = function(help) {
  return help("noop [n|nop|void]" , "A no operation command. This command doesn't exit, catch or throw exceptions, or log any output.");
}

module.exports.call = function() {
  pineapple.logger.info("No-operation.");
}