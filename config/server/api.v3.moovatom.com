upstream node_api {
    server unix:/tmp/api.pineapple.socket fail_timeout=0;
}

server {
    server_name api.v3.pineapple.com;

    # pass the request to the node.js server with the correct headers
    # much more can be added, see nginx config options
    location / {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header X-NginX-Proxy true;

      proxy_pass http://node_api;
      proxy_redirect off;
    }
}
