require('pineapple');
// server config
var serverConfig = {
  port   : 4000, 
  config : { 
    name : "myService" 
  }
};

// we can create a server with minimal configuration
pineapple.api.create(serverConfig);

/**
 * In order for your server to work we will need some routers set up.
 * That can easily be achieved with pineapple's built in router.
 * 
 * The router supports basic POST, GET, PUT, and DELETE protocols via
 * convenience methods:
 *  router.post(uri_path, [controller_path|callback]); // POST
 *  router.get(uri_path, [controller_path|callback]); // GET
 *  router.put(uri_path, [controller_path|callback]); // PUT
 *  router.del(uri_path, [controller_path|callback]); // DELETE
 **/
// we need to create a router instance
var router = new pineapple.router.Router();

// lets get a "Hello world" going
router.get('/hello', function(request, response){
  // if it isn't a valid request..
  if (! request) {
    return;
  }
  
  // output some sanity
  pineapple.api.logger.success("Got the request, emitting response..");

  // response with a json response
  response.json(pineapple.server.OK, new pineapple.server.http.JSONResponse(pineapple.server.OK, {
    message  : "Hello world! I'm a pineapple api server."
  }));

  // Got the request now close the connection
  pineapple.api.logger.warn("Closing connection..");

  // close the connection
  pineapple.api.close();

  // warn pineapples departure
  pineapple.logger.warn("Exiting pineapple..");

  // exit..
  // you never really have to call .exit() directly..
  pineapple.exit();
});

// we need to bind the routes we just created to the server
pineapple.api.bindRoutes(router.routes);

// once all is said and done, we can finally start the server
// the .listen() method accept a port and a callback for arguments
pineapple.api.listen(serverConfig.port, function(){
  // tap into pineapples api logger
  pineapple.api.logger.info("Connected! =)");
});