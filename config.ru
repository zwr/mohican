# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)

require 'rack/reverse_proxy'
# require 'rack/rewrite'

# original_host_locator = "localhost:#{Rails::Server.new.options[:Port]}"
celesta_host_name = ENV['CELESTA_HOST']

if celesta_host_name
  target = "http://#{celesta_host_name}/Celesta/z/activities"
  puts "Diverting /activities to #{target}"

  use Rack::ReverseProxy do
    # Set :preserve_host to true globally (default is true already)
    reverse_proxy_options preserve_host: true

    # Forward the path /activites* to target
    reverse_proxy /^\/activities(.*)$/, "#{target}$1"
  end
end

run Rails.application
