const TESTS_DIRECTORY = PINEAPPLE_PATH + '/test';

// We need global pineapple
require('./lib/pineapple');
require('colors');

var fs      = require('fs')
  , path    = require('path')
  , assert  = require('assert')
  , events  = require('events')

var createTestSuite
  , makeArray
  , prompt
  , trace
  , error
  , warn
  , puts
  , stat
  , die
  , noop

prompt    = "[pineapple-api-test] >".cyan;
makeArray = pineapple.utils.makeArray;
noop      = pineapple.utils.noop;

trace = function(){
  console.log.apply(console, [prompt].concat(makeArray(arguments)));
};

die = function(msg){
  error(msg, true);
};

error = function(msg, fatal){
  var args = makeArray(arguments)

  msg = (typeof msg === 'string' ? 
          msg.red :
          (typeof msg === 'object' ?
            (function(){ 
              msg.message = msg.stack? msg.stack.red : msg.message.red;
              return msg; 
            })() :
            msg));

  fatal && args.pop() && console.error.apply(console, [prompt].concat(args));
  fatal && process.exit(1);
};

warn = function(msg){
  trace(msg.yellow);
};

puts = function(msg){
  trace(msg.green);
};

success = function(msg){
  trace(msg.blue);
};

stat = function(){
  try {
    return fs.statSync.apply(fs, arguments);
  }
  catch(e) {
    return false;
  }
};

executeTest = function(test, tests){
  var directory, testDirectory

  directory      = TESTS_DIRECTORY + '/' + TEST_DIR;
  testDirectory  = directory + '/' + test + 'Test.js';
  if (stat(testDirectory)) {
    warn ("Executing " + test + " test -> " + testDirectory);
    try {
      Tests.once('test.success', function(){
        Tests.console.success("Successful test of the " + test + " module!");
        console.log('-------------------------------------------------------------------------------------------------------');

        if (tests && tests.length) {
          test = tests.shift();

          if (test) {
            executeTest(test);
          }
        }
      });

      Tests.once('test.error', function(message){
        throw new Tests.TestError(message);
      });

      require(testDirectory);
    }
    catch(e) {
      die(new Tests.TestError(e.message));
    }
  }
  else {
    die("No test case found for " + test);
  }

  return void 0;
};

createTestSuite = function(type){
  return task(type, function(){
    global.TEST_DIR = type;

    var args = pineapple.utils.makeArray(arguments)
    executeTest(args.shift(), args);
  });
}

/**
  @task default
**/
task('default', function(){
  
});

/**
  @namespace test
**/
namespace('test', function(){
  var self = this

  warn ("PINEAPPLE_PATH set as " + PINEAPPLE_PATH);

  task('all', function(){
    
  });

  /**
    @task utilities
  **/
  createTestSuite.call(this, 'utilities');

  /**
    @task model
  **/
  createTestSuite.call(this, 'model');

   /**
    @task server
  **/
  createTestSuite.call(this, 'server');
});

/**
  Tests SDK
**/
global.Tests   = new events.EventEmitter();
Tests.console  = {};
Tests.utils    = {};

Tests.TestError = pineapple.utils.inherit(Error, function(message){
  this.name     = "TestError";
  this.message  = message;
});

Tests.success = function(){
  return this.emit('test.success');
}

Tests.utils              = pineapple.utils;
Tests.utils.stat         = stat;
Tests.console.trace      = trace;
Tests.console.warn       = warn;
Tests.console.error      = error;
Tests.console.puts       = puts;
Tests.console.success    = success;
Tests.assert             = assert;