# server
server 'moovdev', :app, :web, :db, :primary => true

# deployment path and branch
set :deploy_to, '/srv/www/api.v3.pineapple.com/'
set :branch, 'pineapple'
