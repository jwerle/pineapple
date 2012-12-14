var server = pineapple.loader.load(__dirname).server;

// 100s
server.CONINTUE                     = 100;
server.SWITCHING_PROTOCOLS          = 101;

// 200s
server.OK                           = 200;
server.CREATED                      = 201;
server.ACCEPTED                     = 202;
server.NO_CONTENT                   = 204;

// 300s
server.MOVED_PERMANENTLY            = 301;
server.FOUND                        = 302;
server.NOT_MODIFIED                 = 304;

// 400s
server.BAD_REQUEST                  = 400;
server.UNAUTHORIZED                 = 401;
server.FORBIDDEN                    = 403;
server.NOT_FOUND                    = 404;
server.METHOD_NOT_ALLOWED           = 405;
server.REQUEST_TIMEOUT              = 408;
server.CONFLICT                     = 409;
server.LENGTH_REQUIRED              = 411;
server.UNSUPPORTED_MEDIA_TYPE       = 415;
server.IM_A_TEAPOT                  = 418;
server.ENHANCE_YOUR_CALM            = 420;
server.LOCKED                       = 423;
server.TOO_MANY_REQUESTS            = 429;

// 500s
server.INTERNAL_SERVER_ERROR        = 500;
server.NOT_IMPLEMENTED              = 501;
server.BAD_GATEWAY                  = 502;
server.SERVICE_UNAVAILABLE          = 503;
server.GATEWAY_TIMEOUT              = 504;

// String headers
server.EXPECT_100_CONTINUE          = "100-continue";



module.exports = server;