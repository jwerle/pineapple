var server
  , name
  , adapter
  , adapterType
  , port

port          = 4000;
Tests.console.puts("Using server port " + port + ".");

name          = "TestServer";
Tests.console.puts("Using server name " + name + ".");

adapterType   = "restify";
Tests.console.puts("Using adapter type " + adapterType + ".");

Tests.console.puts("Fetching adapter " + adapterType + ".");
adapter       = pineapple.server.adapters.getAdapter(adapterType);

Tests.console.puts("Testing integrity of adapter")
Tests.assert.ok(adapter, "Adapter " + adapterType + " not found!");

Tests.console.puts("Constructing Server instance.");
server = new pineapple.server.Server(name, adapterType, adapter);

Tests.console.puts("Testing integrity of Server instance.");
Tests.assert.ok(server instanceof pineapple.server.Server, "Server instance is not an instance of pineapple.server.Server!");
Tests.assert.strictEqual(server.name, name, "Server instance name was not properly set!");
Tests.assert.strictEqual(server.type, adapterType, "Server instance type was not properly set!");

Tests.console.puts("Attempting to run create() method on Server instance.");
server.create();

Tests.console.puts("Attempting to listen on port " + port + ".");
server.listen(port, function(){
  Tests.console.trace("Server listening on " + port);

  Tests.console.puts("Attempting to close connection.");
  server.close();

  Tests.success();
});