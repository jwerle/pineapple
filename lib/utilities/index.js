require('colors');

var readline  = require('readline')
  , fs        = require('fs')
  , utilities = require('utilities')
  , Loader    = require('./Loader').Loader
  , loader    = new Loader(__dirname)

module.exports = utilities.mixin(utilities, loader.load().utilities);

module.exports.noop       = function() {};
module.exports.returnMe   = function(){ return this; };
module.exports.makeArray  = function(object) {
  if (! object.length) {
    object.length = 0;

    for (var prop in object) {
      if (! isNaN(+prop)){
        ++object.length;
      }
    }
  }

  return [].map.call(object, function(v){ return v; });
};

module.exports.valueFromPath = function(path, object){ 
  return (new Function('o','return o' + path.replace(/\.?([a-z|0-9]+)\.?/gi,'["$1"]')))(object);
}

module.exports.parseStringVariables = function(string, vars) {
  var key

  for (key in vars) {
    string = string.replace('${' + key + '}', vars[key]); // Set the vars
  }

  string = string.replace(/(\$\{[a-z]+\})/gi,''); // Get rid of any undefined

  return string
}

module.exports.appRequire = function(path) {
  var msg = "Requiring app module ".cyan + path

  try {
    pineapple.logger.info(msg);
  }
  catch (e) {
    console.log(msg)
  }
  
  return require(APP_PATH + path);
}

module.exports.appStat = function(path) {
  if (APP_PATH !== PINEAPPLE_PATH) {
    return this.stat(APP_PATH + path);
  }
  else {
    return false;
  }
}

module.exports.CliInterface = function CliInterface(input, output, completetions) {
  var self = this

  this.input          = input;
  this.output         = output;
  this.completetions  = completetions || [];
  this.interface      = readline.createInterface({
    input     : this.input,
    output    : this.output,
    completer : (this.completetions.length? function(line) {
                    var completions = self.completions.map(function(v){ return "." + v })
                      , hits        = completions.filter(function(c) { return c.indexOf(line) == 0 })
                    
                    // show all completions if none found
                    return [hits.length ? hits : completions, line]
                  } 
                : false)
  });

  this.setPrompt = function(prompt) {
    this.interface.setPrompt(prompt, prompt.length || 0);

    return this;
  }

  this.question = function() {    
    this.interface.question.apply(this.interface, arguments);

    return this;
  }

  this.close = function() {
    this.interface.close();
    return this;
  }

  this.resume = function() {
    this.interface.resume();

    return this;
  }

  this.pause = function() {
    this.interface.pause();

    return this;
  }
};

module.exports.readline  = readline.createInterface({
  input   : process.stdin,
  output  : process.stdout
});