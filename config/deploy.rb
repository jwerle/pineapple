# original script from:
# http://vasil-y.com/2012/10/10/capistrano-rails-bundler-rvm-unicorn-ec2/
#
# The commands defined in this file are general to all deploys. They use
# specific variables and commands defined in the individual scripts from:
# deploy/{production,staging,}.rb

# setup staging support
set :stages, %w(production staging)
set :default_stage, 'staging'
require 'capistrano/ext/multistage'

# general deploy setup
set :application,       'pineapple'
set :repository,        "git@github.com:moovatom/#{application}.git"
set :local_repository,  "~/repos/#{application}"
set :user,              'deploy'
set :keep_releases,     5
set :use_sudo,          false
set :scm,               :git
set :copy_exclude,      ['.DS_Store']
set :deploy_via,        :remote_cache

after   'deploy:restart', 'pineapple:update'

namespace :pineapple do
  task 'update' do
    run "echo '#{current_path}'; sudo npm install -g #{current_path}; cd #{current_path}; sudo ./scripts/update"
  end;
end;