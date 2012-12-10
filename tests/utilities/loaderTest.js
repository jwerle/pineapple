var path      = require('path')
  , Loader    = pineapple.utils.Loader
  , directory = path.join(PINEAPPLE_PATH, 'tests', TEST_DIR, 'loaderTestFiles')
  , loaded
  , mod
  , type
  , prop

Tests.console.puts("Instantiating loader.Loader prototype.");

loader = new Loader(directory, ['.js', '.json']);

Tests.console.puts("Executing load().");

loaded = loader.load().loaderTestFiles;

Tests.console.puts("Module load successful.");
Tests.console.puts("Inspecting modules..");

for (mod in loaded) {
  type = typeof loaded[mod];

  Tests.console.puts("Module " + mod + " is " + type);

  if (type === 'function') {
    Tests.console.puts("Module is a function, calling..");
    Tests.console.trace(mod + " -> " + loaded[mod]());
  }
  else if (type === 'object') {
    Tests.console.puts("Module is an object, enumerating..");

    for (prop in loaded[mod]) {
      if (typeof loaded[mod][prop] === 'function') {
        Tests.console.puts("Found function " + prop + " in " + mod + ", calling..");
        Tests.console.trace(loaded[mod][prop]());
      }
      else {
        Tests.console.puts("Found " + typeof loaded[mod][prop] + " " +  prop + " in " + mod)
        Tests.console.trace(loaded[mod][prop]);
      }
    }
  }
}

Tests.success();