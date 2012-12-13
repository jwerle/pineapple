module.exports.call = function() {
  var args = this.utils.makeArray(arguments)
    , arg  = args[0]
    , item = arg? this.package[arg] : this.package
    , value


  if (args.length > 1) {
    args = args.join('.');
  }
  else {
    args = arg;
  }
  
  if (item && args && args.length) {
    switch (typeof item) {
      default:
      case 'string':
        console.log(item.toString().green);
      break;

      case 'object':
        value = pineapple.utils.valueFromPath(args, this.package);
        console.log(typeof value !== 'object' && typeof value !== 'undefined'?
                      value.toString().green : 
                      (typeof value === 'object'? 
                        JSON.stringify(value).cyan :
                        JSON.stringify(this.package).blue));

      break;
    }
  }
  else {
    console.log(this.package);
  }
  
  pineapple.die();
};

module.exports.help = function(help) {
  return help('app', "Display package information for the application.");
};